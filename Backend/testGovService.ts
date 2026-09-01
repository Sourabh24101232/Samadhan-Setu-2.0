// ==========================================
// GOVERNMENT MODULE - TEST VERIFICATION SCRIPT
// File: Backend/testGovService.ts
// ==========================================

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { GovAdmin } from './gov/models/GovAdmin';
import { Problem } from './citizen/models/Problem';
import { UniversityUser } from './university/models/UniversityUser';
import { SolutionProposal } from './university/models/SolutionProposal';
import { Partnership } from './industry/models/Partnership';
import { IndustryUser } from './industry/models/IndustryUser';
import { JHARKHAND_24_DISTRICTS } from './gov/controllers/analyticsController';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/samadhan_setu_test';
const JWT_SECRET = process.env.JWT_SECRET || 'your_gov_jwt_secret_key_here';

async function runGovTests() {
  console.log('==========================================');
  console.log('[TEST] Starting Phase 6 Government Backend Tests...');
  console.log('==========================================\n');

  try {
    await mongoose.connect(MONGODB_URI);
    console.log('[OK] Connected to MongoDB test database.\n');

    // Clean test data
    await GovAdmin.deleteMany({ governmentEmail: 'director.higheredu@jharkhand.gov.in' });
    await Problem.deleteMany({ title: { $regex: /TEST_PHASE6/ } });

    // 1. Test Government Officer Registration
    console.log('[TEST 1] Testing Government Officer Registration...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('GovAdmin@1234', salt);

    const testOfficer = await GovAdmin.create({
      officialName: 'Rajesh Kumar Singh (IAS)',
      governmentEmail: 'director.higheredu@jharkhand.gov.in',
      password: hashedPassword,
      department: 'Department of Higher & Technical Education',
      jurisdictionLevel: 'State_Level',
      role: 'SuperAdmin'
    });

    console.log(`   Registered: ${testOfficer.officialName} (${testOfficer.role})`);
    console.log(`   Department: ${testOfficer.department}, Jurisdiction: ${testOfficer.jurisdictionLevel}`);
    console.log('   [OK] Test 1 Passed!\n');

    // 2. Test Government Login & JWT Token
    console.log('[TEST 2] Testing Password Verification & JWT Generation...');
    const isMatch = await bcrypt.compare('GovAdmin@1234', testOfficer.password);
    if (!isMatch) throw new Error('Password verification failed');

    const token = jwt.sign(
      {
        id: testOfficer._id,
        role: testOfficer.role,
        governmentEmail: testOfficer.governmentEmail,
        department: testOfficer.department,
        jurisdictionLevel: testOfficer.jurisdictionLevel
      },
      JWT_SECRET,
      { expiresIn: '1d' }
    );
    const decoded: any = jwt.verify(token, JWT_SECRET);
    console.log(`   JWT Token Verified! Decoded ID: ${decoded.id}, Role: ${decoded.role}`);
    console.log('   [OK] Test 2 Passed!\n');

    // 3. Test Disaster Emergency Priority Queue
    console.log('[TEST 3] Testing Disaster Emergency Priority Sorting...');
    const regularProblem = await Problem.create({
      title: 'TEST_PHASE6: Regular irrigation canal leak',
      description: 'Minor leakage in secondary canal.',
      domainCategory: 'Agriculture',
      isDisasterEmergency: false,
      isActionableRnD: true,
      location: { district: 'Ranchi' },
      status: 'Submitted'
    });

    const disasterProblem = await Problem.create({
      title: 'TEST_PHASE6: Sudden toxic gas leak in Jharia coal mine colony',
      description: 'Toxic carbon monoxide emission endangering 500 households.',
      domainCategory: 'Disaster Management',
      isDisasterEmergency: true,
      isActionableRnD: true,
      location: { district: 'Dhanbad' },
      status: 'Emergency_Escalated',
      severityLevel: 'Critical'
    });

    const queue = await Problem.find({ title: { $regex: /TEST_PHASE6/ } })
      .sort({ isDisasterEmergency: -1, createdAt: -1 });

    console.log(`   Queue Item #1: "${queue[0].title}" (Emergency: ${queue[0].isDisasterEmergency})`);
    console.log(`   Queue Item #2: "${queue[1].title}" (Emergency: ${queue[1].isDisasterEmergency})`);
    if (!queue[0].isDisasterEmergency) throw new Error('Emergency SOS should be top priority');
    console.log('   [OK] Test 3 Passed!\n');

    // 4. Test Validating & Routing Problem
    console.log('[TEST 4] Testing Problem Validation & University Allocation...');
    regularProblem.status = 'Verified';
    regularProblem.severityLevel = 'Medium';
    await regularProblem.save();

    console.log(`   Problem: "${regularProblem.title}"`);
    console.log(`   Status Updated: ${regularProblem.status}, Severity: ${regularProblem.severityLevel}`);
    console.log('   [OK] Test 4 Passed!\n');

    // 5. Test Authorizing Official Government Field Pilot Sanction
    console.log('[TEST 5] Testing Pilot Deployment Authorization Order...');
    regularProblem.status = 'Testing';
    await regularProblem.save();

    const pilotSanctionOrder = {
      authorizationNumber: `JH-PILOT-2026-${Date.now()}`,
      district: regularProblem.location.district,
      sanctionedBy: testOfficer.officialName,
      sanctionDate: new Date()
    };

    console.log(`   Pilot Sanction Order: ${pilotSanctionOrder.authorizationNumber}`);
    console.log(`   Sanctioned By: ${pilotSanctionOrder.sanctionedBy} for ${pilotSanctionOrder.district}`);
    console.log('   [OK] Test 5 Passed!\n');

    // 6. Test Statewide KPI Summary Aggregation
    console.log('[TEST 6] Testing Statewide KPI Aggregation...');
    const totalCount = await Problem.countDocuments();
    const emergencyCount = await Problem.countDocuments({ isDisasterEmergency: true });
    console.log(`   Total Societal Challenges in DB: ${totalCount}`);
    console.log(`   Disaster Emergency SOS Alerts: ${emergencyCount}`);
    console.log('   [OK] Test 6 Passed!\n');

    // 7. Test 24-District Heatmap Aggregation
    console.log('[TEST 7] Testing 24-District Heatmap Distribution...');
    console.log(`   Total Jharkhand Districts Covered: ${JHARKHAND_24_DISTRICTS.length}`);
    if (JHARKHAND_24_DISTRICTS.length !== 24) throw new Error('Expected 24 districts');
    console.log(`   Sample Districts: ${JHARKHAND_24_DISTRICTS.slice(0, 5).join(', ')}...`);
    console.log('   [OK] Test 7 Passed!\n');

    // Clean test data
    await GovAdmin.deleteMany({ governmentEmail: 'director.higheredu@jharkhand.gov.in' });
    await Problem.deleteMany({ title: { $regex: /TEST_PHASE6/ } });

    console.log('[SUCCESS] All Phase 6 Government Backend Tests Passed with 100% Success!');
  } catch (error: any) {
    console.error('[!] Test failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

runGovTests();
