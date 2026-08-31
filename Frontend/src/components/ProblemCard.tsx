// ==========================================
// FRONTEND COMPONENT - PROBLEM CARD
// File: Frontend/src/components/ProblemCard.tsx
// ==========================================

/*
  PURPOSE:
  - Reusable card component displaying a societal challenge with domain tag, severity badge, location, photo preview, and upvote button.

  PROPS TO DEFINE LATER:
  - problem: ProblemType (id, title, description, domainCategory, location, mediaAttachments, upvotes, status, assignedUniversity)
  - onUpvote?: (problemId: string) => void

  ELEMENTS TO RENDER LATER:
  1. Header: Domain Badge (e.g. "Water Resources" in blue pill) + Severity Badge ("High Priority" in red/amber).
  2. Title & Brief Description snippet.
  3. Location Tag: District, Block / Village with MapPin icon.
  4. Media: Thumbnail image preview if attached.
  5. Footer:
     - Upvote counter & interactive thumbs-up button.
     - Lifecycle Status Pill (e.g., "Assigned to BIT Mesra", "In Testing", "Submitted").
     - "View Details & Solutions" link.
*/
