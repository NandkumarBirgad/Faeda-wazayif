# ==============================================================================
# الوظيفة الأساسية للملف: وحدة (Blueprint) للمسارات الأساسية والعامة في الموقع.
# الروابط أو الميزات: مسار الصفحة الرئيسية (/) ومسارات الصفحات العامة الأخرى.
# المتطلبات الخاصة: يعتمد على دوال render_template لعرض قوالب HTML.
# ==============================================================================
import os
import json
from flask import Blueprint, render_template, jsonify, current_app, request, flash, redirect, url_for, session
from app import db
from services.ticket import Ticket

# Create a Blueprint named 'core'
core_bp = Blueprint('core', __name__)

@core_bp.route('/')
def home():
    """Clean API gateway / SPA root handler."""
    base_dir = os.path.abspath(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
    frontend_dist = os.path.join(base_dir, 'frontend', 'dist')
    if os.path.exists(os.path.join(frontend_dist, 'index.html')):
        from flask import send_from_directory
        return send_from_directory(frontend_dist, 'index.html')
    return jsonify({
        "service": "Faeda Jobs REST API Engine",
        "status": "online",
        "version": "1.0",
        "message": "Faeda Jobs API backend is running. Access the application via your React frontend portal."
    })


@core_bp.route('/news')
def news():
    """
    Render the news feed page containing mock posts, trending topics, 
    and suggested profiles to follow.
    """
    mock_posts = [
        {
            "id": 1,
            "user": {
                "name": "Ahmed Al-Farsi",
                "title": "Senior Product Designer at Google",
                "avatar": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop",
                "isVerified": True
            },
            "content": "Just published a new guide on how to optimize your resume for ATS systems in Saudi Arabia! 🇸🇦 The landscape is changing rapidly with AI screening. Make sure your keywords are perfectly aligned with the job description.\n\nKey takeaways:\n1. Avoid complex formatting\n2. Use standard job titles\n3. Quantify your achievements\n\nWhat's your biggest struggle with resume writing?",
            "image": "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&h=400&fit=crop",
            "time": "2h ago",
            "likes": 1245,
            "comments": 84,
            "reposts": 32,
            "isLiked": False
        },
        {
            "id": 2,
            "user": {
                "name": "Sarah Chen",
                "title": "Talent Acquisition Lead at Aramco",
                "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
                "isVerified": True
            },
            "content": "We are actively hiring for our new AI Research division in Dhahran! 🚀\n\nLooking for:\n- Senior ML Engineers\n- Data Scientists\n- AI Product Managers\n\nIf you're passionate about pushing the boundaries of technology in the energy sector, let's connect. Drop a comment below or send me your resume directly through the Faeda platform.",
            "time": "5h ago",
            "likes": 3421,
            "comments": 215,
            "reposts": 412,
            "isLiked": True
        }
    ]

    trending_topics = [
        {"id": 1, "title": "#SaudiVision2030", "posts": "45.2K posts"},
        {"id": 2, "title": "AI in Recruitment", "posts": "12.5K posts"},
        {"id": 3, "title": "Remote Work in MENA", "posts": "8.2K posts"}
    ]

    suggested_people = [
        {"id": 1, "name": "Dr. Khalid", "title": "AI Researcher", "avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"},
        {"id": 2, "name": "Reem Fahad", "title": "HR Director", "avatar": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop"}
    ]

    return render_template('new_design/news.html', posts=mock_posts, trending_topics=trending_topics, suggested_people=suggested_people)


@core_bp.route('/support')
def support():
    return render_template('new_design/support.html')

@core_bp.route('/support/ticket', methods=['GET', 'POST'])
def support_ticket():
    if request.method == 'POST':
        email = request.form.get('email')
        subject = request.form.get('subject')
        description = request.form.get('description')
        
        if not all([email, subject, description]):
            flash('يرجى ملء جميع الحقول المطلوبة', 'error')
            return redirect(url_for('core.support_ticket'))
            
        new_ticket = Ticket(email=email, subject=subject, description=description)
        db.session.add(new_ticket)
        db.session.commit()
        
        flash('تم إرسال تذكرتك بنجاح، سيقوم الدعم الفني بالتواصل معك قريباً ويمكنك متابعتها باستخدام بريدك الإلكتروني.', 'success')
        # Clear suspension session data if exists
        session.pop('suspended_email', None)
        session.pop('suspension_reason', None)
        return redirect(url_for('core.home'))
        
    return render_template('new_design/ticket_form.html')

@core_bp.route('/support/track', methods=['GET', 'POST'])
def track_ticket():
    tickets = None
    if request.method == 'POST':
        email = request.form.get('email')
        
        if email:
            tickets = Ticket.query.filter_by(email=email).order_by(Ticket.created_at.desc()).all()
            if not tickets:
                flash('لم يتم العثور على أي تذاكر مرتبطة بهذا البريد الإلكتروني.', 'error')
        else:
            flash('يرجى إدخال البريد الإلكتروني.', 'error')
            
    return render_template('new_design/track_ticket.html', tickets=tickets)

@core_bp.route('/report', methods=['POST'])
def submit_report():
    from services.report import Report
    target_type = request.form.get('target_type')
    target_id = request.form.get('target_id')
    reason = request.form.get('reason')
    description = request.form.get('description')
    
    reporter_type = None
    reporter_id = None
    
    if session.get('session_customer'):
        reporter_type = 'customer'
        reporter_id = session.get('user_id')
    elif session.get('session_company'):
        reporter_type = 'company'
        reporter_id = session.get('company_id')
        
    if not reporter_type:
        flash('يجب تسجيل الدخول لتقديم بلاغ.', 'error')
        return redirect(request.referrer or url_for('core.home'))
        
    new_report = Report(
        reporter_type=reporter_type,
        reporter_id=reporter_id,
        target_type=target_type,
        target_id=target_id,
        reason=reason,
        description=description
    )
    db.session.add(new_report)
    db.session.commit()
    
    flash('تم إرسال البلاغ بنجاح وهو بانتظار المراجعة.', 'success')
    return redirect(request.referrer or url_for('core.home'))

@core_bp.route('/suspended')
def suspended_account():
    email = session.get('suspended_email')
    reason = session.get('suspension_reason')
    
    if not email:
        return redirect(url_for('customer.login'))
        
    return render_template('new_design/suspended.html', email=email, reason=reason)


@core_bp.route('/faeda-details')
def faeda_details():
    return render_template('new_design/faeda_details.html')

@core_bp.route('/api/countries')
def api_countries():
    file_path = os.path.join(current_app.root_path, '..', 'data', 'countries.json')
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            countries = json.load(f)
        return jsonify(countries)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@core_bp.route('/api/cities/<country>')
def api_cities(country):
    file_path = os.path.join(current_app.root_path, '..', 'data', 'cities.json')
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            cities_data = json.load(f)
        cities = cities_data.get(country, [])
        return jsonify(cities)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ==============================================================================
# JSON REST API ENDPOINTS FOR FRONTEND PUBLIC TEAMS MARKETPLACE
# ==============================================================================

def extract_team_capabilities(t):
    caps = []
    if t.special_program:
        parts = [p.strip() for p in t.special_program.replace('،', ',').split(',') if p.strip()]
        caps.extend(parts)
    if t.semi_special_program and t.semi_special_program not in caps:
        caps.append(t.semi_special_program)
    if t.general_program and t.general_program not in caps:
        caps.append(t.general_program)
    return caps[:8]


def serialize_team_summary(t):
    from services.teams import Teams
    capabilities = extract_team_capabilities(t)
    member_count = len(t.members) if t.members else 0

    return {
        "id": str(t.id),
        "name": t.team_name,
        "about": t.about or "",
        "achievements": t.achievements or "",
        "generalProgram": t.general_program,
        "semiSpecialProgram": t.semi_special_program,
        "specialProgram": t.special_program,
        "logoUrl": t.img if t.img else None,
        "memberCount": member_count,
        "capabilities": capabilities,
        "location": "الرياض" if not t.members else (t.members[0].government or "السعودية"),
        "isRemote": True,
        "creationDate": t.creation_date.isoformat() if t.creation_date else None,
    }


def serialize_team_detail(t):
    from app.blueprints.jobs import serialize_job_summary
    base = serialize_team_summary(t)

    public_members = []
    if t.members:
        for m in t.members:
            public_members.append({
                "id": str(m.id),
                "name": m.fullname,
                "role": m.preferred_field_of_work or m.about or "عضو فريق",
                "avatarUrl": m.img if m.img else None,
                "skills": [m.preferred_field_of_work] if m.preferred_field_of_work else [],
            })

    associated_jobs = []
    if t.jobs:
        associated_jobs = [serialize_job_summary(j) for j in t.jobs if j.status == 'approved']

    return {
        **base,
        "members": public_members,
        "jobs": associated_jobs,
    }


@core_bp.route('/api/v1/teams/suggestions')
def api_get_team_suggestions():
    from services.teams import Teams
    q = request.args.get('q', '').strip()

    if not q or len(q) < 2:
        return jsonify({"suggestions": []})

    teams = Teams.query.filter(
        db.or_(
            Teams.team_name.ilike(f"%{q}%"),
            Teams.about.ilike(f"%{q}%"),
            Teams.general_program.ilike(f"%{q}%"),
            Teams.special_program.ilike(f"%{q}%")
        )
    ).limit(8).all()

    suggestions = []
    for t in teams:
        caps = extract_team_capabilities(t)
        sub = caps[0] if caps else "فريق تخصصي"
        suggestions.append({
            "id": str(t.id),
            "label": t.team_name,
            "subLabel": sub,
            "category": "فريق",
            "value": t.team_name,
            "location": "السعودية",
        })

    return jsonify({"suggestions": suggestions})


@core_bp.route('/api/v1/teams')
def api_get_teams():
    from services.teams import Teams
    q = request.args.get('q', '').strip()
    location = request.args.get('location', '').strip()
    page = int(request.args.get('page', 1))
    page_size = int(request.args.get('page_size', 10))

    query = Teams.query

    if q:
        query = query.filter(
            db.or_(
                Teams.team_name.ilike(f"%{q}%"),
                Teams.about.ilike(f"%{q}%"),
                Teams.general_program.ilike(f"%{q}%"),
                Teams.semi_special_program.ilike(f"%{q}%"),
                Teams.special_program.ilike(f"%{q}%"),
                Teams.achievements.ilike(f"%{q}%")
            )
        )

    paginated = query.order_by(Teams.id.desc()).paginate(page=page, per_page=page_size, error_out=False)

    return jsonify({
        "teams": [serialize_team_summary(t) for t in paginated.items],
        "total": paginated.total,
        "page": paginated.page,
        "pageSize": paginated.per_page,
        "totalPages": paginated.pages,
    })


@core_bp.route('/api/v1/teams/<int:team_id>')
def api_get_team_detail(team_id):
    from services.teams import Teams
    t = Teams.query.get(team_id)
    if not t:
        return jsonify({"message": "الفريق غير موجود"}), 404

    return jsonify(serialize_team_detail(t))


@core_bp.route('/api/v1/contact', methods=['POST'])
def api_submit_contact():
    data = request.get_json() or request.form
    name = (data.get('name') or '').strip()
    email = (data.get('email') or '').strip()
    reason = (data.get('reason') or '').strip()
    message = (data.get('message') or data.get('description') or '').strip()

    if not email or not message:
        return jsonify({"success": False, "message": "يرجى ملء جميع الحقول المطلوبة (البريد والرسالة)"}), 400

    subject_text = f"[{reason}] {name}" if (reason and name) else (reason or name or "استفسار جديد عبر الموقع")

    try:
        new_ticket = Ticket(email=email, subject=subject_text, description=message)
        db.session.add(new_ticket)
        db.session.commit()
        return jsonify({"success": True, "message": "تم استلام رسالتك بنجاح. شكرًا لتواصلك معنا."})
    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "message": "تعذر إرسال الرسالة حالياً. حاول مرة أخرى."}), 500


