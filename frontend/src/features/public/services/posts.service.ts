/**
 * features/public/services/posts.service.ts
 *
 * Client HTTP service for Career Articles and Insights feed.
 * Includes complete fallback mock dataset for resilient offline browsing.
 */
import { apiClient } from "@/lib/api-client"
import { API_CONFIG } from "@/config/api"
import type {
  PostsResponse,
  PostDetailResponse,
  PostArticle,
  CreatePostDTO,
  PostComment,
} from "../types/posts.types"

const FALLBACK_ARTICLES: PostArticle[] = [
  {
    id: 1,
    title: "دليلك الشامل لاجتياز أنظمة الفرز الذكي (ATS) والوصول إلى المقابلات الشخصية",
    slug: "ats-resume-optimization-guide-2026",
    summary:
      "كيف تصيغ سيرتك الذاتية بلغة تفهمها خوارزميات الذكاء الاصطناعي ومسؤولو التوظيف في السوق السعودي؟ 5 استراتيجيات عملية معتمدة.",
    content: `تعتمد اليوم أكثر من 85% من كبرى الشركات السعودية والدولية على أنظمة التتبع الآلي للمرشحين (ATS). وظيفة هذه الأنظمة هي فلترة مئات السير الذاتية وفرزها تلقائياً قبل أن تصل إلى عين مسؤول الموارد البشرية.

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
دائماً احفظ ملف سيرتك بصيغة PDF قابلة للنسخ النصي (Selectable Text)، وتأكد من أن حجم الملف لا يتجاوز 2 ميجابايت.`,
    category: "السير الذاتية وATS",
    tags: ["ATS", "السيرة الذاتية", "التوظيف", "الذكاء الاصطناعي"],
    coverImage:
      "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=1200&h=600&fit=crop",
    publishedAt: "2026-09-24T10:00:00Z",
    readTime: "5 دقائق قراءة",
    views: 3840,
    likes: 428,
    isLiked: false,
    author: {
      name: "أحمد الفارسي",
      title: "خبير استقطاب المواهب التقنية | مستشار مهني",
      avatar:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop",
      isVerified: true,
      username: "ahmed-alfarsi",
    },
    comments: [
      {
        id: 101,
        author: "سارة القحطاني",
        avatar:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
        text: "مقال دقيق وواقعي جداً! بالفعل واجهت رفضاً آلياً سابقاً واكتشفت أن القالب ثنائي الأعمدة كان السبب.",
        time: "منذ يومين",
      },
      {
        id: 102,
        author: "خالد بن عبد الرحمن",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
        text: "صياغة الإنجازات الرقمية باستخدام نموذج STAR أحدثت فرقاً جذرياً في عدد المقابلات التي تلقيتها.",
        time: "منذ يوم",
      },
    ],
  },
  {
    id: 2,
    title: "القيمة السوقية والتفاوض على الرواتب: دليلك لعرض وظيفي عادل في 2026",
    slug: "salary-negotiation-market-value-2026",
    summary:
      "فهم معايير تسعير الكفاءات في السوق السعودي، وكيف تستند على مؤشرات حقيقية لحساب قيمتك السوقية وبناء موقف تفاوضي قوي.",
    content: `كثير من المهنيين يتفاجؤون عندما يُطلب منهم تحديد "الراتب المتوقع" أثناء المقابلة الأولى. الإجابة العشوائية إما أن تحرمك من عرض مستحق أو تستبعدك مبكراً.

### معايير تحديد القيمة السوقية في السوق السعودي
لا يقاس الراتب بسنوات الخبرة المجردة فقط، بل بعدة محاور متداخلة:
1. **الندرة التقنية ومستوى التخصص**: المهارات المرتبطة بهندسة البيانات الضخمة، والذكاء الاصطناعي التوليدي، وتطوير البنية التحتية السحابية تشهد طلباً يفوق المعروض.
2. **الأثر المالي المباشر**: قدرتك على تسريع تسليم المشاريع أو خفض التكاليف التشغيلية.
3. **حجم واستقرار المنشأة**: الشركات التقنية الناشئة قد تقدم حصصاً أو مرونة أعلى، بينما المؤسسات الكبرى والبنوك تقدم حزم بدلات شاملة.

### استراتيجية التفاوض المستندة للبيانات
- لا تذكر رقماً منفرداً؛ اعرض نطاقاً سعرياً (Range) يعتمد على المسؤوليات ونظام العمل.
- اطلب مهلة 24-48 ساعة لدراسة العرض المالي وتفاصيل المزايا قبل الرد الرسمي.
- تفاوض على الحزمة ككل: الراتب الأساسي، ساعات العمل المرنة، ميزانية التدريب والتطوير، وبونص الأداء السنوي.`,
    category: "السوق والرواتب",
    tags: ["الرواتب", "التفاوض", "القيمة السوقية", "سوق العمل السعودي"],
    coverImage:
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1200&h=600&fit=crop",
    publishedAt: "2026-09-22T14:30:00Z",
    readTime: "6 دقائق قراءة",
    views: 4920,
    likes: 612,
    isLiked: true,
    author: {
      name: "سارة الغامدي",
      title: "رئيسة قسم استقطاب المواهب التنفيذية | مستشارة موارد بشرية",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
      isVerified: true,
      username: "sara-alghamdi",
    },
    comments: [],
  },
  {
    id: 3,
    title: "التوظيف الجماعي: لماذا تفضل الشركات استقطاب فرق تقنية جاهزة؟",
    slug: "team-hiring-trends-mena-2026",
    summary:
      "نقلة نوعية في منهجيات التوظيف الحديثة: تقليل فترة التأهيل بنسبة 70% وتسليم المنتجات بأعلى تناغم وتكامل بين الأعضاء.",
    content: `عندما تقوم شركة بتعيين 5 مهندسين غرباء عن بعضهم، فإنها تستغرق ما بين 3 إلى 6 أشهر فقط في مرحلة "بناء التناغم" وفهم أسلوب التواصل المشترك.

### ميزة استقطاب الفرق المترابطة (Team Marketplace)
1. **انعدام فترة التناغم الأولي**: الفريق الذي عمل معاً على مشاريع سابقة يبدأ بالإنتاجية القصوى من الأسبوع الأول.
2. **تكامل المهارات المصقول**: مصمم المنتج يعرف كيف يفكر مطور الواجهة، ومطور الواجهة متفاهم تماماً مع مهندس الواجهات الخلفية وقواعد البيانات.
3. **تقليل مخاطر التسرب الوظيفي**: الفرق المتجانسة تتمتع بروح معنوية عالية ومناخ عمل إيجابي يقلل رغبة الأفراد في المغادرة المبكرة.`,
    category: "فرق العمل",
    tags: ["فرق العمل", "التوظيف الجماعي", "الإنتاجية", "الشركات الناشئة"],
    coverImage:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=600&fit=crop",
    publishedAt: "2026-09-20T08:15:00Z",
    readTime: "4 دقائق قراءة",
    views: 2750,
    likes: 319,
    isLiked: false,
    author: {
      name: "م. فيصل الشمري",
      title: "مدير الهندسة البرمجية ومؤسس تقني",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
      isVerified: true,
      username: "faisal-alshammari",
    },
    comments: [],
  },
  {
    id: 4,
    title: "وظائف المستقبل في ظل الذكاء الاصطناعي ورؤية السعودية 2030",
    slug: "future-jobs-ai-saudi-vision-2030",
    summary:
      "تحليل لأهم المهن الناشئة والمجالات الاستراتيجية الأكثر نمواً في المملكة، وكيف تؤهل نفسك لتكون ضمن الكفاءات المطلوبة عالمياً.",
    content: `تشهد المملكة العربية السعودية تحولاً رقمياً واقتصادياً غير مسبوق في إطار رؤية 2030. المشاريع الكبرى تفتح آلاف الفرص النوعية.

### أهم المسارات الوظيفية الصاعدة:
- **هندسة الذكاء الاصطناعي وتعلم الآلة التطبيقي**: الانتقال من الأبحاث النظرية إلى بناء منتجات ذكية تخدم قطاعات الطاقة، الصحة، والخدمات اللوجستية.
- **الأمن السيبراني والامتثال السحابي**: مع توسع البنية التحتية الرقمية، أصبح تأمين البيانات الحساسة أولوية سيادية للمؤسسات.
- **إدارة منتجات التكنولوجيا المالية (FinTech PM)**: القطاع المالي السعودي من بين الأسرع نمواً في الابتكار والمدفوعات الفورية.`,
    category: "رؤية 2030",
    tags: ["رؤية 2030", "الذكاء الاصطناعي", "نيوم", "مستقبل العمل"],
    coverImage:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=600&fit=crop",
    publishedAt: "2026-09-18T12:00:00Z",
    readTime: "7 دقائق قراءة",
    views: 5600,
    likes: 845,
    isLiked: false,
    author: {
      name: "د. عبد الله المالكي",
      title: "باحث ومستشار في الذكاء الاصطناعي والتحول الرقمي",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop",
      isVerified: true,
      username: "dr-abdullah",
    },
    comments: [],
  },
  {
    id: 5,
    title: "التحول من مطور مبتدئ إلى محترف: 7 مهارات جوهرية لا تُدرس في الجامعات",
    slug: "from-junior-to-senior-engineer",
    summary:
      "ما يميز المطور المحترف ليس مجرد كتابة الكود، بل التفكير في البنية المعمارية، التواصل، وقابلية الصيانة والتوسع.",
    content: `عندما تبدأ مسيرتك المهنية، تظن أن النجاح هو إنهاء التذكرة بأي طريقة. ولكن مع التدرج إلى رتبة مهندس أول، تتغير المعايير تماماً.

### 1. الكود المقروء قبل الكود الذكي
الكود الذكي المعقد غالباً ما يكون كابوساً للصيانة. المطور العظيم يكتب كوداً بسيطاً، موثقاً، ومفهوماً لأي زميل جديد ينضم للفريق.

### 2. فهم قيمة العمل التجاري (Business Value)
قبل أن تبدأ بكتابة سطر واحد، اسأل نفسك: كيف تخدم هذه الميزة العميل النهائي؟

### 3. التواصل وإدارة التوقعات
القدرة على شرح المشاكل التقنية المعقدة للمدراء غير التقنيين باحترافية هي المهارة الذهبية للنمو السريع.`,
    category: "التطوير المهني",
    tags: ["التطوير المهني", "هندسة البرمجيات", "نصائح تقنية", "القيادة التقنية"],
    coverImage:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&h=600&fit=crop",
    publishedAt: "2026-09-15T09:30:00Z",
    readTime: "5 دقائق قراءة",
    views: 3120,
    likes: 390,
    isLiked: false,
    author: {
      name: "نورة العتيبي",
      title: "مهندسة معمارية للبنية السحابية | مرشدة تقنية",
      avatar:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop",
      isVerified: true,
      username: "noura-alotaibi",
    },
    comments: [],
  },
]

