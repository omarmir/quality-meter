# Benchmark Report

Cases: 100

## Raw Scoring

Mean absolute error: 6.5
Median absolute error: 3.9
Within 10 points: 74/100
Within 20 points: 97/100

By kind:
- community: count 20, MAE 8.5, reference avg 49, app avg 53.7
- health: count 20, MAE 3.8, reference avg 49.2, app avg 50.3
- housing: count 20, MAE 6.7, reference avg 49.1, app avg 53.9
- infrastructure: count 20, MAE 7, reference avg 49.1, app avg 50.9
- workforce: count 20, MAE 6.3, reference avg 49, app avg 52

By profile:
- bad: count 25, MAE 11.2, reference avg 31.6, app avg 42.2
- good: count 25, MAE 5.8, reference avg 96.8, app avg 91.4
- mixed: count 25, MAE 6.4, reference avg 67.9, app avg 72.7
- off_topic: count 25, MAE 2.3, reference avg 0, app avg 2.3

## Cross-Validated Calibrated Scoring

Mean absolute error: 5.2
Median absolute error: 3
Within 10 points: 87/100
Within 20 points: 98/100

By kind:
- community: count 20, MAE 6.6, reference avg 49, app avg 52.9
- health: count 20, MAE 3.1, reference avg 49.2, app avg 49.4
- housing: count 20, MAE 5.2, reference avg 49.1, app avg 51.9
- infrastructure: count 20, MAE 5.6, reference avg 49.1, app avg 50.1
- workforce: count 20, MAE 5.4, reference avg 49, app avg 50.6

By profile:
- bad: count 25, MAE 9.1, reference avg 31.6, app avg 40.3
- good: count 25, MAE 4.6, reference avg 96.8, app avg 92.2
- mixed: count 25, MAE 4.9, reference avg 67.9, app avg 69
- off_topic: count 25, MAE 2.3, reference avg 0, app avg 2.3

## Runtime Calibrated Scoring

Mean absolute error: 4.8
Median absolute error: 2.8
Within 10 points: 89/100
Within 20 points: 99/100

By kind:
- community: count 20, MAE 6.3, reference avg 49, app avg 52.5
- health: count 20, MAE 2.7, reference avg 49.2, app avg 49.2
- housing: count 20, MAE 4.8, reference avg 49.1, app avg 51.7
- infrastructure: count 20, MAE 5.1, reference avg 49.1, app avg 49.9
- workforce: count 20, MAE 5.1, reference avg 49, app avg 50.6

By profile:
- bad: count 25, MAE 8.6, reference avg 31.6, app avg 39.6
- good: count 25, MAE 4.5, reference avg 96.8, app avg 92.3
- mixed: count 25, MAE 3.9, reference avg 67.9, app avg 69
- off_topic: count 25, MAE 2.3, reference avg 0, app avg 2.3

## Calibration Curve

Criterion calibration knots: (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0.1, 0), (0.1, 0), (0.1, 0.1), (0.1, 0.1), (0.1, 0.1), (0.2, 0.1), (0.3, 0.2), (0.5, 0.2), (0.5, 0.4), (0.6, 0.4), (0.7, 0.7), (0.8, 0.7), (0.9, 0.8), (0.9, 0.9), (1, 0.9), (1, 0.9), (1, 0.9), (1, 0.9), (1, 0.9), (1, 1)
Overall calibration knots: (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0.1, 0), (0.1, 0), (0.1, 0.1), (0.1, 0.1), (0.3, 0.2), (0.3, 0.3), (0.3, 0.3), (0.3, 0.3), (0.3, 0.3), (0.3, 0.3), (0.3, 0.3), (0.3, 0.3), (0.3, 0.3), (0.4, 0.3), (0.4, 0.3), (0.4, 0.3), (0.4, 0.3), (0.4, 0.3), (0.4, 0.3), (0.4, 0.3), (0.4, 0.3), (0.4, 0.3), (0.4, 0.3), (0.5, 0.3), (0.5, 0.3), (0.5, 0.3), (0.5, 0.3), (0.5, 0.5), (0.5, 0.5), (0.5, 0.6), (0.7, 0.6), (0.7, 0.7), (0.7, 0.7), (0.7, 0.7), (0.7, 0.7), (0.8, 0.7), (0.8, 0.7), (0.8, 0.9), (0.9, 0.9), (0.9, 1), (0.9, 1), (0.9, 1), (0.9, 1), (0.9, 1), (0.9, 1), (1, 1), (1, 1), (1, 1), (1, 1)

## Top Cross-Validated Misses

- food-security-breakfast-bad: ref 31.6, app 66.8, diff 35.2, gate 0.9, answer 1, constraint 1
  Q: Explain this school breakfast agreement: what is funded, what meal or student targets it expects, a…
  A: The agreement supports food security for students. The organization will use the funding to improve access to meals and reduce hunger at sc…
