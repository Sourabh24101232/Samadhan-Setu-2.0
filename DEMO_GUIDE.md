# 🏆 Samadhan-Setu: Live Demonstration & Judge Pitch Guide
**Smart India Hackathon 2026 • Problem Statement ID: SIH26043**  
*Department of Higher & Technical Education, Government of Jharkhand*

---

## 🧭 System Architecture & Port Mapping

| Service | Technology | Port | Purpose / Swagger |
| :--- | :--- | :--- | :--- |
| **Frontend Web App** | Next.js 14 / Tailwind CSS | `3000` | `http://localhost:3000` |
| **Citizen Microservice** | Node.js / Express / TypeScript | `5001` | `http://localhost:5001` |
| **University Microservice** | Node.js / Express / TypeScript | `5002` | `http://localhost:5002` |
| **Industry & CSR Microservice** | Node.js / Express / TypeScript | `5003` | `http://localhost:5003` |
| **Government Analytics Microservice** | Node.js / Express / TypeScript | `5004` | `http://localhost:5004` |
| **AI Problem Intelligence Engine** | Python / FastAPI / Gemini 1.5 | `5005` | `http://localhost:5005/docs` |

---

## ⚡ Quick Port Checklist & Startup Commands

To ensure all functionalities, AI auto-detection, and multi-portal databases work smoothly during the demo, run these services in separate terminal windows:

| Terminal | Service | Port | Terminal Startup Command |
| :--- | :--- | :--- | :--- |
| **Terminal 1** | **Python AI Engine** | `5005` | `cd Backend/ai` <br/> `python -m uvicorn main:app --port 5005 --reload` |
| **Terminal 2** | **Citizen API** | `5001` | `cd Backend` <br/> `npx ts-node citizen/server.ts` |
| **Terminal 3** | **University API** | `5002` | `cd Backend` <br/> `npx ts-node university/server.ts` |
| **Terminal 4** | **Industry CSR API** | `5003` | `cd Backend` <br/> `npx ts-node industry/server.ts` |
| **Terminal 5** | **Government API** | `5004` | `cd Backend` <br/> `npx ts-node gov/server.ts` |
| **Terminal 6** | **Next.js Frontend** | `3000` | `cd Frontend` <br/> `npm run dev` |

---

## ⚠️ Pre-Demo Precautions & Best Practices

1. **MongoDB Running:** Ensure MongoDB is running locally on port `27017` (or your MongoDB Atlas connection string is configured in `.env`).
2. **One-Time Database Seeding:** Before starting your presentation, run the seed script to reset clean demo data across all 24 districts:
   ```powershell
   cd Backend
   npx ts-node seedData.ts
   ```
3. **Check Environment Variables:**
   * `Backend/.env` should contain:
     ```env
     MONGODB_URI=mongodb://localhost:27017/samadhan_setu
     JWT_SECRET=samadhan_setu_jwt_secret_2026
     AI_SERVICE_URL=http://localhost:5005/api/ai
     ```
   * `Frontend/.env.local` should point to ports `5001`, `5002`, `5003`, `5004`, `5005`.
4. **Cloudinary Uploads:** If demonstrating photo evidence upload, ensure your Cloudinary upload preset is set to **`Unsigned`**. If unconfigured, the system automatically falls back to secure local previews with zero crashes.
5. **AI Fallback Safety:** If `GEMINI_API_KEY` is not provided in `Backend/ai/.env`, the AI service will seamlessly and automatically use its built-in rule-based classification engine without throwing errors.
6. **Pre-Open Browser Tabs:** For a seamless pitch, open these tabs in advance:
   * Tab 1: `http://localhost:3000` (Main Landing Page)
   * Tab 2: `http://localhost:3000/citizen` (Citizen & Whistleblower Hub)
   * Tab 3: `http://localhost:3000/gov` (Statewide 24-District Command Center)
   * Tab 4: `http://localhost:5005/docs` (FastAPI Swagger Interactive Docs)

---

## 🔑 Pre-Seeded Test Credentials Cheatsheet

