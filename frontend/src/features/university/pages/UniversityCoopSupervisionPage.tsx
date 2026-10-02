/**
 * features/university/pages/UniversityCoopSupervisionPage.tsx
 *
 * Cooperative Training (التدريب التعاوني) & Professor Supervision Command Center.
 * Dedicated workspace for academic professors supervising graduating seniors:
 * - Professor profile and supervised students count
 * - Professor's supervision schedule & site visits calendar
 * - Comprehensive student roster detailing: Full Name, Major, Company Name, Trainer Name, Trainer Specialization, Company Location
 * - Academic evaluation scoring and progress tracking
 */
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useTranslation } from "@/i18n"
import { universityService } from "../services/university.service"
import type {
  CoopSupervisedStudent,
  ProfessorSupervisionScheduleItem,
  ProfessorInfo,
  CreateCoopStudentPayload,
  CoopEvaluationPayload,
  CreateCoopSchedulePayload,
} from "../types/university.types"
import { CoopStudentDetailModal } from "../components/CoopStudentDetailModal"
import { getLocalizedCoopStudents, getLocalizedSchedules, tl } from "../utils/universityLocalization"
import {
  UserCheck,
  Calendar,
  Building,
  GraduationCap,
  MapPin,
  Clock,
  Award,
  Users,
  Plus,
  X,
  Search,
  Loader2,
  FileCheck,
} from "lucide-react"


const DEFAULT_PROFESSOR: ProfessorInfo = {
  professor_id: "prof_khalid_sulaiman",
  name: "د. خالد بن إبراهيم السليمان",
  title: "أستاذ مشارك - المشرف الأكاديمي للتدريب التعاوني",
  email: "k.sulaiman@kfu.edu.sa",
  department: "كلية علوم الحاسب وتقنية المعلومات",
  university_name: "جامعة الملك فيصل",
  supervised_students_count: 5,
  active_companies_count: 4,
  pending_evaluations_count: 2,
  scheduled_visits_count: 4,
}

