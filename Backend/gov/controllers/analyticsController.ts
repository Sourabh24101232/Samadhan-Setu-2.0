// ==========================================
// GOVERNMENT MODULE - VISUAL ANALYTICS & DASHBOARD CONTROLLER
// File: Backend/gov/controllers/analyticsController.ts
// ==========================================

/*
  PURPOSE:
  - Aggregates statewide data for Jharkhand Dept of Higher & Technical Education dashboard.

  FUNCTIONS TO IMPLEMENT LATER:

  1. getStatewideSummaryStats(req: Request, res: Response):
     - Compute total count of Problems Received, In-Progress, Resolved, Participating HEIs, Active Student Teams, CSR Funds Pledged (INR).

  2. getDistrictWiseDistribution(req: Request, res: Response):
     - Aggregate problems grouped by district (all 24 Jharkhand districts) and status for heatmap.

  3. getThematicDomainDistribution(req: Request, res: Response):
     - Aggregate problem counts by category (Water Resources, Agriculture, Healthcare, Energy, Disaster Management, etc.).

  4. getUniversityPerformanceMetrics(req: Request, res: Response):
     - Top performing universities by number of solutions deployed, patents filed, or funded projects.
*/

import { Request, Response } from 'express';
import { Problem } from '../../citizen/models/Problem';
import { UniversityUser } from '../../university/models/UniversityUser';
import { SolutionProposal } from '../../university/models/SolutionProposal';
import { Partnership } from '../../industry/models/Partnership';

export const JHARKHAND_24_DISTRICTS = [
  "Bokaro", "Chatra", "Deoghar", "Dhanbad", "Dumka",
  "East Singhbhum", "Garhwa", "Giridih", "Godda", "Gumla",
  "Hazaribagh", "Jamtara", "Khunti", "Koderma", "Latehar",
  "Lohardaga", "Pakur", "Palamu", "Ramgarh", "Ranchi",
  "Sahibganj", "Seraikela Kharsawan", "Simdega", "West Singhbhum"
];

/**
 * 1. Statewide Key Performance Indicator (KPI) Summary
 */
export const getStatewideSummaryStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const totalProblems = await Problem.countDocuments();
    const inProgressCount = await Problem.countDocuments({
      status: { $in: ['Assigned to University', 'Proposal Submitted', 'In Progress', 'Testing'] }
    });
    const resolvedCount = await Problem.countDocuments({ status: 'Resolved' });
    const emergencySOSCount = await Problem.countDocuments({ isDisasterEmergency: true });
    const totalHEIs = await UniversityUser.countDocuments();
    const totalProposals = await SolutionProposal.countDocuments();

    // Sum total CSR funds mobilized across partnerships
    const csrFundAggregate = await Partnership.aggregate([
      { $group: { _id: null, totalFunding: { $sum: '$totalPledgedFundingINR' } } }
    ]);
    const totalCSRFundsPledgedINR = csrFundAggregate.length > 0 ? csrFundAggregate[0].totalFunding : 0;

    res.status(200).json({
      success: true,
      data: {
        totalSocietalProblemsReported: totalProblems,
        activeChallengesInProgress: inProgressCount,
        solutionsFieldDeployedAndResolved: resolvedCount,
        disasterEmergencySOSAlerts: emergencySOSCount,
        participatingUniversitiesAndHEIs: totalHEIs,
        totalSolutionProposalsSubmitted: totalProposals,
        totalCSRGrantsMobilizedINR: totalCSRFundsPledgedINR,
        resolutionRatePercentage: totalProblems > 0 ? Math.round((resolvedCount / totalProblems) * 100) : 0
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error computing statewide summary stats.',
      error: error.message
    });
  }
};

/**
 * 2. 24-District Problem Distribution & Heatmap Aggregation
 */
