/**
 * features/public/pages/PostDetailPage.tsx
 *
 * Full Article & Insight Detail view (/posts/:id).
 * Features rich formatted article content, author portfolio link,
 * interaction toolbar (likes, shares, bookmarks), interactive comment section,
 * and related articles recommendations.
 * Fully localized for Arabic (RTL), English (LTR), and Hindi (LTR).
 */
import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import {
  Clock,
  Eye,
  Heart,
  Share2,
  Bookmark,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Calendar,
  Send,
  MessageSquare,
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  BookOpen,
} from "lucide-react"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { postsService } from "../services/posts.service"
import type { PostArticle, PostComment } from "../types/posts.types"
import { ROUTES } from "@/config/routes"
import { useTranslation } from "@/i18n"
import { useAuthStore } from "@/store/auth.store"
import { getLocalizedPost } from "@/lib/localization.utils"
import toast from "react-hot-toast"

export function PostDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { language, isRTL } = useTranslation()
  const { user } = useAuthStore()

  const [post, setPost] = useState<PostArticle | null>(null)
  const [related, setRelated] = useState<PostArticle[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Like & Bookmark state
  const [isLiked, setIsLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(0)
  const [isBookmarked, setIsBookmarked] = useState(false)

  // Comment state
  const [comments, setComments] = useState<PostComment[]>([])
  const [commentText, setCommentText] = useState("")
  const [commentAuthor, setCommentAuthor] = useState("")
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)

  const ChevronIcon = isRTL ? ChevronRight : ChevronLeft
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight

  useEffect(() => {
    let isMounted = true
    async function loadPost() {
      if (!id) return
      setIsLoading(true)
      try {
        const res = await postsService.getPostDetail(id)
        if (isMounted && res.post) {
          setPost(res.post)
          setIsLiked(Boolean(res.post.isLiked))
          setLikesCount(res.post.likes || 0)
          setComments(res.post.comments || [])
          setRelated(res.related || [])
        }
      } catch {
        if (isMounted) setPost(null)
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }
    loadPost()
    return () => {
      isMounted = false
    }
  }, [id])

  const handleLike = async () => {
    if (!post) return
    const prevLiked = isLiked
    const prevCount = likesCount

    setIsLiked(!prevLiked)
    setLikesCount(prevLiked ? Math.max(0, prevCount - 1) : prevCount + 1)

    try {
      const res = await postsService.toggleLike(post.id)
      setIsLiked(res.isLiked)
      setLikesCount(res.likes)
    } catch {
      setIsLiked(prevLiked)
      setLikesCount(prevCount)
    }
  }

  const handleShare = () => {
    const url = window.location.href
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url)
      toast.success(
        language === "ar"
          ? "تم نسخ رابط المقال للمشاركة!"
          : language === "hi"
          ? "लेख का लिंक कॉपी किया गया!"
          : "Article link copied to clipboard!"
      )
    }
  }

  const handleToggleBookmark = () => {
    setIsBookmarked(!isBookmarked)
    toast.success(
      isBookmarked
        ? language === "ar"
          ? "تمت إزالة المقال من المحفوظات"
          : language === "hi"
          ? "बुकमार्क से हटाया गया"
          : "Removed from bookmarks"
        : language === "ar"
        ? "تم حفظ المقال في قائمتك المفضلة!"
        : language === "hi"
        ? "लेख आपकी पसंदीदा सूची में सहेजा गया!"
        : "Article saved to your bookmarks!"
    )
  }

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!post || !commentText.trim()) return

    setIsSubmittingComment(true)
    const authorNameToUse = commentAuthor.trim() || (user ? user.name || (language === "ar" ? "عضو مسجل" : language === "hi" ? "पंजीकृत सदस्य" : "Registered Member") : (language === "ar" ? "زائر مهتم" : language === "hi" ? "अतिथि पाठक" : "Guest Reader"))

    try {
      const res = await postsService.addComment(post.id, commentText.trim(), authorNameToUse)
      setComments((prev) => [...prev, res.comment])
      setCommentText("")
      toast.success(
        language === "ar"
          ? "تمت إضافة تعليقك بنجاح!"
          : language === "hi"
          ? "आपकी टिप्पणी सफलतापूर्वक जोड़ी गई!"
          : "Comment posted successfully!"
      )
    } catch {
      toast.error(
        language === "ar"
          ? "تعذر إرسال التعليق."
          : language === "hi"
          ? "टिप्पणी भेजने में विफल।"
          : "Failed to post comment."
      )
    } finally {
      setIsSubmittingComment(false)
    }
  }

  // Reactive localized versions
  const localizedPost = post ? getLocalizedPost(post, language) : null
  const localizedRelated = related.map((r) => getLocalizedPost(r, language))

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-6 animate-pulse text-start">
        <div className="h-6 w-48 bg-white/10 rounded-lg" />
        <div className="h-10 w-3/4 bg-white/15 rounded-xl" />
        <div className="h-96 w-full bg-card/60 rounded-3xl border border-white/5" />
        <div className="space-y-3">
          <div className="h-4 w-full bg-white/5 rounded" />
          <div className="h-4 w-5/6 bg-white/5 rounded" />
          <div className="h-4 w-4/6 bg-white/5 rounded" />
        </div>
      </div>
    )
  }

  if (!localizedPost) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-20 text-center">
        <GlassCard className="p-10 max-w-md bg-card/50 border-white/10 space-y-4">
          <BookOpen className="w-12 h-12 text-muted-foreground mx-auto opacity-50" />
          <h2 className="text-2xl font-bold font-heading text-white">
            {language === "ar" ? "المقال غير متوفر" : language === "hi" ? "लेख उपलब्ध नहीं है" : "Article Not Found"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {language === "ar"
              ? "ربما تم نقل هذا المقال أو حذفه."
              : language === "hi"
              ? "शायद यह लेख हटा दिया गया है या मौजूद नहीं है।"
              : "This article does not exist or was removed."}
          </p>
          <Link to="/posts">
            <Button className="rounded-xl px-6 bg-primary text-white font-bold text-sm mt-2">
              {language === "ar" ? "العودة إلى المقالات" : language === "hi" ? "लेखों पर वापस जाएँ" : "Back to Articles"}
            </Button>
          </Link>
        </GlassCard>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground pt-24 pb-20 relative selection:bg-primary/30">
      {/* Background ambient lighting */}
      <div className="absolute top-20 start-1/4 w-[600px] h-[350px] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl relative z-10 text-start space-y-8">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
          <Link to="/" className="hover:text-white transition-colors">
            {language === "ar" ? "الرئيسية" : language === "hi" ? "होम" : "Home"}
          </Link>
          <ChevronIcon className="w-4 h-4 text-white/20" />
          <Link to="/posts" className="hover:text-white transition-colors">
            {language === "ar" ? "المقالات والرؤى" : language === "hi" ? "लेख और अंतर्दृष्टि" : "Articles"}
          </Link>
          <ChevronIcon className="w-4 h-4 text-white/20" />
          <span className="text-primary font-bold truncate max-w-[200px] sm:max-w-xs">{localizedPost.title}</span>
        </nav>

        {/* ── Article Header ───────────────────────────────────────── */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/15 border border-primary/30 text-primary text-xs font-bold">
            {localizedPost.category}
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-white tracking-tight leading-tight">
            {localizedPost.title}
          </h1>

          <p className="text-base sm:text-lg text-slate-300 font-medium leading-relaxed">
            {localizedPost.summary}
          </p>

          {/* Meta Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-white/10">
            {/* Author */}
            <div className="flex items-center gap-3">
              <Link to={ROUTES.PORTFOLIO.PUBLIC(localizedPost.author.username)} className="group flex items-center gap-3">
                <img
                  src={localizedPost.author.avatar}
                  alt={localizedPost.author.name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/40 group-hover:scale-105 transition-transform"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-white group-hover:text-primary transition-colors">
                      {localizedPost.author.name}
                    </span>
                    {localizedPost.author.isVerified && <CheckCircle2 className="w-3.5 h-3.5 text-primary fill-primary" />}
                  </div>
                  <span className="text-xs text-muted-foreground block">{localizedPost.author.title}</span>
                </div>
              </Link>
              <Link
                to={ROUTES.PORTFOLIO.PUBLIC(localizedPost.author.username)}
                className="ms-3 hidden sm:inline-flex items-center gap-1 text-xs text-primary font-bold bg-primary/10 hover:bg-primary/20 px-2.5 py-1 rounded-lg border border-primary/20 transition-colors"
              >
                <span>{language === "ar" ? "المعرض المهني" : language === "hi" ? "पोर्टफोलियो" : "Portfolio"}</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>

            {/* Read Stats */}
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-primary" />
                {new Date(localizedPost.publishedAt).toLocaleDateString(language === "ar" ? "ar-SA" : language === "hi" ? "hi-IN" : "en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                {localizedPost.readTime}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-sky-400" />
                {localizedPost.views} {language === "ar" ? "قراءة" : language === "hi" ? "बार देखा गया" : "views"}
              </span>
            </div>
          </div>
        </div>

        {/* ── Main Cover Banner ────────────────────────────────────── */}
        <div className="w-full h-72 sm:h-96 rounded-3xl overflow-hidden shadow-2xl relative border border-white/10">
          <img
            src={localizedPost.coverImage}
            alt={localizedPost.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* ── Article Body Content ─────────────────────────────────── */}
        <GlassCard className="p-6 sm:p-10 md:p-12 bg-card/40 border-white/5 rounded-3xl shadow-xl space-y-6">
          <div className="prose prose-invert max-w-none text-slate-200 text-sm sm:text-base leading-relaxed space-y-6 whitespace-pre-line font-normal">
            {localizedPost.content}
          </div>

          {/* Tags */}
          {localizedPost.tags && localizedPost.tags.length > 0 && (
            <div className="pt-6 border-t border-white/10 flex flex-wrap items-center gap-2">
              <span className="text-xs text-muted-foreground">{language === "ar" ? "الكلمات المفتاحية:" : language === "hi" ? "टैग:" : "Tags:"}</span>
              {localizedPost.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-xs font-medium text-slate-300"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Interaction Bar */}
          <div className="pt-6 border-t border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                onClick={handleLike}
                variant="outline"
                className={`rounded-xl px-4 py-2 text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                  isLiked
                    ? "bg-red-500/10 text-red-400 border-red-500/30"
                    : "border-white/10 text-muted-foreground hover:text-white"
                }`}
              >
                <Heart className={`w-4 h-4 ${isLiked ? "fill-red-400" : ""}`} />
                <span>{likesCount}</span>
                <span className="hidden sm:inline">{language === "ar" ? "إعجاب" : language === "hi" ? "पसंद" : "Likes"}</span>
              </Button>

              <Button
                onClick={handleToggleBookmark}
                variant="outline"
                className={`rounded-xl px-4 py-2 text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                  isBookmarked
                    ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                    : "border-white/10 text-muted-foreground hover:text-white"
                }`}
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-amber-400" : ""}`} />
                <span className="hidden sm:inline">
                  {isBookmarked
                    ? language === "ar"
                      ? "محفوظ"
                      : language === "hi"
                      ? "सहेजा गया"
                      : "Saved"
                    : language === "ar"
                    ? "حفظ المقال"
                    : language === "hi"
                    ? "लेख सहेजें"
                    : "Bookmark"}
                </span>
              </Button>
            </div>

            <Button
              onClick={handleShare}
              variant="outline"
              className="rounded-xl px-4 py-2 text-xs sm:text-sm border-white/10 text-muted-foreground hover:text-white flex items-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              <span>{language === "ar" ? "مشاركة" : language === "hi" ? "साझा करें" : "Share"}</span>
            </Button>
          </div>
        </GlassCard>

        {/* ── Author Spotlight Card ────────────────────────────────── */}
        <GlassCard className="p-6 sm:p-8 bg-gradient-to-r from-card/60 via-primary/10 to-card/60 border-white/10 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <img
              src={localizedPost.author.avatar}
              alt={localizedPost.author.name}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-primary/30 shrink-0"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold font-heading text-white">{localizedPost.author.name}</h3>
                {localizedPost.author.isVerified && <CheckCircle2 className="w-4 h-4 text-primary fill-primary" />}
              </div>
              <p className="text-xs text-sky-200">{localizedPost.author.title}</p>
              <p className="text-[11px] text-muted-foreground">
                {language === "ar"
                  ? "كاتب ومستشار معتمد في شبكة فائدة للمسارات المهنية."
                  : language === "hi"
                  ? "फायदा करियर नेटवर्क में प्रमाणित लेखक और सलाहकार।"
                  : "Verified contributor in the Faeda Career Ecosystem."}
              </p>
            </div>
          </div>

          <Link to={ROUTES.PORTFOLIO.PUBLIC(localizedPost.author.username)} className="shrink-0 w-full sm:w-auto">
            <Button className="w-full sm:w-auto rounded-xl px-5 bg-primary hover:bg-primary/90 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
              <span>{language === "ar" ? "زيارة المعرض المهني" : language === "hi" ? "पोर्टफोलियो देखें" : "View Portfolio"}</span>
              <ArrowIcon className="w-4 h-4" />
            </Button>
          </Link>
        </GlassCard>

        {/* ── Discussion & Comments Section ────────────────────────── */}
        <div className="space-y-6 pt-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            <h3 className="text-xl font-bold font-heading text-white">
              {language === "ar"
                ? `النقاش والتعليقات (${comments.length})`
                : language === "hi"
                ? `चर्चा और टिप्पणियाँ (${comments.length})`
                : `Discussion & Comments (${comments.length})`}
            </h3>
          </div>

          {/* Add Comment Form */}
          <GlassCard className="p-5 sm:p-6 bg-card/40 border-white/5 rounded-2xl space-y-4">
            <form onSubmit={handleAddComment} className="space-y-3">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={commentAuthor}
                  onChange={(e) => setCommentAuthor(e.target.value)}
                  placeholder={language === "ar" ? "اسمك (اختياري)" : language === "hi" ? "आपका नाम (वैकल्पिक)" : "Your name (optional)"}
                  className="w-full sm:w-64 px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-primary"
                />
              </div>
              <textarea
                rows={3}
                required
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder={
                  language === "ar"
                    ? "شارك برأيك أو تجربتك حول هذا الموضوع..."
                    : language === "hi"
                    ? "इस विषय पर अपने विचार या करियर अनुभव साझा करें..."
                    : "Share your thoughts or career experience on this topic..."
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-primary resize-none leading-relaxed"
              />
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isSubmittingComment}
                  className="rounded-xl bg-primary text-white font-bold text-xs sm:text-sm px-5 flex items-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>
                    {isSubmittingComment
                      ? (language === "ar" ? "جارٍ النشر..." : language === "hi" ? "प्रकाशित हो रहा है..." : "Posting...")
                      : (language === "ar" ? "إضافة تعليق" : language === "hi" ? "टिप्पणी जोड़ें" : "Post Comment")}
                  </span>
                </Button>
              </div>
            </form>
          </GlassCard>

          {/* Existing Comments List */}
          <div className="space-y-3">
            {comments.map((comm) => (
              <GlassCard key={comm.id} className="p-4 sm:p-5 bg-card/30 border-white/5 rounded-2xl">
                <div className="flex items-start gap-3">
                  <img
                    src={comm.avatar}
                    alt={comm.author}
                    className="w-9 h-9 rounded-full object-cover shrink-0 ring-1 ring-white/10"
                  />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{comm.author}</span>
                      <span className="text-[11px] text-muted-foreground">{comm.time}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                      {comm.text}
                    </p>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* ── Related Articles ─────────────────────────────────────── */}
        {localizedRelated.length > 0 && (
          <div className="space-y-6 pt-10 border-t border-white/10">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold font-heading text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                <span>
                  {language === "ar"
                    ? "مقالات ذات صلة قد تهمك"
                    : language === "hi"
                    ? "संबंधित लेख जो आपको पसंद आ सकते हैं"
                    : "Related Articles"}
                </span>
              </h3>
              <Link to="/posts" className="text-xs sm:text-sm text-primary font-bold hover:underline">
                {language === "ar" ? "تصفح الكل" : language === "hi" ? "सभी देखें" : "View All"}
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {localizedRelated.map((rel) => (
                <Link key={rel.id} to={`/posts/${rel.id}`} className="block group">
                  <GlassCard className="h-full p-4 bg-card/40 border-white/5 hover:border-primary/40 rounded-2xl flex flex-col justify-between transition-all group-hover:-translate-y-1">
                    <div className="space-y-3">
                      <div className="h-32 w-full rounded-xl overflow-hidden">
                        <img
                          src={rel.coverImage}
                          alt={rel.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <span className="text-[10px] font-bold text-primary block">{rel.category}</span>
                      <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-primary transition-colors line-clamp-2">
                        {rel.title}
                      </h4>
                    </div>
                    <div className="pt-3 mt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-muted-foreground">
                      <span>{rel.readTime}</span>
                      <ArrowIcon className="w-3.5 h-3.5 text-primary" />
                    </div>
                  </GlassCard>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
export default PostDetailPage

