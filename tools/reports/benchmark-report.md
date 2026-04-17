# Benchmark Report

Cases: 300

## Raw Scoring

Mean absolute error: 5.8
Median absolute error: 3.2
Within 10 points: 236/300
Within 20 points: 290/300

By kind:
- community: count 64, MAE 6.1, reference avg 49, app avg 53.4
- health: count 56, MAE 5.5, reference avg 49.1, app avg 51.1
- housing: count 64, MAE 5.4, reference avg 49.1, app avg 52.6
- infrastructure: count 56, MAE 5.5, reference avg 49.1, app avg 50.9
- workforce: count 60, MAE 6.6, reference avg 49, app avg 53.2

By profile:
- bad: count 75, MAE 9.6, reference avg 31.6, app avg 37.4
- good: count 75, MAE 2.7, reference avg 96.7, app avg 96.6
- mixed: count 75, MAE 8.4, reference avg 68, app avg 72.6
- off_topic: count 75, MAE 2.6, reference avg 0, app avg 2.6

## Cross-Validated Calibrated Scoring

Mean absolute error: 4.4
Median absolute error: 2.7
Within 10 points: 269/300
Within 20 points: 293/300

By kind:
- community: count 64, MAE 4.6, reference avg 49, app avg 51.4
- health: count 56, MAE 4.4, reference avg 49.1, app avg 49.2
- housing: count 64, MAE 4, reference avg 49.1, app avg 50.7
- infrastructure: count 56, MAE 4, reference avg 49.1, app avg 49.3
- workforce: count 60, MAE 5, reference avg 49, app avg 51.1

By profile:
- bad: count 75, MAE 7.6, reference avg 31.6, app avg 35
- good: count 75, MAE 2.1, reference avg 96.7, app avg 94.6
- mixed: count 75, MAE 5.4, reference avg 68, app avg 69.3
- off_topic: count 75, MAE 2.6, reference avg 0, app avg 2.6

## Runtime Calibrated Scoring

Mean absolute error: 4.3
Median absolute error: 2.7
Within 10 points: 270/300
Within 20 points: 293/300

By kind:
- community: count 64, MAE 4.4, reference avg 49, app avg 51.3
- health: count 56, MAE 4.2, reference avg 49.1, app avg 49.3
- housing: count 64, MAE 3.9, reference avg 49.1, app avg 50.6
- infrastructure: count 56, MAE 4, reference avg 49.1, app avg 49.3
- workforce: count 60, MAE 4.8, reference avg 49, app avg 51.1

By profile:
- bad: count 75, MAE 7.4, reference avg 31.6, app avg 34.8
- good: count 75, MAE 1.8, reference avg 96.7, app avg 94.9
- mixed: count 75, MAE 5.3, reference avg 68, app avg 69
- off_topic: count 75, MAE 2.6, reference avg 0, app avg 2.6

## Calibration Curve

Criterion calibration knots: (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0.1, 0), (0.1, 0), (0.1, 0.1), (0.2, 0.1), (0.3, 0.1), (0.4, 0.2), (0.4, 0.5), (0.5, 0.5), (0.7, 0.7), (0.8, 0.7), (0.9, 0.7), (0.9, 0.7), (0.9, 0.7), (0.9, 0.7), (0.9, 0.7), (0.9, 0.8), (0.9, 0.8), (0.9, 0.8), (0.9, 0.8), (1, 0.9), (1, 0.9), (1, 0.9), (1, 0.9), (1, 0.9), (1, 0.9), (1, 0.9), (1, 0.9), (1, 0.9), (1, 0.9), (1, 0.9), (1, 0.9), (1, 0.9), (1, 0.9), (1, 0.9), (1, 0.9), (1, 0.9), (1, 1)
Overall calibration knots: (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0.1, 0), (0.1, 0), (0.1, 0), (0.1, 0), (0.1, 0), (0.1, 0), (0.1, 0), (0.1, 0), (0.1, 0), (0.1, 0.1), (0.1, 0.1), (0.2, 0.3), (0.3, 0.3), (0.3, 0.3), (0.3, 0.3), (0.3, 0.3), (0.3, 0.3), (0.3, 0.3), (0.3, 0.3), (0.3, 0.3), (0.3, 0.3), (0.3, 0.3), (0.3, 0.3), (0.3, 0.3), (0.3, 0.3), (0.3, 0.3), (0.3, 0.3), (0.3, 0.3), (0.3, 0.3), (0.3, 0.3), (0.3, 0.3), (0.3, 0.3), (0.3, 0.3), (0.3, 0.3), (0.3, 0.3), (0.3, 0.3), (0.3, 0.3), (0.3, 0.3), (0.3, 0.3), (0.3, 0.3), (0.3, 0.3), (0.3, 0.3), (0.3, 0.3), (0.4, 0.3), (0.4, 0.3), (0.4, 0.3), (0.4, 0.3), (0.4, 0.3), (0.4, 0.3), (0.4, 0.3), (0.4, 0.3), (0.4, 0.3), (0.4, 0.3), (0.4, 0.3), (0.4, 0.3), (0.4, 0.3), (0.4, 0.3), (0.4, 0.3), (0.4, 0.3), (0.4, 0.3), (0.4, 0.3), (0.4, 0.3), (0.4, 0.3), (0.4, 0.3), (0.4, 0.3), (0.4, 0.3), (0.4, 0.3), (0.4, 0.3), (0.4, 0.4), (0.5, 0.4), (0.5, 0.5), (0.5, 0.5), (0.5, 0.5), (0.5, 0.5), (0.6, 0.5), (0.6, 0.5), (0.6, 0.5), (0.6, 0.5), (0.6, 0.6), (0.6, 0.6), (0.6, 0.7), (0.7, 0.7), (0.7, 0.7), (0.7, 0.7), (0.7, 0.7), (0.7, 0.7), (0.7, 0.7), (0.8, 0.7), (0.8, 0.7), (0.8, 0.9), (0.9, 0.9), (0.9, 1), (0.9, 1), (0.9, 1), (1, 1), (1, 1)