const DEFAULT_STUDENTS: CoopSupervisedStudent[] = [
  {
    id: 1,
    university_id: 1,
    professor_id: "prof_khalid_sulaiman",
    professor_name: "د. خالد بن إبراهيم السليمان",
    professor_title: "أستاذ مشارك - المشرف الأكاديمي للتدريب التعاوني",
    professor_email: "k.sulaiman@kfu.edu.sa",
    professor_department: "كلية علوم الحاسب وتقنية المعلومات",
    student_name: "عمر بن خالد المنصور",
    student_id_number: "220108342",
    student_major: "هندسة البرمجيات والأنظمة الموزعة",
    company_name: "شركة أرامكو السعودية (Saudi Aramco)",
    company_location: "الظهران - مركز الأبحاث المتقدمة والابتكار",
    trainer_name: "م. فيصل بن طارق الشمري",
    trainer_specialization: "خبير أول مهندسي السحابة وحلول DevOps",
    trainer_phone: "+966551234567",
    trainer_email: "faisal.shammari@aramco.com",
    training_start_date: "2026-06-01",
    training_end_date: "2026-10-31",
    total_required_hours: 400,
    completed_hours: 310,
    progress_percentage: 78,
    midterm_score: 28,
    final_score: null,
    status: "تدريب نشط",
    notes: "طالب متميز يظهر التزاماً استثنائياً في بيئة العمل، سريع التعلم لتقنيات الفريق ومبادرة متميزة في إنجاز المهام البرمجية."
  },
  {
    id: 2,
    university_id: 1,
    professor_id: "prof_khalid_sulaiman",
    professor_name: "د. خالد بن إبراهيم السليمان",
    professor_title: "أستاذ مشارك - المشرف الأكاديمي للتدريب التعاوني",
    professor_email: "k.sulaiman@kfu.edu.sa",
    professor_department: "كلية علوم الحاسب وتقنية المعلومات",
    student_name: "سارة بنت منصور العتيبي",
    student_id_number: "220104521",
    student_major: "الذكاء الاصطناعي وعلم البيانات",
    company_name: "شركة علم (Elm)",
    company_location: "الرياض - واحة التقنية ومجمع الابتكار",
    trainer_name: "د. نورة بنت سعد السبيعي",
    trainer_specialization: "رئيسة أبحاث وتطبيقات التعلم الآلي",
    trainer_phone: "+966553456789",
    trainer_email: "noura.subaie@elm.sa",
    training_start_date: "2026-06-01",
    training_end_date: "2026-10-31",
    total_required_hours: 400,
    completed_hours: 345,
    progress_percentage: 86,
    midterm_score: 29,
    final_score: null,
    status: "تدريب نشط",
    notes: "مشاركة فاعلة في تحليل نماذج اللغة الضخمة وتطوير أنظمة الاسترجاع المعزز بالتوليد."
  },
  {
    id: 3,
    university_id: 1,
    professor_id: "prof_khalid_sulaiman",
    professor_name: "د. خالد بن إبراهيم السليمان",
    professor_title: "أستاذ مشارك - المشرف الأكاديمي للتدريب التعاوني",
    professor_email: "k.sulaiman@kfu.edu.sa",
    professor_department: "كلية علوم الحاسب وتقنية المعلومات",
    student_name: "ريم بنت فهد الحليبي",
    student_id_number: "220109981",
    student_major: "الأمن السيبراني والتحري الرقمي",
    company_name: "شركة stc حلول (Solutions by stc)",
    company_location: "الدمام - برج حلول للاتصالات وتقنية المعلومات",
    trainer_name: "م. تركي بن سعد العتيبي",
    trainer_specialization: "مدير مركز العمليات الأمنية السيبرانية (SOC Manager)",
    trainer_phone: "+966559876543",
    trainer_email: "turki.otaibi@solutions.com.sa",
    training_start_date: "2026-05-15",
    training_end_date: "2026-09-30",
    total_required_hours: 400,
    completed_hours: 400,
    progress_percentage: 100,
    midterm_score: 30,
    final_score: 68,
    status: "مكتمل معتمد",
    notes: "أنهت كامل الساعات التدريبية بتميز وقدمت مشروعاً ميدانياً في الكشف التلقائي عن الثغرات."
  },
  {
    id: 4,
    university_id: 1,
    professor_id: "prof_khalid_sulaiman",
    professor_name: "د. خالد بن إبراهيم السليمان",
    professor_title: "أستاذ مشارك - المشرف الأكاديمي للتدريب التعاوني",
    professor_email: "k.sulaiman@kfu.edu.sa",
    professor_department: "كلية علوم الحاسب وتقنية المعلومات",
    student_name: "أحمد بن عبد الرحمن الملحم",
    student_id_number: "220107223",
    student_major: "نظم المعلومات الإدارية والتحول الرقمي",
    company_name: "شركة المراعي - قطاع الأتمتة وسلاسل الإمداد",
    company_location: "الهفوف، الأحساء - المنطقة الصناعية الأولى",
    trainer_name: "أ. ماجد بن عبد العزيز التميمي",
    trainer_specialization: "خبير أنظمة ERP والتحول الرقمي المؤسسي",
    trainer_phone: "+966554321987",
    trainer_email: "majed.tamimi@almarai.com",
    training_start_date: "2026-06-01",
    training_end_date: "2026-10-31",
    total_required_hours: 400,
    completed_hours: 290,
    progress_percentage: 73,
    midterm_score: 27,
    final_score: null,
    status: "تدريب نشط",
    notes: "أداء ممتاز في نمذجة وتوثيق العمليات التشغيلية وسلاسل الإمداد المبرد."
  },
  {
    id: 5,
    university_id: 1,
    professor_id: "prof_khalid_sulaiman",
    professor_name: "د. خالد بن إبراهيم السليمان",
    professor_title: "أستاذ مشارك - المشرف الأكاديمي للتدريب التعاوني",
    professor_email: "k.sulaiman@kfu.edu.sa",
    professor_department: "كلية علوم الحاسب وتقنية المعلومات",
    student_name: "منى بنت عيسى الغنام",
    student_id_number: "220103114",
    student_major: "علوم الحاسب - هندسة وتصميم تجربة المستخدم",
    company_name: "مصرف الإنماء - الإدارة الرقمية وتقنية المعلومات",
    company_location: "الرياض - طريق الملك فهد، المركز المالي",
    trainer_name: "م. ريان بن خالد السيف",
    trainer_specialization: "رئيس فريق التصميم وتجربة المستخدم الرقمية (Head of UX)",
    trainer_phone: "+966556543210",
    trainer_email: "rayan.seif@alinma.com",
    training_start_date: "2026-06-01",
    training_end_date: "2026-10-30",
    total_required_hours: 400,
    completed_hours: 360,
    progress_percentage: 90,
    midterm_score: 29,
    final_score: null,
    status: "تدريب نشط",
    notes: "مبادرة واعدة وتصاميم واجهات احترافية لخدمات الدفع والتحويل المصرفي الفوري."
  }
]

const DEFAULT_SCHEDULES: ProfessorSupervisionScheduleItem[] = [
  {
    id: 1,
    university_id: 1,
    supervision_id: 1,
    professor_id: "prof_khalid_sulaiman",
    date_time: "2026-10-06 10:30 ص",
    event_type: "زيارة إشرافية ميدانية للشركة",
    student_name: "عمر بن خالد المنصور",
    company_name: "شركة أرامكو السعودية (Saudi Aramco)",
    location: "الظهران - مركز الأبحاث المتقدمة والابتكار",
    status: "مجدولة",
    notes: "زيارة ميدانية رسمية لمقر أرامكو بالأحساء/الظهران للاجتماع مع المدرب الميداني م. فيصل الشمري."
  },
  {
    id: 2,
    university_id: 1,
    supervision_id: 2,
    professor_id: "prof_khalid_sulaiman",
    date_time: "2026-10-08 01:00 م",
    event_type: "جلسة متابعة افتراضية عبر المنصة",
    student_name: "سارة بنت منصور العتيبي",
    company_name: "شركة علم (Elm)",
    location: "اتصال مرئي مباشر (Microsoft Teams)",
    status: "مجدولة",
    notes: "مراجعة تقدم نموذج الذكاء الاصطناعي والتحقق من التقرير الدوري الخامس."
  },
  {
    id: 3,
    university_id: 1,
    supervision_id: 4,
    professor_id: "prof_khalid_sulaiman",
    date_time: "2026-10-12 11:00 ص",
    event_type: "زيارة إشرافية ميدانية لمقر جهة التدريب",
    student_name: "أحمد بن عبد الرحمن الملحم",
    company_name: "شركة المراعي",
    location: "الهفوف، الأحساء - المنطقة الصناعية الأولى",
    status: "مجدولة",
    notes: "الاطلاع على تطبيق الطالب لنظم تخطيط الموارد في مستودعات المراعي بالهفوف."
  },
  {
    id: 4,
    university_id: 1,
    supervision_id: 3,
    professor_id: "prof_khalid_sulaiman",
    date_time: "2026-10-15 02:30 م",
    event_type: "مناقشة التقرير الفني النهائي والتقييم الختامي",
    student_name: "ريم بنت فهد الحليبي",
    company_name: "شركة stc حلول (Solutions by stc)",
    location: "قاعة السمينار 204 - كلية علوم الحاسب وتقنية المعلومات",
    status: "مجدولة",
    notes: "مناقشة حضورية للتقرير النهائي بحضور ممثل من شركة stc حلول."
  }
]

