# NWC Smart Reports BI Portal
## بوابة التقارير الذكية — National Water Company (شركة المياه الوطنية)

---

## ⚡ First Time Setup — Run This on Your Computer (Saudi Client Guide)

> **Read this section first before anything else.**

This section is written for someone downloading this project for the first time.  
No prior programming knowledge is required. Follow these steps exactly, in order.

---

### Step 1 — Install Node.js (One Time Only)

Node.js is the engine that runs this application. You only install it once.

1. Open your web browser and go to: **https://nodejs.org**
2. Click the button that says **"LTS"** (the recommended version — it will say something like "22.x.x LTS")
3. Download the Windows installer (`.msi` file)
4. Run the installer — click **Next** on every screen, leave all options as default
5. When it finishes, restart your computer

**To verify Node.js installed correctly:**
1. Press **Windows key + R** on your keyboard
2. Type `cmd` and press Enter — a black Command Prompt window opens
3. Type this and press Enter:
   ```
   node --version
   ```
4. You should see something like `v22.x.x` — that means it worked

> Node.js also installs **npm** automatically — npm is the tool that downloads the project's code libraries.

---

### Step 2 — Download the Project from GitHub

1. Go to the GitHub repository link (your contact will share this link with you)
2. Click the green **"Code"** button
3. Click **"Download ZIP"**
4. Save the ZIP file somewhere on your computer (for example: `C:\Projects\`)
5. Right-click the ZIP file → **"Extract All"** → choose a folder → click Extract

You should now have a folder called something like `Dashboard-Project-main` or `nwc-bi-portal-main`.

> **Important:** Make sure the folder is on a local drive (C: or D:) — **not** on a USB stick or network drive.

---

### Step 3 — Open the Project Folder in Command Prompt

1. Open the extracted project folder in File Explorer
2. Click on the address bar at the top of the window (where it shows the folder path)
3. Type `cmd` and press Enter — a Command Prompt window opens directly inside that folder

You should see the folder path in the command prompt, for example:
```
C:\Projects\nwc-bi-portal-main>
```

---

### Step 4 — Install All Libraries (One Time Only)

In the Command Prompt window, type this exactly and press Enter:

```
npm run install:all
```

This will download all the required code libraries automatically. It may take **2–5 minutes** depending on your internet speed. You will see lots of text scrolling — this is normal. Wait until it finishes and you see the folder path again.

> You only need to do this **once**. You do not need to repeat this step next time you want to run the app.

---

### Step 5 — Start the Application

In the same Command Prompt window, type this and press Enter:

```
npm run dev
```

Wait about 10–15 seconds. You will see messages like:
```
NWC BI Portal API running on http://localhost:5000
Local:   http://localhost:5173/
```

When you see both lines, the application is running.

---

### Step 6 — Open the Portal in Your Browser

Open any web browser (Chrome, Edge, Firefox) and go to:

**http://localhost:5173**

The NWC Smart Reports BI Portal will open.

---

### Stopping the Application

When you are done, go back to the Command Prompt window and press **Ctrl + C** on your keyboard. Type `Y` if it asks you to confirm.

---

### Next Time You Want to Run It

You do **not** need to install anything again. Simply:
1. Open Command Prompt inside the project folder (Step 3)
2. Type `npm run dev` and press Enter (Step 5)
3. Open `http://localhost:5173` in your browser (Step 6)

---

### About the Time and Date Display

The clock and calendar shown in the top-right corner of the portal:
- **Shows your computer's local time** — it reads from your Windows clock automatically
- Since your computer is in Saudi Arabia (UTC+3), it will show **Saudi Arabia Standard Time (AST)** correctly
- The Hijri (Islamic) calendar date is calculated automatically from today's date — no setup needed
- If you switch the portal to Arabic language, the time and date will display in Arabic numerals and Arabic format

> **No time zone configuration is required.** The portal will always show the correct local time wherever it is running.

---

### Summary — Everything You Need to Install

| What | Why | Where to get it |
|---|---|---|
| **Node.js (LTS)** | Runs the application engine | https://nodejs.org — click "LTS" |
| **npm packages** | Code libraries (downloaded automatically with `npm run install:all`) | Automatic — no manual download |
| **Web browser** | To view the portal | Chrome, Edge, or Firefox — already on your computer |

That's it. No other software is required.

---

---

## What Is This Project?

The **NWC Smart Reports BI Portal** is an internal web application built for **National Water Company (شركة المياه الوطنية)**. It serves as a centralized, bilingual dashboard hub where employees and managers can browse, navigate, and view all of the company's Power BI reports organized by department — without needing to log into Power BI directly.

Think of it as a **smart front door** to all company dashboards: clean, branded, easy to navigate, and available in both English and Arabic.

---

## Who Is This For?

- **Department heads and managers** who need quick access to operational reports
- **Analysts and team leads** browsing reports across Customer Care, Finance, O&M, and Projects
- **Senior leadership** who want a professional, branded view of all company data

No technical knowledge is required to use the portal — it is a point-and-click web application.

---

## What Does It Look Like?

The portal has three visual layers:

### 1. The Home Page
When you open the portal, you land on a homepage showing all available **Sections** (departments). Each section is shown as a large card with an icon, Arabic and English name, and a count of how many reports are inside. Clicking a card takes you into that department.

### 2. The Section Page (Department Level)
Inside a section, you see all the **categories** within that department laid out as cards. For example, inside "Customer Care" you will find cards for:
- Customer Analytics
- Collection
- Resolution
- Metering and Billing
- Water Quality
- Customer Complaints
- Customer Satisfaction
- New Connections Status

Each card shows how many reports are available inside it and has a "View Reports" button. Clicking takes you one level deeper.

### 3. The Report Tiles Page (Report List Level)
Inside a category you see individual **report tiles** — one tile per report. Each tile shows the report name in English and Arabic. Clicking a tile opens the full Power BI report embedded directly on the screen, full-width, without leaving the portal.

---

## Key Features

| Feature | Description |
|---|---|
| **Bilingual (Arabic + English)** | A single click toggles the entire portal between English (left-to-right) and Arabic (right-to-left). All labels, headings, and navigation update instantly. |
| **NWC Branding** | Official NWC circular logo appears in the top navbar and footer. Colors match NWC brand standards: midnight navy (#0A2540) sidebar, teal accent (#00B4D8). |
| **Power BI Embedding** | Any report tile you click opens the live Power BI dashboard embedded directly inside the portal page — no separate browser tab or Power BI login needed. |
| **Breadcrumb Navigation** | At the top of every page there is a trail showing exactly where you are: Home → Section → Category. Clicking any part of the trail takes you back there. |
| **Hijri + Gregorian Date** | The top navbar shows the current date in both the Islamic Hijri calendar and the standard Gregorian calendar — always live and accurate. |
| **Animated Transitions** | Pages and cards animate smoothly when navigating, giving the portal a polished, modern feel. |
| **Global Search** | Press **Ctrl + K** from anywhere in the portal to open a search bar and instantly find any section or report by name. |
| **Responsive Design** | Works on desktop, laptop, and tablet screens. The sidebar collapses on smaller screens into a slide-out drawer. |
| **Saudi Vision 2030 Branding** | The footer includes a Vision 2030 badge, reinforcing NWC's alignment with the national transformation program. |

---

## Portal Structure — All Sections and Reports

The portal is organized into **8 main sections**, each containing categories and individual reports:

---

### 1. Customer Care — خدمة العملاء

**Customer Analytics** (5 reports)
- Customer Demographics Analysis / تحليل التركيبة السكانية للعملاء
- Account Status Overview / نظرة عامة على حالة الحسابات
- Subscription Analytics / تحليل الاشتراكات
- Customer Segmentation Report / تقرير تصنيف العملاء
- Premise Report / تقرير المنشآت

**Collection — التحصيل** (4 reports)
- Mostashar Report Scenario 1 / تقرير مستشار - السيناريو 1
- Customer Account Mapping / تعيين حسابات العملاء
- Customer Info / معلومات العملاء
- MOJ Deed Data Report / تقرير بيانات صك وزارة العدل

**Resolution — معالجة الطلبات** (4 reports)
- Staff Performance Dashboard / لوحة أداء الموظفين
- Progression of Person Data Update / تطور تحديث بيانات الأشخاص
- Rashad Subscription / اشتراك رشاد
- Ehsan Customers Report / تقرير عملاء إحسان

**Metering and Billing — العدادات والفوترة** (4 reports)
- Premise Report / تقرير المنشآت
- SWA Monthly Report / التقرير الشهري
- Data Availability Report / تقرير توافر البيانات
- Progression of Customer Data Update / تطور تحديث بيانات العملاء

**Water Quality — جودة المياه** (3 reports)
- Water Quality Compliance Report / تقرير الامتثال لجودة المياه
- Lab Analysis Report / تقرير التحليل المخبري
- Chlorine Levels Dashboard / لوحة مستويات الكلور

**Customer Complaints — شكاوى العملاء** (4 reports)
- Complaint Summary Dashboard / لوحة ملخص الشكاوى
- Complaint Category Breakdown / تصنيف الشكاوى
- Response Time Analysis / تحليل وقت الاستجابة
- Escalation Tracker / متتبع التصعيد

**Customer Satisfaction — رضا العملاء** (3 reports)
- CSAT Score Report / تقرير درجة رضا العملاء
- NPS Report / تقرير صافي نقاط الترويج
- Feedback Analysis Dashboard / لوحة تحليل التغذية الراجعة

**New Connections Status** — Direct Power BI dashboard link

---

### 2. Finance — المالية

**Financial Overview** contains three sub-categories:
- **Revenue & Collections** — Revenue tracking, billing performance, collection KPIs
- **Budget & Expenditure** — Budget utilization, cost center analysis
- **Financial Performance** — Profitability, financial ratios, variance reports

---

### 3. O&M — التشغيل والصيانة

**Operations Overview** contains:
- **Asset Management** — Equipment health, maintenance schedules, asset lifecycle reports
- **Operational KPIs** — Uptime, efficiency ratios, SLA compliance dashboards

---

### 4. Projects — المشاريع

**Projects Overview** contains:
- **Active Projects** — Status of ongoing infrastructure and capital projects
- **Project Completion** — Milestone tracking, budget vs. actuals for completed projects

---

### 5. Strategy — الاستراتيجية
Dedicated section for strategic planning and Vision 2030 alignment dashboards.

### 6. Shared Services — الخدمات المشتركة
HR, procurement, and cross-functional shared services reports.

### 7. IT Reports — تقارير تقنية المعلومات
System performance, infrastructure monitoring, and IT operations dashboards.

### 8. IMO Technical — الفني IMO
Technical operational reports from the Infrastructure Management Office.

### 9. Decision Intelligence — الذكاء في القرارات
AI-assisted analytics and executive decision-support dashboards.

---

## How Navigation Works (Step by Step)

1. **Open the portal** at `http://localhost:5173` in any web browser.
2. You see the **Home page** with all department section cards.
3. **Click a section card** (e.g. "Customer Care") to enter that department.
4. You see **category cards** for that department. Each card shows a report count.
5. **Click "View Reports"** on a category card to see the list of individual reports.
6. **Click a report tile** to open the full Power BI report embedded in the page.
7. Use the **breadcrumb trail** at the top to go back at any step, or click the sidebar to jump directly to any section.
8. Press the **language button** in the top-right corner to switch between English and Arabic at any time.

---

## The Sidebar

The left sidebar is always visible and lists every section in the portal. Clicking a section in the sidebar expands it to show its categories. This lets you jump directly to any part of the portal without going back to the homepage first. The sidebar can be collapsed to give more screen space to the report content.

---

## Language Support

The portal is fully bilingual. Every piece of text — section names, category names, report names, navigation labels, buttons, and error messages — exists in both **English** and **Arabic**. When Arabic is selected, the entire page layout flips to right-to-left alignment, as is standard for Arabic content. Switching languages does not reload the page; it updates instantly.

---

## Branding

| Element | Details |
|---|---|
| **Logo** | Official NWC circular teal/blue sphere logo, shown in both the top navbar and the footer |
| **Primary Color** | Midnight Navy `#0A2540` — used for the sidebar and navbar background |
| **Accent Color** | Teal `#00B4D8` — used for buttons, active indicators, and highlights |
| **Company Name** | Shown bilingually: "شركة المياه الوطنية — National Water Company" |
| **Portal Name** | "Smart Reports BI Portal / بوابة التقارير الذكية" |
| **Footer** | Includes NWC logo, Vision 2030 alignment badge, copyright notice, and social links |

---

## How to Start the Application

> **First time?** Follow the full step-by-step guide at the top of this document — it covers Node.js installation, downloading from GitHub, and running the app for the first time.

### Requirements
- **Node.js LTS** installed (download from https://nodejs.org — click "LTS")
- The project folder on a local drive (not USB / network)

### First-time setup
Open Command Prompt inside the project folder and run:
```bash
npm run install:all
```

### Every time — start the portal
```bash
npm run dev
```

Then open **http://localhost:5173** in any browser.

### Stopping
Press **Ctrl + C** in the Command Prompt window.

---

## Folder Structure (For Reference)

```
Dashboard Project/
│
├── package.json              ← Root file — runs both server and client together
│
├── server/
│   ├── index.js              ← The backend server — stores all sections, categories,
│   │                            and report data; serves the API
│   └── package.json
│
└── client/
    ├── public/
    │   └── nwc-logo.png      ← Official NWC logo image file
    │
    └── src/
        ├── pages/
        │   ├── Home.jsx           ← Homepage with all section cards
        │   ├── SectionPage.jsx    ← Department page with category cards
        │   └── DashboardViewer.jsx← Report tile list and embedded Power BI viewer
        │
        ├── components/
        │   ├── TopNavbar.jsx      ← Top navigation bar with logo, language toggle, date
        │   ├── Sidebar.jsx        ← Left sidebar with section navigation
        │   └── Footer.jsx         ← Footer with logo and Vision 2030 badge
        │
        └── locales/
            ├── en/translation.json ← All English text labels
            └── ar/translation.json ← All Arabic text labels
```

---

## How to Add a New Report (For Administrators)

All portal data lives in `server/index.js`. To add a new report to an existing category:

1. Open `server/index.js` in a text editor.
2. Find the section and dashboard (category) you want to add to.
3. Inside its `reports: [ ]` array, add a new entry following this pattern:

```js
{
  id: 'unique-id-here',
  label_en: 'Report Name in English',
  label_ar: 'اسم التقرير بالعربية',
  url: 'https://app.powerbi.com/view?r=YOUR_REPORT_EMBED_URL_HERE',
},
```

4. Save the file and restart the server. The new report tile will appear automatically.

> **Note**: The `url` is the Power BI "Embed" link for the report. This can be obtained from Power BI by going to File → Embed Report → Website or Portal, and copying the link provided.

---

## How to Add a New Category to a Section

In `server/index.js`, inside the `sections` array, find the target section and add a new object to its `dashboards` array:

```js
{
  id: 'unique-category-id',
  label_en: 'Category Name in English',
  label_ar: 'اسم الفئة بالعربية',
  description_en: 'A short description of what reports are in this category.',
  description_ar: 'وصف مختصر للتقارير في هذه الفئة.',
  icon: 'BarChart2',
  reports: [
    // Add individual report objects here
  ],
},
```

---

## Frequently Asked Questions

**Q: Does the portal require an internet connection?**
A: The portal itself runs locally on your computer or server. However, the Power BI dashboards embedded inside it are loaded from Microsoft's Power BI cloud service, so an internet connection is required to view the actual report data.

**Q: Can multiple people use the portal at the same time?**
A: Yes. If the portal is hosted on a shared server (not just a local laptop), anyone on the network can open the portal URL in their browser simultaneously.

**Q: Is the data stored in the portal or in Power BI?**
A: All actual data and charts are in Power BI. The portal only stores the names, descriptions, and links to the Power BI reports. The portal is a navigation layer, not a data storage system.

**Q: What happens if a Power BI report is updated?**
A: Because the portal embeds live Power BI dashboards, any update made in Power BI will automatically appear in the portal the next time the report is opened. No changes to the portal are needed.

**Q: Can the portal be used on a phone?**
A: The portal is optimized for desktop and tablet use. While it will work on a phone, the Power BI dashboards themselves are best viewed on a larger screen.

**Q: How do I change a report's Power BI link?**
A: In `server/index.js`, find the report by its `id` or `label_en` and update the `url` field with the new embed link, then restart the server.

---

## Technical Summary (For Handover)

| Item | Detail |
|---|---|
| **Frontend technology** | React 18 with Vite build tool |
| **Backend technology** | Node.js with Express framework |
| **Styling** | Tailwind CSS utility-first framework |
| **Animations** | Framer Motion library |
| **Language switching** | react-i18next (i18n) |
| **Icons** | Lucide React icon library |
| **Frontend port** | 5173 (development) |
| **Backend port** | 5000 |
| **Data storage** | In-memory (in `server/index.js`) — no database required |
| **Power BI integration** | iframe embed using public Power BI embed URLs |
| **OS tested on** | Windows 11 |

---

## Color Reference

| Color Name | Hex Code | Where Used |
|---|---|---|
| Midnight Navy | `#0A2540` | Sidebar and navbar background |
| Teal Accent | `#00B4D8` | Buttons, active states, highlights |
| Dark Teal | `#0077B6` | Button hover state |
| Light Blue-Grey | `#F0F4F8` | Main page background |
| White | `#FFFFFF` | Cards and panels |
| Dark Slate | `#1D2B36` | Main body text |
| Slate Border | `#D1DCE8` | Card and section borders |
| Muted Blue | `#A8C0D6` | Inactive sidebar item text |
| Success Green | `#20C997` | Positive indicators |
| Danger Red | `#E63946` | Error states and alerts |

---

*Built for National Water Company — شركة المياه الوطنية*  
*Smart Reports BI Portal — بوابة التقارير الذكية*  
*Saudi Vision 2030 Aligned*
# SMART-BI-Dashboards-
