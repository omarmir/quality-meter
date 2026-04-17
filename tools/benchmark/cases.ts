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
  {
    id: 'midcareer-reskilling-bad',
    kind: 'workforce',
    profile: 'bad',
    question:
      'Summarize this mid-career reskilling agreement: what training is funded, what completion or job-transition targets it expects, and how the program will be delivered.',
    criteria: [
      { label: 'States that the agreement funds mid-career reskilling training', weight: 4 },
      { label: 'Names the learner, credential, and job-transition targets', weight: 4 },
      { label: 'Explains that cohorts, coaching, and employer projects deliver the training', weight: 2 },
    ],
    answer:
      'The agreement supports reskilling for adults who need new work opportunities. The recipient will use the funding to improve training access and help people transition into stronger careers.',
    referenceScores: [0.65, 0.08, 0.12],
  },
  {
    id: 'midcareer-reskilling-mixed',
    kind: 'workforce',
    profile: 'mixed',
    question:
      'Summarize this mid-career reskilling agreement: what training is funded, what completion or job-transition targets it expects, and how the program will be delivered.',
    criteria: [
      { label: 'States that the agreement funds mid-career reskilling training', weight: 4 },
      { label: 'Names the learner, credential, and job-transition targets', weight: 4 },
      { label: 'Explains that cohorts, coaching, and employer projects deliver the training', weight: 2 },
    ],
    answer:
      'The agreement funds mid-career reskilling for adults moving out of declining industries. It aims to help more learners complete short credentials and move into new jobs this year. Delivery will use instructor-led cohorts, career coaching, and employer-backed project work.',
    referenceScores: [0.9, 0.43, 0.74],
  },
  {
    id: 'midcareer-reskilling-good',
    kind: 'workforce',
    profile: 'good',
    question:
      'Summarize this mid-career reskilling agreement: what training is funded, what completion or job-transition targets it expects, and how the program will be delivered.',
    criteria: [
      { label: 'States that the agreement funds mid-career reskilling training', weight: 4 },
      { label: 'Names the learner, credential, and job-transition targets', weight: 4 },
      { label: 'Explains that cohorts, coaching, and employer projects deliver the training', weight: 2 },
    ],
    answer:
      'This agreement provides $880,000 for mid-career reskilling in logistics, bookkeeping, and industrial maintenance. It targets 260 learners, 210 completed credentials, and 140 job transitions by May 2027. The program will be delivered through twelve-week training cohorts, individual coaching, and employer-sponsored applied projects tied to current openings.',
    referenceScores: [0.98, 0.96, 0.95],
  },
  {
    id: 'midcareer-reskilling-off-topic',
    kind: 'workforce',
    profile: 'off_topic',
    question:
      'Summarize this mid-career reskilling agreement: what training is funded, what completion or job-transition targets it expects, and how the program will be delivered.',
    criteria: [
      { label: 'States that the agreement funds mid-career reskilling training', weight: 4 },
      { label: 'Names the learner, credential, and job-transition targets', weight: 4 },
      { label: 'Explains that cohorts, coaching, and employer projects deliver the training', weight: 2 },
    ],
    answer:
      'Rinse the rice until the water runs clear, toast it briefly in oil, and rest it covered after simmering if you want fluffier grains.',
    referenceScores: [0, 0, 0],
  },
  {
    id: 'childcare-workforce-training-bad',
    kind: 'workforce',
    profile: 'bad',
    question:
      'What does this childcare workforce training agreement fund, what certification or retention targets it sets, and how the training will be delivered?',
    criteria: [
      { label: 'States that the agreement funds childcare workforce training', weight: 4 },
      { label: 'Names the trainee, certification, and retention targets', weight: 4 },
      { label: 'Explains that courses, practicum support, and mentoring deliver the work', weight: 2 },
    ],
    answer:
      'The agreement supports training for childcare workers. The organization will use the funding to improve the workforce and strengthen service quality over time.',
    referenceScores: [0.65, 0.08, 0.12],
  },
  {
    id: 'childcare-workforce-training-mixed',
    kind: 'workforce',
    profile: 'mixed',
    question:
      'What does this childcare workforce training agreement fund, what certification or retention targets it sets, and how the training will be delivered?',
    criteria: [
      { label: 'States that the agreement funds childcare workforce training', weight: 4 },
      { label: 'Names the trainee, certification, and retention targets', weight: 4 },
      { label: 'Explains that courses, practicum support, and mentoring deliver the work', weight: 2 },
    ],
    answer:
      'The agreement funds childcare workforce training for new and returning early-years educators. It aims to increase certifications and keep more trainees in licensed care settings over the contract term. Delivery will include evening courses, practicum support, and mentoring from experienced supervisors.',
    referenceScores: [0.9, 0.43, 0.74],
  },
  {
    id: 'childcare-workforce-training-good',
    kind: 'workforce',
    profile: 'good',
    question:
      'What does this childcare workforce training agreement fund, what certification or retention targets it sets, and how the training will be delivered?',
    criteria: [
      { label: 'States that the agreement funds childcare workforce training', weight: 4 },
      { label: 'Names the trainee, certification, and retention targets', weight: 4 },
      { label: 'Explains that courses, practicum support, and mentoring deliver the work', weight: 2 },
    ],
    answer:
      'This agreement provides $670,000 for childcare workforce training across six licensed providers. It targets 140 trainees, 110 completed certifications, and 85 trainees retained in licensed childcare jobs after six months by March 2027. Delivery will come through evening coursework, paid practicum support, and mentor matching with senior educators.',
    referenceScores: [0.98, 0.96, 0.95],
  },
  {
    id: 'childcare-workforce-training-off-topic',
    kind: 'workforce',
    profile: 'off_topic',
    question:
      'What does this childcare workforce training agreement fund, what certification or retention targets it sets, and how the training will be delivered?',
    criteria: [
      { label: 'States that the agreement funds childcare workforce training', weight: 4 },
      { label: 'Names the trainee, certification, and retention targets', weight: 4 },
      { label: 'Explains that courses, practicum support, and mentoring deliver the work', weight: 2 },
    ],
    answer:
      'Keep the charger by the bed, turn on low power mode earlier, and stop leaving video apps open in the background if the phone dies before dinner.',
    referenceScores: [0, 0, 0],
  },
  {
    id: 'indigenous-remote-workforce-bad',
    kind: 'workforce',
    profile: 'bad',
    question:
      'Explain this Indigenous remote workforce agreement: what employment support is funded, what placement targets it expects, and how the service will be delivered.',
    criteria: [
      { label: 'States that the agreement funds employment support for Indigenous job seekers in remote communities', weight: 4 },
      { label: 'Names the participant, placement, and employer-partnership targets', weight: 4 },
      { label: 'Explains that community coaching, travel support, and employer coordination deliver the work', weight: 2 },
    ],
    answer:
      'The agreement supports employment opportunities in remote communities. The recipient will use the funding to improve access to jobs and strengthen local partnerships.',
    referenceScores: [0.65, 0.08, 0.12],
  },
  {
    id: 'indigenous-remote-workforce-mixed',
    kind: 'workforce',
    profile: 'mixed',
    question:
      'Explain this Indigenous remote workforce agreement: what employment support is funded, what placement targets it expects, and how the service will be delivered.',
    criteria: [
      { label: 'States that the agreement funds employment support for Indigenous job seekers in remote communities', weight: 4 },
      { label: 'Names the participant, placement, and employer-partnership targets', weight: 4 },
      { label: 'Explains that community coaching, travel support, and employer coordination deliver the work', weight: 2 },
    ],
    answer:
      'The agreement funds employment support for Indigenous job seekers in remote communities. It aims to help more participants connect with employers and move into paid work over the agreement period. Delivery will include community-based coaching, travel support for interviews or training, and coordination with employers hiring in the region.',
    referenceScores: [0.9, 0.43, 0.74],
  },
  {
    id: 'indigenous-remote-workforce-good',
    kind: 'workforce',
    profile: 'good',
    question:
      'Explain this Indigenous remote workforce agreement: what employment support is funded, what placement targets it expects, and how the service will be delivered.',
    criteria: [
      { label: 'States that the agreement funds employment support for Indigenous job seekers in remote communities', weight: 4 },
      { label: 'Names the participant, placement, and employer-partnership targets', weight: 4 },
      { label: 'Explains that community coaching, travel support, and employer coordination deliver the work', weight: 2 },
    ],
    answer:
      'This agreement provides $720,000 for employment support serving Indigenous job seekers in eight remote communities. It targets 190 participants, 95 job placements, and 40 active employer partnerships by July 2027. The service will be delivered through community employment coaches, travel support for interviews and short training blocks, and direct coordination with regional employers in energy, transport, and construction.',
    referenceScores: [0.98, 0.96, 0.95],
  },
  {
    id: 'indigenous-remote-workforce-off-topic',
    kind: 'workforce',
    profile: 'off_topic',
    question:
      'Explain this Indigenous remote workforce agreement: what employment support is funded, what placement targets it expects, and how the service will be delivered.',
    criteria: [
      { label: 'States that the agreement funds employment support for Indigenous job seekers in remote communities', weight: 4 },
      { label: 'Names the participant, placement, and employer-partnership targets', weight: 4 },
      { label: 'Explains that community coaching, travel support, and employer coordination deliver the work', weight: 2 },
    ],
    answer:
      'Let the pan heat fully, avoid crowding the mushrooms, and add the butter near the end if you want them browned instead of soggy.',
    referenceScores: [0, 0, 0],
  },
  {
    id: 'green-jobs-internships-bad',
    kind: 'workforce',
    profile: 'bad',
    question:
      'Summarize this green jobs internship agreement: what internship program is funded, what participant outcomes it expects, and how the internships will be delivered.',
    criteria: [
      { label: 'States that the agreement funds green jobs internships', weight: 4 },
      { label: 'Names the intern, host-site, and post-internship employment targets', weight: 4 },
      { label: 'Explains that host placements, supervision, and training modules deliver the program', weight: 2 },
    ],
    answer:
      'The agreement supports internships connected to environmental work. The recipient will use the funding to give people more opportunities and strengthen the local green economy.',
    referenceScores: [0.65, 0.08, 0.12],
  },
  {
    id: 'green-jobs-internships-mixed',
    kind: 'workforce',
    profile: 'mixed',
    question:
      'Summarize this green jobs internship agreement: what internship program is funded, what participant outcomes it expects, and how the internships will be delivered.',
    criteria: [
      { label: 'States that the agreement funds green jobs internships', weight: 4 },
      { label: 'Names the intern, host-site, and post-internship employment targets', weight: 4 },
      { label: 'Explains that host placements, supervision, and training modules deliver the program', weight: 2 },
    ],
    answer:
      'The agreement funds green jobs internships for early-career workers interested in energy efficiency and environmental services. It aims to place more interns at host organizations and move more of them into environmental jobs after the internship period. Delivery will rely on host placements, structured supervision, and short training modules.',
    referenceScores: [0.9, 0.43, 0.74],
  },
  {
    id: 'green-jobs-internships-good',
    kind: 'workforce',
    profile: 'good',
    question:
      'Summarize this green jobs internship agreement: what internship program is funded, what participant outcomes it expects, and how the internships will be delivered.',
    criteria: [
      { label: 'States that the agreement funds green jobs internships', weight: 4 },
      { label: 'Names the intern, host-site, and post-internship employment targets', weight: 4 },
      { label: 'Explains that host placements, supervision, and training modules deliver the program', weight: 2 },
    ],
    answer:
      'This agreement provides $610,000 for green jobs internships in energy efficiency, habitat restoration, and waste diversion. It targets 75 interns, 32 host sites, and 45 interns moving into environmental jobs within three months of completion by September 2027. The internships will be delivered through paid host placements, site supervision plans, and common training modules on safety, reporting, and sector basics.',
    referenceScores: [0.98, 0.96, 0.95],
  },
  {
    id: 'green-jobs-internships-off-topic',
    kind: 'workforce',
    profile: 'off_topic',
    question:
      'Summarize this green jobs internship agreement: what internship program is funded, what participant outcomes it expects, and how the internships will be delivered.',
    criteria: [
      { label: 'States that the agreement funds green jobs internships', weight: 4 },
      { label: 'Names the intern, host-site, and post-internship employment targets', weight: 4 },
      { label: 'Explains that host placements, supervision, and training modules deliver the program', weight: 2 },
    ],
    answer:
      'Use the calendar alerts earlier, lay out the bag the night before, and put the keys in one place if mornings feel rushed.',
    referenceScores: [0, 0, 0],
  },
  {
    id: 'hospitality-reentry-training-bad',
    kind: 'workforce',
    profile: 'bad',
    question:
      'What does this hospitality re-entry training agreement fund, what learner and placement results it expects, and how the training will be delivered?',
    criteria: [
      { label: 'States that the agreement funds hospitality re-entry training', weight: 4 },
      { label: 'Names the learner, completion, and placement results', weight: 4 },
      { label: 'Explains that classroom training, work placements, and job coaching deliver the program', weight: 2 },
    ],
    answer:
      'The agreement supports training for people returning to work in hospitality. The program is intended to improve readiness and connect more people with employers.',
    referenceScores: [0.65, 0.08, 0.12],
  },
  {
    id: 'hospitality-reentry-training-mixed',
    kind: 'workforce',
    profile: 'mixed',
    question:
      'What does this hospitality re-entry training agreement fund, what learner and placement results it expects, and how the training will be delivered?',
    criteria: [
      { label: 'States that the agreement funds hospitality re-entry training', weight: 4 },
      { label: 'Names the learner, completion, and placement results', weight: 4 },
      { label: 'Explains that classroom training, work placements, and job coaching deliver the program', weight: 2 },
    ],
    answer:
      'The agreement funds hospitality re-entry training for adults returning to kitchens, hotels, and front-desk roles. It aims to increase completions and move more learners into placements over the contract year. Delivery will include classroom instruction, short work placements, and job coaching with employer referrals.',
    referenceScores: [0.9, 0.43, 0.74],
  },
  {
    id: 'hospitality-reentry-training-good',
    kind: 'workforce',
    profile: 'good',
    question:
      'What does this hospitality re-entry training agreement fund, what learner and placement results it expects, and how the training will be delivered?',
    criteria: [
      { label: 'States that the agreement funds hospitality re-entry training', weight: 4 },
      { label: 'Names the learner, completion, and placement results', weight: 4 },
      { label: 'Explains that classroom training, work placements, and job coaching deliver the program', weight: 2 },
    ],
    answer:
      'This agreement provides $530,000 for hospitality re-entry training focused on kitchen, housekeeping, and front-desk roles. It targets 160 learners, 125 completed training plans, and 90 job placements by April 2027. The training will be delivered through classroom modules, two-week work placements, and job coaching with participating hotels and restaurants.',
    referenceScores: [0.98, 0.96, 0.95],
  },
  {
    id: 'hospitality-reentry-training-off-topic',
    kind: 'workforce',
    profile: 'off_topic',
    question:
      'What does this hospitality re-entry training agreement fund, what learner and placement results it expects, and how the training will be delivered?',
    criteria: [
      { label: 'States that the agreement funds hospitality re-entry training', weight: 4 },
      { label: 'Names the learner, completion, and placement results', weight: 4 },
      { label: 'Explains that classroom training, work placements, and job coaching deliver the program', weight: 2 },
    ],
    answer:
      'Lower the thermostat a degree, seal the draft by the door, and close the curtains earlier if the room feels cold at night.',
    referenceScores: [0, 0, 0],
  },
  {
    id: 'diabetes-screening-outreach-bad',
    kind: 'health',
    profile: 'bad',
    question:
      'Explain this diabetes screening outreach agreement: what service is funded, what screening outcomes it expects, and how the outreach will be delivered.',
    criteria: [
      { label: 'States that the agreement funds diabetes screening outreach', weight: 4 },
      { label: 'Names the screening, referral, and follow-up outcomes', weight: 4 },
      { label: 'Explains that outreach clinics, educators, and referral tracking deliver the service', weight: 2 },
    ],
    answer:
      'The agreement supports community diabetes services. The recipient will use the funding to improve prevention and connect more people to care.',
    referenceScores: [0.65, 0.08, 0.12],
  },
  {
    id: 'diabetes-screening-outreach-mixed',
    kind: 'health',
    profile: 'mixed',
    question:
      'Explain this diabetes screening outreach agreement: what service is funded, what screening outcomes it expects, and how the outreach will be delivered.',
    criteria: [
      { label: 'States that the agreement funds diabetes screening outreach', weight: 4 },
      { label: 'Names the screening, referral, and follow-up outcomes', weight: 4 },
      { label: 'Explains that outreach clinics, educators, and referral tracking deliver the service', weight: 2 },
    ],
    answer:
      'The agreement funds diabetes screening outreach in neighbourhoods with lower access to preventive care. It aims to increase screenings and move more people with elevated results into follow-up care over the contract year. Delivery will include outreach clinics, diabetes educators, and tracked referrals into primary care services.',
    referenceScores: [0.9, 0.43, 0.74],
  },
  {
    id: 'diabetes-screening-outreach-good',
    kind: 'health',
    profile: 'good',
    question:
      'Explain this diabetes screening outreach agreement: what service is funded, what screening outcomes it expects, and how the outreach will be delivered.',
    criteria: [
      { label: 'States that the agreement funds diabetes screening outreach', weight: 4 },
      { label: 'Names the screening, referral, and follow-up outcomes', weight: 4 },
      { label: 'Explains that outreach clinics, educators, and referral tracking deliver the service', weight: 2 },
    ],
    answer:
      'This agreement provides $640,000 for diabetes screening outreach in six underserved neighbourhoods. It targets 3,000 screening encounters, 520 primary-care referrals, and 400 completed follow-up contacts by June 2027. Delivery will come through rotating outreach clinics, diabetes educators at each site, and referral tracking reviewed every month with partner clinics.',
    referenceScores: [0.98, 0.96, 0.95],
  },
  {
    id: 'diabetes-screening-outreach-off-topic',
    kind: 'health',
    profile: 'off_topic',
    question:
      'Explain this diabetes screening outreach agreement: what service is funded, what screening outcomes it expects, and how the outreach will be delivered.',
    criteria: [
      { label: 'States that the agreement funds diabetes screening outreach', weight: 4 },
      { label: 'Names the screening, referral, and follow-up outcomes', weight: 4 },
      { label: 'Explains that outreach clinics, educators, and referral tracking deliver the service', weight: 2 },
    ],
    answer:
      'Start with the heaviest boxes at the bottom, fill gaps with towels, and label one box for essentials you need the first night after moving.',
    referenceScores: [0, 0, 0],
  },
  {
    id: 'seniors-fall-prevention-bad',
    kind: 'health',
    profile: 'bad',
    question:
      'Summarize this seniors fall prevention agreement: what program is funded, what participant outcomes it expects, and how the program will be delivered.',
    criteria: [
      { label: 'States that the agreement funds seniors fall prevention supports', weight: 4 },
      { label: 'Names the participant, assessment, and reduction outcomes', weight: 4 },
      { label: 'Explains that classes, home assessments, and follow-up coaching deliver the program', weight: 2 },
    ],
    answer:
      'The agreement supports fall prevention for older adults. The service will help improve safety and reduce preventable injuries in the community.',
    referenceScores: [0.65, 0.08, 0.12],
  },
  {
    id: 'seniors-fall-prevention-mixed',
    kind: 'health',
    profile: 'mixed',
    question:
      'Summarize this seniors fall prevention agreement: what program is funded, what participant outcomes it expects, and how the program will be delivered.',
    criteria: [
      { label: 'States that the agreement funds seniors fall prevention supports', weight: 4 },
      { label: 'Names the participant, assessment, and reduction outcomes', weight: 4 },
      { label: 'Explains that classes, home assessments, and follow-up coaching deliver the program', weight: 2 },
    ],
    answer:
      'The agreement funds fall prevention supports for older adults living independently. It aims to expand assessments and reduce avoidable falls over the agreement term. Delivery will include balance classes, home safety assessments, and follow-up coaching for participants at higher risk.',
    referenceScores: [0.9, 0.43, 0.74],
  },
  {
    id: 'seniors-fall-prevention-good',
    kind: 'health',
    profile: 'good',
    question:
      'Summarize this seniors fall prevention agreement: what program is funded, what participant outcomes it expects, and how the program will be delivered.',
    criteria: [
      { label: 'States that the agreement funds seniors fall prevention supports', weight: 4 },
      { label: 'Names the participant, assessment, and reduction outcomes', weight: 4 },
      { label: 'Explains that classes, home assessments, and follow-up coaching deliver the program', weight: 2 },
    ],
    answer:
      'This agreement provides $450,000 for seniors fall prevention supports in urban and rural service areas. It targets 600 participants, 520 home or mobility assessments, and a 15 percent reduction in repeat falls among enrolled clients by December 2026. The program will be delivered through balance classes, home safety assessments, and follow-up coaching calls from clinical staff.',
    referenceScores: [0.98, 0.96, 0.95],
  },
  {
    id: 'seniors-fall-prevention-off-topic',
    kind: 'health',
    profile: 'off_topic',
    question:
      'Summarize this seniors fall prevention agreement: what program is funded, what participant outcomes it expects, and how the program will be delivered.',
    criteria: [
      { label: 'States that the agreement funds seniors fall prevention supports', weight: 4 },
      { label: 'Names the participant, assessment, and reduction outcomes', weight: 4 },
      { label: 'Explains that classes, home assessments, and follow-up coaching deliver the program', weight: 2 },
    ],
    answer:
      'Sharpen the knife regularly, brace the cutting board with a damp towel, and slice the onions root-side last if prep feels slow.',
    referenceScores: [0, 0, 0],
  },
  {
    id: 'mobile-vision-clinic-bad',
    kind: 'health',
    profile: 'bad',
    question:
      'What does this mobile vision clinic agreement fund, what screening targets it expects, and how the clinic will be delivered?',
    criteria: [
      { label: 'States that the agreement funds a mobile vision clinic', weight: 4 },
      { label: 'Names the screening, referral, and site targets', weight: 4 },
      { label: 'Explains that clinic rotations, eye-care staff, and school or community scheduling deliver the work', weight: 2 },
    ],
    answer:
      'The agreement supports vision services in the community. The organization will use the funding to improve access and connect more people with care.',
    referenceScores: [0.65, 0.08, 0.12],
  },
  {
    id: 'mobile-vision-clinic-mixed',
    kind: 'health',
    profile: 'mixed',
    question:
      'What does this mobile vision clinic agreement fund, what screening targets it expects, and how the clinic will be delivered?',
    criteria: [
      { label: 'States that the agreement funds a mobile vision clinic', weight: 4 },
      { label: 'Names the screening, referral, and site targets', weight: 4 },
      { label: 'Explains that clinic rotations, eye-care staff, and school or community scheduling deliver the work', weight: 2 },
    ],
    answer:
      'The agreement funds a mobile vision clinic serving schools and neighbourhood hubs with limited access to eye care. It aims to increase screenings and referrals over the contract period. Delivery will use rotating clinic days, eye-care staff on the mobile unit, and scheduled visits with local sites.',
    referenceScores: [0.9, 0.43, 0.74],
  },
  {
    id: 'mobile-vision-clinic-good',
    kind: 'health',
    profile: 'good',
    question:
      'What does this mobile vision clinic agreement fund, what screening targets it expects, and how the clinic will be delivered?',
    criteria: [
      { label: 'States that the agreement funds a mobile vision clinic', weight: 4 },
      { label: 'Names the screening, referral, and site targets', weight: 4 },
      { label: 'Explains that clinic rotations, eye-care staff, and school or community scheduling deliver the work', weight: 2 },
    ],
    answer:
      'This agreement provides $520,000 for a mobile vision clinic serving schools, shelters, and seniors centres. It targets 2,600 screenings, 540 specialist referrals, and 34 service sites by April 2027. The clinic will be delivered through a rotating service calendar, an optometrist and support staff on each run, and advance scheduling with partner schools and community sites.',
    referenceScores: [0.98, 0.96, 0.95],
  },
  {
    id: 'mobile-vision-clinic-off-topic',
    kind: 'health',
    profile: 'off_topic',
    question:
      'What does this mobile vision clinic agreement fund, what screening targets it expects, and how the clinic will be delivered?',
    criteria: [
      { label: 'States that the agreement funds a mobile vision clinic', weight: 4 },
      { label: 'Names the screening, referral, and site targets', weight: 4 },
      { label: 'Explains that clinic rotations, eye-care staff, and school or community scheduling deliver the work', weight: 2 },
    ],
    answer:
      'Keep one spare towel by the door, wipe the dog’s paws before it comes in, and brush the coat outside more often if the floor stays muddy.',
    referenceScores: [0, 0, 0],
  },
  {
    id: 'asthma-home-visits-bad',
    kind: 'health',
    profile: 'bad',
    question:
      'Explain this childhood asthma home-visit agreement: what service is funded, what client results it expects, and how the service will be delivered.',
    criteria: [
      { label: 'States that the agreement funds childhood asthma home-visit support', weight: 4 },
      { label: 'Names the family, visit, and hospital-use reduction targets', weight: 4 },
      { label: 'Explains that home visits, education, and care-plan follow-up deliver the service', weight: 2 },
    ],
    answer:
      'The agreement supports asthma services for children and families. The provider will use the funding to improve management and reduce avoidable health problems.',
    referenceScores: [0.65, 0.08, 0.12],
  },
  {
    id: 'asthma-home-visits-mixed',
    kind: 'health',
    profile: 'mixed',
    question:
      'Explain this childhood asthma home-visit agreement: what service is funded, what client results it expects, and how the service will be delivered.',
    criteria: [
      { label: 'States that the agreement funds childhood asthma home-visit support', weight: 4 },
      { label: 'Names the family, visit, and hospital-use reduction targets', weight: 4 },
      { label: 'Explains that home visits, education, and care-plan follow-up deliver the service', weight: 2 },
    ],
    answer:
      'The agreement funds home-visit support for children with asthma and their families. It aims to increase visits and reduce urgent asthma episodes over the contract year. Delivery will include home visits, parent education, and follow-up on asthma care plans.',
    referenceScores: [0.9, 0.43, 0.74],
  },
  {
    id: 'asthma-home-visits-good',
    kind: 'health',
    profile: 'good',
    question:
      'Explain this childhood asthma home-visit agreement: what service is funded, what client results it expects, and how the service will be delivered.',
    criteria: [
      { label: 'States that the agreement funds childhood asthma home-visit support', weight: 4 },
      { label: 'Names the family, visit, and hospital-use reduction targets', weight: 4 },
      { label: 'Explains that home visits, education, and care-plan follow-up deliver the service', weight: 2 },
    ],
    answer:
      'This agreement provides $480,000 for childhood asthma home-visit support for families referred by emergency departments and primary care clinics. It targets 260 families, 780 home visits, and a 20 percent reduction in asthma-related emergency visits among enrolled children by June 2027. The service will be delivered through respiratory educator home visits, parent education sessions, and follow-up calls to review care plans and trigger management.',
    referenceScores: [0.98, 0.96, 0.95],
  },
  {
    id: 'asthma-home-visits-off-topic',
    kind: 'health',
    profile: 'off_topic',
    question:
      'Explain this childhood asthma home-visit agreement: what service is funded, what client results it expects, and how the service will be delivered.',
    criteria: [
      { label: 'States that the agreement funds childhood asthma home-visit support', weight: 4 },
      { label: 'Names the family, visit, and hospital-use reduction targets', weight: 4 },
      { label: 'Explains that home visits, education, and care-plan follow-up deliver the service', weight: 2 },
    ],
    answer:
      'Mark the screws in separate cups, take a photo before unplugging each cable, and label the shelves if furniture assembly always turns chaotic.',
    referenceScores: [0, 0, 0],
  },
  {
    id: 'vaccine-outreach-bad',
    kind: 'health',
    profile: 'bad',
    question:
      'Summarize this vaccine outreach agreement: what service is funded, what uptake targets it expects, and how the outreach will be delivered.',
    criteria: [
      { label: 'States that the agreement funds vaccine outreach and access support', weight: 4 },
      { label: 'Names the clinic, dose, and client uptake targets', weight: 4 },
      { label: 'Explains that pop-up clinics, outreach workers, and appointment support deliver the work', weight: 2 },
    ],
    answer:
      'The agreement supports vaccine services in the community. The organization will use the funding to improve access and reach more residents.',
    referenceScores: [0.65, 0.08, 0.12],
  },
  {
    id: 'vaccine-outreach-mixed',
    kind: 'health',
    profile: 'mixed',
    question:
      'Summarize this vaccine outreach agreement: what service is funded, what uptake targets it expects, and how the outreach will be delivered.',
    criteria: [
      { label: 'States that the agreement funds vaccine outreach and access support', weight: 4 },
      { label: 'Names the clinic, dose, and client uptake targets', weight: 4 },
      { label: 'Explains that pop-up clinics, outreach workers, and appointment support deliver the work', weight: 2 },
    ],
    answer:
      'The agreement funds vaccine outreach and access support in neighbourhoods with lower immunization rates. It aims to expand clinics and increase uptake over the agreement period. Delivery will include pop-up clinics, outreach workers, and appointment booking support.',
    referenceScores: [0.9, 0.43, 0.74],
  },
  {
    id: 'vaccine-outreach-good',
    kind: 'health',
    profile: 'good',
    question:
      'Summarize this vaccine outreach agreement: what service is funded, what uptake targets it expects, and how the outreach will be delivered.',
    criteria: [
      { label: 'States that the agreement funds vaccine outreach and access support', weight: 4 },
      { label: 'Names the clinic, dose, and client uptake targets', weight: 4 },
      { label: 'Explains that pop-up clinics, outreach workers, and appointment support deliver the work', weight: 2 },
    ],
    answer:
      'This agreement provides $590,000 for vaccine outreach and access support in ten lower-uptake neighbourhoods. It targets 140 pop-up clinics, 8,500 doses administered, and 5,400 clients supported by March 2027. The work will be delivered through rotating pop-up clinics, community outreach workers, and appointment booking and reminder support for clients who need help attending.',
    referenceScores: [0.98, 0.96, 0.95],
  },
  {
    id: 'vaccine-outreach-off-topic',
    kind: 'health',
    profile: 'off_topic',
    question:
      'Summarize this vaccine outreach agreement: what service is funded, what uptake targets it expects, and how the outreach will be delivered.',
    criteria: [
      { label: 'States that the agreement funds vaccine outreach and access support', weight: 4 },
      { label: 'Names the clinic, dose, and client uptake targets', weight: 4 },
      { label: 'Explains that pop-up clinics, outreach workers, and appointment support deliver the work', weight: 2 },
    ],
    answer:
      'Spread the mulch after the soil warms, keep it away from the stems, and water deeply less often if the garden dries out fast.',
    referenceScores: [0, 0, 0],
  },
  {
    id: 'coding-bridge-program-bad',
    kind: 'workforce',
    profile: 'bad',
    question:
      'Explain this coding bridge agreement: what training is funded, what learner outcomes it expects, and how the program will be delivered.',
    criteria: [
      { label: 'States that the agreement funds a coding bridge training program', weight: 4 },
      { label: 'Names the learner, portfolio, and placement outcomes', weight: 4 },
      { label: 'Explains that instruction, mentorship, and project work deliver the program', weight: 2 },
    ],
    answer:
      'The agreement supports digital skills training. The provider will use the funding to improve access to technology careers and help more learners build confidence.',
    referenceScores: [0.65, 0.08, 0.12],
  },
  {
    id: 'coding-bridge-program-mixed',
    kind: 'workforce',
    profile: 'mixed',
    question:
      'Explain this coding bridge agreement: what training is funded, what learner outcomes it expects, and how the program will be delivered.',
    criteria: [
      { label: 'States that the agreement funds a coding bridge training program', weight: 4 },
      { label: 'Names the learner, portfolio, and placement outcomes', weight: 4 },
      { label: 'Explains that instruction, mentorship, and project work deliver the program', weight: 2 },
    ],
    answer:
      'The agreement funds a coding bridge program for adults moving into entry-level software and web roles. It aims to increase learner completions, build stronger portfolios, and support more job placements. Delivery will include technical instruction, mentor support, and applied project work.',
    referenceScores: [0.9, 0.43, 0.74],
  },
  {
    id: 'coding-bridge-program-good',
    kind: 'workforce',
    profile: 'good',
    question:
      'Explain this coding bridge agreement: what training is funded, what learner outcomes it expects, and how the program will be delivered.',
    criteria: [
      { label: 'States that the agreement funds a coding bridge training program', weight: 4 },
      { label: 'Names the learner, portfolio, and placement outcomes', weight: 4 },
      { label: 'Explains that instruction, mentorship, and project work deliver the program', weight: 2 },
    ],
    answer:
      'This agreement provides $760,000 for a coding bridge program focused on front-end development, QA testing, and support engineering. It targets 180 learners, 150 completed portfolios, and 95 job placements by August 2027. The training will be delivered through instructor-led modules, volunteer mentor matching, and project work built with employer feedback.',
    referenceScores: [0.98, 0.96, 0.95],
  },
  {
    id: 'coding-bridge-program-off-topic',
    kind: 'workforce',
    profile: 'off_topic',
    question:
      'Explain this coding bridge agreement: what training is funded, what learner outcomes it expects, and how the program will be delivered.',
    criteria: [
      { label: 'States that the agreement funds a coding bridge training program', weight: 4 },
      { label: 'Names the learner, portfolio, and placement outcomes', weight: 4 },
      { label: 'Explains that instruction, mentorship, and project work deliver the program', weight: 2 },
    ],
    answer:
      'Pack the umbrella near the top, keep dry socks in a side pocket, and tuck the passport in the same sleeve every trip.',
    referenceScores: [0, 0, 0],
  },
  {
    id: 'farmworker-safety-training-bad',
    kind: 'workforce',
    profile: 'bad',
    question:
      'What does this farmworker safety training agreement fund, what completion outcomes it expects, and how the training will be delivered?',
    criteria: [
      { label: 'States that the agreement funds farmworker safety training', weight: 4 },
      { label: 'Names the learner, certification, and employer-site outcomes', weight: 4 },
      { label: 'Explains that field instruction, translated materials, and employer coordination deliver the work', weight: 2 },
    ],
    answer:
      'The agreement supports farmworker training. The recipient will use the funding to improve safety and strengthen working conditions.',
    referenceScores: [0.65, 0.08, 0.12],
  },
  {
    id: 'farmworker-safety-training-mixed',
    kind: 'workforce',
    profile: 'mixed',
    question:
      'What does this farmworker safety training agreement fund, what completion outcomes it expects, and how the training will be delivered?',
    criteria: [
      { label: 'States that the agreement funds farmworker safety training', weight: 4 },
      { label: 'Names the learner, certification, and employer-site outcomes', weight: 4 },
      { label: 'Explains that field instruction, translated materials, and employer coordination deliver the work', weight: 2 },
    ],
    answer:
      'The agreement funds farmworker safety training for seasonal and year-round agricultural workers. It aims to increase training completions and improve safe practices across more employer sites. Delivery will include field instruction, translated materials, and coordination with participating farms.',
    referenceScores: [0.9, 0.43, 0.74],
  },
  {
    id: 'farmworker-safety-training-good',
    kind: 'workforce',
    profile: 'good',
    question:
      'What does this farmworker safety training agreement fund, what completion outcomes it expects, and how the training will be delivered?',
    criteria: [
      { label: 'States that the agreement funds farmworker safety training', weight: 4 },
      { label: 'Names the learner, certification, and employer-site outcomes', weight: 4 },
      { label: 'Explains that field instruction, translated materials, and employer coordination deliver the work', weight: 2 },
    ],
    answer:
      'This agreement provides $420,000 for farmworker safety training in pesticide handling, heat stress prevention, and equipment use. It targets 520 trained workers, 430 completed certifications, and 70 employer sites participating by September 2026. Delivery will be handled through field-based instruction, translated training materials, and scheduling with farm operators during low-harvest periods.',
    referenceScores: [0.98, 0.96, 0.95],
  },
  {
    id: 'farmworker-safety-training-off-topic',
    kind: 'workforce',
    profile: 'off_topic',
    question:
      'What does this farmworker safety training agreement fund, what completion outcomes it expects, and how the training will be delivered?',
    criteria: [
      { label: 'States that the agreement funds farmworker safety training', weight: 4 },
      { label: 'Names the learner, certification, and employer-site outcomes', weight: 4 },
      { label: 'Explains that field instruction, translated materials, and employer coordination deliver the work', weight: 2 },
    ],
    answer:
      'Stir the dressing just before serving, keep the lettuce dry, and add the crunchy toppings at the table if salads go limp too fast.',
    referenceScores: [0, 0, 0],
  },
  {
    id: 'social-enterprise-placements-bad',
    kind: 'workforce',
    profile: 'bad',
    question:
      'Summarize this social enterprise placement agreement: what program is funded, what participant outcomes it expects, and how the placements will be delivered.',
    criteria: [
      { label: 'States that the agreement funds social enterprise work placements', weight: 4 },
      { label: 'Names the participant, placement, and transition outcomes', weight: 4 },
      { label: 'Explains that placements, coaching, and wraparound supports deliver the program', weight: 2 },
    ],
    answer:
      'The agreement supports work opportunities through a social enterprise. The program is intended to help people build experience and improve long-term prospects.',
    referenceScores: [0.65, 0.08, 0.12],
  },
  {
    id: 'social-enterprise-placements-mixed',
    kind: 'workforce',
    profile: 'mixed',
    question:
      'Summarize this social enterprise placement agreement: what program is funded, what participant outcomes it expects, and how the placements will be delivered.',
    criteria: [
      { label: 'States that the agreement funds social enterprise work placements', weight: 4 },
      { label: 'Names the participant, placement, and transition outcomes', weight: 4 },
      { label: 'Explains that placements, coaching, and wraparound supports deliver the program', weight: 2 },
    ],
    answer:
      'The agreement funds social enterprise work placements for people facing barriers to employment. It aims to expand placements and support more participants into longer-term work over the agreement period. Delivery will include paid placements, job coaching, and wraparound supports.',
    referenceScores: [0.9, 0.43, 0.74],
  },
  {
    id: 'social-enterprise-placements-good',
    kind: 'workforce',
    profile: 'good',
    question:
      'Summarize this social enterprise placement agreement: what program is funded, what participant outcomes it expects, and how the placements will be delivered.',
    criteria: [
      { label: 'States that the agreement funds social enterprise work placements', weight: 4 },
      { label: 'Names the participant, placement, and transition outcomes', weight: 4 },
      { label: 'Explains that placements, coaching, and wraparound supports deliver the program', weight: 2 },
    ],
    answer:
      'This agreement provides $580,000 for social enterprise work placements in food services, recycling, and community maintenance. It targets 150 participants, 120 paid placements, and 70 participants transitioning into unsubsidized work by January 2027. Delivery will come through supervised placements, one-on-one coaching, and wraparound supports such as transit assistance and counselling referrals.',
    referenceScores: [0.98, 0.96, 0.95],
  },
  {
    id: 'social-enterprise-placements-off-topic',
    kind: 'workforce',
    profile: 'off_topic',
    question:
      'Summarize this social enterprise placement agreement: what program is funded, what participant outcomes it expects, and how the placements will be delivered.',
    criteria: [
      { label: 'States that the agreement funds social enterprise work placements', weight: 4 },
      { label: 'Names the participant, placement, and transition outcomes', weight: 4 },
      { label: 'Explains that placements, coaching, and wraparound supports deliver the program', weight: 2 },
    ],
    answer:
      'Keep a backup key with someone nearby, oil the lock before winter, and replace the bent spare before you actually need it.',
    referenceScores: [0, 0, 0],
  },
  {
    id: 'manufacturing-upskilling-bad',
    kind: 'workforce',
    profile: 'bad',
    question:
      'Explain this manufacturing upskilling agreement: what training is funded, what credential outcomes it expects, and how the training will be delivered.',
    criteria: [
      { label: 'States that the agreement funds manufacturing upskilling training', weight: 4 },
      { label: 'Names the learner, credential, and advancement outcomes', weight: 4 },
      { label: 'Explains that shop-floor instruction, simulation labs, and supervisor coaching deliver the work', weight: 2 },
    ],
    answer:
      'The agreement supports training for manufacturing workers. The service will improve skills and help employers strengthen their workforce.',
    referenceScores: [0.65, 0.08, 0.12],
  },
  {
    id: 'manufacturing-upskilling-mixed',
    kind: 'workforce',
    profile: 'mixed',
    question:
      'Explain this manufacturing upskilling agreement: what training is funded, what credential outcomes it expects, and how the training will be delivered.',
    criteria: [
      { label: 'States that the agreement funds manufacturing upskilling training', weight: 4 },
      { label: 'Names the learner, credential, and advancement outcomes', weight: 4 },
      { label: 'Explains that shop-floor instruction, simulation labs, and supervisor coaching deliver the work', weight: 2 },
    ],
    answer:
      'The agreement funds manufacturing upskilling for workers moving into more technical production roles. It aims to increase credentials and support more advancement opportunities over the contract year. Delivery will use shop-floor instruction, simulation labs, and coaching from supervisors and trainers.',
    referenceScores: [0.9, 0.43, 0.74],
  },
  {
    id: 'manufacturing-upskilling-good',
    kind: 'workforce',
    profile: 'good',
    question:
      'Explain this manufacturing upskilling agreement: what training is funded, what credential outcomes it expects, and how the training will be delivered.',
    criteria: [
      { label: 'States that the agreement funds manufacturing upskilling training', weight: 4 },
      { label: 'Names the learner, credential, and advancement outcomes', weight: 4 },
      { label: 'Explains that shop-floor instruction, simulation labs, and supervisor coaching deliver the work', weight: 2 },
    ],
    answer:
      'This agreement provides $710,000 for manufacturing upskilling in CNC operations, quality inspection, and robotics support. It targets 220 workers, 180 completed credentials, and 95 wage or role advancements by June 2027. The training will be delivered through shop-floor instruction, simulation lab sessions, and supervisor coaching tied to each worker’s advancement plan.',
    referenceScores: [0.98, 0.96, 0.95],
  },
  {
    id: 'manufacturing-upskilling-off-topic',
    kind: 'workforce',
    profile: 'off_topic',
    question:
      'Explain this manufacturing upskilling agreement: what training is funded, what credential outcomes it expects, and how the training will be delivered.',
    criteria: [
      { label: 'States that the agreement funds manufacturing upskilling training', weight: 4 },
      { label: 'Names the learner, credential, and advancement outcomes', weight: 4 },
      { label: 'Explains that shop-floor instruction, simulation labs, and supervisor coaching deliver the work', weight: 2 },
    ],
    answer:
      'Wash the bike after salty rides, dry the chain, and add fresh lubricant once the links are clean if shifting gets noisy.',
    referenceScores: [0, 0, 0],
  },
  {
    id: 'career-navigation-care-leavers-bad',
    kind: 'workforce',
    profile: 'bad',
    question:
      'What does this career navigation agreement for youth leaving care fund, what employment outcomes it expects, and how the service will be delivered?',
    criteria: [
      { label: 'States that the agreement funds career navigation for youth leaving care', weight: 4 },
      { label: 'Names the youth, training-plan, and placement outcomes', weight: 4 },
      { label: 'Explains that coaches, employer referrals, and transition supports deliver the work', weight: 2 },
    ],
    answer:
      'The agreement supports career services for youth leaving care. The provider will use the funding to improve pathways into work and adulthood.',
    referenceScores: [0.65, 0.08, 0.12],
  },
  {
    id: 'career-navigation-care-leavers-mixed',
    kind: 'workforce',
    profile: 'mixed',
    question:
      'What does this career navigation agreement for youth leaving care fund, what employment outcomes it expects, and how the service will be delivered?',
    criteria: [
      { label: 'States that the agreement funds career navigation for youth leaving care', weight: 4 },
      { label: 'Names the youth, training-plan, and placement outcomes', weight: 4 },
      { label: 'Explains that coaches, employer referrals, and transition supports deliver the work', weight: 2 },
    ],
    answer:
      'The agreement funds career navigation for youth leaving care who need help moving into work or training. It aims to increase completed plans and support more employment placements over the agreement term. Delivery will rely on dedicated coaches, employer referrals, and transition supports like transit or work gear.',
    referenceScores: [0.9, 0.43, 0.74],
  },
  {
    id: 'career-navigation-care-leavers-good',
    kind: 'workforce',
    profile: 'good',
    question:
      'What does this career navigation agreement for youth leaving care fund, what employment outcomes it expects, and how the service will be delivered?',
    criteria: [
      { label: 'States that the agreement funds career navigation for youth leaving care', weight: 4 },
      { label: 'Names the youth, training-plan, and placement outcomes', weight: 4 },
      { label: 'Explains that coaches, employer referrals, and transition supports deliver the work', weight: 2 },
    ],
    answer:
      'This agreement provides $560,000 for career navigation serving youth leaving care across three service regions. It targets 140 youth, 120 completed training or employment plans, and 85 work or post-secondary placements by December 2026. The service will be delivered through dedicated coaches, employer and training referrals, and transition supports such as transit passes, work gear, and housing-related coordination.',
    referenceScores: [0.98, 0.96, 0.95],
  },
  {
    id: 'career-navigation-care-leavers-off-topic',
    kind: 'workforce',
    profile: 'off_topic',
    question:
      'What does this career navigation agreement for youth leaving care fund, what employment outcomes it expects, and how the service will be delivered?',
    criteria: [
      { label: 'States that the agreement funds career navigation for youth leaving care', weight: 4 },
      { label: 'Names the youth, training-plan, and placement outcomes', weight: 4 },
      { label: 'Explains that coaches, employer referrals, and transition supports deliver the work', weight: 2 },
    ],
    answer:
      'Freeze the leftover sauce flat in a bag, label the date, and thaw it in the fridge overnight if you want quicker weeknight meals.',
    referenceScores: [0, 0, 0],
  },
  {
    id: 'tele-rehab-bad',
    kind: 'health',
    profile: 'bad',
    question:
      'Summarize this tele-rehab agreement: what service is funded, what patient outcomes it expects, and how the service will be delivered.',
    criteria: [
      { label: 'States that the agreement funds tele-rehabilitation services', weight: 4 },
      { label: 'Names the patient, session, and recovery outcomes', weight: 4 },
      { label: 'Explains that virtual therapy, home exercise plans, and clinician follow-up deliver the service', weight: 2 },
    ],
    answer:
      'The agreement supports rehabilitation services delivered remotely. The provider will use the funding to improve access and patient recovery support.',
    referenceScores: [0.65, 0.08, 0.12],
  },
  {
    id: 'tele-rehab-mixed',
    kind: 'health',
    profile: 'mixed',
    question:
      'Summarize this tele-rehab agreement: what service is funded, what patient outcomes it expects, and how the service will be delivered.',
    criteria: [
      { label: 'States that the agreement funds tele-rehabilitation services', weight: 4 },
      { label: 'Names the patient, session, and recovery outcomes', weight: 4 },
      { label: 'Explains that virtual therapy, home exercise plans, and clinician follow-up deliver the service', weight: 2 },
    ],
    answer:
      'The agreement funds tele-rehabilitation for patients recovering from surgery or injury who cannot attend clinic easily. It aims to expand therapy sessions and improve recovery follow-through over the contract period. Delivery will include virtual therapy appointments, home exercise plans, and clinician follow-up.',
    referenceScores: [0.9, 0.43, 0.74],
  },
  {
    id: 'tele-rehab-good',
    kind: 'health',
    profile: 'good',
    question:
      'Summarize this tele-rehab agreement: what service is funded, what patient outcomes it expects, and how the service will be delivered.',
    criteria: [
      { label: 'States that the agreement funds tele-rehabilitation services', weight: 4 },
      { label: 'Names the patient, session, and recovery outcomes', weight: 4 },
      { label: 'Explains that virtual therapy, home exercise plans, and clinician follow-up deliver the service', weight: 2 },
    ],
    answer:
      'This agreement provides $630,000 for tele-rehabilitation serving patients recovering from orthopaedic surgery, stroke, and workplace injuries. It targets 420 patients, 3,600 virtual therapy sessions, and 300 patients meeting recovery milestones within their care plans by March 2027. The service will be delivered through virtual therapy appointments, home exercise plans, and scheduled clinician follow-up between sessions.',
    referenceScores: [0.98, 0.96, 0.95],
  },
  {
    id: 'tele-rehab-off-topic',
    kind: 'health',
    profile: 'off_topic',
    question:
      'Summarize this tele-rehab agreement: what service is funded, what patient outcomes it expects, and how the service will be delivered.',
    criteria: [
      { label: 'States that the agreement funds tele-rehabilitation services', weight: 4 },
      { label: 'Names the patient, session, and recovery outcomes', weight: 4 },
      { label: 'Explains that virtual therapy, home exercise plans, and clinician follow-up deliver the service', weight: 2 },
    ],
    answer:
      'Put the suitcase scale in the outer pocket, weigh the bag before adding shoes, and wear the jacket on the plane if airline limits are tight.',
    referenceScores: [0, 0, 0],
  },
  {
    id: 'dialysis-transport-bad',
    kind: 'health',
    profile: 'bad',
    question:
      'Explain this dialysis transport agreement: what service is funded, what trip outcomes it expects, and how the service will be delivered.',
    criteria: [
      { label: 'States that the agreement funds dialysis transportation support', weight: 4 },
      { label: 'Names the trip, client, and attendance outcomes', weight: 4 },
      { label: 'Explains that scheduling, drivers, and appointment coordination deliver the service', weight: 2 },
    ],
    answer:
      'The agreement supports transportation for patients needing medical care. The service is intended to improve access and reduce missed appointments.',
    referenceScores: [0.65, 0.08, 0.12],
  },
  {
    id: 'dialysis-transport-mixed',
    kind: 'health',
    profile: 'mixed',
    question:
      'Explain this dialysis transport agreement: what service is funded, what trip outcomes it expects, and how the service will be delivered.',
    criteria: [
      { label: 'States that the agreement funds dialysis transportation support', weight: 4 },
      { label: 'Names the trip, client, and attendance outcomes', weight: 4 },
      { label: 'Explains that scheduling, drivers, and appointment coordination deliver the service', weight: 2 },
    ],
    answer:
      'The agreement funds transportation support for dialysis patients who have difficulty reaching treatment. It aims to increase completed trips and reduce missed appointments over the contract term. Delivery will use centralized scheduling, drivers, and coordination with dialysis clinic appointment times.',
    referenceScores: [0.9, 0.43, 0.74],
  },
  {
    id: 'dialysis-transport-good',
    kind: 'health',
    profile: 'good',
    question:
      'Explain this dialysis transport agreement: what service is funded, what trip outcomes it expects, and how the service will be delivered.',
    criteria: [
      { label: 'States that the agreement funds dialysis transportation support', weight: 4 },
      { label: 'Names the trip, client, and attendance outcomes', weight: 4 },
      { label: 'Explains that scheduling, drivers, and appointment coordination deliver the service', weight: 2 },
    ],
    answer:
      'This agreement provides $540,000 for transportation support for dialysis patients travelling from rural and outer-urban communities. It targets 11,000 completed trips, 180 active clients, and a reduction in missed dialysis appointments to below 3 percent by February 2027. The service will be delivered through centralized scheduling, contracted drivers, and real-time coordination with clinic appointment changes.',
    referenceScores: [0.98, 0.96, 0.95],
  },
  {
    id: 'dialysis-transport-off-topic',
    kind: 'health',
    profile: 'off_topic',
    question:
      'Explain this dialysis transport agreement: what service is funded, what trip outcomes it expects, and how the service will be delivered.',
    criteria: [
      { label: 'States that the agreement funds dialysis transportation support', weight: 4 },
      { label: 'Names the trip, client, and attendance outcomes', weight: 4 },
      { label: 'Explains that scheduling, drivers, and appointment coordination deliver the service', weight: 2 },
    ],
    answer:
      'Keep the batteries in one drawer, mark which ones are charged, and stop mixing old and new sets if the remote keeps failing.',
    referenceScores: [0, 0, 0],
  },
  {
    id: 'chronic-pain-selfmanagement-bad',
    kind: 'health',
    profile: 'bad',
    question:
      'What does this chronic pain self-management agreement fund, what client outcomes it expects, and how the service will be delivered?',
    criteria: [
      { label: 'States that the agreement funds chronic pain self-management support', weight: 4 },
      { label: 'Names the client, session, and pain-management outcomes', weight: 4 },
      { label: 'Explains that group sessions, coaching, and care-plan follow-up deliver the program', weight: 2 },
    ],
    answer:
      'The agreement supports chronic pain services. The provider will use the funding to improve access and help patients manage symptoms more effectively.',
    referenceScores: [0.65, 0.08, 0.12],
  },
  {
    id: 'chronic-pain-selfmanagement-mixed',
    kind: 'health',
    profile: 'mixed',
    question:
      'What does this chronic pain self-management agreement fund, what client outcomes it expects, and how the service will be delivered?',
    criteria: [
      { label: 'States that the agreement funds chronic pain self-management support', weight: 4 },
      { label: 'Names the client, session, and pain-management outcomes', weight: 4 },
      { label: 'Explains that group sessions, coaching, and care-plan follow-up deliver the program', weight: 2 },
    ],
    answer:
      'The agreement funds chronic pain self-management support for adults living with persistent pain. It aims to increase participation and help more clients improve daily symptom management during the agreement year. Delivery will include group sessions, coaching, and follow-up on personal care plans.',
    referenceScores: [0.9, 0.43, 0.74],
  },
  {
    id: 'chronic-pain-selfmanagement-good',
    kind: 'health',
    profile: 'good',
    question:
      'What does this chronic pain self-management agreement fund, what client outcomes it expects, and how the service will be delivered?',
    criteria: [
      { label: 'States that the agreement funds chronic pain self-management support', weight: 4 },
      { label: 'Names the client, session, and pain-management outcomes', weight: 4 },
      { label: 'Explains that group sessions, coaching, and care-plan follow-up deliver the program', weight: 2 },
    ],
    answer:
      'This agreement provides $470,000 for chronic pain self-management support delivered through primary care and community health partners. It targets 280 clients, 48 group cycles, and 190 clients reporting improved pain-management confidence by November 2026. The service will be delivered through structured group sessions, one-on-one coaching, and follow-up reviews of each client’s care plan.',
    referenceScores: [0.98, 0.96, 0.95],
  },
  {
    id: 'chronic-pain-selfmanagement-off-topic',
    kind: 'health',
    profile: 'off_topic',
    question:
      'What does this chronic pain self-management agreement fund, what client outcomes it expects, and how the service will be delivered?',
    criteria: [
      { label: 'States that the agreement funds chronic pain self-management support', weight: 4 },
      { label: 'Names the client, session, and pain-management outcomes', weight: 4 },
      { label: 'Explains that group sessions, coaching, and care-plan follow-up deliver the program', weight: 2 },
    ],
    answer:
      'Fold the shirts vertically, group cables with a clip, and leave one pocket empty for receipts if the backpack becomes impossible to unpack.',
    referenceScores: [0, 0, 0],
  },
  {
    id: 'community-nutrition-cooking-bad',
    kind: 'health',
    profile: 'bad',
    question:
      'Summarize this community nutrition and cooking agreement: what service is funded, what participation outcomes it expects, and how the service will be delivered.',
    criteria: [
      { label: 'States that the agreement funds community nutrition and cooking support', weight: 4 },
      { label: 'Names the participant, class, and food-skill outcomes', weight: 4 },
      { label: 'Explains that classes, food kits, and coaching deliver the service', weight: 2 },
    ],
    answer:
      'The agreement supports nutrition services in the community. The organization will use the funding to improve healthy eating and practical food skills.',
    referenceScores: [0.65, 0.08, 0.12],
  },
  {
    id: 'community-nutrition-cooking-mixed',
    kind: 'health',
    profile: 'mixed',
    question:
      'Summarize this community nutrition and cooking agreement: what service is funded, what participation outcomes it expects, and how the service will be delivered.',
    criteria: [
      { label: 'States that the agreement funds community nutrition and cooking support', weight: 4 },
      { label: 'Names the participant, class, and food-skill outcomes', weight: 4 },
      { label: 'Explains that classes, food kits, and coaching deliver the service', weight: 2 },
    ],
    answer:
      'The agreement funds community nutrition and cooking support for families facing food insecurity and diet-related health risks. It aims to increase participation and strengthen practical food skills over the agreement period. Delivery will include cooking classes, take-home food kits, and follow-up coaching.',
    referenceScores: [0.9, 0.43, 0.74],
  },
  {
    id: 'community-nutrition-cooking-good',
    kind: 'health',
    profile: 'good',
    question:
      'Summarize this community nutrition and cooking agreement: what service is funded, what participation outcomes it expects, and how the service will be delivered.',
    criteria: [
      { label: 'States that the agreement funds community nutrition and cooking support', weight: 4 },
      { label: 'Names the participant, class, and food-skill outcomes', weight: 4 },
      { label: 'Explains that classes, food kits, and coaching deliver the service', weight: 2 },
    ],
    answer:
      'This agreement provides $350,000 for community nutrition and cooking support in four neighbourhood hubs. It targets 240 participants, 96 cooking classes, and 180 participants completing food-skill action plans by May 2027. The service will be delivered through in-person classes, take-home food kits, and follow-up coaching by dietitians and peer facilitators.',
    referenceScores: [0.98, 0.96, 0.95],
  },
  {
    id: 'community-nutrition-cooking-off-topic',
    kind: 'health',
    profile: 'off_topic',
    question:
      'Summarize this community nutrition and cooking agreement: what service is funded, what participation outcomes it expects, and how the service will be delivered.',
    criteria: [
      { label: 'States that the agreement funds community nutrition and cooking support', weight: 4 },
      { label: 'Names the participant, class, and food-skill outcomes', weight: 4 },
      { label: 'Explains that classes, food kits, and coaching deliver the service', weight: 2 },
    ],
    answer:
      'Store the paintbrushes flat to dry, wrap the tray in a bag between coats, and cut the tape line while the paint is still a little soft.',
    referenceScores: [0, 0, 0],
  },
  {
    id: 'supportive-housing-renovation-bad',
    kind: 'housing',
    profile: 'bad',
    question:
      'What does this supportive housing renovation agreement fund, what upgrade targets it sets, and how the work will be delivered?',
    criteria: [
      { label: 'States that the agreement funds supportive housing renovation work', weight: 4 },
      { label: 'Names the suite, accessibility, and building-upgrade targets', weight: 4 },
      { label: 'Explains that phased construction, resident coordination, and contractor oversight will deliver the work', weight: 2 },
    ],
    answer:
      'The agreement supports housing improvements for people who need stable accommodation. The organization will use the funding to improve the building and respond to resident needs.',
    referenceScores: [0.65, 0.08, 0.12],
  },
  {
    id: 'supportive-housing-renovation-mixed',
    kind: 'housing',
    profile: 'mixed',
    question:
      'What does this supportive housing renovation agreement fund, what upgrade targets it sets, and how the work will be delivered?',
    criteria: [
      { label: 'States that the agreement funds supportive housing renovation work', weight: 4 },
      { label: 'Names the suite, accessibility, and building-upgrade targets', weight: 4 },
      { label: 'Explains that phased construction, resident coordination, and contractor oversight will deliver the work', weight: 2 },
    ],
    answer:
      'The agreement funds renovation work in supportive housing for residents with complex needs. It aims to modernize suites, improve accessibility, and complete major building repairs during the agreement term. The work will be delivered in phases with resident coordination and oversight from contracted builders.',
    referenceScores: [0.9, 0.43, 0.74],
  },
  {
    id: 'supportive-housing-renovation-good',
    kind: 'housing',
    profile: 'good',
    question:
      'What does this supportive housing renovation agreement fund, what upgrade targets it sets, and how the work will be delivered?',
    criteria: [
      { label: 'States that the agreement funds supportive housing renovation work', weight: 4 },
      { label: 'Names the suite, accessibility, and building-upgrade targets', weight: 4 },
      { label: 'Explains that phased construction, resident coordination, and contractor oversight will deliver the work', weight: 2 },
    ],
    answer:
      'This agreement provides $2.1 million to renovate a 42-unit supportive housing building serving residents exiting homelessness. It targets upgrades in 42 suites, 18 accessible bathroom conversions, and full replacement of the roof, fire alarm, and corridor flooring by February 2028. The work will be delivered through phased floor-by-floor construction, resident move coordination, and weekly oversight meetings between the housing provider, project manager, and trades.',
    referenceScores: [0.98, 0.96, 0.95],
  },
  {
    id: 'supportive-housing-renovation-off-topic',
    kind: 'housing',
    profile: 'off_topic',
    question:
      'What does this supportive housing renovation agreement fund, what upgrade targets it sets, and how the work will be delivered?',
    criteria: [
      { label: 'States that the agreement funds supportive housing renovation work', weight: 4 },
      { label: 'Names the suite, accessibility, and building-upgrade targets', weight: 4 },
      { label: 'Explains that phased construction, resident coordination, and contractor oversight will deliver the work', weight: 2 },
    ],
    answer:
      'Soak the lentils first if you want them to cook faster, then salt them near the end so the skins stay tender.',
    referenceScores: [0, 0, 0],
  },
  {
    id: 'rent-bank-expansion-bad',
    kind: 'housing',
    profile: 'bad',
    question:
      'Summarize this rent bank expansion agreement by stating what is funded, what household outcomes are expected, and how the assistance will be delivered.',
    criteria: [
      { label: 'States that the agreement funds rent bank assistance', weight: 4 },
      { label: 'Names the household, eviction-prevention, or arrears targets', weight: 4 },
      { label: 'Explains that intake, assessment, and repayment support deliver the assistance', weight: 2 },
    ],
    answer:
      'The agreement provides support to help households stay housed. The organization will use the funding to respond to urgent need and improve stability.',
    referenceScores: [0.65, 0.08, 0.12],
  },
  {
    id: 'rent-bank-expansion-mixed',
    kind: 'housing',
    profile: 'mixed',
    question:
      'Summarize this rent bank expansion agreement by stating what is funded, what household outcomes are expected, and how the assistance will be delivered.',
    criteria: [
      { label: 'States that the agreement funds rent bank assistance', weight: 4 },
      { label: 'Names the household, eviction-prevention, or arrears targets', weight: 4 },
      { label: 'Explains that intake, assessment, and repayment support deliver the assistance', weight: 2 },
    ],
    answer:
      'The agreement funds expanded rent bank assistance for tenants facing short-term financial shocks. It aims to help more households avoid eviction and reduce rent arrears during the agreement year. Assistance will be delivered through intake, eligibility assessment, and repayment planning support.',
    referenceScores: [0.9, 0.43, 0.74],
  },
  {
    id: 'rent-bank-expansion-good',
    kind: 'housing',
    profile: 'good',
    question:
      'Summarize this rent bank expansion agreement by stating what is funded, what household outcomes are expected, and how the assistance will be delivered.',
    criteria: [
      { label: 'States that the agreement funds rent bank assistance', weight: 4 },
      { label: 'Names the household, eviction-prevention, or arrears targets', weight: 4 },
      { label: 'Explains that intake, assessment, and repayment support deliver the assistance', weight: 2 },
    ],
    answer:
      'This agreement provides $680,000 to expand the municipal rent bank for low-income tenants facing eviction because of temporary arrears. It targets 310 households assisted, 240 eviction filings prevented, and 275 repayment plans in place by March 2027. The assistance will be delivered through centralized intake, caseworker assessment of arrears and income, direct landlord payments, and follow-up repayment coaching.',
    referenceScores: [0.98, 0.96, 0.95],
  },
  {
    id: 'rent-bank-expansion-off-topic',
    kind: 'housing',
    profile: 'off_topic',
    question:
      'Summarize this rent bank expansion agreement by stating what is funded, what household outcomes are expected, and how the assistance will be delivered.',
    criteria: [
      { label: 'States that the agreement funds rent bank assistance', weight: 4 },
      { label: 'Names the household, eviction-prevention, or arrears targets', weight: 4 },
      { label: 'Explains that intake, assessment, and repayment support deliver the assistance', weight: 2 },
    ],
    answer:
      'Use a soft pencil for shading, then lift highlights with a kneaded eraser instead of pressing harder on the paper.',
    referenceScores: [0, 0, 0],
  },
  {
    id: 'tenant-legal-clinic-bad',
    kind: 'housing',
    profile: 'bad',
    question:
      'What does this tenant legal clinic agreement fund, what service outcomes it expects, and how the clinic will deliver those outcomes?',
    criteria: [
      { label: 'States that the agreement funds a tenant legal clinic', weight: 4 },
      { label: 'Names the advice, representation, or resolution targets', weight: 4 },
      { label: 'Explains that intake, legal casework, and outreach deliver the clinic service', weight: 2 },
    ],
    answer:
      'The agreement supports legal help for tenants. The provider will use the funding to improve access to advice and help people resolve housing problems.',
    referenceScores: [0.65, 0.08, 0.12],
  },
  {
    id: 'tenant-legal-clinic-mixed',
    kind: 'housing',
    profile: 'mixed',
    question:
      'What does this tenant legal clinic agreement fund, what service outcomes it expects, and how the clinic will deliver those outcomes?',
    criteria: [
      { label: 'States that the agreement funds a tenant legal clinic', weight: 4 },
      { label: 'Names the advice, representation, or resolution targets', weight: 4 },
      { label: 'Explains that intake, legal casework, and outreach deliver the clinic service', weight: 2 },
    ],
    answer:
      'The agreement funds a tenant legal clinic for renters facing eviction, unsafe conditions, and unlawful rent increases. It aims to provide more legal advice and improve case resolutions over the agreement period. The clinic will deliver the work through intake, legal casework, and targeted community outreach.',
    referenceScores: [0.9, 0.43, 0.74],
  },
  {
    id: 'tenant-legal-clinic-good',
    kind: 'housing',
    profile: 'good',
    question:
      'What does this tenant legal clinic agreement fund, what service outcomes it expects, and how the clinic will deliver those outcomes?',
    criteria: [
      { label: 'States that the agreement funds a tenant legal clinic', weight: 4 },
      { label: 'Names the advice, representation, or resolution targets', weight: 4 },
      { label: 'Explains that intake, legal casework, and outreach deliver the clinic service', weight: 2 },
    ],
    answer:
      'This agreement provides $590,000 to operate a tenant legal clinic serving low-income renters in three high-eviction neighbourhoods. It targets 1,100 legal advice appointments, 260 tribunal representation files, and 700 resolved housing disputes by December 2026. The clinic will deliver these outcomes through weekly intake sessions, staff lawyer and paralegal casework, and outreach workshops in community centres and apartment towers.',
    referenceScores: [0.98, 0.96, 0.95],
  },
  {
    id: 'tenant-legal-clinic-off-topic',
    kind: 'housing',
    profile: 'off_topic',
    question:
      'What does this tenant legal clinic agreement fund, what service outcomes it expects, and how the clinic will deliver those outcomes?',
    criteria: [
      { label: 'States that the agreement funds a tenant legal clinic', weight: 4 },
      { label: 'Names the advice, representation, or resolution targets', weight: 4 },
      { label: 'Explains that intake, legal casework, and outreach deliver the clinic service', weight: 2 },
    ],
    answer:
      'Lower the bicycle seat a little if your hips rock side to side, and check the tire pressure before changing anything else.',
    referenceScores: [0, 0, 0],
  },
  {
    id: 'transitional-housing-furniture-bad',
    kind: 'housing',
    profile: 'bad',
    question:
      'Describe this transitional housing furniture agreement by saying what is funded, what occupancy or move-in targets it sets, and how the items will be supplied.',
    criteria: [
      { label: 'States that the agreement funds furniture and household setup for transitional housing', weight: 4 },
      { label: 'Names the unit, resident, or move-in targets', weight: 4 },
      { label: 'Explains that procurement, assembly, and room setup deliver the work', weight: 2 },
    ],
    answer:
      'The agreement supports transitional housing services. The funding will help make units more usable and improve conditions for new residents.',
    referenceScores: [0.65, 0.08, 0.12],
  },
  {
    id: 'transitional-housing-furniture-mixed',
    kind: 'housing',
    profile: 'mixed',
    question:
      'Describe this transitional housing furniture agreement by saying what is funded, what occupancy or move-in targets it sets, and how the items will be supplied.',
    criteria: [
      { label: 'States that the agreement funds furniture and household setup for transitional housing', weight: 4 },
      { label: 'Names the unit, resident, or move-in targets', weight: 4 },
      { label: 'Explains that procurement, assembly, and room setup deliver the work', weight: 2 },
    ],
    answer:
      'The agreement funds furniture and household setup for transitional housing units used by people leaving shelters. It aims to equip more units and support smoother resident move-ins during the year. The items will be supplied through procurement, assembly, and room setup by staff and vendors.',
    referenceScores: [0.9, 0.43, 0.74],
  },
  {
    id: 'transitional-housing-furniture-good',
    kind: 'housing',
    profile: 'good',
    question:
      'Describe this transitional housing furniture agreement by saying what is funded, what occupancy or move-in targets it sets, and how the items will be supplied.',
    criteria: [
      { label: 'States that the agreement funds furniture and household setup for transitional housing', weight: 4 },
      { label: 'Names the unit, resident, or move-in targets', weight: 4 },
      { label: 'Explains that procurement, assembly, and room setup deliver the work', weight: 2 },
    ],
    answer:
      'This agreement provides $260,000 to furnish 58 transitional housing units for adults and families moving out of emergency shelters. It targets 58 fully equipped units, 120 residents moved in within 14 days of referral, and complete starter-kit delivery for every household by October 2026. The work will be delivered through bulk procurement of furniture and linens, contracted assembly, and room-by-room setup coordinated by housing staff before each move-in.',
    referenceScores: [0.98, 0.96, 0.95],
  },
  {
    id: 'transitional-housing-furniture-off-topic',
    kind: 'housing',
    profile: 'off_topic',
    question:
      'Describe this transitional housing furniture agreement by saying what is funded, what occupancy or move-in targets it sets, and how the items will be supplied.',
    criteria: [
      { label: 'States that the agreement funds furniture and household setup for transitional housing', weight: 4 },
      { label: 'Names the unit, resident, or move-in targets', weight: 4 },
      { label: 'Explains that procurement, assembly, and room setup deliver the work', weight: 2 },
    ],
    answer:
      'If the soup tastes flat, add a splash of acid before adding more salt because the broth may just need brightness.',
    referenceScores: [0, 0, 0],
  },
  {
    id: 'encampment-rehousing-team-bad',
    kind: 'housing',
    profile: 'bad',
    question:
      'What does this encampment rehousing team agreement fund, what rehousing targets are expected, and how will the team deliver them?',
    criteria: [
      { label: 'States that the agreement funds an encampment rehousing team', weight: 4 },
      { label: 'Names the outreach, housing placement, or stabilization targets', weight: 4 },
      { label: 'Explains that outreach, case management, and landlord coordination deliver the service', weight: 2 },
    ],
    answer:
      'The agreement supports housing outreach for people experiencing homelessness. The team will work to improve access to services and help people move into safer situations.',
    referenceScores: [0.65, 0.08, 0.12],
  },
  {
    id: 'encampment-rehousing-team-mixed',
    kind: 'housing',
    profile: 'mixed',
    question:
      'What does this encampment rehousing team agreement fund, what rehousing targets are expected, and how will the team deliver them?',
    criteria: [
      { label: 'States that the agreement funds an encampment rehousing team', weight: 4 },
      { label: 'Names the outreach, housing placement, or stabilization targets', weight: 4 },
      { label: 'Explains that outreach, case management, and landlord coordination deliver the service', weight: 2 },
    ],
    answer:
      'The agreement funds an encampment rehousing team for people living outdoors in high-risk locations. It aims to increase outreach contacts, move more people into housing, and provide stabilization support over the agreement period. The team will deliver this through street outreach, case management, and coordination with landlords and housing providers.',
    referenceScores: [0.9, 0.43, 0.74],
  },
  {
    id: 'encampment-rehousing-team-good',
    kind: 'housing',
    profile: 'good',
    question:
      'What does this encampment rehousing team agreement fund, what rehousing targets are expected, and how will the team deliver them?',
    criteria: [
      { label: 'States that the agreement funds an encampment rehousing team', weight: 4 },
      { label: 'Names the outreach, housing placement, or stabilization targets', weight: 4 },
      { label: 'Explains that outreach, case management, and landlord coordination deliver the service', weight: 2 },
    ],
    answer:
      'This agreement provides $1.3 million to fund a multidisciplinary encampment rehousing team serving three river-valley and downtown sites. It targets 900 outreach contacts, 160 housing placements, and 120 residents stabilized in housing for at least 90 days by June 2027. The team will deliver these outcomes through scheduled street outreach, intensive case management, identification document support, and landlord coordination tied to rent supplements and move-in planning.',
    referenceScores: [0.98, 0.96, 0.95],
  },
  {
    id: 'encampment-rehousing-team-off-topic',
    kind: 'housing',
    profile: 'off_topic',
    question:
      'What does this encampment rehousing team agreement fund, what rehousing targets are expected, and how will the team deliver them?',
    criteria: [
      { label: 'States that the agreement funds an encampment rehousing team', weight: 4 },
      { label: 'Names the outreach, housing placement, or stabilization targets', weight: 4 },
      { label: 'Explains that outreach, case management, and landlord coordination deliver the service', weight: 2 },
    ],
    answer:
      'Turn the mattress every few months if it is double sided, but rotate it instead if the label says it has a fixed top.',
    referenceScores: [0, 0, 0],
  },
  {
    id: 'shelter-climate-control-bad',
    kind: 'housing',
    profile: 'bad',
    question:
      'Summarize this emergency shelter climate-control agreement: what is funded, what facility targets it sets, and how the upgrades will be completed.',
    criteria: [
      { label: 'States that the agreement funds climate-control upgrades in an emergency shelter', weight: 4 },
      { label: 'Names the room, airflow, or temperature-control targets', weight: 4 },
      { label: 'Explains that equipment purchase, installation, and commissioning deliver the upgrades', weight: 2 },
    ],
    answer:
      'The agreement supports improvements at an emergency shelter. The work will make the site safer and more comfortable for people using the facility.',
    referenceScores: [0.65, 0.08, 0.12],
  },
  {
    id: 'shelter-climate-control-mixed',
    kind: 'housing',
    profile: 'mixed',
    question:
      'Summarize this emergency shelter climate-control agreement: what is funded, what facility targets it sets, and how the upgrades will be completed.',
    criteria: [
      { label: 'States that the agreement funds climate-control upgrades in an emergency shelter', weight: 4 },
      { label: 'Names the room, airflow, or temperature-control targets', weight: 4 },
      { label: 'Explains that equipment purchase, installation, and commissioning deliver the upgrades', weight: 2 },
    ],
    answer:
      'The agreement funds climate-control upgrades in an emergency shelter to improve air quality and temperature management. It aims to improve conditions across sleeping and common areas during extreme weather periods. The upgrades will be completed through equipment purchase, installation, and testing by contractors.',
    referenceScores: [0.9, 0.43, 0.74],
  },
  {
    id: 'shelter-climate-control-good',
    kind: 'housing',
    profile: 'good',
    question:
      'Summarize this emergency shelter climate-control agreement: what is funded, what facility targets it sets, and how the upgrades will be completed.',
    criteria: [
      { label: 'States that the agreement funds climate-control upgrades in an emergency shelter', weight: 4 },
      { label: 'Names the room, airflow, or temperature-control targets', weight: 4 },
      { label: 'Explains that equipment purchase, installation, and commissioning deliver the upgrades', weight: 2 },
    ],
    answer:
      'This agreement provides $740,000 to install climate-control upgrades in a 120-bed emergency shelter used during heat and cold alerts. It targets new heating and cooling units in 14 sleeping rooms, balanced airflow in all common spaces, and indoor temperature control within the target range before the winter 2026 season. The work will be completed through equipment procurement, after-hours installation, and commissioning tests overseen by the shelter facilities manager and mechanical engineer.',
    referenceScores: [0.98, 0.96, 0.95],
  },
  {
    id: 'shelter-climate-control-off-topic',
    kind: 'housing',
    profile: 'off_topic',
    question:
      'Summarize this emergency shelter climate-control agreement: what is funded, what facility targets it sets, and how the upgrades will be completed.',
    criteria: [
      { label: 'States that the agreement funds climate-control upgrades in an emergency shelter', weight: 4 },
      { label: 'Names the room, airflow, or temperature-control targets', weight: 4 },
      { label: 'Explains that equipment purchase, installation, and commissioning deliver the upgrades', weight: 2 },
    ],
    answer:
      'Let the camera focus lock before you reframe the shot, especially in dim light where autofocus tends to hunt.',
    referenceScores: [0, 0, 0],
  },
  {
    id: 'youth-housing-navigation-bad',
    kind: 'housing',
    profile: 'bad',
    question:
      'What does this youth housing navigation agreement fund, what placement targets it sets, and how navigation support will be delivered?',
    criteria: [
      { label: 'States that the agreement funds youth housing navigation support', weight: 4 },
      { label: 'Names the youth, placement, or retention targets', weight: 4 },
      { label: 'Explains that intake, housing search, and follow-up support deliver the service', weight: 2 },
    ],
    answer:
      'The agreement supports young people who need help finding housing. The service will improve access to support and respond to local demand.',
    referenceScores: [0.65, 0.08, 0.12],
  },
  {
    id: 'youth-housing-navigation-mixed',
    kind: 'housing',
    profile: 'mixed',
    question:
      'What does this youth housing navigation agreement fund, what placement targets it sets, and how navigation support will be delivered?',
    criteria: [
      { label: 'States that the agreement funds youth housing navigation support', weight: 4 },
      { label: 'Names the youth, placement, or retention targets', weight: 4 },
      { label: 'Explains that intake, housing search, and follow-up support deliver the service', weight: 2 },
    ],
    answer:
      'The agreement funds youth housing navigation support for young people leaving care, couch surfing, or exiting shelters. It aims to connect more youth to housing and improve housing retention over the year. The service will be delivered through intake, housing search assistance, and follow-up support after move-in.',
    referenceScores: [0.9, 0.43, 0.74],
  },
  {
    id: 'youth-housing-navigation-good',
    kind: 'housing',
    profile: 'good',
    question:
      'What does this youth housing navigation agreement fund, what placement targets it sets, and how navigation support will be delivered?',
    criteria: [
      { label: 'States that the agreement funds youth housing navigation support', weight: 4 },
      { label: 'Names the youth, placement, or retention targets', weight: 4 },
      { label: 'Explains that intake, housing search, and follow-up support deliver the service', weight: 2 },
    ],
    answer:
      'This agreement provides $510,000 for youth housing navigation support serving 16- to 24-year-olds at risk of homelessness. It targets 260 youth enrolled, 150 housing placements, and 110 youth remaining housed for six months by August 2027. Navigation support will be delivered through centralized intake, landlord-matched housing search, move-in planning, and three months of follow-up support from youth housing workers.',
    referenceScores: [0.98, 0.96, 0.95],
  },
  {
    id: 'youth-housing-navigation-off-topic',
    kind: 'housing',
    profile: 'off_topic',
    question:
      'What does this youth housing navigation agreement fund, what placement targets it sets, and how navigation support will be delivered?',
    criteria: [
      { label: 'States that the agreement funds youth housing navigation support', weight: 4 },
      { label: 'Names the youth, placement, or retention targets', weight: 4 },
      { label: 'Explains that intake, housing search, and follow-up support deliver the service', weight: 2 },
    ],
    answer:
      'Rinse the filter basket right after brewing coffee, otherwise the oils harden and make the next cup taste stale.',
    referenceScores: [0, 0, 0],
  },
  {
    id: 'accessible-home-modifications-bad',
    kind: 'housing',
    profile: 'bad',
    question:
      'Describe this accessible home modifications agreement: what is funded, what retrofit targets are expected, and how the retrofits will be delivered.',
    criteria: [
      { label: 'States that the agreement funds accessible home modifications', weight: 4 },
      { label: 'Names the household, ramp, bathroom, or retrofit targets', weight: 4 },
      { label: 'Explains that assessments, contractor scheduling, and inspections deliver the retrofits', weight: 2 },
    ],
    answer:
      'The agreement supports home improvements for residents with mobility needs. The funding will help make homes safer and easier to use.',
    referenceScores: [0.65, 0.08, 0.12],
  },
  {
    id: 'accessible-home-modifications-mixed',
    kind: 'housing',
    profile: 'mixed',
    question:
      'Describe this accessible home modifications agreement: what is funded, what retrofit targets are expected, and how the retrofits will be delivered.',
    criteria: [
      { label: 'States that the agreement funds accessible home modifications', weight: 4 },
      { label: 'Names the household, ramp, bathroom, or retrofit targets', weight: 4 },
      { label: 'Explains that assessments, contractor scheduling, and inspections deliver the retrofits', weight: 2 },
    ],
    answer:
      'The agreement funds accessible home modifications for seniors and adults with disabilities living in older housing. It aims to complete more safety retrofits and improve home access over the agreement term. The retrofits will be delivered through home assessments, contractor scheduling, and inspection of completed work.',
    referenceScores: [0.9, 0.43, 0.74],
  },
  {
    id: 'accessible-home-modifications-good',
    kind: 'housing',
    profile: 'good',
    question:
      'Describe this accessible home modifications agreement: what is funded, what retrofit targets are expected, and how the retrofits will be delivered.',
    criteria: [
      { label: 'States that the agreement funds accessible home modifications', weight: 4 },
      { label: 'Names the household, ramp, bathroom, or retrofit targets', weight: 4 },
      { label: 'Explains that assessments, contractor scheduling, and inspections deliver the retrofits', weight: 2 },
    ],
    answer:
      'This agreement provides $880,000 for accessible home modifications for low-income seniors and adults with disabilities. It targets 95 homes assessed, 60 ramp or lift installations, and 45 bathroom accessibility retrofits completed by January 2027. The retrofits will be delivered through occupational therapist assessments, bundled contractor scheduling, and final safety inspections before each file is closed.',
    referenceScores: [0.98, 0.96, 0.95],
  },
  {
    id: 'accessible-home-modifications-off-topic',
    kind: 'housing',
    profile: 'off_topic',
    question:
      'Describe this accessible home modifications agreement: what is funded, what retrofit targets are expected, and how the retrofits will be delivered.',
    criteria: [
      { label: 'States that the agreement funds accessible home modifications', weight: 4 },
      { label: 'Names the household, ramp, bathroom, or retrofit targets', weight: 4 },
      { label: 'Explains that assessments, contractor scheduling, and inspections deliver the retrofits', weight: 2 },
    ],
    answer:
      'Keep the passport in the inside pocket and put a bright tag on the luggage so it is easy to spot on the belt.',
    referenceScores: [0, 0, 0],
  },
  {
    id: 'public-washroom-renewal-bad',
    kind: 'infrastructure',
    profile: 'bad',
    question:
      'What does this public washroom renewal agreement fund, what facility targets it sets, and how the renewal work will be delivered?',
    criteria: [
      { label: 'States that the agreement funds public washroom renewal work', weight: 4 },
      { label: 'Names the site, fixture, accessibility, or reopening targets', weight: 4 },
      { label: 'Explains that design, construction scheduling, and contractor delivery complete the work', weight: 2 },
    ],
    answer:
      'The agreement supports improvements to public facilities. The project will improve access and make the spaces more usable for the community.',
    referenceScores: [0.65, 0.08, 0.12],
  },
  {
    id: 'public-washroom-renewal-mixed',
    kind: 'infrastructure',
    profile: 'mixed',
    question:
      'What does this public washroom renewal agreement fund, what facility targets it sets, and how the renewal work will be delivered?',
    criteria: [
      { label: 'States that the agreement funds public washroom renewal work', weight: 4 },
      { label: 'Names the site, fixture, accessibility, or reopening targets', weight: 4 },
      { label: 'Explains that design, construction scheduling, and contractor delivery complete the work', weight: 2 },
    ],
    answer:
      'The agreement funds renewal work for public washrooms in busy civic and park locations. It aims to improve accessibility, replace worn fixtures, and reopen upgraded facilities during the agreement period. The work will be delivered through design updates, construction scheduling, and contractor-led installation.',
    referenceScores: [0.9, 0.43, 0.74],
  },
  {
    id: 'public-washroom-renewal-good',
    kind: 'infrastructure',
    profile: 'good',
    question:
      'What does this public washroom renewal agreement fund, what facility targets it sets, and how the renewal work will be delivered?',
    criteria: [
      { label: 'States that the agreement funds public washroom renewal work', weight: 4 },
      { label: 'Names the site, fixture, accessibility, or reopening targets', weight: 4 },
      { label: 'Explains that design, construction scheduling, and contractor delivery complete the work', weight: 2 },
    ],
    answer:
      'This agreement provides $1.05 million to renew public washrooms at six park and transit-adjacent sites. It targets six fully reopened washroom buildings, replacement of 72 fixtures, and accessibility upgrades at every site by September 2027. The renewal work will be delivered through finalized design packages, staggered site closures, and contractor delivery overseen by the municipal facilities capital team.',
    referenceScores: [0.98, 0.96, 0.95],
  },
  {
    id: 'public-washroom-renewal-off-topic',
    kind: 'infrastructure',
    profile: 'off_topic',
    question:
      'What does this public washroom renewal agreement fund, what facility targets it sets, and how the renewal work will be delivered?',
    criteria: [
      { label: 'States that the agreement funds public washroom renewal work', weight: 4 },
      { label: 'Names the site, fixture, accessibility, or reopening targets', weight: 4 },
      { label: 'Explains that design, construction scheduling, and contractor delivery complete the work', weight: 2 },
    ],
    answer:
      'Hold the violin bow loosely enough that the wrist can move, otherwise the tone gets thin and scratchy on longer notes.',
    referenceScores: [0, 0, 0],
  },
  {
    id: 'culvert-replacement-bad',
    kind: 'infrastructure',
    profile: 'bad',
    question:
      'Summarize this culvert replacement agreement by identifying what is funded, what infrastructure targets are expected, and how the project will be delivered.',
    criteria: [
      { label: 'States that the agreement funds culvert replacement work', weight: 4 },
      { label: 'Names the site, flow-capacity, or construction targets', weight: 4 },
      { label: 'Explains that engineering, traffic management, and construction delivery complete the project', weight: 2 },
    ],
    answer:
      'The agreement supports infrastructure improvements in a flood-prone area. The project will improve resilience and address aging assets.',
    referenceScores: [0.65, 0.08, 0.12],
  },
  {
    id: 'culvert-replacement-mixed',
    kind: 'infrastructure',
    profile: 'mixed',
    question:
      'Summarize this culvert replacement agreement by identifying what is funded, what infrastructure targets are expected, and how the project will be delivered.',
    criteria: [
      { label: 'States that the agreement funds culvert replacement work', weight: 4 },
      { label: 'Names the site, flow-capacity, or construction targets', weight: 4 },
      { label: 'Explains that engineering, traffic management, and construction delivery complete the project', weight: 2 },
    ],
    answer:
      'The agreement funds culvert replacement work on a rural road corridor with repeated flooding and washout risk. It aims to improve drainage capacity and complete replacement work during the construction season. The project will be delivered through engineering design, traffic management planning, and contractor construction.',
    referenceScores: [0.9, 0.43, 0.74],
  },
  {
    id: 'culvert-replacement-good',
    kind: 'infrastructure',
    profile: 'good',
    question:
      'Summarize this culvert replacement agreement by identifying what is funded, what infrastructure targets are expected, and how the project will be delivered.',
    criteria: [
      { label: 'States that the agreement funds culvert replacement work', weight: 4 },
      { label: 'Names the site, flow-capacity, or construction targets', weight: 4 },
      { label: 'Explains that engineering, traffic management, and construction delivery complete the project', weight: 2 },
    ],
    answer:
      'This agreement provides $1.8 million to replace two undersized culverts under Range Road 14 and stabilize the adjacent ditch network. It targets replacement of both culverts, a 40 percent increase in stormwater flow capacity, and full road reopening before November 2026. The project will be delivered through stamped engineering drawings, detour-based traffic management, and contractor construction supervised by the county transportation department.',
    referenceScores: [0.98, 0.96, 0.95],
  },
  {
    id: 'culvert-replacement-off-topic',
    kind: 'infrastructure',
    profile: 'off_topic',
    question:
      'Summarize this culvert replacement agreement by identifying what is funded, what infrastructure targets are expected, and how the project will be delivered.',
    criteria: [
      { label: 'States that the agreement funds culvert replacement work', weight: 4 },
      { label: 'Names the site, flow-capacity, or construction targets', weight: 4 },
      { label: 'Explains that engineering, traffic management, and construction delivery complete the project', weight: 2 },
    ],
    answer:
      'Mash the avocado only at the end if you want a chunkier texture, and keep the pit out because it does not stop browning.',
    referenceScores: [0, 0, 0],
  },
  {
    id: 'bus-shelter-installation-bad',
    kind: 'infrastructure',
    profile: 'bad',
    question:
      'What does this bus shelter installation agreement fund, what rider-access targets it sets, and how installation will be carried out?',
    criteria: [
      { label: 'States that the agreement funds bus shelter installation', weight: 4 },
      { label: 'Names the stop, shelter, accessibility, or rider-access targets', weight: 4 },
      { label: 'Explains that procurement, site preparation, and installation crews deliver the work', weight: 2 },
    ],
    answer:
      'The agreement supports transit improvements. The funding will make waiting areas better for riders and improve public access.',
    referenceScores: [0.65, 0.08, 0.12],
  },
  {
    id: 'bus-shelter-installation-mixed',
    kind: 'infrastructure',
    profile: 'mixed',
    question:
      'What does this bus shelter installation agreement fund, what rider-access targets it sets, and how installation will be carried out?',
    criteria: [
      { label: 'States that the agreement funds bus shelter installation', weight: 4 },
      { label: 'Names the stop, shelter, accessibility, or rider-access targets', weight: 4 },
      { label: 'Explains that procurement, site preparation, and installation crews deliver the work', weight: 2 },
    ],
    answer:
      'The agreement funds installation of new bus shelters at stops with high ridership and poor weather protection. It aims to increase rider comfort and improve accessibility at more stops during the rollout period. Installation will be carried out through shelter procurement, site preparation, and field crews.',
    referenceScores: [0.9, 0.43, 0.74],
  },
  {
    id: 'bus-shelter-installation-good',
    kind: 'infrastructure',
    profile: 'good',
    question:
      'What does this bus shelter installation agreement fund, what rider-access targets it sets, and how installation will be carried out?',
    criteria: [
      { label: 'States that the agreement funds bus shelter installation', weight: 4 },
      { label: 'Names the stop, shelter, accessibility, or rider-access targets', weight: 4 },
      { label: 'Explains that procurement, site preparation, and installation crews deliver the work', weight: 2 },
    ],
    answer:
      'This agreement provides $920,000 to install bus shelters at 24 high-ridership transit stops lacking weather protection. It targets 24 new shelters, 18 accessible landing pad upgrades, and completion of all priority-stop installations before December 2026. The work will be carried out through shelter procurement, concrete pad preparation, utility checks, and installation crews scheduled in coordination with the transit operations division.',
    referenceScores: [0.98, 0.96, 0.95],
  },
  {
    id: 'bus-shelter-installation-off-topic',
    kind: 'infrastructure',
    profile: 'off_topic',
    question:
      'What does this bus shelter installation agreement fund, what rider-access targets it sets, and how installation will be carried out?',
    criteria: [
      { label: 'States that the agreement funds bus shelter installation', weight: 4 },
      { label: 'Names the stop, shelter, accessibility, or rider-access targets', weight: 4 },
      { label: 'Explains that procurement, site preparation, and installation crews deliver the work', weight: 2 },
    ],
    answer:
      'A slower backswing usually helps with control in tennis because it gives you more time to set the racket face.',
    referenceScores: [0, 0, 0],
  },
  {
    id: 'stormwater-sensor-network-bad',
    kind: 'infrastructure',
    profile: 'bad',
    question:
      'Describe this stormwater sensor network agreement: what is funded, what monitoring targets are expected, and how the network will be deployed.',
    criteria: [
      { label: 'States that the agreement funds a stormwater sensor network', weight: 4 },
      { label: 'Names the site, sensor, or monitoring targets', weight: 4 },
      { label: 'Explains that procurement, installation, and data integration deliver the network', weight: 2 },
    ],
    answer:
      'The agreement supports infrastructure monitoring improvements. The project will help the municipality understand system conditions and plan better responses.',
    referenceScores: [0.65, 0.08, 0.12],
  },
  {
    id: 'stormwater-sensor-network-mixed',
    kind: 'infrastructure',
    profile: 'mixed',
    question:
      'Describe this stormwater sensor network agreement: what is funded, what monitoring targets are expected, and how the network will be deployed.',
    criteria: [
      { label: 'States that the agreement funds a stormwater sensor network', weight: 4 },
      { label: 'Names the site, sensor, or monitoring targets', weight: 4 },
      { label: 'Explains that procurement, installation, and data integration deliver the network', weight: 2 },
    ],
    answer:
      'The agreement funds a stormwater sensor network to improve monitoring in flood-prone basins and outfalls. It aims to add more sensors and strengthen real-time system visibility over the agreement period. The network will be deployed through equipment purchase, field installation, and data integration.',
    referenceScores: [0.9, 0.43, 0.74],
  },
  {
    id: 'stormwater-sensor-network-good',
    kind: 'infrastructure',
    profile: 'good',
    question:
      'Describe this stormwater sensor network agreement: what is funded, what monitoring targets are expected, and how the network will be deployed.',
    criteria: [
      { label: 'States that the agreement funds a stormwater sensor network', weight: 4 },
      { label: 'Names the site, sensor, or monitoring targets', weight: 4 },
      { label: 'Explains that procurement, installation, and data integration deliver the network', weight: 2 },
    ],
    answer:
      'This agreement provides $610,000 to deploy a stormwater sensor network across eight flood-prone ponds and trunk outfalls. It targets installation of 36 level and flow sensors, real-time telemetry at all eight sites, and dashboard integration for operations staff by July 2027. The network will be deployed through equipment procurement, contractor installation, and integration of sensor feeds into the city’s existing water operations platform.',
    referenceScores: [0.98, 0.96, 0.95],
  },
  {
    id: 'stormwater-sensor-network-off-topic',
    kind: 'infrastructure',
    profile: 'off_topic',
    question:
      'Describe this stormwater sensor network agreement: what is funded, what monitoring targets are expected, and how the network will be deployed.',
    criteria: [
      { label: 'States that the agreement funds a stormwater sensor network', weight: 4 },
      { label: 'Names the site, sensor, or monitoring targets', weight: 4 },
      { label: 'Explains that procurement, installation, and data integration deliver the network', weight: 2 },
    ],
    answer:
      'Fold the map back along the original creases before putting it away or it will never fit in the glove box again.',
    referenceScores: [0, 0, 0],
  },
  {
    id: 'library-roof-repair-bad',
    kind: 'infrastructure',
    profile: 'bad',
    question:
      'Summarize this library roof repair agreement: what it funds, what repair targets it sets, and how the repair work will be delivered.',
    criteria: [
      { label: 'States that the agreement funds library roof repair work', weight: 4 },
      { label: 'Names the roof-area, leak-prevention, or reopening targets', weight: 4 },
      { label: 'Explains that tendering, construction, and inspection deliver the repair work', weight: 2 },
    ],
    answer:
      'The agreement supports repairs at a public building. The project will protect the facility and improve long-term maintenance.',
    referenceScores: [0.65, 0.08, 0.12],
  },
  {
    id: 'library-roof-repair-mixed',
    kind: 'infrastructure',
    profile: 'mixed',
    question:
      'Summarize this library roof repair agreement: what it funds, what repair targets it sets, and how the repair work will be delivered.',
    criteria: [
      { label: 'States that the agreement funds library roof repair work', weight: 4 },
      { label: 'Names the roof-area, leak-prevention, or reopening targets', weight: 4 },
      { label: 'Explains that tendering, construction, and inspection deliver the repair work', weight: 2 },
    ],
    answer:
      'The agreement funds roof repair work at a public library with ongoing leaks and water damage. It aims to replace damaged roofing sections and complete repairs before another winter season. The work will be delivered through tendering, construction scheduling, and post-repair inspection.',
    referenceScores: [0.9, 0.43, 0.74],
  },
  {
    id: 'library-roof-repair-good',
    kind: 'infrastructure',
    profile: 'good',
    question:
      'Summarize this library roof repair agreement: what it funds, what repair targets it sets, and how the repair work will be delivered.',
    criteria: [
      { label: 'States that the agreement funds library roof repair work', weight: 4 },
      { label: 'Names the roof-area, leak-prevention, or reopening targets', weight: 4 },
      { label: 'Explains that tendering, construction, and inspection deliver the repair work', weight: 2 },
    ],
    answer:
      'This agreement provides $430,000 to repair the leaking roof at the West Branch Library and prevent further interior damage. It targets replacement of 9,200 square feet of roofing membrane, elimination of all active leaks, and full reopening of the top-floor reading room by October 2026. The repair work will be delivered through public tendering, staged summer construction, and third-party inspection before final acceptance.',
    referenceScores: [0.98, 0.96, 0.95],
  },
  {
    id: 'library-roof-repair-off-topic',
    kind: 'infrastructure',
    profile: 'off_topic',
    question:
      'Summarize this library roof repair agreement: what it funds, what repair targets it sets, and how the repair work will be delivered.',
    criteria: [
      { label: 'States that the agreement funds library roof repair work', weight: 4 },
      { label: 'Names the roof-area, leak-prevention, or reopening targets', weight: 4 },
      { label: 'Explains that tendering, construction, and inspection deliver the repair work', weight: 2 },
    ],
    answer:
      'Warming the butter slightly before creaming it makes the batter smoother, but it should not be melted.',
    referenceScores: [0, 0, 0],
  },
  {
    id: 'rural-bridge-lighting-bad',
    kind: 'infrastructure',
    profile: 'bad',
    question:
      'What does this rural bridge lighting agreement fund, what safety targets it expects, and how the lighting project will be delivered?',
    criteria: [
      { label: 'States that the agreement funds rural bridge lighting upgrades', weight: 4 },
      { label: 'Names the bridge, fixture, or safety-coverage targets', weight: 4 },
      { label: 'Explains that electrical design, installation, and testing deliver the project', weight: 2 },
    ],
    answer:
      'The agreement supports transportation safety improvements. The work will improve visibility and help road users travel more safely.',
    referenceScores: [0.65, 0.08, 0.12],
  },
  {
    id: 'rural-bridge-lighting-mixed',
    kind: 'infrastructure',
    profile: 'mixed',
    question:
      'What does this rural bridge lighting agreement fund, what safety targets it expects, and how the lighting project will be delivered?',
    criteria: [
      { label: 'States that the agreement funds rural bridge lighting upgrades', weight: 4 },
      { label: 'Names the bridge, fixture, or safety-coverage targets', weight: 4 },
      { label: 'Explains that electrical design, installation, and testing deliver the project', weight: 2 },
    ],
    answer:
      'The agreement funds lighting upgrades on a rural bridge corridor with poor night visibility and collision concerns. It aims to improve illumination and complete safer crossing conditions during the project term. The lighting project will be delivered through electrical design, installation, and testing.',
    referenceScores: [0.9, 0.43, 0.74],
  },
  {
    id: 'rural-bridge-lighting-good',
    kind: 'infrastructure',
    profile: 'good',
    question:
      'What does this rural bridge lighting agreement fund, what safety targets it expects, and how the lighting project will be delivered?',
    criteria: [
      { label: 'States that the agreement funds rural bridge lighting upgrades', weight: 4 },
      { label: 'Names the bridge, fixture, or safety-coverage targets', weight: 4 },
      { label: 'Explains that electrical design, installation, and testing deliver the project', weight: 2 },
    ],
    answer:
      'This agreement provides $390,000 to install lighting upgrades on the Pine River Bridge and its two approach segments. It targets 28 new LED fixtures, full illumination coverage across the bridge deck and shoulders, and project completion before the 2026 fog season. The project will be delivered through stamped electrical design, contractor installation of poles and fixtures, and nighttime testing of light levels before handover.',
    referenceScores: [0.98, 0.96, 0.95],
  },
  {
    id: 'rural-bridge-lighting-off-topic',
    kind: 'infrastructure',
    profile: 'off_topic',
    question:
      'What does this rural bridge lighting agreement fund, what safety targets it expects, and how the lighting project will be delivered?',
    criteria: [
      { label: 'States that the agreement funds rural bridge lighting upgrades', weight: 4 },
      { label: 'Names the bridge, fixture, or safety-coverage targets', weight: 4 },
      { label: 'Explains that electrical design, installation, and testing deliver the project', weight: 2 },
    ],
    answer:
      'Write the first paragraph last if you are stuck on an essay, because it is easier once the main points are already clear.',
    referenceScores: [0, 0, 0],
  },
  {
    id: 'playground-inclusion-upgrade-bad',
    kind: 'community',
    profile: 'bad',
    question:
      'Describe this playground inclusion upgrade agreement by stating what is funded, what participation targets it sets, and how the upgrade will be delivered.',
    criteria: [
      { label: 'States that the agreement funds inclusive playground upgrades', weight: 4 },
      { label: 'Names the site, equipment, or access targets', weight: 4 },
      { label: 'Explains that design, procurement, and installation deliver the upgrade', weight: 2 },
    ],
    answer:
      'The agreement supports improvements to a public recreation space. The work will make the area more welcoming and improve community access.',
    referenceScores: [0.65, 0.08, 0.12],
  },
  {
    id: 'playground-inclusion-upgrade-mixed',
    kind: 'community',
    profile: 'mixed',
    question:
      'Describe this playground inclusion upgrade agreement by stating what is funded, what participation targets it sets, and how the upgrade will be delivered.',
    criteria: [
      { label: 'States that the agreement funds inclusive playground upgrades', weight: 4 },
      { label: 'Names the site, equipment, or access targets', weight: 4 },
      { label: 'Explains that design, procurement, and installation deliver the upgrade', weight: 2 },
    ],
    answer:
      'The agreement funds inclusive playground upgrades so children with different mobility and sensory needs can use the site more easily. It aims to add accessible features and improve use of the playground during the project period. The upgrade will be delivered through design work, equipment procurement, and installation.',
    referenceScores: [0.9, 0.43, 0.74],
  },
  {
    id: 'playground-inclusion-upgrade-good',
    kind: 'community',
    profile: 'good',
    question:
      'Describe this playground inclusion upgrade agreement by stating what is funded, what participation targets it sets, and how the upgrade will be delivered.',
    criteria: [
      { label: 'States that the agreement funds inclusive playground upgrades', weight: 4 },
      { label: 'Names the site, equipment, or access targets', weight: 4 },
      { label: 'Explains that design, procurement, and installation deliver the upgrade', weight: 2 },
    ],
    answer:
      'This agreement provides $540,000 to upgrade Maple Park Playground with inclusive equipment and access features. It targets one fully upgraded playground, 12 new accessible or sensory play elements, and barrier-free access routes from the parking area and washrooms by July 2027. The upgrade will be delivered through universal-design review, procurement of specialized equipment, and contractor installation coordinated by the parks capital team.',
    referenceScores: [0.98, 0.96, 0.95],
  },
  {
    id: 'playground-inclusion-upgrade-off-topic',
    kind: 'community',
    profile: 'off_topic',
    question:
      'Describe this playground inclusion upgrade agreement by stating what is funded, what participation targets it sets, and how the upgrade will be delivered.',
    criteria: [
      { label: 'States that the agreement funds inclusive playground upgrades', weight: 4 },
      { label: 'Names the site, equipment, or access targets', weight: 4 },
      { label: 'Explains that design, procurement, and installation deliver the upgrade', weight: 2 },
    ],
    answer:
      'If the zipper sticks, rub a little soap on the teeth before forcing it or the fabric may tear around the seam.',
    referenceScores: [0, 0, 0],
  },
  {
    id: 'after-school-arts-program-bad',
    kind: 'community',
    profile: 'bad',
    question:
      'What does this after-school arts program agreement fund, what youth participation targets it expects, and how the program will be delivered?',
    criteria: [
      { label: 'States that the agreement funds an after-school arts program', weight: 4 },
      { label: 'Names the youth, session, or participation targets', weight: 4 },
      { label: 'Explains that classes, artist facilitation, and partner-site delivery run the program', weight: 2 },
    ],
    answer:
      'The agreement supports arts opportunities for young people. The organization will use the funding to expand programming and improve engagement.',
    referenceScores: [0.65, 0.08, 0.12],
  },
  {
    id: 'after-school-arts-program-mixed',
    kind: 'community',
    profile: 'mixed',
    question:
      'What does this after-school arts program agreement fund, what youth participation targets it expects, and how the program will be delivered?',
    criteria: [
      { label: 'States that the agreement funds an after-school arts program', weight: 4 },
      { label: 'Names the youth, session, or participation targets', weight: 4 },
      { label: 'Explains that classes, artist facilitation, and partner-site delivery run the program', weight: 2 },
    ],
    answer:
      'The agreement funds an after-school arts program for youth in underserved neighbourhoods. It aims to increase participation and provide more regular creative programming over the school year. The program will be delivered through classes led by artists at partner sites.',
    referenceScores: [0.9, 0.43, 0.74],
  },
  {
    id: 'after-school-arts-program-good',
    kind: 'community',
    profile: 'good',
    question:
      'What does this after-school arts program agreement fund, what youth participation targets it expects, and how the program will be delivered?',
    criteria: [
      { label: 'States that the agreement funds an after-school arts program', weight: 4 },
      { label: 'Names the youth, session, or participation targets', weight: 4 },
      { label: 'Explains that classes, artist facilitation, and partner-site delivery run the program', weight: 2 },
    ],
    answer:
      'This agreement provides $310,000 to run an after-school arts program for youth ages 11 to 17 in four neighbourhood schools and community hubs. It targets 220 youth participants, 180 program sessions, and 150 youth completing at least one multi-week arts stream by June 2027. The program will be delivered through weekly visual art, music, and media classes led by teaching artists at partner sites with school-based referrals and attendance follow-up.',
    referenceScores: [0.98, 0.96, 0.95],
  },
  {
    id: 'after-school-arts-program-off-topic',
    kind: 'community',
    profile: 'off_topic',
    question:
      'What does this after-school arts program agreement fund, what youth participation targets it expects, and how the program will be delivered?',
    criteria: [
      { label: 'States that the agreement funds an after-school arts program', weight: 4 },
      { label: 'Names the youth, session, or participation targets', weight: 4 },
      { label: 'Explains that classes, artist facilitation, and partner-site delivery run the program', weight: 2 },
    ],
    answer:
      'Cool the rice on a tray if you need it for fried rice later, because clumped warm rice turns mushy in the pan.',
    referenceScores: [0, 0, 0],
  },
  {
    id: 'seniors-checkin-network-bad',
    kind: 'community',
    profile: 'bad',
    question:
      'Summarize this seniors check-in network agreement by saying what is funded, what outreach targets it expects, and how the network will operate.',
    criteria: [
      { label: 'States that the agreement funds a seniors check-in network', weight: 4 },
      { label: 'Names the senior, call, visit, or referral targets', weight: 4 },
      { label: 'Explains that outreach scheduling, volunteers, and follow-up referrals operate the network', weight: 2 },
    ],
    answer:
      'The agreement supports community services for seniors. The funding will help reduce isolation and improve connections to support.',
    referenceScores: [0.65, 0.08, 0.12],
  },
  {
    id: 'seniors-checkin-network-mixed',
    kind: 'community',
    profile: 'mixed',
    question:
      'Summarize this seniors check-in network agreement by saying what is funded, what outreach targets it expects, and how the network will operate.',
    criteria: [
      { label: 'States that the agreement funds a seniors check-in network', weight: 4 },
      { label: 'Names the senior, call, visit, or referral targets', weight: 4 },
      { label: 'Explains that outreach scheduling, volunteers, and follow-up referrals operate the network', weight: 2 },
    ],
    answer:
      'The agreement funds a seniors check-in network for older adults who are isolated or living alone. It aims to increase regular contact and connect more seniors to community supports over the agreement term. The network will operate through scheduled outreach, volunteers, and follow-up referrals.',
    referenceScores: [0.9, 0.43, 0.74],
  },
  {
    id: 'seniors-checkin-network-good',
    kind: 'community',
    profile: 'good',
    question:
      'Summarize this seniors check-in network agreement by saying what is funded, what outreach targets it expects, and how the network will operate.',
    criteria: [
      { label: 'States that the agreement funds a seniors check-in network', weight: 4 },
      { label: 'Names the senior, call, visit, or referral targets', weight: 4 },
      { label: 'Explains that outreach scheduling, volunteers, and follow-up referrals operate the network', weight: 2 },
    ],
    answer:
      'This agreement provides $280,000 to operate a seniors check-in network for isolated adults over age 70 in five neighbourhoods. It targets 420 seniors enrolled, 9,600 phone or doorstep check-ins, and 260 referrals to food, transportation, or health supports by March 2027. The network will operate through centralized outreach scheduling, trained volunteers making weekly contacts, and follow-up referrals coordinated by a program navigator.',
    referenceScores: [0.98, 0.96, 0.95],
  },
  {
    id: 'seniors-checkin-network-off-topic',
    kind: 'community',
    profile: 'off_topic',
    question:
      'Summarize this seniors check-in network agreement by saying what is funded, what outreach targets it expects, and how the network will operate.',
    criteria: [
      { label: 'States that the agreement funds a seniors check-in network', weight: 4 },
      { label: 'Names the senior, call, visit, or referral targets', weight: 4 },
      { label: 'Explains that outreach scheduling, volunteers, and follow-up referrals operate the network', weight: 2 },
    ],
    answer:
      'Keep the screws from each shelf in separate cups during assembly or it becomes hard to tell which length goes where.',
    referenceScores: [0, 0, 0],
  },
  {
    id: 'food-pantry-cold-storage-bad',
    kind: 'community',
    profile: 'bad',
    question:
      'What does this food pantry cold-storage agreement fund, what capacity targets it expects, and how the project will be delivered?',
    criteria: [
      { label: 'States that the agreement funds food pantry cold-storage capacity', weight: 4 },
      { label: 'Names the cooler, food-volume, or distribution targets', weight: 4 },
      { label: 'Explains that equipment purchase, installation, and staff procedures deliver the project', weight: 2 },
    ],
    answer:
      'The agreement supports improvements to food distribution services. The project will help the pantry serve people more effectively and reduce waste.',
    referenceScores: [0.65, 0.08, 0.12],
  },
  {
    id: 'food-pantry-cold-storage-mixed',
    kind: 'community',
    profile: 'mixed',
    question:
      'What does this food pantry cold-storage agreement fund, what capacity targets it expects, and how the project will be delivered?',
    criteria: [
      { label: 'States that the agreement funds food pantry cold-storage capacity', weight: 4 },
      { label: 'Names the cooler, food-volume, or distribution targets', weight: 4 },
      { label: 'Explains that equipment purchase, installation, and staff procedures deliver the project', weight: 2 },
    ],
    answer:
      'The agreement funds expanded cold-storage capacity for a food pantry distributing fresh food to local households. It aims to increase refrigerated storage and improve the volume of fresh food handled during the agreement period. The project will be delivered through equipment purchase, installation, and updated staff procedures.',
    referenceScores: [0.9, 0.43, 0.74],
  },
  {
    id: 'food-pantry-cold-storage-good',
    kind: 'community',
    profile: 'good',
    question:
      'What does this food pantry cold-storage agreement fund, what capacity targets it expects, and how the project will be delivered?',
    criteria: [
      { label: 'States that the agreement funds food pantry cold-storage capacity', weight: 4 },
      { label: 'Names the cooler, food-volume, or distribution targets', weight: 4 },
      { label: 'Explains that equipment purchase, installation, and staff procedures deliver the project', weight: 2 },
    ],
    answer:
      'This agreement provides $190,000 to expand cold-storage capacity at a regional food pantry serving low-income households. It targets installation of two walk-in coolers, a 60 percent increase in refrigerated food capacity, and handling of 180,000 additional pounds of fresh food by December 2026. The project will be delivered through equipment purchase, contractor installation, and revised receiving and rotation procedures implemented by pantry staff.',
    referenceScores: [0.98, 0.96, 0.95],
  },
  {
    id: 'food-pantry-cold-storage-off-topic',
    kind: 'community',
    profile: 'off_topic',
    question:
      'What does this food pantry cold-storage agreement fund, what capacity targets it expects, and how the project will be delivered?',
    criteria: [
      { label: 'States that the agreement funds food pantry cold-storage capacity', weight: 4 },
      { label: 'Names the cooler, food-volume, or distribution targets', weight: 4 },
      { label: 'Explains that equipment purchase, installation, and staff procedures deliver the project', weight: 2 },
    ],
    answer:
      'Blot the stain first instead of rubbing it, otherwise it spreads deeper into the fabric and becomes harder to lift.',
    referenceScores: [0, 0, 0],
  },
  {
    id: 'neighbourhood-cleanup-microgrants-bad',
    kind: 'community',
    profile: 'bad',
    question:
      'Describe this neighbourhood cleanup microgrants agreement by identifying what is funded, what cleanup targets are expected, and how grants will be administered.',
    criteria: [
      { label: 'States that the agreement funds neighbourhood cleanup microgrants', weight: 4 },
      { label: 'Names the grant, volunteer, site, or cleanup targets', weight: 4 },
      { label: 'Explains that applications, approvals, and supported cleanup events administer the grants', weight: 2 },
    ],
    answer:
      'The agreement supports neighbourhood improvement activities. The funding will help residents take part in community cleanups and local projects.',
    referenceScores: [0.65, 0.08, 0.12],
  },
  {
    id: 'neighbourhood-cleanup-microgrants-mixed',
    kind: 'community',
    profile: 'mixed',
    question:
      'Describe this neighbourhood cleanup microgrants agreement by identifying what is funded, what cleanup targets are expected, and how grants will be administered.',
    criteria: [
      { label: 'States that the agreement funds neighbourhood cleanup microgrants', weight: 4 },
      { label: 'Names the grant, volunteer, site, or cleanup targets', weight: 4 },
      { label: 'Explains that applications, approvals, and supported cleanup events administer the grants', weight: 2 },
    ],
    answer:
      'The agreement funds neighbourhood cleanup microgrants for resident groups and local associations. It aims to support more cleanup events and improve participation across multiple sites during the year. The grants will be administered through applications, approvals, and support for volunteer cleanup events.',
    referenceScores: [0.9, 0.43, 0.74],
  },
  {
    id: 'neighbourhood-cleanup-microgrants-good',
    kind: 'community',
    profile: 'good',
    question:
      'Describe this neighbourhood cleanup microgrants agreement by identifying what is funded, what cleanup targets are expected, and how grants will be administered.',
    criteria: [
      { label: 'States that the agreement funds neighbourhood cleanup microgrants', weight: 4 },
      { label: 'Names the grant, volunteer, site, or cleanup targets', weight: 4 },
      { label: 'Explains that applications, approvals, and supported cleanup events administer the grants', weight: 2 },
    ],
    answer:
      'This agreement provides $125,000 for neighbourhood cleanup microgrants to resident groups, school councils, and block associations. It targets 50 microgrants awarded, 120 cleanup events, and 3,500 volunteers engaged across parks, laneways, and creek edges by October 2026. The grants will be administered through a short application process, rolling staff approvals, and supported cleanup events that include supplies, waste pickup, and reporting forms.',
    referenceScores: [0.98, 0.96, 0.95],
  },
  {
    id: 'neighbourhood-cleanup-microgrants-off-topic',
    kind: 'community',
    profile: 'off_topic',
    question:
      'Describe this neighbourhood cleanup microgrants agreement by identifying what is funded, what cleanup targets are expected, and how grants will be administered.',
    criteria: [
      { label: 'States that the agreement funds neighbourhood cleanup microgrants', weight: 4 },
      { label: 'Names the grant, volunteer, site, or cleanup targets', weight: 4 },
      { label: 'Explains that applications, approvals, and supported cleanup events administer the grants', weight: 2 },
    ],
    answer:
      'Try a shorter stride on steep hills because overreaching tires your legs faster than taking quicker small steps.',
    referenceScores: [0, 0, 0],
  },
  {
    id: 'cultural-festival-safety-plan-bad',
    kind: 'community',
    profile: 'bad',
    question:
      'What does this cultural festival safety plan agreement fund, what event-readiness targets it sets, and how the plan will be delivered?',
    criteria: [
      { label: 'States that the agreement funds festival safety planning and equipment', weight: 4 },
      { label: 'Names the event, staffing, training, or readiness targets', weight: 4 },
      { label: 'Explains that planning, procurement, and staff coordination deliver the plan', weight: 2 },
    ],
    answer:
      'The agreement supports event preparation for a community festival. The work will improve safety and help organizers run the event more effectively.',
    referenceScores: [0.65, 0.08, 0.12],
  },
  {
    id: 'cultural-festival-safety-plan-mixed',
    kind: 'community',
    profile: 'mixed',
    question:
      'What does this cultural festival safety plan agreement fund, what event-readiness targets it sets, and how the plan will be delivered?',
    criteria: [
      { label: 'States that the agreement funds festival safety planning and equipment', weight: 4 },
      { label: 'Names the event, staffing, training, or readiness targets', weight: 4 },
      { label: 'Explains that planning, procurement, and staff coordination deliver the plan', weight: 2 },
    ],
    answer:
      'The agreement funds safety planning and equipment for a multi-day cultural festival held in a downtown public square. It aims to improve event readiness and strengthen staffing and emergency arrangements before the festival opens. The plan will be delivered through planning work, equipment procurement, and staff coordination.',
    referenceScores: [0.9, 0.43, 0.74],
  },
  {
    id: 'cultural-festival-safety-plan-good',
    kind: 'community',
    profile: 'good',
    question:
      'What does this cultural festival safety plan agreement fund, what event-readiness targets it sets, and how the plan will be delivered?',
    criteria: [
      { label: 'States that the agreement funds festival safety planning and equipment', weight: 4 },
      { label: 'Names the event, staffing, training, or readiness targets', weight: 4 },
      { label: 'Explains that planning, procurement, and staff coordination deliver the plan', weight: 2 },
    ],
    answer:
      'This agreement provides $210,000 to fund safety planning, barriers, radios, and training for the River Lights Cultural Festival. It targets one approved festival safety plan, 140 staff and volunteers trained, and full emergency-response readiness before the first event date in August 2026. The plan will be delivered through joint planning meetings with emergency services, procurement of safety equipment, and coordinated staff training and deployment schedules.',
    referenceScores: [0.98, 0.96, 0.95],
  },
  {
    id: 'cultural-festival-safety-plan-off-topic',
    kind: 'community',
    profile: 'off_topic',
    question:
      'What does this cultural festival safety plan agreement fund, what event-readiness targets it sets, and how the plan will be delivered?',
    criteria: [
      { label: 'States that the agreement funds festival safety planning and equipment', weight: 4 },
      { label: 'Names the event, staffing, training, or readiness targets', weight: 4 },
      { label: 'Explains that planning, procurement, and staff coordination deliver the plan', weight: 2 },
    ],
    answer:
      'Keep the charger coiled loosely in the bag, because tight bends near the plug are what usually break the cable first.',
    referenceScores: [0, 0, 0],
  },
  {
    id: 'community-garden-irrigation-bad',
    kind: 'community',
    profile: 'bad',
    question:
      'Summarize this community garden irrigation agreement by saying what is funded, what garden-capacity targets it expects, and how the irrigation work will be delivered.',
    criteria: [
      { label: 'States that the agreement funds community garden irrigation improvements', weight: 4 },
      { label: 'Names the bed, plot, water-access, or production targets', weight: 4 },
      { label: 'Explains that design, installation, and garden coordination deliver the work', weight: 2 },
    ],
    answer:
      'The agreement supports improvements at a community garden. The project will help gardeners and improve the site for local residents.',
    referenceScores: [0.65, 0.08, 0.12],
  },
  {
    id: 'community-garden-irrigation-mixed',
    kind: 'community',
    profile: 'mixed',
    question:
      'Summarize this community garden irrigation agreement by saying what is funded, what garden-capacity targets it expects, and how the irrigation work will be delivered.',
    criteria: [
      { label: 'States that the agreement funds community garden irrigation improvements', weight: 4 },
      { label: 'Names the bed, plot, water-access, or production targets', weight: 4 },
      { label: 'Explains that design, installation, and garden coordination deliver the work', weight: 2 },
    ],
    answer:
      'The agreement funds irrigation improvements at a community garden with unreliable water access and crop losses in dry periods. It aims to improve water coverage and support better use of the garden over the season. The work will be delivered through irrigation design, installation, and coordination with garden leaders.',
    referenceScores: [0.9, 0.43, 0.74],
  },
  {
    id: 'community-garden-irrigation-good',
    kind: 'community',
    profile: 'good',
    question:
      'Summarize this community garden irrigation agreement by saying what is funded, what garden-capacity targets it expects, and how the irrigation work will be delivered.',
    criteria: [
      { label: 'States that the agreement funds community garden irrigation improvements', weight: 4 },
      { label: 'Names the bed, plot, water-access, or production targets', weight: 4 },
      { label: 'Explains that design, installation, and garden coordination deliver the work', weight: 2 },
    ],
    answer:
      'This agreement provides $145,000 to install irrigation improvements at the Eastview Community Garden. It targets water access to all 84 plots, drip irrigation for 26 shared production beds, and a 30 percent reduction in summer crop losses by the end of the 2027 growing season. The work will be delivered through irrigation layout design, contractor installation of lines and valves, and site coordination with the garden committee for phasing and training.',
    referenceScores: [0.98, 0.96, 0.95],
  },
  {
    id: 'community-garden-irrigation-off-topic',
    kind: 'community',
    profile: 'off_topic',
    question:
      'Summarize this community garden irrigation agreement by saying what is funded, what garden-capacity targets it expects, and how the irrigation work will be delivered.',
    criteria: [
      { label: 'States that the agreement funds community garden irrigation improvements', weight: 4 },
      { label: 'Names the bed, plot, water-access, or production targets', weight: 4 },
      { label: 'Explains that design, installation, and garden coordination deliver the work', weight: 2 },
    ],
    answer:
      'Tap the jar lid lightly all the way around with the handle of a spoon before trying again if it is vacuum-sealed shut.',
    referenceScores: [0, 0, 0],
  },
  {
    id: 'community-media-lab-bad',
    kind: 'community',
    profile: 'bad',
    question:
      'What does this community media lab agreement fund, what participant targets it expects, and how the lab will be delivered?',
    criteria: [
      { label: 'States that the agreement funds a community media lab', weight: 4 },
      { label: 'Names the participant, workshop, or completion targets', weight: 4 },
      { label: 'Explains that equipment, instruction, and site operations deliver the lab', weight: 2 },
    ],
    answer:
      'The agreement supports creative programming for community members. The funding will improve access to technology and learning opportunities.',
    referenceScores: [0.65, 0.08, 0.12],
  },
  {
    id: 'community-media-lab-mixed',
    kind: 'community',
    profile: 'mixed',
    question:
      'What does this community media lab agreement fund, what participant targets it expects, and how the lab will be delivered?',
    criteria: [
      { label: 'States that the agreement funds a community media lab', weight: 4 },
      { label: 'Names the participant, workshop, or completion targets', weight: 4 },
      { label: 'Explains that equipment, instruction, and site operations deliver the lab', weight: 2 },
    ],
    answer:
      'The agreement funds a community media lab where youth and adults can learn audio, video, and digital storytelling skills. It aims to increase participation and provide more hands-on learning opportunities during the agreement period. The lab will be delivered through equipment purchase, instruction, and site operations.',
    referenceScores: [0.9, 0.43, 0.74],
  },
  {
    id: 'community-media-lab-good',
    kind: 'community',
    profile: 'good',
    question:
      'What does this community media lab agreement fund, what participant targets it expects, and how the lab will be delivered?',
    criteria: [
      { label: 'States that the agreement funds a community media lab', weight: 4 },
      { label: 'Names the participant, workshop, or completion targets', weight: 4 },
      { label: 'Explains that equipment, instruction, and site operations deliver the lab', weight: 2 },
    ],
    answer:
      'This agreement provides $360,000 to establish a community media lab focused on digital storytelling, podcasting, and video editing for youth and newcomer adults. It targets 260 participants, 120 workshops, and 180 completed media projects by April 2027. The lab will be delivered through purchase of recording and editing equipment, scheduled instruction by media educators, and daily supervised operations at the downtown learning hub.',
    referenceScores: [0.98, 0.96, 0.95],
  },
  {
    id: 'community-media-lab-off-topic',
    kind: 'community',
    profile: 'off_topic',
    question:
      'What does this community media lab agreement fund, what participant targets it expects, and how the lab will be delivered?',
    criteria: [
      { label: 'States that the agreement funds a community media lab', weight: 4 },
      { label: 'Names the participant, workshop, or completion targets', weight: 4 },
      { label: 'Explains that equipment, instruction, and site operations deliver the lab', weight: 2 },
    ],
    answer:
      'Angle the desk lamp away from the screen if you want less glare during video calls in the evening.',
    referenceScores: [0, 0, 0],
  },
  {
    id: 'sports-league-fee-subsidy-bad',
    kind: 'community',
    profile: 'bad',
    question:
      'Describe this sports league fee subsidy agreement by stating what is funded, what enrolment targets it sets, and how the subsidy program will be delivered.',
    criteria: [
      { label: 'States that the agreement funds sports league fee subsidies', weight: 4 },
      { label: 'Names the child, registration, or participation targets', weight: 4 },
      { label: 'Explains that intake, eligibility review, and payment processing deliver the program', weight: 2 },
    ],
    answer:
      'The agreement supports recreation access for families. The funding will help reduce cost barriers and improve participation in local programs.',
    referenceScores: [0.65, 0.08, 0.12],
  },
  {
    id: 'sports-league-fee-subsidy-mixed',
    kind: 'community',
    profile: 'mixed',
    question:
      'Describe this sports league fee subsidy agreement by stating what is funded, what enrolment targets it sets, and how the subsidy program will be delivered.',
    criteria: [
      { label: 'States that the agreement funds sports league fee subsidies', weight: 4 },
      { label: 'Names the child, registration, or participation targets', weight: 4 },
      { label: 'Explains that intake, eligibility review, and payment processing deliver the program', weight: 2 },
    ],
    answer:
      'The agreement funds sports league fee subsidies for children from low-income households. It aims to support more registrations and improve participation in organized recreation during the year. The subsidy program will be delivered through application intake, eligibility review, and payment processing.',
    referenceScores: [0.9, 0.43, 0.74],
  },
  {
    id: 'sports-league-fee-subsidy-good',
    kind: 'community',
    profile: 'good',
    question:
      'Describe this sports league fee subsidy agreement by stating what is funded, what enrolment targets it sets, and how the subsidy program will be delivered.',
    criteria: [
      { label: 'States that the agreement funds sports league fee subsidies', weight: 4 },
      { label: 'Names the child, registration, or participation targets', weight: 4 },
      { label: 'Explains that intake, eligibility review, and payment processing deliver the program', weight: 2 },
    ],
    answer:
      'This agreement provides $275,000 for sports league fee subsidies for children ages 6 to 17 from low-income families. It targets 480 subsidized registrations, 360 children completing a full season, and participation across soccer, basketball, swimming, and hockey by March 2027. The program will be delivered through online and in-person application intake, eligibility review by recreation staff, and direct payment processing with participating leagues.',
    referenceScores: [0.98, 0.96, 0.95],
  },
  {
    id: 'sports-league-fee-subsidy-off-topic',
    kind: 'community',
    profile: 'off_topic',
    question:
      'Describe this sports league fee subsidy agreement by stating what is funded, what enrolment targets it sets, and how the subsidy program will be delivered.',
    criteria: [
      { label: 'States that the agreement funds sports league fee subsidies', weight: 4 },
      { label: 'Names the child, registration, or participation targets', weight: 4 },
      { label: 'Explains that intake, eligibility review, and payment processing deliver the program', weight: 2 },
    ],
    answer:
      'Check that the ladder feet are on solid ground before climbing; wobble at the base is the main thing to avoid.',
    referenceScores: [0, 0, 0],
  },
  {
    id: 'eviction-mediation-service-bad',
    kind: 'housing',
    profile: 'bad',
    question:
      'What does this eviction mediation service agreement fund, what resolution targets it expects, and how the service will be delivered?',
    criteria: [
      { label: 'States that the agreement funds an eviction mediation service', weight: 4 },
      { label: 'Names the case, agreement, or eviction-avoidance targets', weight: 4 },
      { label: 'Explains that intake, mediation sessions, and follow-up support deliver the service', weight: 2 },
    ],
    answer:
      'The agreement supports housing stability services for tenants and landlords. The program will help resolve conflict and improve local outcomes.',
    referenceScores: [0.65, 0.08, 0.12],
  },
  {
    id: 'eviction-mediation-service-mixed',
    kind: 'housing',
    profile: 'mixed',
    question:
      'What does this eviction mediation service agreement fund, what resolution targets it expects, and how the service will be delivered?',
    criteria: [
      { label: 'States that the agreement funds an eviction mediation service', weight: 4 },
      { label: 'Names the case, agreement, or eviction-avoidance targets', weight: 4 },
      { label: 'Explains that intake, mediation sessions, and follow-up support deliver the service', weight: 2 },
    ],
    answer:
      'The agreement funds an eviction mediation service for tenants and landlords facing rent arrears and tenancy disputes. It aims to resolve more cases and prevent more evictions during the agreement period. The service will be delivered through intake, mediation sessions, and follow-up support.',
    referenceScores: [0.9, 0.43, 0.74],
  },
  {
    id: 'eviction-mediation-service-good',
    kind: 'housing',
    profile: 'good',
    question:
      'What does this eviction mediation service agreement fund, what resolution targets it expects, and how the service will be delivered?',
    criteria: [
      { label: 'States that the agreement funds an eviction mediation service', weight: 4 },
      { label: 'Names the case, agreement, or eviction-avoidance targets', weight: 4 },
      { label: 'Explains that intake, mediation sessions, and follow-up support deliver the service', weight: 2 },
    ],
    answer:
      'This agreement provides $420,000 to fund an eviction mediation service for low-income tenants and small landlords before tribunal escalation. It targets 520 mediation intakes, 300 signed repayment or tenancy agreements, and 220 evictions avoided by November 2027. The service will be delivered through centralized intake, trained mediator sessions, and follow-up support to monitor compliance with agreements.',
    referenceScores: [0.98, 0.96, 0.95],
  },
  {
    id: 'eviction-mediation-service-off-topic',
    kind: 'housing',
    profile: 'off_topic',
    question:
      'What does this eviction mediation service agreement fund, what resolution targets it expects, and how the service will be delivered?',
    criteria: [
      { label: 'States that the agreement funds an eviction mediation service', weight: 4 },
      { label: 'Names the case, agreement, or eviction-avoidance targets', weight: 4 },
      { label: 'Explains that intake, mediation sessions, and follow-up support deliver the service', weight: 2 },
    ],
    answer:
      'Let the tea steep a little shorter if the leaves are very small, because broken leaves release bitterness faster.',
    referenceScores: [0, 0, 0],
  },
  {
    id: 'modular-housing-site-setup-bad',
    kind: 'housing',
    profile: 'bad',
    question:
      'Summarize this modular housing site setup agreement: what is funded, what setup targets it includes, and how the site will be prepared.',
    criteria: [
      { label: 'States that the agreement funds modular housing site setup', weight: 4 },
      { label: 'Names the unit, utility, or occupancy-readiness targets', weight: 4 },
      { label: 'Explains that servicing, foundations, and site coordination prepare the project', weight: 2 },
    ],
    answer:
      'The agreement supports new housing development. The project will make a site ready for residents and improve local capacity.',
    referenceScores: [0.65, 0.08, 0.12],
  },
  {
    id: 'modular-housing-site-setup-mixed',
    kind: 'housing',
    profile: 'mixed',
    question:
      'Summarize this modular housing site setup agreement: what is funded, what setup targets it includes, and how the site will be prepared.',
    criteria: [
      { label: 'States that the agreement funds modular housing site setup', weight: 4 },
      { label: 'Names the unit, utility, or occupancy-readiness targets', weight: 4 },
      { label: 'Explains that servicing, foundations, and site coordination prepare the project', weight: 2 },
    ],
    answer:
      'The agreement funds site setup for a modular housing project intended to create new supportive housing capacity quickly. It aims to prepare the land, connect utilities, and make the project ready for occupancy within the agreement term. The site will be prepared through servicing work, foundation installation, and coordination across contractors.',
    referenceScores: [0.9, 0.43, 0.74],
  },
  {
    id: 'modular-housing-site-setup-good',
    kind: 'housing',
    profile: 'good',
    question:
      'Summarize this modular housing site setup agreement: what is funded, what setup targets it includes, and how the site will be prepared.',
    criteria: [
      { label: 'States that the agreement funds modular housing site setup', weight: 4 },
      { label: 'Names the unit, utility, or occupancy-readiness targets', weight: 4 },
      { label: 'Explains that servicing, foundations, and site coordination prepare the project', weight: 2 },
    ],
    answer:
      'This agreement provides $2.4 million to prepare a former parking lot for a 36-unit modular supportive housing project. It targets full utility servicing for 36 units, completion of pad foundations and access roads, and occupancy readiness before module delivery in March 2027. The site will be prepared through underground servicing, concrete foundation work, and weekly site coordination among the civil contractor, utility providers, and modular builder.',
    referenceScores: [0.98, 0.96, 0.95],
  },
  {
    id: 'modular-housing-site-setup-off-topic',
    kind: 'housing',
    profile: 'off_topic',
    question:
      'Summarize this modular housing site setup agreement: what is funded, what setup targets it includes, and how the site will be prepared.',
    criteria: [
      { label: 'States that the agreement funds modular housing site setup', weight: 4 },
      { label: 'Names the unit, utility, or occupancy-readiness targets', weight: 4 },
      { label: 'Explains that servicing, foundations, and site coordination prepare the project', weight: 2 },
    ],
    answer:
      'Use the heel of the loaf for breadcrumbs instead of throwing it out, because dry ends blend down especially well.',
    referenceScores: [0, 0, 0],
  },
  {
    id: 'womens-shelter-security-upgrades-bad',
    kind: 'housing',
    profile: 'bad',
    question:
      'Describe this women’s shelter security upgrades agreement by stating what is funded, what safety targets it sets, and how the upgrades will be delivered.',
    criteria: [
      { label: 'States that the agreement funds security upgrades at a women’s shelter', weight: 4 },
      { label: 'Names the camera, access-control, or coverage targets', weight: 4 },
      { label: 'Explains that procurement, installation, and staff training deliver the upgrades', weight: 2 },
    ],
    answer:
      'The agreement supports safety improvements at a shelter. The funding will help make the building more secure for residents and staff.',
    referenceScores: [0.65, 0.08, 0.12],
  },
  {
    id: 'womens-shelter-security-upgrades-mixed',
    kind: 'housing',
    profile: 'mixed',
    question:
      'Describe this women’s shelter security upgrades agreement by stating what is funded, what safety targets it sets, and how the upgrades will be delivered.',
    criteria: [
      { label: 'States that the agreement funds security upgrades at a women’s shelter', weight: 4 },
      { label: 'Names the camera, access-control, or coverage targets', weight: 4 },
      { label: 'Explains that procurement, installation, and staff training deliver the upgrades', weight: 2 },
    ],
    answer:
      'The agreement funds security upgrades at a women’s shelter serving survivors of violence and their children. It aims to strengthen access control, improve monitoring, and make the site safer during the agreement term. The upgrades will be delivered through procurement, installation, and staff training.',
    referenceScores: [0.9, 0.43, 0.74],
  },
  {
    id: 'womens-shelter-security-upgrades-good',
    kind: 'housing',
    profile: 'good',
    question:
      'Describe this women’s shelter security upgrades agreement by stating what is funded, what safety targets it sets, and how the upgrades will be delivered.',
    criteria: [
      { label: 'States that the agreement funds security upgrades at a women’s shelter', weight: 4 },
      { label: 'Names the camera, access-control, or coverage targets', weight: 4 },
      { label: 'Explains that procurement, installation, and staff training deliver the upgrades', weight: 2 },
    ],
    answer:
      'This agreement provides $330,000 to fund security upgrades at a 48-bed women’s shelter and child support wing. It targets 32 new cameras, upgraded access-control points at all exterior doors, and full monitored coverage of entrances, hallways, and parking areas by January 2027. The upgrades will be delivered through security equipment procurement, contractor installation, and staff training on access protocols and monitoring procedures.',
    referenceScores: [0.98, 0.96, 0.95],
  },
  {
    id: 'womens-shelter-security-upgrades-off-topic',
    kind: 'housing',
    profile: 'off_topic',
    question:
      'Describe this women’s shelter security upgrades agreement by stating what is funded, what safety targets it sets, and how the upgrades will be delivered.',
    criteria: [
      { label: 'States that the agreement funds security upgrades at a women’s shelter', weight: 4 },
      { label: 'Names the camera, access-control, or coverage targets', weight: 4 },
      { label: 'Explains that procurement, installation, and staff training deliver the upgrades', weight: 2 },
    ],
    answer:
      'A damp cloth lifts most dust from houseplants better than leaf shine spray, which tends to leave buildup behind.',
    referenceScores: [0, 0, 0],
  },
  {
    id: 'sidewalk-snow-melt-pilot-bad',
    kind: 'infrastructure',
    profile: 'bad',
    question:
      'What does this sidewalk snow-melt pilot agreement fund, what pilot targets it sets, and how the pilot will be delivered?',
    criteria: [
      { label: 'States that the agreement funds a sidewalk snow-melt pilot', weight: 4 },
      { label: 'Names the sidewalk, uptime, or winter-access targets', weight: 4 },
      { label: 'Explains that design, installation, and winter monitoring deliver the pilot', weight: 2 },
    ],
    answer:
      'The agreement supports a winter maintenance project. The work will improve pedestrian access and test a new approach.',
    referenceScores: [0.65, 0.08, 0.12],
  },
  {
    id: 'sidewalk-snow-melt-pilot-mixed',
    kind: 'infrastructure',
    profile: 'mixed',
    question:
      'What does this sidewalk snow-melt pilot agreement fund, what pilot targets it sets, and how the pilot will be delivered?',
    criteria: [
      { label: 'States that the agreement funds a sidewalk snow-melt pilot', weight: 4 },
      { label: 'Names the sidewalk, uptime, or winter-access targets', weight: 4 },
      { label: 'Explains that design, installation, and winter monitoring deliver the pilot', weight: 2 },
    ],
    answer:
      'The agreement funds a sidewalk snow-melt pilot near a hospital and transit interchange with high winter foot traffic. It aims to improve winter access and test whether the system can keep priority sidewalks clearer during storms. The pilot will be delivered through design work, installation, and winter monitoring.',
    referenceScores: [0.9, 0.43, 0.74],
  },
  {
    id: 'sidewalk-snow-melt-pilot-good',
    kind: 'infrastructure',
    profile: 'good',
    question:
      'What does this sidewalk snow-melt pilot agreement fund, what pilot targets it sets, and how the pilot will be delivered?',
    criteria: [
      { label: 'States that the agreement funds a sidewalk snow-melt pilot', weight: 4 },
      { label: 'Names the sidewalk, uptime, or winter-access targets', weight: 4 },
      { label: 'Explains that design, installation, and winter monitoring deliver the pilot', weight: 2 },
    ],
    answer:
      'This agreement provides $780,000 to install a snow-melt pilot on 420 metres of sidewalk near the regional hospital entrance and adjacent transit stops. It targets operational heating coverage across the full pilot segment, reduced ice-related closures during winter storms, and system uptime above 95 percent through the 2026 to 2027 winter season. The pilot will be delivered through detailed electrical and civil design, phased installation in the fall, and winter monitoring of surface conditions and energy use.',
    referenceScores: [0.98, 0.96, 0.95],
  },
  {
    id: 'sidewalk-snow-melt-pilot-off-topic',
    kind: 'infrastructure',
    profile: 'off_topic',
    question:
      'What does this sidewalk snow-melt pilot agreement fund, what pilot targets it sets, and how the pilot will be delivered?',
    criteria: [
      { label: 'States that the agreement funds a sidewalk snow-melt pilot', weight: 4 },
      { label: 'Names the sidewalk, uptime, or winter-access targets', weight: 4 },
      { label: 'Explains that design, installation, and winter monitoring deliver the pilot', weight: 2 },
    ],
    answer:
      'Slice basil at the last minute because bruised leaves darken quickly and lose their sharper aroma.',
    referenceScores: [0, 0, 0],
  },
  {
    id: 'harbour-dock-repair-bad',
    kind: 'infrastructure',
    profile: 'bad',
    question:
      'Summarize this harbour dock repair agreement by saying what is funded, what repair targets it sets, and how the repair work will be delivered.',
    criteria: [
      { label: 'States that the agreement funds harbour dock repair work', weight: 4 },
      { label: 'Names the dock, pile, deck, or reopening targets', weight: 4 },
      { label: 'Explains that marine engineering, contractor repair, and inspection deliver the work', weight: 2 },
    ],
    answer:
      'The agreement supports repairs at a waterfront facility. The project will improve safety and keep the site usable.',
    referenceScores: [0.65, 0.08, 0.12],
  },
  {
    id: 'harbour-dock-repair-mixed',
    kind: 'infrastructure',
    profile: 'mixed',
    question:
      'Summarize this harbour dock repair agreement by saying what is funded, what repair targets it sets, and how the repair work will be delivered.',
    criteria: [
      { label: 'States that the agreement funds harbour dock repair work', weight: 4 },
      { label: 'Names the dock, pile, deck, or reopening targets', weight: 4 },
      { label: 'Explains that marine engineering, contractor repair, and inspection deliver the work', weight: 2 },
    ],
    answer:
      'The agreement funds repair work at a damaged harbour dock used by fishing boats and ferry service. It aims to restore safe operation and complete major structural repairs during the marine construction window. The work will be delivered through marine engineering, contractor repair, and inspection.',
    referenceScores: [0.9, 0.43, 0.74],
  },
  {
    id: 'harbour-dock-repair-good',
    kind: 'infrastructure',
    profile: 'good',
    question:
      'Summarize this harbour dock repair agreement by saying what is funded, what repair targets it sets, and how the repair work will be delivered.',
    criteria: [
      { label: 'States that the agreement funds harbour dock repair work', weight: 4 },
      { label: 'Names the dock, pile, deck, or reopening targets', weight: 4 },
      { label: 'Explains that marine engineering, contractor repair, and inspection deliver the work', weight: 2 },
    ],
    answer:
      'This agreement provides $1.6 million to repair the main harbour dock at Bay Point and restore safe berthing for commercial and passenger vessels. It targets replacement of 22 deteriorated piles, rebuilding of 180 metres of deck surface, and full dock reopening before the 2027 spring season. The repair work will be delivered through marine engineering design, contractor repair staged around tides and vessel access, and structural inspection before reopening.',
    referenceScores: [0.98, 0.96, 0.95],
  },
  {
    id: 'harbour-dock-repair-off-topic',
    kind: 'infrastructure',
    profile: 'off_topic',
    question:
      'Summarize this harbour dock repair agreement by saying what is funded, what repair targets it sets, and how the repair work will be delivered.',
    criteria: [
      { label: 'States that the agreement funds harbour dock repair work', weight: 4 },
      { label: 'Names the dock, pile, deck, or reopening targets', weight: 4 },
      { label: 'Explains that marine engineering, contractor repair, and inspection deliver the work', weight: 2 },
    ],
    answer:
      'Add the fragile ornaments last when packing the box, and use clothes around them before reaching for bubble wrap.',
    referenceScores: [0, 0, 0],
  },
  {
    id: 'pedestrian-signal-retiming-bad',
    kind: 'infrastructure',
    profile: 'bad',
    question:
      'Describe this pedestrian signal retiming agreement by identifying what is funded, what crossing targets it sets, and how the retiming project will be delivered.',
    criteria: [
      { label: 'States that the agreement funds pedestrian signal retiming', weight: 4 },
      { label: 'Names the intersection, crossing-time, or accessibility targets', weight: 4 },
      { label: 'Explains that traffic analysis, signal programming, and field testing deliver the project', weight: 2 },
    ],
    answer:
      'The agreement supports intersection improvements. The project will improve pedestrian safety and make crossings work better.',
    referenceScores: [0.65, 0.08, 0.12],
  },
  {
    id: 'pedestrian-signal-retiming-mixed',
    kind: 'infrastructure',
    profile: 'mixed',
    question:
      'Describe this pedestrian signal retiming agreement by identifying what is funded, what crossing targets it sets, and how the retiming project will be delivered.',
    criteria: [
      { label: 'States that the agreement funds pedestrian signal retiming', weight: 4 },
      { label: 'Names the intersection, crossing-time, or accessibility targets', weight: 4 },
      { label: 'Explains that traffic analysis, signal programming, and field testing deliver the project', weight: 2 },
    ],
    answer:
      'The agreement funds pedestrian signal retiming at busy downtown intersections with older crossing timings. It aims to improve walk intervals and make crossings safer and easier to use during the project period. The work will be delivered through traffic analysis, signal programming, and field testing.',
    referenceScores: [0.9, 0.43, 0.74],
  },
  {
    id: 'pedestrian-signal-retiming-good',
    kind: 'infrastructure',
    profile: 'good',
    question:
      'Describe this pedestrian signal retiming agreement by identifying what is funded, what crossing targets it sets, and how the retiming project will be delivered.',
    criteria: [
      { label: 'States that the agreement funds pedestrian signal retiming', weight: 4 },
      { label: 'Names the intersection, crossing-time, or accessibility targets', weight: 4 },
      { label: 'Explains that traffic analysis, signal programming, and field testing deliver the project', weight: 2 },
    ],
    answer:
      'This agreement provides $250,000 to retime pedestrian signals at 18 downtown and school-zone intersections. It targets longer crossing intervals at all 18 sites, accessible walk timing aligned with current standards, and completion of field adjustments before the start of the 2026 school year. The project will be delivered through traffic analysis, signal controller programming, and on-street field testing with municipal traffic operations staff.',
    referenceScores: [0.98, 0.96, 0.95],
  },
  {
    id: 'pedestrian-signal-retiming-off-topic',
    kind: 'infrastructure',
    profile: 'off_topic',
    question:
      'Describe this pedestrian signal retiming agreement by identifying what is funded, what crossing targets it sets, and how the retiming project will be delivered.',
    criteria: [
      { label: 'States that the agreement funds pedestrian signal retiming', weight: 4 },
      { label: 'Names the intersection, crossing-time, or accessibility targets', weight: 4 },
      { label: 'Explains that traffic analysis, signal programming, and field testing deliver the project', weight: 2 },
    ],
    answer:
      'The dough should rest before rolling so the gluten relaxes and the pastry stops shrinking back under the pin.',
    referenceScores: [0, 0, 0],
  },
  {
    id: 'library-maker-space-bad',
    kind: 'community',
    profile: 'bad',
    question:
      'What does this library maker space agreement fund, what participation targets it sets, and how the maker space will be delivered?',
    criteria: [
      { label: 'States that the agreement funds a library maker space', weight: 4 },
      { label: 'Names the participant, session, or project-completion targets', weight: 4 },
      { label: 'Explains that equipment, facilitation, and library scheduling deliver the maker space', weight: 2 },
    ],
    answer:
      'The agreement supports learning opportunities at a public library. The project will improve access to hands-on activities and community programming.',
    referenceScores: [0.65, 0.08, 0.12],
  },
  {
    id: 'library-maker-space-mixed',
    kind: 'community',
    profile: 'mixed',
    question:
      'What does this library maker space agreement fund, what participation targets it sets, and how the maker space will be delivered?',
    criteria: [
      { label: 'States that the agreement funds a library maker space', weight: 4 },
      { label: 'Names the participant, session, or project-completion targets', weight: 4 },
      { label: 'Explains that equipment, facilitation, and library scheduling deliver the maker space', weight: 2 },
    ],
    answer:
      'The agreement funds a library maker space where youth and adults can access tools for design, fabrication, and creative technology projects. It aims to increase participation and provide more structured learning sessions during the agreement period. The maker space will be delivered through equipment purchases, facilitation, and library scheduling.',
    referenceScores: [0.9, 0.43, 0.74],
  },
  {
    id: 'library-maker-space-good',
    kind: 'community',
    profile: 'good',
    question:
      'What does this library maker space agreement fund, what participation targets it sets, and how the maker space will be delivered?',
    criteria: [
      { label: 'States that the agreement funds a library maker space', weight: 4 },
      { label: 'Names the participant, session, or project-completion targets', weight: 4 },
      { label: 'Explains that equipment, facilitation, and library scheduling deliver the maker space', weight: 2 },
    ],
    answer:
      'This agreement provides $295,000 to establish a library maker space focused on digital fabrication, coding, and electronics. It targets 340 participants, 110 facilitated sessions, and 220 completed participant projects by February 2027. The maker space will be delivered through purchase of fabrication equipment, staff and volunteer facilitation, and scheduled access blocks operated through the central library branch.',
    referenceScores: [0.98, 0.96, 0.95],
  },
  {
    id: 'library-maker-space-off-topic',
    kind: 'community',
    profile: 'off_topic',
    question:
      'What does this library maker space agreement fund, what participation targets it sets, and how the maker space will be delivered?',
    criteria: [
      { label: 'States that the agreement funds a library maker space', weight: 4 },
      { label: 'Names the participant, session, or project-completion targets', weight: 4 },
      { label: 'Explains that equipment, facilitation, and library scheduling deliver the maker space', weight: 2 },
    ],
    answer:
      'Turn the envelope so the flap opens away from you before using the letter opener; it helps avoid tearing the page inside.',
    referenceScores: [0, 0, 0],
  },
  {
    id: 'newcomer-language-cafe-bad',
    kind: 'community',
    profile: 'bad',
    question:
      'Summarize this newcomer language cafe agreement by stating what is funded, what participation targets it includes, and how the program will be delivered.',
    criteria: [
      { label: 'States that the agreement funds a newcomer language cafe', weight: 4 },
      { label: 'Names the participant, session, or language-practice targets', weight: 4 },
      { label: 'Explains that facilitators, volunteer conversation tables, and referrals deliver the program', weight: 2 },
    ],
    answer:
      'The agreement supports services for newcomers. The program will improve social connection and help people build confidence in the community.',
    referenceScores: [0.65, 0.08, 0.12],
  },
  {
    id: 'newcomer-language-cafe-mixed',
    kind: 'community',
    profile: 'mixed',
    question:
      'Summarize this newcomer language cafe agreement by stating what is funded, what participation targets it includes, and how the program will be delivered.',
    criteria: [
      { label: 'States that the agreement funds a newcomer language cafe', weight: 4 },
      { label: 'Names the participant, session, or language-practice targets', weight: 4 },
      { label: 'Explains that facilitators, volunteer conversation tables, and referrals deliver the program', weight: 2 },
    ],
    answer:
      'The agreement funds a newcomer language cafe where recent arrivals can practice English and connect to settlement supports. It aims to increase participation and provide regular conversation practice during the agreement period. The program will be delivered through facilitators, volunteer conversation tables, and referrals.',
    referenceScores: [0.9, 0.43, 0.74],
  },
  {
    id: 'newcomer-language-cafe-good',
    kind: 'community',
    profile: 'good',
    question:
      'Summarize this newcomer language cafe agreement by stating what is funded, what participation targets it includes, and how the program will be delivered.',
    criteria: [
      { label: 'States that the agreement funds a newcomer language cafe', weight: 4 },
      { label: 'Names the participant, session, or language-practice targets', weight: 4 },
      { label: 'Explains that facilitators, volunteer conversation tables, and referrals deliver the program', weight: 2 },
    ],
    answer:
      'This agreement provides $165,000 to run a newcomer language cafe for recent immigrants and refugees who need informal English practice. It targets 280 participants, 150 conversation sessions, and 190 participants completing at least ten hours of guided language practice by June 2027. The program will be delivered through trained facilitators, volunteer-led conversation tables, and settlement referrals for participants needing language classes or employment support.',
    referenceScores: [0.98, 0.96, 0.95],
  },
  {
    id: 'newcomer-language-cafe-off-topic',
    kind: 'community',
    profile: 'off_topic',
    question:
      'Summarize this newcomer language cafe agreement by stating what is funded, what participation targets it includes, and how the program will be delivered.',
    criteria: [
      { label: 'States that the agreement funds a newcomer language cafe', weight: 4 },
      { label: 'Names the participant, session, or language-practice targets', weight: 4 },
      { label: 'Explains that facilitators, volunteer conversation tables, and referrals deliver the program', weight: 2 },
    ],
    answer:
      'A slightly wetter sponge picks up crumbs better than a dry one, but it should never be dripping on the counter.',
    referenceScores: [0, 0, 0],
  },
]

if (BENCHMARK_CASES.length !== 300) {
  throw new Error(`Expected 300 benchmark cases, received ${BENCHMARK_CASES.length}.`)
}
