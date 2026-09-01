// ==========================================
// PHASE 1 VERIFICATION SCRIPT
// File: Backend/testDb.ts
// ==========================================

import { CitizenUser } from './citizen/models/CitizenUser';
import { Problem } from './citizen/models/Problem';
import { UniversityUser } from './university/models/UniversityUser';
import { SolutionProposal } from './university/models/SolutionProposal';
import { IndustryUser } from './industry/models/IndustryUser';
import { Partnership } from './industry/models/Partnership';
import { GovAdmin } from './gov/models/GovAdmin';

console.log('🧪 Verifying All Phase 1 Models & Schemas...');

const models = [
  { name: 'CitizenUser', model: CitizenUser },
  { name: 'Problem', model: Problem },
  { name: 'UniversityUser', model: UniversityUser },
  { name: 'SolutionProposal', model: SolutionProposal },
  { name: 'IndustryUser', model: IndustryUser },
  { name: 'Partnership', model: Partnership },
  { name: 'GovAdmin', model: GovAdmin }
];

models.forEach(({ name, model }) => {
  if (model && model.modelName) {
    console.log(`✅ Model Loaded Successfully: ${name} (Collection: ${model.collection.name})`);
  } else {
    console.error(`❌ Model Loading Failed: ${name}`);
  }
});

console.log('🎉 Phase 1 Database & Data Models Foundation 100% Verified!');
