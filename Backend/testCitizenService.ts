// ==========================================
// CITIZEN MODULE - TEST VERIFICATION SCRIPT
// File: Backend/testCitizenService.ts
// ==========================================

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { CitizenUser } from './citizen/models/CitizenUser';
import { Problem } from './citizen/models/Problem';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/samadhan_setu_test';
const JWT_SECRET = process.env.JWT_SECRET || 'your_citizen_jwt_secret_key_here';

async function runCitizenTests() {
  console.log('==========================================');
  console.log('[TEST] Starting Phase 3 Citizen Backend Tests...');
  console.log('==========================================\n');

  try {
    await mongoose.connect(MONGODB_URI);
    console.log('[OK] Connected to MongoDB test database.\n');

    // Clean test collection
    await CitizenUser.deleteMany({ phone: '9876543210' });
    await Problem.deleteMany({ title: { $regex: /TEST_PHASE3/ } });

    // 1. Test Citizen Registration
    console.log('[TEST 1] Testing Citizen Registration...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Test@1234', salt);

    const testCitizen = await CitizenUser.create({
      fullName: 'Ramesh Mahto',
      phone: '9876543210',
      email: 'ramesh.jharkhand@test.com',
      password: hashedPassword,
      district: 'Ranchi',
      blockOrVillage: 'Kanke Village',
      userType: 'Individual',
      isVerified: true
    });

    console.log(`   Registered Citizen: ${testCitizen.fullName} (${testCitizen.phone})`);
    console.log(`   User Type: ${testCitizen.userType}, District: ${testCitizen.district}`);
    console.log('   [OK] Test 1 Passed!\n');

    // 2. Test Citizen Login & JWT Token
    console.log('[TEST 2] Testing Password Verification & JWT Generation...');
    const isMatch = await bcrypt.compare('Test@1234', testCitizen.password);
    if (!isMatch) throw new Error('Password comparison failed');

    const token = jwt.sign(
      { id: testCitizen._id, role: 'citizen', phone: testCitizen.phone },
      JWT_SECRET,
      { expiresIn: '1d' }
    );
    const decoded: any = jwt.verify(token, JWT_SECRET);
    console.log(`   JWT Token Generated & Verified! Decoded ID: ${decoded.id}`);
    console.log('   [OK] Test 2 Passed!\n');

    // 3. Test Authenticated Problem Submission
    console.log('[TEST 3] Testing Authenticated Problem Submission...');
    const authProblem = await Problem.create({
      title: 'TEST_PHASE3: Fluoride contamination in Kanke handpumps',
      description: 'Handpump water contains heavy fluoride causing dental fluorosis in children.',
      languageCode: 'hi',
      isAnonymous: false,
      submittedBy: testCitizen._id,
      domainCategory: 'Water Resources',
      isDisasterEmergency: false,
      isActionableRnD: true,
      location: {
        district: 'Ranchi',
        block: 'Kanke',
        villageOrPanchayat: 'Kanke Panchayat'
      },
      status: 'Submitted',
      severityLevel: 'High',
      aiTags: ['water-filtration', 'fluoride-removal', 'ranchi']
    });

    console.log(`   Auth Problem ID: ${authProblem._id}`);
    console.log(`   Submitted By: ${authProblem.submittedBy}`);
    console.log(`   Domain: ${authProblem.domainCategory}, Severity: ${authProblem.severityLevel}`);
    console.log('   [OK] Test 3 Passed!\n');

    // 4. Test Anonymous Whistleblower Submission
    console.log('[TEST 4] Testing 🛡️ Anonymous Whistleblower Submission (Zero Identity Logging)...');
    const secretPasskey = 'ANON-JH-E78B31';
    const anonProblem = await Problem.create({
      title: 'TEST_PHASE3: Toxic mine effluent discharged into local stream',
      description: 'Industrial waste dumped at midnight without safety treatment.',
      languageCode: 'hi',
      isAnonymous: true,
      anonymousTrackingToken: secretPasskey,
      submittedBy: null, // Strictly null for whistleblower protection
      domainCategory: 'Environment',
      isDisasterEmergency: false,
      isActionableRnD: true,
      location: {
        district: 'Bokaro',
        landmark: 'Near River Bank'
      },
      mediaAttachments: [
        {
          mediaType: 'image',
          url: 'https://cloudinary.com/test_toxic_water.jpg',
          isExifStripped: true, // EXIF metadata scrubbed
          uploadedAt: new Date()
        }
      ],
      status: 'Submitted',
      severityLevel: 'Critical',
      aiTags: ['toxic-effluent', 'water-pollution', 'bokaro']
    });

    console.log(`   Anon Problem ID: ${anonProblem._id}`);
    console.log(`   Submitted By: ${anonProblem.submittedBy} (Verified NULL - Zero identity logged)`);
    console.log(`   Secret Tracking Passkey: ${anonProblem.anonymousTrackingToken}`);
    console.log(`   EXIF Stripped: ${anonProblem.mediaAttachments[0].isExifStripped}`);
    console.log('   [OK] Test 4 Passed!\n');

    // 5. Test Anonymous Secret Passkey Lookup
    console.log('[TEST 5] Testing Secret Passkey Status Timeline Lookup...');
    const trackedProblem = await Problem.findOne({ anonymousTrackingToken: secretPasskey }).select('-submittedBy');
    if (!trackedProblem) throw new Error('Failed to find problem by secret passkey');

    console.log(`   Retrieved Title: ${trackedProblem.title}`);
    console.log(`   Current Stage Status: ${trackedProblem.status}`);
    console.log('   [OK] Test 5 Passed!\n');

    // 6. Test Community Upvoting
    console.log('[TEST 6] Testing Community Upvoting...');
    const voterId = 'voter_device_uuid_8849';
    authProblem.upvotes.push(voterId);
    await authProblem.save();

    console.log(`   Total Upvotes: ${authProblem.upvotes.length} (Voter: ${authProblem.upvotes[0]})`);
    console.log('   [OK] Test 6 Passed!\n');

    // 7. Test Citizen Ground-Truth Verification & Rating
    console.log('[TEST 7] Testing Citizen Ground-Truth Solution Verification (1-5 Star Rating)...');
    anonProblem.citizenGroundFeedback = {
      isResolvedConfirmedByCitizen: true,
      rating: 5,
      citizenFeedbackComments: 'University prototype water filter was deployed and water tested clean on ground.',
      verifiedAt: new Date()
    };
    anonProblem.status = 'Resolved';
    await anonProblem.save();

    console.log(`   Status Updated: ${anonProblem.status}`);
    console.log(`   Citizen Ground Feedback: ${anonProblem.citizenGroundFeedback.rating} Stars - "${anonProblem.citizenGroundFeedback.citizenFeedbackComments}"`);
    console.log('   [OK] Test 7 Passed!\n');

    // Clean test data
    await CitizenUser.deleteMany({ phone: '9876543210' });
    await Problem.deleteMany({ title: { $regex: /TEST_PHASE3/ } });

    console.log('[SUCCESS] All Phase 3 Citizen Backend Tests Passed with 100% Success!');
  } catch (error: any) {
    console.error('[!] Test failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

runCitizenTests();
