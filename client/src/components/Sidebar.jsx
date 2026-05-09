import { useMemo, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import {
  Home, Users, DollarSign, Settings, FolderOpen,
  TrendingUp, Share2, Monitor, Wrench, BrainCircuit,
  ChevronLeft, ChevronRight, ChevronDown,
  BarChart2, Banknote, CheckCircle2, Gauge, Plug,
} from 'lucide-react';
import { useApp }      from '../context/AppContext.jsx';
import { useLanguage } from '../hooks/useLanguage.js';

// ─── Static nav config ────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { id: 'home',            path: '/',                          Icon: Home,       label_en: 'Home',                      label_ar: 'الرئيسية' },
  {
    id: 'customer-care',
    path: '/section/customer-care',
    Icon: Users,
    label_en: 'Customer Care',
    label_ar: 'خدمة العملاء',
    children: [
      { id: 'customer-analytics',  path: '/dashboard/customer-analytics',  Icon: BarChart2,    label_en: 'Customer Analytics',  label_ar: 'تحليل العملاء' },
      { id: 'cc-collection',       path: '/dashboard/cc-collection',       Icon: Banknote,     label_en: 'Collection',          label_ar: 'التحصيل' },
      { id: 'cc-resolution',       path: '/dashboard/cc-resolution',       Icon: CheckCircle2, label_en: 'Resolution',          label_ar: 'معالجة الطلبات' },
      { id: 'cc-metering-billing', path: '/dashboard/cc-metering-billing', Icon: Gauge,        label_en: 'Metering & Billing',  label_ar: 'العدادات والفوترة' },
      { id: 'new-connections',     path: '/dashboard/new-connections',     Icon: Plug,         label_en: 'New Connections',     label_ar: 'توصيلات جديدة' },
    ],
  },
  { id: 'finance',         path: '/section/finance',           Icon: DollarSign, label_en: 'Finance',                   label_ar: 'المالية' },
  { id: 'om',              path: '/section/om',                Icon: Settings,   label_en: 'O&M',                       label_ar: 'التشغيل والصيانة' },
  { id: 'projects',        path: '/section/projects',          Icon: FolderOpen, label_en: 'Projects',                  label_ar: 'المشاريع' },
  { id: 'strategy',        path: '/section/strategy',          Icon: TrendingUp, label_en: 'Strategy',                  label_ar: 'الاستراتيجية' },
  { id: 'shared-services', path: '/section/shared-services',   Icon: Share2,     label_en: 'Shared Services',           label_ar: 'الخدمات المشتركة' },
  { id: 'it-reports',      path: '/section/it-reports',        Icon: Monitor,    label_en: 'IT Reports',                label_ar: 'تقارير IT' },
  { id: 'imo-technical',   path: '/section/imo-technical',     Icon: Wrench,       label_en: 'IMO Technical',             label_ar: 'تقني IMO' },
  { id: 'ai-insights',     path: '/ai-insights',               Icon: BrainCircuit, label_en: 'Decision Intelligence',     label_ar: 'الذكاء التحليلي' },
];

// ─── Sidebar Child Item ───────────────────────────────────────────────────────

function SidebarChildItem({ item, isActive, isRTL, label }) {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(item.path)}
      title={label}
      className={`
        relative w-full flex items-center gap-2.5 py-2 transition-colors group
        hover:bg-white/5 focus:outline-none focus-visible:ring-1 focus-visible:ring-accent/50
        ${isRTL ? 'flex-row-reverse pr-10 pl-4' : 'pl-10 pr-4'}
        ${isActive ? 'bg-accent/10' : ''}
      `}
      aria-current={isActive ? 'page' : undefined}
    >
      {isActive && (
        <motion.div
          layoutId="sidebar-child-active-border"
          className={`absolute top-0 bottom-0 w-0.5 bg-accent/80 ${isRTL ? 'right-0' : 'left-0'}`}
          transition={{ type: 'spring', stiffness: 400, damping: 35 }}
        />
      )}
      <item.Icon
        size={14}
        className={`shrink-0 transition-colors ${
          isActive ? 'text-accent' : 'text-sidebar-text/60 group-hover:text-sidebar-text'
        }`}
      />
      <span className={`text-xs font-medium truncate ${
        isActive ? 'text-white' : 'text-sidebar-text/80 group-hover:text-white'
      }`}>
        {label}
      </span>
    </button>
  );
}

