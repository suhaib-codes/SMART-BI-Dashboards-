'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({ origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:5174', 'http://127.0.0.1:5174'] }));
app.use(express.json());

// ─── Data ──────────────────────────────────────────────────────────────────────
const sections = [
  {
    id: 'customer-care',
    label_en: 'Customer Care',
    label_ar: 'خدمة العملاء',
    icon: 'Users',
    dashboards: [
      {
        id: 'customer-analytics',
        label_en: 'Customer Analytics',
        label_ar: 'تحليل معلومات العملاء',
        description_en:
          'Comprehensive customer data analysis including account mapping, premise reports, and subscription tracking.',
        description_ar:
          'تحليل شامل لبيانات العملاء بما يشمل تعيين الحسابات وتقارير المنشآت وتتبع الاشتراكات.',
        url: 'https://app.powerbi.com/view?r=eyJrIjoiZmVlNTUwMzItYjYzOC00ZjQ5LTkwZDYtMmZjOTBkZDU0NmY0IiwidCI6IjZjZTcwOTA0LTUwOWMtNGI0Zi1iNjc2LTJiMGRlZjA3M2U2YyJ9',
        reports: [
          { id: 'ca-demographics', label_en: 'Customer Demographics Analysis', label_ar: 'تحليل التركيبة السكانية للعملاء', url: 'https://app.powerbi.com/view?r=eyJrIjoiZmVlNTUwMzItYjYzOC00ZjQ5LTkwZDYtMmZjOTBkZDU0NmY0IiwidCI6IjZjZTcwOTA0LTUwOWMtNGI0Zi1iNjc2LTJiMGRlZjA3M2U2YyJ9' },
          { id: 'ca-account-status', label_en: 'Account Status Overview', label_ar: 'نظرة عامة على حالة الحسابات', url: 'https://app.powerbi.com/view?r=eyJrIjoiZmVlNTUwMzItYjYzOC00ZjQ5LTkwZDYtMmZjOTBkZDU0NmY0IiwidCI6IjZjZTcwOTA0LTUwOWMtNGI0Zi1iNjc2LTJiMGRlZjA3M2U2YyJ9' },
          { id: 'ca-subscription', label_en: 'Subscription Analytics', label_ar: 'تحليل الاشتراكات', url: 'https://app.powerbi.com/view?r=eyJrIjoiZmVlNTUwMzItYjYzOC00ZjQ5LTkwZDYtMmZjOTBkZDU0NmY0IiwidCI6IjZjZTcwOTA0LTUwOWMtNGI0Zi1iNjc2LTJiMGRlZjA3M2U2YyJ9' },
          { id: 'ca-segmentation', label_en: 'Customer Segmentation Report', label_ar: 'تقرير تصنيف العملاء', url: 'https://app.powerbi.com/view?r=eyJrIjoiZmVlNTUwMzItYjYzOC00ZjQ5LTkwZDYtMmZjOTBkZDU0NmY0IiwidCI6IjZjZTcwOTA0LTUwOWMtNGI0Zi1iNjc2LTJiMGRlZjA3M2U2YyJ9' },
          { id: 'ca-premise', label_en: 'Premise Report', label_ar: 'تقرير المنشآت', url: 'https://app.powerbi.com/view?r=eyJrIjoiZmVlNTUwMzItYjYzOC00ZjQ5LTkwZDYtMmZjOTBkZDU0NmY0IiwidCI6IjZjZTcwOTA0LTUwOWMtNGI0Zi1iNjc2LTJiMGRlZjA3M2U2YyJ9' },
        ],
      },
      {
        id: 'new-connections',
        label_en: 'New Connections Status',
        label_ar: 'حالة التوصيلات الجديدة',
        description_en:
          'Real-time tracking of new water connection requests, validation stages, and installation status.',
        description_ar:
          'تتبع فوري لطلبات توصيل المياه الجديدة ومراحل التحقق وحالة التركيب.',
        url: 'https://app.powerbi.com/view?r=eyJrIjoiZmVlNTUwMzItYjYzOC00ZjQ5LTkwZDYtMmZjOTBkZDU0NmY0IiwidCI6IjZjZTcwOTA0LTUwOWMtNGI0Zi1iNjc2LTJiMGRlZjA3M2U2YyJ9',
        reports: [],
      },
      // ── Customer Care categories ───────────────────────────────────────────
      {
        id: 'cc-collection',
        label_en: 'Collection',
        label_ar: 'التحصيل',
        description_en: 'Collection performance, outstanding balances, and payment tracking across all regions.',
        description_ar: 'أداء التحصيل والأرصدة المستحقة وتتبع المدفوعات عبر جميع المناطق.',
        url: 'https://app.powerbi.com/view?r=eyJrIjoiZmVlNTUwMzItYjYzOC00ZjQ5LTkwZDYtMmZjOTBkZDU0NmY0IiwidCI6IjZjZTcwOTA0LTUwOWMtNGI0Zi1iNjc2LTJiMGRlZjA3M2U2YyJ9',
        reports: [
          { id: 'mostashar', label_en: 'Mostashar Report Scenario 1', label_ar: 'تقرير مستشار - السيناريو 1' },
          { id: 'account-mapping', label_en: 'Customer Account Mapping', label_ar: 'تعيين حسابات العملاء' },
          { id: 'customer-info', label_en: 'Customer Info', label_ar: 'معلومات العملاء' },
          { id: 'moj-deed', label_en: 'MOJ Deed Data Report', label_ar: 'تقرير بيانات صك وزارة العدل' },
        ],
      },
      {
        id: 'cc-resolution',
        label_en: 'Resolution',
        label_ar: 'معالجة الطلبات',
        description_en: 'Customer complaint and service request resolution metrics and SLA tracking.',
        description_ar: 'مقاييس معالجة شكاوى العملاء وطلبات الخدمة وتتبع مستوى الخدمة.',
        url: 'https://app.powerbi.com/view?r=eyJrIjoiZmVlNTUwMzItYjYzOC00ZjQ5LTkwZDYtMmZjOTBkZDU0NmY0IiwidCI6IjZjZTcwOTA0LTUwOWMtNGI0Zi1iNjc2LTJiMGRlZjA3M2U2YyJ9',
        reports: [
          { id: 'staff-performance', label_en: 'Staff Performance Dashboard', label_ar: 'لوحة أداء الموظفين' },
          { id: 'progression-person', label_en: 'Progression of Person Data Update', label_ar: 'تطور تحديث بيانات الأشخاص' },
          { id: 'rashad', label_en: 'Rashad Subscription', label_ar: 'اشتراك رشاد' },
          { id: 'ehsan', label_en: 'Ehsan Customers Report', label_ar: 'تقرير عملاء إحسان' },
        ],
      },
      {
        id: 'cc-metering-billing',
        label_en: 'Metering and Billing',
        label_ar: 'العدادات والفوترة',
        description_en: 'Meter reading accuracy, billing cycles, invoicing status, and revenue leakage analysis.',
        description_ar: 'دقة قراءة العداد ودورات الفوترة وحالة الفواتير وتحليل التسرب في الإيرادات.',
        url: 'https://app.powerbi.com/view?r=eyJrIjoiZmVlNTUwMzItYjYzOC00ZjQ5LTkwZDYtMmZjOTBkZDU0NmY0IiwidCI6IjZjZTcwOTA0LTUwOWMtNGI0Zi1iNjc2LTJiMGRlZjA3M2U2YyJ9',
        reports: [
          { id: 'premise', label_en: 'Premise Report', label_ar: 'تقرير المنشآت' },
          { id: 'swa-monthly', label_en: 'SWA Monthly Report', label_ar: 'تقرير SWA الشهري' },
          { id: 'data-availability', label_en: 'Customer Data Availability', label_ar: 'توافر بيانات العملاء' },
          { id: 'progression-customer', label_en: 'Progression of Customer Data Update', label_ar: 'تطور تحديث بيانات العملاء' },
        ],
      },
      {
        id: 'cc-water-quality',
        label_en: 'Water Quality',
        label_ar: 'جودة المياه',
        description_en: 'Water quality monitoring, compliance with standards, and laboratory analysis reports.',
        description_ar: 'مراقبة جودة المياه والامتثال للمعايير وتقارير التحليل المختبري.',
        url: 'https://app.powerbi.com/view?r=eyJrIjoiZmVlNTUwMzItYjYzOC00ZjQ5LTkwZDYtMmZjOTBkZDU0NmY0IiwidCI6IjZjZTcwOTA0LTUwOWMtNGI0Zi1iNjc2LTJiMGRlZjA3M2U2YyJ9',
        reports: [
          { id: 'wq-compliance', label_en: 'Water Quality Compliance Report', label_ar: 'تقرير الامتثال لجودة المياه' },
          { id: 'wq-lab', label_en: 'Laboratory Analysis Dashboard', label_ar: 'لوحة التحليل المختبري' },
          { id: 'wq-chlorine', label_en: 'Chlorine Levels Monitoring', label_ar: 'مراقبة مستويات الكلور' },
        ],
      },
      {
        id: 'cc-complaints',
        label_en: 'Customer Complaints',
        label_ar: 'شكاوى العملاء',
        description_en: 'Complaint volume, category breakdown, response times, and escalation tracking.',
        description_ar: 'حجم الشكاوى وتصنيفها وأوقات الاستجابة وتتبع التصعيد.',
        url: 'https://app.powerbi.com/view?r=eyJrIjoiZmVlNTUwMzItYjYzOC00ZjQ5LTkwZDYtMmZjOTBkZDU0NmY0IiwidCI6IjZjZTcwOTA0LTUwOWMtNGI0Zi1iNjc2LTJiMGRlZjA3M2U2YyJ9',
        reports: [
          { id: 'complaint-summary', label_en: 'Complaint Summary Report', label_ar: 'تقرير ملخص الشكاوى' },
          { id: 'complaint-category', label_en: 'Complaint Category Breakdown', label_ar: 'تصنيف الشكاوى' },
          { id: 'response-time', label_en: 'Response Time Analysis', label_ar: 'تحليل أوقات الاستجابة' },
          { id: 'escalation-tracker', label_en: 'Escalation Tracker', label_ar: 'متابعة التصعيد' },
        ],
      },
      {
        id: 'cc-satisfaction',
        label_en: 'Customer Satisfaction',
        label_ar: 'رضا العملاء',
        description_en: 'Customer satisfaction scores, NPS tracking, and feedback analysis across all regions.',
        description_ar: 'درجات رضا العملاء وتتبع صافي نقاط المروجين وتحليل الملاحظات عبر جميع المناطق.',
        url: 'https://app.powerbi.com/view?r=eyJrIjoiZmVlNTUwMzItYjYzOC00ZjQ5LTkwZDYtMmZjOTBkZDU0NmY0IiwidCI6IjZjZTcwOTA0LTUwOWMtNGI0Zi1iNjc2LTJiMGRlZjA3M2U2YyJ9',
        reports: [
          { id: 'csat-score', label_en: 'CSAT Score Dashboard', label_ar: 'لوحة درجة رضا العملاء' },
          { id: 'nps-report', label_en: 'NPS Tracking Report', label_ar: 'تقرير تتبع NPS' },
          { id: 'feedback-analysis', label_en: 'Customer Feedback Analysis', label_ar: 'تحليل ملاحظات العملاء' },
        ],
      },
    ],
  },
  {
    id: 'finance',
    label_en: 'Finance',
    label_ar: 'المالية',
    icon: 'DollarSign',
    dashboards: [
      {
        id: 'financial-overview',
        label_en: 'Financial Overview',
        label_ar: 'نظرة مالية عامة',
        description_en: 'Revenue, billing, collections, and financial KPIs across all regions.',
        description_ar: 'الإيرادات والفوترة والتحصيل ومؤشرات الأداء المالي عبر جميع المناطق.',
        url: 'https://app.powerbi.com/view?r=eyJrIjoiZmVlNTUwMzItYjYzOC00ZjQ5LTkwZDYtMmZjOTBkZDU0NmY0IiwidCI6IjZjZTcwOTA0LTUwOWMtNGI0Zi1iNjc2LTJiMGRlZjA3M2U2YyJ9',
        reports: [],
      },
      // ── Finance sub-categories ────────────────────────────────────────────
      {
        id: 'fin-revenue',
        label_en: 'Revenue & Collections',
        label_ar: 'الإيرادات والتحصيل',
        description_en: 'Revenue streams, collection rates, and billing performance by region.',
        description_ar: 'مصادر الإيرادات ومعدلات التحصيل وأداء الفوترة حسب المنطقة.',
        url: 'https://app.powerbi.com/view?r=eyJrIjoiZmVlNTUwMzItYjYzOC00ZjQ5LTkwZDYtMmZjOTBkZDU0NmY0IiwidCI6IjZjZTcwOTA0LTUwOWMtNGI0Zi1iNjc2LTJiMGRlZjA3M2U2YyJ9',
        group: 'financial-overview',
        reports: [
          { id: 'fin-rev-q1', label_en: 'Q1 Revenue Report', label_ar: 'تقرير إيرادات الربع الأول' },
          { id: 'fin-rev-q2', label_en: 'Q2 Revenue Report', label_ar: 'تقرير إيرادات الربع الثاني' },
          { id: 'fin-collection-rate', label_en: 'Collection Rate Dashboard', label_ar: 'لوحة معدل التحصيل' },
        ],
      },
      {
        id: 'fin-opex',
        label_en: 'OPEX & Budget',
        label_ar: 'النفقات التشغيلية والميزانية',
        description_en: 'Operational expenditures, budget variance, and cost control metrics.',
        description_ar: 'النفقات التشغيلية وانحراف الميزانية ومقاييس ضبط التكاليف.',
        url: 'https://app.powerbi.com/view?r=eyJrIjoiZmVlNTUwMzItYjYzOC00ZjQ5LTkwZDYtMmZjOTBkZDU0NmY0IiwidCI6IjZjZTcwOTA0LTUwOWMtNGI0Zi1iNjc2LTJiMGRlZjA3M2U2YyJ9',
        group: 'financial-overview',
        reports: [
          { id: 'fin-budget-var', label_en: 'Budget Variance Report', label_ar: 'تقرير انحراف الميزانية' },
          { id: 'fin-opex-detail', label_en: 'OPEX Detail Analysis', label_ar: 'تحليل تفصيلي للنفقات التشغيلية' },
          { id: 'fin-energy-cost', label_en: 'Energy Cost Report', label_ar: 'تقرير تكاليف الطاقة' },
        ],
      },
      {
        id: 'fin-accounts',
        label_en: 'Accounts Payable & Receivable',
        label_ar: 'الحسابات المدينة والدائنة',
        description_en: 'Accounts payable aging, receivables status, and cash flow analysis.',
        description_ar: 'تقادم الحسابات الدائنة وحالة المستحقات وتحليل التدفق النقدي.',
        url: 'https://app.powerbi.com/view?r=eyJrIjoiZmVlNTUwMzItYjYzOC00ZjQ5LTkwZDYtMmZjOTBkZDU0NmY0IiwidCI6IjZjZTcwOTA0LTUwOWMtNGI0Zi1iNjc2LTJiMGRlZjA3M2U2YyJ9',
        group: 'financial-overview',
        reports: [
          { id: 'fin-ar-aging', label_en: 'AR Aging Report', label_ar: 'تقرير تقادم المستحقات' },
          { id: 'fin-cashflow', label_en: 'Cash Flow Statement', label_ar: 'قائمة التدفق النقدي' },
        ],
      },
    ],
  },
  {
    id: 'om',
    label_en: 'O&M',
    label_ar: 'التشغيل والصيانة',
    icon: 'Settings',
    dashboards: [
      {
        id: 'om-overview',
        label_en: 'Operations Overview',
        label_ar: 'نظرة عامة على العمليات',
        description_en: 'Operations and maintenance KPIs, field team performance, and asset tracking.',
        description_ar: 'مؤشرات أداء التشغيل والصيانة وأداء الفريق الميداني وتتبع الأصول.',
        url: 'https://app.powerbi.com/view?r=eyJrIjoiZmVlNTUwMzItYjYzOC00ZjQ5LTkwZDYtMmZjOTBkZDU0NmY0IiwidCI6IjZjZTcwOTA0LTUwOWMtNGI0Zi1iNjc2LTJiMGRlZjA3M2U2YyJ9',
        reports: [],
      },
      // ── O&M sub-categories ────────────────────────────────────────────────
      {
        id: 'om-networks',
        label_en: 'Network Operations',
        label_ar: 'عمليات الشبكة',
        description_en: 'Water network performance, NRW rates, and leakage detection.',
        description_ar: 'أداء شبكة المياه ومعدلات المياه غير المدرة والكشف عن التسربات.',
        url: 'https://app.powerbi.com/view?r=eyJrIjoiZmVlNTUwMzItYjYzOC00ZjQ5LTkwZDYtMmZjOTBkZDU0NmY0IiwidCI6IjZjZTcwOTA0LTUwOWMtNGI0Zi1iNjc2LTJiMGRlZjA3M2U2YyJ9',
        group: 'om-overview',
        reports: [
          { id: 'om-nrw', label_en: 'NRW Monthly Report', label_ar: 'تقرير المياه غير المدرة الشهري' },
          { id: 'om-leakage', label_en: 'Leakage Detection Dashboard', label_ar: 'لوحة الكشف عن التسربات' },
          { id: 'om-pressure', label_en: 'Network Pressure Report', label_ar: 'تقرير ضغط الشبكة' },
        ],
      },
      {
        id: 'om-maintenance',
        label_en: 'Maintenance & Assets',
        label_ar: 'الصيانة والأصول',
        description_en: 'Planned vs. reactive maintenance, asset health, and work order tracking.',
        description_ar: 'الصيانة المخططة مقابل التفاعلية وصحة الأصول وتتبع أوامر العمل.',
        url: 'https://app.powerbi.com/view?r=eyJrIjoiZmVlNTUwMzItYjYzOC00ZjQ5LTkwZDYtMmZjOTBkZDU0NmY0IiwidCI6IjZjZTcwOTA0LTUwOWMtNGI0Zi1iNjc2LTJiMGRlZjA3M2U2YyJ9',
        group: 'om-overview',
        reports: [
          { id: 'om-work-orders', label_en: 'Work Orders Report', label_ar: 'تقرير أوامر العمل' },
          { id: 'om-asset-health', label_en: 'Asset Health Dashboard', label_ar: 'لوحة صحة الأصول' },
        ],
      },
    ],
  },
  {
    id: 'projects',
    label_en: 'Projects',
    label_ar: 'المشاريع',
    icon: 'FolderOpen',
    dashboards: [
      {
        id: 'projects-overview',
        label_en: 'Projects Overview',
        label_ar: 'نظرة عامة على المشاريع',
        description_en: 'Active projects, timelines, budgets, and contractor performance metrics.',
        description_ar: 'المشاريع النشطة والجداول الزمنية والميزانيات ومقاييس أداء المقاولين.',
        url: 'https://app.powerbi.com/view?r=eyJrIjoiZmVlNTUwMzItYjYzOC00ZjQ5LTkwZDYtMmZjOTBkZDU0NmY0IiwidCI6IjZjZTcwOTA0LTUwOWMtNGI0Zi1iNjc2LTJiMGRlZjA3M2U2YyJ9',
        reports: [],
      },
      // ── Projects sub-categories ───────────────────────────────────────────
      {
        id: 'proj-active',
        label_en: 'Active Projects',
        label_ar: 'المشاريع النشطة',
        description_en: 'All ongoing projects with current status, completion %, and contractor info.',
        description_ar: 'جميع المشاريع الجارية مع الحالة الحالية ونسبة الإنجاز ومعلومات المقاول.',
        url: 'https://app.powerbi.com/view?r=eyJrIjoiZmVlNTUwMzItYjYzOC00ZjQ5LTkwZDYtMmZjOTBkZDU0NmY0IiwidCI6IjZjZTcwOTA0LTUwOWMtNGI0Zi1iNjc2LTJiMGRlZjA3M2U2YyJ9',
        group: 'projects-overview',
        reports: [
          { id: 'proj-status', label_en: 'Project Status Dashboard', label_ar: 'لوحة حالة المشاريع' },
          { id: 'proj-contractor', label_en: 'Contractor Performance Report', label_ar: 'تقرير أداء المقاولين' },
          { id: 'proj-milestones', label_en: 'Milestones Tracker', label_ar: 'متابعة الإنجازات' },
        ],
      },
      {
        id: 'proj-planning',
        label_en: 'Project Planning & Budget',
        label_ar: 'تخطيط المشاريع والميزانية',
        description_en: 'Pipeline projects, budget allocation, and resource planning.',
        description_ar: 'مشاريع قيد التخطيط وتخصيص الميزانية وتخطيط الموارد.',
        url: 'https://app.powerbi.com/view?r=eyJrIjoiZmVlNTUwMzItYjYzOC00ZjQ5LTkwZDYtMmZjOTBkZDU0NmY0IiwidCI6IjZjZTcwOTA0LTUwOWMtNGI0Zi1iNjc2LTJiMGRlZjA3M2U2YyJ9',
        group: 'projects-overview',
        reports: [
          { id: 'proj-budget-alloc', label_en: 'Budget Allocation Report', label_ar: 'تقرير تخصيص الميزانية' },
          { id: 'proj-pipeline', label_en: 'Pipeline Projects Report', label_ar: 'تقرير مشاريع الخط' },
        ],
      },
    ],
  },
  {
    id: 'strategy',
    label_en: 'Strategy & Business Planning',
    label_ar: 'الاستراتيجية وتخطيط الأعمال',
    icon: 'TrendingUp',
    dashboards: [
      {
        id: 'strategy-overview',
        label_en: 'Strategy Overview',
        label_ar: 'نظرة استراتيجية عامة',
        description_en: 'KPIs aligned with Vision 2030, strategic initiatives, and performance scorecards.',
        description_ar: 'مؤشرات الأداء المتوافقة مع رؤية 2030 والمبادرات الاستراتيجية وبطاقات الأداء.',
        url: 'https://app.powerbi.com/view?r=eyJrIjoiZmVlNTUwMzItYjYzOC00ZjQ5LTkwZDYtMmZjOTBkZDU0NmY0IiwidCI6IjZjZTcwOTA0LTUwOWMtNGI0Zi1iNjc2LTJiMGRlZjA3M2U2YyJ9',
        reports: [],
      },
    ],
  },
  {
    id: 'shared-services',
    label_en: 'Shared Services',
    label_ar: 'الخدمات المشتركة',
    icon: 'Share2',
    dashboards: [
      {
        id: 'shared-overview',
        label_en: 'Shared Services Overview',
        label_ar: 'نظرة عامة على الخدمات المشتركة',
        description_en: 'HR, procurement, and shared department performance metrics.',
        description_ar: 'مؤشرات أداء الموارد البشرية والمشتريات والأقسام المشتركة.',
        url: 'https://app.powerbi.com/view?r=eyJrIjoiZmVlNTUwMzItYjYzOC00ZjQ5LTkwZDYtMmZjOTBkZDU0NmY0IiwidCI6IjZjZTcwOTA0LTUwOWMtNGI0Zi1iNjc2LTJiMGRlZjA3M2U2YyJ9',
        reports: [],
      },
    ],
  },
  {
    id: 'it-reports',
    label_en: 'IT Reports',
    label_ar: 'تقارير تقنية المعلومات',
    icon: 'Monitor',
    dashboards: [
      {
        id: 'it-overview',
        label_en: 'IT Overview',
        label_ar: 'نظرة عامة على تقنية المعلومات',
        description_en: 'System uptime, helpdesk tickets, infrastructure KPIs, and IT performance.',
        description_ar: 'وقت تشغيل النظام وتذاكر مكتب المساعدة ومؤشرات البنية التحتية وأداء تقنية المعلومات.',
        url: 'https://app.powerbi.com/view?r=eyJrIjoiZmVlNTUwMzItYjYzOC00ZjQ5LTkwZDYtMmZjOTBkZDU0NmY0IiwidCI6IjZjZTcwOTA0LTUwOWMtNGI0Zi1iNjc2LTJiMGRlZjA3M2U2YyJ9',
        reports: [],
      },
    ],
  },
  {
    id: 'imo-technical',
    label_en: 'IMO Technical',
    label_ar: 'تقني IMO',
    icon: 'Wrench',
    dashboards: [
      {
        id: 'imo-overview',
        label_en: 'IMO Technical Overview',
        label_ar: 'نظرة تقنية عامة على IMO',
        description_en: 'Technical compliance, inspections, and IMO performance metrics.',
        description_ar: 'الامتثال التقني والتفتيش ومقاييس أداء IMO.',
        url: 'https://app.powerbi.com/view?r=eyJrIjoiZmVlNTUwMzItYjYzOC00ZjQ5LTkwZDYtMmZjOTBkZDU0NmY0IiwidCI6IjZjZTcwOTA0LTUwOWMtNGI0Zi1iNjc2LTJiMGRlZjA3M2U2YyJ9',
        reports: [],
      },
    ],
  },
];

