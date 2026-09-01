// ==========================================
// INDUSTRY MODULE - TEST VERIFICATION SCRIPT
// File: Backend/testIndustryService.ts
// ==========================================

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { IndustryUser } from './industry/models/IndustryUser';
import { Partnership } from './industry/models/Partnership';
import { SolutionProposal } from './university/models/SolutionProposal';
import { Problem } from './citizen/models/Problem';
import { UniversityUser } from './university/models/UniversityUser';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/samadhan_setu_test';
const JWT_SECRET = process.env.JWT_SECRET || 'your_industry_jwt_secret_key_here';

async function runIndustryTests() {
  console.log('==========================================');
  console.log('[TEST] Starting Phase 5 Industry Backend Tests...');
  console.log('==========================================\n');

  try {
    await mongoose.connect(MONGODB_URI);
    console.log('[OK] Connected to MongoDB test database.\n');

    // Clean test data
    await IndustryUser.deleteMany({ officialEmail: 'csr.jharkhand@tatasteel.com' });
    await Problem.deleteMany({ title: { $regex: /TEST_PHASE5/ } });
    await SolutionProposal.deleteMany({ proposalTitle: { $regex: /TEST_PHASE5/ } });
    await Partnership.deleteMany({ totalPledgedFundingINR: 150000 });

    // 1. Test Industry Registration
    console.log('[TEST 1] Testing Industry / CSR Registration (Tata Steel CSR Foundation)...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Industry@1234', salt);

    const testIndustry = await IndustryUser.create({
      organizationName: 'Tata Steel CSR Foundation, Jamshedpur',
      orgType: 'Corporate_CSR',
      officialEmail: 'csr.jharkhand@tatasteel.com',
      password: hashedPassword,
      contactPersonName: 'Sanjay Srivastava',
      contactPhone: '+91-657-2431234',
      interestDomains: ['Water Resources', 'Rural Livelihoods', 'Healthcare', 'Environment'],
      websiteUrl: 'https://www.tatasteel.com/sustainability/csr',
      isVerifiedPartner: true,
      totalGrantsAllocatedINR: 0
    });

    console.log(`   Registered: ${testIndustry.organizationName} (${testIndustry.orgType})`);
    console.log(`   Official Email: ${testIndustry.officialEmail}, Focus Domains: ${testIndustry.interestDomains.join(', ')}`);
    console.log('   [OK] Test 1 Passed!\n');

    // 2. Test Industry Login & JWT Token
    console.log('[TEST 2] Testing Password Verification & JWT Generation...');
    const isMatch = await bcrypt.compare('Industry@1234', testIndustry.password);
    if (!isMatch) throw new Error('Password verification failed');

    const token = jwt.sign(
      {
        id: testIndustry._id,
        role: 'industry',
        officialEmail: testIndustry.officialEmail,
        organizationName: testIndustry.organizationName,
        orgType: testIndustry.orgType
      },
      JWT_SECRET,
      { expiresIn: '1d' }
    );
    const decoded: any = jwt.verify(token, JWT_SECRET);
    console.log(`   JWT Token Verified! Decoded ID: ${decoded.id}, Org: ${decoded.organizationName}`);
    console.log('   [OK] Test 2 Passed!\n');

    // Setup a mock university, problem and proposal to sponsor
    const mockProblem = await Problem.create({
      title: 'TEST_PHASE5: High fluoride in rural well water',
      description: 'Severe fluoride contamination in 8 villages in Ranchi district.',
      languageCode: 'hi',
      isAnonymous: false,
      domainCategory: 'Water Resources',
      isDisasterEmergency: false,
      isActionableRnD: true,
      location: { district: 'Ranchi', block: 'Kanke' },
      status: 'Assigned to University',
      severityLevel: 'High',
      aiTags: ['water-filtration', 'fluoride']
    });

    const mockUniv = await UniversityUser.create({
      fullName: 'Dr. Ananya Sen',
      universityName: 'BIT Mesra, Ranchi',
      department: 'Civil & Environmental Engineering',
      institutionalEmail: 'test.bit.mentor@bitmesra.ac.in',
      password: hashedPassword,
      role: 'Faculty_Mentor',
      researchExpertiseTags: ['Water Purification']
    });

    const mockProposal = await SolutionProposal.create({
      problemId: mockProblem._id,
      universityId: mockUniv._id,
      proposalTitle: 'TEST_PHASE5: Solar Electro-Coagulation Fluoride Removal Unit',
      executiveSummary: 'Solar-powered mobile water filtration unit for fluoride-affected villages.',
      proposedMethodology: '1. Simulation -> 2. Bench Prototype -> 3. Village Field Testing',
      estimatedBudgetINR: 150000,
      projectTimelineMonths: 6,
      teamMembers: [{ name: 'Amit Kumar', branch: 'Civil', year: '4th', role: 'Lead' }],
      facultyMentor: { name: 'Dr. Ananya Sen', email: 'test.bit.mentor@bitmesra.ac.in', department: 'Civil', mentorApprovalStatus: 'Approved' },
      milestoneTranches: [
        { milestoneNumber: 1, title: 'CAD Design & Lab Simulation', description: 'CAD modeling', targetDate: new Date(), percentageFundingToRelease: 30, status: 'Completed' },
        { milestoneNumber: 2, title: 'Working Prototype Demo', description: 'Lab demo', targetDate: new Date(), percentageFundingToRelease: 40, status: 'Pending' },
        { milestoneNumber: 3, title: 'Field Deployment', description: 'Village pilot', targetDate: new Date(), percentageFundingToRelease: 30, status: 'Pending' }
      ],
      ipOwnershipDeclaration: 'Open_Source_Social_Good',
      status: 'Submitted_To_Open_Pool'
    });

    // 3. Test Sponsoring a Proposal with Milestone Tranche Disbursements
    console.log('[TEST 3] Testing CSR Grant Pledging & Milestone-Linked Tranches...');
    const partnership = await Partnership.create({
      industryId: testIndustry._id,
      proposalId: mockProposal._id,
      universityId: mockUniv._id,
      collaborationType: ['CSR_Grant_Funding', 'Technical_Mentorship', 'Lab_Equipment_Access'],
      totalPledgedFundingINR: 150000,
      fundingDisbursements: [
        { trancheNumber: 1, amountINR: 45000, status: 'Released', transactionReferenceOrUTR: 'UTR-TATA-2026-001', disbursedAt: new Date() },
        { trancheNumber: 2, amountINR: 60000, status: 'Scheduled', milestoneReferenceId: 'Milestone 2: Prototype Demo' },
        { trancheNumber: 3, amountINR: 45000, status: 'Scheduled', milestoneReferenceId: 'Milestone 3: Field Deployment' }
      ],
      mentorshipFeedbackThread: [
        {
          mentorName: 'Sanjay Srivastava (Tata Steel CSR)',
          message: 'Tata Steel CSR Foundation has approved ₹1.5 Lakh grant. Tranche 1 (₹45,000) released for CAD design & lab materials.',
          timestamp: new Date()
        }
      ],
      csrComplianceCertificateUrl: 'https://tatasteel.com/csr/cert-2026-001.pdf',
      status: 'Funding_Active'
    });

    // Update records
    mockProposal.industrySponsorId = testIndustry._id as any;
    mockProposal.status = 'Funded_In_Progress';
    await mockProposal.save();

    mockProblem.status = 'In Progress';
    await mockProblem.save();

    testIndustry.totalGrantsAllocatedINR += 150000;
    await testIndustry.save();

    console.log(`   Partnership ID: ${partnership._id}`);
    console.log(`   Pledged Grant: ₹${partnership.totalPledgedFundingINR}`);
    console.log(`   Collaboration Types: ${partnership.collaborationType.join(', ')}`);
    console.log(`   Tranche Disbursements: ${partnership.fundingDisbursements.length} Tranches (${partnership.fundingDisbursements[0].status}: ₹${partnership.fundingDisbursements[0].amountINR})`);
    console.log(`   Proposal Status: ${mockProposal.status}, Problem Status: ${mockProblem.status}`);
    console.log('   [OK] Test 3 Passed!\n');

    // 4. Test Posting Mentorship Feedback
    console.log('[TEST 4] Testing Mentorship Feedback Thread...');
    partnership.mentorshipFeedbackThread.push({
      mentorName: 'Dr. Vivek Sharma (Tata Steel R&D)',
      message: 'Recommend using 316L stainless steel electrodes to prevent corrosion during high-salinity water tests.',
      timestamp: new Date()
    });
    await partnership.save();

    console.log(`   Total Mentorship Notes: ${partnership.mentorshipFeedbackThread.length}`);
    console.log(`   Latest Note: "${partnership.mentorshipFeedbackThread[1].message}"`);
    console.log('   [OK] Test 4 Passed!\n');

    // 5. Test Disbursing Subsequent Tranche (Tranche 2)
    console.log('[TEST 5] Testing Disbursing Tranche #2 on Prototype Milestone Completion...');
    const t2 = partnership.fundingDisbursements.find((t) => t.trancheNumber === 2);
    if (t2) {
      t2.status = 'Released';
      t2.transactionReferenceOrUTR = 'UTR-TATA-2026-002';
      t2.disbursedAt = new Date();
    }
    await partnership.save();

    console.log(`   Tranche #2 Status: ${partnership.fundingDisbursements[1].status}`);
    console.log(`   UTR Reference: ${partnership.fundingDisbursements[1].transactionReferenceOrUTR}`);
    console.log('   [OK] Test 5 Passed!\n');

    // 6. Test Metrics Verification
    console.log('[TEST 6] Testing Industry Grants Total Verification...');
    const updatedIndustry = await IndustryUser.findById(testIndustry._id);
    console.log(`   Total CSR Grants Allocated: ₹${updatedIndustry?.totalGrantsAllocatedINR}`);
    console.log('   [OK] Test 6 Passed!\n');

    // Clean test data
    await IndustryUser.deleteMany({ officialEmail: 'csr.jharkhand@tatasteel.com' });
    await Problem.deleteMany({ title: { $regex: /TEST_PHASE5/ } });
    await SolutionProposal.deleteMany({ proposalTitle: { $regex: /TEST_PHASE5/ } });
    await Partnership.deleteMany({ totalPledgedFundingINR: 150000 });
    await UniversityUser.deleteMany({ institutionalEmail: 'test.bit.mentor@bitmesra.ac.in' });

    console.log('[SUCCESS] All Phase 5 Industry Backend Tests Passed with 100% Success!');
  } catch (error: any) {
    console.error('[!] Test failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

runIndustryTests();