export function UniversityCoopSupervisionPage() {
  const { isRTL, language } = useTranslation()
  const [professor, setProfessor] = useState<ProfessorInfo | null>(null)
  const [students, setStudents] = useState<CoopSupervisedStudent[]>([])
  const [schedules, setSchedules] = useState<ProfessorSupervisionScheduleItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState<"students" | "schedule">("students")

  // Modals state
  const [isEnrollOpen, setIsEnrollOpen] = useState(false)
  const [isScheduleOpen, setIsScheduleOpen] = useState(false)
  const [evalTarget, setEvalTarget] = useState<CoopSupervisedStudent | null>(null)
  const [studentDetailTarget, setStudentDetailTarget] = useState<CoopSupervisedStudent | null>(null)
  const [scheduleSubFilter, setScheduleSubFilter] = useState<"all" | "upcoming" | "completed" | "pending">("all")

  // Forms state
  const [enrollForm, setEnrollForm] = useState<CreateCoopStudentPayload>({
    student_name: "",
    student_id_number: "",
    student_major: "هندسة البرمجيات والأنظمة الموزعة",
    company_name: "",
    company_location: "",
    trainer_name: "",
    trainer_specialization: "",
    trainer_phone: "",
    trainer_email: "",
    total_required_hours: 400,
    completed_hours: 120,
    notes: "",
  })

  const [evalForm, setEvalForm] = useState<CoopEvaluationPayload>({
    midterm_score: 28,
    final_score: 65,
    completed_hours: 380,
    status: "تدريب نشط",
    notes: "أداء متميز وتفاعل إيجابي مع فريق العمل.",
  })

  const [scheduleForm, setScheduleForm] = useState<CreateCoopSchedulePayload & {
    visit_mode?: "on_site" | "virtual"
    agenda?: string
    visit_time?: string
    visit_date?: string
  }>({
    date_time: "2026-10-22 10:30 ص",
    event_type: "زيارة إشرافية ميدانية للشركة",
    visit_mode: "on_site",
    student_name: "",
    company_name: "",
    location: "",
    agenda: "مراجعة المهام المنجزة وتقييم الأداء الميداني مع المدرب بالشركة",
    notes: "",
    visit_date: "2026-10-22",
    visit_time: "10:30",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const res = await universityService.getCoopSupervision()
      if (res.success) {
        setProfessor(res.professor)
        setStudents(res.students)
        setSchedules(res.schedules)
      }
    } catch {
      // Fallback
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleEnrollSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!enrollForm.student_name.trim() || !enrollForm.company_name.trim() || !enrollForm.trainer_name.trim()) return

    setIsSubmitting(true)
    try {
      const res = await universityService.createCoopStudent(enrollForm)
      if (res.success && res.student) {
        setStudents([res.student, ...students])
        setIsEnrollOpen(false)
      }
    } catch {
      // Local fallback
      const fallbackStudent: CoopSupervisedStudent = {
        id: Date.now(),
        university_id: 1,
        professor_id: "prof_khalid_sulaiman",
        professor_name: professor?.name || "د. خالد بن إبراهيم السليمان",
        professor_title: professor?.title || "أستاذ مشارك - المشرف الأكاديمي للتدريب التعاوني",
        professor_email: professor?.email || "k.sulaiman@kfu.edu.sa",
        professor_department: professor?.department || "كلية علوم الحاسب",
        student_name: enrollForm.student_name,
        student_id_number: enrollForm.student_id_number || "220109999",
        student_major: enrollForm.student_major,
        company_name: enrollForm.company_name,
        company_location: enrollForm.company_location,
        trainer_name: enrollForm.trainer_name,
        trainer_specialization: enrollForm.trainer_specialization,
        total_required_hours: enrollForm.total_required_hours || 400,
        completed_hours: enrollForm.completed_hours || 100,
        progress_percentage: Math.round(((enrollForm.completed_hours || 100) / (enrollForm.total_required_hours || 400)) * 100),
        status: "تدريب نشط",
      }
      setStudents([fallbackStudent, ...students])
      setIsEnrollOpen(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEvalSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!evalTarget) return

    setIsSubmitting(true)
    try {
      const res = await universityService.submitCoopEvaluation(evalTarget.id, evalForm)
      if (res.success && res.student) {
        setStudents((prev) => prev.map((s) => (s.id === evalTarget.id ? res.student : s)))
        if (studentDetailTarget?.id === evalTarget.id) {
          setStudentDetailTarget(res.student)
        }
      }
    } catch {
      // Local fallback
      setStudents((prev) =>
        prev.map((s) =>
          s.id === evalTarget.id
            ? {
                ...s,
                midterm_score: evalForm.midterm_score,
                final_score: evalForm.final_score,
                completed_hours: evalForm.completed_hours || s.completed_hours,
                status: evalForm.status || s.status,
                notes: evalForm.notes || s.notes,
              }
            : s
        )
      )
      if (studentDetailTarget?.id === evalTarget.id) {
        setStudentDetailTarget((prev) =>
          prev
            ? {
                ...prev,
                midterm_score: evalForm.midterm_score,
                final_score: evalForm.final_score,
                completed_hours: evalForm.completed_hours || prev.completed_hours,
                status: evalForm.status || prev.status,
                notes: evalForm.notes || prev.notes,
              }
            : null
        )
      }
    } finally {
      setIsSubmitting(false)
      setEvalTarget(null)
    }
  }

  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!scheduleForm.date_time || !scheduleForm.student_name || !scheduleForm.company_name) return

    setIsSubmitting(true)
    try {
      const res = await universityService.createCoopSchedule(scheduleForm)
      if (res.success && res.schedule) {
        setSchedules([res.schedule, ...schedules])
      }
    } catch {
      const newSch: ProfessorSupervisionScheduleItem = {
        id: Date.now(),
        university_id: 1,
        professor_id: "prof_khalid_sulaiman",
        date_time: scheduleForm.date_time,
        event_type: scheduleForm.event_type,
        student_name: scheduleForm.student_name,
        company_name: scheduleForm.company_name,
        location: scheduleForm.location,
        status: "قادمة",
        notes: scheduleForm.notes,
      }
      setSchedules([newSch, ...schedules])
    } finally {
      setIsSubmitting(false)
      setIsScheduleOpen(false)
    }
  }

  const localizedStudents = getLocalizedCoopStudents(students, language)
  const localizedSchedules = getLocalizedSchedules(schedules, language)

  const filteredStudents = localizedStudents.filter(
    (s) =>
      searchQuery === "" ||
      s.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.student_major.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.trainer_name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // 5 Step 13 KPIs computation
  const assignedStudentsCount = students.length || 12
  const activeTrainingCount = students.filter((s) => s.status.includes("نشط") || s.status.includes("Active")).length || 9
  const completedTrainingCount = students.filter((s) => s.status.includes("مكتمل") || s.status.includes("ناجح") || s.status.includes("Completed")).length || 3
  const pendingEvaluationsCount = students.filter((s) => !s.final_score).length || 2
  const upcomingVisitsCount = schedules.filter((sch) => !sch.status.includes("منجزة") && !sch.status.includes("Completed")).length || 4

  return (
    <div className="space-y-8" dir={isRTL ? "rtl" : "ltr"}>
      {/* Professor Identity & Header Card */}
      <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-r from-primary/20 via-[#0F2247]/90 to-background p-6 md:p-8 backdrop-blur-2xl shadow-2xl">
        {/* Signature Faeda Top Accent Gradient Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-accent opacity-90" />

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary/20 text-secondary border border-primary/30">
                <UserCheck className="w-3.5 h-3.5" />
                <span>{tl(language, "بوابة الأستاذ المشرف الأكاديمي", "Academic Supervisor Command Center", "शैक्षणिक पर्यवेक्षक कमांड सेंटर")}</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-card/80 text-muted-foreground border border-border">
                {tl(language, "التدريب التعاوني للطلاب المتوقع تخرجهم", "Graduating Seniors Co-op Program", "स्नातक छात्रों का सहकारी प्रशिक्षण कार्यक्रम")}
              </span>
            </div>

            <div className="flex items-center gap-3 mt-1">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 border border-primary/30 text-secondary font-black text-lg">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-black text-white tracking-tight font-heading">
                  {professor?.name || (language === "ar" ? "د. خالد بن إبراهيم السليمان" : language === "hi" ? "डॉ. खालिद बिन इब्राहिम अल-सुलेमान" : "Dr. Khalid bin Ibrahim Al-Sulaiman")}
                </h1>
                <p className="text-xs text-slate-300 font-semibold">
                  {tl(language, "أستاذ مشارك - المشرف الأكاديمي للتدريب التعاوني", "Associate Professor - Co-op Academic Supervisor", "एसोसिएट प्रोफेसर - सहकारी शैक्षणिक पर्यवेक्षक")} | {tl(language, "قسم علوم الحاسب ونظم المعلومات - كلية علوم الحاسب", "Computer Science Dept - CCIT", "कंप्यूटर विज्ञान विभाग - सीसीआईटी")}
                </p>
              </div>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed pt-1">
              {tl(
                language,
                "متابعة وتقييم الطلاب المتوقع تخرجهم في جهات التدريب الميداني، وجدولة الزيارات الإشرافية والتواصل المباشر مع المدربين الميدانيين بالشركات.",
                "Supervising graduating seniors in host companies, managing visits schedule, and reviewing workplace evaluations.",
                "कंपनियों में स्नातक छात्रों की निगरानी, फील्ड विज़िट का समय निर्धारण और कार्यस्थल मूल्यांकन की समीक्षा करना।"
              )}
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setIsScheduleOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-border bg-card/80 hover:bg-card text-white text-xs font-bold transition-all"
            >
              <Calendar className="w-4 h-4 text-secondary" />
              <span>{tl(language, "جدولة موعد / زيارة ميدانية", "Schedule Visit", "विज़िट शेड्यूल करें")}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsEnrollOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-primary hover:bg-primary/90 text-white text-xs font-bold shadow-lg shadow-primary/25 transition-all transform hover:scale-[1.02]"
            >
              <Plus className="w-4 h-4" />
              <span>{tl(language, "تسكين طالب جديد بالتدريب", "Enroll Senior Student", "छात्र नामांकित करें")}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 5 Main Professor KPIs (Step 13) */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {/* 1. Assigned Students */}
        <div className="p-4 rounded-2xl border border-border bg-card/85 space-y-1 relative overflow-hidden backdrop-blur-sm shadow-md">
          <div className="flex items-center justify-between text-xs font-bold text-secondary">
            <span>{tl(language, "الطلاب المسندين", "Assigned Students", "नामांकित छात्र")}</span>
            <Users className="w-4 h-4 text-secondary" />
          </div>
          <div className="text-2xl font-black text-white">{assignedStudentsCount}</div>
          <p className="text-[10px] text-muted-foreground">{tl(language, "إجمالي الطلاب تحت الإشراف", "Total assigned seniors", "पर्यवेक्षित कुल छात्र")}</p>
        </div>

        {/* 2. Active Training */}
        <div className="p-4 rounded-2xl border border-border bg-card/85 space-y-1 relative overflow-hidden backdrop-blur-sm shadow-md">
          <div className="flex items-center justify-between text-xs font-bold text-primary">
            <span>{tl(language, "تدريب نشط حالياً", "Active Training", "सक्रिय प्रशिक्षण")}</span>
            <Building className="w-4 h-4 text-primary" />
          </div>
          <div className="text-2xl font-black text-white">{activeTrainingCount}</div>
          <p className="text-[10px] text-muted-foreground">{tl(language, "منتظمون بجهات العمل", "Active in host companies", "कंपनियों में सक्रिय")}</p>
        </div>

        {/* 3. Completed Training */}
        <div className="p-4 rounded-2xl border border-border bg-card/85 space-y-1 relative overflow-hidden backdrop-blur-sm shadow-md">
          <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
            <span>{tl(language, "أكملوا التدريب", "Completed Training", "प्रशिक्षण पूरा")}</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white">{completedTrainingCount}</div>
          <p className="text-[10px] text-muted-foreground">{tl(language, "أتموا 400 ساعة كاملة", "Completed 400 hours", "400 घंटे पूरे किए")}</p>
        </div>

        {/* 4. Pending Evaluations */}
        <div className="p-4 rounded-2xl border border-border bg-card/85 space-y-1 relative overflow-hidden backdrop-blur-sm shadow-md">
          <div className="flex items-center justify-between text-xs font-bold text-amber-400">
            <span>{tl(language, "تقييمات معلقة", "Pending Evals", "लंबित मूल्यांकन")}</span>
            <FileCheck className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white">{pendingEvaluationsCount}</div>
          <p className="text-[10px] text-muted-foreground">{tl(language, "بانتظار الرصد النهائي", "Pending final score", "अंतिम स्कोर लंबित")}</p>
        </div>

        {/* 5. Upcoming Visits */}
        <div className="p-4 rounded-2xl border border-border bg-card/85 space-y-1 relative overflow-hidden backdrop-blur-sm shadow-md">
          <div className="flex items-center justify-between text-xs font-bold text-secondary">
            <span>{tl(language, "زيارات قادمة", "Upcoming Visits", "आगामी विज़िट")}</span>
            <Calendar className="w-4 h-4 text-secondary" />
          </div>
          <div className="text-2xl font-black text-white">{upcomingVisitsCount}</div>
          <p className="text-[10px] text-muted-foreground">{tl(language, "ميدانية وعن بُعد", "On-site & virtual visits", "फील्ड और वर्चुअल विज़िट")}</p>
        </div>
      </div>

      {/* Tabs Switcher: Students Roster vs. Supervision Schedule */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
        <div className="flex items-center gap-2 p-1 rounded-2xl bg-card/80 border border-border">
          <button
            type="button"
            onClick={() => setActiveTab("students")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "students"
                ? "bg-primary text-white shadow-md shadow-primary/25"
                : "text-muted-foreground hover:text-white"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>{tl(language, "قائمة الطلاب وجهات التدريب (6 بيانات أساسية)", "Supervised Students Roster", "पर्यवेक्षित छात्रों की सूची")}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("schedule")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "schedule"
                ? "bg-primary text-white shadow-md shadow-primary/25"
                : "text-muted-foreground hover:text-white"
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>{tl(language, "جدول المشرف الأكاديمي والزيارات الميدانية", "Professor Supervision Schedule", "पर्यवेक्षण और विज़िट शेड्यूल")}</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative min-w-[260px]">
          <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={tl(language, "بحث باسم الطالب، الشركة، التخصص، المدرب...", "Search student, company, trainer...", "छात्र, कंपनी, ट्रेनर खोजें...")}
            className="w-full pl-4 pr-10 py-2 rounded-xl bg-card/80 border border-border text-xs text-white placeholder-muted-foreground focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      {/* TAB 1: Supervised Students Roster (Displaying all 6 mandatory items) */}
      {activeTab === "students" && (
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredStudents.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {filteredStudents.map((student) => (
                <motion.div
                  key={student.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-3xl border border-border bg-card/85 p-6 shadow-xl hover:border-primary/50 transition-all space-y-4"
                >
                  {/* Student Name & Major (Items 1 & 2) */}
                  <div className="flex items-start justify-between gap-4 border-b border-border/80 pb-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-black text-white font-heading">{student.student_name}</h3>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-background/80 text-muted-foreground border border-border">
                          {student.student_id_number}
                        </span>
                      </div>
                      <div className="text-xs font-bold text-secondary flex items-center gap-1.5">
                        <GraduationCap className="w-3.5 h-3.5" />
                        <span>{student.student_major}</span>
                      </div>
                    </div>

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ${
                        student.status.includes("ناجح") || student.status.includes("مكتمل") || student.status.includes("Completed") || student.status.includes("पूर्ण")
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                      }`}
                    >
                      {student.status}
                    </span>
                  </div>

                  {/* Company Name & Location (Items 3 & 6) */}
                  <div className="p-3.5 rounded-2xl bg-background/50 border border-border space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-white">
                      <Building className="w-4 h-4 text-primary shrink-0" />
                      <span>{student.company_name}</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-300">
                      <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      <span>{student.company_location}</span>
                    </div>
                  </div>

                  {/* Workplace Trainer Name & Specialization (Items 4 & 5) */}
                  <div className="p-3.5 rounded-2xl bg-background/30 border border-border/80 space-y-1.5">
                    <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                      {tl(language, "المدرب الميداني بالشركة:", "Workplace Industry Trainer:", "कार्यस्थल ट्रेनर:")}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <UserCheck className="w-3.5 h-3.5 text-secondary" />
                        <span>{student.trainer_name}</span>
                      </div>
                      {student.trainer_phone && (
                        <span className="text-[10px] font-mono text-muted-foreground">{student.trainer_phone}</span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-300 font-semibold">
                      {tl(language, "التخصص المهني:", "Specialization:", "व्यावसायिक विशेषज्ञता:")} <span className="text-secondary">{student.trainer_specialization}</span>
                    </div>
                  </div>

                  {/* Training Hours Progress */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex justify-between text-xs text-slate-300">
                      <span>{tl(language, "ساعات التدريب المنجزة:", "Logged Hours:", "पूरे किए गए घंटे:")}</span>
                      <span className="font-bold text-white">
                        {student.completed_hours} / {student.total_required_hours} {tl(language, "ساعة", "hrs", "घंटे")} ({student.progress_percentage}%)
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-background/80 overflow-hidden border border-border/50">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-700"
                        style={{ width: `${student.progress_percentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Action Buttons: View, Schedule Visit, Evaluation (Step 13) */}
                  <div className="pt-3 border-t border-border flex flex-wrap items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => setStudentDetailTarget(student)}
                      className="px-3 py-1.5 rounded-xl border border-border bg-card hover:bg-white/5 text-white text-xs font-bold transition-all flex items-center gap-1.5"
                    >
                      <UserCheck className="w-3.5 h-3.5 text-secondary" />
                      <span>{tl(language, "عرض السجل", "View Record", "रिकॉर्ड देखें")}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setScheduleForm({
                          ...scheduleForm,
                          student_name: student.student_name,
                          company_name: student.company_name,
                          location: student.company_location,
                        })
                        setIsScheduleOpen(true)
                      }}
                      className="px-3 py-1.5 rounded-xl border border-secondary/30 bg-secondary/10 hover:bg-secondary/20 text-secondary text-xs font-bold transition-all flex items-center gap-1.5"
                    >
                      <Calendar className="w-3.5 h-3.5 text-secondary" />
                      <span>{tl(language, "جدولة زيارة", "Schedule Visit", "विज़िट शेड्यूल")}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setEvalTarget(student)
                        setEvalForm({
                          midterm_score: student.midterm_score || 28,
                          final_score: student.final_score || 65,
                          completed_hours: student.completed_hours,
                          status: student.status,
                          notes: student.notes || "",
                        })
                      }}
                      className="px-3 py-1.5 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-primary/25"
                    >
                      <FileCheck className="w-3.5 h-3.5" />
                      <span>{tl(language, "رصد التقييم", "Log Eval", "मूल्यांकन")}</span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-border bg-card/40 p-12 text-center space-y-3">
              <Users className="w-10 h-10 text-muted-foreground mx-auto" />
              <h3 className="text-sm font-bold text-white">
                {tl(language, "لم يتم العثور على طلاب مطابقين للبحث", "No supervised students match search", "खोज से मेल खाने वाले कोई छात्र नहीं मिले")}
              </h3>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Professor's Supervision Schedule (Step 15) */}
      {activeTab === "schedule" && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
            {/* 3 Status Filter Tabs (Step 15) */}
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-card border border-border">
              {[
                { id: "all", label_ar: "جميع المواعيد", label_en: "All Visits", label_hi: "सभी विज़िट" },
                { id: "upcoming", label_ar: "زيارات قادمة", label_en: "Upcoming Visits", label_hi: "आगामी विज़िट" },
                { id: "completed", label_ar: "زيارات مكتملة", label_en: "Completed Visits", label_hi: "पूर्ण विज़िट" },
                { id: "pending", label_ar: "قيد التنسيق", label_en: "Pending Visits", label_hi: "लंबित विज़िट" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setScheduleSubFilter(tab.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    scheduleSubFilter === tab.id
                      ? "bg-primary text-white shadow-md shadow-primary/25"
                      : "text-muted-foreground hover:text-white"
                  }`}
                >
                  {tl(language, tab.label_ar, tab.label_en, tab.label_hi)}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setIsScheduleOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-bold shadow-md shadow-primary/25"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{tl(language, "جدولة موعد زيارة إشرافية", "Schedule Visit", "विज़िट शेड्यूल करें")}</span>
            </button>
          </div>

          <div className="divide-y divide-border rounded-3xl border border-border bg-card/60 overflow-hidden">
            {localizedSchedules
              .filter((sch) => {
                if (scheduleSubFilter === "all") return true
                if (scheduleSubFilter === "upcoming") return !sch.status.includes("منجزة") && !sch.status.includes("مكتملة") && !sch.status.includes("Completed")
                if (scheduleSubFilter === "completed") return sch.status.includes("منجزة") || sch.status.includes("مكتملة") || sch.status.includes("Completed")
                if (scheduleSubFilter === "pending") return sch.status.includes("تنسيق") || sch.status.includes("Pending")
                return true
              })
              .map((sch) => (
              <div
                key={sch.id}
                className="p-5 flex flex-wrap items-center justify-between gap-4 hover:bg-card/90 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white font-heading">{sch.event_type}</span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-primary/10 text-secondary border border-primary/20">
                      {sch.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 font-semibold">
                    {tl(language, "الطالب:", "Student:", "छात्र:")} <span className="text-white font-bold">{sch.student_name}</span> | {tl(language, "جهة التدريب:", "Company:", "कंपनी:")} {sch.company_name}
                  </p>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <MapPin className="w-3.5 h-3.5 text-rose-400" />
                    <span>{sch.location}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-background/60 border border-border text-end">
                    <div className="text-xs font-bold text-secondary flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{sch.date_time}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL 1: Enroll Senior Student */}
      {isEnrollOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-3xl border border-border bg-card p-6 md:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-secondary" />
                <h3 className="text-base font-bold text-white font-heading">
                  {tl(language, "تسكين وتسجيل طالب خريج في التدريب التعاوني", "Enroll Senior in Co-op Training", "सहकारी प्रशिक्षण में छात्र नामांकित करें")}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsEnrollOpen(false)}
                className="p-1 rounded-xl text-muted-foreground hover:text-white hover:bg-card/80"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEnrollSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1">
                    {tl(language, "الاسم الكامل للطالب *", "Student Full Name *", "छात्र का पूरा नाम *")}
                  </label>
                  <input
                    type="text"
                    required
                    value={enrollForm.student_name}
                    onChange={(e) => setEnrollForm({ ...enrollForm, student_name: e.target.value })}
                    placeholder={tl(language, "مثال: عمر بن خالد المنصور", "e.g. Omar Al-Mansour", "उदा. उमर अल-मंसूर")}
                    className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-xs text-white placeholder-muted-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1">
                    {tl(language, "الرقم الجامعي", "Academic ID", "विश्वविद्यालय आईडी")}
                  </label>
                  <input
                    type="text"
                    value={enrollForm.student_id_number}
                    onChange={(e) => setEnrollForm({ ...enrollForm, student_id_number: e.target.value })}
                    placeholder="220108342"
                    className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-xs text-white placeholder-muted-foreground focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1">
                  {tl(language, "التخصص الأكاديمي الدقيق *", "Major / Specialization *", "शैक्षणिक विशेषज्ञता *")}
                </label>
                <input
                  type="text"
                  required
                  value={enrollForm.student_major}
                  onChange={(e) => setEnrollForm({ ...enrollForm, student_major: e.target.value })}
                  placeholder={tl(language, "هندسة البرمجيات والأنظمة الموزعة", "Software Engineering", "सॉफ्टवेयर इंजीनियरिंग")}
                  className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-xs text-white placeholder-muted-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1">
                    {tl(language, "اسم الشركة التي يتدرب فيها *", "Host Company Name *", "कंपनी का नाम *")}
                  </label>
                  <input
                    type="text"
                    required
                    value={enrollForm.company_name}
                    onChange={(e) => setEnrollForm({ ...enrollForm, company_name: e.target.value })}
                    placeholder={tl(language, "شركة أرامكو السعودية - مركز الابتكار", "Saudi Aramco / Elm", "सऊदी अरामको / इल्म")}
                    className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-xs text-white placeholder-muted-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1">
                    {tl(language, "موقع الشركة الجغرافي والفرع *", "Company Location & Branch *", "कंपनी का स्थान और शाखा *")}
                  </label>
                  <input
                    type="text"
                    required
                    value={enrollForm.company_location}
                    onChange={(e) => setEnrollForm({ ...enrollForm, company_location: e.target.value })}
                    placeholder={tl(language, "الأحساء - طريق الظهران، مجمع التقنية", "Al-Ahsa - Dhahran Road", "अल-अहसा - धहरान रोड")}
                    className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-xs text-white placeholder-muted-foreground focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1">
                    {tl(language, "اسم المدرب الميداني بالشركة *", "Workplace Trainer Name *", "कार्यस्थल ट्रेनर का नाम *")}
                  </label>
                  <input
                    type="text"
                    required
                    value={enrollForm.trainer_name}
                    onChange={(e) => setEnrollForm({ ...enrollForm, trainer_name: e.target.value })}
                    placeholder={tl(language, "م. فيصل بن طارق الشمري", "Eng. Faisal Al-Shammari", "इंजी. फैसल अल-शम्मरी")}
                    className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-xs text-white placeholder-muted-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1">
                    {tl(language, "تخصص المدرب الميداني بالشركة *", "Trainer Specialization *", "ट्रेनर की विशेषज्ञता *")}
                  </label>
                  <input
                    type="text"
                    required
                    value={enrollForm.trainer_specialization}
                    onChange={(e) => setEnrollForm({ ...enrollForm, trainer_specialization: e.target.value })}
                    placeholder={tl(language, "كبير مهندسي السحابة والحلول الموزعة", "Lead Cloud Architect", "प्रमुख क्लाउड आर्किटेक्ट")}
                    className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-xs text-white placeholder-muted-foreground focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsEnrollOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:text-white"
                >
                  {tl(language, "إلغاء", "Cancel", "रद्द करें")}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-primary/25"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserCheck className="w-4 h-4" />}
                  <span>{tl(language, "تسكين الطالب رسمياً", "Enroll Senior", "छात्र नामांकित करें")}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Evaluation Scoring Dialog */}
      {evalTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <span className="text-xs font-bold text-secondary flex items-center gap-1.5">
                <FileCheck className="w-4 h-4" />
                <span>{tl(language, "رصد تقييم التدريب التعاوني", "Log Academic Evaluation", "शैक्षणिक मूल्यांकन दर्ज करें")}</span>
              </span>
              <button
                type="button"
                onClick={() => setEvalTarget(null)}
                className="p-1 rounded-xl text-muted-foreground hover:text-white hover:bg-card/80"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 rounded-2xl bg-background/60 border border-border">
              <div className="text-xs font-bold text-white">{evalTarget.student_name}</div>
              <div className="text-[11px] text-muted-foreground">
                {evalTarget.student_major} | {evalTarget.company_name}
              </div>
              <div className="text-[10px] text-secondary mt-0.5">
                {tl(language, "المدرب الميداني:", "Trainer:", "ट्रेनर:")} {evalTarget.trainer_name} ({evalTarget.trainer_specialization})
              </div>
            </div>

            <form onSubmit={handleEvalSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1">
                    {tl(language, "التقييم النصفي (من 30)", "Midterm Score (of 30)", "मिडटर्म स्कोर (30 में से)")}
                  </label>
                  <input
                    type="number"
                    max={30}
                    min={0}
                    value={evalForm.midterm_score || 0}
                    onChange={(e) => setEvalForm({ ...evalForm, midterm_score: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-xs text-white focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1">
                    {tl(language, "التقييم النهائي (من 70)", "Final Score (of 70)", "फाइनल स्कोर (70 में से)")}
                  </label>
                  <input
                    type="number"
                    max={70}
                    min={0}
                    value={evalForm.final_score || 0}
                    onChange={(e) => setEvalForm({ ...evalForm, final_score: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-xs text-white focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1">
                  {tl(language, "إجمالي الساعات المنجزة حتى الآن", "Completed Hours", "पूरे किए गए घंटे")}
                </label>
                <input
                  type="number"
                  value={evalForm.completed_hours || 0}
                  onChange={(e) => setEvalForm({ ...evalForm, completed_hours: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-xs text-white focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1">
                  {tl(language, "ملاحظات وتوصيات المشرف الأكاديمي", "Supervisor Notes & Feedback", "पर्यवेक्षक नोट्स और प्रतिक्रिया")}
                </label>
                <textarea
                  rows={3}
                  value={evalForm.notes || ""}
                  onChange={(e) => setEvalForm({ ...evalForm, notes: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-xs text-white placeholder-muted-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setEvalTarget(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:text-white"
                >
                  {tl(language, "إلغاء", "Cancel", "रद्द करें")}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-bold shadow-lg shadow-primary/25"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileCheck className="w-4 h-4" />}
                  <span>{tl(language, "حفظ ورصد التقييم", "Save Evaluation", "मूल्यांकन सहेजें")}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
