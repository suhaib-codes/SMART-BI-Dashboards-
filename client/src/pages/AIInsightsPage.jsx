import { useState, useMemo, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BrainCircuit, Sparkles, TrendingUp, TrendingDown,
  BarChart2, Target, AlertTriangle, CheckCircle2,
  RefreshCw, Send, Bot, Layers, ChevronRight, ChevronLeft,
  Activity, Users, DollarSign, Droplets,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp }      from '../context/AppContext.jsx';
import { useLanguage } from '../hooks/useLanguage.js';

// ─── Variants ──────────────────────────────────────────────────────────────────
const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -8 },
};
const cardVariants = {
  hidden:  { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.07, duration: 0.35, ease: 'easeOut' },
  }),
};

// ─── Mock KPI data ─────────────────────────────────────────────────────────────
const KPI_DATA = [
  { id: 'csat',      icon: Users,      color: '#00B4D8', label_en: 'Customer Satisfaction',  label_ar: 'رضا العملاء',         value: '87.4%', trend: +12, status: 'good'    },
  { id: 'revenue',   icon: DollarSign, color: '#22c55e', label_en: 'Revenue Collection',    label_ar: 'تحصيل الإيرادات',      value: '94.2%', trend: +3.1, status: 'good'   },
  { id: 'water_loss',icon: Droplets,   color: '#f59e0b', label_en: 'Water Loss Rate',       label_ar: 'معدل هدر المياه',       value: '18.4%', trend: -2.3, status: 'warn'   },
  { id: 'ops_eff',   icon: Activity,   color: '#8b5cf6', label_en: 'Operational Efficiency', label_ar: 'الكفاءة التشغيلية',     value: '91.1%', trend: +5.7, status: 'good'   },
];

// ─── Mock AI recommendations ───────────────────────────────────────────────────
const RECOMMENDATIONS = [
  { id: 1, type: 'alert',   icon: AlertTriangle, color: '#ef4444', en: 'Water loss in Zone 3 & Zone 7 exceeds target threshold by 3.4%. Immediate pipeline inspection recommended.', ar: 'يتجاوز هدر المياه في المنطقتين ٣ و٧ الحد المستهدف بنسبة ٣.٤٪. يُوصى بإجراء فحص فوري للأنابيب.' },
  { id: 2, type: 'insight', icon: TrendingUp,    color: '#22c55e', en: 'Customer complaint resolution time improved 18% QoQ. Recommend expanding the successful model from Riyadh North to other regions.', ar: 'تحسّن وقت حل شكاوى العملاء بنسبة ١٨٪ مقارنةً بالربع السابق. يُنصح بتوسيع النموذج الناجح من شمال الرياض إلى مناطق أخرى.' },
  { id: 3, type: 'action',  icon: Target,        color: '#00B4D8', en: 'Q3 collection target is at risk. Predicted shortfall: SAR 12.4M. Consider activating automated payment reminders.', ar: 'هدف تحصيل الربع الثالث في خطر. العجز المتوقع: ١٢.٤ مليون ريال. يُنصح بتفعيل تذكيرات الدفع الآلية.' },
  { id: 4, type: 'insight', icon: CheckCircle2,  color: '#22c55e', en: 'Meter accuracy program is on track — 96.2% of meters now within ±2% tolerance. Forecast: full compliance by Q4.', ar: 'برنامج دقة العدادات على المسار الصحيح — ٩٦.٢٪ من العدادات ضمن تفاوت ±٢٪. التوقع: الامتثال الكامل بحلول الربع الرابع.' },
];

