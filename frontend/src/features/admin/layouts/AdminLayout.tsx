/**
 * features/admin/layouts/AdminLayout.tsx
 *
 * Master layout for the Faeda Admin Governance Console.
 * Perfectly styled to match the main website's visual texture, ambient glows,
 * deep navy glassmorphism, and official brand components.
 */
import { useState } from "react"
import { Outlet, NavLink, Link, useNavigate, useLocation } from "react-router-dom"
import { ROUTES } from "@/config/routes"
import { useAuthStore } from "@/store/auth.store"
import { useTranslation } from "@/i18n"
import {
  LayoutDashboard,
  Users,
  Briefcase,
  ScrollText,
  ShieldAlert,
  Settings,
  FolderTree,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  Globe,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  Sparkles,
} from "lucide-react"
import faedaWhiteLogo from "@/assets/logos/faeda_white_logo.png"

export function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, logout } = useAuthStore()
  const { isRTL, language, toggleLanguage } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = async () => {
    await logout()
    navigate(ROUTES.AUTH.LOGIN)
  }

  const navItems = [
    {
      to: ROUTES.ADMIN.DASHBOARD,
      icon: LayoutDashboard,
      label_ar: "لوحة التحليلات",
      label_en: "Analytics Dashboard",
      end: true,
    },
    {
      to: ROUTES.ADMIN.USERS,
      icon: Users,
      label_ar: "إدارة المستخدمين",
      label_en: "User Management",
      end: false,
    },
    {
      to: ROUTES.ADMIN.JOBS,
      icon: Briefcase,
      label_ar: "مراجعة الوظائف",
      label_en: "Job Moderation",
      end: false,
    },
    {
      to: ROUTES.ADMIN.CATEGORIES,
      icon: FolderTree,
      label_ar: "الفلاتر والتصنيفات",
      label_en: "Taxonomy & Filters",
      end: false,
    },
    {
      to: ROUTES.ADMIN.REPORTS,
      icon: ShieldAlert,
      label_ar: "البلاغات وتذاكر الدعم",
      label_en: "Reports & Tickets",
      end: false,
    },
    {
      to: ROUTES.ADMIN.AUDIT_LOGS,
      icon: ScrollText,
      label_ar: "سجل التدقيق",
      label_en: "Audit Trail",
      end: false,
    },
    {
      to: ROUTES.ADMIN.SETTINGS,
      icon: Settings,
      label_ar: "إعدادات المنصة",
      label_en: "Platform Settings",
      end: false,
    },
  ]

  const ArrowIcon = isRTL ? ChevronLeft : ChevronRight

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/30 relative overflow-x-hidden">
      {/* ── Global Ambient Radial Glows (Same as Home.tsx) ────────── */}
      <div className="absolute top-[2%] right-[-5%] w-[650px] h-[650px] bg-primary/10 rounded-full blur-[180px] pointer-events-none -z-10" />
      <div className="absolute top-[30%] left-[-10%] w-[550px] h-[550px] bg-accent/5 rounded-full blur-[160px] pointer-events-none -z-10" />
      <div className="absolute top-[60%] right-[-5%] w-[600px] h-[600px] bg-[#0A2D8F]/20 rounded-full blur-[170px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-[-5%] w-[600px] h-[600px] bg-cyan-600/5 rounded-full blur-[180px] pointer-events-none -z-10" />

      {/* ── Topbar / Header (Exact match with Navbar.tsx) ─────────── */}
      <header className="sticky top-0 z-50 w-full border-b border-white/[0.06] bg-gradient-to-r from-background/95 via-[#0A2D8F]/15 to-background/95 backdrop-blur-2xl transition-all duration-300">
        <div className="max-w-7xl mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand Logo & Console Badge */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
              aria-label="Toggle Navigation"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <Link to={ROUTES.ADMIN.DASHBOARD} className="flex items-center gap-3 group">
              <img
                src={faedaWhiteLogo}
                alt="Faeda Logo"
                className="h-9 sm:h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-primary/15 border border-primary/30 text-primary shadow-sm shadow-primary/20">
                <Sparkles className="w-3 h-3 text-secondary" />
                <span>{language === "ar" ? "لوحة الإدارة العليا" : "Executive Admin"}</span>
              </span>
            </Link>
          </div>

          {/* Header Right Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* View Live Public Site */}
            <Link
              to={ROUTES.PUBLIC.HOME}
              target="_blank"
              className="hidden sm:inline-flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white px-3.5 py-2 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] hover:border-white/20 transition-all shadow-sm"
            >
              <ExternalLink className="w-3.5 h-3.5 text-primary" />
              <span>{language === "ar" ? "معاينة المنصة" : "View Live Site"}</span>
            </Link>

            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white px-3 py-2 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] transition-all"
              title="Change Language"
            >
              <Globe className="w-3.5 h-3.5 text-primary" />
              <span>{language === "ar" ? "English" : "العربية"}</span>
            </button>

            {/* Admin User Capsule */}
            <div className="flex items-center gap-3 pl-3 rtl:pl-0 rtl:pr-3 border-l rtl:border-l-0 rtl:border-r border-white/10">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary to-accent border border-primary/40 flex items-center justify-center text-white font-bold text-xs shadow-md shadow-primary/25">
                {user?.name ? user.name.slice(0, 2).toUpperCase() : "AD"}
              </div>
              <div className="hidden md:flex flex-col text-start">
                <span className="text-xs font-bold text-white flex items-center gap-1 leading-tight">
                  {user?.name || "مدير النظام"}
                  <ShieldCheck className="w-3.5 h-3.5 text-secondary" />
                </span>
                <span className="text-[10px] text-muted-foreground font-mono">
                  {user?.email || "admin@faeda.jobs"}
                </span>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all"
                title={language === "ar" ? "تسجيل الخروج" : "Logout"}
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Main Layout Workspace ─────────────────────────────────── */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1 flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
        {/* ── Sidebar (Desktop) ────────────────────────────────────── */}
        <aside className="hidden lg:flex flex-col w-64 shrink-0 sticky top-28">
          <div className="w-full rounded-3xl border border-white/10 bg-gradient-to-b from-card/90 via-card/70 to-card/50 backdrop-blur-2xl p-4 shadow-2xl shadow-black/40 relative overflow-hidden">
            {/* Subtle top inner glow highlight line */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent pointer-events-none" />

            {/* Sidebar Section Title */}
            <div className="px-3 pt-2 pb-3 flex items-center justify-between border-b border-white/5 mb-3">
              <span className="text-[11px] font-bold font-heading uppercase tracking-wider text-muted-foreground">
                {language === "ar" ? "بوابة الإدارة الموحدة" : "COMMAND MODULES"}
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            </div>

            {/* Navigation Links */}
            <nav className="flex flex-col gap-1.5">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive =
                  item.end
                    ? location.pathname === item.to
                    : location.pathname.startsWith(item.to)

                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    className={`flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition-all duration-200 group relative ${
                      isActive
                        ? "bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/30 font-extrabold"
                        : "text-muted-foreground hover:text-white hover:bg-white/[0.04]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-white/5 text-muted-foreground group-hover:text-primary group-hover:bg-primary/10"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="tracking-tight">
                        {language === "ar" ? item.label_ar : item.label_en}
                      </span>
                    </div>

                    <ArrowIcon
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        isActive
                          ? "opacity-100 translate-x-0"
                          : "opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0"
                      }`}
                    />
                  </NavLink>
                )
              })}
            </nav>

            {/* Sidebar Footer Live Status */}
            <div className="mt-5 pt-3.5 border-t border-white/5 px-3">
              <div className="flex items-center justify-between text-[11px] text-muted-foreground font-mono">
                <span>{language === "ar" ? "حالة النظام" : "System Status"}</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {language === "ar" ? "تشغيل طبيعي" : "Operational"}
                </span>
              </div>
            </div>
          </div>
        </aside>

        {/* ── Mobile Sidebar Drawer ─────────────────────────────────── */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden bg-black/80 backdrop-blur-md flex flex-col justify-end p-4">
            <div className="bg-card border border-white/10 rounded-3xl p-5 shadow-2xl space-y-3 max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom duration-300">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-sm font-bold text-white font-heading">
                  {language === "ar" ? "قائمة الإدارة" : "Admin Menu"}
                </span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-1.5 rounded-xl text-muted-foreground hover:text-white bg-white/5"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-1.5">
                {navItems.map((item) => {
                  const Icon = item.icon
                  const isActive =
                    item.end
                      ? location.pathname === item.to
                      : location.pathname.startsWith(item.to)

                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.end}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                        isActive
                          ? "bg-primary text-white shadow-lg shadow-primary/30"
                          : "text-muted-foreground hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{language === "ar" ? item.label_ar : item.label_en}</span>
                    </NavLink>
                  )
                })}
              </div>

              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 p-3 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-bold mt-4"
              >
                <LogOut className="w-4 h-4" />
                <span>{language === "ar" ? "تسجيل الخروج" : "Logout"}</span>
              </button>
            </div>
          </div>
        )}

        {/* ── Main Content Area ─────────────────────────────────────── */}
        <main className="flex-1 w-full min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