// ─── Sidebar Item ─────────────────────────────────────────────────────────────

/**
 * Individual sidebar navigation item.
 *
 * @param {{ item: Object, isActive: boolean, collapsed: boolean, isRTL: boolean, label: string }} props
 */
function SidebarItem({ item, isActive, isChildActive, collapsed, isRTL, label, expanded, onToggle }) {
  const navigate = useNavigate();
  const hasChildren = item.children && item.children.length > 0;

  const handleClick = () => {
    navigate(item.path);
    if (hasChildren) onToggle(item.id);
  };

  const highlighted = isActive || isChildActive;

  return (
    <button
      onClick={handleClick}
      title={collapsed ? label : undefined}
      className={`
        relative w-full flex items-center gap-3 py-3 transition-colors group
        hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60
        ${collapsed ? 'justify-center px-0' : isRTL ? 'flex-row-reverse px-4' : 'px-4'}
        ${highlighted ? 'bg-accent/10' : ''}
      `}
      aria-current={isActive ? 'page' : undefined}
      aria-expanded={hasChildren ? expanded : undefined}
    >
      {/* Animated active border */}
      {highlighted && (
        <motion.div
          layoutId="sidebar-active-border"
          className={`absolute top-0 bottom-0 w-0.5 bg-accent ${isRTL ? 'right-0' : 'left-0'}`}
          transition={{ type: 'spring', stiffness: 400, damping: 35 }}
        />
      )}

      {/* Icon */}
      <item.Icon
        size={20}
        className={`shrink-0 transition-colors ${highlighted ? 'text-accent' : 'text-sidebar-text group-hover:text-white'}`}
      />

      {/* Label */}
      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.span
            key="label"
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.2 }}
            className={`flex-1 text-sm font-medium truncate overflow-hidden whitespace-nowrap text-left
              ${highlighted ? 'text-white' : 'text-sidebar-text group-hover:text-white'}
              ${isRTL ? 'text-right' : ''}`}
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>

      {/* Chevron for expandable items */}
      {hasChildren && !collapsed && (
        <motion.div
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="shrink-0"
        >
          <ChevronDown size={14} className="text-sidebar-text/60" />
        </motion.div>
      )}
    </button>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

/**
 * Collapsible sidebar navigation.
 * - Desktop: always visible, toggled wide ↔ narrow via collapse button.
 * - Mobile:  slides in as an overlay drawer (controlled by sidebarOpen state).
 */
