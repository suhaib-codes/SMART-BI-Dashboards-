import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Bot, X, Send, Sparkles, RefreshCw, User } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage.js';

// Mock AI responses
const MOCK_RESPONSES = [
  {
    kw: ['customer', 'satisfaction'],
    en: 'Customer satisfaction is at **87.4%** this quarter, up 12% QoQ. Key drivers are faster resolution times and improved meter accuracy. I detected **3 anomalies** in billing data that may need attention.',
    ar: 'رضا العملاء **٨٧.٤٪** هذا الربع، بارتفاع ١٢٪ مقارنةً بالربع السابق. المحركات الرئيسية: وقت حل أسرع ودقة عدادات محسّنة. رصدت **٣ شذوذات** في بيانات الفواتير تستوجب الاهتمام.',
  },
  {
    kw: ['finance', 'revenue', 'financial'],
    en: 'Revenue collection YTD: **SAR 1.24B** (97.2% of plan). OPEX is under budget by 3.1%. Watch out — energy costs are up **+8.4%** due to summer peak demand.',
    ar: 'إجمالي تحصيل الإيرادات حتى الآن: **١.٢٤ مليار ريال** (٩٧.٢٪ من الخطة). النفقات التشغيلية أقل من الميزانية بنسبة ٣.١٪. تنبيه — تكاليف الطاقة ارتفعت **+٨.٤٪** بسبب ذروة الطلب الصيفي.',
  },
  {
    kw: ['water', 'loss', 'nrw', 'leak'],
    en: 'Water loss rate is currently **18.4%** (target < 15%). Zones 3 & 7 are the biggest contributors. NRW has been trending down for 6 months — good progress, but not there yet.',
    ar: 'معدل هدر المياه حالياً **١٨.٤٪** (الهدف أقل من ١٥٪). المنطقتان ٣ و٧ هما الأكثر تأثيراً. المياه غير المدرة في انخفاض مستمر منذ ٦ أشهر — تقدم جيد، لكن لم نصل للهدف بعد.',
  },
  {
    kw: ['meter', 'billing'],
    en: 'Meter accuracy program: **96.2%** of meters are within ±2% tolerance — excellent progress. Full compliance forecast by **Q4 2026**. Billing disputes are the top complaint category at 34%.',
    ar: 'برنامج دقة العدادات: **٩٦.٢٪** من العدادات ضمن تفاوت ±٢٪ — تقدم ممتاز. من المتوقع الامتثال الكامل بحلول **الربع الرابع ٢٠٢٦**. نزاعات الفواتير هي أكثر فئات الشكاوى بنسبة ٣٤٪.',
  },
  {
    kw: ['hello', 'hi'],
    en: "Hello! 👋 I'm the NWC AI Assistant. I can help you explore dashboards, get performance insights, or summarize any section. What would you like to know?",
    ar: 'مرحباً! 👋 أنا المساعد الذكي لشركة المياه الوطنية. يمكنني مساعدتك في استكشاف لوحات البيانات والحصول على رؤى الأداء أو تلخيص أي قسم. بماذا يمكنني مساعدتك؟',
  },
  {
    kw: ['dashboard', 'report', 'show'],
    en: 'I can access **all sections** — Customer Care, Finance, O&M, Projects, Strategy, and more. Which section or dashboard would you like insights on?',
    ar: 'يمكنني الوصول إلى **جميع الأقسام** — خدمة العملاء، المالية، التشغيل والصيانة، المشاريع، الاستراتيجية والمزيد. أي قسم أو لوحة تريد رؤى عنها؟',
  },
  {
    kw: ['default'],
    en: 'Based on current data, the top 3 areas needing attention are: **water loss in Zones 3 & 7**, **Q3 collection shortfall risk**, and **energy cost variance**. Would you like a deep-dive on any of these?',
    ar: 'بناءً على البيانات الحالية، أبرز ٣ مجالات تستدعي الاهتمام: **هدر المياه في المنطقتين ٣ و٧**، **خطر عجز تحصيل الربع الثالث**، و**انحراف تكاليف الطاقة**. هل تريد التعمق في أي منها؟',
  },
];

function getAIResponse(query, isAR) {
  const q = query.toLowerCase();
  const found = MOCK_RESPONSES.find(
    (r) => r.kw[0] !== 'default' && r.kw.some((k) => q.includes(k))
  );
  const item = found || MOCK_RESPONSES[MOCK_RESPONSES.length - 1];
  return isAR ? item.ar : item.en;
}