# ── Career Articles & Insights REST Endpoints ────────────────────────────────
CAREER_POSTS_DATA = [
    {
        "id": 1,
        "title": "دليلك الشامل لاجتياز أنظمة الفرز الذكي (ATS) والوصول إلى المقابلات الشخصية",
        "slug": "ats-resume-optimization-guide-2026",
        "summary": "كيف تصيغ سيرتك الذاتية بلغة تفهمها خوارزميات الذكاء الاصطناعي ومسؤولو التوظيف في السوق السعودي؟ 5 استراتيجيات عملية معتمدة.",
        "content": """تعتمد اليوم أكثر من 85% من كبرى الشركات السعودية والدولية على أنظمة التتبع الآلي للمرشحين (ATS). وظيفة هذه الأنظمة هي فلترة مئات السير الذاتية وفرزها تلقائياً قبل أن تصل إلى عين مسؤول الموارد البشرية.

### 1. ابتعد عن التنسيقات المعقدة والجداول
العديد من الباحثين عن عمل يستخدمون قوالب مليئة بالجداول، الرسوم البيانية والأعمدة المزدوجة ظناً منهم أنها أكثر جاذبية. الحقيقة أن معظم محركات ATS تفشل في قراءة النصوص داخل الجداول أو الصور.
- استخدم قالباً أحادي العمود بخطوط نظامية واضحة (مثل Cairo أو Calibri).
- تجنب وضع بيانات الاتصال في الترويسة (Header) أو التذييل (Footer).

### 2. التوافق الدلالي مع الكلمات المفتاحية
لا تكتفِ بوضع قائمة مهارات عامة؛ بل ادرس الوصف الوظيفي بدقة.
- إذا طلبت الشركة "PostgreSQL" و "FastAPI"، احرص على ورود هذه المصطلحات حرفياً في سياق مشاريعك السابقة.
- ادمج المهارات داخل إنجازاتك الواقعية، ولا تتركها مجرد قائمة منفصلة.

### 3. صياغة الإنجازات بنموذج STAR والنتائج الرقمية
بدلاً من كتابة "مسؤول عن تطوير الواجهات"، اكتب:
> "قمت بإعادة بناء واجهة المستخدم باستخدام React و TypeScript مما أدى إلى خفض زمن التحميل بنسبة 40% وزيادة معدل التحويل 18%."
الأرقام والنسب هي لغة يثق بها مسؤولو التوظيف وتبرز قيمتك السوقية المضافة.

### 4. حفظ الملف بالصيغة المثلى
دائماً احفظ ملف سيرتك بصيغة PDF قابلة للنسخ النصي (Selectable Text)، وتأكد من أن حجم الملف لا يتجاوز 2 ميجابايت.""",
        "category": "السير الذاتية وATS",
        "tags": ["ATS", "السيرة الذاتية", "التوظيف", "الذكاء الاصطناعي"],
        "coverImage": "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=1200&h=600&fit=crop",
        "publishedAt": "2026-09-24T10:00:00Z",
        "readTime": "5 دقائق",
        "views": 3840,
        "likes": 428,
        "isLiked": False,
        "author": {
            "name": "أحمد الفارسي",
            "title": "خبير استقطاب المواهب التقنية | مستشار مهني",
            "avatar": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop",
            "isVerified": True,
            "username": "ahmed-alfarsi"
        },
        "comments": [
            {
                "id": 101,
                "author": "سارة القحطاني",
                "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
                "text": "مقال دقيق وواقعي جداً! بالفعل واجهت رفضاً آلياً سابقاً واكتشفت أن القالب ثنائي الأعمدة كان السبب.",
                "time": "منذ يومين"
            },
            {
                "id": 102,
                "author": "خالد بن عبد الرحمن",
                "avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
                "text": "صياغة الإنجازات الرقمية باستخدام نموذج STAR أحدثت فرقاً جذرياً في عدد المقابلات التي تلقيتها.",
                "time": "منذ يوم"
            }
        ]
    },
    {
        "id": 2,
        "title": "القيمة السوقية والتفاوض على الرواتب: دليلك لعرض وظيفي عادل في 2026",
        "slug": "salary-negotiation-market-value-2026",
        "summary": "فهم معايير تسعير الكفاءات في السوق السعودي، وكيف تستند على مؤشرات حقيقية لحساب قيمتك السوقية وبناء موقف تفاوضي قوي.",
        "content": """كثير من المهنيين يتفاجؤون عندما يُطلب منهم تحديد "الراتب المتوقع" أثناء المقابلة الأولى. الإجابة العشوائية إما أن تحرمك من عرض مستحق أو تستبعدك مبكراً.

### معايير تحديد القيمة السوقية في السوق السعودي
لا يقاس الراتب بسنوات الخبرة المجردة فقط، بل بعدة محاور متداخلة:
1. **الندرة التقنية ومستوى التخصص**: المهارات المرتبطة بهندسة البيانات الضخمة، والذكاء الاصطناعي التوليدي، وتطوير البنية التحتية السحابية تشهد طلباً يفوق المعروض.
2. **الأثر المالي المباشر**: قدرتك على تسريع تسليم المشاريع أو خفض التكاليف التشغيلية.
3. **حجم واستقرار المنشأة**: الشركات التقنية الناشئة قد تقدم حصصاً أو مرونة أعلى، بينما المؤسسات الكبرى والبنوك تقدم حزم بدلات شاملة (سكن، تعليم، تأمين لكبار الشخصيات).

### استراتيجية التفاوض المستندة للبيانات
- لا تذكر رقماً منفرداً؛ اعرض نطاقاً سعرياً (Range) يعتمد على المسؤوليات ونظام العمل (حضوري أو عن بعد).
- اطلب مهلة 24-48 ساعة لدراسة العرض المالي وتفاصيل المزايا قبل الرد الرسمي.
- تفاوض على الحزمة ككل: الراتب الأساسي، ساعات العمل المرنة، ميزانية التدريب والتطوير، وبونص الأداء السنوي.""",
        "category": "السوق والرواتب",
        "tags": ["الرواتب", "التفاوض", "القيمة السوقية", "سوق العمل السعودي"],
        "coverImage": "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1200&h=600&fit=crop",
        "publishedAt": "2026-09-22T14:30:00Z",
        "readTime": "6 دقائق",
        "views": 4920,
        "likes": 612,
        "isLiked": True,
        "author": {
            "name": "سارة الغامدي",
            "title": "رئيسة قسم استقطاب المواهب التنفيذية | مستشارة موارد بشرية",
            "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
            "isVerified": True,
            "username": "sara-alghamdi"
        },
        "comments": [
            {
                "id": 201,
                "author": "تركي العتيبي",
                "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
                "text": "التفاوض على باقة المزايا ككل وليس الراتب الأساسي فقط نقطة محورية يغفل عنها الكثيرون.",
                "time": "منذ 3 أيام"
            }
        ]
    },
    {
        "id": 3,
        "title": "التوظيف الجماعي: لماذا تفضل الشركات استقطاب فرق تقنية جاهزة؟",
        "slug": "team-hiring-trends-mena-2026",
        "summary": "نقلة نوعية في منهجيات التوظيف الحديثة: تقليل فترة التأهيل بنسبة 70% وتسليم المنتجات بأعلى تناغم وتكامل بين الأعضاء.",
        "content": """عندما تقوم شركة بتعيين 5 مهندسين غرباء عن بعضهم، فإنها تستغرق ما بين 3 إلى 6 أشهر فقط في مرحلة "بناء التناغم" (Team Dynamics) وفهم أسلوب التواصل المشترك.

### ميزة استقطاب الفرق المترابطة (Team Marketplace)
1. **انعدام فترة التناغم الأولي**: الفريق الذي عمل معاً على مشاريع سابقة يبدأ بالإنتاجية القصوى من الأسبوع الأول.
2. **تكامل المهارات المصقول**: مصمم المنتج يعرف كيف يفكر مطور الواجهة، ومطور الواجهة متفاهم تماماً مع مهندس الواجهات الخلفية وقواعد البيانات.
3. **تقليل مخاطر التسرب الوظيفي**: الفرق المتجانسة تتمتع بروح معنوية عالية ومناخ عمل إيجابي يقلل رغبة الأفراد في المغادرة المبكرة.

منصة فائدة تقود هذا النموذج الرائد في المنطقة عبر إتاحة ملفات تعريف مشتركة للفرق المتخصصة للتقديم الجماعي على كبرى المشاريع والمناقصات التقنية.""",
        "category": "فرق العمل",
        "tags": ["فرق العمل", "التوظيف الجماعي", "الإنتاجية", "الشركات الناشئة"],
        "coverImage": "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=600&fit=crop",
        "publishedAt": "2026-09-20T08:15:00Z",
        "readTime": "4 دقائق",
        "views": 2750,
        "likes": 319,
        "isLiked": False,
        "author": {
            "name": "م. فيصل الشمري",
            "title": "مدير الهندسة البرمجية ومؤسس تقني",
            "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
            "isVerified": True,
            "username": "faisal-alshammari"
        },
        "comments": []
    },
    {
        "id": 4,
        "title": "وظائف المستقبل في ظل الذكاء الاصطناعي ورؤية السعودية 2030",
        "slug": "future-jobs-ai-saudi-vision-2030",
        "summary": "تحليل لأهم المهن الناشئة والمجالات الاستراتيجية الأكثر نمواً في المملكة، وكيف تؤهل نفسك لتكون ضمن الكفاءات المطلوبة عالمياً.",
        "content": """تشهد المملكة العربية السعودية تحولاً رقمياً واقتصادياً غير مسبوق في إطار رؤية 2030. المشاريع الكبرى مثل نيوم، البحر الأحمر، والقدية تفتح آلاف الفرص النوعية.

### أهم المسارات الوظيفية الصاعدة:
- **هندسة الذكاء الاصطناعي وتعلم الآلة التطبيقي (Applied AI Engineering)**: الانتقال من الأبحاث النظرية إلى بناء منتجات ذكية تخدم قطاعات الطاقة، الصحة، والخدمات اللوجستية.
- **الأمن السيبراني والامتثال السحابي**: مع توسع البنية التحتية الرقمية، أصبح تأمين البيانات الحساسة أولوية سيادية للمؤسسات.
- **إدارة منتجات التكنولوجيا المالية (FinTech PM)**: القطاع المالي السعودي من بين الأسرع نمواً في الابتكار والمدفوعات الفورية.

### كيف تجهز نفسك؟
لا تنتظر التخرج أو الشهادات التقليدية؛ ابنِ مشاريع واقعية مفتوحة المصدر، وتعلّم كيفية توظيف أدوات الذكاء الاصطناعي لرفع كفاءتك اليومية أضعافاً مضاعفة.""",
        "category": "رؤية 2030",
        "tags": ["رؤية 2030", "الذكاء الاصطناعي", "نيوم", "مستقبل العمل"],
        "coverImage": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=600&fit=crop",
        "publishedAt": "2026-09-18T12:00:00Z",
        "readTime": "7 دقائق",
        "views": 5600,
        "likes": 845,
        "isLiked": False,
        "author": {
            "name": "د. عبد الله المالكي",
            "title": "باحث ومستشار في الذكاء الاصطناعي والتحول الرقمي",
            "avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop",
            "isVerified": True,
            "username": "dr-abdullah"
        },
        "comments": []
    },
    {
        "id": 5,
        "title": "التحول من مطور مبتدئ إلى محترف: 7 مهارات جوهرية لا تُدرس في الجامعات",
        "slug": "from-junior-to-senior-engineer",
        "summary": "ما يميز المطور المحترف ليس مجرد كتابة الكود، بل التفكير في البنية المعمارية، التواصل، وقابلية الصيانة والتوسع.",
        "content": """عندما تبدأ مسيرتك المهنية، تظن أن النجاح هو إنهاء التذكرة (Ticket) بأي طريقة. ولكن مع التدرج إلى رتبة مهندس أول (Senior Engineer)، تتغير المعايير تماماً.

### 1. الكود المقروء قبل الكود الذكي
الكود الذكي المعقد غالباً ما يكون كابوساً للصيانة. المطور العظيم يكتب كوداً بسيطاً، موثقاً، ومفهوماً لأي زميل جديد ينضم للفريق.

### 2. فهم قيمة العمل التجاري (Business Value)
قبل أن تبدأ بكتابة سطر واحد، اسأل نفسك:
- كيف يخدم هذا الميزة العميل النهائي؟
- هل الحل المقترح يستحق الوقت المستثمر فيه تقنياً ومالياً؟

### 3. التواصل وإدارة التوقعات
القدرة على شرح المشاكل التقنية المعقدة للمدراء غير التقنيين باحترافية هي المهارة الذهبية التي تفتح لك أبواب الترقية السريعة.""",
        "category": "التطوير المهني",
        "tags": ["التطوير المهني", "هندسة البرمجيات", "نصائح تقنية", "القيادة التقنية"],
        "coverImage": "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&h=600&fit=crop",
        "publishedAt": "2026-09-15T09:30:00Z",
        "readTime": "5 دقائق",
        "views": 3120,
        "likes": 390,
        "isLiked": False,
        "author": {
            "name": "نورة العتيبي",
            "title": "مهندسة معمارية للبنية السحابية | مرشدة تقنية",
            "avatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop",
            "isVerified": True,
            "username": "noura-alotaibi"
        },
        "comments": []
    }
]