export const getDistrictWiseDistribution = async (req: Request, res: Response): Promise<void> => {
  try {
    const districtAgg = await Problem.aggregate([
      {
        $group: {
          _id: '$location.district',
          totalReported: { $sum: 1 },
          inProgressCount: {
            $sum: {
              $cond: [
                { $in: ['$status', ['Assigned to University', 'Proposal Submitted', 'In Progress', 'Testing']] },
                1,
                0
              ]
            }
          },
          resolvedCount: {
            $sum: {
              $cond: [{ $eq: ['$status', 'Resolved'] }, 1, 0]
            }
          },
          emergencyCount: {
            $sum: {
              $cond: [{ $eq: ['$isDisasterEmergency', true] }, 1, 0]
            }
          }
        }
      }
    ]);

    const aggMap = new Map();
    districtAgg.forEach((d) => {
      if (d._id) aggMap.set(d._id.toLowerCase(), d);
    });

    // Ensure all 24 districts are present in the response
    const districtStats = JHARKHAND_24_DISTRICTS.map((districtName) => {
      const match = aggMap.get(districtName.toLowerCase());
      return {
        district: districtName,
        totalReported: match ? match.totalReported : 0,
        inProgressCount: match ? match.inProgressCount : 0,
        resolvedCount: match ? match.resolvedCount : 0,
        emergencyCount: match ? match.emergencyCount : 0,
        intensityLevel: match ? (match.totalReported > 15 ? 'High' : match.totalReported > 5 ? 'Medium' : 'Low') : 'Low'
      };
    });

    res.status(200).json({
      success: true,
      totalDistricts: districtStats.length,
      data: districtStats
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching district distribution.',
      error: error.message
    });
  }
};

/**
 * 3. Thematic Domain Distribution (11 Domains)
 */
export const getThematicDomainDistribution = async (req: Request, res: Response): Promise<void> => {
  try {
    const domainAgg = await Problem.aggregate([
      {
        $group: {
          _id: '$domainCategory',
          count: { $sum: 1 },
          resolvedCount: {
            $sum: {
              $cond: [{ $eq: ['$status', 'Resolved'] }, 1, 0]
            }
          }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.status(200).json({
      success: true,
      data: domainAgg.map((d) => ({
        domain: d._id || 'Unclassified',
        totalChallenges: d.count,
        resolvedCount: d.resolvedCount
      }))
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error computing domain distribution.',
      error: error.message
    });
  }
};

/**
 * 4. University Innovation Performance Leaderboard
 */
export const getUniversityPerformanceMetrics = async (req: Request, res: Response): Promise<void> => {
  try {
    const leaderboard = await UniversityUser.aggregate([
      {
        $lookup: {
          from: 'solutionproposals',
          localField: '_id',
          foreignField: 'universityId',
          as: 'proposals'
        }
      },
      {
        $lookup: {
          from: 'partnerships',
          localField: '_id',
          foreignField: 'universityId',
          as: 'partnerships'
        }
      },
      {
        $project: {
          universityName: 1,
          department: 1,
          role: 1,
          researchExpertiseTags: 1,
          incubationCenterDetails: 1,
          totalProposalsSubmitted: { $size: '$proposals' },
          totalFundedProjects: {
            $size: {
              $filter: {
                input: '$proposals',
                as: 'p',
                cond: { $eq: ['$$p.status', 'Funded_In_Progress'] }
              }
            }
          },
          totalSolutionsDeployed: {
            $size: {
              $filter: {
                input: '$proposals',
                as: 'p',
                cond: { $eq: ['$$p.status', 'Completed_Deployed'] }
              }
            }
          },
          totalCSRFundsReceivedINR: { $sum: '$partnerships.totalPledgedFundingINR' }
        }
      },
      { $sort: { totalSolutionsDeployed: -1, totalFundedProjects: -1, totalProposalsSubmitted: -1 } },
      { $limit: 10 }
    ]);

    res.status(200).json({
      success: true,
      leaderboard
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching university performance rankings.',
      error: error.message
    });
  }
};