// Render **bold** markdown inline
function FormattedText({ text }) {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return (
    <span>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <strong key={i} className="font-semibold">
            {part}
          </strong>
        ) : (
          part
        )
      )}
    </span>
  );
}

// Animated 3-dot typing indicator
function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-1 py-0.5">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-2 h-2 rounded-full bg-accent/60 block"
          animate={{ y: [0, -5, 0] }}
          transition={{
            repeat: Infinity,
            duration: 0.9,
            delay: i * 0.18,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

const panelVariants = {
  hidden:  { opacity: 0, y: 32, scale: 0.94 },
  visible: { opacity: 1, y: 0,  scale: 1,   transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } },
  exit:    { opacity: 0, y: 20, scale: 0.94, transition: { duration: 0.2 } },
};

const QUICK_PROMPTS = [
  { en: 'Customer satisfaction stats', ar: 'إحصائيات رضا العملاء' },
  { en: 'Water loss analysis',         ar: 'تحليل هدر المياه'      },
  { en: 'Revenue collection status',   ar: 'حالة تحصيل الإيرادات'  },
  { en: 'Show all dashboards',         ar: 'عرض جميع اللوحات'       },
];

export default function AIAgentButton() {
  const { t }               = useTranslation();
  const { isRTL, language } = useLanguage();

  const [open,     setOpen]     = useState(false);
  const [input,    setInput]    = useState('');
  const [typing,   setTyping]   = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 0,
      role: 'assistant',
      text:
        language === 'ar'
          ? 'مرحباً! 👋 أنا مساعد NWC الذكي. يمكنني مساعدتك في استكشاف التقارير والحصول على رؤى تحليلية.'
          : "Hello! 👋 I'm the NWC AI Assistant. Ask me anything about your dashboards and data.",
    },
  ]);

  const inputRef  = useRef(null);
  const bottomRef = useRef(null);

  // Focus input when panel opens
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 150);
  }, [open]);

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const sendMessage = useCallback(
    (text) => {
      const userText = (text ?? input).trim();
      if (!userText) return;
      setInput('');

      setMessages((prev) => [
        ...prev,
        { id: Date.now(), role: 'user', text: userText },
      ]);

      setTyping(true);
      setTimeout(() => {
        const response = getAIResponse(userText, language === 'ar');
        setMessages((prev) => [
          ...prev,
          { id: Date.now() + 1, role: 'assistant', text: response },
        ]);
        setTyping(false);
      }, 900 + Math.random() * 500);
    },
    [input, language]
  );

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating button */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.93 }}
        onClick={() => setOpen((v) => !v)}
        aria-label={t('ai_agent_title')}
        className="fixed bottom-6 z-50 w-14 h-14 rounded-full flex items-center justify-center
                   bg-gradient-to-br from-accent to-accent-dark text-white
                   shadow-[0_6px_30px_rgba(0,180,216,0.55)]
                   hover:shadow-[0_8px_40px_rgba(0,180,216,0.75)]
                   transition-shadow duration-300"
        style={isRTL ? { left: '24px' } : { right: '24px' }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0,   opacity: 1 }}
              exit={{    rotate: 90,  opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <X size={22} strokeWidth={2.2} />
            </motion.span>
          ) : (
            <motion.span
              key="bot"
              initial={{ rotate: 90,  opacity: 0 }}
              animate={{ rotate: 0,   opacity: 1 }}
              exit={{    rotate: -90, opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <Bot size={24} strokeWidth={1.8} />
            </motion.span>
          )}
        </AnimatePresence>

        {/* Pulse ring — only when closed */}
        {!open && (
          <span
            className="absolute w-full h-full rounded-full bg-accent/30 animate-ping pointer-events-none"
            style={{ animationDuration: '2.5s' }}
          />
        )}
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed z-40 flex flex-col bg-surface rounded-2xl overflow-hidden
                       shadow-[0_24px_80px_rgba(10,37,64,0.28)] border border-app-border"
            style={{
              bottom: '88px',
              width: 'min(380px, calc(100vw - 32px))',
              height: 'min(560px, calc(100vh - 120px))',
              ...(isRTL ? { left: '16px' } : { right: '16px' }),
            }}
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            {/* Header */}
            <div
              className="shrink-0 flex items-center gap-3 px-4 py-3.5
                         bg-gradient-to-r from-primary via-[#0d3460] to-accent-dark
                         border-b border-white/10"
              style={isRTL ? { flexDirection: 'row-reverse' } : {}}
            >
              <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
                <Sparkles size={17} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-white text-sm leading-none">{t('ai_agent_title')}</p>
                <div
                  className="flex items-center gap-1.5 mt-0.5"
                  style={isRTL ? { flexDirection: 'row-reverse' } : {}}
                >
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-white/55 text-[11px]">NWC Intelligence Engine</span>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-white/60 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors shrink-0"
              >
                <X size={15} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className={`flex items-end gap-2.5 ${
                    msg.role === 'user'
                      ? isRTL ? 'flex-row' : 'flex-row-reverse'
                      : isRTL ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mb-0.5
                      ${msg.role === 'assistant'
                        ? 'bg-gradient-to-br from-accent to-accent-dark'
                        : 'bg-gradient-to-br from-primary to-[#1a4a7a]'}`}
                  >
                    {msg.role === 'assistant' ? (
                      <Bot size={14} className="text-white" />
                    ) : (
                      <User size={13} className="text-white" />
                    )}
                  </div>

                  {/* Bubble */}
                  <div
                    className={`max-w-[78%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed
                      ${msg.role === 'assistant'
                        ? 'bg-app-bg text-app-text border border-app-border rounded-bl-sm'
                        : 'bg-gradient-to-br from-accent to-accent-dark text-white rounded-br-sm'}`}
                  >
                    <FormattedText text={msg.text} />
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              <AnimatePresence>
                {typing && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    className={`flex items-end gap-2.5 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center shrink-0">
                      <Bot size={14} className="text-white" />
                    </div>
                    <div className="bg-app-bg border border-app-border px-3.5 py-2.5 rounded-2xl rounded-bl-sm">
                      <TypingDots />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div ref={bottomRef} />
            </div>

            {/* Quick prompts — shown only on first open */}
            {messages.length === 1 && (
              <div className="shrink-0 px-3 pb-2">
                <div className="grid grid-cols-2 gap-1.5">
                  {QUICK_PROMPTS.map((p, i) => (
                    <button
                      key={i}
                      onClick={() => sendMessage(language === 'ar' ? p.ar : p.en)}
                      className="text-xs bg-app-bg hover:bg-accent/10 text-app-text hover:text-accent
                                 border border-app-border hover:border-accent/40 rounded-xl px-2.5 py-2
                                 transition-all duration-150 leading-snug"
                      style={{ textAlign: isRTL ? 'right' : 'left' }}
                    >
                      {language === 'ar' ? p.ar : p.en}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input area */}
            <div className="shrink-0 px-3 pb-3 pt-2 border-t border-app-border bg-surface">
              <div className={`flex items-end gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  rows={1}
                  placeholder={t('ai_agent_placeholder')}
                  className="flex-1 resize-none bg-app-bg border border-app-border rounded-2xl
                             px-3.5 py-2.5 text-sm text-app-text placeholder:text-sidebar-text
                             focus:outline-none focus:ring-2 focus:ring-accent/40
                             overflow-y-auto"
                  style={{
                    textAlign: isRTL ? 'right' : 'left',
                    lineHeight: '1.5',
                    maxHeight: '96px',
                  }}
                  onInput={(e) => {
                    e.target.style.height = 'auto';
                    e.target.style.height = Math.min(e.target.scrollHeight, 96) + 'px';
                  }}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || typing}
                  className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 self-end
                             bg-gradient-to-br from-accent to-accent-dark text-white
                             disabled:opacity-40 disabled:cursor-not-allowed
                             shadow-[0_4px_12px_rgba(0,180,216,0.4)]
                             hover:shadow-[0_6px_16px_rgba(0,180,216,0.55)]
                             transition-all duration-200"
                >
                  {typing ? (
                    <RefreshCw size={15} className="animate-spin" />
                  ) : (
                    <Send size={15} strokeWidth={2.2} className={isRTL ? 'rotate-180' : ''} />
                  )}
                </motion.button>
              </div>
              <p className="text-[10px] text-sidebar-text text-center mt-1.5">
                {isRTL ? 'مدعوم بالذكاء الاصطناعي · NWC' : 'Powered by AI · NWC Analytics'}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