- homelessness-prevention-rent-bank-bad: ref 31.6, app 52.7, diff 21.1, gate 0.9, answer 1, constraint 1
  Q: Summarize this homelessness prevention rent bank agreement: what is funded, what household outcomes…
  A: The agreement funds homelessness prevention work in the community. The organization will use the support to respond to housing pressures an…
- farm-irrigation-upgrades-bad: ref 31.6, app 50.5, diff 18.9, gate 0.9, answer 1, constraint 0.8
  Q: Explain this farm irrigation upgrade agreement: what work it funds, what installation outcomes it s…
  A: The agreement funds agricultural improvements. The recipient will use the support to improve water management and strengthen farm operation…
- newcomer-language-jobs-mixed: ref 67.8, app 52.1, diff -15.7, gate 1, answer 1, constraint 0.7
  Q: Summarize this newcomer language-to-jobs agreement: what it funds, what employment results it expec…
  A: The agreement funds employment-focused language training for recent newcomers. It aims to move more participants into recognized credential…
- afterschool-stem-bad: ref 31.6, app 46.5, diff 14.9, gate 0.9, answer 1, constraint 0.9
  Q: Summarize this after-school STEM agreement: what program is funded, what student participation resu…
  A: The agreement supports educational programming for students. The recipient will use the funding to improve learning opportunities after sch…
- newcomer-transitional-housing-bad: ref 31.6, app 45.8, diff 14.2, gate 0.9, answer 1, constraint 0.9
  Q: According to this newcomer transitional housing agreement, what is being funded, what occupancy and…
  A: The agreement supports housing for newcomer families. The funding will improve stability and help people settle into the community.
- apprenticeship-retention-bad: ref 31.6, app 45.4, diff 13.8, gate 0.9, answer 1, constraint 0.8
  Q: Explain this apprenticeship retention agreement: what program is being funded, what completion targ…
  A: The funding will support apprentices in the area. The sponsor will use the agreement to improve retention and strengthen relationships with…
- supportive-housing-tenancy-bad: ref 31.6, app 44.7, diff 13.1, gate 0.9, answer 1, constraint 1
  Q: Explain this supportive housing tenancy agreement: what service it funds, what tenant-stability tar…
  A: The agreement provides support for housing stability. The service will help residents and improve the quality of support available to them.
- farm-irrigation-upgrades-mixed: ref 67.6, app 80.6, diff 13, gate 1, answer 0.9, constraint 1
  Q: Explain this farm irrigation upgrade agreement: what work it funds, what installation outcomes it s…
  A: The agreement funds irrigation efficiency upgrades for farms facing water constraints. It is expected to support more equipment installatio…
- afterschool-stem-off-topic: ref 0, app 12.2, diff 12.2, gate 0.7, answer 0.9, constraint 1
  Q: Summarize this after-school STEM agreement: what program is funded, what student participation resu…
  A: Store the herbs upright in a jar with a little water, cover loosely with a bag, and trim the stems every few days.
- women-trades-bootcamp-bad: ref 31.6, app 43.6, diff 12, gate 0.9, answer 0.9, constraint 0.9
  Q: What does this women-in-trades bootcamp agreement say is being funded, what enrolment and certifica…
  A: This agreement funds a program for women interested in the trades. It is intended to improve confidence and create stronger career pathways…
- opioid-outreach-bad: ref 31.6, app 43.1, diff 11.5, gate 0.9, answer 0.9, constraint 1
  Q: What does this opioid outreach agreement say is being funded, what service or supply targets it exp…
  A: The agreement supports outreach services for people dealing with substance use. It is intended to improve community response and reduce har…
- youth-employment-rural-bad: ref 31.6, app 41.9, diff 10.3, gate 0.9, answer 1, constraint 0.8
  Q: Summarize this rural youth employment agreement: what is funded, what participant and placement tar…
  A: This agreement provides funding to support youth services in the region. The organization will use the funding over the agreement period to…
- shelter-expansion-bad: ref 31.6, app 41.5, diff 9.9, gate 0.9, answer 0.9, constraint 1
  Q: What does this shelter expansion agreement say is being funded, what bed or client targets it sets,…
  A: The agreement funds shelter services. The recipient will use the money to improve access and better serve people who need temporary accommo…
- community-mental-health-good: ref 97, app 87.2, diff -9.8, gate 1, answer 1, constraint 0.4
  Q: Explain this community mental health agreement: what service it funds, what client and wait-time ou…
  A: This agreement provides $1.2 million to expand community mental health counselling and crisis navigation for adults and youth. It targets 1…
