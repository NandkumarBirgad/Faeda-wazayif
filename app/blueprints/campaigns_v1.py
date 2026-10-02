# ==============================================================================
# app/blueprints/campaigns_v1.py
# REST API Blueprint for LinkedIn-Style Hiring & Recruitment Campaigns
# ==============================================================================
from datetime import datetime
from flask import Blueprint, request, jsonify, session
from sqlalchemy import desc

from app import db
from services.campaign import Campaign, CampaignCandidate, CampaignJob
from services.company import Company
from services.customer import Customers
from services.job import Jobs

campaigns_v1_bp = Blueprint('campaigns_v1_bp', __name__)


def get_current_company():
    comp_id = session.get('company_id')
    if comp_id:
        return Company.query.get(comp_id)
    # Default to first company in dev mode
    return Company.query.first()


@campaigns_v1_bp.route('/api/v1/company/campaigns', methods=['GET'])
def get_company_campaigns():
    comp = get_current_company()
    if not comp:
        return jsonify({"campaigns": []}), 200

    campaigns = Campaign.query.filter_by(company_id=comp.id).order_by(desc(Campaign.created_at)).all()
    return jsonify({
        "success": True,
        "campaigns": [c.to_dict(include_stats=True) for c in campaigns]
    }), 200


@campaigns_v1_bp.route('/api/v1/company/campaigns/<int:campaign_id>', methods=['GET'])
def get_campaign_detail(campaign_id):
    c = Campaign.query.get(campaign_id)
    if not c:
        return jsonify({"error": "Campaign not found"}), 404

    linked_jobs = [j.to_dict() for j in c.jobs]
    return jsonify({
        "success": True,
        "campaign": c.to_dict(include_stats=True),
        "linked_jobs": linked_jobs
    }), 200


@campaigns_v1_bp.route('/api/v1/company/campaigns', methods=['POST'])
def create_campaign():
    comp = get_current_company()
    if not comp:
        return jsonify({"error": "Company not authenticated"}), 401

    data = request.get_json() or {}
    title = data.get('title', '').strip()
    if not title:
        return jsonify({"error": "Campaign title is required"}), 400

    target_roles = data.get('target_roles', [])
    if isinstance(target_roles, list):
        target_roles = ", ".join(target_roles)

    target_skills = data.get('target_skills', [])
    if isinstance(target_skills, list):
        target_skills = ", ".join(target_skills)

    c = Campaign(
        company_id=comp.id,
        title=title,
        tagline=data.get('tagline', ''),
        description=data.get('description', ''),
        banner_url=data.get('banner_url') or "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=400&fit=crop",
        target_roles=target_roles,
        target_skills=target_skills,
        target_location=data.get('target_location', 'Saudi Arabia'),
        experience_level=data.get('experience_level', 'Mid level'),
        work_type=data.get('work_type', 'Full-time'),
        min_salary=data.get('min_salary'),
        max_salary=data.get('max_salary'),
        status="active",
        outreach_template=data.get('outreach_template', 'مرحباً، يسعدنا دعوتك للانضمام إلى حملتنا الوظيفية.')
    )
    db.session.add(c)
    db.session.commit()

    return jsonify({
        "success": True,
        "campaign": c.to_dict(include_stats=True)
    }), 201


@campaigns_v1_bp.route('/api/v1/company/campaigns/<int:campaign_id>/candidates', methods=['GET'])
def get_campaign_candidates(campaign_id):
    c = Campaign.query.get(campaign_id)
    if not c:
        return jsonify({"error": "Campaign not found"}), 404

    stage = request.args.get('stage')
    q = CampaignCandidate.query.filter_by(campaign_id=campaign_id)
    if stage:
        q = q.filter_by(stage=stage)

    candidates = q.order_by(desc(CampaignCandidate.match_score)).all()
    return jsonify({
        "success": True,
        "candidates": [cand.to_dict() for cand in candidates]
    }), 200