| Role | Identifier / Email | Password | Pre-Seeded Entity |
| :--- | :--- | :--- | :--- |
| **🌾 Citizen / Panchayat** | `9876543210` | `Citizen@1234` | Ramesh Munda (Sukhurhutu Panchayat, Ranchi) |
| **🎓 University Mentor** | `ananya.sen@bitmesra.ac.in` | `Univ@1234` | Dr. Ananya Sen (BIT Mesra, Ranchi) |
| **🎓 University Mentor 2** | `prof.sharma@iitism.ac.in` | `Univ@1234` | Prof. Vivek Sharma (IIT ISM Dhanbad) |
| **🏢 Corporate CSR Partner** | `csr.jharkhand@tatasteel.com` | `Industry@1234` | Tata Steel CSR Foundation, Jamshedpur |
| **🏛️ State Government Admin** | `director.higheredu@jharkhand.gov.in` | `GovAdmin@1234` | Rajesh Kumar Singh (IAS), Higher Edu Dept |
| **🛡️ Whistleblower Passkeys** | `ANON-JH-W7892X` (Water) & `ANON-JH-B1042K` (Bokaro Chemical) | *No password needed* | Zero-login private tracking timeline |

---

## 🔄 End-to-End Inter-Authority Complaint Lifecycle & Status Flow

Here is the exact progression of a challenge moving across portals during the demo:

```
[1. Citizen Portal]  ──(Submits Challenge)──►  Status: 'Submitted'
         │
         ▼
[2. Government Desk] ──(Validates R&D)──────►  Status: 'Verified'
         │
         ▼
[3. University Hub]  ──(14-Day Claim Lock)──►  Status: 'Assigned to University'
         │           ──(Submits Proposal)───►  Status: 'Proposal Submitted'
         ▼
[4. Industry CSR]    ──(Pledges CSR Grant)──►  Status: 'In Progress'
         │           ──(Pilot Deployment)───►  Status: 'Testing'
         ▼
[5. Citizen Tracker] ──(5-Star Ground Sign)─►  Status: 'Resolved' 🎉
```

| Authority Portal | URL | Trigger Action | Database Status | Next Destination |
| :--- | :--- | :--- | :--- | :--- |
| **1. Citizen / Whistleblower** | `/citizen/submit` | Fills form + Clicks *"Submit Societal Challenge"* | `Submitted` | Visible on Gov Review Desk |
| **2. Government Officer** | `/gov/verify` | Clicks *"Validate & Assign HEI"* | `Verified` | Open for University Teams |
| **3. University Innovators** | `/university` | Clicks *"Claim Challenge (14-Day Lock)"* | `Assigned to University` | Form student team |
| **3b. University Innovators** | `/university/proposals` | Fills 3-tranche budget + Clicks *"Submit Proposal"* | `Proposal Submitted` | Visible in CSR Pool |
| **4. Corporate CSR Partner** | `/industry` | Clicks *"Pledge CSR Grant & Mentorship"* | `In Progress` | University begins R&D |
| **4b. Gov Field Approval** | `/gov/verify` | Clicks *"Authorize Field Pilot Sanction"* | `Testing` | Ready for ground testing |
| **5. Citizen Ground-Truth** | `/citizen/my-problems` | Enters passkey + Clicks *"Confirm Resolution (1-5★)"* | `Resolved` | 100% Completed |

---

## 🎬 5-Step Hackathon Demonstration Script

### 📍 Step 1: Citizen Experience & 🛡️ Whistleblower Protection
1. Navigate to **`http://localhost:3000/citizen`** to view the live crowdsourced problem feed with community upvoting.
2. Click **"Report a Problem"** (`/citizen/submit`).
3. Toggle **"🛡️ Submit Anonymously (Whistleblower Mode)"**:
   * *Highlight to Judges:* Point out that IP addresses and phone numbers are completely zero-logged, and client-side photo EXIF metadata is stripped to protect rural citizens reporting illegal mining or industrial pollution.
