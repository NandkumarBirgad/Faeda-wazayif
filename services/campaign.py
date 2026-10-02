# ==============================================================================
# services/campaign.py
# ==============================================================================
# Domain Models for LinkedIn-Style Hiring & Recruitment Campaigns
# ==============================================================================

from datetime import datetime
from app import db


class Campaign(db.Model):
    __tablename__ = 'campaigns'

    id = db.Column(db.Integer, primary_key=True)
    company_id = db.Column(db.Integer, db.ForeignKey('company.id'), nullable=False)
    
    title = db.Column(db.String(255), nullable=False)
    tagline = db.Column(db.String(255), nullable=True)
    description = db.Column(db.Text, nullable=True)
    banner_url = db.Column(db.String(500), nullable=True)
    
    target_roles = db.Column(db.String(255), nullable=True)
    target_skills = db.Column(db.Text, nullable=True)
    target_location = db.Column(db.String(100), nullable=True)
    experience_level = db.Column(db.String(50), nullable=True)
    work_type = db.Column(db.String(50), default="Full-time")
    min_salary = db.Column(db.Integer, nullable=True)
    max_salary = db.Column(db.Integer, nullable=True)
    
    status = db.Column(db.String(50), default='active')
    outreach_template = db.Column(db.Text, nullable=True)
    
    start_date = db.Column(db.DateTime, default=datetime.utcnow)
    end_date = db.Column(db.DateTime, nullable=True)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    company = db.relationship('Company', backref=db.backref('campaigns', lazy='dynamic', cascade='all, delete-orphan'))
    candidates = db.relationship('CampaignCandidate', backref='campaign', lazy='dynamic', cascade='all, delete-orphan')
    jobs = db.relationship('CampaignJob', backref='campaign', lazy='dynamic', cascade='all, delete-orphan')

    def to_dict(self, include_stats=True):
        data = {
            "id": self.id,
            "company_id": self.company_id,
            "company_name": self.company.company_english_name if self.company else "Company",
            "company_arabic_name": self.company.company_arabic_name if self.company else "الشركة",
            "company_logo": self.company.img if self.company and self.company.img else None,
            "title": self.title,
            "tagline": self.tagline,
            "description": self.description,
            "banner_url": self.banner_url,
            "target_roles": [r.strip() for r in (self.target_roles or "").split(",") if r.strip()],
            "target_skills": [s.strip() for s in (self.target_skills or "").split(",") if s.strip()],
            "target_location": self.target_location,
            "experience_level": self.experience_level,
            "work_type": self.work_type,
            "min_salary": self.min_salary,
            "max_salary": self.max_salary,
            "status": self.status,
            "outreach_template": self.outreach_template,
            "start_date": self.start_date.isoformat() if self.start_date else None,
            "end_date": self.end_date.isoformat() if self.end_date else None,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
        if include_stats:
            total_talent = self.candidates.count()
            contacted = self.candidates.filter(CampaignCandidate.stage != 'discovered').count()
            replied = self.candidates.filter(CampaignCandidate.stage.in_(['replied', 'interviewing', 'offered', 'hired'])).count()
            interviewing = self.candidates.filter_by(stage='interviewing').count()
            hired = self.candidates.filter_by(stage='hired').count()
            response_rate = round((replied / contacted * 100), 1) if contacted > 0 else 0
            
            data["stats"] = {
                "total_talent": total_talent,
                "contacted": contacted,
                "replied": replied,
                "interviewing": interviewing,
                "hired": hired,
                "response_rate": response_rate,
            }
        return data


class CampaignCandidate(db.Model):
    __tablename__ = 'campaign_candidates'

    id = db.Column(db.Integer, primary_key=True)
    campaign_id = db.Column(db.Integer, db.ForeignKey('campaigns.id'), nullable=False)
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.id'), nullable=False)
    
    stage = db.Column(db.String(50), default='discovered')
    match_score = db.Column(db.Integer, default=85)
    notes = db.Column(db.Text, nullable=True)
    outreach_sent_at = db.Column(db.DateTime, nullable=True)
    last_activity_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    customer = db.relationship('Customers', backref=db.backref('campaign_memberships', lazy='dynamic'))

    def to_dict(self):
        c = self.customer
        skills_list = [s.skill_name for s in (c.skills or [])] if c and hasattr(c, 'skills') else []
        return {
            "id": self.id,
            "campaign_id": self.campaign_id,
            "customer_id": self.customer_id,
            "match_score": self.match_score,
            "stage": self.stage,
            "notes": self.notes,
            "outreach_sent_at": self.outreach_sent_at.isoformat() if self.outreach_sent_at else None,
            "last_activity_at": self.last_activity_at.isoformat() if self.last_activity_at else None,
            "candidate": {
                "id": c.id if c else self.customer_id,
                "user_id": c.user_id if c else None,
                "fullname": c.fullname if c else "Candidate",
                "email": c.email if c else None,
                "mobile": c.mobile if c else None,
                "img": c.img if c and c.img else None,
                "title": c.preferred_field_of_work or (c.about[:60] if c and c.about else "Professional"),
                "location": c.government or c.country or "Saudi Arabia" if c else "Saudi Arabia",
                "years_of_experience": c.years_of_skills or "2+" if c else "2+",
                "skills": skills_list[:8],
                "expected_salary": c.expected_salary if c else None,
                "is_verified": bool(c.is_verified) if c else False,
            }
        }


class CampaignJob(db.Model):
    __tablename__ = 'campaign_jobs'

    id = db.Column(db.Integer, primary_key=True)
    campaign_id = db.Column(db.Integer, db.ForeignKey('campaigns.id'), nullable=False)
    job_id = db.Column(db.Integer, db.ForeignKey('jobs.id'), nullable=False)

    job = db.relationship('Jobs', backref=db.backref('campaign_links', lazy='dynamic'))

    def to_dict(self):
        j = self.job
        return {
            "id": self.id,
            "job_id": self.job_id,
            "title": j.job_title if j else "Job",
            "location": j.location if j else "",
            "work_type": j.work_type if j else "",
            "salary": f"{j.min_salary} - {j.max_salary} SAR" if j and j.min_salary else None,
        }