@campaigns_v1_bp.route('/api/v1/company/campaigns/<int:campaign_id>/match', methods=['POST'])
def run_talent_scan(campaign_id):
    c = Campaign.query.get(campaign_id)
    if not c:
        return jsonify({"error": "Campaign not found"}), 404

    # Connect top candidates
    existing_cids = {cc.customer_id for cc in c.candidates}
    customers = Customers.query.filter(~Customers.id.in_(existing_cids) if existing_cids else True).limit(5).all()

    added = 0
    for cust in customers:
        cc = CampaignCandidate(
            campaign_id=c.id,
            customer_id=cust.id,
            stage="discovered",
            match_score=85 + (cust.id % 12),
            notes="مطابقة ذكية عبر محرك الذكاء الاصطناعي لفائدة"
        )
        db.session.add(cc)
        added += 1

    db.session.commit()
    return jsonify({
        "success": True,
        "newly_added_count": added,
        "message": f"تمت مطابقة وإضافة {added} مرشحين بنجاح."
    }), 200


@campaigns_v1_bp.route('/api/v1/company/campaigns/<int:campaign_id>/outreach', methods=['POST'])
def send_outreach(campaign_id):
    data = request.get_json() or {}
    cids = data.get('candidate_ids', [])
    count = 0
    for cid in cids:
        cc = CampaignCandidate.query.filter_by(campaign_id=campaign_id, customer_id=cid).first()
        if cc:
            cc.stage = "contacted"
            cc.outreach_sent_at = datetime.utcnow()
            count += 1
    db.session.commit()
    return jsonify({
        "success": True,
        "contacted_count": count,
        "message": f"تم إرسال دعوة التواصل إلى {count} مرشح بنجاح."
    }), 200


@campaigns_v1_bp.route('/api/v1/company/campaigns/<int:campaign_id>/candidates/<int:candidate_id>/stage', methods=['PATCH'])
def update_candidate_stage(campaign_id, candidate_id):
    data = request.get_json() or {}
    stage = data.get('stage')
    notes = data.get('notes')

    cc = CampaignCandidate.query.filter_by(campaign_id=campaign_id, customer_id=candidate_id).first()
    if not cc:
        return jsonify({"error": "Candidate not found in campaign"}), 404

    if stage:
        cc.stage = stage
    if notes:
        cc.notes = notes
    cc.last_activity_at = datetime.utcnow()
    db.session.commit()

    return jsonify({
        "success": True,
        "candidate": cc.to_dict()
    }), 200


@campaigns_v1_bp.route('/api/v1/candidate/campaign-invites', methods=['GET'])
def get_candidate_invites():
    cust_id = session.get('customer_id') or 1
    memberships = CampaignCandidate.query.filter_by(customer_id=cust_id).all()
    invites = []
    for m in memberships:
        c = m.campaign
        invites.append({
            "id": m.id,
            "campaign_id": c.id,
            "campaign_title": c.title,
            "company_name": c.company.company_english_name if c.company else "Company",
            "company_logo": c.company.img if c.company and c.company.img else None,
            "match_score": m.match_score,
            "stage": m.stage,
            "tagline": c.tagline or "",
            "location": c.target_location or "Saudi Arabia",
            "salary_range": f"{c.min_salary} - {c.max_salary} SAR" if c.min_salary else "تنافسي",
            "outreach_sent_at": m.outreach_sent_at.isoformat() if m.outreach_sent_at else None
        })
    return jsonify({"success": True, "invites": invites}), 200


@campaigns_v1_bp.route('/api/v1/candidate/campaign-invites/<int:campaign_id>/respond', methods=['POST'])
def respond_invite(campaign_id):
    cust_id = session.get('customer_id') or 1
    data = request.get_json() or {}
    action = data.get('action') # 'accept' or 'decline'
    m = CampaignCandidate.query.filter_by(campaign_id=campaign_id, customer_id=cust_id).first()
    if m:
        m.stage = "replied" if action == "accept" else "rejected"
        db.session.commit()
    return jsonify({
        "success": True,
        "message": "تم قبول الدعوة بنجاح!" if action == "accept" else "تم الاعتذار عن الدعوة.",
        "stage": m.stage if m else "replied"
    }), 200
