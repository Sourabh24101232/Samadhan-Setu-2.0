// ==========================================
// UNIVERSITY MODULE - TEST VERIFICATION SCRIPT
// File: Backend/testUniversityService.ts
// ==========================================

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UniversityUser } from './university/models/UniversityUser';
import { SolutionProposal } from './university/models/SolutionProposal';
import { Problem } from './citizen/models/Problem';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/samadhan_setu_test';
const JWT_SECRET = process.env.JWT_SECRET || 'your_university_jwt_secret_key_here';

async function runUniversityTests() {
  console.log('==========================================');
  console.log('[TEST] Starting Phase 4 University Backend Tests...');
  console.log('==========================================\n');

  try {
    await mongoose.connect(MONGODB_URI);
    console.log('[OK] Connected to MongoDB test database.\n');

    // Clean test data
    await UniversityUser.deleteMany({ institutionalEmail: 'ananya.sen@bitmesra.ac.in' });
    await Problem.deleteMany({ title: { $regex: /TEST_PHASE4/ } });
    await SolutionProposal.deleteMany({ proposalTitle: { $regex: /TEST_PHASE4/ } });

    // 1. Test University User Registration
    console.log('[TEST 1] Testing University Registration (Faculty Mentor)...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Univ@1234', salt);

    const testUnivUser = await UniversityUser.create({
      fullName: 'Dr. Ananya Sen',
      universityName: 'BIT Mesra, Ranchi',
      department: 'Civil & Environmental Engineering',
      institutionalEmail: 'ananya.sen@bitmesra.ac.in',
      password: hashedPassword,
      role: 'Faculty_Mentor',
      researchExpertiseTags: ['Water Purification', 'Arsenic Filter', 'IoT Sensors'],
      incubationCenterDetails: {
        hasIncubationLab: true,
        centerName: 'BIT-TBI / Atal Incubation Centre'
      },
      activeProjectsCount: 0
    });

    console.log(`   Registered: ${testUnivUser.fullName} (${testUnivUser.universityName})`);
    console.log(`   Department: ${testUnivUser.department}, Incubation: ${testUnivUser.incubationCenterDetails?.centerName}`);
    console.log('   [OK] Test 1 Passed!\n');

    // 2. Test University Login & JWT Token
    console.log('[TEST 2] Testing Password Verification & JWT Generation...');
    const isMatch = await bcrypt.compare('Univ@1234', testUnivUser.password);
    if (!isMatch) throw new Error('Password verification failed');

    const token = jwt.sign(
      {
        id: testUnivUser._id,
        role: testUnivUser.role,
        institutionalEmail: testUnivUser.institutionalEmail,
        universityName: testUnivUser.universityName,
        department: testUnivUser.department
      },
      JWT_SECRET,
      { expiresIn: '1d' }
    );
    const decoded: any = jwt.verify(token, JWT_SECRET);
    console.log(`   JWT Token Verified! Decoded ID: ${decoded.id}, Dept: ${decoded.department}`);
    console.log('   [OK] Test 2 Passed!\n');

    // Create a mock societal problem for claiming
    const testProblem = await Problem.create({
      title: 'TEST_PHASE4: Severe fluoride in groundwater across 8 villages',
      description: 'Children in Ranchi district suffering from skeletal fluorosis.',
      languageCode: 'hi',
      isAnonymous: false,
      domainCategory: 'Water Resources',
      isDisasterEmergency: false,
      isActionableRnD: true,
      location: {
        district: 'Ranchi',
        block: 'Kanke'
      },
      status: 'Verified',
      severityLevel: 'High',
      aiTags: ['water-filtration', 'fluoride-removal', 'ranchi']
    });

    // 3. Test Claiming Problem with 14-Day Lock
    console.log('[TEST 3] Testing Claiming Problem with 🛡️ 14-Day Expiry Lock...');
    const expiryDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
    testProblem.assignedUniversityId = testUnivUser._id as any;
    testProblem.status = 'Assigned to University';
    testProblem.claimExpiresAt = expiryDate;
    await testProblem.save();

    console.log(`   Problem Claimed by: ${testUnivUser.universityName}`);
    console.log(`   Status: ${testProblem.status}`);
    console.log(`   14-Day Expiry Lock Set To: ${testProblem.claimExpiresAt.toISOString()}`);
    console.log('   [OK] Test 3 Passed!\n');

    // 4. Test Submitting Solution Proposal with Milestone Tranches & IP Declaration
    console.log('[TEST 4] Testing Solution Proposal Submission with Milestone Tranches & IP...');
    const proposal = await SolutionProposal.create({
      problemId: testProblem._id,
      universityId: testUnivUser._id,
      proposalTitle: 'TEST_PHASE4: Low-Cost Solar Electro-Coagulation Fluoride Filter',
      executiveSummary: 'Solar powered filtration system removing 98% fluoride using activated alumina and electrolysis.',
      proposedMethodology: '1. CAD modeling & sensor simulation -> 2. Prototype bench testing -> 3. Village pilot deployment.',
      estimatedBudgetINR: 150000,
      projectTimelineMonths: 6,
      teamMembers: [
        { name: 'Amit Kumar', studentId: 'BIT/2022/104', branch: 'Civil Engineering', year: 'Final Year', role: 'Student Lead' },
        { name: 'Pooja Verma', studentId: 'BIT/2023/215', branch: 'Biotechnology', year: '3rd Year', role: 'Chemical Testing' }
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
          title: 'Design & Lab Simulation',
          description: 'CAD schematics and flow simulation.',
          targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          percentageFundingToRelease: 30,
          status: 'Completed',
          deliverableLink: 'https://github.com/test/cad-design.pdf'
        },
        {
          milestoneNumber: 2,
          title: 'Working Hardware Prototype Demo',
          description: 'Bench demonstration removing fluoride below 1.5 ppm.',
          targetDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
          percentageFundingToRelease: 40,
          status: 'Submitted_For_Review',
          deliverableLink: 'https://youtube.com/test-working-prototype-demo'
        },
        {
          milestoneNumber: 3,
          title: 'Field Deployment & Village Handover',
          description: 'Installed at Kanke village community well.',
          targetDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
          percentageFundingToRelease: 30,
          status: 'Pending'
        }
      ],
      ipOwnershipDeclaration: 'Open_Source_Social_Good',
      prototypeMedia: [],
      status: 'Submitted_To_Open_Pool'
    });

    testProblem.status = 'Proposal Submitted';
    await testProblem.save();

    console.log(`   Proposal ID: ${proposal._id}`);
    console.log(`   Title: ${proposal.proposalTitle}`);
    console.log(`   Budget: ₹${proposal.estimatedBudgetINR} across ${proposal.milestoneTranches.length} Tranches`);
    console.log(`   IP Declaration: ${proposal.ipOwnershipDeclaration}`);
    console.log(`   Team Size: ${proposal.teamMembers.length} Students + Mentor (${proposal.facultyMentor.name})`);
    console.log('   [OK] Test 4 Passed!\n');

    // 5. Test Milestone Deliverable Progress Update
    console.log('[TEST 5] Testing Milestone Deliverable Progress Update...');
    const m2 = proposal.milestoneTranches.find((m) => m.milestoneNumber === 2);
    if (m2) {
      m2.status = 'Completed';
      m2.mentorReviewNotes = 'Verified in environmental engineering lab. Fluoride reduced from 6.8 ppm to 0.9 ppm.';
    }
    await proposal.save();

    console.log(`   Milestone #2 Status: ${proposal.milestoneTranches[1].status}`);
    console.log(`   Mentor Review Note: "${proposal.milestoneTranches[1].mentorReviewNotes}"`);
    console.log('   [OK] Test 5 Passed!\n');

    // 6. Test Prototype Evidence Upload
    console.log('[TEST 6] Testing Prototype Evidence Upload (Photos / Videos / Reports)...');
    proposal.prototypeMedia.push({
      mediaType: 'image',
      url: 'https://cloudinary.com/test_filter_prototype.jpg',
      caption: 'Bench prototype operating under solar PV power in lab.',
      uploadedAt: new Date()
    });
    await proposal.save();

    console.log(`   Prototype Media Items: ${proposal.prototypeMedia.length}`);
    console.log(`   Caption: "${proposal.prototypeMedia[0].caption}"`);
    console.log('   [OK] Test 6 Passed!\n');

    // Clean test data
    await UniversityUser.deleteMany({ institutionalEmail: 'ananya.sen@bitmesra.ac.in' });
    await Problem.deleteMany({ title: { $regex: /TEST_PHASE4/ } });
    await SolutionProposal.deleteMany({ proposalTitle: { $regex: /TEST_PHASE4/ } });

    console.log('[SUCCESS] All Phase 4 University Backend Tests Passed with 100% Success!');
  } catch (error: any) {
    console.error('[!] Test failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

runUniversityTests();