export default function Sidebar() {
  const { i18n }                                     = useTranslation();
  const { sidebarCollapsed, toggleSidebar, sidebarOpen } = useApp();
  const { isRTL }                                    = useLanguage();
  const location                                     = useLocation();

  const label = (item) => i18n.language === 'ar' ? item.label_ar : item.label_en;

  // Determine which top-level item is active (includes children paths)
  const activeId = useMemo(() => {
    for (const item of NAV_ITEMS) {
      if (item.path === '/' && location.pathname === '/') return item.id;
      // Check children first for exact dashboard matches
      if (item.children) {
        for (const child of item.children) {
          if (location.pathname === child.path || location.pathname.startsWith(child.path + '/')) {
            return item.id;
          }
        }
      }
      if (item.path !== '/' && location.pathname.startsWith(item.path)) return item.id;
    }
    return 'home';
  }, [location.pathname]);

  // Active child ID for highlighting
  const activeChildId = useMemo(() => {
    for (const item of NAV_ITEMS) {
      if (!item.children) continue;
      for (const child of item.children) {
        if (location.pathname === child.path || location.pathname.startsWith(child.path + '/')) {
          return child.id;
        }
      }
    }
    return null;
  }, [location.pathname]);

  // Auto-expand parent if a child is active; allow manual toggling
  const [expandedIds, setExpandedIds] = useState(() => {
    const set = new Set();
    for (const item of NAV_ITEMS) {
      if (!item.children) continue;
      for (const child of item.children) {
        if (window.location.pathname === child.path ||
            window.location.pathname.startsWith(child.path + '/') ||
            window.location.pathname.startsWith(item.path)) {
          set.add(item.id);
          break;
        }
      }
    }
    return set;
  });

  // Auto-expand when navigating into a child
  useMemo(() => {
    if (activeChildId) {
      setExpandedIds(prev => {
        for (const item of NAV_ITEMS) {
          if (item.children?.some(c => c.id === activeChildId)) {
            if (!prev.has(item.id)) {
              const next = new Set(prev);
              next.add(item.id);
              return next;
            }
          }
        }
        return prev;
      });
    }
  }, [activeChildId]);

  const toggleExpand = useCallback((id) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }, []);

  const SIDEBAR_W = sidebarCollapsed ? 64 : 240;

  // Shared nav renderer
  const renderNav = (collapsed) => (
    <LayoutGroup>
      {NAV_ITEMS.map((item) => {
        const isActive    = activeId === item.id && !activeChildId;
        const isChildActive = activeId === item.id && !!activeChildId;
        const expanded    = expandedIds.has(item.id);
        return (
          <div key={item.id}>
            <SidebarItem
              item={item}
              isActive={isActive}
              isChildActive={isChildActive}
              collapsed={collapsed}
              isRTL={isRTL}
              label={label(item)}
              expanded={expanded}
              onToggle={toggleExpand}
            />
            {/* Children dropdown */}
            <AnimatePresence initial={false}>
              {item.children && expanded && !collapsed && (
                <motion.div
                  key="children"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  {/* Thin accent line connecting parent to children */}
                  <div className={`border-l border-accent/20 mx-5 ${isRTL ? 'mr-5 ml-0 border-r border-l-0' : ''}`}>
                    {item.children.map((child) => (
                      <SidebarChildItem
                        key={child.id}
                        item={child}
                        isActive={activeChildId === child.id}
                        isRTL={isRTL}
                        label={label(child)}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </LayoutGroup>
  );

  // ── Desktop sidebar ─────────────────────────────────────────────────────────
  return (
    <>
      {/* Desktop sidebar */}
      <motion.aside
        animate={{ width: SIDEBAR_W }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className="hidden lg:flex flex-col bg-primary shadow-sidebar shrink-0 overflow-y-auto z-30 self-start"
        style={{ minWidth: SIDEBAR_W, height: 'calc(100vh - 64px)', position: 'sticky', top: '64px' }}
        aria-label="Sidebar navigation"
      >
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-2">
          {renderNav(sidebarCollapsed)}
        </nav>

        {/* Collapse / expand toggle */}
        <button
          onClick={toggleSidebar}
          className={`flex items-center justify-${sidebarCollapsed ? 'center' : isRTL ? 'start' : 'end'} px-4 py-3 border-t border-white/10 text-sidebar-text hover:text-white hover:bg-white/5 transition-colors`}
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isRTL
            ? sidebarCollapsed ? <ChevronLeft size={18} /> : <ChevronRight size={18} />
            : sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />
          }
          {!sidebarCollapsed && (
            <span className={`text-xs ml-2 ${isRTL ? 'mr-2 ml-0' : ''}`}>
              {isRTL ? 'طي' : 'Collapse'}
            </span>
          )}
        </button>
      </motion.aside>

      {/* Mobile drawer sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            key="mobile-sidebar"
            initial={{ x: isRTL ? 240 : -240 }}
            animate={{ x: 0 }}
            exit={{ x: isRTL ? 240 : -240 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className={`fixed top-16 bottom-0 w-60 bg-primary shadow-sidebar flex flex-col z-30 lg:hidden ${isRTL ? 'right-0' : 'left-0'}`}
            aria-label="Mobile sidebar navigation"
          >
            <nav className="flex-1 overflow-y-auto py-2">
              {renderNav(false)}
            </nav>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