TRENDING_TOPICS = [
    {"id": 1, "title": "#SaudiVision2030", "posts": "45.2K", "category": "رؤية 2030"},
    {"id": 2, "title": "#ATS_Optimization", "posts": "28.4K", "category": "السير الذاتية وATS"},
    {"id": 3, "title": "#Salary_Benchmarks_2026", "posts": "19.8K", "category": "السوق والرواتب"},
    {"id": 4, "title": "#Team_Marketplace", "posts": "14.1K", "category": "فرق العمل"},
    {"id": 5, "title": "#AI_Recruitment", "posts": "32.6K", "category": "الذكاء الاصطناعي"},
]

SUGGESTED_AUTHORS = [
    {
        "name": "أحمد الفارسي",
        "title": "خبير استقطاب المواهب التقنية",
        "avatar": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop",
        "username": "ahmed-alfarsi",
        "articlesCount": 14,
        "isVerified": True
    },
    {
        "name": "سارة الغامدي",
        "title": "مستشارة توظيف وموارد بشرية",
        "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
        "username": "sara-alghamdi",
        "articlesCount": 21,
        "isVerified": True
    },
    {
        "name": "د. عبد الله المالكي",
        "title": "باحث ومستشار الذكاء الاصطناعي",
        "avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
        "username": "dr-abdullah",
        "articlesCount": 9,
        "isVerified": True
    }
]


