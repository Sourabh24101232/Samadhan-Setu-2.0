// ==========================================
// FRONTEND LIB - API CLIENT HELPERS
// File: Frontend/src/lib/api.ts
// ==========================================

/*
  PURPOSE:
  - Centralized HTTP fetch / Axios helper functions to interact with all 5 backend microservice endpoints.

  FUNCTIONS TO IMPLEMENT LATER:

  1. CITIZEN API:
     - fetchPublicProblems(filterParams) -> GET /api/citizen/problems/public-feed
     - submitNewProblem(problemData, token) -> POST /api/citizen/problems/submit
     - fetchAnonymousTimeline(passkey) -> GET /api/citizen/problems/anonymous-track/:token
     - fetchMySubmissions(token) -> GET /api/citizen/problems/my-submissions
     - upvoteProblemApi(problemId, token) -> POST /api/citizen/problems/:id/upvote

  2. AI API:
     - classifyProblemLive(text, district) -> POST /api/ai/classify
     - checkDuplicateLive(text, coords) -> POST /api/ai/check-duplicates

  3. UNIVERSITY API:
     - fetchRoutedProblems(token) -> GET /api/university/problems/routed
     - claimProblemApi(problemId, token) -> POST /api/university/problems/:id/claim
     - submitProposalApi(proposalData, token) -> POST /api/university/proposals/submit
     - updateMilestoneApi(proposalId, milestoneIdx, status, token) -> PUT /api/university/proposals/:id/milestone

  4. INDUSTRY API:
     - fetchOpenProposals(token) -> GET /api/industry/partnerships/browse-proposals
     - pledgeFundingApi(pledgeData, token) -> POST /api/industry/partnerships/sponsor

  5. GOVERNMENT API:
     - fetchGovOverviewStats() -> GET /api/gov/analytics/overview
     - fetchDistrictStats() -> GET /api/gov/analytics/districts
     - verifyProblemGov(problemId, verifyData, token) -> PUT /api/gov/problems/:id/verify
     - approvePilotGov(problemId, token) -> PUT /api/gov/problems/:id/approve-pilot
*/

const CITIZEN_API = process.env.NEXT_PUBLIC_CITIZEN_API_URL || 'http://localhost:5001/api/citizen';
const UNIVERSITY_API = process.env.NEXT_PUBLIC_UNIVERSITY_API_URL || 'http://localhost:5002/api/university';
const INDUSTRY_API = process.env.NEXT_PUBLIC_INDUSTRY_API_URL || 'http://localhost:5003/api/industry';
const GOV_API = process.env.NEXT_PUBLIC_GOV_API_URL || 'http://localhost:5004/api/gov';
const AI_API = process.env.NEXT_PUBLIC_AI_API_URL || 'http://localhost:5005/api/ai';

// --- Generic Helper ---
async function request(url: string, options: RequestInit = {}) {
  try {
    const { headers, ...restOptions } = options;
    const res = await fetch(url, {
      ...restOptions,
      headers: {
        'Content-Type': 'application/json',
        ...(headers || {})
      }
    });
    return await res.json();
  } catch (error: any) {
    console.error(`API Request failed for ${url}:`, error);
    return { success: false, message: error.message || 'Network error' };
  }
}

// ==========================================
// 1. CITIZEN API HELPERS
// ==========================================
export const citizenApi = {
  register: (data: any) => request(`${CITIZEN_API}/auth/register`, { method: 'POST', body: JSON.stringify(data) }),
  login: (data: any) => request(`${CITIZEN_API}/auth/login`, { method: 'POST', body: JSON.stringify(data) }),
  getProfile: (token: string) => request(`${CITIZEN_API}/auth/profile`, { headers: { Authorization: `Bearer ${token}` } }),
  
  submitProblem: (data: any, token?: string) =>
    request(`${CITIZEN_API}/problems/submit`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: JSON.stringify(data)
    }),
  getAnonymousTimeline: (passkey: string) => request(`${CITIZEN_API}/problems/anonymous-track/${passkey}`),
  getMySubmissions: (token: string) =>
    request(`${CITIZEN_API}/problems/my-submissions`, { headers: { Authorization: `Bearer ${token}` } }),
  getPublicFeed: (params: string = '') => request(`${CITIZEN_API}/problems/public-feed${params}`),
  getProblemDetails: (id: string) => request(`${CITIZEN_API}/problems/${id}`),
  upvoteProblem: (id: string, voterId: string) =>
    request(`${CITIZEN_API}/problems/${id}/upvote`, { method: 'POST', body: JSON.stringify({ voterId }) }),
  confirmGroundResolution: (id: string, data: any, token?: string) =>
    request(`${CITIZEN_API}/problems/${id}/verify-ground`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: JSON.stringify(data)
    })
};