// ─── Mock query responses ──────────────────────────────────────────────────────
const QUERY_MAP = [
  { kw: ['water loss', 'هدر'],   en: 'Water loss analysis: Zone 3 has highest NRW at 22.1%. Historical trend shows seasonal spike in Q2. Root causes: aging infrastructure (60%) and illegal connections (24%). Recommended actions: prioritize Zone 3 pipe replacement by Q3.', ar: 'تحليل هدر المياه: المنطقة ٣ لديها أعلى مياه غير مدرة للإيرادات بنسبة ٢٢.١٪. يُظهر الاتجاه التاريخي ارتفاعاً موسمياً في الربع الثاني. الأسباب الجذرية: البنية التحتية القديمة (٦٠٪) والتوصيلات غير المشروعة (٢٤٪). الإجراءات الموصى بها: إعطاء الأولوية لاستبدال أنابيب المنطقة ٣ بحلول الربع الثالث.' },
  { kw: ['finance', 'revenue', 'مال', 'إيراد'], en: 'Financial snapshot: Total revenue YTD SAR 1.24B (97.2% of plan). OPEX under budget by 3.1%. Top variance: energy costs +8.4% due to summer demand. Projection: full-year target achievable if collection rate maintained above 93%.', ar: 'لمحة مالية: إجمالي الإيرادات منذ بداية العام ١.٢٤ مليار ريال (٩٧.٢٪ من الخطة). النفقات التشغيلية أقل من الميزانية بنسبة ٣.١٪. أعلى انحراف: تكاليف الطاقة +٨.٤٪ بسبب الطلب الصيفي. التوقع: الهدف السنوي قابل للتحقيق إذا حُوفظ على معدل التحصيل فوق ٩٣٪.' },
  { kw: ['customer', 'عميل', 'شكوى'], en: 'Customer analytics: 48,230 active accounts. New connections this quarter: +1,842. Complaints YTD: 3,104 (-11.2% vs last year). Average resolution: 2.4 days. Top complaint category: billing disputes (34%).', ar: 'تحليلات العملاء: ٤٨,٢٣٠ حساب نشط. التوصيلات الجديدة هذا الربع: +١,٨٤٢. الشكاوى منذ بداية العام: ٣,١٠٤ (-١١.٢٪ مقارنة بالعام الماضي). متوسط وقت الحل: ٢.٤ يوم. أعلى فئة شكاوى: نزاعات الفواتير (٣٤٪).' },
  { kw: ['default'], en: 'Based on current data, three key decisions require attention: (1) Zone 3 water loss mitigation plan, (2) Q3 collection shortfall risk, and (3) meter replacement acceleration program. Confidence level: High (based on 6-month trend data).', ar: 'بناءً على البيانات الحالية، ثلاثة قرارات رئيسية تستدعي الاهتمام: (١) خطة تخفيف هدر المياه في المنطقة ٣، (٢) خطر عجز تحصيل الربع الثالث، (٣) برنامج تسريع استبدال العدادات. مستوى الثقة: مرتفع (بناءً على بيانات اتجاه ٦ أشهر).' },
];