## Top Cross-Validated Misses

- food-security-breakfast-bad: ref 31.6, app 65.9, diff 34.3, gate 0.9, answer 1, constraint 1
  Q: Explain this school breakfast agreement: what is funded, what meal or student targets it expects, a…
  A: The agreement supports food security for students. The organization will use the funding to improve access to meals and reduce hunger at sc…
- indigenous-remote-workforce-bad: ref 31.6, app 58.6, diff 27, gate 0.9, answer 1, constraint 0.6
  Q: Explain this Indigenous remote workforce agreement: what employment support is funded, what placeme…
  A: The agreement supports employment opportunities in remote communities. The recipient will use the funding to improve access to jobs and str…
- neighbourhood-cleanup-microgrants-bad: ref 31.6, app 58.4, diff 26.8, gate 0.9, answer 1, constraint 1
  Q: Describe this neighbourhood cleanup microgrants agreement by identifying what is funded, what clean…
  A: The agreement supports neighbourhood improvement activities. The funding will help residents take part in community cleanups and local proj…
- asthma-home-visits-mixed: ref 68, app 42.6, diff -25.4, gate 1, answer 1, constraint 0.9
  Q: Explain this childhood asthma home-visit agreement: what service is funded, what client results it …
  A: The agreement funds home-visit support for children with asthma and their families. It aims to increase visits and reduce urgent asthma epi…
- modular-housing-site-setup-mixed: ref 68, app 45.1, diff -22.9, gate 1, answer 1, constraint 0.9
  Q: Summarize this modular housing site setup agreement: what is funded, what setup targets it includes…
  A: The agreement funds site setup for a modular housing project intended to create new supportive housing capacity quickly. It aims to prepare…
- supportive-housing-renovation-bad: ref 31.6, app 52.8, diff 21.2, gate 0.9, answer 1, constraint 0.8
  Q: What does this supportive housing renovation agreement fund, what upgrade targets it sets, and how …
  A: The agreement supports housing improvements for people who need stable accommodation. The organization will use the funding to improve the …
- social-enterprise-placements-mixed: ref 68, app 47.2, diff -20.8, gate 1, answer 1, constraint 0.9
  Q: Summarize this social enterprise placement agreement: what program is funded, what participant outc…
  A: The agreement funds social enterprise work placements for people facing barriers to employment. It aims to expand placements and support mo…
- community-nutrition-cooking-bad: ref 31.6, app 51.2, diff 19.6, gate 0.9, answer 1, constraint 0.9
  Q: Summarize this community nutrition and cooking agreement: what service is funded, what participatio…
  A: The agreement supports nutrition services in the community. The organization will use the funding to improve healthy eating and practical f…
- career-navigation-care-leavers-bad: ref 31.6, app 51.1, diff 19.5, gate 0.9, answer 0.9, constraint 0.8
  Q: What does this career navigation agreement for youth leaving care fund, what employment outcomes it…
  A: The agreement supports career services for youth leaving care. The provider will use the funding to improve pathways into work and adulthoo…
- women-trades-bootcamp-bad: ref 31.6, app 49.1, diff 17.5, gate 0.9, answer 0.9, constraint 0.9
  Q: What does this women-in-trades bootcamp agreement say is being funded, what enrolment and certifica…
  A: This agreement funds a program for women interested in the trades. It is intended to improve confidence and create stronger career pathways…
- coding-bridge-program-good: ref 96.6, app 79.3, diff -17.3, gate 1, answer 0.9, constraint 0.6
  Q: Explain this coding bridge agreement: what training is funded, what learner outcomes it expects, an…
  A: This agreement provides $760,000 for a coding bridge program focused on front-end development, QA testing, and support engineering. It targ…
- home-care-expansion-mixed: ref 67.6, app 50.3, diff -17.3, gate 1, answer 1, constraint 0.9
  Q: According to this home care expansion agreement, what is funded, what visit and caseload targets it…
  A: The agreement funds expanded home care visits and nursing support for high-needs clients. It is expected to increase service volume and red…
- food-pantry-cold-storage-bad: ref 31.6, app 48.9, diff 17.3, gate 0.9, answer 0.9, constraint 0.9
  Q: What does this food pantry cold-storage agreement fund, what capacity targets it expects, and how t…
  A: The agreement supports improvements to food distribution services. The project will help the pantry serve people more effectively and reduc…
- midcareer-reskilling-bad: ref 31.6, app 48, diff 16.4, gate 0.9, answer 1, constraint 0.9
  Q: Summarize this mid-career reskilling agreement: what training is funded, what completion or job-tra…
  A: The agreement supports reskilling for adults who need new work opportunities. The recipient will use the funding to improve training access…
- tele-rehab-good: ref 96.6, app 81.4, diff -15.2, gate 1, answer 1, constraint 1
  Q: Summarize this tele-rehab agreement: what service is funded, what patient outcomes it expects, and …
  A: This agreement provides $630,000 for tele-rehabilitation serving patients recovering from orthopaedic surgery, stroke, and workplace injuri…