class PostsService {
  private localArticles = [...FALLBACK_ARTICLES]

  async getPosts(params?: {
    search?: string
    category?: string
    sort?: string
    page?: number
    pageSize?: number
  }): Promise<PostsResponse> {
    try {
      const { data } = await apiClient.get<PostsResponse>(API_CONFIG.ENDPOINTS.POSTS.LIST, {
        params,
      })
      return data
    } catch {
      // Local fallback
      let list = [...this.localArticles]
      const cat = params?.category
      const q = params?.search?.toLowerCase().trim()

      if (cat && cat !== "all" && cat !== "الكل") {
        list = list.filter((p) => p.category === cat || p.tags.includes(cat))
      }

      if (q) {
        list = list.filter(
          (p) =>
            p.title.toLowerCase().includes(q) ||
            p.summary.toLowerCase().includes(q) ||
            p.author.name.toLowerCase().includes(q) ||
            p.tags.some((t) => t.toLowerCase().includes(q))
        )
      }

      if (params?.sort === "popular") {
        list.sort((a, b) => b.views - a.views)
      } else if (params?.sort === "likes") {
        list.sort((a, b) => b.likes - a.likes)
      } else {
        list.sort(
          (a, b) =>
            new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        )
      }

      const page = params?.page || 1
      const pageSize = params?.pageSize || 10
      const start = (page - 1) * pageSize
      const paged = list.slice(start, start + pageSize)

      return {
        posts: paged,
        total: list.length,
        page,
        pageSize,
        totalPages: Math.ceil(list.length / pageSize),
        categories: [
          { name: "الكل", key: "all", count: this.localArticles.length },
          {
            name: "السير الذاتية وATS",
            key: "السير الذاتية وATS",
            count: this.localArticles.filter((p) => p.category === "السير الذاتية وATS").length,
          },
          {
            name: "السوق والرواتب",
            key: "السوق والرواتب",
            count: this.localArticles.filter((p) => p.category === "السوق والرواتب").length,
          },
          {
            name: "فرق العمل",
            key: "فرق العمل",
            count: this.localArticles.filter((p) => p.category === "فرق العمل").length,
          },
          {
            name: "رؤية 2030",
            key: "رؤية 2030",
            count: this.localArticles.filter((p) => p.category === "رؤية 2030").length,
          },
          {
            name: "التطوير المهني",
            key: "التطوير المهني",
            count: this.localArticles.filter((p) => p.category === "التطوير المهني").length,
          },
        ],
        trendingTopics: [
          { id: 1, title: "#SaudiVision2030", posts: "45.2K", category: "رؤية 2030" },
          { id: 2, title: "#ATS_Optimization", posts: "28.4K", category: "السير الذاتية وATS" },
          { id: 3, title: "#Salary_Benchmarks_2026", posts: "19.8K", category: "السوق والرواتب" },
          { id: 4, title: "#Team_Marketplace", posts: "14.1K", category: "فرق العمل" },
          { id: 5, title: "#AI_Recruitment", posts: "32.6K", category: "الذكاء الاصطناعي" },
        ],
        suggestedAuthors: [
          {
            name: "أحمد الفارسي",
            title: "خبير استقطاب المواهب التقنية",
            avatar:
              "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop",
            username: "ahmed-alfarsi",
            articlesCount: 14,
            isVerified: true,
          },
          {
            name: "سارة الغامدي",
            title: "مستشارة توظيف وموارد بشرية",
            avatar:
              "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
            username: "sara-alghamdi",
            articlesCount: 21,
            isVerified: true,
          },
          {
            name: "د. عبد الله المالكي",
            title: "باحث ومستشار الذكاء الاصطناعي",
            avatar:
              "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
            username: "dr-abdullah",
            articlesCount: 9,
            isVerified: true,
          },
        ],
      }
    }
  }