@core_bp.route('/api/v1/posts', methods=['GET'])
def api_get_posts():
    """
    Return paginated and filtered career articles and insights.
    Query params: search, category, sort ('newest', 'popular', 'likes'), page, pageSize.
    """
    from datetime import datetime
    search = request.args.get('search', '').strip().lower()
    category = request.args.get('category', '').strip()
    sort_by = request.args.get('sort', 'newest')

    filtered = CAREER_POSTS_DATA.copy()

    if category and category != 'all' and category != 'الكل':
        filtered = [p for p in filtered if p['category'] == category or category in p['tags']]

    if search:
        filtered = [
            p for p in filtered
            if search in p['title'].lower()
            or search in p['summary'].lower()
            or search in p['author']['name'].lower()
            or any(search in t.lower() for t in p['tags'])
        ]

    # Sorting
    if sort_by == 'popular':
        filtered.sort(key=lambda x: x.get('views', 0), reverse=True)
    elif sort_by == 'likes':
        filtered.sort(key=lambda x: x.get('likes', 0), reverse=True)
    else:  # newest
        filtered.sort(key=lambda x: x.get('publishedAt', ''), reverse=True)

    page = max(1, request.args.get('page', 1, type=int))
    page_size = min(50, max(1, request.args.get('pageSize', 10, type=int)))
    total = len(filtered)
    start_idx = (page - 1) * page_size
    end_idx = start_idx + page_size
    items = filtered[start_idx:end_idx]

    categories_list = [
        {"name": "الكل", "key": "all", "count": len(CAREER_POSTS_DATA)},
        {"name": "السير الذاتية وATS", "key": "السير الذاتية وATS", "count": sum(1 for p in CAREER_POSTS_DATA if p['category'] == "السير الذاتية وATS")},
        {"name": "السوق والرواتب", "key": "السوق والرواتب", "count": sum(1 for p in CAREER_POSTS_DATA if p['category'] == "السوق والرواتب")},
        {"name": "فرق العمل", "key": "فرق العمل", "count": sum(1 for p in CAREER_POSTS_DATA if p['category'] == "فرق العمل")},
        {"name": "رؤية 2030", "key": "رؤية 2030", "count": sum(1 for p in CAREER_POSTS_DATA if p['category'] == "رؤية 2030")},
        {"name": "التطوير المهني", "key": "التطوير المهني", "count": sum(1 for p in CAREER_POSTS_DATA if p['category'] == "التطوير المهني")},
    ]

    return jsonify({
        "posts": items,
        "total": total,
        "page": page,
        "pageSize": page_size,
        "totalPages": max(1, (total + page_size - 1) // page_size),
        "categories": categories_list,
        "trendingTopics": TRENDING_TOPICS,
        "suggestedAuthors": SUGGESTED_AUTHORS
    }), 200


@core_bp.route('/api/v1/posts/<int:post_id>', methods=['GET'])
def api_get_post_detail(post_id):
    """Return full single article detail with comments and related articles."""
    post = next((p for p in CAREER_POSTS_DATA if p['id'] == post_id), None)
    if not post:
        return jsonify({"message": "المقال غير موجود أو تم حذفه"}), 404

    # Increment view count
    post['views'] = post.get('views', 0) + 1

    # Related articles
    related = [
        {
            "id": p['id'],
            "title": p['title'],
            "summary": p['summary'],
            "coverImage": p['coverImage'],
            "category": p['category'],
            "readTime": p['readTime'],
            "publishedAt": p['publishedAt'],
            "author": p['author']
        }
        for p in CAREER_POSTS_DATA
        if p['id'] != post_id and (p['category'] == post['category'] or any(t in post['tags'] for t in p['tags']))
    ][:3]

    return jsonify({
        "post": post,
        "related": related
    }), 200


@core_bp.route('/api/v1/posts', methods=['POST'])
def api_create_post():
    """Create a new article or professional community post."""
    from datetime import datetime
    data = request.get_json() or {}
    title = (data.get('title') or '').strip()
    content = (data.get('content') or '').strip()
    category = (data.get('category') or 'التطوير المهني').strip()
    summary = (data.get('summary') or '').strip()
    cover_image = data.get('coverImage') or "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&h=600&fit=crop"
    tags = data.get('tags') or [category]

    if not title or not content:
        return jsonify({"message": "العنوان والمحتوى مطلوبان لنشر المقال"}), 400

    author_name = data.get('authorName') or "مشارك متميز"
    author_title = data.get('authorTitle') or "عضو مجتمع فائدة"
    author_username = data.get('authorUsername') or "community-member"

    # If logged in as customer, use candidate details
    if 'session_customer' in session and 'user_id' in session:
        from services.customer import Customers
        cand = Customers.query.get(session['user_id'])
        if cand:
            author_name = cand.fullname or author_name
            author_title = cand.preferred_field_of_work or author_title
            author_username = cand.user_id or author_username

    new_id = max(p['id'] for p in CAREER_POSTS_DATA) + 1 if CAREER_POSTS_DATA else 1
    new_post = {
        "id": new_id,
        "title": title,
        "slug": f"post-{new_id}",
        "summary": summary or (content[:150] + "..."),
        "content": content,
        "category": category,
        "tags": tags,
        "coverImage": cover_image,
        "publishedAt": datetime.utcnow().isoformat() + "Z",
        "readTime": f"{max(2, len(content.split()) // 150)} دقائق",
        "views": 1,
        "likes": 0,
        "isLiked": False,
        "author": {
            "name": author_name,
            "title": author_title,
            "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop",
            "isVerified": True,
            "username": author_username
        },
        "comments": []
    }

    CAREER_POSTS_DATA.insert(0, new_post)
    return jsonify({"success": True, "post": new_post, "message": "تم نشر المقال بنجاح!"}), 201


@core_bp.route('/api/v1/posts/<int:post_id>/like', methods=['POST'])
def api_toggle_like_post(post_id):
    """Toggle like on an article."""
    post = next((p for p in CAREER_POSTS_DATA if p['id'] == post_id), None)
    if not post:
        return jsonify({"message": "المقال غير موجود"}), 404

    post['isLiked'] = not post.get('isLiked', False)
    if post['isLiked']:
        post['likes'] = post.get('likes', 0) + 1
    else:
        post['likes'] = max(0, post.get('likes', 1) - 1)

    return jsonify({"success": True, "likes": post['likes'], "isLiked": post['isLiked']}), 200


@core_bp.route('/api/v1/posts/<int:post_id>/comments', methods=['POST'])
def api_add_post_comment(post_id):
    """Add a comment to an article."""
    post = next((p for p in CAREER_POSTS_DATA if p['id'] == post_id), None)
    if not post:
        return jsonify({"message": "المقال غير موجود"}), 404

    data = request.get_json() or {}
    text = (data.get('text') or '').strip()
    if not text:
        return jsonify({"message": "نص التعليق مطلوب"}), 400

    author_name = (data.get('author') or '').strip() or "زائر مهتم"
    avatar = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop"

    if 'session_customer' in session and 'user_id' in session:
        from services.customer import Customers
        cand = Customers.query.get(session['user_id'])
        if cand:
            author_name = cand.fullname or author_name
            if cand.img:
                avatar = f"/download_image/{cand.img}"

    new_comment = {
        "id": len(post.get('comments', [])) + 1,
        "author": author_name,
        "avatar": avatar,
        "text": text,
        "time": "الآن"
    }

    if 'comments' not in post:
        post['comments'] = []
    post['comments'].append(new_comment)

    return jsonify({"success": True, "comment": new_comment, "commentsCount": len(post['comments'])}), 201