4. **Copy & Paste any of these Ready-to-Use Demo Problems:**

   * **🌿 Demo Problem 1 (Water Resources - Whistleblower Mode):**
     * **Title:** `Severe Fluoride and Arsenic Contamination in Rural Drinking Wells`
     * **Description:** `Over 8 villages in Kanke block reporting dental and skeletal fluorosis among school children due to high fluoride levels (6.8 ppm vs 1.5 ppm safe limit) in deep borewells. Need solar-powered electro-coagulation or low-cost filtration unit for the community.`
     * **District:** `Ranchi` | **Block:** `Kanke` | **Village:** `Sukhurhutu Panchayat` | **Landmark:** `Near Govt Middle School Well`
     * **Expected AI Auto-Detect:** `Water Resources` • `High Severity` • `Actionable R&D: Yes`

   * **🌾 Demo Problem 2 (Agriculture & Tribal Livelihood):**
     * **Title:** `High Post-Harvest Paddy Spoilage and Aflatoxin Fungal Contamination`
     * **Description:** `Tribal farmers suffering 35% crop loss in storage due to high humidity and lack of portable moisture testing. Requesting low-cost IoT capacitive moisture sensor and solar drying cabinet for Mahila Samitis.`
     * **District:** `Khunti` | **Block:** `Murhu` | **Village:** `Torpa Gram` | **Landmark:** `Near Krishi Sahayata Kendra`
     * **Expected AI Auto-Detect:** `Agriculture` • `Medium Severity` • `Actionable R&D: Yes`

   * **🚨 Demo Problem 3 (Disaster Management - Fast-Track SOS Alert):**
     * **Title:** `Toxic Carbon Monoxide Leak & Subterranean Coal Fire Subsidence`
     * **Description:** `Underground mine fire breakout near Jharia settlement causing sudden ground fissures and toxic carbon monoxide blowout. Immediate structural evacuation and rapid sensor deployment needed.`
     * **District:** `Dhanbad` | **Block:** `Jharia` | **Village:** `Bhowra Colliery Ward 4` | **Landmark:** `Near Mining Gate 3`
     * **Expected AI Auto-Detect:** `Disaster Management` • `Critical Severity` • `🚨 Emergency SOS Fast-Track`

   * **🏥 Demo Problem 4 (Healthcare & Diagnostics):**
     * **Title:** `Non-Invasive Severe Anemia & Sickle Cell Screening Device for Tribal Mothers`
     * **Description:** `Over 60% of pregnant tribal women in remote forested blocks suffer from acute anemia without access to pathology labs. Requesting a battery-operated non-invasive spectroscopic hemoglobin monitor for Anganwadi workers.`
     * **District:** `West Singhbhum` | **Block:** `Chaibasa` | **Village:** `Jhinkpani Panchayat` | **Landmark:** `Anganwadi Center 2`
     * **Expected AI Auto-Detect:** `Healthcare` • `High Severity` • `Actionable R&D: Yes`

   * **⚡ Demo Problem 5 (Clean Energy):**
     * **Title:** `Off-Grid Solar Micro-Grid and Compact Grain Milling Unit`
     * **Description:** `Un-electrified hill village faces 8km travel for manual diesel milling. Need decentralized 5kW solar PV micro-grid with DC micro-milling machine operated by self-help groups.`
     * **District:** `Gumla` | **Block:** `Raidih` | **Village:** `Kochedega Panchayat` | **Landmark:** `SHG Community Center`
     * **Expected AI Auto-Detect:** `Energy` • `Medium Severity` • `Actionable R&D: Yes`

   * **📋 Demo Problem 6 (Jan Samvad Redirection Test Case - Municipal):**
     * **Title:** `Broken street light and single pothole on market road`
     * **Description:** `The municipal bulb near the vegetable market has stopped working for 2 days. Please send an electrician to replace the bulb.`
     * **District:** `Hazaribagh` | **Block:** `Sadar` | **Village:** `Ward 7`
     * **Expected AI Auto-Detect:** `Urban Development` • `Low Severity` • `Actionable R&D: False (Redirect to Jan Samvad)`

5. Click **"Attach Photo Evidence"** to demonstrate the direct file picker and canvas EXIF stripper.
6. Click **"AI Auto-Detect Category"** button to show the Python AI engine automatically extracting the domain, severity, and tags.
7. Click **"Submit Societal Challenge to Innovation Grid"**:
   * Show the popup **Secret Passkey Modal** (e.g. `ANON-JH-W7892X`) and click **"Copy Key"**.
8. Navigate to **"Track Secret Passkey"** (`/citizen/my-problems?passkey=ANON-JH-W7892X`) to show the real-time 6-stage visual timeline without requiring any login!