  async getPostDetail(id: number | string): Promise<PostDetailResponse> {
    const numId = Number(id)
    try {
      const { data } = await apiClient.get<PostDetailResponse>(
        API_CONFIG.ENDPOINTS.POSTS.DETAIL(id)
      )
      return data
    } catch {
      const post = this.localArticles.find((p) => p.id === numId) || this.localArticles[0]
      const related = this.localArticles
        .filter((p) => p.id !== post.id && p.category === post.category)
        .slice(0, 3)

      return {
        post: { ...post, views: post.views + 1 },
        related: related.length > 0 ? related : this.localArticles.filter((p) => p.id !== post.id).slice(0, 3),
      }
    }
  }

  async createPost(dto: CreatePostDTO): Promise<{ success: boolean; post: PostArticle }> {
    try {
      const { data } = await apiClient.post<{ success: boolean; post: PostArticle }>(
        API_CONFIG.ENDPOINTS.POSTS.CREATE,
        dto
      )
      return data
    } catch {
      const newId = Math.max(...this.localArticles.map((p) => p.id), 0) + 1
      const created: PostArticle = {
        id: newId,
        title: dto.title,
        slug: `post-${newId}`,
        summary: dto.summary || dto.content.slice(0, 140) + "...",
        content: dto.content,
        category: dto.category || "التطوير المهني",
        tags: dto.tags || [dto.category || "عام"],
        coverImage:
          dto.coverImage ||
          "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&h=600&fit=crop",
        publishedAt: new Date().toISOString(),
        readTime: `${Math.max(2, Math.round(dto.content.split(/\s+/).length / 150))} دقائق قراءة`,
        views: 1,
        likes: 0,
        isLiked: false,
        author: {
          name: dto.authorName || "كاتب متميز",
          title: dto.authorTitle || "عضو مجتمع فائدة",
          avatar:
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop",
          isVerified: true,
          username: dto.authorUsername || "author",
        },
        comments: [],
      }
      this.localArticles.unshift(created)
      return { success: true, post: created }
    }
  }

