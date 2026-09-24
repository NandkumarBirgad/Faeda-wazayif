/**
 * features/admin/pages/AdminDashboardPage.tsx
 *
 * Executive Analytics & Governance Overview for Faeda Administrators.
 * Perfectly styled to match the main website's look, colors, textures, and cards.
 */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Link } from "react-router-dom"
import { useTranslation } from "@/i18n"
import { adminService } from "../services/admin.service"
import { ROUTES } from "@/config/routes"
import {
  Users,
  Briefcase,
  ShieldAlert,
  Building2,
  GraduationCap,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowUpRight,
  Sparkles,
  Loader2,
  AlertCircle,
  ScrollText,
  FolderTree,
  Headphones,
  Settings,
} from "lucide-react"

export function AdminDashboardPage() {
  const { language } = useTranslation()
  const queryClient = useQueryClient()

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: () => adminService.getDashboard(),
  })

  // Approve / Reject Job Mutation
  const jobStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: "approved" | "rejected" }) =>
      adminService.updateJobStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] })
      queryClient.invalidateQueries({ queryKey: ["admin", "jobs"] })
    },
  })

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-sm text-muted-foreground font-mono">
          {language === "ar" ? "جاري تحميل بيانات لوحة الإدارة..." : "Loading governance metrics..."}
        </p>
      </div>
    )
  }

  if (isError || !data || !data.success) {
    return (
      <div className="p-8 rounded-3xl bg-red-500/10 border border-red-500/20 text-center max-w-xl mx-auto my-12 space-y-4">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
        <h2 className="text-xl font-bold font-heading text-white">
          {language === "ar" ? "تعذر تحميل مؤشرات الإدارة" : "Failed to load governance metrics"}
        </h2>
        <p className="text-sm text-muted-foreground">
          {error instanceof Error ? error.message : "حدث خطأ غير متوقع. يرجى التأكد من صلاحيات حسابك."}
        </p>
        <button
          onClick={() => refetch()}
          className="px-6 py-2.5 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25"
        >
          {language === "ar" ? "إعادة المحاولة" : "Retry"}
        </button>
      </div>
    )
  }

  const { stats, pending_jobs, recent_logs, admin } = data

  const statCards = [
    {
      title_ar: "إجمالي المستخدمين",
      title_en: "Total Users",
      value: stats.total_users,
      subtitle_ar: `${stats.total_candidates} كفاءة • ${stats.total_companies} منشأة`,
      subtitle_en: `${stats.total_candidates} candidates • ${stats.total_companies} companies`,
      icon: Users,
      glowColor: "from-blue-600/20 to-cyan-500/20",
      iconColor: "text-blue-400",
      link: ROUTES.ADMIN.USERS,
    },
    {
      title_ar: "الوظائف النشطة",
      title_en: "Active Jobs",
      value: stats.active_jobs,
      subtitle_ar: `من أصل ${stats.total_jobs} وظيفة معتمدة`,
      subtitle_en: `Out of ${stats.total_jobs} total posted`,
      icon: Briefcase,
      glowColor: "from-emerald-600/20 to-teal-500/20",
      iconColor: "text-emerald-400",
      link: ROUTES.ADMIN.JOBS,
    },
    {
      title_ar: "الشركات الموثقة",
      title_en: "Verified Companies",
      value: stats.verified_companies,
      subtitle_ar: `${stats.pending_companies} قيد التحقق والاعتماد`,
      subtitle_en: `${stats.pending_companies} pending review`,
      icon: Building2,
      glowColor: "from-sky-600/20 to-primary/20",
      iconColor: "text-sky-400",
      link: ROUTES.ADMIN.USERS,
    },
    {
      title_ar: "الجامعات والكليات",
      title_en: "Universities",
      value: stats.total_universities,
      subtitle_ar: "مؤسسات تعليمية وأكاديمية",
      subtitle_en: "Partner institutions",
      icon: GraduationCap,
      glowColor: "from-purple-600/20 to-indigo-500/20",
      iconColor: "text-purple-400",
      link: ROUTES.ADMIN.USERS,
    },
    {
      title_ar: "وظائف بانتظار المراجعة",
      title_en: "Pending Moderation",
      value: stats.pending_jobs,
      subtitle_ar: stats.pending_jobs > 0 ? "تتطلب قرار فوري" : "قائمة الفرز نظيفة",
      subtitle_en: stats.pending_jobs > 0 ? "Requires action" : "All clean",
      icon: Clock,
      glowColor: "from-amber-600/20 to-orange-500/20",
      iconColor: "text-amber-400",
      link: ROUTES.ADMIN.JOBS,
    },
    {
      title_ar: "بلاغات المخالفات",
      title_en: "Abuse Reports",
      value: stats.total_reports,
      subtitle_ar: `${stats.pending_reports} بلاغ مفتوح`,
      subtitle_en: `${stats.pending_reports} open tickets`,
      icon: ShieldAlert,
      glowColor: "from-rose-600/20 to-red-500/20",
      iconColor: "text-rose-400",
      link: ROUTES.ADMIN.REPORTS,
    },
  ]

  const quickLinks = [
    {
      title_ar: "المستخدمين",
      title_en: "Users",
      icon: Users,
      to: ROUTES.ADMIN.USERS,
      color: "text-blue-400",
    },
    {
      title_ar: "مراجعة الوظائف",
      title_en: "Jobs",
      icon: Briefcase,
      to: ROUTES.ADMIN.JOBS,
      color: "text-emerald-400",
    },
    {
      title_ar: "الفلاتر والتصنيفات",
      title_en: "Taxonomy",
      icon: FolderTree,
      to: ROUTES.ADMIN.CATEGORIES,
      color: "text-secondary",
    },
    {
      title_ar: "البلاغات وتذاكر الدعم",
      title_en: "Tickets & Reports",
      icon: Headphones,
      to: ROUTES.ADMIN.REPORTS,
      color: "text-amber-400",
    },
    {
      title_ar: "سجل التدقيق",
      title_en: "Audit Trail",
      icon: ScrollText,
      to: ROUTES.ADMIN.AUDIT_LOGS,
      color: "text-purple-400",
    },
    {
      title_ar: "إعدادات المنصة",
      title_en: "Settings",
      icon: Settings,
      to: ROUTES.ADMIN.SETTINGS,
      color: "text-slate-300",
    },
  ]

  return (
    <div className="space-y-8 pb-12">
      {/* ── Top Greeting Hero ───────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-primary/10 border border-primary/25 text-primary mb-3 shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-secondary" />
            <span>{language === "ar" ? "نظام حوكمة وإدارة منصة فائدة" : "Unified Faeda Platform Governance"}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-white tracking-tight leading-tight">
            {language === "ar" ? `مرحباً، ${admin?.username || "مدير النظام"}` : `Welcome, ${admin?.username || "Administrator"}`}
          </h1>
          <p className="text-muted-foreground text-sm mt-1 max-w-xl">
            {language === "ar"
              ? "مؤشرات أداء المنصة المباشرة، وقوائم مراجعة الإعلانات، وسجل العمليات الإدارية."
              : "Live platform KPIs, job approval queues, and complete executive audit trail."}
          </p>
        </div>

        {/* Executive Action Badge */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <span className="px-4 py-2 rounded-2xl bg-white/[0.04] border border-white/10 text-xs font-semibold text-slate-300 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            <span>{admin?.role_label || admin?.role || "Super Admin"}</span>
          </span>
        </div>
      </div>

      {/* ── Quick Module Jump Strip ─────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {quickLinks.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.to}
              to={item.to}
              className="flex items-center gap-3 p-3.5 rounded-2xl bg-card/60 hover:bg-card border border-white/5 hover:border-primary/40 backdrop-blur-xl transition-all duration-200 group hover:-translate-y-0.5 shadow-lg shadow-black/20"
            >
              <div className="w-9 h-9 rounded-xl bg-white/5 group-hover:bg-primary/15 flex items-center justify-center transition-colors">
                <Icon className={`w-4 h-4 ${item.color} group-hover:scale-110 transition-transform`} />
              </div>
              <span className="text-xs font-bold text-slate-200 group-hover:text-white transition-colors truncate">
                {language === "ar" ? item.title_ar : item.title_en}
              </span>
            </Link>
          )
        })}
      </div>

      {/* ── 6 KPI Metric Cards (Main Web GlassCard Style) ──────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {statCards.map((card) => {
          const Icon = card.icon
          return (
            <Link
              key={card.title_en}
              to={card.link}
              className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-card/90 via-card/60 to-card/40 backdrop-blur-xl p-6 shadow-xl shadow-black/25 hover:-translate-y-1.5 hover:border-primary/40 transition-all duration-300 group"
            >
              {/* Subtle top inner highlight */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />

              {/* Ambient colored hover glow orb */}
              <div className={`absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br ${card.glowColor} rounded-full blur-3xl group-hover:scale-150 transition-transform duration-500 pointer-events-none`} />

              <div className="flex items-start justify-between mb-4 relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary/25 to-secondary/25 border border-primary/30 flex items-center justify-center text-primary group-hover:scale-110 transition-transform shadow-md shadow-primary/20">
                  <Icon className={`w-6 h-6 ${card.iconColor}`} />
                </div>
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground group-hover:text-white group-hover:bg-primary/20 transition-all">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>

              <div className="space-y-1 relative z-10">
                <p className="text-xs font-bold text-muted-foreground">
                  {language === "ar" ? card.title_ar : card.title_en}
                </p>
                <p className="text-3xl sm:text-4xl font-extrabold font-heading text-white tracking-tight">
                  {card.value.toLocaleString()}
                </p>
                <p className="text-[11px] text-muted-foreground/80 font-medium pt-1">
                  {language === "ar" ? card.subtitle_ar : card.subtitle_en}
                </p>
              </div>
            </Link>
          )
        })}
      </div>

      {/* ── Pending Moderation Queue & Audit Log Grid ───────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Jobs Queue */}
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-card/85 via-card/55 to-card/35 backdrop-blur-xl p-6 shadow-2xl space-y-4">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />

          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold font-heading text-white">
                  {language === "ar" ? "وظائف بانتظار الاعتماد" : "Pending Job Approvals"}
                </h3>
                <p className="text-[11px] text-muted-foreground">
                  {language === "ar" ? "تحتاج إلى مراجعة قبل ظهورها للمرشحين" : "Requires moderation before publication"}
                </p>
              </div>
            </div>
            <Link
              to={ROUTES.ADMIN.JOBS}
              className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
            >
              <span>{language === "ar" ? "عرض الكل" : "View All"}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {pending_jobs.length === 0 ? (
            <div className="py-12 text-center text-xs text-muted-foreground flex flex-col items-center gap-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-400/80 mb-1" />
              <span className="font-bold text-white text-sm">
                {language === "ar" ? "قائمة المراجعة مكتملة!" : "Queue is Clear!"}
              </span>
              <span>
                {language === "ar" ? "لا توجد وظائف معلقة بانتظار الاعتماد حالياً." : "No pending job postings awaiting moderation."}
              </span>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {pending_jobs.map((job) => (
                <div
                  key={job.id}
                  className="py-3.5 flex items-center justify-between gap-3 hover:bg-white/[0.02] rounded-xl px-2 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center font-bold text-xs text-white shrink-0">
                      {job.company_name?.[0] || "C"}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate hover:text-primary transition-colors">
                        {job.title}
                      </p>
                      <p className="text-[10px] text-muted-foreground flex items-center gap-2 mt-0.5">
                        <span className="text-primary font-medium">{job.company_name}</span>
                        <span>•</span>
                        <span>{job.town}</span>
                        <span>•</span>
                        <span>{job.job_type}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => jobStatusMutation.mutate({ id: job.id, status: "approved" })}
                      disabled={jobStatusMutation.isPending}
                      className="p-2 rounded-xl bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 border border-emerald-500/20 transition-colors"
                      title={language === "ar" ? "اعتماد فوري" : "Instant Approve"}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => jobStatusMutation.mutate({ id: job.id, status: "rejected" })}
                      disabled={jobStatusMutation.isPending}
                      className="p-2 rounded-xl bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 border border-rose-500/20 transition-colors"
                      title={language === "ar" ? "رفض" : "Reject"}
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Audit Trail */}
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-card/85 via-card/55 to-card/35 backdrop-blur-xl p-6 shadow-2xl space-y-4">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />

          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <ScrollText className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold font-heading text-white">
                  {language === "ar" ? "آخر العمليات والأنشطة" : "Recent Audit Trail"}
                </h3>
                <p className="text-[11px] text-muted-foreground">
                  {language === "ar" ? "سجل فوري ومؤمن لكافة قرارات الإدارة" : "Real-time log of administrative decisions"}
                </p>
              </div>
            </div>
            <Link
              to={ROUTES.ADMIN.AUDIT_LOGS}
              className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
            >
              <span>{language === "ar" ? "عرض السجل" : "View Logs"}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recent_logs.length === 0 ? (
            <div className="py-12 text-center text-xs text-muted-foreground">
              {language === "ar" ? "لا توجد عمليات مسجلة حديثاً." : "No recent operations logged."}
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {recent_logs.slice(0, 5).map((log) => (
                <div
                  key={log.id}
                  className="py-3 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-0.5 min-w-0">
                    <p className="font-bold text-white flex items-center gap-2 truncate">
                      <span className="w-2 h-2 rounded-full bg-primary" />
                      <span>{log.action_label || log.action}</span>
                    </p>
                    <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                      <span className="text-primary font-medium">{log.admin_name}</span>
                      <span>•</span>
                      <span className="font-mono text-[10px]">{log.ip_address || "127.0.0.1"}</span>
                    </p>
                  </div>

                  <span className="text-[11px] text-muted-foreground font-mono shrink-0">
                    {log.created_at ? new Date(log.created_at).toLocaleTimeString() : "—"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