// ─── Helpers ───────────────────────────────────────────────────────────────────
function findDashboard(dashboardId) {
  for (const section of sections) {
    const dashboard = section.dashboards.find((d) => d.id === dashboardId);
    if (dashboard) {
      return {
        ...dashboard,
        sectionId: section.id,
        sectionLabel_en: section.label_en,
        sectionLabel_ar: section.label_ar,
      };
    }
  }
  return null;
}

// ─── Routes ────────────────────────────────────────────────────────────────────

/** GET /api/sections — all sections with dashboards */
app.get('/api/sections', (_req, res) => {
  res.json(sections);
});

/** GET /api/sections/:sectionId — single section */
app.get('/api/sections/:sectionId', (req, res) => {
  const section = sections.find((s) => s.id === req.params.sectionId);
  if (!section) return res.status(404).json({ error: 'Section not found' });
  res.json(section);
});

/** GET /api/sections/:sectionId/dashboards — dashboards for a section */
app.get('/api/sections/:sectionId/dashboards', (req, res) => {
  const section = sections.find((s) => s.id === req.params.sectionId);
  if (!section) return res.status(404).json({ error: 'Section not found' });
  res.json(section.dashboards);
});

/** POST /api/sections/:sectionId/categories — add a new subcategory (no URL required) */
app.post('/api/sections/:sectionId/categories', (req, res) => {
  const { sectionId } = req.params;
  const { label_en, description_en } = req.body;

  if (!label_en || typeof label_en !== 'string' || !label_en.trim()) {
    return res.status(400).json({ error: 'Category name is required' });
  }

  const section = sections.find((s) => s.id === sectionId);
  if (!section) return res.status(404).json({ error: 'Section not found' });

  const newCategory = {
    id: `cat-${sectionId}-${Date.now()}`,
    label_en: label_en.trim(),
    label_ar: (req.body.label_ar || label_en).trim(),
    description_en: (description_en || '').trim(),
    description_ar: (req.body.description_ar || description_en || '').trim(),
    url: '',
    reports: [],
    isCustomCategory: true,
  };

  section.dashboards.push(newCategory);
  res.status(201).json(newCategory);
});