  async toggleLike(id: number | string): Promise<{ success: boolean; likes: number; isLiked: boolean }> {
    try {
      const { data } = await apiClient.post<{ success: boolean; likes: number; isLiked: boolean }>(
        API_CONFIG.ENDPOINTS.POSTS.LIKE(id)
      )
      return data
    } catch {
      const post = this.localArticles.find((p) => p.id === Number(id))
      if (post) {
        post.isLiked = !post.isLiked
        post.likes = post.isLiked ? post.likes + 1 : Math.max(0, post.likes - 1)
        return { success: true, likes: post.likes, isLiked: post.isLiked }
      }
      return { success: true, likes: 1, isLiked: true }
    }
  }

  async addComment(
    id: number | string,
    text: string,
    author = "زائر مهتم"
  ): Promise<{ success: boolean; comment: PostComment; commentsCount: number }> {
    try {
      const { data } = await apiClient.post<{
        success: boolean
        comment: PostComment
        commentsCount: number
      }>(API_CONFIG.ENDPOINTS.POSTS.COMMENTS(id), { text, author })
      return data
    } catch {
      const post = this.localArticles.find((p) => p.id === Number(id))
      const newComment: PostComment = {
        id: (post?.comments?.length || 0) + 1,
        author,
        avatar:
          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
        text,
        time: "الآن",
      }
      if (post) {
        if (!post.comments) post.comments = []
        post.comments.push(newComment)
      }
      return {
        success: true,
        comment: newComment,
        commentsCount: post?.comments?.length || 1,
      }
    }
  }
}

export const postsService = new PostsService()
