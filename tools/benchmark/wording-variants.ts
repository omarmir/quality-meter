export type WordingExperimentPattern =
  | 'vague_bad_over_scored'
  | 'specificity_under_scored'
  | 'strong_detail_under_scored'

export type WordingExperiment = {
  caseId: string
  pattern: WordingExperimentPattern
  rationale: string
  explicitQuestion: string
  explicitCriteria: string[]
}

export const WORDING_EXPERIMENTS: WordingExperiment[] = [
  {
    caseId: 'food-security-breakfast-bad',
    pattern: 'vague_bad_over_scored',
    rationale: 'Bad answer that sounds topical because the original wording allows purpose-only language to feel partially sufficient.',
    explicitQuestion:
      'Explain this school breakfast agreement by naming three things clearly: 1) the breakfast or food-security program being funded, 2) the concrete meal, school, or student targets, and 3) how purchasing, distribution, and staff or volunteer coordination will deliver the work.',
    explicitCriteria: [
      'States clearly that the agreement funds a school breakfast or school food-security program',
      'Names the concrete meal, school, and student targets instead of speaking only in general terms',
      'Explains that food purchasing, school distribution, and volunteer or staff coordination are the delivery plan',
    ],
  },
  {
    caseId: 'indigenous-remote-workforce-bad',
    pattern: 'vague_bad_over_scored',
    rationale: 'Bad answer matches the topic but stays generic about placements and delivery details.',
    explicitQuestion:
      'Explain this Indigenous remote workforce agreement by identifying 1) the employment support funded for Indigenous job seekers in remote communities, 2) the concrete participant, placement, and employer-partnership targets, and 3) how coaching, travel support, and employer coordination deliver the service.',
    explicitCriteria: [
      'States that the agreement funds employment support for Indigenous job seekers in remote communities',
      'Names the participant, placement, and employer-partnership targets concretely',
      'Explains that community coaching, travel support, and employer coordination deliver the work',
    ],
  },
  {
    caseId: 'neighbourhood-cleanup-microgrants-bad',
    pattern: 'vague_bad_over_scored',
    rationale: 'Bad answer over-scores because neighbourhood improvement sounds close enough unless the grant administration details are made explicit.',
    explicitQuestion:
      'Describe this neighbourhood cleanup microgrants agreement by identifying 1) the microgrant program being funded, 2) the grant, volunteer, site, or cleanup targets, and 3) how applications, approvals, and supported cleanup events administer the grants.',
    explicitCriteria: [
      'States that the agreement funds neighbourhood cleanup microgrants',
      'Names the grant, volunteer, site, or cleanup targets concretely',
      'Explains that applications, approvals, and supported cleanup events administer the grants',
    ],
  },
  {
    caseId: 'asthma-home-visits-mixed',
    pattern: 'specificity_under_scored',
    rationale: 'Mixed answer has the right shape but the scorer appears to under-credit it unless targets are called out more literally.',
    explicitQuestion:
      'Explain this childhood asthma home-visit agreement by covering 1) the home-visit service being funded, 2) the family, visit, and hospital-use reduction targets it expects, and 3) how home visits, education, and care-plan follow-up deliver the service.',
    explicitCriteria: [
      'States that the agreement funds childhood asthma home-visit support',
      'Names the family, visit, and hospital-use reduction targets or target categories clearly',
      'Explains that home visits, education, and care-plan follow-up deliver the service',
    ],
  },
  {
    caseId: 'modular-housing-site-setup-mixed',
    pattern: 'specificity_under_scored',
    rationale: 'Mixed answer is structurally correct but may be under-scored because occupancy-readiness details are implicit rather than literal.',
    explicitQuestion:
      'Summarize this modular housing site setup agreement by naming 1) the site setup work being funded, 2) the unit, utility, or occupancy-readiness targets, and 3) how servicing, foundations, and site coordination prepare the project.',
    explicitCriteria: [
      'States that the agreement funds modular housing site setup',
      'Names the unit, utility, or occupancy-readiness targets or target categories clearly',
      'Explains that servicing, foundations, and site coordination prepare the project',
    ],
  },
  {
    caseId: 'social-enterprise-placements-mixed',
    pattern: 'specificity_under_scored',
    rationale: 'Mixed answer appears to lose credit when participant outcomes are described generally rather than with explicit placement and transition language.',
    explicitQuestion:
      'Summarize this social enterprise placement agreement by identifying 1) the placement program being funded, 2) the participant, placement, and transition outcomes it expects, and 3) how placements, coaching, and wraparound supports deliver the program.',
    explicitCriteria: [
      'States that the agreement funds social enterprise work placements',
      'Names the participant, placement, and transition outcomes clearly',
      'Explains that placements, coaching, and wraparound supports deliver the program',
    ],
  },
  {
    caseId: 'coding-bridge-program-good',
    pattern: 'strong_detail_under_scored',
    rationale: 'Strong answer is detailed already, but more literal wording may help the scorer line up the portfolio and placement outcomes with the rubric.',
    explicitQuestion:
      'Explain this coding bridge agreement by naming 1) the coding bridge training being funded, 2) the learner, portfolio, and placement outcomes it expects, and 3) how instruction, mentorship, and project work deliver the program.',
    explicitCriteria: [
      'States that the agreement funds a coding bridge training program',
      'Names the learner, portfolio, and placement outcomes concretely',
      'Explains that instruction, mentorship, and project work deliver the program',
    ],
  },
  {
    caseId: 'home-care-expansion-mixed',
    pattern: 'specificity_under_scored',
    rationale: 'Mixed answer is close to the rubric but may be under-scored unless the staffing and scheduling plan is made more explicit.',
    explicitQuestion:
      'Explain this home care expansion agreement by covering 1) the expanded home care visits and nursing support being funded, 2) the visit, nurse-hire, and caseload targets, and 3) how recruitment, scheduling, and care-coordination reviews deliver the expansion.',
    explicitCriteria: [
      'States that the agreement funds expanded home care visits and nursing support',
      'Names the visit, nurse-hire, and caseload targets or target categories clearly',
      'Explains that nurse recruitment, scheduling, and care-coordination reviews are the delivery plan',
    ],
  },
]
