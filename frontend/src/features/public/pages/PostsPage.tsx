/**
 * features/public/pages/PostsPage.tsx
 *
 * Career Articles & Insights Hub (/posts).
 * Features rich filtering, search, category navigation, trending topics,
 * author spotlights linked to public candidate portfolios, and article creation.
 * Fully localized for Arabic (RTL), English (LTR), and Hindi (LTR).
 */
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search,
  BookOpen,
  TrendingUp,
  Clock,
  Heart,
  Share2,
  PlusCircle,
  Sparkles,
  Users,
  CheckCircle2,
  X,
  Send,
  Eye,
} from "lucide-react"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { postsService } from "../services/posts.service"
import type { PostArticle, TrendingTopic, SuggestedAuthor, CreatePostDTO } from "../types/posts.types"
import { ROUTES } from "@/config/routes"
import { useTranslation } from "@/i18n"
import { getLocalizedPost } from "@/lib/localization.utils"
import toast from "react-hot-toast"

export function PostsPage() {
  const { language } = useTranslation()

  const [posts, setPosts] = useState<PostArticle[]>([])
  const [trendingTopics, setTrendingTopics] = useState<TrendingTopic[]>([])
  const [suggestedAuthors, setSuggestedAuthors] = useState<SuggestedAuthor[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState<"newest" | "popular" | "likes">("newest")

  // Modal create post
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [newTitle, setNewTitle] = useState("")
  const [newCategory, setNewCategory] = useState("التطوير المهني")
  const [newSummary, setNewSummary] = useState("")
  const [newContent, setNewContent] = useState("")
  const [newCoverImage, setNewCoverImage] = useState("")
  const [isSubmittingPost, setIsSubmittingPost] = useState(false)

  // Newsletter subscribe
  const [newsletterEmail, setNewsletterEmail] = useState("")
  const [isSubscribed, setIsSubscribed] = useState(false)

  useEffect(() => {
    let isMounted = true
    async function loadData() {
      setIsLoading(true)
      try {
        const res = await postsService.getPosts({
          search: searchQuery,
          category: selectedCategory,
          sort: sortBy,
        })
        if (isMounted) {
          setPosts(res.posts)
          if (res.trendingTopics) setTrendingTopics(res.trendingTopics)
          if (res.suggestedAuthors) setSuggestedAuthors(res.suggestedAuthors)
        }
      } catch {
        if (isMounted) setPosts([])
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }
    loadData()
    return () => {
      isMounted = false
    }
  }, [searchQuery, selectedCategory, sortBy])

  const handleLike = async (e: React.MouseEvent, postId: number) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      const res = await postsService.toggleLike(postId)
      setPosts((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, likes: res.likes, isLiked: res.isLiked } : p))
      )
    } catch {
      // ignore
    }
  }

  const handleShare = (e: React.MouseEvent, post: PostArticle) => {
    e.preventDefault()
    e.stopPropagation()
    const url = `${window.location.origin}/posts/${post.id}`
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url)
      toast.success(
        language === "ar"
          ? "تم نسخ رابط المقال!"
          : language === "hi"
          ? "लेख का लिंक कॉपी किया गया!"
          : "Article link copied!"
      )
    }
  }

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim() || !newContent.trim()) {
      toast.error(
        language === "ar"
          ? "يرجى كتابة عنوان المقال والمحتوى"
          : language === "hi"
          ? "कृपया शीर्षक और सामग्री दर्ज करें"
          : "Please provide a title and content"
      )
      return
    }

    setIsSubmittingPost(true)
    try {
      const dto: CreatePostDTO = {
        title: newTitle.trim(),
        summary: newSummary.trim() || undefined,
        content: newContent.trim(),
        category: newCategory,
        coverImage: newCoverImage.trim() || undefined,
      }
      const res = await postsService.createPost(dto)
      toast.success(
        language === "ar"
          ? "تم نشر مقالك ومشاركته مع المجتمع بنجاح!"
          : language === "hi"
          ? "आपका लेख सफलतापूर्वक प्रकाशित किया गया!"
          : "Article published successfully!"
      )
      setPosts((prev) => [res.post, ...prev])
      setIsCreateModalOpen(false)
      setNewTitle("")
      setNewSummary("")
      setNewContent("")
      setNewCoverImage("")
    } catch {
      toast.error(
        language === "ar"
          ? "تعذر نشر المقال حالياً."
          : language === "hi"
          ? "लेख प्रकाशित करने में विफल।"
          : "Failed to publish article."
      )
    } finally {
      setIsSubmittingPost(false)
    }
  }

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newsletterEmail || !newsletterEmail.includes("@")) return
    setIsSubscribed(true)
    toast.success(
      language === "ar"
        ? "شكراً لاشتراكك! ستصلك أحدث المقالات أسبوعياً."
        : language === "hi"
        ? "सदस्यता लेने के लिए धन्यवाद! आपको साप्ताहिक लेख प्राप्त होंगे।"
        : "Thank you for subscribing to Faeda Insights!"
    )
    setNewsletterEmail("")
  }

  // Fully localize posts dynamically based on selected language
  const localizedPosts = posts.map((p) => getLocalizedPost(p, language))
  const featuredPost = localizedPosts[0]
  const feedPosts = localizedPosts.slice(1)

  return (
    <div className="min-h-screen bg-background text-foreground pt-24 pb-20 relative selection:bg-primary/30">
      {/* Background Glows */}
      <div className="absolute top-20 start-1/3 w-[700px] h-[350px] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-96 end-1/4 w-[500px] h-[300px] bg-sky-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10 text-start space-y-10">

        {/* ── Page Header & Action CTA ─────────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                {language === "ar"
                  ? "مجتمع فائدة المعرفي والمهني"
                  : language === "hi"
                  ? "फायदा ज्ञान और करियर केंद्र"
                  : "Faeda Knowledge & Career Hub"}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-white tracking-tight leading-tight">
              {language === "ar"
                ? "المقالات والرؤى المهنية"
                : language === "hi"
                ? "करियर लेख और व्यावसायिक अंतर्दृष्टि"
                : "Career Articles & Insights"}
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              {language === "ar"
                ? "دليلك الشامل لنمو مسارك المهني، واجتياز أنظمة الفرز الذكي (ATS)، وتحليل القيمة السوقية والرواتب، واستكشاف وظائف المستقبل في إطار رؤية 2030."
                : language === "hi"
                ? "अपने करियर के विकास, एटीएस (ATS) फ़िल्टर पास करने, बाज़ार वेतन विश्लेषण और विज़न 2030 के तहत भविष्य की नौकरियों के लिए आपकी व्यापक मार्गदर्शिका।"
                : "Your definitive guide to career trajectories, ATS optimization, market value compensation, and future skills under Vision 2030."}
            </p>
          </div>

          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="rounded-2xl px-6 py-3 bg-primary hover:bg-primary/90 text-white font-bold text-sm flex items-center gap-2.5 shadow-xl shadow-primary/25 hover:scale-[1.02] transition-transform shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>
              {language === "ar"
                ? "شارك مقالاً أو تجربة"
                : language === "hi"
                ? "लेख या अनुभव साझा करें"
                : "Write an Article"}
            </span>
          </Button>
        </div>

        {/* ── Search & Filter Controls ─────────────────────────────── */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Search Input */}
            <div className="relative w-full flex-1">
              <Search className="absolute start-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  language === "ar"
                    ? "ابحث في المقالات، المواضيع، أو الكتاب..."
                    : language === "hi"
                    ? "लेख, विषय या लेखक खोजें..."
                    : "Search articles, topics, or authors..."
                }
                className="w-full ps-11 pe-10 py-3.5 rounded-2xl bg-card/60 border border-white/10 text-white placeholder-muted-foreground text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute end-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sort Select */}
            <div className="w-full sm:w-auto shrink-0 flex items-center gap-2">
              <span className="text-xs text-muted-foreground whitespace-nowrap hidden sm:inline">
                {language === "ar" ? "ترتيب حسب:" : language === "hi" ? "क्रमबद्ध करें:" : "Sort:"}
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full sm:w-auto px-4 py-3.5 rounded-2xl bg-card/60 border border-white/10 text-white text-xs sm:text-sm font-semibold focus:outline-none focus:border-primary"
              >
                <option value="newest">{language === "ar" ? "الأحدث نشراً" : language === "hi" ? "नवीनतम" : "Newest"}</option>
                <option value="popular">{language === "ar" ? "الأكثر قراءة" : language === "hi" ? "सर्वाधिक पढ़े गए" : "Most Viewed"}</option>
                <option value="likes">{language === "ar" ? "الأكثر إعجاباً" : language === "hi" ? "सर्वाधिक पसंद किए गए" : "Most Liked"}</option>
              </select>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
            {[
              { key: "all", name: language === "ar" ? "الكل" : language === "hi" ? "सभी" : "All" },
              { key: "السير الذاتية وATS", name: language === "ar" ? "السير الذاتية وATS" : language === "hi" ? "बायोडाटा और ATS" : "ATS & Resumes" },
              { key: "السوق والرواتب", name: language === "ar" ? "السوق والرواتب" : language === "hi" ? "बाज़ार और वेतन" : "Market & Salaries" },
              { key: "فرق العمل", name: language === "ar" ? "فرق العمل" : language === "hi" ? "टीम वर्क" : "Team Dynamics" },
              { key: "رؤية 2030", name: language === "ar" ? "رؤية 2030" : language === "hi" ? "विजन 2030" : "Vision 2030" },
              { key: "التطوير المهني", name: language === "ar" ? "التطوير المهني" : language === "hi" ? "करियर विकास" : "Career Growth" },
            ].map((cat) => (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                  selectedCategory === cat.key
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "bg-card/40 border border-white/5 text-muted-foreground hover:text-white hover:bg-white/5"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* ── Main Layout: Articles Feed + Sidebar ─────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Content Area (8 Cols) */}
          <div className="lg:col-span-8 space-y-8">
            
            {isLoading ? (
              <div className="space-y-6 animate-pulse">
                <div className="h-80 w-full bg-card/60 rounded-3xl border border-white/5" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-72 bg-card/40 rounded-2xl border border-white/5" />
                  ))}
                </div>
              </div>
            ) : localizedPosts.length === 0 ? (
              <div className="p-16 text-center bg-card/20 rounded-3xl border border-white/5 space-y-4">
                <BookOpen className="w-12 h-12 text-muted-foreground mx-auto opacity-50" />
                <h3 className="text-xl font-bold font-heading text-white">
                  {language === "ar"
                    ? "لا توجد مقالات تطابق بحثك"
                    : language === "hi"
                    ? "आपकी खोज से मेल खाता कोई लेख नहीं मिला"
                    : "No articles found"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {language === "ar"
                    ? "جرب البحث بكلمات أخرى أو اختر تصنيفاً مختلفاً."
                    : language === "hi"
                    ? "अन्य शब्दों से खोजें या कोई भिन्न श्रेणी चुनें।"
                    : "Try adjusting your search terms or category filter."}
                </p>
                <Button
                  onClick={() => {
                    setSearchQuery("")
                    setSelectedCategory("all")
                  }}
                  className="rounded-xl px-5 bg-white/10 hover:bg-white/15 text-white text-xs"
                >
                  {language === "ar"
                    ? "إعادة ضبط التصفية"
                    : language === "hi"
                    ? "फ़िल्टर रीसेट करें"
                    : "Reset Filters"}
                </Button>
              </div>
            ) : (
              <>
                {/* Featured / Heroic Article Card */}
                {featuredPost && (
                  <Link to={`/posts/${featuredPost.id}`} className="block group">
                    <GlassCard className="relative overflow-hidden bg-card/60 border-white/10 rounded-3xl p-6 sm:p-8 hover:border-primary/40 transition-all duration-300 shadow-2xl">
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                        <div className="md:col-span-5 h-56 sm:h-64 rounded-2xl overflow-hidden relative">
                          <img
                            src={featuredPost.coverImage}
                            alt={featuredPost.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute top-3 start-3 px-3 py-1 rounded-full bg-primary text-white text-xs font-bold shadow-lg">
                            {featuredPost.category}
                          </div>
                        </div>

                        <div className="md:col-span-7 space-y-3">
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-primary" />
                              {featuredPost.readTime}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Eye className="w-3.5 h-3.5" />
                              {featuredPost.views} {language === "ar" ? "قراءة" : language === "hi" ? "बार देखा गया" : "views"}
                            </span>
                          </div>

                          <h2 className="text-xl sm:text-2xl font-extrabold font-heading text-white group-hover:text-primary transition-colors leading-snug">
                            {featuredPost.title}
                          </h2>

                          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                            {featuredPost.summary}
                          </p>

                          {/* Author & Interactions Bar */}
                          <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                            <div
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                window.location.href = ROUTES.PORTFOLIO.PUBLIC(featuredPost.author.username)
                              }}
                              className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
                            >
                              <img
                                src={featuredPost.author.avatar}
                                alt={featuredPost.author.name}
                                className="w-8 h-8 rounded-full object-cover ring-2 ring-primary/30"
                              />
                              <div>
                                <span className="text-xs font-bold text-white block hover:text-primary">
                                  {featuredPost.author.name}
                                </span>
                                <span className="text-[10px] text-muted-foreground block truncate max-w-[150px]">
                                  {featuredPost.author.title}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <button
                                onClick={(e) => handleLike(e, featuredPost.id)}
                                className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg transition-colors ${
                                  featuredPost.isLiked
                                    ? "text-red-400 bg-red-500/10"
                                    : "text-muted-foreground hover:text-red-400 hover:bg-white/5"
                                }`}
                              >
                                <Heart className={`w-3.5 h-3.5 ${featuredPost.isLiked ? "fill-red-400" : ""}`} />
                                <span>{featuredPost.likes}</span>
                              </button>

                              <button
                                onClick={(e) => handleShare(e, featuredPost)}
                                className="p-1 rounded-lg text-muted-foreground hover:text-white hover:bg-white/5"
                              >
                                <Share2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                        </div>
                      </div>
                    </GlassCard>
                  </Link>
                )}

                {/* Grid of Remaining Articles */}
                {feedPosts.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                    {feedPosts.map((post) => (
                      <Link key={post.id} to={`/posts/${post.id}`} className="block group">
                        <GlassCard className="h-full bg-card/40 border-white/5 hover:border-primary/40 rounded-3xl p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 shadow-xl">
                          <div className="space-y-4">
                            {/* Card Image */}
                            <div className="h-44 w-full rounded-2xl overflow-hidden relative">
                              <img
                                src={post.coverImage}
                                alt={post.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                              <div className="absolute top-3 start-3 px-2.5 py-0.5 rounded-full bg-primary/90 backdrop-blur-md text-white text-[11px] font-bold shadow-md">
                                {post.category}
                              </div>
                            </div>

                            {/* Meta */}
                            <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3 text-primary" />
                                {post.readTime}
                              </span>
                              <span>
                                {new Date(post.publishedAt).toLocaleDateString(language === "ar" ? "ar-SA" : language === "hi" ? "hi-IN" : "en-US", {
                                  month: "short",
                                  day: "numeric",
                                })}
                              </span>
                            </div>

                            {/* Title & Excerpt */}
                            <div className="space-y-2">
                              <h3 className="text-base sm:text-lg font-bold font-heading text-white group-hover:text-primary transition-colors leading-snug line-clamp-2">
                                {post.title}
                              </h3>
                              <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                                {post.summary}
                              </p>
                            </div>
                          </div>

                          {/* Footer: Author & Actions */}
                          <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between">
                            <div
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                window.location.href = ROUTES.PORTFOLIO.PUBLIC(post.author.username)
                              }}
                              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                            >
                              <img
                                src={post.author.avatar}
                                alt={post.author.name}
                                className="w-7 h-7 rounded-full object-cover"
                              />
                              <span className="text-xs font-bold text-slate-200 truncate max-w-[120px]">
                                {post.author.name}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={(e) => handleLike(e, post.id)}
                                className={`flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                                  post.isLiked ? "text-red-400 bg-red-500/10" : "text-muted-foreground hover:text-red-400"
                                }`}
                              >
                                <Heart className={`w-3.5 h-3.5 ${post.isLiked ? "fill-red-400" : ""}`} />
                                <span>{post.likes}</span>
                              </button>

                              <button
                                onClick={(e) => handleShare(e, post)}
                                className="p-1 text-muted-foreground hover:text-white"
                              >
                                <Share2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </GlassCard>
                      </Link>
                    ))}
                  </div>
                )}
              </>
            )}

          </div>

          {/* ── Sidebar (4 Cols) ────────────────────────────────────── */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Trending Topics */}
            <GlassCard className="p-6 bg-card/40 border-white/5 rounded-3xl space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-white/5">
                <TrendingUp className="w-4 h-4 text-primary" />
                <h3 className="font-bold font-heading text-white text-sm">
                  {language === "ar" ? "المواضيع الشائعة في السوق" : language === "hi" ? "बाज़ार में ट्रेंडिंग विषय" : "Trending Career Topics"}
                </h3>
              </div>
              <div className="space-y-3">
                {trendingTopics.map((topic) => {
                  let displayTitle = topic.title
                  if (language === "hi") {
                    if (topic.title.includes("ATS")) displayTitle = "एटीएस और स्मार्ट फ़िल्टरिंग एल्गोरिदम"
                    else if (topic.title.includes("الرواتب")) displayTitle = "2026 में तकनीकी वेतन और वार्ता"
                    else if (topic.title.includes("فرق")) displayTitle = "सामूहिक भर्ती और तकनीकी टीमें"
                    else if (topic.title.includes("2030")) displayTitle = "विज़न 2030 और भविष्य की नौकरियाँ"
                  } else if (language === "en") {
                    if (topic.title.includes("ATS")) displayTitle = "ATS & Smart Filtering Algorithms"
                    else if (topic.title.includes("الرواتب")) displayTitle = "Tech Salaries & Negotiation 2026"
                    else if (topic.title.includes("فرق")) displayTitle = "Team Hiring & Pre-Built Squads"
                    else if (topic.title.includes("2030")) displayTitle = "Vision 2030 & Future of Work"
                  }

                  return (
                    <button
                      key={topic.id}
                      onClick={() => {
                        setSelectedCategory(topic.category)
                        window.scrollTo({ top: 250, behavior: "smooth" })
                      }}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-white/5 transition-colors text-start group"
                    >
                      <div>
                        <span className="text-xs font-bold text-white group-hover:text-primary block">
                          {displayTitle}
                        </span>
                        <span className="text-[11px] text-muted-foreground">{topic.category}</span>
                      </div>
                      <span className="text-xs font-mono text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-md">
                        {topic.posts}
                      </span>
                    </button>
                  )
                })}
              </div>
            </GlassCard>

            {/* Suggested Authors / Career Mentors */}
            <GlassCard className="p-6 bg-card/40 border-white/5 rounded-3xl space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-white/5">
                <Users className="w-4 h-4 text-sky-400" />
                <h3 className="font-bold font-heading text-white text-sm">
                  {language === "ar" ? "خبراء ومستشارون مميزون" : language === "hi" ? "विशेषज्ञ और करियर सलाहकार" : "Featured Authors & Mentors"}
                </h3>
              </div>
              <div className="space-y-4">
                {suggestedAuthors.map((author) => (
                  <div key={author.username} className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={author.avatar}
                        alt={author.name}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/20"
                      />
                      <div>
                        <div className="flex items-center gap-1">
                          <h4 className="text-xs font-bold text-white">{author.name}</h4>
                          {author.isVerified && <CheckCircle2 className="w-3 h-3 text-primary fill-primary" />}
                        </div>
                        <p className="text-[11px] text-muted-foreground truncate max-w-[130px]">{author.title}</p>
                      </div>
                    </div>

                    <Link to={ROUTES.PORTFOLIO.PUBLIC(author.username)}>
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-xl px-2.5 py-1 text-[11px] border-white/10 hover:border-primary/40 hover:bg-primary/10 text-primary"
                      >
                        {language === "ar" ? "المعرض" : language === "hi" ? "पोर्टफोलियो" : "Portfolio"}
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Newsletter Subscription Box */}
            <GlassCard className="p-6 bg-gradient-to-br from-primary/20 via-card/50 to-card/40 border-primary/30 rounded-3xl space-y-4 text-start">
              <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold font-heading text-white">
                  {language === "ar" ? "نشرة فائدة المهنية" : language === "hi" ? "फायदा साप्ताहिक अंतर्दृष्टि" : "Faeda Weekly Insights"}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {language === "ar"
                    ? "احصل على ملخص أسبوعي لأهم تقارير السوق، نصائح المقابلات، ومستجدات التوظيف مباشرة."
                    : language === "hi"
                    ? "साप्ताहिक वेतन विश्लेषण, एटीएस सुझाव और भर्ती रुझान सीधे अपने इनबॉक्स में प्राप्त करें।"
                    : "Receive weekly salary analyses, ATS recommendations, and hiring trends."}
                </p>
              </div>

              {isSubscribed ? (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{language === "ar" ? "أنت مشترك الآن بنجاح!" : language === "hi" ? "सफलतापूर्वक सदस्यता ले ली गई!" : "Subscribed successfully!"}</span>
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="space-y-2 pt-1">
                  <input
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/30 border border-white/10 text-white placeholder-muted-foreground text-xs focus:outline-none focus:border-primary"
                  />
                  <Button
                    type="submit"
                    className="w-full rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-bold py-2.5 shadow-md shadow-primary/20"
                  >
                    {language === "ar" ? "اشتراك مجاني" : language === "hi" ? "मुफ़्त सदस्यता लें" : "Subscribe"}
                  </Button>
                </form>
              )}
            </GlassCard>

          </div>

        </div>

      </div>

      {/* ── Create Article / Post Modal ──────────────────────────── */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl bg-[#0F2247] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative text-start max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="absolute top-5 end-5 p-2 rounded-xl text-muted-foreground hover:text-white hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-2 mb-6">
                <h3 className="text-xl font-bold font-heading text-white">
                  {language === "ar" ? "نشر مقال أو مشاركة تجربة مهنية" : language === "hi" ? "लेख प्रकाशित करें या अनुभव साझा करें" : "Publish Career Insight"}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {language === "ar"
                    ? "شارك معرفتك وخبراتك مع آلاف الكفاءات والشركات في منظومة فائدة."
                    : language === "hi"
                    ? "फायदा समुदाय में हजारों प्रतिभाओं और कंपनियों के साथ अपना ज्ञान साझा करें।"
                    : "Share your professional learnings with the wider community."}
                </p>
              </div>

              <form onSubmit={handleCreatePost} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">
                    {language === "ar" ? "عنوان المقال *" : language === "hi" ? "लेख का शीर्षक *" : "Article Title *"}
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder={
                      language === "ar"
                        ? "مثال: كيف تستعد للمقابلات التقنية في كبرى الشركات السعودية؟"
                        : language === "hi"
                        ? "उदा: बड़ी कंपनियों में तकनीकी साक्षात्कार की तैयारी कैसे करें?"
                        : "E.g. How to prepare for technical interviews in Saudi Arabia"
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground block mb-1">
                      {language === "ar" ? "التصنيف الرئيسي *" : language === "hi" ? "मुख्य श्रेणी *" : "Category *"}
                    </label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#081628] border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-primary"
                    >
                      <option value="السير الذاتية وATS">{language === "ar" ? "السير الذاتية وATS" : language === "hi" ? "बायोडाटा और ATS" : "ATS & Resumes"}</option>
                      <option value="السوق والرواتب">{language === "ar" ? "السوق والرواتب" : language === "hi" ? "बाज़ार और वेतन" : "Market & Salaries"}</option>
                      <option value="فرق العمل">{language === "ar" ? "فرق العمل" : language === "hi" ? "टीम वर्क" : "Team Dynamics"}</option>
                      <option value="رؤية 2030">{language === "ar" ? "رؤية 2030" : language === "hi" ? "विजन 2030" : "Vision 2030"}</option>
                      <option value="التطوير المهني">{language === "ar" ? "التطوير المهني" : language === "hi" ? "करियर विकास" : "Career Growth"}</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground block mb-1">
                      {language === "ar" ? "رابط صورة الغلاف (اختياري)" : language === "hi" ? "कवर इमेज लिंक (वैकल्पिक)" : "Cover Image URL (optional)"}
                    </label>
                    <input
                      type="url"
                      value={newCoverImage}
                      onChange={(e) => setNewCoverImage(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">
                    {language === "ar" ? "ملخص موجز" : language === "hi" ? "संक्षिप्त विवरण" : "Short Excerpt"}
                  </label>
                  <input
                    type="text"
                    value={newSummary}
                    onChange={(e) => setNewSummary(e.target.value)}
                    placeholder={
                      language === "ar"
                        ? "سطر أو سطرين يصفان الفائدة الأساسية من المقال..."
                        : language === "hi"
                        ? "लेख के मुख्य लाभ का वर्णन करने वाली एक या दो पंक्तियाँ..."
                        : "Brief overview of the article..."
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">
                    {language === "ar" ? "محتوى المقال كاملاً *" : language === "hi" ? "संपूर्ण लेख सामग्री *" : "Full Article Content *"}
                  </label>
                  <textarea
                    rows={8}
                    required
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    placeholder={
                      language === "ar"
                        ? "اكتب تفاصيل المقال، المحاور، النصائح العملية..."
                        : language === "hi"
                        ? "लेख का विवरण, मुख्य बिंदु, व्यावहारिक सुझाव लिखें..."
                        : "Write your complete guide and practical insights..."
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-primary resize-none leading-relaxed"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="rounded-xl border-white/10 text-xs sm:text-sm"
                  >
                    {language === "ar" ? "إلغاء" : language === "hi" ? "रद्द करें" : "Cancel"}
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmittingPost}
                    className="rounded-xl bg-primary text-white font-bold text-xs sm:text-sm px-6 flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>
                      {isSubmittingPost
                        ? (language === "ar" ? "جارٍ النشر..." : language === "hi" ? "प्रकाशित हो रहा है..." : "Publishing...")
                        : (language === "ar" ? "نشر المقال الآن" : language === "hi" ? "अभी प्रकाशित करें" : "Publish Article")}
                    </span>
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  )
}
export default PostsPage