---

### 📍 Step 2: Government Review Desk & Validation
1. Go to **`http://localhost:3000/gov/verify`**.
2. Find the newly submitted problem in the **Incoming Challenges Verification Queue**.
3. Click **"Validate & Assign HEI"**:
   * The challenge is validated as an authentic Academic R&D problem, and its status updates to **`Verified`**.
4. *(Optional Jan Samvad Demo)*: For municipal issues (like Problem 6), click **"Jan Samvad"** to redirect routine complaints directly to the Jharkhand Jan Samvad portal (`https://jansamvad.jharkhand.gov.in`).

---

### 📍 Step 3: University Hub & 14-Day Claim Locking (NEP 2020)
1. Go to **`http://localhost:3000/university`**.
2. Filter by domain or find the verified challenge.
3. Demonstrate the **"Claim Challenge (14-Day Lock)"** button:
   * *Highlight to Judges:* Emphasize that the 14-day lock gives student teams time to formulate multidisciplinary proposals without fear of other teams swooping in, while preventing dead hoarding.
4. Click **"Create Proposal"** to open the **Proposal & Milestone Builder** (`/university/proposals`):
   * Show the 3-stage milestone release schedule (30% Design, 40% Working Prototype, 30% Pilot Deployment).
   * Show the transparent **IP Ownership Declaration** (*Open Source Social Good*).
   * Click **"Submit Solution Proposal"** ➜ Problem status updates to **`Proposal Submitted`**.

---

### 📍 Step 4: Industry & Corporate CSR Grant Marketplace
1. Go to **`http://localhost:3000/industry`**.
2. Browse open university proposals filterable by budget and domain category.
3. Click **"Pledge CSR Grant & Mentorship"**:
   * Enter the pledge amount (e.g. `₹1,50,000`) and confirm.
   * Problem status updates to **`In Progress`**!
4. Navigate to **"My Sponsored Collaborations"** (`/industry/collaborations`):
   * Show the **UTR-verified tranche payment roadmap** (`UTR-TATA-2026-001`).
   * Demonstrate the **Direct Technical Mentorship Chat Thread** where corporate engineers advise students on materials (e.g. *"Use 316L stainless steel electrodes"*).
   * Show the **CSR Social Impact Certificate** downloadable for Section 135 compliance.

---

### 📍 Step 5: Government Pilot Sanction & Citizen Ground Verification
1. Navigate to **`http://localhost:3000/gov`**:
   * **Real-time KPI Counters:** Total challenges reported, active student teams, CSR funds mobilized, and deployed solutions.
   * **24-District Interactive Heatmap:** Click on different districts (*Ranchi, Dhanbad, Bokaro, Khunti, Palamu*) to view localized problem densities.
   * **🚨 Disaster Emergency SOS Alert Queue:** Life-threatening emergencies fast-tracked for immediate DDMA dispatch.
2. In `/gov/verify`, click **"Authorize Field Pilot Sanction"** ➜ Grants sanction order `JH-PILOT-2026-XXXX` and updates status to **`Testing`**.
3. **Closing the Impact Loop:** Return to the Citizen tracker (`/citizen/my-problems?passkey=ANON-JH-W7892X`):
   * The visual timeline shows Stage 5 reached!
   * Click **"Confirm Ground Resolution"** to submit a **5/5 ⭐ Citizen Ground-Truth Rating**, officially locking the problem as **`Resolved`**!

---

## 🏁 Summary of Real-Life Ground Innovations for SIH Jury
1. **Whistleblower Identity Shield:** Zero identity logging + client-side EXIF stripping + secret passkey access.
2. **14-Day Claim Expiry Lock:** Eliminates inactive challenge hoarding across universities.
3. **Milestone-Linked Tranche Grants:** Corporate CSR grants disbursed in 3 stages linked to verified deliverables.
4. **Direct Industry Mentorship Channel:** Corporate R&D scientists mentor student engineering teams directly.
5. **Mandatory Citizen Ground Verification:** 1–5 star community confirmation required before marking challenges solved.
6. **24-District Interactive Heatmap:** Real-time geospatial monitoring across all 24 districts of Jharkhand.
