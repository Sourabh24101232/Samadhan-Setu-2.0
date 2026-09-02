// ==========================================
// SAMADHAN-SETU - DATABASE SEED SCRIPT
// File: Backend/seedData.ts
// ==========================================

/*
  PURPOSE:
  - Populates MongoDB with realistic Jharkhand societal problems across all 24 districts, multi-role test users, milestone-funded proposals, and whistleblower passkeys for live hackathon demonstration.

  RUN COMMAND:
  - npx ts-node seedData.ts
*/

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { CitizenUser } from './citizen/models/CitizenUser';
import { Problem } from './citizen/models/Problem';
import { UniversityUser } from './university/models/UniversityUser';
import { SolutionProposal } from './university/models/SolutionProposal';
import { IndustryUser } from './industry/models/IndustryUser';
import { Partnership } from './industry/models/Partnership';
import { GovAdmin } from './gov/models/GovAdmin';
import { JHARKHAND_24_DISTRICTS } from './gov/controllers/analyticsController';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/samadhan_setu';

async function seedDatabase() {
  console.log('====================================================');
  console.log('🌱 [SEED] Initializing Samadhan-Setu Database Seed...');
  console.log('====================================================\n');

  try {
    await mongoose.connect(MONGODB_URI);
    console.log('[OK] Connected to MongoDB:', MONGODB_URI);

    // 1. Clean existing demo data
    await CitizenUser.deleteMany({});
    await Problem.deleteMany({});
    await UniversityUser.deleteMany({});
    await SolutionProposal.deleteMany({});
    await IndustryUser.deleteMany({});
    await Partnership.deleteMany({});
    await GovAdmin.deleteMany({});
    console.log('[OK] Cleared previous database collections.\n');

    // 2. Generate common password hashes
    const salt = await bcrypt.genSalt(10);
    const citizenPassword = await bcrypt.hash('Citizen@1234', salt);
    const univPassword = await bcrypt.hash('Univ@1234', salt);
    const industryPassword = await bcrypt.hash('Industry@1234', salt);
    const govPassword = await bcrypt.hash('GovAdmin@1234', salt);

    // 3. Seed Users
    console.log('👤 [SEED] Creating Multi-Stakeholder Accounts...');

    // Citizen
    const citizen = await CitizenUser.create({
      fullName: 'Ramesh Munda',
      phone: '9876543210',
      password: citizenPassword,
      district: 'Ranchi',
      block: 'Kanke',
      village: 'Sukhurhutu',
      preferredLanguage: 'hi',
      userType: 'Panchayat'
    });
    console.log(`   Citizen Account: ${citizen.fullName} (${citizen.phone})`);

    // Universities
    const bitMesra = await UniversityUser.create({
      fullName: 'Dr. Ananya Sen',
      universityName: 'BIT Mesra, Ranchi',
      department: 'Civil & Environmental Engineering',
      institutionalEmail: 'ananya.sen@bitmesra.ac.in',
      password: univPassword,
      role: 'Faculty_Mentor',
      researchExpertiseTags: ['Water Filtration', 'Arsenic Removal', 'IoT Sensors', 'Solar Systems'],
      incubationCenterDetails: {
        hasIncubationLab: true,
        centerName: 'BIT-TBI / Atal Incubation Centre'
      },
      activeProjectsCount: 2
    });

    const iitIsm = await UniversityUser.create({
      fullName: 'Prof. Vivek Sharma',
      universityName: 'IIT (ISM) Dhanbad',
      department: 'Mining & Environmental Engineering',
      institutionalEmail: 'prof.sharma@iitism.ac.in',
      password: univPassword,
      role: 'Faculty_Mentor',
      researchExpertiseTags: ['Mine Safety', 'Toxic Gas Sensors', 'Subsidence Prediction'],
      incubationCenterDetails: {
        hasIncubationLab: true,
        centerName: 'IIT ISM Technology Innovation Hub (TEXMiN)'
      },
      activeProjectsCount: 1
    });

    const bau = await UniversityUser.create({
      fullName: 'Dr. Birsa Oraon',
      universityName: 'Birsa Agricultural University, Ranchi',
      department: 'Agricultural Engineering & Renewable Energy',
      institutionalEmail: 'birsa.oraon@bau.ac.in',
      password: univPassword,
      role: 'Faculty_Mentor',
      researchExpertiseTags: ['Solar Agro-Processing', 'Drip Automation', 'Post-Harvest Loss Prevention'],
      incubationCenterDetails: {
        hasIncubationLab: true,
        centerName: 'BAU Agri-Business Incubator'
      },
      activeProjectsCount: 1
    });
    console.log(`   HEI Mentors: BIT Mesra, IIT ISM Dhanbad, Birsa Agricultural University`);

    // Industry CSR
    const tataSteel = await IndustryUser.create({
      organizationName: 'Tata Steel CSR Foundation, Jamshedpur',
      orgType: 'Corporate_CSR',
      officialEmail: 'csr.jharkhand@tatasteel.com',
      password: industryPassword,
      contactPersonName: 'Sanjay Srivastava',
      contactPhone: '+91-657-2431234',
      interestDomains: ['Water Resources', 'Rural Livelihoods', 'Healthcare', 'Environment'],
      websiteUrl: 'https://www.tatasteel.com/sustainability/csr',
      isVerifiedPartner: true,
      totalGrantsAllocatedINR: 350000
    });

    const jspl = await IndustryUser.create({
      organizationName: 'JSPL Foundation, Patratu',
      orgType: 'Corporate_CSR',
      officialEmail: 'csr.jharkhand@jspl.com',
      password: industryPassword,
      contactPersonName: 'Meenakshi Roy',
      contactPhone: '+91-6553-278100',
      interestDomains: ['Agriculture', 'Education', 'Energy'],
      websiteUrl: 'https://www.jsplfoundation.org',
      isVerifiedPartner: true,
      totalGrantsAllocatedINR: 150000
    });
    console.log(`   Corporate CSR: Tata Steel Foundation, JSPL Foundation`);

    // Government Admin
    const govAdmin = await GovAdmin.create({
      officialName: 'Rajesh Kumar Singh (IAS)',
      governmentEmail: 'director.higheredu@jharkhand.gov.in',
      password: govPassword,
      department: 'Department of Higher & Technical Education',
      jurisdictionLevel: 'State_Level',
      role: 'SuperAdmin'
    });
    console.log(`   Govt Officer: ${govAdmin.officialName} (${govAdmin.governmentEmail})\n`);

    // 4. Seed Detailed Societal Challenges
    console.log('📍 [SEED] Seeding Realistic Jharkhand Societal Challenges...');

    // Case 1: Ranchi Water Purification (Whistleblower Demo Case)
    const p1 = await Problem.create({
      title: 'High Fluoride & Arsenic Contamination in Rural Community Wells',
      description: 'Over 8 villages in Kanke block reporting dental and skeletal fluorosis among school children due to high fluoride in deep borewells (6.8 ppm vs 1.5 ppm permissible limit).',
      languageCode: 'hi',
      isAnonymous: true,
      anonymousTrackingToken: 'ANON-JH-W7892X',
      domainCategory: 'Water Resources',
      isDisasterEmergency: false,
      isActionableRnD: true,
      location: {
        district: 'Ranchi',
        block: 'Kanke',
        villageOrPanchayat: 'Sukhurhutu',
        landmark: 'Govt Middle School Community Well'
      },
      mediaAttachments: [
        {
          mediaType: 'image',
          url: 'https://images.unsplash.com/photo-1581093588401-fbb62a02f120?auto=format&fit=crop&w=800&q=80',
          isExifStripped: true
        }
      ],
      submittedBy: null,
      status: 'Testing',
      assignedUniversityId: bitMesra._id as any,
      claimExpiresAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      upvotes: ['u1', 'u2', 'u3', 'u4', 'u5', 'u6', 'u7'],
      severityLevel: 'High',
      aiTags: ['water-filtration', 'fluoride', 'ranchi', 'electro-coagulation']
    });

    // Case 2: Dhanbad Mine Fire Toxic Gas (Disaster SOS Emergency Case)
    const p2 = await Problem.create({
      title: 'Toxic Underground Coal Mine Smoke & Carbon Monoxide Fissure Leak',
      description: 'Underground coal fire emitting lethal carbon monoxide, sulfur dioxide, and particulate smoke across Jharia settlement causing acute respiratory crisis among 500 households.',
      languageCode: 'hi',
      isAnonymous: false,
      domainCategory: 'Disaster Management',
      isDisasterEmergency: true,
      isActionableRnD: true,
      location: {
        district: 'Dhanbad',
        block: 'Jharia',
        villageOrPanchayat: 'Ghanudih Colliery Ward 4',
        landmark: 'Near Railway Line Fissure'
      },
      submittedBy: citizen._id as any,
      status: 'Emergency_Escalated',
      severityLevel: 'Critical',
      upvotes: ['u1', 'u2', 'u3', 'u4', 'u5', 'u6', 'u7', 'u8', 'u9', 'u10'],
      aiTags: ['mine-fire', 'toxic-gas', 'dhanbad', 'disaster-sos']
    });

    // Case 3: Khunti Solar Grain De-husker (Agriculture & Tribal SHGs)
    const p3 = await Problem.create({
      title: 'Solar Powered Micro Grain De-husker for Tribal Women SHGs',
      description: 'Manual finger millet and paddy processing is physically exhausting for tribal Mahila Samitis; requesting a compact solar-operated micro-milling unit with battery backup.',
      languageCode: 'hi',
      isAnonymous: false,
      domainCategory: 'Agriculture',
      isDisasterEmergency: false,
      isActionableRnD: true,
      location: {
        district: 'Khunti',
        block: 'Murhu',
        villageOrPanchayat: 'Torpa Road SHG Center'
      },
      submittedBy: citizen._id as any,
      status: 'Proposal Submitted',
      assignedUniversityId: bau._id as any,
      claimExpiresAt: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
      upvotes: ['u1', 'u2', 'u3'],
      severityLevel: 'Medium',
      aiTags: ['solar-mill', 'agriculture', 'khunti', 'tribal-livelihood']
    });

    // Case 4: Bokaro Industrial Chemical Effluent (Whistleblower Case 2)
    const p4 = await Problem.create({
      title: 'Untreated Industrial Chemical Effluent Runoff Contaminating Garga River',
      description: 'Dark acidic runoff from industrial estate entering Garga river at night, killing fish and polluting irrigation water for 4 downstream panchayats.',
      languageCode: 'hi',
      isAnonymous: true,
      anonymousTrackingToken: 'ANON-JH-B1042K',
      domainCategory: 'Environment',
      isDisasterEmergency: false,
      isActionableRnD: true,
      location: {
        district: 'Bokaro',
        block: 'Chas',
        villageOrPanchayat: 'Kandra Industrial Area',
        landmark: 'Garga River Bridge Culvert'
      },
      status: 'Verified',
      upvotes: ['u1', 'u2', 'u3', 'u4'],
      severityLevel: 'High',
      aiTags: ['effluent-treatment', 'chemical-runoff', 'bokaro', 'environment']
    });

    // Case 5: East Singhbhum Remote Forest Clinic ECG (Healthcare)
    const p5 = await Problem.create({
      title: 'Mobile Tele-Diagnostic ECG & Blood Analyzer for Remote Forest Clinics',
      description: 'Tribal residents in forest fringe villages travel 45km to Jamshedpur for basic cardiac and hemoglobin diagnostics; need ruggedized offline solar-powered testing kit.',
      languageCode: 'hi',
      isAnonymous: false,
      domainCategory: 'Healthcare',
      isDisasterEmergency: false,
      isActionableRnD: true,
      location: {
        district: 'East Singhbhum',
        block: 'Potka',
        villageOrPanchayat: 'Haldipokhar Health Sub-Centre'
      },
      status: 'Assigned to University',
      assignedUniversityId: bitMesra._id as any,
      severityLevel: 'High',
      upvotes: ['u1', 'u2', 'u3', 'u4', 'u5'],
      aiTags: ['tele-medicine', 'ecg-kit', 'healthcare', 'jamshedpur']
    });

    // Case 6: Palamu Automated Drip Moisture Kit (Resolved Case with 5/5 ⭐)
    const p6 = await Problem.create({
      title: 'Drought-Resilient Automated Solar Drip Irrigation & Soil Moisture Sensor',
      description: 'Acute groundwater shortage in Palamu causing crop failure; deployed smart moisture-triggered drip system saving 65% water.',
      languageCode: 'hi',
      isAnonymous: false,
      domainCategory: 'Water Resources',
      isDisasterEmergency: false,
      isActionableRnD: true,
      location: {
        district: 'Palamu',
        block: 'Medininagar',
        villageOrPanchayat: 'Chhatarpur Agro Hub'
      },
      status: 'Resolved',
      assignedUniversityId: bau._id as any,
      severityLevel: 'Medium',
      upvotes: ['u1', 'u2', 'u3', 'u4', 'u5', 'u6', 'u7', 'u8'],
      citizenGroundFeedback: {
        isResolvedConfirmedByCitizen: true,
        rating: 5,
        citizenFeedbackComments: 'The solar drip kit was installed at Chhatarpur demonstration plot. Crop yield increased 35% with minimal water!',
        verifiedAt: new Date()
      },
      aiTags: ['drip-irrigation', 'soil-sensor', 'palamu', 'resolved']
    });

    // 5. Seed 18 Baseline Records for Remaining Jharkhand Districts
    const remainingDistricts = JHARKHAND_24_DISTRICTS.filter(
      (d) => !['Ranchi', 'Dhanbad', 'Khunti', 'Bokaro', 'East Singhbhum', 'Palamu'].includes(d)
    );

    for (let i = 0; i < remainingDistricts.length; i++) {
      const distName = remainingDistricts[i];
      await Problem.create({
        title: `Baseline Societal Challenge in ${distName} District`,
        description: `Community reported challenge in ${distName} requiring academic R&D validation and technical design.`,
        languageCode: 'hi',
        isAnonymous: false,
        domainCategory: i % 2 === 0 ? 'Agriculture' : 'Water Resources',
        isDisasterEmergency: false,
        isActionableRnD: true,
        location: { district: distName, block: 'Central' },
        status: i % 3 === 0 ? 'Verified' : 'Submitted',
        severityLevel: i % 4 === 0 ? 'High' : 'Medium',
        upvotes: ['u1'],
        aiTags: [distName.toLowerCase(), 'grassroots']
      });
    }
    console.log(`   Populated challenges across all 24 Jharkhand districts.\n`);

    // 6. Seed Solution Proposal (BIT Mesra Water Filter)
    console.log('💡 [SEED] Seeding Solution Proposal & Milestone Tranches...');
    const proposal1 = await SolutionProposal.create({
      problemId: p1._id,
      universityId: bitMesra._id,
      proposalTitle: 'Low-Cost Solar Electro-Coagulation Fluoride Filter',
      executiveSummary: 'Solar-powered modular water filtration system utilizing electrolytic aluminum flocculation to remove 98% fluoride, arsenic, and iron from deep borewell water in Ranchi.',
      proposedMethodology: '1. CAD Modeling & circuit simulation -> 2. Bench prototype lab test -> 3. Field trial in Sukhurhutu primary school well.',
      estimatedBudgetINR: 150000,
      projectTimelineMonths: 6,
      teamMembers: [
        { name: 'Amit Kumar', studentId: 'BIT/2022/104', branch: 'Civil Engineering', year: 'Final Year', role: 'Student Project Lead' },
        { name: 'Pooja Verma', studentId: 'BIT/2023/215', branch: 'Biotechnology', year: '3rd Year', role: 'Water Chemical Testing' },
        { name: 'Rohan Gupta', studentId: 'BIT/2022/310', branch: 'Electrical Engineering', year: 'Final Year', role: 'Solar Power Circuitry' }
      ],
      facultyMentor: {
        name: 'Dr. Ananya Sen',
        email: 'ananya.sen@bitmesra.ac.in',
        department: 'Civil & Environmental Engineering',
        mentorApprovalStatus: 'Approved'
      },
      milestoneTranches: [
        {
          milestoneNumber: 1,
          title: 'CAD Design, Fluid Flow & Circuit Simulation',
          description: '3D CAD schematics and electrode configuration simulation.',
          targetDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          percentageFundingToRelease: 30,
          status: 'Completed',
          deliverableLink: 'https://github.com/samadhan-setu/cad-filter-design.pdf',
          mentorReviewNotes: 'Simulation verified. 98% flocculation efficiency achieved in CAD.'
        },
        {
          milestoneNumber: 2,
          title: 'Working Hardware / Bench Prototype Demonstration',
          description: 'Physical bench demonstration unit reducing fluoride below 1.5 ppm in environmental engineering lab.',
          targetDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
          percentageFundingToRelease: 40,
          status: 'Submitted_For_Review',
          deliverableLink: 'https://youtube.com/watch?v=sample-prototype-demo',
          mentorReviewNotes: 'Lab water test verified. Fluoride reduced from 6.8 ppm to 0.9 ppm.'
        },
        {
          milestoneNumber: 3,
          title: 'Village Pilot Field Deployment & Handover',
          description: 'Installed at Sukhurhutu village community well with citizen ground testing.',
          targetDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
          percentageFundingToRelease: 30,
          status: 'Pending'
        }
      ],
      ipOwnershipDeclaration: 'Open_Source_Social_Good',
      prototypeMedia: [
        {
          mediaType: 'image',
          url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80',
          caption: 'Bench Prototype operating on 100W solar panel in Environmental Engineering Lab.'
        }
      ],
      industrySponsorId: tataSteel._id as any,
      status: 'Funded_In_Progress'
    });

    // 7. Seed CSR Partnership (Tata Steel CSR -> BIT Mesra)
    console.log('🤝 [SEED] Seeding Corporate CSR Partnership & Milestone Tranches...');
    const partnership1 = await Partnership.create({
      industryId: tataSteel._id,
      proposalId: proposal1._id,
      universityId: bitMesra._id,
      collaborationType: ['CSR_Grant_Funding', 'Technical_Mentorship', 'Lab_Equipment_Access'],
      totalPledgedFundingINR: 150000,
      fundingDisbursements: [
        {
          trancheNumber: 1,
          amountINR: 45000,
          status: 'Released',
          disbursedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
          transactionReferenceOrUTR: 'UTR-TATA-2026-001',
          milestoneReferenceId: 'Tranche 1: CAD & Lab Materials'
        },
        {
          trancheNumber: 2,
          amountINR: 60000,
          status: 'Scheduled',
          milestoneReferenceId: 'Tranche 2: Working Hardware Demo'
        },
        {
          trancheNumber: 3,
          amountINR: 45000,
          status: 'Scheduled',
          milestoneReferenceId: 'Tranche 3: Field Pilot & Citizen Handover'
        }
      ],
      mentorshipFeedbackThread: [
        {
          mentorName: 'Sanjay Srivastava (Tata Steel CSR)',
          message: 'Tata Steel CSR Foundation has sanctioned ₹1.5 Lakh grant. Tranche 1 (₹45,000) released for CAD design & lab materials.',
          timestamp: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000)
        },
        {
          mentorName: 'Dr. Vivek Sharma (Tata Steel R&D Lead)',
          message: 'For the high-fluoride groundwater in Kanke, we recommend 316L stainless steel electrodes to resist pitting corrosion.',
          timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
        }
      ],
      csrComplianceCertificateUrl: 'https://tatasteel.com/csr/compliance-cert-2026-001.pdf',
      status: 'Funding_Active'
    });

    console.log('\n====================================================');
    console.log('🎉 [SUCCESS] Database Seeded Successfully with Realistic Data!');
    console.log('====================================================');
    console.log('🔑 TEST CREDENTIALS SUMMARY:');
    console.log('   1. Citizen:      Phone: 9876543210                        | Pass: Citizen@1234');
    console.log('   2. University:   Email: ananya.sen@bitmesra.ac.in         | Pass: Univ@1234');
    console.log('   3. Industry CSR: Email: csr.jharkhand@tatasteel.com       | Pass: Industry@1234');
    console.log('   4. Govt Admin:   Email: director.higheredu@jharkhand.gov.in| Pass: GovAdmin@1234');
    console.log('   5. Whistleblower Passkeys: [ ANON-JH-W7892X ] and [ ANON-JH-B1042K ]');
    console.log('====================================================\n');
  } catch (error: any) {
    console.error('[!] Database seed failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

seedDatabase();
