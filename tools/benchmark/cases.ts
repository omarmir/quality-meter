export type BenchmarkKind =
  | 'workforce'
  | 'health'
  | 'housing'
  | 'infrastructure'
  | 'community'

export type BenchmarkProfile = 'bad' | 'mixed' | 'good' | 'off_topic'

export type BenchmarkCriterion = {
  label: string
  weight: number
}

export type BenchmarkCase = {
  id: string
  kind: BenchmarkKind
  profile: BenchmarkProfile
  question: string
  criteria: BenchmarkCriterion[]
  answer: string
  referenceScores: number[]
}

export const BENCHMARK_CASES: BenchmarkCase[] = [
  {
    id: 'youth-employment-rural-bad',
    kind: 'workforce',
    profile: 'bad',
    question:
      'Summarize this rural youth employment agreement: what is funded, what participant and placement targets it sets, and how the organization says it will deliver the work.',
    criteria: [
      { label: 'States that the funding expands rural youth employment support', weight: 4 },
      { label: 'Names the participant, training-plan, and placement targets', weight: 4 },
      { label: 'Explains that delivery relies on workshops, case management, and employer placements', weight: 2 },
    ],
    answer:
      'This agreement provides funding to support youth services in the region. The organization will use the funding over the agreement period to improve outcomes and respond to local needs.',
    referenceScores: [0.65, 0.08, 0.12],
  },
  {
    id: 'youth-employment-rural-mixed',
    kind: 'workforce',
    profile: 'mixed',
    question:
      'Summarize this rural youth employment agreement: what is funded, what participant and placement targets it sets, and how the organization says it will deliver the work.',
    criteria: [
      { label: 'States that the funding expands rural youth employment support', weight: 4 },
      { label: 'Names the participant, training-plan, and placement targets', weight: 4 },
      { label: 'Explains that delivery relies on workshops, case management, and employer placements', weight: 2 },
    ],
    answer:
      'This agreement funds youth employment support in three rural communities. It aims to help more young people access training and job placements over the next year. The recipient will work with local employers and community partners to run workshops, referrals, and coaching.',
    referenceScores: [0.9, 0.45, 0.72],
  },
  {
    id: 'youth-employment-rural-good',
    kind: 'workforce',
    profile: 'good',
    question:
      'Summarize this rural youth employment agreement: what is funded, what participant and placement targets it sets, and how the organization says it will deliver the work.',
    criteria: [
      { label: 'States that the funding expands rural youth employment support', weight: 4 },
      { label: 'Names the participant, training-plan, and placement targets', weight: 4 },
      { label: 'Explains that delivery relies on workshops, case management, and employer placements', weight: 2 },
    ],
    answer:
      'The agreement provides $750,000 to expand youth employment support for unemployed people ages 18 to 24 in three rural communities. It targets 300 participants, 180 completed training plans, and 120 job placements by March 31, 2027. Delivery will come through weekly job-readiness workshops, one-on-one case management, employer partnerships for placements, and monthly progress reviews against enrolment and placement targets.',
    referenceScores: [0.98, 0.97, 0.95],
  },
  {
    id: 'youth-employment-rural-off-topic',
    kind: 'workforce',
    profile: 'off_topic',
    question:
      'Summarize this rural youth employment agreement: what is funded, what participant and placement targets it sets, and how the organization says it will deliver the work.',
    criteria: [
      { label: 'States that the funding expands rural youth employment support', weight: 4 },
      { label: 'Names the participant, training-plan, and placement targets', weight: 4 },
      { label: 'Explains that delivery relies on workshops, case management, and employer placements', weight: 2 },
    ],
    answer:
      'Move the router away from thick walls, separate the 2.4 GHz and 5 GHz bands, and retest speeds before buying new hardware.',
    referenceScores: [0, 0, 0],
  },

  {
    id: 'apprenticeship-retention-bad',
    kind: 'workforce',
    profile: 'bad',
    question:
      'Explain this apprenticeship retention agreement: what program is being funded, what completion targets it commits to, and how the sponsor plans to keep apprentices engaged.',
    criteria: [
      { label: 'States that the funding supports apprenticeship retention for first- and second-year trades trainees', weight: 4 },
      { label: 'Names the enrolment, mentorship, and completion targets', weight: 4 },
      { label: 'Explains that coaching, employer check-ins, and emergency supports are the delivery method', weight: 2 },
    ],
    answer:
      'The funding will support apprentices in the area. The sponsor will use the agreement to improve retention and strengthen relationships with employers over time.',
    referenceScores: [0.65, 0.08, 0.12],
  },
  {
    id: 'apprenticeship-retention-mixed',
    kind: 'workforce',
    profile: 'mixed',
    question:
      'Explain this apprenticeship retention agreement: what program is being funded, what completion targets it commits to, and how the sponsor plans to keep apprentices engaged.',
    criteria: [
      { label: 'States that the funding supports apprenticeship retention for first- and second-year trades trainees', weight: 4 },
      { label: 'Names the enrolment, mentorship, and completion targets', weight: 4 },
      { label: 'Explains that coaching, employer check-ins, and emergency supports are the delivery method', weight: 2 },
    ],
    answer:
      'The agreement funds a retention program for early-stage trades apprentices. It is meant to improve mentorship uptake and help more apprentices finish their training blocks this year. Delivery will include employer check-ins, coaching calls, and short-term tool or transit supports when apprentices hit barriers.',
    referenceScores: [0.88, 0.4, 0.74],
  },
  {
    id: 'apprenticeship-retention-good',
    kind: 'workforce',
    profile: 'good',
    question:
      'Explain this apprenticeship retention agreement: what program is being funded, what completion targets it commits to, and how the sponsor plans to keep apprentices engaged.',
    criteria: [
      { label: 'States that the funding supports apprenticeship retention for first- and second-year trades trainees', weight: 4 },
      { label: 'Names the enrolment, mentorship, and completion targets', weight: 4 },
      { label: 'Explains that coaching, employer check-ins, and emergency supports are the delivery method', weight: 2 },
    ],
    answer:
      'This agreement provides $620,000 for an apprenticeship retention program serving first- and second-year carpentry, electrical, and plumbing apprentices. It commits to 240 enrolled apprentices, 200 active mentorship matches, and 170 completed training blocks by June 2027. The sponsor will deliver the targets through monthly coaching calls, quarterly employer check-ins, emergency tool and transit vouchers, and attendance reviews with training providers.',
    referenceScores: [0.98, 0.96, 0.95],
  },
  {
    id: 'apprenticeship-retention-off-topic',
    kind: 'workforce',
    profile: 'off_topic',
    question:
      'Explain this apprenticeship retention agreement: what program is being funded, what completion targets it commits to, and how the sponsor plans to keep apprentices engaged.',
    criteria: [
      { label: 'States that the funding supports apprenticeship retention for first- and second-year trades trainees', weight: 4 },
      { label: 'Names the enrolment, mentorship, and completion targets', weight: 4 },
      { label: 'Explains that coaching, employer check-ins, and emergency supports are the delivery method', weight: 2 },
    ],
    answer:
      'Start dinner by roasting the vegetables at high heat, then cook the pasta separately and finish with lemon and olive oil.',
    referenceScores: [0, 0, 0],
  },

  {
    id: 'disability-employment-support-bad',
    kind: 'workforce',
    profile: 'bad',
    question:
      'According to this disability employment support agreement, what service is funded, what hiring outcomes are expected, and how will the organization deliver those outcomes?',
    criteria: [
      { label: 'States that the agreement funds disability employment support and job coaching', weight: 4 },
      { label: 'Names the participant, employer-engagement, and placement outcomes', weight: 4 },
      { label: 'Explains that coaching, workplace assessments, and employer outreach are the delivery approach', weight: 2 },
    ],
    answer:
      'The organization receives funding to support inclusive employment. The agreement will help improve opportunities and strengthen community partnerships.',
    referenceScores: [0.65, 0.08, 0.12],
  },
  {
    id: 'disability-employment-support-mixed',
    kind: 'workforce',
    profile: 'mixed',
    question:
      'According to this disability employment support agreement, what service is funded, what hiring outcomes are expected, and how will the organization deliver those outcomes?',
    criteria: [
      { label: 'States that the agreement funds disability employment support and job coaching', weight: 4 },
      { label: 'Names the participant, employer-engagement, and placement outcomes', weight: 4 },
      { label: 'Explains that coaching, workplace assessments, and employer outreach are the delivery approach', weight: 2 },
    ],
    answer:
      'The agreement funds disability employment support, including job coaching for adults seeking work. It is expected to help more participants connect with employers and move into paid placements this year. The organization will deliver the work through coaching sessions, workplace assessments, and employer outreach.',
    referenceScores: [0.9, 0.42, 0.76],
  },
  {
    id: 'disability-employment-support-good',
    kind: 'workforce',
    profile: 'good',
    question:
      'According to this disability employment support agreement, what service is funded, what hiring outcomes are expected, and how will the organization deliver those outcomes?',
    criteria: [
      { label: 'States that the agreement funds disability employment support and job coaching', weight: 4 },
      { label: 'Names the participant, employer-engagement, and placement outcomes', weight: 4 },
      { label: 'Explains that coaching, workplace assessments, and employer outreach are the delivery approach', weight: 2 },
    ],
    answer:
      'The agreement provides $540,000 to expand disability employment support and individualized job coaching for adults with barriers to work. It targets 180 participants, 90 employer engagement plans, and 75 paid placements by December 2026. Delivery will include one-on-one coaching, workplace accessibility assessments, employer outreach visits, and retention follow-ups at 30 and 90 days.',
    referenceScores: [0.98, 0.96, 0.95],
  },
  {
    id: 'disability-employment-support-off-topic',
    kind: 'workforce',
    profile: 'off_topic',
    question:
      'According to this disability employment support agreement, what service is funded, what hiring outcomes are expected, and how will the organization deliver those outcomes?',
    criteria: [
      { label: 'States that the agreement funds disability employment support and job coaching', weight: 4 },
      { label: 'Names the participant, employer-engagement, and placement outcomes', weight: 4 },
      { label: 'Explains that coaching, workplace assessments, and employer outreach are the delivery approach', weight: 2 },
    ],
    answer:
      'If your phone battery drains quickly, lower screen brightness, disable background refresh, and replace old charging cables first.',
    referenceScores: [0, 0, 0],
  },

  {
    id: 'newcomer-language-jobs-bad',
    kind: 'workforce',
    profile: 'bad',
    question:
      'Summarize this newcomer language-to-jobs agreement: what it funds, what employment results it expects, and how the recipient plans to deliver those results.',
    criteria: [
      { label: 'States that the funding supports language training tied to employment for newcomers', weight: 4 },
      { label: 'Names the class, credential, and job-placement targets', weight: 4 },
      { label: 'Explains that classes, occupation-specific coaching, and employer referrals are the delivery method', weight: 2 },
    ],
    answer:
      'The agreement funds settlement programming for newcomers. The recipient will use the money to improve access to services and help people succeed in the local economy.',
    referenceScores: [0.65, 0.08, 0.12],
  },
  {
    id: 'newcomer-language-jobs-mixed',
    kind: 'workforce',
    profile: 'mixed',
    question:
      'Summarize this newcomer language-to-jobs agreement: what it funds, what employment results it expects, and how the recipient plans to deliver those results.',
    criteria: [
      { label: 'States that the funding supports language training tied to employment for newcomers', weight: 4 },
      { label: 'Names the class, credential, and job-placement targets', weight: 4 },
      { label: 'Explains that classes, occupation-specific coaching, and employer referrals are the delivery method', weight: 2 },
    ],
    answer:
      'The agreement funds employment-focused language training for recent newcomers. It aims to move more participants into recognized credentials and jobs over the contract year. Delivery will include language classes, sector coaching, and referrals to employers who are hiring.',
    referenceScores: [0.9, 0.43, 0.73],
  },
  {
    id: 'newcomer-language-jobs-good',
    kind: 'workforce',
    profile: 'good',
    question:
      'Summarize this newcomer language-to-jobs agreement: what it funds, what employment results it expects, and how the recipient plans to deliver those results.',
    criteria: [
      { label: 'States that the funding supports language training tied to employment for newcomers', weight: 4 },
      { label: 'Names the class, credential, and job-placement targets', weight: 4 },
      { label: 'Explains that classes, occupation-specific coaching, and employer referrals are the delivery method', weight: 2 },
    ],
    answer:
      'This agreement provides $810,000 for employment-focused language training for newcomers in health care, food processing, and logistics. It targets 24 class cohorts, 220 learners, 140 credential completions, and 95 job placements by August 2027. The recipient will deliver the targets through occupation-specific language classes, evening coaching sessions, employer referrals, and monthly case conferences for participants at risk of dropping out.',
    referenceScores: [0.98, 0.97, 0.95],
  },
  {
    id: 'newcomer-language-jobs-off-topic',
    kind: 'workforce',
    profile: 'off_topic',
    question:
      'Summarize this newcomer language-to-jobs agreement: what it funds, what employment results it expects, and how the recipient plans to deliver those results.',
    criteria: [
      { label: 'States that the funding supports language training tied to employment for newcomers', weight: 4 },
      { label: 'Names the class, credential, and job-placement targets', weight: 4 },
      { label: 'Explains that classes, occupation-specific coaching, and employer referrals are the delivery method', weight: 2 },
    ],
    answer:
      'Repot the plant in fresh soil, trim the dead leaves, and water only when the top inch feels dry.',
    referenceScores: [0, 0, 0],
  },

  {
    id: 'women-trades-bootcamp-bad',
    kind: 'workforce',
    profile: 'bad',
    question:
      'What does this women-in-trades bootcamp agreement say is being funded, what enrolment and certification results are expected, and how those results will be delivered?',
    criteria: [
      { label: 'States that the funding supports a women-in-trades bootcamp', weight: 4 },
      { label: 'Names the enrolment, safety-certification, and apprenticeship-referral targets', weight: 4 },
      { label: 'Explains that the program will use bootcamp instruction, mentoring, and employer exposure days', weight: 2 },
    ],
    answer:
      'This agreement funds a program for women interested in the trades. It is intended to improve confidence and create stronger career pathways over time.',
    referenceScores: [0.65, 0.08, 0.12],
  },
  {
    id: 'women-trades-bootcamp-mixed',
    kind: 'workforce',
    profile: 'mixed',
    question:
      'What does this women-in-trades bootcamp agreement say is being funded, what enrolment and certification results are expected, and how those results will be delivered?',
    criteria: [
      { label: 'States that the funding supports a women-in-trades bootcamp', weight: 4 },
      { label: 'Names the enrolment, safety-certification, and apprenticeship-referral targets', weight: 4 },
      { label: 'Explains that the program will use bootcamp instruction, mentoring, and employer exposure days', weight: 2 },
    ],
    answer:
      'The agreement funds a women-in-trades bootcamp for people considering electrical, welding, and carpentry careers. It is expected to move more participants into certifications and apprenticeship referrals this year. Delivery will include short practical training blocks, mentoring, and employer exposure days.',
    referenceScores: [0.9, 0.42, 0.74],
  },
  {
    id: 'women-trades-bootcamp-good',
    kind: 'workforce',
    profile: 'good',
    question:
      'What does this women-in-trades bootcamp agreement say is being funded, what enrolment and certification results are expected, and how those results will be delivered?',
    criteria: [
      { label: 'States that the funding supports a women-in-trades bootcamp', weight: 4 },
      { label: 'Names the enrolment, safety-certification, and apprenticeship-referral targets', weight: 4 },
      { label: 'Explains that the program will use bootcamp instruction, mentoring, and employer exposure days', weight: 2 },
    ],
    answer:
      'The agreement provides $430,000 for a women-in-trades bootcamp focused on electrical, welding, and carpentry entry pathways. It targets 90 enrollees, 75 safety certifications, and 50 apprenticeship referrals by November 2026. The recipient will deliver the work through eight-week bootcamp cohorts, hands-on shop instruction, matched mentors from local unions, and employer exposure days with participating contractors.',
    referenceScores: [0.98, 0.96, 0.94],
  },
  {
    id: 'women-trades-bootcamp-off-topic',
    kind: 'workforce',
    profile: 'off_topic',
    question:
      'What does this women-in-trades bootcamp agreement say is being funded, what enrolment and certification results are expected, and how those results will be delivered?',
    criteria: [
      { label: 'States that the funding supports a women-in-trades bootcamp', weight: 4 },
      { label: 'Names the enrolment, safety-certification, and apprenticeship-referral targets', weight: 4 },
      { label: 'Explains that the program will use bootcamp instruction, mentoring, and employer exposure days', weight: 2 },
    ],
    answer:
      'To reduce glare in a room, install a matte screen protector, move the lamp behind the monitor, and lower the display contrast slightly.',
    referenceScores: [0, 0, 0],
  },

  {
    id: 'community-mental-health-bad',
    kind: 'health',
    profile: 'bad',
    question:
      'Explain this community mental health agreement: what service it funds, what client and wait-time outcomes it expects, and how the service will be delivered.',
    criteria: [
      { label: 'States that the agreement funds community mental health counselling and crisis navigation', weight: 4 },
      { label: 'Names the client-volume and wait-time reduction outcomes', weight: 4 },
      { label: 'Explains that counselling teams, intake triage, and outreach clinics are the delivery model', weight: 2 },
    ],
    answer:
      'The agreement funds mental health supports in the community. The service is meant to improve access and respond better to local demand.',
    referenceScores: [0.65, 0.08, 0.12],
  },
  {
    id: 'community-mental-health-mixed',
    kind: 'health',
    profile: 'mixed',
    question:
      'Explain this community mental health agreement: what service it funds, what client and wait-time outcomes it expects, and how the service will be delivered.',
    criteria: [
      { label: 'States that the agreement funds community mental health counselling and crisis navigation', weight: 4 },
      { label: 'Names the client-volume and wait-time reduction outcomes', weight: 4 },
      { label: 'Explains that counselling teams, intake triage, and outreach clinics are the delivery model', weight: 2 },
    ],
    answer:
      'The agreement funds community counselling and crisis navigation for adults who need faster access to care. It aims to serve more clients and shorten the wait for first appointments over the next year. Delivery will rely on counsellors, centralized intake triage, and outreach clinic days in neighbourhood sites.',
    referenceScores: [0.9, 0.44, 0.75],
  },
  {
    id: 'community-mental-health-good',
    kind: 'health',
    profile: 'good',
    question:
      'Explain this community mental health agreement: what service it funds, what client and wait-time outcomes it expects, and how the service will be delivered.',
    criteria: [
      { label: 'States that the agreement funds community mental health counselling and crisis navigation', weight: 4 },
      { label: 'Names the client-volume and wait-time reduction outcomes', weight: 4 },
      { label: 'Explains that counselling teams, intake triage, and outreach clinics are the delivery model', weight: 2 },
    ],
    answer:
      'This agreement provides $1.2 million to expand community mental health counselling and crisis navigation for adults and youth. It targets 1,100 counselling clients, 450 crisis navigation cases, and a reduction in first-appointment wait times from 28 days to 14 days by March 2027. The service will be delivered through two new counselling teams, centralized intake triage, evening outreach clinics, and monthly queue reviews to rebalance appointments.',
    referenceScores: [0.98, 0.97, 0.95],
  },
  {
    id: 'community-mental-health-off-topic',
    kind: 'health',
    profile: 'off_topic',
    question:
      'Explain this community mental health agreement: what service it funds, what client and wait-time outcomes it expects, and how the service will be delivered.',
    criteria: [
      { label: 'States that the agreement funds community mental health counselling and crisis navigation', weight: 4 },
      { label: 'Names the client-volume and wait-time reduction outcomes', weight: 4 },
      { label: 'Explains that counselling teams, intake triage, and outreach clinics are the delivery model', weight: 2 },
    ],
    answer:
      'Sharpen the mower blade once a season, avoid cutting wet grass, and change direction on each pass to reduce ruts.',
    referenceScores: [0, 0, 0],
  },

  {
    id: 'maternal-health-outreach-bad',
    kind: 'health',
    profile: 'bad',
    question:
      'Summarize this maternal health outreach agreement: what the funding is for, what visit or screening targets it sets, and how the recipient will deliver the service.',
    criteria: [
      { label: 'States that the funding supports maternal health outreach and prenatal screening access', weight: 4 },
      { label: 'Names the home-visit, screening, and follow-up targets', weight: 4 },
      { label: 'Explains that nurses, community workers, and referral tracking will deliver the work', weight: 2 },
    ],
    answer:
      'The agreement supports maternal health services in underserved areas. The recipient will use the funding to improve access and better coordinate care.',
    referenceScores: [0.65, 0.08, 0.12],
  },
  {
    id: 'maternal-health-outreach-mixed',
    kind: 'health',
    profile: 'mixed',
    question:
      'Summarize this maternal health outreach agreement: what the funding is for, what visit or screening targets it sets, and how the recipient will deliver the service.',
    criteria: [
      { label: 'States that the funding supports maternal health outreach and prenatal screening access', weight: 4 },
      { label: 'Names the home-visit, screening, and follow-up targets', weight: 4 },
      { label: 'Explains that nurses, community workers, and referral tracking will deliver the work', weight: 2 },
    ],
    answer:
      'The agreement funds maternal health outreach so more pregnant clients can access prenatal screening and early follow-up. It is expected to increase home visits and connect more people to screenings over the agreement year. Delivery will involve public health nurses, community outreach workers, and tracked referrals into hospital and primary care services.',
    referenceScores: [0.9, 0.43, 0.74],
  },
  {
    id: 'maternal-health-outreach-good',
    kind: 'health',
    profile: 'good',
    question:
      'Summarize this maternal health outreach agreement: what the funding is for, what visit or screening targets it sets, and how the recipient will deliver the service.',
    criteria: [
      { label: 'States that the funding supports maternal health outreach and prenatal screening access', weight: 4 },
      { label: 'Names the home-visit, screening, and follow-up targets', weight: 4 },
      { label: 'Explains that nurses, community workers, and referral tracking will deliver the work', weight: 2 },
    ],
    answer:
      'This agreement provides $690,000 for maternal health outreach in four underserved neighbourhoods. It targets 500 prenatal home visits, 320 completed prenatal screening referrals, and 280 post-screen follow-up contacts by February 2027. Delivery will come through nurse-led home visiting teams, community outreach workers for appointment support, and a referral-tracking system reviewed every month with hospital partners.',
    referenceScores: [0.98, 0.96, 0.95],
  },
  {
    id: 'maternal-health-outreach-off-topic',
    kind: 'health',
    profile: 'off_topic',
    question:
      'Summarize this maternal health outreach agreement: what the funding is for, what visit or screening targets it sets, and how the recipient will deliver the service.',
    criteria: [
      { label: 'States that the funding supports maternal health outreach and prenatal screening access', weight: 4 },
      { label: 'Names the home-visit, screening, and follow-up targets', weight: 4 },
      { label: 'Explains that nurses, community workers, and referral tracking will deliver the work', weight: 2 },
    ],
    answer:
      'Clean the gutters before the rainy season, extend the downspouts, and check the foundation slope after heavy storms.',
    referenceScores: [0, 0, 0],
  },

  {
    id: 'opioid-outreach-bad',
    kind: 'health',
    profile: 'bad',
    question:
      'What does this opioid outreach agreement say is being funded, what service or supply targets it expects, and how those targets will be delivered?',
    criteria: [
      { label: 'States that the funding supports opioid outreach and harm reduction services', weight: 4 },
      { label: 'Names the outreach-contact, naloxone, and referral targets', weight: 4 },
      { label: 'Explains that street outreach, peer workers, and referral follow-up are the delivery method', weight: 2 },
    ],
    answer:
      'The agreement supports outreach services for people dealing with substance use. It is intended to improve community response and reduce harm.',
    referenceScores: [0.65, 0.08, 0.12],
  },
  {
    id: 'opioid-outreach-mixed',
    kind: 'health',
    profile: 'mixed',
    question:
      'What does this opioid outreach agreement say is being funded, what service or supply targets it expects, and how those targets will be delivered?',
    criteria: [
      { label: 'States that the funding supports opioid outreach and harm reduction services', weight: 4 },
      { label: 'Names the outreach-contact, naloxone, and referral targets', weight: 4 },
      { label: 'Explains that street outreach, peer workers, and referral follow-up are the delivery method', weight: 2 },
    ],
    answer:
      'The agreement funds opioid outreach and harm reduction in areas with high overdose risk. It aims to increase outreach contacts, naloxone distribution, and referrals into treatment over the year. Delivery will rely on street outreach teams, peer workers, and follow-up calls after referrals are made.',
    referenceScores: [0.9, 0.45, 0.75],
  },
  {
    id: 'opioid-outreach-good',
    kind: 'health',
    profile: 'good',
    question:
      'What does this opioid outreach agreement say is being funded, what service or supply targets it expects, and how those targets will be delivered?',
    criteria: [
      { label: 'States that the funding supports opioid outreach and harm reduction services', weight: 4 },
      { label: 'Names the outreach-contact, naloxone, and referral targets', weight: 4 },
      { label: 'Explains that street outreach, peer workers, and referral follow-up are the delivery method', weight: 2 },
    ],
    answer:
      'This agreement provides $980,000 for opioid outreach and harm reduction services in the downtown and riverfront corridors. It targets 4,500 outreach contacts, 2,800 naloxone kits distributed, and 600 completed treatment referrals by December 2026. The recipient will deliver the targets through daily street outreach shifts, peer worker engagement, same-day warm handoffs to treatment providers, and weekly referral follow-up tracking.',
    referenceScores: [0.98, 0.97, 0.95],
  },
  {
    id: 'opioid-outreach-off-topic',
    kind: 'health',
    profile: 'off_topic',
    question:
      'What does this opioid outreach agreement say is being funded, what service or supply targets it expects, and how those targets will be delivered?',
    criteria: [
      { label: 'States that the funding supports opioid outreach and harm reduction services', weight: 4 },
      { label: 'Names the outreach-contact, naloxone, and referral targets', weight: 4 },
      { label: 'Explains that street outreach, peer workers, and referral follow-up are the delivery method', weight: 2 },
    ],
    answer:
      'Use a surge protector, label the power cords, and place the printer close to the router if you want fewer desk problems.',
    referenceScores: [0, 0, 0],
  },

  {
    id: 'home-care-expansion-bad',
    kind: 'health',
    profile: 'bad',
    question:
      'According to this home care expansion agreement, what is funded, what visit and caseload targets it expects, and how the provider will deliver the expansion.',
    criteria: [
      { label: 'States that the agreement funds expanded home care visits and nursing support', weight: 4 },
      { label: 'Names the visit, nurse-hire, and caseload targets', weight: 4 },
      { label: 'Explains that nurse recruitment, scheduling, and care-coordination reviews are the delivery plan', weight: 2 },
    ],
    answer:
      'The agreement funds home care improvements. The provider will use the support to expand services and improve the client experience.',
    referenceScores: [0.65, 0.08, 0.12],
  },
  {
    id: 'home-care-expansion-mixed',
    kind: 'health',
    profile: 'mixed',
    question:
      'According to this home care expansion agreement, what is funded, what visit and caseload targets it expects, and how the provider will deliver the expansion.',
    criteria: [
      { label: 'States that the agreement funds expanded home care visits and nursing support', weight: 4 },
      { label: 'Names the visit, nurse-hire, and caseload targets', weight: 4 },
      { label: 'Explains that nurse recruitment, scheduling, and care-coordination reviews are the delivery plan', weight: 2 },
    ],
    answer:
      'The agreement funds expanded home care visits and nursing support for high-needs clients. It is expected to increase service volume and reduce overloaded caseloads during the next contract year. The provider will recruit additional nurses, revise scheduling, and review care coordination weekly.',
    referenceScores: [0.9, 0.42, 0.74],
  },
  {
    id: 'home-care-expansion-good',
    kind: 'health',
    profile: 'good',
    question:
      'According to this home care expansion agreement, what is funded, what visit and caseload targets it expects, and how the provider will deliver the expansion.',
    criteria: [
      { label: 'States that the agreement funds expanded home care visits and nursing support', weight: 4 },
      { label: 'Names the visit, nurse-hire, and caseload targets', weight: 4 },
      { label: 'Explains that nurse recruitment, scheduling, and care-coordination reviews are the delivery plan', weight: 2 },
    ],
    answer:
      'This agreement provides $1.05 million to expand home care nursing and personal support visits for high-needs clients discharged from hospital. It targets 12,000 additional home visits, 8 new nurses, and average caseloads below 42 clients per nurse by March 2027. The provider will deliver the expansion through staged nurse recruitment, seven-day centralized scheduling, and weekly care-coordination reviews with hospital discharge teams.',
    referenceScores: [0.98, 0.97, 0.95],
  },
  {
    id: 'home-care-expansion-off-topic',
    kind: 'health',
    profile: 'off_topic',
    question:
      'According to this home care expansion agreement, what is funded, what visit and caseload targets it expects, and how the provider will deliver the expansion.',
    criteria: [
      { label: 'States that the agreement funds expanded home care visits and nursing support', weight: 4 },
      { label: 'Names the visit, nurse-hire, and caseload targets', weight: 4 },
      { label: 'Explains that nurse recruitment, scheduling, and care-coordination reviews are the delivery plan', weight: 2 },
    ],
    answer:
      'Sand the cabinet doors lightly, use a bonding primer, and let each coat dry fully before adding the hardware back.',
    referenceScores: [0, 0, 0],
  },

  {
    id: 'mobile-dental-clinic-bad',
    kind: 'health',
    profile: 'bad',
    question:
      'Explain this mobile dental clinic agreement: what service is funded, what screening and treatment volumes are expected, and how the service will be delivered.',
    criteria: [
      { label: 'States that the agreement funds a mobile dental clinic service', weight: 4 },
      { label: 'Names the screening, treatment, and school-site targets', weight: 4 },
      { label: 'Explains that clinic rotations, dental staff, and school scheduling deliver the work', weight: 2 },
    ],
    answer:
      'The agreement supports oral health services for children. The recipient will use the funding to improve access and reduce unmet need.',
    referenceScores: [0.65, 0.08, 0.12],
  },
  {
    id: 'mobile-dental-clinic-mixed',
    kind: 'health',
    profile: 'mixed',
    question:
      'Explain this mobile dental clinic agreement: what service is funded, what screening and treatment volumes are expected, and how the service will be delivered.',
    criteria: [
      { label: 'States that the agreement funds a mobile dental clinic service', weight: 4 },
      { label: 'Names the screening, treatment, and school-site targets', weight: 4 },
      { label: 'Explains that clinic rotations, dental staff, and school scheduling deliver the work', weight: 2 },
    ],
    answer:
      'The agreement funds a mobile dental clinic for children in schools with limited access to oral health care. It is meant to increase screenings and treatment visits over the school year. Delivery will rely on rotating clinic days, dental staff on the mobile unit, and scheduled school visits.',
    referenceScores: [0.9, 0.43, 0.74],
  },
  {
    id: 'mobile-dental-clinic-good',
    kind: 'health',
    profile: 'good',
    question:
      'Explain this mobile dental clinic agreement: what service is funded, what screening and treatment volumes are expected, and how the service will be delivered.',
    criteria: [
      { label: 'States that the agreement funds a mobile dental clinic service', weight: 4 },
      { label: 'Names the screening, treatment, and school-site targets', weight: 4 },
      { label: 'Explains that clinic rotations, dental staff, and school scheduling deliver the work', weight: 2 },
    ],
    answer:
      'This agreement provides $560,000 for a mobile dental clinic serving elementary schools in remote and low-income areas. It targets 2,200 screenings, 650 treatment visits, and 28 school sites by June 2027. Delivery will come through a mobile clinic rotation calendar, a dentist and two dental assistants on each visit, and term-by-term scheduling with participating schools.',
    referenceScores: [0.98, 0.96, 0.95],
  },
  {
    id: 'mobile-dental-clinic-off-topic',
    kind: 'health',
    profile: 'off_topic',
    question:
      'Explain this mobile dental clinic agreement: what service is funded, what screening and treatment volumes are expected, and how the service will be delivered.',
    criteria: [
      { label: 'States that the agreement funds a mobile dental clinic service', weight: 4 },
      { label: 'Names the screening, treatment, and school-site targets', weight: 4 },
      { label: 'Explains that clinic rotations, dental staff, and school scheduling deliver the work', weight: 2 },
    ],
    answer:
      'Keep the suitcase lighter by rolling each outfit, packing one neutral pair of shoes, and washing small items in the sink.',
    referenceScores: [0, 0, 0],
  },

  {
    id: 'homelessness-prevention-rent-bank-bad',
    kind: 'housing',
    profile: 'bad',
    question:
      'Summarize this homelessness prevention rent bank agreement: what is funded, what household outcomes it targets, and how the service will be delivered.',
    criteria: [
      { label: 'States that the agreement funds a rent bank and eviction-prevention service', weight: 4 },
      { label: 'Names the household, arrears, and housing-stability targets', weight: 4 },
      { label: 'Explains that grants, mediation, and case management are the delivery tools', weight: 2 },
    ],
    answer:
      'The agreement funds homelessness prevention work in the community. The organization will use the support to respond to housing pressures and improve stability.',
    referenceScores: [0.65, 0.08, 0.12],
  },
  {
    id: 'homelessness-prevention-rent-bank-mixed',
    kind: 'housing',
    profile: 'mixed',
    question:
      'Summarize this homelessness prevention rent bank agreement: what is funded, what household outcomes it targets, and how the service will be delivered.',
    criteria: [
      { label: 'States that the agreement funds a rent bank and eviction-prevention service', weight: 4 },
      { label: 'Names the household, arrears, and housing-stability targets', weight: 4 },
      { label: 'Explains that grants, mediation, and case management are the delivery tools', weight: 2 },
    ],
    answer:
      'The agreement funds a rent bank and eviction-prevention service for tenants at immediate risk of losing housing. It aims to help more households resolve arrears and stay housed this year. Delivery will include one-time grants, landlord mediation, and short-term case management.',
    referenceScores: [0.9, 0.44, 0.75],
  },
  {
    id: 'homelessness-prevention-rent-bank-good',
    kind: 'housing',
    profile: 'good',
    question:
      'Summarize this homelessness prevention rent bank agreement: what is funded, what household outcomes it targets, and how the service will be delivered.',
    criteria: [
      { label: 'States that the agreement funds a rent bank and eviction-prevention service', weight: 4 },
      { label: 'Names the household, arrears, and housing-stability targets', weight: 4 },
      { label: 'Explains that grants, mediation, and case management are the delivery tools', weight: 2 },
    ],
    answer:
      'This agreement provides $900,000 for a rent bank and eviction-prevention service for low-income tenants facing short-term arrears. It targets 420 households served, $1.1 million in arrears resolved, and 360 households still housed six months after assistance by March 2027. The service will be delivered through one-time grants, landlord mediation, housing case management, and monthly housing-stability follow-up checks.',
    referenceScores: [0.98, 0.97, 0.95],
  },
  {
    id: 'homelessness-prevention-rent-bank-off-topic',
    kind: 'housing',
    profile: 'off_topic',
    question:
      'Summarize this homelessness prevention rent bank agreement: what is funded, what household outcomes it targets, and how the service will be delivered.',
    criteria: [
      { label: 'States that the agreement funds a rent bank and eviction-prevention service', weight: 4 },
      { label: 'Names the household, arrears, and housing-stability targets', weight: 4 },
      { label: 'Explains that grants, mediation, and case management are the delivery tools', weight: 2 },
    ],
    answer:
      'Chill the dough before baking, rotate the tray halfway through, and leave the cookies on the pan for two minutes before moving them.',
    referenceScores: [0, 0, 0],
  },

  {
    id: 'shelter-expansion-bad',
    kind: 'housing',
    profile: 'bad',
    question:
      'What does this shelter expansion agreement say is being funded, what bed or client targets it sets, and how the expansion will be delivered?',
    criteria: [
      { label: 'States that the funding expands emergency shelter capacity and supports', weight: 4 },
      { label: 'Names the new-bed, occupancy, and client-service targets', weight: 4 },
      { label: 'Explains that staffing, renovations, and intake coordination are the delivery method', weight: 2 },
    ],
    answer:
      'The agreement funds shelter services. The recipient will use the money to improve access and better serve people who need temporary accommodation.',
    referenceScores: [0.65, 0.08, 0.12],
  },
  {
    id: 'shelter-expansion-mixed',
    kind: 'housing',
    profile: 'mixed',
    question:
      'What does this shelter expansion agreement say is being funded, what bed or client targets it sets, and how the expansion will be delivered?',
    criteria: [
      { label: 'States that the funding expands emergency shelter capacity and supports', weight: 4 },
      { label: 'Names the new-bed, occupancy, and client-service targets', weight: 4 },
      { label: 'Explains that staffing, renovations, and intake coordination are the delivery method', weight: 2 },
    ],
    answer:
      'The agreement funds an expansion of emergency shelter capacity and related client supports. It aims to open more beds and serve more people safely over the next year. Delivery will require space renovations, additional staffing, and coordinated intake with outreach partners.',
    referenceScores: [0.9, 0.42, 0.74],
  },
  {
    id: 'shelter-expansion-good',
    kind: 'housing',
    profile: 'good',
    question:
      'What does this shelter expansion agreement say is being funded, what bed or client targets it sets, and how the expansion will be delivered?',
    criteria: [
      { label: 'States that the funding expands emergency shelter capacity and supports', weight: 4 },
      { label: 'Names the new-bed, occupancy, and client-service targets', weight: 4 },
      { label: 'Explains that staffing, renovations, and intake coordination are the delivery method', weight: 2 },
    ],
    answer:
      'This agreement provides $1.4 million to expand emergency shelter capacity and overnight support services at the Riverside shelter. It targets 35 new beds, 90 percent average occupancy, and 780 clients served by March 2027. The expansion will be delivered through washroom and dormitory renovations, hiring 12 shelter staff, and coordinated intake with street outreach and housing navigation teams.',
    referenceScores: [0.98, 0.97, 0.95],
  },
  {
    id: 'shelter-expansion-off-topic',
    kind: 'housing',
    profile: 'off_topic',
    question:
      'What does this shelter expansion agreement say is being funded, what bed or client targets it sets, and how the expansion will be delivered?',
    criteria: [
      { label: 'States that the funding expands emergency shelter capacity and supports', weight: 4 },
      { label: 'Names the new-bed, occupancy, and client-service targets', weight: 4 },
      { label: 'Explains that staffing, renovations, and intake coordination are the delivery method', weight: 2 },
    ],
    answer:
      'Check the tire pressure when the tires are cold, rotate them every oil change, and avoid hard braking on rough roads.',
    referenceScores: [0, 0, 0],
  },

  {
    id: 'supportive-housing-tenancy-bad',
    kind: 'housing',
    profile: 'bad',
    question:
      'Explain this supportive housing tenancy agreement: what service it funds, what tenant-stability targets it expects, and how the provider will deliver those results.',
    criteria: [
      { label: 'States that the agreement funds tenancy support in supportive housing', weight: 4 },
      { label: 'Names the tenant, housing-retention, and case-plan targets', weight: 4 },
      { label: 'Explains that case management, landlord coordination, and life-skills supports are the delivery model', weight: 2 },
    ],
    answer:
      'The agreement provides support for housing stability. The service will help residents and improve the quality of support available to them.',
    referenceScores: [0.65, 0.08, 0.12],
  },
  {
    id: 'supportive-housing-tenancy-mixed',
    kind: 'housing',
    profile: 'mixed',
    question:
      'Explain this supportive housing tenancy agreement: what service it funds, what tenant-stability targets it expects, and how the provider will deliver those results.',
    criteria: [
      { label: 'States that the agreement funds tenancy support in supportive housing', weight: 4 },
      { label: 'Names the tenant, housing-retention, and case-plan targets', weight: 4 },
      { label: 'Explains that case management, landlord coordination, and life-skills supports are the delivery model', weight: 2 },
    ],
    answer:
      'The agreement funds tenancy support for residents in supportive housing who need help keeping stable accommodation. It is expected to improve housing retention and strengthen case planning over the contract year. Delivery will include case management, landlord coordination, and practical life-skills supports.',
    referenceScores: [0.9, 0.41, 0.74],
  },
  {
    id: 'supportive-housing-tenancy-good',
    kind: 'housing',
    profile: 'good',
    question:
      'Explain this supportive housing tenancy agreement: what service it funds, what tenant-stability targets it expects, and how the provider will deliver those results.',
    criteria: [
      { label: 'States that the agreement funds tenancy support in supportive housing', weight: 4 },
      { label: 'Names the tenant, housing-retention, and case-plan targets', weight: 4 },
      { label: 'Explains that case management, landlord coordination, and life-skills supports are the delivery model', weight: 2 },
    ],
    answer:
      'This agreement provides $510,000 for tenancy support to residents in three supportive housing buildings. It targets 150 tenants served, 125 tenants still housed after 12 months, and 140 completed case plans by December 2026. The provider will deliver the results through intensive case management, landlord coordination meetings, life-skills coaching, and monthly stability reviews for tenants at risk of eviction.',
    referenceScores: [0.98, 0.96, 0.95],
  },
  {
    id: 'supportive-housing-tenancy-off-topic',
    kind: 'housing',
    profile: 'off_topic',
    question:
      'Explain this supportive housing tenancy agreement: what service it funds, what tenant-stability targets it expects, and how the provider will deliver those results.',
    criteria: [
      { label: 'States that the agreement funds tenancy support in supportive housing', weight: 4 },
      { label: 'Names the tenant, housing-retention, and case-plan targets', weight: 4 },
      { label: 'Explains that case management, landlord coordination, and life-skills supports are the delivery model', weight: 2 },
    ],
    answer:
      'Soak the beans overnight, simmer them slowly with aromatics, and salt near the end so the skins stay tender.',
    referenceScores: [0, 0, 0],
  },

  {
    id: 'seniors-home-repairs-bad',
    kind: 'housing',
    profile: 'bad',
    question:
      'Summarize this seniors home repair agreement: what assistance is funded, what household or repair targets it expects, and how the repairs will be delivered.',
    criteria: [
      { label: 'States that the funding supports urgent home repairs for seniors', weight: 4 },
      { label: 'Names the household, repair, and safety-upgrade targets', weight: 4 },
      { label: 'Explains that assessments, contractor assignments, and inspection follow-ups deliver the work', weight: 2 },
    ],
    answer:
      'The agreement supports seniors in the community. The organization will use the funding to improve safety and quality of life at home.',
    referenceScores: [0.65, 0.08, 0.12],
  },
  {
    id: 'seniors-home-repairs-mixed',
    kind: 'housing',
    profile: 'mixed',
    question:
      'Summarize this seniors home repair agreement: what assistance is funded, what household or repair targets it expects, and how the repairs will be delivered.',
    criteria: [
      { label: 'States that the funding supports urgent home repairs for seniors', weight: 4 },
      { label: 'Names the household, repair, and safety-upgrade targets', weight: 4 },
      { label: 'Explains that assessments, contractor assignments, and inspection follow-ups deliver the work', weight: 2 },
    ],
    answer:
      'The agreement funds urgent home repairs and safety upgrades for low-income seniors. It is expected to help more households address dangerous conditions over the next year. Delivery will involve repair assessments, contractor assignments, and inspection follow-ups after the work is done.',
    referenceScores: [0.9, 0.43, 0.75],
  },
  {
    id: 'seniors-home-repairs-good',
    kind: 'housing',
    profile: 'good',
    question:
      'Summarize this seniors home repair agreement: what assistance is funded, what household or repair targets it expects, and how the repairs will be delivered.',
    criteria: [
      { label: 'States that the funding supports urgent home repairs for seniors', weight: 4 },
      { label: 'Names the household, repair, and safety-upgrade targets', weight: 4 },
      { label: 'Explains that assessments, contractor assignments, and inspection follow-ups deliver the work', weight: 2 },
    ],
    answer:
      'This agreement provides $460,000 for urgent home repairs and safety upgrades for low-income seniors who want to remain at home. It targets 130 households, 210 completed repairs, and 95 safety upgrades such as ramps, railings, and electrical fixes by November 2026. The service will be delivered through in-home assessments, pre-qualified contractor assignments, and post-repair inspections with a follow-up call after 30 days.',
    referenceScores: [0.98, 0.96, 0.95],
  },
  {
    id: 'seniors-home-repairs-off-topic',
    kind: 'housing',
    profile: 'off_topic',
    question:
      'Summarize this seniors home repair agreement: what assistance is funded, what household or repair targets it expects, and how the repairs will be delivered.',
    criteria: [
      { label: 'States that the funding supports urgent home repairs for seniors', weight: 4 },
      { label: 'Names the household, repair, and safety-upgrade targets', weight: 4 },
      { label: 'Explains that assessments, contractor assignments, and inspection follow-ups deliver the work', weight: 2 },
    ],
    answer:
      'Back up the photos to cloud storage, delete duplicate videos, and move large downloads off the phone if you need more space.',
    referenceScores: [0, 0, 0],
  },

  {
    id: 'newcomer-transitional-housing-bad',
    kind: 'housing',
    profile: 'bad',
    question:
      'According to this newcomer transitional housing agreement, what is being funded, what occupancy and move-out outcomes are expected, and how the service will be delivered.',
    criteria: [
      { label: 'States that the agreement funds transitional housing for newcomer families', weight: 4 },
      { label: 'Names the unit, occupancy, and permanent-housing move-out outcomes', weight: 4 },
      { label: 'Explains that case management, settlement supports, and landlord navigation are the delivery approach', weight: 2 },
    ],
    answer:
      'The agreement supports housing for newcomer families. The funding will improve stability and help people settle into the community.',
    referenceScores: [0.65, 0.08, 0.12],
  },
  {
    id: 'newcomer-transitional-housing-mixed',
    kind: 'housing',
    profile: 'mixed',
    question:
      'According to this newcomer transitional housing agreement, what is being funded, what occupancy and move-out outcomes are expected, and how the service will be delivered.',
    criteria: [
      { label: 'States that the agreement funds transitional housing for newcomer families', weight: 4 },
      { label: 'Names the unit, occupancy, and permanent-housing move-out outcomes', weight: 4 },
      { label: 'Explains that case management, settlement supports, and landlord navigation are the delivery approach', weight: 2 },
    ],
    answer:
      'The agreement funds transitional housing for newcomer families who need a place to stay while finding permanent homes. It is expected to keep units full and help more families move into longer-term housing over the year. Delivery will include housing case management, settlement supports, and landlord navigation.',
    referenceScores: [0.9, 0.43, 0.75],
  },
  {
    id: 'newcomer-transitional-housing-good',
    kind: 'housing',
    profile: 'good',
    question:
      'According to this newcomer transitional housing agreement, what is being funded, what occupancy and move-out outcomes are expected, and how the service will be delivered.',
    criteria: [
      { label: 'States that the agreement funds transitional housing for newcomer families', weight: 4 },
      { label: 'Names the unit, occupancy, and permanent-housing move-out outcomes', weight: 4 },
      { label: 'Explains that case management, settlement supports, and landlord navigation are the delivery approach', weight: 2 },
    ],
    answer:
      'This agreement provides $1.1 million for transitional housing and settlement supports for newcomer families arriving with urgent housing needs. It targets 22 furnished units, 95 percent occupancy, and 80 families moved into permanent housing by March 2027. The service will be delivered through on-site case management, settlement and school-registration support, and landlord navigation to secure permanent leases.',
    referenceScores: [0.98, 0.97, 0.95],
  },
  {
    id: 'newcomer-transitional-housing-off-topic',
    kind: 'housing',
    profile: 'off_topic',
    question:
      'According to this newcomer transitional housing agreement, what is being funded, what occupancy and move-out outcomes are expected, and how the service will be delivered.',
    criteria: [
      { label: 'States that the agreement funds transitional housing for newcomer families', weight: 4 },
      { label: 'Names the unit, occupancy, and permanent-housing move-out outcomes', weight: 4 },
      { label: 'Explains that case management, settlement supports, and landlord navigation are the delivery approach', weight: 2 },
    ],
    answer:
      'Line the baking sheet with parchment, spread the nuts in one layer, and stir halfway through roasting for even color.',
    referenceScores: [0, 0, 0],
  },

  {
    id: 'flood-resilience-culverts-bad',
    kind: 'infrastructure',
    profile: 'bad',
    question:
      'Explain this flood resilience culvert agreement: what infrastructure work is funded, what construction targets it sets, and how the municipality will deliver the project.',
    criteria: [
      { label: 'States that the agreement funds culvert replacement and flood resilience upgrades', weight: 4 },
      { label: 'Names the culvert, road, and completion targets', weight: 4 },
      { label: 'Explains that design, procurement, and staged construction are the delivery method', weight: 2 },
    ],
    answer:
      'The agreement funds infrastructure improvements related to flooding. The municipality will use the money to improve resilience and protect local roads.',
    referenceScores: [0.65, 0.08, 0.12],
  },
  {
    id: 'flood-resilience-culverts-mixed',
    kind: 'infrastructure',
    profile: 'mixed',
    question:
      'Explain this flood resilience culvert agreement: what infrastructure work is funded, what construction targets it sets, and how the municipality will deliver the project.',
    criteria: [
      { label: 'States that the agreement funds culvert replacement and flood resilience upgrades', weight: 4 },
      { label: 'Names the culvert, road, and completion targets', weight: 4 },
      { label: 'Explains that design, procurement, and staged construction are the delivery method', weight: 2 },
    ],
    answer:
      'The agreement funds culvert replacement and related flood resilience work on rural roads. It is expected to complete several upgrades and reduce washout risk over the construction season. The municipality will deliver the project through engineering design, procurement, and staged road construction.',
    referenceScores: [0.9, 0.42, 0.73],
  },
  {
    id: 'flood-resilience-culverts-good',
    kind: 'infrastructure',
    profile: 'good',
    question:
      'Explain this flood resilience culvert agreement: what infrastructure work is funded, what construction targets it sets, and how the municipality will deliver the project.',
    criteria: [
      { label: 'States that the agreement funds culvert replacement and flood resilience upgrades', weight: 4 },
      { label: 'Names the culvert, road, and completion targets', weight: 4 },
      { label: 'Explains that design, procurement, and staged construction are the delivery method', weight: 2 },
    ],
    answer:
      'This agreement provides $2.6 million for culvert replacement and flood resilience upgrades on the North Valley road network. It targets 9 culvert replacements, 4.2 kilometres of adjacent road restoration, and project completion by October 2026. The municipality will deliver the work through detailed engineering design, competitive procurement, staged summer construction, and post-installation inspections after major storm events.',
    referenceScores: [0.98, 0.97, 0.95],
  },
  {
    id: 'flood-resilience-culverts-off-topic',
    kind: 'infrastructure',
    profile: 'off_topic',
    question:
      'Explain this flood resilience culvert agreement: what infrastructure work is funded, what construction targets it sets, and how the municipality will deliver the project.',
    criteria: [
      { label: 'States that the agreement funds culvert replacement and flood resilience upgrades', weight: 4 },
      { label: 'Names the culvert, road, and completion targets', weight: 4 },
      { label: 'Explains that design, procurement, and staged construction are the delivery method', weight: 2 },
    ],
    answer:
      'Switch the meeting to 25 minutes, send the agenda first, and close with one owner per action item if you want shorter calls.',
    referenceScores: [0, 0, 0],
  },

  {
    id: 'clean-water-monitoring-bad',
    kind: 'infrastructure',
    profile: 'bad',
    question:
      'Summarize this clean water monitoring agreement: what is funded, what sampling and reporting targets are expected, and how the work will be delivered.',
    criteria: [
      { label: 'States that the agreement funds clean water monitoring and reporting', weight: 4 },
      { label: 'Names the sampling, reporting, and site coverage targets', weight: 4 },
      { label: 'Explains that field sampling, lab analysis, and public reporting are the delivery plan', weight: 2 },
    ],
    answer:
      'The agreement supports water quality work in the region. The recipient will use the funding to improve environmental monitoring and respond to local concerns.',
    referenceScores: [0.65, 0.08, 0.12],
  },
  {
    id: 'clean-water-monitoring-mixed',
    kind: 'infrastructure',
    profile: 'mixed',
    question:
      'Summarize this clean water monitoring agreement: what is funded, what sampling and reporting targets are expected, and how the work will be delivered.',
    criteria: [
      { label: 'States that the agreement funds clean water monitoring and reporting', weight: 4 },
      { label: 'Names the sampling, reporting, and site coverage targets', weight: 4 },
      { label: 'Explains that field sampling, lab analysis, and public reporting are the delivery plan', weight: 2 },
    ],
    answer:
      'The agreement funds clean water monitoring in rivers and community wells. It is meant to increase sampling coverage and produce regular reporting over the contract term. Delivery will involve field sampling, laboratory analysis, and public reports on the findings.',
    referenceScores: [0.9, 0.42, 0.74],
  },
  {
    id: 'clean-water-monitoring-good',
    kind: 'infrastructure',
    profile: 'good',
    question:
      'Summarize this clean water monitoring agreement: what is funded, what sampling and reporting targets are expected, and how the work will be delivered.',
    criteria: [
      { label: 'States that the agreement funds clean water monitoring and reporting', weight: 4 },
      { label: 'Names the sampling, reporting, and site coverage targets', weight: 4 },
      { label: 'Explains that field sampling, lab analysis, and public reporting are the delivery plan', weight: 2 },
    ],
    answer:
      'This agreement provides $780,000 for clean water monitoring across the South Fork watershed and 12 community wells. It targets 1,440 water samples, 12 quarterly public reports, and complete monitoring coverage at 18 priority sites by March 2027. The work will be delivered through monthly field sampling, contracted lab analysis, and public dashboard updates reviewed each quarter with municipal partners.',
    referenceScores: [0.98, 0.96, 0.95],
  },
  {
    id: 'clean-water-monitoring-off-topic',
    kind: 'infrastructure',
    profile: 'off_topic',
    question:
      'Summarize this clean water monitoring agreement: what is funded, what sampling and reporting targets are expected, and how the work will be delivered.',
    criteria: [
      { label: 'States that the agreement funds clean water monitoring and reporting', weight: 4 },
      { label: 'Names the sampling, reporting, and site coverage targets', weight: 4 },
      { label: 'Explains that field sampling, lab analysis, and public reporting are the delivery plan', weight: 2 },
    ],
    answer:
      'Use a larger font, increase line spacing, and keep each slide to one idea if you want easier presentations.',
    referenceScores: [0, 0, 0],
  },

  {
    id: 'microtransit-pilot-bad',
    kind: 'infrastructure',
    profile: 'bad',
    question:
      'According to this microtransit pilot agreement, what service is funded, what ridership or service targets it expects, and how the pilot will be delivered.',
    criteria: [
      { label: 'States that the agreement funds a microtransit pilot service', weight: 4 },
      { label: 'Names the service-hours, trip, and rider targets', weight: 4 },
      { label: 'Explains that vehicles, booking software, and operating schedules are the delivery method', weight: 2 },
    ],
    answer:
      'The agreement supports local transit improvements. The municipality will use the funding to improve service and make travel easier for residents.',
    referenceScores: [0.65, 0.08, 0.12],
  },
  {
    id: 'microtransit-pilot-mixed',
    kind: 'infrastructure',
    profile: 'mixed',
    question:
      'According to this microtransit pilot agreement, what service is funded, what ridership or service targets it expects, and how the pilot will be delivered.',
    criteria: [
      { label: 'States that the agreement funds a microtransit pilot service', weight: 4 },
      { label: 'Names the service-hours, trip, and rider targets', weight: 4 },
      { label: 'Explains that vehicles, booking software, and operating schedules are the delivery method', weight: 2 },
    ],
    answer:
      'The agreement funds a microtransit pilot in low-density areas with limited fixed-route transit. It is expected to increase trip availability and attract more riders during the pilot period. Delivery will use dedicated vehicles, app-based booking software, and scheduled operating hours.',
    referenceScores: [0.9, 0.43, 0.74],
  },
  {
    id: 'microtransit-pilot-good',
    kind: 'infrastructure',
    profile: 'good',
    question:
      'According to this microtransit pilot agreement, what service is funded, what ridership or service targets it expects, and how the pilot will be delivered.',
    criteria: [
      { label: 'States that the agreement funds a microtransit pilot service', weight: 4 },
      { label: 'Names the service-hours, trip, and rider targets', weight: 4 },
      { label: 'Explains that vehicles, booking software, and operating schedules are the delivery method', weight: 2 },
    ],
    answer:
      'This agreement provides $1.8 million for a two-zone microtransit pilot serving suburban and rural edge communities. It targets 8,400 service hours, 52,000 completed trips, and 3,200 unique riders by December 2027. The pilot will be delivered through six accessible vehicles, app and phone booking software, and operating schedules aligned with commuter peaks and hospital appointments.',
    referenceScores: [0.98, 0.97, 0.95],
  },
  {
    id: 'microtransit-pilot-off-topic',
    kind: 'infrastructure',
    profile: 'off_topic',
    question:
      'According to this microtransit pilot agreement, what service is funded, what ridership or service targets it expects, and how the pilot will be delivered.',
    criteria: [
      { label: 'States that the agreement funds a microtransit pilot service', weight: 4 },
      { label: 'Names the service-hours, trip, and rider targets', weight: 4 },
      { label: 'Explains that vehicles, booking software, and operating schedules are the delivery method', weight: 2 },
    ],
    answer:
      'Open the windows for ten minutes, wipe the shower after use, and run the fan longer if you want less bathroom mould.',
    referenceScores: [0, 0, 0],
  },

  {
    id: 'farm-irrigation-upgrades-bad',
    kind: 'infrastructure',
    profile: 'bad',
    question:
      'Explain this farm irrigation upgrade agreement: what work it funds, what installation outcomes it sets, and how the upgrades will be delivered.',
    criteria: [
      { label: 'States that the agreement funds irrigation efficiency upgrades on farms', weight: 4 },
      { label: 'Names the farm, equipment, and water-savings targets', weight: 4 },
      { label: 'Explains that assessments, equipment installation, and producer training deliver the work', weight: 2 },
    ],
    answer:
      'The agreement funds agricultural improvements. The recipient will use the support to improve water management and strengthen farm operations.',
    referenceScores: [0.65, 0.08, 0.12],
  },
  {
    id: 'farm-irrigation-upgrades-mixed',
    kind: 'infrastructure',
    profile: 'mixed',
    question:
      'Explain this farm irrigation upgrade agreement: what work it funds, what installation outcomes it sets, and how the upgrades will be delivered.',
    criteria: [
      { label: 'States that the agreement funds irrigation efficiency upgrades on farms', weight: 4 },
      { label: 'Names the farm, equipment, and water-savings targets', weight: 4 },
      { label: 'Explains that assessments, equipment installation, and producer training deliver the work', weight: 2 },
    ],
    answer:
      'The agreement funds irrigation efficiency upgrades for farms facing water constraints. It is expected to support more equipment installations and reduce water use over the project period. Delivery will include site assessments, installation of upgraded systems, and training for producers on operating the equipment.',
    referenceScores: [0.9, 0.42, 0.74],
  },
  {
    id: 'farm-irrigation-upgrades-good',
    kind: 'infrastructure',
    profile: 'good',
    question:
      'Explain this farm irrigation upgrade agreement: what work it funds, what installation outcomes it sets, and how the upgrades will be delivered.',
    criteria: [
      { label: 'States that the agreement funds irrigation efficiency upgrades on farms', weight: 4 },
      { label: 'Names the farm, equipment, and water-savings targets', weight: 4 },
      { label: 'Explains that assessments, equipment installation, and producer training deliver the work', weight: 2 },
    ],
    answer:
      'This agreement provides $1.35 million for irrigation efficiency upgrades on 40 fruit and vegetable farms. It targets 40 irrigation assessments, 85 new control valves and sensors, and an estimated 18 percent reduction in seasonal water use by October 2027. Delivery will be handled through on-farm assessments, equipment installation by certified contractors, and producer training on scheduling and monitoring water use.',
    referenceScores: [0.98, 0.97, 0.95],
  },
  {
    id: 'farm-irrigation-upgrades-off-topic',
    kind: 'infrastructure',
    profile: 'off_topic',
    question:
      'Explain this farm irrigation upgrade agreement: what work it funds, what installation outcomes it sets, and how the upgrades will be delivered.',
    criteria: [
      { label: 'States that the agreement funds irrigation efficiency upgrades on farms', weight: 4 },
      { label: 'Names the farm, equipment, and water-savings targets', weight: 4 },
      { label: 'Explains that assessments, equipment installation, and producer training deliver the work', weight: 2 },
    ],
    answer:
      'Walk for five minutes every hour, raise the laptop screen, and keep the keyboard lower if your neck feels stiff at work.',
    referenceScores: [0, 0, 0],
  },

  {
    id: 'wildfire-preparedness-bad',
    kind: 'infrastructure',
    profile: 'bad',
    question:
      'Summarize this wildfire preparedness agreement: what activities are funded, what mitigation targets it sets, and how the work will be delivered.',
    criteria: [
      { label: 'States that the agreement funds wildfire preparedness and mitigation work', weight: 4 },
      { label: 'Names the property, fuel-break, or volunteer targets', weight: 4 },
      { label: 'Explains that crews, training, and coordination with fire services deliver the work', weight: 2 },
    ],
    answer:
      'The agreement supports wildfire preparedness in the region. The funding will improve readiness and strengthen local capacity ahead of future fire seasons.',
    referenceScores: [0.65, 0.08, 0.12],
  },
  {
    id: 'wildfire-preparedness-mixed',
    kind: 'infrastructure',
    profile: 'mixed',
    question:
      'Summarize this wildfire preparedness agreement: what activities are funded, what mitigation targets it sets, and how the work will be delivered.',
    criteria: [
      { label: 'States that the agreement funds wildfire preparedness and mitigation work', weight: 4 },
      { label: 'Names the property, fuel-break, or volunteer targets', weight: 4 },
      { label: 'Explains that crews, training, and coordination with fire services deliver the work', weight: 2 },
    ],
    answer:
      'The agreement funds wildfire preparedness and mitigation activities in high-risk communities. It is expected to expand mitigation coverage and train more people before the next fire season. Delivery will rely on field crews, volunteer training, and coordination with local fire services.',
    referenceScores: [0.9, 0.43, 0.74],
  },
  {
    id: 'wildfire-preparedness-good',
    kind: 'infrastructure',
    profile: 'good',
    question:
      'Summarize this wildfire preparedness agreement: what activities are funded, what mitigation targets it sets, and how the work will be delivered.',
    criteria: [
      { label: 'States that the agreement funds wildfire preparedness and mitigation work', weight: 4 },
      { label: 'Names the property, fuel-break, or volunteer targets', weight: 4 },
      { label: 'Explains that crews, training, and coordination with fire services deliver the work', weight: 2 },
    ],
    answer:
      'This agreement provides $970,000 for wildfire preparedness and mitigation in five forest-edge communities. It targets 320 property assessments, 48 kilometres of fuel-break maintenance, and 180 trained community volunteers by June 2027. The work will be delivered through mitigation field crews, volunteer training weekends, and coordination meetings with municipal and regional fire services before and during the fire season.',
    referenceScores: [0.98, 0.97, 0.95],
  },
  {
    id: 'wildfire-preparedness-off-topic',
    kind: 'infrastructure',
    profile: 'off_topic',
    question:
      'Summarize this wildfire preparedness agreement: what activities are funded, what mitigation targets it sets, and how the work will be delivered.',
    criteria: [
      { label: 'States that the agreement funds wildfire preparedness and mitigation work', weight: 4 },
      { label: 'Names the property, fuel-break, or volunteer targets', weight: 4 },
      { label: 'Explains that crews, training, and coordination with fire services deliver the work', weight: 2 },
    ],
    answer:
      'Blend the soup in batches, add acid at the end, and keep a little cooking liquid back so you can adjust the thickness.',
    referenceScores: [0, 0, 0],
  },

  {
    id: 'indigenous-language-nests-bad',
    kind: 'community',
    profile: 'bad',
    question:
      'Explain this Indigenous language nest agreement: what is funded, what learner or session targets it expects, and how the language work will be delivered.',
    criteria: [
      { label: 'States that the agreement funds Indigenous language nests and revitalization activity', weight: 4 },
      { label: 'Names the learner, session, and mentor targets', weight: 4 },
      { label: 'Explains that fluent speakers, immersion sessions, and resource creation are the delivery approach', weight: 2 },
    ],
    answer:
      'The agreement supports language revitalization in the community. The organization will use the funding to strengthen culture and help people learn together.',
    referenceScores: [0.65, 0.08, 0.12],
  },
  {
    id: 'indigenous-language-nests-mixed',
    kind: 'community',
    profile: 'mixed',
    question:
      'Explain this Indigenous language nest agreement: what is funded, what learner or session targets it expects, and how the language work will be delivered.',
    criteria: [
      { label: 'States that the agreement funds Indigenous language nests and revitalization activity', weight: 4 },
      { label: 'Names the learner, session, and mentor targets', weight: 4 },
      { label: 'Explains that fluent speakers, immersion sessions, and resource creation are the delivery approach', weight: 2 },
    ],
    answer:
      'The agreement funds Indigenous language nests for young children and families. It aims to expand immersion learning and support more fluent speaker involvement over the year. Delivery will rely on fluent speakers, regular immersion sessions, and culturally grounded learning resources.',
    referenceScores: [0.9, 0.43, 0.75],
  },
  {
    id: 'indigenous-language-nests-good',
    kind: 'community',
    profile: 'good',
    question:
      'Explain this Indigenous language nest agreement: what is funded, what learner or session targets it expects, and how the language work will be delivered.',
    criteria: [
      { label: 'States that the agreement funds Indigenous language nests and revitalization activity', weight: 4 },
      { label: 'Names the learner, session, and mentor targets', weight: 4 },
      { label: 'Explains that fluent speakers, immersion sessions, and resource creation are the delivery approach', weight: 2 },
    ],
    answer:
      'This agreement provides $520,000 for Indigenous language nests serving preschool children, parents, and caregivers in two communities. It targets 80 regular learners, 220 immersion sessions, and 16 fluent speaker mentors by March 2027. The work will be delivered through daily language nest sessions, mentor-led family immersion circles, and creation of recorded stories and teaching resources in the language.',
    referenceScores: [0.98, 0.96, 0.95],
  },
  {
    id: 'indigenous-language-nests-off-topic',
    kind: 'community',
    profile: 'off_topic',
    question:
      'Explain this Indigenous language nest agreement: what is funded, what learner or session targets it expects, and how the language work will be delivered.',
    criteria: [
      { label: 'States that the agreement funds Indigenous language nests and revitalization activity', weight: 4 },
      { label: 'Names the learner, session, and mentor targets', weight: 4 },
      { label: 'Explains that fluent speakers, immersion sessions, and resource creation are the delivery approach', weight: 2 },
    ],
    answer:
      'Lower the water temperature, use a gentler detergent, and air-dry the sweater flat if you want it to keep its shape.',
    referenceScores: [0, 0, 0],
  },

  {
    id: 'afterschool-stem-bad',
    kind: 'community',
    profile: 'bad',
    question:
      'Summarize this after-school STEM agreement: what program is funded, what student participation results it sets, and how the program will be delivered.',
    criteria: [
      { label: 'States that the agreement funds an after-school STEM program', weight: 4 },
      { label: 'Names the student, club, and attendance targets', weight: 4 },
      { label: 'Explains that clubs, facilitators, and school partnerships are the delivery method', weight: 2 },
    ],
    answer:
      'The agreement supports educational programming for students. The recipient will use the funding to improve learning opportunities after school.',
    referenceScores: [0.65, 0.08, 0.12],
  },
  {
    id: 'afterschool-stem-mixed',
    kind: 'community',
    profile: 'mixed',
    question:
      'Summarize this after-school STEM agreement: what program is funded, what student participation results it sets, and how the program will be delivered.',
    criteria: [
      { label: 'States that the agreement funds an after-school STEM program', weight: 4 },
      { label: 'Names the student, club, and attendance targets', weight: 4 },
      { label: 'Explains that clubs, facilitators, and school partnerships are the delivery method', weight: 2 },
    ],
    answer:
      'The agreement funds an after-school STEM program for middle-school students. It is expected to expand participation and improve regular attendance at clubs during the school year. Delivery will include school-based clubs, trained facilitators, and partnerships with participating schools.',
    referenceScores: [0.9, 0.42, 0.74],
  },
  {
    id: 'afterschool-stem-good',
    kind: 'community',
    profile: 'good',
    question:
      'Summarize this after-school STEM agreement: what program is funded, what student participation results it sets, and how the program will be delivered.',
    criteria: [
      { label: 'States that the agreement funds an after-school STEM program', weight: 4 },
      { label: 'Names the student, club, and attendance targets', weight: 4 },
      { label: 'Explains that clubs, facilitators, and school partnerships are the delivery method', weight: 2 },
    ],
    answer:
      'This agreement provides $410,000 for an after-school STEM program in eight middle schools. It targets 24 club sections, 360 student participants, and an average attendance rate of 75 percent by June 2027. The program will be delivered through weekly clubs led by trained facilitators, equipment kits for each site, and school partnerships that handle student recruitment and room scheduling.',
    referenceScores: [0.98, 0.96, 0.95],
  },
  {
    id: 'afterschool-stem-off-topic',
    kind: 'community',
    profile: 'off_topic',
    question:
      'Summarize this after-school STEM agreement: what program is funded, what student participation results it sets, and how the program will be delivered.',
    criteria: [
      { label: 'States that the agreement funds an after-school STEM program', weight: 4 },
      { label: 'Names the student, club, and attendance targets', weight: 4 },
      { label: 'Explains that clubs, facilitators, and school partnerships are the delivery method', weight: 2 },
    ],
    answer:
      'Store the herbs upright in a jar with a little water, cover loosely with a bag, and trim the stems every few days.',
    referenceScores: [0, 0, 0],
  },

  {
    id: 'public-library-digital-inclusion-bad',
    kind: 'community',
    profile: 'bad',
    question:
      'What does this public library digital inclusion agreement say is funded, what usage or training targets it expects, and how the library will deliver the work?',
    criteria: [
      { label: 'States that the agreement funds digital inclusion through the public library', weight: 4 },
      { label: 'Names the device-loan, training, and user targets', weight: 4 },
      { label: 'Explains that lending, classes, and staff support are the delivery method', weight: 2 },
    ],
    answer:
      'The agreement supports digital access in the community. The library will use the funding to improve services and help people get online.',
    referenceScores: [0.65, 0.08, 0.12],
  },
  {
    id: 'public-library-digital-inclusion-mixed',
    kind: 'community',
    profile: 'mixed',
    question:
      'What does this public library digital inclusion agreement say is funded, what usage or training targets it expects, and how the library will deliver the work?',
    criteria: [
      { label: 'States that the agreement funds digital inclusion through the public library', weight: 4 },
      { label: 'Names the device-loan, training, and user targets', weight: 4 },
      { label: 'Explains that lending, classes, and staff support are the delivery method', weight: 2 },
    ],
    answer:
      'The agreement funds digital inclusion work through the public library, including device access and digital skills support. It is meant to expand lending and reach more learners over the agreement year. Delivery will include device loans, training classes, and staff support for users who need help.',
    referenceScores: [0.9, 0.42, 0.74],
  },
  {
    id: 'public-library-digital-inclusion-good',
    kind: 'community',
    profile: 'good',
    question:
      'What does this public library digital inclusion agreement say is funded, what usage or training targets it expects, and how the library will deliver the work?',
    criteria: [
      { label: 'States that the agreement funds digital inclusion through the public library', weight: 4 },
      { label: 'Names the device-loan, training, and user targets', weight: 4 },
      { label: 'Explains that lending, classes, and staff support are the delivery method', weight: 2 },
    ],
    answer:
      'This agreement provides $360,000 for digital inclusion through the public library system. It targets 260 device loans, 110 digital skills classes, and 1,400 unique users supported by March 2027. The library will deliver the work through laptop and hotspot lending, scheduled beginner classes, and one-on-one staff support at branch help desks.',
    referenceScores: [0.98, 0.96, 0.95],
  },
  {
    id: 'public-library-digital-inclusion-off-topic',
    kind: 'community',
    profile: 'off_topic',
    question:
      'What does this public library digital inclusion agreement say is funded, what usage or training targets it expects, and how the library will deliver the work?',
    criteria: [
      { label: 'States that the agreement funds digital inclusion through the public library', weight: 4 },
      { label: 'Names the device-loan, training, and user targets', weight: 4 },
      { label: 'Explains that lending, classes, and staff support are the delivery method', weight: 2 },
    ],
    answer:
      'Freeze the berries in a single layer first, then bag them, and add them to smoothies while still frozen.',
    referenceScores: [0, 0, 0],
  },

  {
    id: 'food-security-breakfast-bad',
    kind: 'community',
    profile: 'bad',
    question:
      'Explain this school breakfast agreement: what is funded, what meal or student targets it expects, and how the service will be delivered.',
    criteria: [
      { label: 'States that the agreement funds a school breakfast or food security program', weight: 4 },
      { label: 'Names the meal, school, and student targets', weight: 4 },
      { label: 'Explains that food purchasing, school distribution, and volunteer or staff coordination deliver the work', weight: 2 },
    ],
    answer:
      'The agreement supports food security for students. The organization will use the funding to improve access to meals and reduce hunger at school.',
    referenceScores: [0.65, 0.08, 0.12],
  },
  {
    id: 'food-security-breakfast-mixed',
    kind: 'community',
    profile: 'mixed',
    question:
      'Explain this school breakfast agreement: what is funded, what meal or student targets it expects, and how the service will be delivered.',
    criteria: [
      { label: 'States that the agreement funds a school breakfast or food security program', weight: 4 },
      { label: 'Names the meal, school, and student targets', weight: 4 },
      { label: 'Explains that food purchasing, school distribution, and volunteer or staff coordination deliver the work', weight: 2 },
    ],
    answer:
      'The agreement funds a school breakfast program for students in neighbourhoods with higher food insecurity. It is expected to increase meal access and reach more students over the school year. Delivery will include food purchasing, school distribution, and staff and volunteer coordination at participating sites.',
    referenceScores: [0.9, 0.43, 0.74],
  },
  {
    id: 'food-security-breakfast-good',
    kind: 'community',
    profile: 'good',
    question:
      'Explain this school breakfast agreement: what is funded, what meal or student targets it expects, and how the service will be delivered.',
    criteria: [
      { label: 'States that the agreement funds a school breakfast or food security program', weight: 4 },
      { label: 'Names the meal, school, and student targets', weight: 4 },
      { label: 'Explains that food purchasing, school distribution, and volunteer or staff coordination deliver the work', weight: 2 },
    ],
    answer:
      'This agreement provides $500,000 for a school breakfast program in 14 elementary schools. It targets 280,000 breakfasts served, 3,200 regular student users, and full program operation at all 14 sites by June 2027. The service will be delivered through centralized food purchasing, weekly distribution to schools, and on-site coordination by school staff and community volunteers.',
    referenceScores: [0.98, 0.97, 0.95],
  },
  {
    id: 'food-security-breakfast-off-topic',
    kind: 'community',
    profile: 'off_topic',
    question:
      'Explain this school breakfast agreement: what is funded, what meal or student targets it expects, and how the service will be delivered.',
    criteria: [
      { label: 'States that the agreement funds a school breakfast or food security program', weight: 4 },
      { label: 'Names the meal, school, and student targets', weight: 4 },
      { label: 'Explains that food purchasing, school distribution, and volunteer or staff coordination deliver the work', weight: 2 },
    ],
    answer:
      'Set the camera to aperture priority, keep the shutter speed up, and stand with the sun off to one side for better portraits.',
    referenceScores: [0, 0, 0],
  },

  {
    id: 'community-arts-training-bad',
    kind: 'community',
    profile: 'bad',
    question:
      'Summarize this community arts training agreement: what is funded, what participant or production targets it sets, and how the training will be delivered.',
    criteria: [
      { label: 'States that the agreement funds community arts training and creation activity', weight: 4 },
      { label: 'Names the participant, workshop, and showcase targets', weight: 4 },
      { label: 'Explains that artist instructors, workshops, and showcase preparation deliver the work', weight: 2 },
    ],
    answer:
      'The agreement supports arts programming in the community. The organization will use the funding to expand opportunities and encourage participation.',
    referenceScores: [0.65, 0.08, 0.12],
  },
  {
    id: 'community-arts-training-mixed',
    kind: 'community',
    profile: 'mixed',
    question:
      'Summarize this community arts training agreement: what is funded, what participant or production targets it sets, and how the training will be delivered.',
    criteria: [
      { label: 'States that the agreement funds community arts training and creation activity', weight: 4 },
      { label: 'Names the participant, workshop, and showcase targets', weight: 4 },
      { label: 'Explains that artist instructors, workshops, and showcase preparation deliver the work', weight: 2 },
    ],
    answer:
      'The agreement funds community arts training for youth and emerging artists. It aims to increase participation and support more public showcases over the agreement period. Delivery will involve artist instructors, workshop series, and preparation for final showcases.',
    referenceScores: [0.9, 0.42, 0.74],
  },
  {
    id: 'community-arts-training-good',
    kind: 'community',
    profile: 'good',
    question:
      'Summarize this community arts training agreement: what is funded, what participant or production targets it sets, and how the training will be delivered.',
    criteria: [
      { label: 'States that the agreement funds community arts training and creation activity', weight: 4 },
      { label: 'Names the participant, workshop, and showcase targets', weight: 4 },
      { label: 'Explains that artist instructors, workshops, and showcase preparation deliver the work', weight: 2 },
    ],
    answer:
      'This agreement provides $390,000 for community arts training in music, mural design, and digital storytelling. It targets 180 participants, 72 workshops, and 6 public showcases by February 2027. The training will be delivered through paid artist instructors, weekly workshop series, and showcase preparation sessions that culminate in public exhibitions and performances.',
    referenceScores: [0.98, 0.96, 0.95],
  },
  {
    id: 'community-arts-training-off-topic',
    kind: 'community',
    profile: 'off_topic',
    question:
      'Summarize this community arts training agreement: what is funded, what participant or production targets it sets, and how the training will be delivered.',
    criteria: [
      { label: 'States that the agreement funds community arts training and creation activity', weight: 4 },
      { label: 'Names the participant, workshop, and showcase targets', weight: 4 },
      { label: 'Explains that artist instructors, workshops, and showcase preparation deliver the work', weight: 2 },
    ],
    answer:
      'Keep the receipts in one envelope, review them weekly, and separate fixed costs from impulse purchases if you are trying to budget better.',
    referenceScores: [0, 0, 0],
  },
]

if (BENCHMARK_CASES.length !== 100) {
  throw new Error(`Expected 100 benchmark cases, received ${BENCHMARK_CASES.length}.`)
}