/** POST /api/sections/:sectionId/dashboards — add a custom dashboard to a section */
app.post('/api/sections/:sectionId/dashboards', (req, res) => {
  const { sectionId } = req.params;
  const { label_en, description_en, channel, url } = req.body;

  if (!label_en || typeof label_en !== 'string' || !label_en.trim()) {
    return res.status(400).json({ error: 'Report name is required' });
  }
  if (!url || typeof url !== 'string' || !url.trim()) {
    return res.status(400).json({ error: 'Report URL is required' });
  }
  // Basic URL validation
  try { new URL(url.trim()); } catch {
    return res.status(400).json({ error: 'Invalid URL format' });
  }

  const section = sections.find((s) => s.id === sectionId);
  if (!section) return res.status(404).json({ error: 'Section not found' });

  const newDashboard = {
    id: `custom-${sectionId}-${Date.now()}`,
    label_en: label_en.trim(),
    label_ar: (req.body.label_ar || label_en).trim(),
    description_en: (description_en || '').trim(),
    description_ar: (req.body.description_ar || description_en || '').trim(),
    channel: channel || 'other',
    url: url.trim(),
    reports: [],
    isCustom: true,
  };

  section.dashboards.push(newDashboard);
  res.status(201).json(newDashboard);
});

/** POST /api/dashboards/:dashboardId/reports — add a report to a dashboard's reports array */
app.post('/api/dashboards/:dashboardId/reports', (req, res) => {
  const { dashboardId } = req.params;
  const { label_en, url } = req.body;

  if (!label_en || typeof label_en !== 'string' || !label_en.trim()) {
    return res.status(400).json({ error: 'Report name is required' });
  }
  if (!url || typeof url !== 'string' || !url.trim()) {
    return res.status(400).json({ error: 'Report URL is required' });
  }
  try { new URL(url.trim()); } catch {
    return res.status(400).json({ error: 'Invalid URL format' });
  }

  const dashboard = findDashboard(dashboardId);
  if (!dashboard) return res.status(404).json({ error: 'Dashboard not found' });

  if (!Array.isArray(dashboard.reports)) dashboard.reports = [];

  const newReport = {
    id: `report-${dashboardId}-${Date.now()}`,
    label_en: label_en.trim(),
    label_ar: (req.body.label_ar || label_en).trim(),
    url: url.trim(),
    isCustom: true,
  };

  dashboard.reports.push(newReport);
  res.status(201).json(newReport);
});