// ==========================================
// 2. UNIVERSITY API HELPERS
// ==========================================
export const universityApi = {
  register: (data: any) => request(`${UNIVERSITY_API}/auth/register`, { method: 'POST', body: JSON.stringify(data) }),
  login: (data: any) => request(`${UNIVERSITY_API}/auth/login`, { method: 'POST', body: JSON.stringify(data) }),
  getProfile: (token: string) => request(`${UNIVERSITY_API}/auth/profile`, { headers: { Authorization: `Bearer ${token}` } }),
  
  getRoutedProblems: (token: string, params: string = '') =>
    request(`${UNIVERSITY_API}/problems/routed${params}`, { headers: { Authorization: `Bearer ${token}` } }),
  claimProblem: (id: string, token: string) =>
    request(`${UNIVERSITY_API}/problems/${id}/claim`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } }),
  submitProposal: (data: any, token: string) =>
    request(`${UNIVERSITY_API}/proposals/submit`, { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify(data) }),
  getMyProposals: (token: string) =>
    request(`${UNIVERSITY_API}/proposals/my-proposals`, { headers: { Authorization: `Bearer ${token}` } }),
  updateMilestone: (proposalId: string, data: any, token: string) =>
    request(`${UNIVERSITY_API}/proposals/${proposalId}/milestone`, { method: 'PUT', headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify(data) }),
  uploadPrototypeMedia: (proposalId: string, data: any, token: string) =>
    request(`${UNIVERSITY_API}/proposals/${proposalId}/prototype-media`, { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify(data) })
};

// ==========================================
// 3. INDUSTRY API HELPERS
// ==========================================
export const industryApi = {
  register: (data: any) => request(`${INDUSTRY_API}/auth/register`, { method: 'POST', body: JSON.stringify(data) }),
  login: (data: any) => request(`${INDUSTRY_API}/auth/login`, { method: 'POST', body: JSON.stringify(data) }),
  getProfile: (token: string) => request(`${INDUSTRY_API}/auth/profile`, { headers: { Authorization: `Bearer ${token}` } }),
  
  browseProposals: (params: string = '') => request(`${INDUSTRY_API}/partnerships/browse-proposals${params}`),
  sponsorProposal: (data: any, token: string) =>
    request(`${INDUSTRY_API}/partnerships/sponsor`, { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify(data) }),
  getMyCollaborations: (token: string) =>
    request(`${INDUSTRY_API}/partnerships/my-commitments`, { headers: { Authorization: `Bearer ${token}` } }),
  postFeedback: (partnershipId: string, data: any, token: string) =>
    request(`${INDUSTRY_API}/partnerships/${partnershipId}/feedback`, { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify(data) }),
  disburseTranche: (partnershipId: string, data: any, token: string) =>
    request(`${INDUSTRY_API}/partnerships/${partnershipId}/disburse-tranche`, { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify(data) })
};

// ==========================================
// 4. GOVERNMENT API HELPERS
// ==========================================
export const govApi = {
  register: (data: any) => request(`${GOV_API}/auth/register`, { method: 'POST', body: JSON.stringify(data) }),
  login: (data: any) => request(`${GOV_API}/auth/login`, { method: 'POST', body: JSON.stringify(data) }),
  getProfile: (token: string) => request(`${GOV_API}/auth/profile`, { headers: { Authorization: `Bearer ${token}` } }),
  
  getAllProblems: (token: string, params: string = '') =>
    request(`${GOV_API}/problems/all${params}`, { headers: { Authorization: `Bearer ${token}` } }),
  verifyProblem: (id: string, data: any, token: string) =>
    request(`${GOV_API}/problems/${id}/verify`, { method: 'PUT', headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify(data) }),
  emergencyEscalation: (id: string, data: any, token: string) =>
    request(`${GOV_API}/problems/${id}/emergency-sos`, { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify(data) }),
  approvePilot: (id: string, data: any, token: string) =>
    request(`${GOV_API}/problems/${id}/approve-pilot`, { method: 'PUT', headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify(data) }),
  
  getOverviewKPIs: () => request(`${GOV_API}/analytics/overview`),
  getDistrictStats: () => request(`${GOV_API}/analytics/districts`),
  getDomainStats: () => request(`${GOV_API}/analytics/domains`),
  getUniversityLeaderboard: () => request(`${GOV_API}/analytics/university-rankings`)
};

// ==========================================
// 5. AI ENGINE HELPERS
// ==========================================
export const aiApi = {
  classifyLive: (data: { title: string; description: string; district: string; language?: string }) =>
    request(`${AI_API}/classify`, { method: 'POST', body: JSON.stringify(data) }),
  recommendUniversities: (data: { domain: string; district: string; tags?: string[] }) =>
    request(`${AI_API}/recommend-universities`, { method: 'POST', body: JSON.stringify(data) }),
  checkDuplicates: (data: any) =>
    request(`${AI_API}/check-duplicates`, { method: 'POST', body: JSON.stringify(data) })
};
