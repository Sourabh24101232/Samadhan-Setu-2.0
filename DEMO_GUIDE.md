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

## 🎬 5-Step Hackathon Demonstration Script

### 📍 Step 1: Citizen Experience & 🛡️ Whistleblower Protection
1. Navigate to **`http://localhost:3000/citizen`** to view the live crowdsourced problem feed with community upvoting.
2. Click **"Report a Problem"** (`/citizen/submit`).
3. Toggle **"🛡️ Submit Anonymously (Whistleblower Mode)"**:
   * *Highlight to Judges:* Point out that IP addresses and phone numbers are completely zero-logged, and client-side photo EXIF metadata is stripped to protect rural citizens reporting illegal mining or industrial pollution.
4. Fill in a challenge description (or click **"AI Auto-Detect Category"** to demonstrate live categorization via FastAPI).
5. On submission, show the generated **Secret Passkey** (e.g. `ANON-JH-W7892X`).
6. Navigate to **"Track Secret Passkey"** (`/citizen/my-problems?passkey=ANON-JH-W7892X`) to demonstrate the live 6-stage visual timeline.

---

### 📍 Step 2: Python AI Problem Intelligence Engine
1. Open the interactive API documentation at **`http://localhost:5005/docs`**.
2. Demonstrate **`POST /api/ai/classify`**:
   * Show how an incoming Hindi text (*"हमारे गाँव में कुएं के पानी में फ्लोराइड की मात्रा बहुत अधिक है"*) is automatically translated, classified into **"Water Resources"**, and flagged as an innovative R&D challenge (`is_actionable_rnd: true`).
3. Demonstrate **`POST /api/ai/recommend-universities`**:
   * Show geographic Haversine distance calculation and department matching ranking **BIT Mesra (Ranchi)** as Rank #1.

---

### 📍 Step 3: University Hub & 14-Day Claim Locking (NEP 2020)
1. Go to **`http://localhost:3000/university`**.
2. Show open challenges matching academic departments (Civil/Environmental, Agri, Mining, IoT).
3. Demonstrate the **"Claim Challenge (14-Day Lock)"** button:
   * *Highlight to Judges:* Emphasize that the 14-day lock gives student teams time to formulate multidisciplinary proposals without fear of other teams swooping in, while preventing dead hoarding.
4. Open the **Proposal & Milestone Builder** (`/university/proposals`):
   * Show the 3-stage milestone release schedule (30% Design, 40% Working Prototype, 30% Pilot Deployment).
   * Show the transparent **IP Ownership Declaration** (*Open Source Social Good*).

---

### 📍 Step 4: Industry & Corporate CSR Grant Marketplace
1. Go to **`http://localhost:3000/industry`**.
2. Browse open university proposals filterable by budget and domain category.
3. Click **"Pledge CSR Grant & Mentorship"**:
   * Show how corporate CSR wings pledge funding linked to specific milestone stages.
4. Navigate to **"My Sponsored Collaborations"** (`/industry/collaborations`):
   * Show the **UTR-verified tranche payment roadmap** (`UTR-TATA-2026-001`).
   * Demonstrate the **Direct Technical Mentorship Chat Thread** where corporate engineers advise students on materials (e.g. *"Use 316L stainless steel electrodes"*).
   * Show the **CSR Social Impact Certificate** downloadable for Section 135 compliance.

---

### 📍 Step 5: Government Command Center & Citizen Ground-Truth Rating
1. Navigate to **`http://localhost:3000/gov`**.
2. Showcase the **Statewide Societal Innovation Command Center**:
   * **Real-time KPI Counters:** Total challenges reported, active student teams, CSR funds mobilized, and deployed solutions.
   * **24-District Interactive Heatmap:** Click on different districts (*Ranchi, Dhanbad, Bokaro, Khunti, Palamu*) to view localized problem densities and resolution counts.
   * **🚨 Disaster Emergency SOS Alert Queue:** Life-threatening emergencies (e.g. Jharia mine fire toxic leaks) fast-tracked for immediate DDMA dispatch.
3. Open **Problem Review Desk** (`/gov/verify`):
   * Show filtering out non-R&D complaints by redirecting routine potholes to *Jharkhand Jan Samvad*.
   * Show granting the **Official Field Pilot Sanction Order** (`JH-PILOT-2026-XXXX`).
4. **Closing Impact Loop:** Return to the Citizen tracker (`/citizen/my-problems?passkey=ANON-JH-W7892X`) and click **"Confirm Resolution"** to submit a **5/5 ⭐ Citizen Ground-Truth Rating**, officially closing the innovation loop!

---

## 🏁 Summary of Real-Life Ground Innovations for SIH Jury
1. **Whistleblower Identity Shield:** Zero identity logging + client-side EXIF stripping + secret passkey access.
2. **14-Day Claim Expiry Lock:** Eliminates inactive challenge hoarding across universities.
3. **Milestone-Linked Tranche Grants:** Corporate CSR grants disbursed in 3 stages linked to verified deliverables.
4. **Direct Industry Mentorship Channel:** Corporate R&D scientists mentor student engineering teams directly.
5. **Mandatory Citizen Ground Verification:** 1–5 star community confirmation required before marking challenges solved.
6. **24-District Interactive Heatmap:** Real-time geospatial monitoring across all 24 districts of Jharkhand.