function getMockResponse(query, isAR) {
  const q = query.toLowerCase();
  const found = QUERY_MAP.find(r => r.kw[0] !== 'default' && r.kw.some(k => q.includes(k)));
  const item = found || QUERY_MAP.find(r => r.kw[0] === 'default');
  return isAR ? item.ar : item.en;
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function KpiCard({ kpi, index, isRTL, language }) {
  const Icon   = kpi.icon;
  const isUp   = kpi.trend > 0;
  const TrendIcon = isUp ? TrendingUp : TrendingDown;
  return (
    <motion.div
      custom={index} variants={cardVariants} initial="hidden" animate="visible"
      whileHover={{ y: -3, boxShadow: '0 12px 28px rgba(10,37,64,0.14)' }}
      className="bg-surface rounded-2xl shadow-card p-5 flex flex-col gap-3"
    >
      <div className={`flex items-start justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: kpi.color + '20' }}>
          <Icon size={20} style={{ color: kpi.color }} />
        </div>
        <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full
          ${isUp ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>
          <TrendIcon size={11} />
          {isUp ? '+' : ''}{kpi.trend}%
        </span>
      </div>
      <div className={isRTL ? 'text-right' : 'text-left'}>
        <p className="text-2xl font-bold text-app-text">{kpi.value}</p>
        <p className="text-sidebar-text text-xs mt-0.5">
          {language === 'ar' ? kpi.label_ar : kpi.label_en}
        </p>
      </div>
    </motion.div>
  );
}

function RecommendationCard({ rec, index, isRTL, language }) {
  const Icon = rec.icon;
  return (
    <motion.div
      custom={index} variants={cardVariants} initial="hidden" animate="visible"
      className="bg-surface rounded-xl shadow-card p-4 flex gap-3 border-l-4"
      style={{ borderColor: rec.color }}
    >
      <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
        style={{ backgroundColor: rec.color + '18' }}>
        <Icon size={18} style={{ color: rec.color }} />
      </div>
      <p className={`text-app-text text-sm leading-relaxed ${isRTL ? 'text-right' : 'text-left'}`}>
        {language === 'ar' ? rec.ar : rec.en}
      </p>
    </motion.div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function AIInsightsPage() {
  const { t }                   = useTranslation();
  const { isRTL, language }     = useLanguage();
  const BreadCrumbChevron       = isRTL ? ChevronLeft : ChevronRight;

  const [query,    setQuery]    = useState('');
  const [response, setResponse] = useState('');
  const [loading,  setLoading]  = useState(false);
  const inputRef = useRef(null);

  const handleQuery = useCallback(() => {
    if (!query.trim()) return;
    setLoading(true);
    setResponse('');
    setTimeout(() => {
      setResponse(getMockResponse(query, language === 'ar'));
      setLoading(false);
    }, 1000);
  }, [query, language]);

  return (
    <motion.div
      variants={pageVariants} initial="initial" animate="animate" exit="exit"
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="flex-1 p-4 md:p-6 lg:p-8 space-y-8"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb"
        className={`flex items-center gap-1.5 text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
        <Link to="/" className="text-accent hover:underline font-medium">{t('breadcrumb_home')}</Link>
        <BreadCrumbChevron size={14} className="text-sidebar-text shrink-0" />
        <span className="text-app-text font-medium">{t('ai_insights_page')}</span>
      </nav>

      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, x: isRTL ? 20 : -20 }} animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0
                        bg-gradient-to-br from-accent/20 to-purple-500/20">
          <BrainCircuit size={32} className="text-accent" />
        </div>
        <div className={isRTL ? 'text-right' : 'text-left'}>
          <h1 className="text-2xl font-bold text-app-text leading-snug">{t('ai_insights_page')}</h1>
          <p className="text-sidebar-text text-sm mt-0.5">
            {isRTL ? 'الذكاء التحليلي · رؤى مدعومة بالبيانات' : 'Decision Intelligence · Data-Powered Insights'}
          </p>
        </div>
      </motion.div>

      {/* KPI cards */}
      <section>
        <h2 className={`text-sm font-semibold text-sidebar-text uppercase tracking-wider mb-4 ${isRTL ? 'text-right' : 'text-left'}`}>
          {isRTL ? 'مؤشرات الأداء الرئيسية' : 'Key Performance Indicators'}
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {KPI_DATA.map((kpi, i) => (
            <KpiCard key={kpi.id} kpi={kpi} index={i} isRTL={isRTL} language={language} />
          ))}
        </div>
      </section>

      {/* AI Query interface */}
      <section className="bg-gradient-to-br from-primary to-accent-dark rounded-2xl p-6 space-y-4">
        <div className={`flex items-center gap-2.5 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
            <Sparkles size={18} className="text-white" />
          </div>
          <div>
            <h2 className="text-white font-bold text-base leading-none">
              {isRTL ? 'محرك القرارات الذكي' : 'AI Decision Engine'}
            </h2>
            <p className="text-white/60 text-xs mt-0.5">
              {isRTL ? 'اطرح سؤالاً للحصول على رؤى تحليلية' : 'Ask any question to get analytical insights'}
            </p>
          </div>
        </div>

        <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => { setQuery(e.target.value); setResponse(''); }}
            onKeyDown={(e) => e.key === 'Enter' && handleQuery()}
            placeholder={isRTL ? 'مثال: ما هو معدل هدر المياه؟' : 'e.g. What is the water loss rate in Zone 3?'}
            className="flex-1 bg-white/10 border border-white/20 text-white placeholder:text-white/40
                       rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-white/30
                       backdrop-blur-sm"
          />
          <button
            onClick={handleQuery}
            disabled={!query.trim() || loading}
            className="flex items-center gap-2 bg-accent hover:bg-white hover:text-primary
                       disabled:opacity-50 text-white font-semibold px-5 py-3 rounded-xl
                       transition-all duration-200 shrink-0"
          >
            {loading
              ? <RefreshCw size={16} className="animate-spin" />
              : <Send size={16} />
            }
            <span className="hidden sm:inline">
              {isRTL ? 'تحليل' : 'Analyze'}
            </span>
          </button>
        </div>

        <AnimatePresence>
          {response && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white/10 rounded-xl p-4 border border-white/20"
            >
              <div className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="w-8 h-8 rounded-lg bg-accent/30 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot size={16} className="text-white" />
                </div>
                <p className="text-white text-sm leading-relaxed">{response}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* AI Recommendations */}
      <section>
        <h2 className={`text-sm font-semibold text-sidebar-text uppercase tracking-wider mb-4 ${isRTL ? 'text-right' : 'text-left'}`}>
          {isRTL ? 'توصيات الذكاء الاصطناعي' : 'AI Recommendations'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {RECOMMENDATIONS.map((rec, i) => (
            <RecommendationCard key={rec.id} rec={rec} index={i} isRTL={isRTL} language={language} />
          ))}
        </div>
      </section>
    </motion.div>
  );
}