/** DELETE /api/sections/:sectionId/dashboards/:dashboardId — remove a dashboard/category */
app.delete('/api/sections/:sectionId/dashboards/:dashboardId', (req, res) => {
  const { sectionId, dashboardId } = req.params;
  const section = sections.find((s) => s.id === sectionId);
  if (!section) return res.status(404).json({ error: 'Section not found' });
  const idx = section.dashboards.findIndex((d) => d.id === dashboardId);
  if (idx === -1) return res.status(404).json({ error: 'Dashboard not found' });
  section.dashboards.splice(idx, 1);
  res.json({ success: true });
});

/** DELETE /api/dashboards/:dashboardId/reports/:reportId — remove a report */
app.delete('/api/dashboards/:dashboardId/reports/:reportId', (req, res) => {
  const { dashboardId, reportId } = req.params;
  for (const section of sections) {
    const dashboard = section.dashboards.find((d) => d.id === dashboardId);
    if (dashboard) {
      const idx = (dashboard.reports || []).findIndex((r) => r.id === reportId);
      if (idx === -1) return res.status(404).json({ error: 'Report not found' });
      dashboard.reports.splice(idx, 1);
      return res.json({ success: true });
    }
  }
  return res.status(404).json({ error: 'Dashboard not found' });
});

/** GET /api/dashboards/:dashboardId — single dashboard (across all sections) */
app.get('/api/dashboards/:dashboardId', (req, res) => {
  const dashboard = findDashboard(req.params.dashboardId);
  if (!dashboard) return res.status(404).json({ error: 'Dashboard not found' });
  res.json(dashboard);
});

/** Health check */
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── 404 fallback ──────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ─── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n  NWC BI Portal API running on http://localhost:${PORT}\n`);
});
