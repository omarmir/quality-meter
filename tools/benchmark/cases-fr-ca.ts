import {
  BENCHMARK_CASES,
  type BenchmarkCase,
  type BenchmarkCriterion,
  type BenchmarkProfile,
} from './cases'

type ScenarioTranslation = {
  question: string
  criteria: [string, string, string]
  answers: Record<BenchmarkProfile, string>
}

const SCENARIO_TRANSLATIONS: Record<string, ScenarioTranslation> = {
  'youth-employment-rural': {
    question:
      'Résumez cette entente sur l’emploi des jeunes en milieu rural : ce qui est financé, les cibles de participation et de placement qu’elle fixe, et la façon dont l’organisation prévoit réaliser le travail.',
    criteria: [
      'Indique que le financement élargit le soutien à l’emploi des jeunes en milieu rural',
      'Nomme les cibles de participants, de plans de formation et de placements',
      'Explique que la mise en oeuvre repose sur des ateliers, de la gestion de cas et des placements chez des employeurs',
    ],
    answers: {
      bad: 'Cette entente prévoit du financement pour soutenir des services destinés aux jeunes dans la région. L’organisation utilisera les fonds pendant la durée de l’entente pour améliorer les résultats et répondre aux besoins locaux.',
      mixed:
        'Cette entente finance du soutien à l’emploi des jeunes dans trois collectivités rurales. Elle vise à aider davantage de jeunes à accéder à de la formation et à des placements en emploi au cours de la prochaine année. Le bénéficiaire travaillera avec des employeurs locaux et des partenaires communautaires pour offrir des ateliers, des aiguillages et du coaching.',
      good:
        'L’entente prévoit 750 000 $ pour élargir le soutien à l’emploi des jeunes sans travail de 18 à 24 ans dans trois collectivités rurales. Elle cible 300 participants, 180 plans de formation complétés et 120 placements en emploi d’ici le 31 mars 2027. La mise en oeuvre se fera au moyen d’ateliers hebdomadaires de préparation à l’emploi, de gestion de cas individuelle, de partenariats avec les employeurs pour les placements et de revues mensuelles des progrès par rapport aux cibles d’inscription et de placement.',
      off_topic:
        'Éloignez le routeur des murs épais, séparez les bandes de 2,4 GHz et de 5 GHz, puis testez de nouveau les vitesses avant d’acheter du nouveau matériel.',
    },
  },
  'apprenticeship-retention': {
    question:
      'Expliquez cette entente sur la rétention des apprentis : quel programme est financé, à quelles cibles d’achèvement elle s’engage et comment le promoteur compte maintenir la mobilisation des apprentis.',
    criteria: [
      'Indique que le financement soutient la rétention des apprentis des métiers spécialisés de première et de deuxième année',
      'Nomme les cibles d’inscription, de mentorat et d’achèvement',
      'Explique que le mode de prestation repose sur du coaching, des suivis auprès des employeurs et des mesures d’urgence',
    ],
    answers: {
      bad:
        'Le financement soutiendra des apprentis de la région. Le promoteur utilisera l’entente pour améliorer la rétention et renforcer, avec le temps, les liens avec les employeurs.',
      mixed:
        'L’entente finance un programme de rétention pour des apprentis des métiers spécialisés en début de parcours. Elle vise à accroître le recours au mentorat et à aider plus d’apprentis à terminer leurs blocs de formation cette année. La mise en oeuvre comprendra des suivis auprès des employeurs, des appels de coaching et du soutien ponctuel pour les outils ou le transport lorsque les apprentis rencontrent des obstacles.',
      good:
        'Cette entente prévoit 620 000 $ pour un programme de rétention destiné aux apprentis de première et de deuxième année en charpenterie, en électricité et en plomberie. Elle s’engage à compter 240 apprentis inscrits, 200 jumelages de mentorat actifs et 170 blocs de formation terminés d’ici juin 2027. Le promoteur atteindra ces cibles au moyen d’appels de coaching mensuels, de vérifications trimestrielles auprès des employeurs, de bons d’urgence pour les outils et le transport et de revues de présence avec les fournisseurs de formation.',
      off_topic:
        'Commencez le souper en faisant rôtir les légumes à feu vif, faites cuire les pâtes séparément, puis terminez avec du citron et de l’huile d’olive.',
    },
  },
  'disability-employment-support': {
    question:
      'Selon cette entente sur le soutien à l’emploi des personnes handicapées, quel service est financé, quels résultats d’embauche sont attendus et comment l’organisation livrera ces résultats?',
    criteria: [
      'Indique que l’entente finance du soutien à l’emploi des personnes handicapées et du coaching en emploi',
      'Nomme les résultats attendus de participation, de mobilisation des employeurs et de placement',
      'Explique que l’approche de prestation repose sur le coaching, les évaluations du milieu de travail et la mobilisation des employeurs',
    ],
    answers: {
      bad:
        'L’organisation reçoit du financement pour soutenir l’emploi inclusif. L’entente aidera à améliorer les possibilités offertes et à renforcer les partenariats communautaires.',
      mixed:
        'L’entente finance du soutien à l’emploi des personnes handicapées, y compris du coaching en emploi pour des adultes à la recherche d’un travail. On s’attend à ce qu’elle aide davantage de participants à entrer en contact avec des employeurs et à accéder à des placements rémunérés cette année. L’organisation réalisera le travail au moyen de séances de coaching, d’évaluations du milieu de travail et d’activités de mobilisation des employeurs.',
      good:
        'L’entente prévoit 540 000 $ pour élargir le soutien à l’emploi des personnes handicapées et le coaching en emploi individualisé pour des adultes faisant face à des obstacles au travail. Elle cible 180 participants, 90 plans de mobilisation des employeurs et 75 placements rémunérés d’ici décembre 2026. La mise en oeuvre comprendra du coaching individuel, des évaluations de l’accessibilité en milieu de travail, des visites de mobilisation auprès des employeurs et des suivis de maintien à 30 et à 90 jours.',
      off_topic:
        'Si la batterie de votre téléphone se vide rapidement, baissez la luminosité de l’écran, désactivez l’actualisation en arrière-plan et remplacez d’abord les vieux câbles de recharge.',
    },
  },
  'newcomer-language-jobs': {
    question:
      'Résumez cette entente liant langue et emploi pour les nouveaux arrivants : ce qu’elle finance, les résultats d’emploi attendus et la façon dont le bénéficiaire prévoit livrer ces résultats.',
    criteria: [
      'Indique que le financement soutient de la formation linguistique liée à l’emploi pour les nouveaux arrivants',
      'Nomme les cibles de cohortes, d’attestations et de placements en emploi',
      'Explique que le mode de prestation repose sur des cours, du coaching propre au métier et des aiguillages vers des employeurs',
    ],
    answers: {
      bad:
        'L’entente finance de la programmation d’établissement pour les nouveaux arrivants. Le bénéficiaire utilisera les fonds pour améliorer l’accès aux services et aider les gens à réussir dans l’économie locale.',
      mixed:
        'L’entente finance de la formation linguistique axée sur l’emploi pour des nouveaux arrivants récents. Elle vise à faire accéder davantage de participants à des attestations reconnues et à des emplois pendant l’année de l’entente. La mise en oeuvre comprendra des cours de langue, du coaching sectoriel et des aiguillages vers des employeurs qui embauchent.',
      good:
        'Cette entente prévoit 810 000 $ pour de la formation linguistique axée sur l’emploi destinée aux nouveaux arrivants dans les secteurs des soins de santé, de la transformation alimentaire et de la logistique. Elle cible 24 cohortes, 220 apprenants, 140 attestations complétées et 95 placements en emploi d’ici août 2027. Le bénéficiaire atteindra ces cibles au moyen de cours de langue propres au métier, de séances de coaching en soirée, d’aiguillages vers des employeurs et de conférences de cas mensuelles pour les participants à risque d’abandon.',
      off_topic:
        'Rempotez la plante dans du terreau neuf, taillez les feuilles mortes et n’arrosez que lorsque le premier pouce de terre est sec.',
    },
  },
  'women-trades-bootcamp': {
    question:
      'Que dit cette entente sur un camp intensif Femmes dans les métiers spécialisés au sujet de ce qui est financé, des résultats attendus en matière d’inscription et de certification, et de la façon dont ces résultats seront livrés?',
    criteria: [
      'Indique que le financement soutient un camp intensif Femmes dans les métiers spécialisés',
      'Nomme les cibles d’inscription, de certification en sécurité et d’aiguillage vers l’apprentissage',
      'Explique que le programme repose sur de l’enseignement en camp intensif, du mentorat et des journées d’exposition auprès des employeurs',
    ],
    answers: {
      bad:
        'Cette entente finance un programme pour les femmes intéressées par les métiers spécialisés. Elle vise à renforcer la confiance et à créer, avec le temps, de meilleurs parcours de carrière.',
      mixed:
        'L’entente finance un camp intensif Femmes dans les métiers spécialisés pour des personnes qui envisagent des carrières en électricité, en soudage et en charpenterie. On s’attend à ce qu’elle amène davantage de participantes vers des certifications et des aiguillages vers l’apprentissage cette année. La mise en oeuvre comprendra de courts blocs de formation pratique, du mentorat et des journées d’exposition auprès des employeurs.',
      good:
        'L’entente prévoit 430 000 $ pour un camp intensif Femmes dans les métiers spécialisés axé sur les voies d’entrée en électricité, en soudage et en charpenterie. Elle cible 90 inscriptions, 75 certifications en sécurité et 50 aiguillages vers l’apprentissage d’ici novembre 2026. Le bénéficiaire réalisera le travail au moyen de cohortes intensives de huit semaines, d’enseignement pratique en atelier, de mentors jumelés issus de syndicats locaux et de journées d’exposition avec des entrepreneurs participants.',
      off_topic:
        'Pour réduire les reflets dans une pièce, installez un protecteur d’écran mat, placez la lampe derrière le moniteur et baissez légèrement le contraste de l’écran.',
    },
  },
  'community-mental-health': {
    question:
      'Expliquez cette entente en santé mentale communautaire : quel service elle finance, quels résultats elle attend pour les clients et les délais d’attente, et comment le service sera offert.',
    criteria: [
      'Indique que l’entente finance du counseling en santé mentale communautaire et de la navigation de crise',
      'Nomme les résultats visés pour le volume de clients et la réduction des délais d’attente',
      'Explique que le modèle de prestation repose sur des équipes de counseling, un triage centralisé à l’accueil et des cliniques de proximité',
    ],
    answers: {
      bad:
        'L’entente finance des services de santé mentale dans la communauté. Le service vise à améliorer l’accès et à mieux répondre à la demande locale.',
      mixed:
        'L’entente finance du counseling communautaire et de la navigation de crise pour des adultes qui ont besoin d’un accès plus rapide aux soins. Elle vise à servir davantage de clients et à raccourcir l’attente avant le premier rendez-vous au cours de la prochaine année. La prestation reposera sur des conseillers, un triage centralisé à l’accueil et des journées de clinique de proximité dans des sites de quartier.',
      good:
        'Cette entente prévoit 1,2 million de dollars pour élargir les services de counseling en santé mentale communautaire et de navigation de crise destinés aux adultes et aux jeunes. Elle cible 1 100 clients en counseling, 450 dossiers de navigation de crise et une réduction du délai d’attente avant un premier rendez-vous de 28 à 14 jours d’ici mars 2027. Le service sera livré par deux nouvelles équipes de counseling, un triage centralisé à l’accueil, des cliniques de proximité en soirée et des revues mensuelles de la file d’attente afin de rééquilibrer les rendez-vous.',
      off_topic:
        'Aiguisez la lame de la tondeuse une fois par saison, évitez de couper le gazon mouillé et changez de direction à chaque passage pour réduire les ornières.',
    },
  },
  'maternal-health-outreach': {
    question:
      'Résumez cette entente sur le soutien en santé maternelle : à quoi sert le financement, quelles cibles de visites ou de dépistage elle fixe, et comment le bénéficiaire offrira le service.',
    criteria: [
      'Indique que le financement soutient le soutien en santé maternelle et l’accès au dépistage prénatal',
      'Nomme les cibles de visites à domicile, de dépistages et de suivis',
      'Explique que le travail sera livré par des infirmières, des intervenants communautaires et un suivi des aiguillages',
    ],
    answers: {
      bad:
        'L’entente soutient des services de santé maternelle dans des secteurs mal desservis. Le bénéficiaire utilisera les fonds pour améliorer l’accès et mieux coordonner les soins.',
      mixed:
        'L’entente finance du soutien en santé maternelle afin qu’un plus grand nombre de personnes enceintes puissent accéder au dépistage prénatal et à un suivi précoce. On s’attend à ce qu’elle augmente les visites à domicile et relie davantage de personnes aux dépistages pendant l’année de l’entente. La prestation reposera sur des infirmières en santé publique, des intervenants communautaires et des aiguillages suivis vers les services hospitaliers et de première ligne.',
      good:
        'Cette entente prévoit 690 000 $ pour du soutien en santé maternelle dans quatre quartiers mal desservis. Elle cible 500 visites prénatales à domicile, 320 aiguillages complétés vers le dépistage prénatal et 280 contacts de suivi après dépistage d’ici février 2027. La mise en oeuvre se fera par des équipes infirmières de visites à domicile, des intervenants communautaires qui soutiennent les rendez-vous et un système de suivi des aiguillages examiné chaque mois avec les partenaires hospitaliers.',
      off_topic:
        'Nettoyez les gouttières avant la saison des pluies, prolongez les descentes pluviales et vérifiez la pente près des fondations après de fortes tempêtes.',
    },
  },
  'opioid-outreach': {
    question:
      'Que dit cette entente sur le soutien lié aux opioïdes au sujet de ce qui est financé, des cibles de service ou de fournitures attendues et de la façon dont ces cibles seront livrées?',
    criteria: [
      'Indique que le financement soutient des services de soutien liés aux opioïdes et de réduction des méfaits',
      'Nomme les cibles de contacts de proximité, de naloxone et d’aiguillage',
      'Explique que le mode de prestation repose sur le travail de rue, des pairs aidants et le suivi des aiguillages',
    ],
    answers: {
      bad:
        'L’entente soutient des services de proximité pour des personnes aux prises avec la consommation de substances. Elle vise à améliorer la réponse communautaire et à réduire les méfaits.',
      mixed:
        'L’entente finance du soutien lié aux opioïdes et de la réduction des méfaits dans des secteurs où le risque de surdose est élevé. Elle vise à augmenter les contacts de proximité, la distribution de naloxone et les aiguillages vers le traitement au cours de l’année. La prestation reposera sur des équipes de rue, des pairs aidants et des appels de suivi une fois les aiguillages effectués.',
      good:
        'Cette entente prévoit 980 000 $ pour des services de soutien liés aux opioïdes et de réduction des méfaits dans les corridors du centre-ville et du front fluvial. Elle cible 4 500 contacts de proximité, 2 800 trousses de naloxone distribuées et 600 aiguillages complétés vers le traitement d’ici décembre 2026. Le bénéficiaire atteindra ces cibles au moyen de quarts quotidiens de travail de rue, de l’engagement de pairs aidants, d’arrimages le jour même avec des fournisseurs de traitement et d’un suivi hebdomadaire des aiguillages.',
      off_topic:
        'Utilisez un parasurtenseur, étiquetez les cordons d’alimentation et placez l’imprimante près du routeur si vous voulez moins de problèmes au bureau.',
    },
  },
  'home-care-expansion': {
    question:
      'Selon cette entente sur l’élargissement des soins à domicile, qu’est-ce qui est financé, quelles cibles de visites et de charge de cas sont attendues, et comment le fournisseur réalisera l’élargissement.',
    criteria: [
      'Indique que l’entente finance l’augmentation des visites de soins à domicile et du soutien infirmier',
      'Nomme les cibles de visites, d’embauche d’infirmières et de charge de cas',
      'Explique que le plan de prestation repose sur le recrutement infirmier, l’horaire et des revues de coordination des soins',
    ],
    answers: {
      bad:
        'L’entente finance des améliorations aux soins à domicile. Le fournisseur utilisera ce soutien pour élargir les services et améliorer l’expérience des clients.',
      mixed:
        'L’entente finance davantage de visites de soins à domicile et de soutien infirmier pour des clients ayant des besoins élevés. On s’attend à ce qu’elle augmente le volume de services et réduise les charges de cas surchargées pendant la prochaine année de l’entente. Le fournisseur recrutera des infirmières supplémentaires, reverra l’horaire et examinera chaque semaine la coordination des soins.',
      good:
        'Cette entente prévoit 1,05 million de dollars pour élargir les visites infirmières et de soutien personnel à domicile pour des clients ayant des besoins élevés après un congé d’hôpital. Elle cible 12 000 visites additionnelles à domicile, 8 nouvelles infirmières et des charges moyennes inférieures à 42 clients par infirmière d’ici mars 2027. Le fournisseur réalisera l’élargissement grâce à un recrutement progressif d’infirmières, à une planification centralisée sept jours sur sept et à des revues hebdomadaires de coordination des soins avec les équipes de congé hospitalier.',
      off_topic:
        'Poncez légèrement les portes d’armoire, appliquez un apprêt d’adhérence et laissez sécher complètement chaque couche avant de remettre la quincaillerie.',
    },
  },
  'mobile-dental-clinic': {
    question:
      'Expliquez cette entente sur une clinique dentaire mobile : quel service est financé, quels volumes de dépistage et de traitement sont attendus, et comment le service sera livré.',
    criteria: [
      'Indique que l’entente finance un service de clinique dentaire mobile',
      'Nomme les cibles de dépistage, de traitement et de sites scolaires',
      'Explique que le travail est livré par des rotations de clinique, du personnel dentaire et un horaire avec les écoles',
    ],
    answers: {
      bad:
        'L’entente soutient des services de santé buccodentaire pour les enfants. Le bénéficiaire utilisera les fonds pour améliorer l’accès et réduire les besoins non comblés.',
      mixed:
        'L’entente finance une clinique dentaire mobile pour les enfants fréquentant des écoles qui ont un accès limité aux soins buccodentaires. Elle vise à augmenter les dépistages et les visites de traitement pendant l’année scolaire. La prestation reposera sur des journées de clinique en rotation, du personnel dentaire dans l’unité mobile et des visites planifiées dans les écoles.',
      good:
        'Cette entente prévoit 560 000 $ pour une clinique dentaire mobile desservant des écoles primaires dans des secteurs éloignés et à faible revenu. Elle cible 2 200 dépistages, 650 visites de traitement et 28 sites scolaires d’ici juin 2027. La prestation se fera au moyen d’un calendrier rotatif de la clinique mobile, d’un dentiste et de deux assistantes dentaires à chaque visite et d’une planification par trimestre avec les écoles participantes.',
      off_topic:
        'Gardez la valise plus légère en roulant chaque ensemble, en emportant une seule paire de chaussures neutres et en lavant les petits articles dans le lavabo.',
    },
  },
  'homelessness-prevention-rent-bank': {
    question:
      'Résumez cette entente sur une banque de loyer pour prévenir l’itinérance : ce qui est financé, les résultats visés pour les ménages et la façon dont le service sera livré.',
    criteria: [
      'Indique que l’entente finance une banque de loyer et un service de prévention des expulsions',
      'Nomme les cibles relatives aux ménages, aux arriérés et à la stabilité en logement',
      'Explique que la prestation repose sur des subventions, de la médiation et de la gestion de cas',
    ],
    answers: {
      bad:
        'L’entente finance du travail de prévention de l’itinérance dans la communauté. L’organisation utilisera ce soutien pour répondre aux pressions liées au logement et améliorer la stabilité.',
      mixed:
        'L’entente finance une banque de loyer et un service de prévention des expulsions pour des locataires immédiatement à risque de perdre leur logement. Elle vise à aider davantage de ménages à régler leurs arriérés et à demeurer logés cette année. La prestation comprendra des subventions ponctuelles, de la médiation avec les propriétaires et de la gestion de cas à court terme.',
      good:
        'Cette entente prévoit 900 000 $ pour une banque de loyer et un service de prévention des expulsions destiné à des locataires à faible revenu confrontés à des arriérés temporaires. Elle cible 420 ménages servis, 1,1 million de dollars d’arriérés réglés et 360 ménages toujours logés six mois après l’aide d’ici mars 2027. Le service sera offert au moyen de subventions ponctuelles, de médiation avec les propriétaires, de gestion de cas en logement et de vérifications mensuelles du maintien en logement.',
      off_topic:
        'Refroidissez la pâte avant la cuisson, tournez la plaque à mi-cuisson et laissez les biscuits reposer deux minutes sur la plaque avant de les déplacer.',
    },
  },
  'shelter-expansion': {
    question:
      'Que dit cette entente sur l’agrandissement d’un refuge au sujet de ce qui est financé, des cibles de lits ou de clients qu’elle fixe, et de la façon dont l’agrandissement sera livré?',
    criteria: [
      'Indique que le financement augmente la capacité d’hébergement d’urgence et les services de soutien',
      'Nomme les cibles de nouveaux lits, d’occupation et de services aux clients',
      'Explique que le mode de prestation repose sur le personnel, des rénovations et la coordination de l’accueil',
    ],
    answers: {
      bad:
        'L’entente finance des services d’hébergement. Le bénéficiaire utilisera les fonds pour améliorer l’accès et mieux servir les personnes ayant besoin d’un hébergement temporaire.',
      mixed:
        'L’entente finance l’agrandissement de la capacité d’un refuge d’urgence et des services de soutien aux clients. Elle vise à ouvrir davantage de lits et à servir plus de personnes de façon sécuritaire au cours de la prochaine année. La prestation exigera des rénovations d’espace, du personnel additionnel et un accueil coordonné avec les partenaires de proximité.',
      good:
        'Cette entente prévoit 1,4 million de dollars pour accroître la capacité d’hébergement d’urgence et les services de soutien de nuit au refuge Riverside. Elle cible 35 nouveaux lits, un taux d’occupation moyen de 90 % et 780 clients servis d’ici mars 2027. L’agrandissement sera livré grâce à des rénovations des salles de bain et des dortoirs, à l’embauche de 12 employés de refuge et à un accueil coordonné avec les équipes de rue et de navigation en logement.',
      off_topic:
        'Vérifiez la pression des pneus lorsqu’ils sont froids, faites-les permuter à chaque vidange et évitez les freinages brusques sur les routes cahoteuses.',
    },
  },
  'supportive-housing-tenancy': {
    question:
      'Expliquez cette entente sur le soutien à la location en logement supervisé : quel service elle finance, quelles cibles de stabilité locative elle prévoit et comment le fournisseur livrera ces résultats.',
    criteria: [
      'Indique que l’entente finance du soutien à la location dans des logements supervisés',
      'Nomme les cibles relatives aux locataires, au maintien en logement et aux plans de cas',
      'Explique que le modèle de prestation repose sur la gestion de cas, la coordination avec les propriétaires et des soutiens aux habiletés de vie',
    ],
    answers: {
      bad:
        'L’entente offre du soutien pour la stabilité résidentielle. Le service aidera les résidents et améliorera la qualité du soutien qui leur est offert.',
      mixed:
        'L’entente finance du soutien à la location pour des résidents de logements supervisés qui ont besoin d’aide pour conserver un logement stable. On s’attend à ce qu’elle améliore le maintien en logement et renforce la planification des cas pendant l’année de l’entente. La prestation comprendra de la gestion de cas, de la coordination avec les propriétaires et des soutiens pratiques aux habiletés de vie.',
      good:
        'Cette entente prévoit 510 000 $ pour offrir du soutien à la location à des résidents de trois immeubles de logements supervisés. Elle cible 150 locataires servis, 125 locataires toujours logés après 12 mois et 140 plans de cas complétés d’ici décembre 2026. Le fournisseur livrera ces résultats au moyen d’une gestion de cas intensive, de rencontres de coordination avec les propriétaires, de coaching sur les habiletés de vie et de revues mensuelles de stabilité pour les locataires à risque d’expulsion.',
      off_topic:
        'Faites tremper les haricots pendant la nuit, laissez-les mijoter doucement avec des aromates et salez près de la fin pour garder les pelures tendres.',
    },
  },
  'seniors-home-repairs': {
    question:
      'Résumez cette entente sur les réparations domiciliaires pour les aînés : quelle aide est financée, quelles cibles de ménages ou de réparations sont attendues, et comment les réparations seront livrées.',
    criteria: [
      'Indique que le financement soutient des réparations domiciliaires urgentes pour les aînés',
      'Nomme les cibles relatives aux ménages, aux réparations et aux améliorations de sécurité',
      'Explique que le travail est livré grâce à des évaluations, à l’affectation d’entrepreneurs et à des inspections de suivi',
    ],
    answers: {
      bad:
        'L’entente soutient les aînés dans la communauté. L’organisation utilisera les fonds pour améliorer la sécurité et la qualité de vie à domicile.',
      mixed:
        'L’entente finance des réparations urgentes et des améliorations de sécurité pour des aînés à faible revenu. On s’attend à ce qu’elle aide davantage de ménages à corriger des conditions dangereuses au cours de la prochaine année. La prestation passera par des évaluations des réparations, l’affectation d’entrepreneurs et des inspections de suivi une fois les travaux terminés.',
      good:
        'Cette entente prévoit 460 000 $ pour des réparations urgentes et des améliorations de sécurité destinées à des aînés à faible revenu qui souhaitent demeurer à la maison. Elle cible 130 ménages, 210 réparations terminées et 95 améliorations de sécurité comme des rampes, des mains courantes et des correctifs électriques d’ici novembre 2026. Le service sera livré grâce à des évaluations à domicile, à l’affectation d’entrepreneurs préqualifiés et à des inspections après travaux avec appel de suivi après 30 jours.',
      off_topic:
        'Sauvegardez les photos dans le nuage, supprimez les vidéos en double et retirez les gros téléchargements du téléphone si vous manquez d’espace.',
    },
  },
  'newcomer-transitional-housing': {
    question:
      'Selon cette entente sur le logement transitoire pour les nouveaux arrivants, qu’est-ce qui est financé, quels résultats sont attendus pour l’occupation et les sorties vers un logement permanent, et comment le service sera livré.',
    criteria: [
      'Indique que l’entente finance du logement transitoire pour des familles nouvellement arrivées',
      'Nomme les résultats visés pour les unités, l’occupation et les sorties vers un logement permanent',
      'Explique que l’approche de prestation repose sur la gestion de cas, des soutiens à l’établissement et de l’accompagnement auprès des propriétaires',
    ],
    answers: {
      bad:
        'L’entente soutient le logement de familles nouvellement arrivées. Le financement améliorera la stabilité et aidera les gens à s’établir dans la communauté.',
      mixed:
        'L’entente finance du logement transitoire pour des familles nouvellement arrivées qui ont besoin d’un endroit où rester pendant qu’elles cherchent un logement permanent. On s’attend à ce qu’elle maintienne les unités occupées et aide davantage de familles à passer vers un logement à plus long terme au cours de l’année. La prestation comprendra de la gestion de cas en logement, des soutiens à l’établissement et de l’accompagnement auprès des propriétaires.',
      good:
        'Cette entente prévoit 1,1 million de dollars pour du logement transitoire et des soutiens à l’établissement destinés à des familles nouvellement arrivées ayant des besoins urgents en logement. Elle cible 22 unités meublées, un taux d’occupation de 95 % et 80 familles relogées dans un logement permanent d’ici mars 2027. Le service sera livré par de la gestion de cas sur place, du soutien à l’établissement et à l’inscription scolaire, et de l’accompagnement auprès des propriétaires pour obtenir des baux permanents.',
      off_topic:
        'Tapissez la plaque de cuisson de papier parchemin, étalez les noix en une seule couche et remuez à mi-cuisson pour obtenir une couleur uniforme.',
    },
  },
  'flood-resilience-culverts': {
    question:
      'Expliquez cette entente sur des ponceaux résilients aux inondations : quels travaux d’infrastructure sont financés, quelles cibles de construction elle fixe et comment la municipalité réalisera le projet.',
    criteria: [
      'Indique que l’entente finance le remplacement de ponceaux et des améliorations de résilience aux inondations',
      'Nomme les cibles relatives aux ponceaux, aux routes et à l’achèvement des travaux',
      'Explique que le mode de prestation repose sur la conception, l’approvisionnement et une construction par étapes',
    ],
    answers: {
      bad:
        'L’entente finance des améliorations d’infrastructure liées aux inondations. La municipalité utilisera les fonds pour améliorer la résilience et protéger les routes locales.',
      mixed:
        'L’entente finance le remplacement de ponceaux et des travaux connexes de résilience aux inondations sur des routes rurales. On s’attend à ce qu’elle permette plusieurs améliorations et réduise le risque d’emportement pendant la saison de construction. La municipalité réalisera le projet grâce à la conception d’ingénierie, à l’approvisionnement et à une construction routière par étapes.',
      good:
        'Cette entente prévoit 2,6 millions de dollars pour le remplacement de ponceaux et des améliorations de résilience aux inondations sur le réseau routier North Valley. Elle cible 9 remplacements de ponceaux, 4,2 kilomètres de remise en état de route adjacente et l’achèvement du projet d’ici octobre 2026. La municipalité réalisera les travaux grâce à une conception technique détaillée, à un approvisionnement concurrentiel, à une construction estivale par étapes et à des inspections après installation à la suite de fortes tempêtes.',
      off_topic:
        'Ramenez la réunion à 25 minutes, envoyez l’ordre du jour d’avance et terminez avec un seul responsable par action si vous voulez des appels plus courts.',
    },
  },
  'clean-water-monitoring': {
    question:
      'Résumez cette entente sur la surveillance de l’eau potable : ce qui est financé, quelles cibles d’échantillonnage et de rapports sont attendues, et comment le travail sera livré.',
    criteria: [
      'Indique que l’entente finance la surveillance et la reddition de comptes sur l’eau potable',
      'Nomme les cibles d’échantillonnage, de rapports et de couverture des sites',
      'Explique que le plan de prestation repose sur l’échantillonnage sur le terrain, l’analyse en laboratoire et des rapports publics',
    ],
    answers: {
      bad:
        'L’entente soutient le travail sur la qualité de l’eau dans la région. Le bénéficiaire utilisera les fonds pour améliorer la surveillance environnementale et répondre aux préoccupations locales.',
      mixed:
        'L’entente finance la surveillance de l’eau potable dans des rivières et des puits communautaires. Elle vise à accroître la couverture d’échantillonnage et à produire des rapports réguliers pendant la durée de l’entente. La prestation passera par de l’échantillonnage sur le terrain, de l’analyse en laboratoire et des rapports publics sur les résultats.',
      good:
        'Cette entente prévoit 780 000 $ pour la surveillance de l’eau potable dans l’ensemble du bassin versant South Fork et de 12 puits communautaires. Elle cible 1 440 échantillons d’eau, 12 rapports publics trimestriels et une couverture complète de surveillance sur 18 sites prioritaires d’ici mars 2027. Le travail sera livré au moyen d’un échantillonnage mensuel sur le terrain, d’analyses en laboratoire confiées à contrat et de mises à jour d’un tableau de bord public examinées chaque trimestre avec les partenaires municipaux.',
      off_topic:
        'Utilisez une police plus grande, augmentez l’interligne et limitez chaque diapositive à une seule idée si vous voulez des présentations plus faciles à suivre.',
    },
  },
  'microtransit-pilot': {
    question:
      'Selon cette entente sur un projet pilote de microtransport, quel service est financé, quelles cibles d’achalandage ou de service sont attendues, et comment le projet pilote sera livré.',
    criteria: [
      'Indique que l’entente finance un service pilote de microtransport',
      'Nomme les cibles d’heures de service, de trajets et d’usagers',
      'Explique que le mode de prestation repose sur des véhicules, un logiciel de réservation et des horaires d’exploitation',
    ],
    answers: {
      bad:
        'L’entente soutient des améliorations au transport local. La municipalité utilisera les fonds pour améliorer le service et faciliter les déplacements des résidents.',
      mixed:
        'L’entente finance un projet pilote de microtransport dans des zones à faible densité où l’offre d’autobus fixe est limitée. On s’attend à ce qu’elle augmente la disponibilité des trajets et attire davantage d’usagers pendant la période pilote. La prestation reposera sur des véhicules dédiés, un logiciel de réservation par application et des heures d’exploitation prévues.',
      good:
        'Cette entente prévoit 1,8 million de dollars pour un projet pilote de microtransport à deux zones desservant des collectivités suburbaines et rurales en périphérie. Elle cible 8 400 heures de service, 52 000 trajets complétés et 3 200 usagers uniques d’ici décembre 2027. Le projet pilote sera livré au moyen de six véhicules accessibles, d’un logiciel de réservation par application et téléphone, et d’horaires alignés sur les pointes de déplacement et les rendez-vous à l’hôpital.',
      off_topic:
        'Ouvrez les fenêtres pendant dix minutes, essuyez la douche après usage et faites fonctionner le ventilateur plus longtemps si vous voulez moins de moisissure dans la salle de bain.',
    },
  },
  'farm-irrigation-upgrades': {
    question:
      'Expliquez cette entente sur la modernisation de l’irrigation agricole : quels travaux elle finance, quelles cibles d’installation elle fixe et comment les améliorations seront livrées.',
    criteria: [
      'Indique que l’entente finance des améliorations d’efficacité de l’irrigation sur les fermes',
      'Nomme les cibles relatives aux fermes, à l’équipement et aux économies d’eau',
      'Explique que le travail est livré grâce à des évaluations, à l’installation d’équipement et à la formation des producteurs',
    ],
    answers: {
      bad:
        'L’entente finance des améliorations agricoles. Le bénéficiaire utilisera ce soutien pour améliorer la gestion de l’eau et renforcer les activités des fermes.',
      mixed:
        'L’entente finance des améliorations de l’efficacité de l’irrigation pour des fermes soumises à des contraintes d’eau. On s’attend à ce qu’elle permette davantage d’installations d’équipement et réduise l’utilisation d’eau pendant la période du projet. La prestation comprendra des évaluations de sites, l’installation de systèmes modernisés et de la formation pour les producteurs sur l’utilisation de l’équipement.',
      good:
        'Cette entente prévoit 1,35 million de dollars pour des améliorations de l’efficacité de l’irrigation sur 40 fermes fruitières et maraîchères. Elle cible 40 évaluations d’irrigation, 85 nouvelles vannes de contrôle et capteurs, ainsi qu’une réduction estimée de 18 % de l’utilisation saisonnière de l’eau d’ici octobre 2027. La prestation se fera au moyen d’évaluations à la ferme, de l’installation d’équipement par des entrepreneurs certifiés et de la formation des producteurs sur la planification et le suivi de l’utilisation de l’eau.',
      off_topic:
        'Marchez cinq minutes chaque heure, relevez l’écran de l’ordinateur portable et gardez le clavier plus bas si votre cou devient raide au travail.',
    },
  },
  'wildfire-preparedness': {
    question:
      'Résumez cette entente sur la préparation aux feux de forêt : quelles activités sont financées, quelles cibles d’atténuation elle fixe et comment le travail sera livré.',
    criteria: [
      'Indique que l’entente finance des travaux de préparation et d’atténuation des feux de forêt',
      'Nomme les cibles relatives aux propriétés, aux coupe-feu ou aux bénévoles',
      'Explique que le travail est livré par des équipes, de la formation et une coordination avec les services d’incendie',
    ],
    answers: {
      bad:
        'L’entente soutient la préparation aux feux de forêt dans la région. Le financement améliorera la préparation et renforcera la capacité locale avant les prochaines saisons de feux.',
      mixed:
        'L’entente finance des activités de préparation et d’atténuation des feux de forêt dans des collectivités à risque élevé. On s’attend à ce qu’elle étende la couverture des mesures d’atténuation et forme plus de personnes avant la prochaine saison de feux. La prestation reposera sur des équipes de terrain, de la formation pour les bénévoles et une coordination avec les services d’incendie locaux.',
      good:
        'Cette entente prévoit 970 000 $ pour la préparation et l’atténuation des feux de forêt dans cinq collectivités en bordure de forêt. Elle cible 320 évaluations de propriétés, 48 kilomètres d’entretien de coupe-feu et 180 bénévoles communautaires formés d’ici juin 2027. Le travail sera livré par des équipes de terrain en atténuation, des fins de semaine de formation pour les bénévoles et des rencontres de coordination avec les services d’incendie municipaux et régionaux avant et pendant la saison des feux.',
      off_topic:
        'Passez la soupe au mélangeur en plusieurs fois, ajoutez l’acidité à la fin et gardez un peu de liquide de cuisson de côté pour ajuster la texture.',
    },
  },
  'indigenous-language-nests': {
    question:
      'Expliquez cette entente sur des nids linguistiques autochtones : ce qui est financé, quelles cibles d’apprenants ou de séances sont attendues et comment le travail linguistique sera livré.',
    criteria: [
      'Indique que l’entente finance des nids linguistiques autochtones et des activités de revitalisation',
      'Nomme les cibles relatives aux apprenants, aux séances et aux mentors',
      'Explique que l’approche de prestation repose sur des locuteurs fluents, des séances d’immersion et la création de ressources',
    ],
    answers: {
      bad:
        'L’entente soutient la revitalisation linguistique dans la communauté. L’organisation utilisera les fonds pour renforcer la culture et aider les gens à apprendre ensemble.',
      mixed:
        'L’entente finance des nids linguistiques autochtones pour de jeunes enfants et leurs familles. Elle vise à élargir l’apprentissage en immersion et à accroître la participation de locuteurs fluents au cours de l’année. La prestation reposera sur des locuteurs fluents, des séances régulières d’immersion et des ressources pédagogiques ancrées dans la culture.',
      good:
        'Cette entente prévoit 520 000 $ pour des nids linguistiques autochtones destinés à des enfants d’âge préscolaire, à leurs parents et à leurs proches aidants dans deux communautés. Elle cible 80 apprenants réguliers, 220 séances d’immersion et 16 mentors locuteurs fluents d’ici mars 2027. Le travail sera livré au moyen de séances quotidiennes en nid linguistique, de cercles d’immersion familiale animés par des mentors et de la création d’histoires enregistrées et de ressources d’enseignement dans la langue.',
      off_topic:
        'Baissez la température de l’eau, utilisez un détergent plus doux et faites sécher le chandail à plat à l’air libre si vous voulez qu’il garde sa forme.',
    },
  },
  'afterschool-stem': {
    question:
      'Résumez cette entente sur un programme STEM après l’école : quel programme est financé, quels résultats de participation étudiante elle fixe et comment le programme sera livré.',
    criteria: [
      'Indique que l’entente finance un programme STEM après l’école',
      'Nomme les cibles relatives aux élèves, aux clubs et à la fréquentation',
      'Explique que le mode de prestation repose sur des clubs, des animateurs et des partenariats avec les écoles',
    ],
    answers: {
      bad:
        'L’entente soutient de la programmation éducative pour les élèves. Le bénéficiaire utilisera les fonds pour améliorer les possibilités d’apprentissage après l’école.',
      mixed:
        'L’entente finance un programme STEM après l’école pour des élèves du premier cycle du secondaire. Elle devrait accroître la participation et améliorer la fréquentation régulière des clubs pendant l’année scolaire. La prestation comprendra des clubs en milieu scolaire, des animateurs formés et des partenariats avec les écoles participantes.',
      good:
        'Cette entente prévoit 410 000 $ pour un programme STEM après l’école dans huit écoles intermédiaires. Elle cible 24 sections de club, 360 élèves participants et un taux moyen de présence de 75 % d’ici juin 2027. Le programme sera livré grâce à des clubs hebdomadaires animés par des facilitateurs formés, à des trousses d’équipement pour chaque site et à des partenariats scolaires qui prennent en charge le recrutement des élèves et l’horaire des locaux.',
      off_topic:
        'Conservez les herbes debout dans un pot avec un peu d’eau, couvrez-les lâchement d’un sac et recoupez les tiges tous les quelques jours.',
    },
  },
  'public-library-digital-inclusion': {
    question:
      'Que dit cette entente sur l’inclusion numérique en bibliothèque publique au sujet de ce qui est financé, des cibles d’utilisation ou de formation attendues et de la façon dont la bibliothèque réalisera le travail?',
    criteria: [
      'Indique que l’entente finance l’inclusion numérique par l’intermédiaire de la bibliothèque publique',
      'Nomme les cibles de prêt d’appareils, de formation et d’utilisateurs',
      'Explique que le mode de prestation repose sur le prêt, des cours et le soutien du personnel',
    ],
    answers: {
      bad:
        'L’entente soutient l’accès numérique dans la communauté. La bibliothèque utilisera les fonds pour améliorer les services et aider les gens à se connecter.',
      mixed:
        'L’entente finance des activités d’inclusion numérique par l’intermédiaire de la bibliothèque publique, y compris l’accès à des appareils et du soutien aux compétences numériques. Elle vise à élargir le prêt et à rejoindre davantage d’apprenants pendant l’année de l’entente. La prestation comprendra le prêt d’appareils, des cours de formation et le soutien du personnel pour les usagers qui ont besoin d’aide.',
      good:
        'Cette entente prévoit 360 000 $ pour l’inclusion numérique par l’intermédiaire du réseau de bibliothèques publiques. Elle cible 260 prêts d’appareils, 110 cours de compétences numériques et 1 400 utilisateurs uniques soutenus d’ici mars 2027. La bibliothèque réalisera le travail au moyen de prêts d’ordinateurs portables et de points d’accès, de cours pour débutants à horaire fixe et d’un accompagnement individuel offert par le personnel aux comptoirs d’aide des succursales.',
      off_topic:
        'Congelez d’abord les baies en une seule couche, mettez-les ensuite en sac et ajoutez-les aux smoothies pendant qu’elles sont encore gelées.',
    },
  },
  'food-security-breakfast': {
    question:
      'Expliquez cette entente sur les déjeuners scolaires : ce qui est financé, quelles cibles de repas ou d’élèves sont attendues et comment le service sera livré.',
    criteria: [
      'Indique que l’entente finance un programme de déjeuners scolaires ou de sécurité alimentaire',
      'Nomme les cibles de repas, d’écoles et d’élèves',
      'Explique que le travail est livré grâce à l’achat de nourriture, à la distribution dans les écoles et à la coordination de bénévoles ou du personnel',
    ],
    answers: {
      bad:
        'L’entente soutient la sécurité alimentaire des élèves. L’organisation utilisera les fonds pour améliorer l’accès aux repas et réduire la faim à l’école.',
      mixed:
        'L’entente finance un programme de déjeuners scolaires pour des élèves de quartiers où l’insécurité alimentaire est plus élevée. Elle devrait accroître l’accès aux repas et rejoindre davantage d’élèves pendant l’année scolaire. La prestation comprendra l’achat de nourriture, la distribution dans les écoles et la coordination du personnel et des bénévoles sur les sites participants.',
      good:
        'Cette entente prévoit 500 000 $ pour un programme de déjeuners scolaires dans 14 écoles primaires. Elle cible 280 000 déjeuners servis, 3 200 élèves utilisateurs réguliers et le fonctionnement complet du programme dans les 14 sites d’ici juin 2027. Le service sera livré grâce à des achats centralisés de nourriture, à une distribution hebdomadaire dans les écoles et à une coordination sur place assurée par le personnel scolaire et des bénévoles communautaires.',
      off_topic:
        'Réglez l’appareil photo en priorité à l’ouverture, gardez une vitesse d’obturation assez élevée et placez-vous avec le soleil légèrement de côté pour de meilleurs portraits.',
    },
  },
  'community-arts-training': {
    question:
      'Résumez cette entente sur la formation artistique communautaire : ce qui est financé, quelles cibles de participants ou de productions elle fixe et comment la formation sera livrée.',
    criteria: [
      'Indique que l’entente finance de la formation artistique communautaire et des activités de création',
      'Nomme les cibles de participants, d’ateliers et de vitrines',
      'Explique que le travail est livré grâce à des artistes-formateurs, à des ateliers et à la préparation de vitrines',
    ],
    answers: {
      bad:
        'L’entente soutient la programmation artistique dans la communauté. L’organisation utilisera les fonds pour élargir les possibilités et encourager la participation.',
      mixed:
        'L’entente finance de la formation artistique communautaire pour les jeunes et les artistes émergents. Elle vise à accroître la participation et à soutenir davantage de vitrines publiques pendant la durée de l’entente. La prestation passera par des artistes-formateurs, des séries d’ateliers et la préparation des vitrines finales.',
      good:
        'Cette entente prévoit 390 000 $ pour de la formation artistique communautaire en musique, en conception murale et en narration numérique. Elle cible 180 participants, 72 ateliers et 6 vitrines publiques d’ici février 2027. La formation sera livrée grâce à des artistes-formateurs rémunérés, à des séries d’ateliers hebdomadaires et à des séances de préparation menant à des expositions et à des performances publiques.',
      off_topic:
        'Gardez les reçus dans une seule enveloppe, révisez-les chaque semaine et séparez les coûts fixes des achats impulsifs si vous essayez de mieux gérer votre budget.',
    },
  },
  'midcareer-reskilling': {
    question:
      'Résumez cette entente sur la reconversion en milieu de carrière : quelle formation est financée, quelles cibles d’achèvement ou de transition d’emploi sont attendues et comment le programme sera livré.',
    criteria: [
      'Indique que l’entente finance de la formation de reconversion en milieu de carrière',
      'Nomme les cibles d’apprenants, d’attestations et de transitions d’emploi',
      'Explique que la formation est livrée grâce à des cohortes, du coaching et des projets avec des employeurs',
    ],
    answers: {
      bad:
        'L’entente soutient la reconversion d’adultes qui ont besoin de nouvelles possibilités d’emploi. Le bénéficiaire utilisera les fonds pour améliorer l’accès à la formation et aider les gens à passer vers des carrières plus solides.',
      mixed:
        'L’entente finance de la reconversion en milieu de carrière pour des adultes quittant des secteurs en déclin. Elle vise à aider davantage d’apprenants à obtenir des attestations courtes et à passer vers de nouveaux emplois cette année. La prestation reposera sur des cohortes dirigées par des formateurs, du coaching de carrière et des projets appliqués appuyés par des employeurs.',
      good:
        'Cette entente prévoit 880 000 $ pour de la reconversion en milieu de carrière dans les domaines de la logistique, de la tenue de livres et de la maintenance industrielle. Elle cible 260 apprenants, 210 attestations complétées et 140 transitions vers un nouvel emploi d’ici mai 2027. Le programme sera livré au moyen de cohortes de formation de douze semaines, de coaching individuel et de projets appliqués commandités par des employeurs et liés à des postes vacants.',
      off_topic:
        'Rincez le riz jusqu’à ce que l’eau soit claire, faites-le griller brièvement dans l’huile et laissez-le reposer couvert après la cuisson si vous voulez des grains plus légers.',
    },
  },
  'childcare-workforce-training': {
    question:
      'Que finance cette entente sur la formation de la main-d’oeuvre en services de garde, quelles cibles de certification ou de maintien elle fixe et comment la formation sera livrée?',
    criteria: [
      'Indique que l’entente finance de la formation pour la main-d’oeuvre en services de garde',
      'Nomme les cibles de stagiaires, de certifications et de maintien en poste',
      'Explique que le travail est livré grâce à des cours, du soutien au stage pratique et du mentorat',
    ],
    answers: {
      bad:
        'L’entente soutient la formation des travailleurs en services de garde. L’organisation utilisera les fonds pour améliorer la main-d’oeuvre et renforcer la qualité des services avec le temps.',
      mixed:
        'L’entente finance de la formation pour la main-d’oeuvre en services de garde destinée à de nouveaux éducateurs de la petite enfance et à des éducateurs de retour au travail. Elle vise à accroître les certifications et à maintenir davantage de stagiaires dans des milieux de garde agréés pendant la durée de l’entente. La prestation comprendra des cours du soir, du soutien au stage pratique et du mentorat offert par des superviseurs expérimentés.',
      good:
        'Cette entente prévoit 670 000 $ pour de la formation de la main-d’oeuvre en services de garde auprès de six fournisseurs agréés. Elle cible 140 stagiaires, 110 certifications complétées et 85 personnes maintenues en emploi dans des services de garde agréés après six mois d’ici mars 2027. La prestation se fera au moyen de cours du soir, d’un soutien rémunéré aux stages et d’un jumelage avec des éducateurs chevronnés.',
      off_topic:
        'Gardez le chargeur près du lit, activez le mode économie d’énergie plus tôt et arrêtez de laisser les applications vidéo ouvertes en arrière-plan si le téléphone meurt avant le souper.',
    },
  },
  'indigenous-remote-workforce': {
    question:
      'Expliquez cette entente sur la main-d’oeuvre autochtone en région éloignée : quel soutien à l’emploi est financé, quelles cibles de placement sont attendues et comment le service sera livré.',
    criteria: [
      'Indique que l’entente finance du soutien à l’emploi pour des chercheurs d’emploi autochtones dans des communautés éloignées',
      'Nomme les cibles de participants, de placements et de partenariats avec les employeurs',
      'Explique que le travail est livré grâce à du coaching communautaire, du soutien au déplacement et une coordination avec les employeurs',
    ],
    answers: {
      bad:
        'L’entente soutient les possibilités d’emploi dans des communautés éloignées. Le bénéficiaire utilisera les fonds pour améliorer l’accès au travail et renforcer les partenariats locaux.',
      mixed:
        'L’entente finance du soutien à l’emploi pour des chercheurs d’emploi autochtones dans des communautés éloignées. Elle vise à aider davantage de participants à entrer en contact avec des employeurs et à accéder à un travail rémunéré pendant la durée de l’entente. La prestation comprendra du coaching communautaire, du soutien au déplacement pour des entrevues ou de courtes formations et une coordination avec des employeurs qui embauchent dans la région.',
      good:
        'Cette entente prévoit 720 000 $ pour du soutien à l’emploi destiné à des chercheurs d’emploi autochtones dans huit communautés éloignées. Elle cible 190 participants, 95 placements en emploi et 40 partenariats actifs avec des employeurs d’ici juillet 2027. Le service sera livré par des conseillers communautaires en emploi, du soutien au déplacement pour les entrevues et les courts blocs de formation, et une coordination directe avec des employeurs régionaux du secteur de l’énergie, du transport et de la construction.',
      off_topic:
        'Laissez la poêle bien chauffer, ne surchargez pas les champignons et ajoutez le beurre vers la fin si vous les voulez dorés plutôt que détrempés.',
    },
  },
  'green-jobs-internships': {
    question:
      'Résumez cette entente sur des stages en emplois verts : quel programme de stages est financé, quels résultats pour les participants sont attendus et comment les stages seront livrés.',
    criteria: [
      'Indique que l’entente finance des stages en emplois verts',
      'Nomme les cibles de stagiaires, de sites d’accueil et d’emplois après le stage',
      'Explique que le programme est livré grâce à des stages en milieu d’accueil, de la supervision et des modules de formation',
    ],
    answers: {
      bad:
        'L’entente soutient des stages liés au travail environnemental. Le bénéficiaire utilisera les fonds pour offrir plus de possibilités et renforcer l’économie verte locale.',
      mixed:
        'L’entente finance des stages en emplois verts pour des travailleurs en début de carrière intéressés par l’efficacité énergétique et les services environnementaux. Elle vise à placer davantage de stagiaires chez des organismes hôtes et à en faire passer plus grand nombre vers des emplois environnementaux après la période de stage. La prestation reposera sur des placements en milieu d’accueil, une supervision structurée et de courts modules de formation.',
      good:
        'Cette entente prévoit 610 000 $ pour des stages en emplois verts dans les domaines de l’efficacité énergétique, de la restauration d’habitats et de la réduction des déchets. Elle cible 75 stagiaires, 32 sites d’accueil et 45 stagiaires accédant à un emploi environnemental dans les trois mois suivant la fin du stage d’ici septembre 2027. Les stages seront livrés grâce à des placements rémunérés, à des plans de supervision sur les sites et à des modules de formation communs sur la sécurité, la reddition de comptes et les bases du secteur.',
      off_topic:
        'Programmez les rappels du calendrier plus tôt, préparez le sac la veille et gardez toujours les clés au même endroit si les matins sont chaotiques.',
    },
  },
  'hospitality-reentry-training': {
    question:
      'Que finance cette entente sur la formation de retour en hôtellerie-restauration, quels résultats d’apprentissage et de placement sont attendus et comment la formation sera livrée?',
    criteria: [
      'Indique que l’entente finance de la formation de retour en hôtellerie-restauration',
      'Nomme les résultats visés pour les apprenants, les achèvements et les placements',
      'Explique que le programme est livré grâce à de la formation en classe, à des stages en emploi et à du coaching en emploi',
    ],
    answers: {
      bad:
        'L’entente soutient de la formation pour des personnes qui retournent travailler dans le secteur de l’hôtellerie-restauration. Le programme vise à améliorer la préparation et à relier davantage de personnes à des employeurs.',
      mixed:
        'L’entente finance de la formation de retour en hôtellerie-restauration pour des adultes qui reviennent vers des emplois en cuisine, à l’hôtel ou à la réception. Elle vise à augmenter les achèvements et à orienter davantage d’apprenants vers des placements pendant l’année de l’entente. La prestation comprendra de la formation en classe, de courts placements en milieu de travail et du coaching en emploi avec aiguillages vers des employeurs.',
      good:
        'Cette entente prévoit 530 000 $ pour de la formation de retour en hôtellerie-restauration axée sur les postes en cuisine, en entretien ménager et à la réception. Elle cible 160 apprenants, 125 plans de formation complétés et 90 placements en emploi d’ici avril 2027. La formation sera livrée au moyen de modules en classe, de stages de deux semaines et de coaching en emploi avec des hôtels et des restaurants participants.',
      off_topic:
        'Baissez le thermostat d’un degré, calfeutrez le courant d’air près de la porte et fermez les rideaux plus tôt si la pièce devient froide la nuit.',
    },
  },
  'diabetes-screening-outreach': {
    question:
      'Expliquez cette entente sur le dépistage du diabète dans la communauté : quel service est financé, quels résultats de dépistage sont attendus et comment le soutien de proximité sera livré.',
    criteria: [
      'Indique que l’entente finance du soutien de proximité pour le dépistage du diabète',
      'Nomme les résultats visés pour les dépistages, les aiguillages et les suivis',
      'Explique que le service est livré grâce à des cliniques de proximité, des éducateurs et un suivi des aiguillages',
    ],
    answers: {
      bad:
        'L’entente soutient des services communautaires liés au diabète. Le bénéficiaire utilisera les fonds pour améliorer la prévention et relier davantage de personnes aux soins.',
      mixed:
        'L’entente finance du soutien de proximité pour le dépistage du diabète dans des quartiers ayant moins accès aux soins préventifs. Elle vise à augmenter les dépistages et à faire passer davantage de personnes présentant des résultats élevés vers des soins de suivi pendant l’année de l’entente. La prestation comprendra des cliniques de proximité, des éducateurs en diabète et des aiguillages suivis vers des services de première ligne.',
      good:
        'Cette entente prévoit 640 000 $ pour du soutien de proximité au dépistage du diabète dans six quartiers mal desservis. Elle cible 3 000 dépistages, 520 aiguillages vers les soins primaires et 400 suivis complétés d’ici juin 2027. La prestation se fera au moyen de cliniques de proximité en rotation, d’éducateurs en diabète sur chaque site et d’un suivi des aiguillages examiné chaque mois avec les cliniques partenaires.',
      off_topic:
        'Commencez par placer les boîtes les plus lourdes au fond, comblez les espaces avec des serviettes et identifiez une boîte pour les essentiels de la première nuit après le déménagement.',
    },
  },
  'seniors-fall-prevention': {
    question:
      'Résumez cette entente sur la prévention des chutes chez les aînés : quel programme est financé, quels résultats pour les participants sont attendus et comment le programme sera livré.',
    criteria: [
      'Indique que l’entente finance du soutien à la prévention des chutes chez les aînés',
      'Nomme les résultats visés pour les participants, les évaluations et la réduction des chutes',
      'Explique que le programme est livré grâce à des cours, à des évaluations à domicile et à du coaching de suivi',
    ],
    answers: {
      bad:
        'L’entente soutient la prévention des chutes chez les personnes âgées. Le service aidera à améliorer la sécurité et à réduire les blessures évitables dans la communauté.',
      mixed:
        'L’entente finance du soutien à la prévention des chutes pour des aînés vivant de façon autonome. Elle vise à élargir les évaluations et à réduire les chutes évitables pendant la durée de l’entente. La prestation comprendra des cours d’équilibre, des évaluations de sécurité à domicile et du coaching de suivi pour les participants les plus à risque.',
      good:
        'Cette entente prévoit 450 000 $ pour du soutien à la prévention des chutes chez les aînés dans des secteurs urbains et ruraux. Elle cible 600 participants, 520 évaluations à domicile ou de mobilité et une réduction de 15 % des chutes répétées chez les clients inscrits d’ici décembre 2026. Le programme sera livré au moyen de cours d’équilibre, d’évaluations de sécurité à domicile et d’appels de coaching de suivi effectués par le personnel clinique.',
      off_topic:
        'Aiguisez le couteau régulièrement, bloquez la planche à découper avec un linge humide et coupez les oignons en gardant la racine jusqu’à la fin si la préparation est lente.',
    },
  },
  'mobile-vision-clinic': {
    question:
      'Que finance cette entente sur une clinique visuelle mobile, quelles cibles de dépistage sont attendues et comment la clinique sera livrée?',
    criteria: [
      'Indique que l’entente finance une clinique visuelle mobile',
      'Nomme les cibles de dépistage, d’aiguillage et de sites',
      'Explique que le travail est livré grâce à des rotations de clinique, du personnel en soins oculaires et une planification avec les écoles ou la communauté',
    ],
    answers: {
      bad:
        'L’entente soutient des services de la vue dans la communauté. L’organisation utilisera les fonds pour améliorer l’accès et relier davantage de personnes aux soins.',
      mixed:
        'L’entente finance une clinique visuelle mobile desservant des écoles et des carrefours de quartier ayant un accès limité aux soins oculaires. Elle vise à accroître les dépistages et les aiguillages pendant la durée de l’entente. La prestation reposera sur des journées de clinique en rotation, du personnel en soins oculaires dans l’unité mobile et des visites planifiées avec les sites locaux.',
      good:
        'Cette entente prévoit 520 000 $ pour une clinique visuelle mobile desservant des écoles, des refuges et des centres pour aînés. Elle cible 2 600 dépistages, 540 aiguillages vers des spécialistes et 34 sites de service d’ici avril 2027. La clinique sera livrée grâce à un calendrier de service rotatif, à un optométriste et du personnel de soutien à chaque tournée, et à une planification préalable avec les écoles et les sites communautaires partenaires.',
      off_topic:
        'Gardez une serviette de rechange près de la porte, essuyez les pattes du chien avant qu’il entre et brossez son pelage dehors plus souvent si le plancher reste boueux.',
    },
  },
  'asthma-home-visits': {
    question:
      'Expliquez cette entente sur les visites à domicile liées à l’asthme chez l’enfant : quel service est financé, quels résultats pour les clients sont attendus et comment le service sera livré.',
    criteria: [
      'Indique que l’entente finance du soutien à domicile pour l’asthme chez l’enfant',
      'Nomme les cibles relatives aux familles, aux visites et à la réduction du recours à l’hôpital',
      'Explique que le service est livré grâce à des visites à domicile, de l’éducation et un suivi des plans de soins',
    ],
    answers: {
      bad:
        'L’entente soutient des services liés à l’asthme pour les enfants et les familles. Le fournisseur utilisera les fonds pour améliorer la prise en charge et réduire les problèmes de santé évitables.',
      mixed:
        'L’entente finance du soutien à domicile pour les enfants asthmatiques et leur famille. Elle vise à augmenter les visites et à réduire les épisodes d’asthme urgents pendant l’année de l’entente. La prestation comprendra des visites à domicile, de l’éducation aux parents et un suivi des plans de soins liés à l’asthme.',
      good:
        'Cette entente prévoit 480 000 $ pour du soutien à domicile en matière d’asthme chez l’enfant, destiné aux familles aiguillées par les urgences et les cliniques de première ligne. Elle cible 260 familles, 780 visites à domicile et une réduction de 20 % des visites à l’urgence liées à l’asthme chez les enfants inscrits d’ici juin 2027. Le service sera livré grâce à des visites à domicile menées par des éducateurs en santé respiratoire, à des séances d’éducation pour les parents et à des appels de suivi pour revoir les plans de soins et la gestion des déclencheurs.',
      off_topic:
        'Rangez les vis dans des contenants séparés, prenez une photo avant de débrancher chaque câble et étiquetez les tablettes si le montage de meubles tourne toujours au chaos.',
    },
  },
  'vaccine-outreach': {
    question:
      'Résumez cette entente sur le soutien de proximité en vaccination : quel service est financé, quelles cibles de couverture sont attendues et comment le soutien sera livré.',
    criteria: [
      'Indique que l’entente finance du soutien de proximité et d’accès à la vaccination',
      'Nomme les cibles de cliniques, de doses et de clients rejoints',
      'Explique que le travail est livré grâce à des cliniques pop-up, à des intervenants de proximité et à du soutien à la prise de rendez-vous',
    ],
    answers: {
      bad:
        'L’entente soutient des services de vaccination dans la communauté. L’organisation utilisera les fonds pour améliorer l’accès et rejoindre davantage de résidents.',
      mixed:
        'L’entente finance du soutien de proximité et d’accès à la vaccination dans des quartiers où les taux d’immunisation sont plus faibles. Elle vise à multiplier les cliniques et à augmenter la couverture vaccinale pendant la durée de l’entente. La prestation comprendra des cliniques pop-up, des intervenants de proximité et du soutien à la prise de rendez-vous.',
      good:
        'Cette entente prévoit 590 000 $ pour du soutien de proximité et d’accès à la vaccination dans dix quartiers où les taux sont plus faibles. Elle cible 140 cliniques pop-up, 8 500 doses administrées et 5 400 clients soutenus d’ici mars 2027. Le travail sera livré grâce à des cliniques pop-up en rotation, à des intervenants communautaires et à du soutien pour la prise de rendez-vous et les rappels auprès des clients qui ont besoin d’aide.',
      off_topic:
        'Étalez le paillis après que le sol s’est réchauffé, gardez-le loin des tiges et arrosez abondamment moins souvent si le jardin sèche trop vite.',
    },
  },
  'coding-bridge-program': {
    question:
      'Expliquez cette entente sur un programme passerelle en codage : quelle formation est financée, quels résultats pour les apprenants sont attendus et comment le programme sera livré.',
    criteria: [
      'Indique que l’entente finance un programme de formation passerelle en codage',
      'Nomme les résultats visés pour les apprenants, les portfolios et les placements',
      'Explique que le programme est livré grâce à de l’enseignement, du mentorat et du travail de projet',
    ],
    answers: {
      bad:
        'L’entente soutient de la formation en compétences numériques. Le fournisseur utilisera les fonds pour améliorer l’accès aux carrières technologiques et aider davantage d’apprenants à gagner en confiance.',
      mixed:
        'L’entente finance un programme passerelle en codage pour des adultes qui se dirigent vers des postes débutants en logiciel et en web. Elle vise à augmenter les achèvements, à renforcer les portfolios et à soutenir davantage de placements en emploi. La prestation comprendra de l’enseignement technique, du soutien de mentors et des projets appliqués.',
      good:
        'Cette entente prévoit 760 000 $ pour un programme passerelle en codage axé sur le développement front-end, les essais qualité et l’ingénierie de soutien. Elle cible 180 apprenants, 150 portfolios complétés et 95 placements en emploi d’ici août 2027. La formation sera livrée au moyen de modules animés par des formateurs, d’un jumelage avec des mentors bénévoles et de projets conçus avec la rétroaction d’employeurs.',
      off_topic:
        'Rangez le parapluie près du haut du sac, gardez des bas secs dans une pochette latérale et mettez toujours le passeport dans la même section pendant vos voyages.',
    },
  },
  'farmworker-safety-training': {
    question:
      'Que finance cette entente sur la formation en sécurité des travailleurs agricoles, quels résultats d’achèvement sont attendus et comment la formation sera livrée?',
    criteria: [
      'Indique que l’entente finance de la formation en sécurité pour les travailleurs agricoles',
      'Nomme les résultats visés pour les apprenants, les certifications et les sites employeurs',
      'Explique que le travail est livré grâce à de la formation sur le terrain, à du matériel traduit et à une coordination avec les employeurs',
    ],
    answers: {
      bad:
        'L’entente soutient de la formation pour les travailleurs agricoles. Le bénéficiaire utilisera les fonds pour améliorer la sécurité et renforcer les conditions de travail.',
      mixed:
        'L’entente finance de la formation en sécurité pour des travailleurs agricoles saisonniers et permanents. Elle vise à augmenter les achèvements de formation et à améliorer les pratiques sécuritaires sur davantage de sites employeurs. La prestation comprendra de la formation sur le terrain, du matériel traduit et une coordination avec les fermes participantes.',
      good:
        'Cette entente prévoit 420 000 $ pour de la formation en sécurité des travailleurs agricoles portant sur la manipulation des pesticides, la prévention du stress thermique et l’utilisation de l’équipement. Elle cible 520 travailleurs formés, 430 certifications complétées et 70 sites employeurs participants d’ici septembre 2026. La prestation sera assurée grâce à de la formation sur le terrain, à du matériel pédagogique traduit et à une planification avec les exploitants agricoles pendant les périodes de moindre récolte.',
      off_topic:
        'Remuez la vinaigrette juste avant de servir, gardez la laitue bien sèche et ajoutez les garnitures croquantes à table si les salades ramollissent trop vite.',
    },
  },
  'social-enterprise-placements': {
    question:
      'Résumez cette entente sur des placements en entreprise sociale : quel programme est financé, quels résultats pour les participants sont attendus et comment les placements seront livrés.',
    criteria: [
      'Indique que l’entente finance des placements de travail en entreprise sociale',
      'Nomme les résultats visés pour les participants, les placements et les transitions',
      'Explique que le programme est livré grâce à des placements, du coaching et des soutiens globaux',
    ],
    answers: {
      bad:
        'L’entente soutient des occasions de travail dans une entreprise sociale. Le programme vise à aider les gens à acquérir de l’expérience et à améliorer leurs perspectives à long terme.',
      mixed:
        'L’entente finance des placements de travail en entreprise sociale pour des personnes confrontées à des obstacles à l’emploi. Elle vise à accroître le nombre de placements et à soutenir plus de participants vers un travail à plus long terme pendant la durée de l’entente. La prestation comprendra des placements rémunérés, du coaching en emploi et des soutiens globaux.',
      good:
        'Cette entente prévoit 580 000 $ pour des placements de travail en entreprise sociale dans les services alimentaires, le recyclage et l’entretien communautaire. Elle cible 150 participants, 120 placements rémunérés et 70 participants passant à un emploi non subventionné d’ici janvier 2027. La prestation se fera au moyen de placements supervisés, de coaching individuel et de soutiens globaux comme l’aide au transport et des aiguillages vers du counseling.',
      off_topic:
        'Gardez une clé de secours chez une personne qui habite près de chez vous, huilez la serrure avant l’hiver et remplacez le double tordu avant d’en avoir réellement besoin.',
    },
  },
  'manufacturing-upskilling': {
    question:
      'Expliquez cette entente sur le perfectionnement en fabrication : quelle formation est financée, quels résultats en matière d’attestations sont attendus et comment la formation sera livrée.',
    criteria: [
      'Indique que l’entente finance de la formation de perfectionnement en fabrication',
      'Nomme les résultats visés pour les apprenants, les attestations et l’avancement',
      'Explique que le travail est livré grâce à de l’enseignement en atelier, à des laboratoires de simulation et à du coaching par les superviseurs',
    ],
    answers: {
      bad:
        'L’entente soutient la formation des travailleurs du secteur manufacturier. Le service améliorera les compétences et aidera les employeurs à renforcer leur main-d’oeuvre.',
      mixed:
        'L’entente finance du perfectionnement en fabrication pour des travailleurs qui se dirigent vers des rôles de production plus techniques. Elle vise à augmenter les attestations et à soutenir davantage de possibilités d’avancement pendant l’année de l’entente. La prestation reposera sur de l’enseignement en atelier, des laboratoires de simulation et du coaching offert par des superviseurs et des formateurs.',
      good:
        'Cette entente prévoit 710 000 $ pour du perfectionnement en fabrication dans les opérations CNC, l’inspection de la qualité et le soutien à la robotique. Elle cible 220 travailleurs, 180 attestations complétées et 95 progressions salariales ou fonctionnelles d’ici juin 2027. La formation sera livrée grâce à de l’enseignement en atelier, à des séances en laboratoire de simulation et à du coaching par les superviseurs lié au plan d’avancement de chaque travailleur.',
      off_topic:
        'Lavez le vélo après des sorties sur des routes salées, séchez la chaîne et ajoutez du lubrifiant frais une fois les maillons propres si les vitesses deviennent bruyantes.',
    },
  },
  'career-navigation-care-leavers': {
    question:
      'Que finance cette entente sur l’orientation de carrière pour les jeunes quittant la prise en charge, quels résultats d’emploi sont attendus et comment le service sera livré?',
    criteria: [
      'Indique que l’entente finance de l’orientation de carrière pour des jeunes quittant la prise en charge',
      'Nomme les résultats visés pour les jeunes, les plans de formation et les placements',
      'Explique que le travail est livré grâce à des accompagnateurs, à des aiguillages vers des employeurs et à des soutiens à la transition',
    ],
    answers: {
      bad:
        'L’entente soutient des services de carrière pour les jeunes quittant la prise en charge. Le fournisseur utilisera les fonds pour améliorer les parcours vers le travail et la vie adulte.',
      mixed:
        'L’entente finance de l’orientation de carrière pour des jeunes quittant la prise en charge qui ont besoin d’aide pour passer vers le travail ou la formation. Elle vise à augmenter le nombre de plans complétés et à soutenir davantage de placements en emploi pendant la durée de l’entente. La prestation reposera sur des accompagnateurs dédiés, des aiguillages vers des employeurs et des soutiens à la transition comme le transport ou l’équipement de travail.',
      good:
        'Cette entente prévoit 560 000 $ pour un service d’orientation de carrière destiné à des jeunes quittant la prise en charge dans trois régions de service. Elle cible 140 jeunes, 120 plans de formation ou d’emploi complétés et 85 placements en emploi ou en études postsecondaires d’ici décembre 2026. Le service sera livré grâce à des accompagnateurs dédiés, à des aiguillages vers des employeurs et des programmes de formation, et à des soutiens à la transition comme des laissez-passer de transport, de l’équipement de travail et de la coordination liée au logement.',
      off_topic:
        'Congelez la sauce restante à plat dans un sac, inscrivez la date dessus et faites-la décongeler au réfrigérateur pendant la nuit si vous voulez des soupers de semaine plus rapides.',
    },
  },
  'tele-rehab': {
    question:
      'Résumez cette entente sur la téléréadaptation : quel service est financé, quels résultats pour les patients sont attendus et comment le service sera livré.',
    criteria: [
      'Indique que l’entente finance des services de téléréadaptation',
      'Nomme les résultats visés pour les patients, les séances et la récupération',
      'Explique que le service est livré grâce à de la thérapie virtuelle, à des plans d’exercices à domicile et à des suivis cliniques',
    ],
    answers: {
      bad:
        'L’entente soutient des services de réadaptation offerts à distance. Le fournisseur utilisera les fonds pour améliorer l’accès et le soutien à la récupération des patients.',
      mixed:
        'L’entente finance de la téléréadaptation pour des patients qui se remettent d’une chirurgie ou d’une blessure et qui ne peuvent pas se rendre facilement en clinique. Elle vise à augmenter les séances de thérapie et à améliorer le suivi de la récupération pendant la durée de l’entente. La prestation comprendra des rendez-vous virtuels de thérapie, des plans d’exercices à domicile et des suivis cliniques.',
      good:
        'Cette entente prévoit 630 000 $ pour des services de téléréadaptation destinés à des patients en convalescence après une chirurgie orthopédique, un AVC ou une blessure au travail. Elle cible 420 patients, 3 600 séances virtuelles de thérapie et 300 patients atteignant les jalons de récupération prévus dans leur plan de soins d’ici mars 2027. Le service sera livré grâce à des rendez-vous virtuels de thérapie, à des plans d’exercices à domicile et à des suivis planifiés entre les séances.',
      off_topic:
        'Rangez le pèse-bagage dans la poche extérieure, pesez la valise avant d’ajouter les chaussures et portez le manteau dans l’avion si les limites de la compagnie sont serrées.',
    },
  },
  'dialysis-transport': {
    question:
      'Expliquez cette entente sur le transport pour dialyse : quel service est financé, quels résultats pour les déplacements sont attendus et comment le service sera livré.',
    criteria: [
      'Indique que l’entente finance du soutien au transport pour la dialyse',
      'Nomme les résultats visés pour les trajets, les clients et l’assiduité',
      'Explique que le service est livré grâce à une planification centralisée, à des conducteurs et à la coordination des rendez-vous',
    ],
    answers: {
      bad:
        'L’entente soutient le transport de patients qui ont besoin de soins médicaux. Le service vise à améliorer l’accès et à réduire les rendez-vous manqués.',
      mixed:
        'L’entente finance du soutien au transport pour des patients en dialyse qui ont de la difficulté à se rendre à leurs traitements. Elle vise à augmenter les trajets complétés et à réduire les rendez-vous manqués pendant la durée de l’entente. La prestation reposera sur une planification centralisée, des conducteurs et une coordination avec les heures de rendez-vous des cliniques de dialyse.',
      good:
        'Cette entente prévoit 540 000 $ pour du soutien au transport destiné à des patients en dialyse venant de collectivités rurales et de banlieues extérieures. Elle cible 11 000 trajets complétés, 180 clients actifs et une réduction du taux de rendez-vous de dialyse manqués sous les 3 % d’ici février 2027. Le service sera livré grâce à une planification centralisée, à des conducteurs sous contrat et à une coordination en temps réel avec les changements d’horaire des cliniques.',
      off_topic:
        'Gardez toutes les piles dans un seul tiroir, marquez celles qui sont chargées et arrêtez de mélanger les vieilles et les neuves si la télécommande cesse toujours de fonctionner.',
    },
  },
  'chronic-pain-selfmanagement': {
    question:
      'Que finance cette entente sur l’autogestion de la douleur chronique, quels résultats pour les clients sont attendus et comment le service sera livré?',
    criteria: [
      'Indique que l’entente finance du soutien à l’autogestion de la douleur chronique',
      'Nomme les résultats visés pour les clients, les séances et la gestion de la douleur',
      'Explique que le programme est livré grâce à des séances de groupe, du coaching et un suivi des plans de soins',
    ],
    answers: {
      bad:
        'L’entente soutient des services liés à la douleur chronique. Le fournisseur utilisera les fonds pour améliorer l’accès et aider les patients à mieux gérer leurs symptômes.',
      mixed:
        'L’entente finance du soutien à l’autogestion de la douleur chronique pour des adultes vivant avec une douleur persistante. Elle vise à augmenter la participation et à aider davantage de clients à mieux gérer leurs symptômes au quotidien pendant l’année de l’entente. La prestation comprendra des séances de groupe, du coaching et des suivis de plans de soins personnalisés.',
      good:
        'Cette entente prévoit 470 000 $ pour du soutien à l’autogestion de la douleur chronique offert avec des partenaires en soins primaires et en santé communautaire. Elle cible 280 clients, 48 cycles de groupes et 190 clients déclarant une meilleure confiance dans la gestion de leur douleur d’ici novembre 2026. Le service sera livré grâce à des séances de groupe structurées, à du coaching individuel et à des revues de suivi du plan de soins de chaque client.',
      off_topic:
        'Pliez les chandails à la verticale, regroupez les câbles avec une pince et gardez toujours une poche vide pour les reçus si le sac à dos devient impossible à défaire.',
    },
  },
  'community-nutrition-cooking': {
    question:
      'Résumez cette entente sur la nutrition communautaire et la cuisine : quel service est financé, quels résultats de participation sont attendus et comment le service sera livré.',
    criteria: [
      'Indique que l’entente finance du soutien communautaire en nutrition et en cuisine',
      'Nomme les résultats visés pour les participants, les cours et les compétences alimentaires',
      'Explique que le service est livré grâce à des cours, à des trousses alimentaires et à du coaching',
    ],
    answers: {
      bad:
        'L’entente soutient des services de nutrition dans la communauté. L’organisation utilisera les fonds pour améliorer l’alimentation saine et les compétences pratiques liées à la nourriture.',
      mixed:
        'L’entente finance du soutien communautaire en nutrition et en cuisine pour des familles confrontées à l’insécurité alimentaire et à des risques de santé liés à l’alimentation. Elle vise à accroître la participation et à renforcer les compétences pratiques pendant la durée de l’entente. La prestation comprendra des cours de cuisine, des trousses alimentaires à emporter et du coaching de suivi.',
      good:
        'Cette entente prévoit 350 000 $ pour du soutien communautaire en nutrition et en cuisine dans quatre carrefours de quartier. Elle cible 240 participants, 96 cours de cuisine et 180 participants réalisant un plan d’action en compétences alimentaires d’ici mai 2027. Le service sera livré grâce à des cours en personne, à des trousses alimentaires à emporter et à du coaching de suivi assuré par des diététistes et des pairs animateurs.',
      off_topic:
        'Faites sécher les pinceaux à plat, enveloppez le bac dans un sac entre deux couches et coupez la ligne de ruban pendant que la peinture est encore un peu souple.',
    },
  },
  'supportive-housing-renovation': {
    question:
      'Que finance cette entente sur la rénovation de logements supervisés, quelles cibles d’amélioration elle fixe et comment les travaux seront livrés?',
    criteria: [
      'Indique que l’entente finance des travaux de rénovation dans des logements supervisés',
      'Nomme les cibles relatives aux suites, à l’accessibilité et aux améliorations du bâtiment',
      'Explique que le travail sera livré grâce à une construction par étapes, à la coordination avec les résidents et à la supervision des entrepreneurs',
    ],
    answers: {
      bad:
        'L’entente soutient des améliorations de logement pour des personnes ayant besoin d’un milieu stable. L’organisation utilisera les fonds pour améliorer l’immeuble et répondre aux besoins des résidents.',
      mixed:
        'L’entente finance des travaux de rénovation dans un immeuble de logements supervisés pour des résidents ayant des besoins complexes. Elle vise à moderniser les suites, à améliorer l’accessibilité et à réaliser d’importantes réparations pendant la durée de l’entente. Les travaux seront livrés par phases avec coordination des résidents et supervision de constructeurs sous contrat.',
      good:
        'Cette entente prévoit 2,1 millions de dollars pour rénover un immeuble de 42 unités de logements supervisés destiné à des résidents sortant de l’itinérance. Elle cible des améliorations dans 42 suites, 18 conversions de salles de bain accessibles et le remplacement complet de la toiture, de l’alarme-incendie et du revêtement de corridor d’ici février 2028. Les travaux seront livrés au moyen d’une construction par étage, de la coordination des déménagements des résidents et de rencontres hebdomadaires de suivi entre le fournisseur de logement, le gestionnaire de projet et les métiers.',
      off_topic:
        'Faites d’abord tremper les lentilles si vous voulez qu’elles cuisent plus vite, puis salez-les vers la fin pour garder les pelures tendres.',
    },
  },
  'rent-bank-expansion': {
    question:
      'Résumez cette entente sur l’élargissement d’une banque de loyer en précisant ce qui est financé, quels résultats sont attendus pour les ménages et comment l’aide sera livrée.',
    criteria: [
      'Indique que l’entente finance de l’aide par banque de loyer',
      'Nomme les cibles relatives aux ménages, à la prévention des expulsions ou aux arriérés',
      'Explique que l’aide est livrée grâce à l’accueil, à l’évaluation et au soutien à la planification du remboursement',
    ],
    answers: {
      bad:
        'L’entente offre du soutien pour aider des ménages à demeurer logés. L’organisation utilisera les fonds pour répondre aux besoins urgents et améliorer la stabilité.',
      mixed:
        'L’entente finance l’élargissement de l’aide par banque de loyer pour des locataires confrontés à des chocs financiers temporaires. Elle vise à aider davantage de ménages à éviter l’expulsion et à réduire leurs arriérés pendant l’année de l’entente. L’aide sera livrée grâce à l’accueil, à l’évaluation de l’admissibilité et au soutien à la planification du remboursement.',
      good:
        'Cette entente prévoit 680 000 $ pour élargir la banque de loyer municipale destinée à des locataires à faible revenu menacés d’expulsion en raison d’arriérés temporaires. Elle cible 310 ménages aidés, 240 procédures d’expulsion évitées et 275 plans de remboursement en place d’ici mars 2027. L’aide sera livrée au moyen d’un accueil centralisé, d’une évaluation des arriérés et des revenus par les intervenants, de paiements directs aux propriétaires et d’un coaching de suivi sur le remboursement.',
      off_topic:
        'Utilisez un crayon tendre pour faire les ombrages, puis remontez les reflets avec une gomme mie de pain au lieu d’appuyer plus fort sur le papier.',
    },
  },
  'tenant-legal-clinic': {
    question:
      'Que finance cette entente sur une clinique juridique pour locataires, quels résultats de service sont attendus et comment la clinique livrera ces résultats?',
    criteria: [
      'Indique que l’entente finance une clinique juridique pour locataires',
      'Nomme les cibles de conseils, de représentation ou de résolution',
      'Explique que le service de clinique est livré grâce à l’accueil, au travail juridique sur les dossiers et au travail de proximité',
    ],
    answers: {
      bad:
        'L’entente soutient de l’aide juridique pour les locataires. Le fournisseur utilisera les fonds pour améliorer l’accès aux conseils et aider les gens à régler leurs problèmes de logement.',
      mixed:
        'L’entente finance une clinique juridique pour des locataires confrontés à une expulsion, à des conditions dangereuses ou à des hausses de loyer illégales. Elle vise à offrir davantage de conseils juridiques et à améliorer la résolution des dossiers pendant la durée de l’entente. La clinique livrera le travail au moyen de l’accueil, du traitement juridique des dossiers et d’un travail de proximité ciblé dans la communauté.',
      good:
        'Cette entente prévoit 590 000 $ pour exploiter une clinique juridique pour locataires destinée à des ménages à faible revenu dans trois quartiers où les expulsions sont élevées. Elle cible 1 100 rendez-vous de conseils juridiques, 260 dossiers de représentation au tribunal et 700 différends résidentiels réglés d’ici décembre 2026. La clinique livrera ces résultats grâce à des séances hebdomadaires d’accueil, au travail sur les dossiers par des avocats et parajuristes, et à des ateliers de proximité dans des centres communautaires et des tours d’habitation.',
      off_topic:
        'Abaissez légèrement la selle du vélo si vos hanches balancent de côté, puis vérifiez la pression des pneus avant de modifier autre chose.',
    },
  },
  'transitional-housing-furniture': {
    question:
      'Décrivez cette entente sur l’ameublement de logements transitoires en indiquant ce qui est financé, quelles cibles d’occupation ou d’emménagement elle fixe et comment les articles seront fournis.',
    criteria: [
      'Indique que l’entente finance de l’ameublement et l’équipement ménager pour des logements transitoires',
      'Nomme les cibles relatives aux unités, à l’occupation et aux emménagements',
      'Explique que le travail est livré grâce à l’approvisionnement, à l’assemblage et à l’installation des unités',
    ],
    answers: {
      bad:
        'L’entente soutient des services de logement transitoire. Le financement aidera à rendre les unités plus fonctionnelles et à améliorer les conditions pour les nouveaux résidents.',
      mixed:
        'L’entente finance l’ameublement et l’installation ménagère pour des unités de logement transitoire utilisées par des personnes quittant les refuges. Elle vise à équiper davantage d’unités et à faciliter les emménagements au cours de l’année. Les articles seront fournis grâce à l’approvisionnement, à l’assemblage et à l’installation par le personnel et des fournisseurs.',
      good:
        'Cette entente prévoit 260 000 $ pour meubler 58 unités de logement transitoire destinées à des adultes et à des familles quittant des refuges d’urgence. Elle cible 58 unités entièrement équipées, 120 résidents installés dans les 14 jours suivant l’aiguillage et la livraison complète d’une trousse de départ pour chaque ménage d’ici octobre 2026. Le travail sera livré au moyen d’achats en vrac de mobilier et de literie, d’un assemblage sous contrat et d’une installation pièce par pièce coordonnée par le personnel en logement avant chaque emménagement.',
      off_topic:
        'Si la soupe manque de relief, ajoutez un peu d’acidité avant de rajouter du sel, car le bouillon a peut-être simplement besoin d’éclat.',
    },
  },
  'encampment-rehousing-team': {
    question:
      'Que finance cette entente sur une équipe de relogement des campements, quelles cibles de relogement sont attendues et comment l’équipe les atteindra-t-elle?',
    criteria: [
      'Indique que l’entente finance une équipe de relogement pour des personnes vivant dans des campements',
      'Nomme les cibles de contacts de proximité, de placements en logement et de stabilisation',
      'Explique que l’équipe livre le travail grâce au travail de rue, à la gestion de cas et à la coordination avec les propriétaires et fournisseurs de logement',
    ],
    answers: {
      bad:
        'L’entente soutient du travail de proximité en logement pour des personnes en situation d’itinérance. L’équipe travaillera à améliorer l’accès aux services et à aider les gens à passer vers des situations plus sécuritaires.',
      mixed:
        'L’entente finance une équipe de relogement des campements pour des personnes vivant à l’extérieur dans des lieux à risque élevé. Elle vise à augmenter les contacts de proximité, à reloger davantage de personnes et à offrir du soutien à la stabilisation pendant la durée de l’entente. L’équipe livrera cela grâce au travail de rue, à la gestion de cas et à la coordination avec des propriétaires et fournisseurs de logement.',
      good:
        'Cette entente prévoit 1,3 million de dollars pour financer une équipe multidisciplinaire de relogement des campements desservant trois sites du centre-ville et de la vallée fluviale. Elle cible 900 contacts de proximité, 160 placements en logement et 120 résidents stabilisés en logement pendant au moins 90 jours d’ici juin 2027. L’équipe livrera ces résultats grâce à des tournées de rue planifiées, à une gestion de cas intensive, à du soutien pour les pièces d’identité et à une coordination avec les propriétaires liée aux suppléments au loyer et à la planification des emménagements.',
      off_topic:
        'Tournez le matelas tous les quelques mois s’il est réversible, mais contentez-vous de le pivoter si l’étiquette indique qu’il a un dessus fixe.',
    },
  },
  'shelter-climate-control': {
    question:
      'Résumez cette entente sur la climatisation et le chauffage d’un refuge d’urgence : ce qui est financé, quelles cibles pour l’installation elle fixe et comment les améliorations seront réalisées.',
    criteria: [
      'Indique que l’entente finance des améliorations de contrôle du climat dans un refuge d’urgence',
      'Nomme les cibles relatives aux pièces, aux espaces communs et au contrôle de la température',
      'Explique que le travail sera réalisé grâce à l’achat d’équipement, à l’installation et à des essais de mise en service',
    ],
    answers: {
      bad:
        'L’entente soutient des améliorations dans un refuge d’urgence. Les travaux rendront le site plus sécuritaire et plus confortable pour les personnes qui utilisent l’installation.',
      mixed:
        'L’entente finance des améliorations de contrôle du climat dans un refuge d’urgence afin d’améliorer la qualité de l’air et la gestion de la température. Elle vise à améliorer les conditions dans les dortoirs et les espaces communs pendant les périodes de chaleur ou de froid extrêmes. Les améliorations seront réalisées grâce à l’achat d’équipement, à l’installation et à des essais effectués par des entrepreneurs.',
      good:
        'Cette entente prévoit 740 000 $ pour installer des améliorations de contrôle du climat dans un refuge d’urgence de 120 lits utilisé pendant les alertes de chaleur et de froid. Elle cible de nouvelles unités de chauffage et de climatisation dans 14 dortoirs, un débit d’air équilibré dans tous les espaces communs et un contrôle de la température intérieure dans la plage visée avant l’hiver 2026. Les travaux seront réalisés grâce à l’approvisionnement en équipement, à une installation hors des heures d’ouverture et à des essais de mise en service supervisés par le gestionnaire des installations du refuge et un ingénieur mécanique.',
      off_topic:
        'Laissez l’autofocus se verrouiller avant de recadrer la photo, surtout en faible lumière où il a tendance à chercher le point.',
    },
  },
  'youth-housing-navigation': {
    question:
      'Que finance cette entente sur la navigation en logement pour les jeunes, quelles cibles de placement elle fixe et comment le soutien à la navigation sera livré?',
    criteria: [
      'Indique que l’entente finance du soutien à la navigation en logement pour les jeunes',
      'Nomme les cibles de jeunes inscrits, de placements en logement et de maintien en logement',
      'Explique que le service est livré grâce à l’accueil, à l’aide à la recherche de logement et à un suivi après l’emménagement',
    ],
    answers: {
      bad:
        'L’entente soutient les jeunes qui ont besoin d’aide pour trouver un logement. Le service améliorera l’accès au soutien et répondra à la demande locale.',
      mixed:
        'L’entente finance du soutien à la navigation en logement pour des jeunes quittant la prise en charge, en hébergement informel ou sortant d’un refuge. Elle vise à relier davantage de jeunes à un logement et à améliorer leur maintien en logement pendant l’année. Le service sera livré grâce à l’accueil, à l’aide à la recherche de logement et à un suivi après l’emménagement.',
      good:
        'Cette entente prévoit 510 000 $ pour du soutien à la navigation en logement destiné à des jeunes de 16 à 24 ans à risque d’itinérance. Elle cible 260 jeunes inscrits, 150 placements en logement et 110 jeunes toujours logés après six mois d’ici août 2027. Le soutien sera livré grâce à un accueil centralisé, à une recherche de logement jumelée avec des propriétaires, à la planification des emménagements et à trois mois de suivi assuré par des intervenants jeunesse en logement.',
      off_topic:
        'Rincez le porte-filtre tout de suite après avoir préparé le café, sinon les huiles durcissent et donnent un goût rance à la tasse suivante.',
    },
  },
  'accessible-home-modifications': {
    question:
      'Décrivez cette entente sur les adaptations domiciliaires accessibles : ce qui est financé, quelles cibles de rénovations sont attendues et comment les adaptations seront livrées.',
    criteria: [
      'Indique que l’entente finance des adaptations domiciliaires accessibles',
      'Nomme les cibles relatives aux domiciles évalués, aux rampes ou appareils de levage et aux adaptations de salle de bain',
      'Explique que les travaux sont livrés grâce à des évaluations professionnelles, à une planification groupée des entrepreneurs et à des inspections finales',
    ],
    answers: {
      bad:
        'L’entente soutient des améliorations domiciliaires pour des résidents ayant des besoins de mobilité. Le financement aidera à rendre les logements plus sécuritaires et plus faciles à utiliser.',
      mixed:
        'L’entente finance des adaptations domiciliaires accessibles pour des aînés et des adultes handicapés vivant dans des logements plus anciens. Elle vise à réaliser davantage d’améliorations de sécurité et à améliorer l’accès au domicile pendant la durée de l’entente. Les adaptations seront livrées grâce à des évaluations à domicile, à la planification des entrepreneurs et à l’inspection des travaux terminés.',
      good:
        'Cette entente prévoit 880 000 $ pour des adaptations domiciliaires accessibles destinées à des aînés et à des adultes handicapés à faible revenu. Elle cible 95 domiciles évalués, 60 installations de rampes ou d’appareils élévateurs et 45 adaptations de salle de bain complétées d’ici janvier 2027. Les travaux seront livrés grâce à des évaluations réalisées par des ergothérapeutes, à une planification groupée des entrepreneurs et à des inspections finales de sécurité avant la fermeture de chaque dossier.',
      off_topic:
        'Gardez le passeport dans la poche intérieure et mettez une étiquette bien visible sur la valise pour la repérer facilement sur le carrousel.',
    },
  },
  'public-washroom-renewal': {
    question:
      'Que finance cette entente sur la réfection de toilettes publiques, quelles cibles pour les installations elle fixe et comment les travaux seront livrés?',
    criteria: [
      'Indique que l’entente finance des travaux de réfection de toilettes publiques',
      'Nomme les cibles relatives aux bâtiments, aux appareils et aux améliorations d’accessibilité',
      'Explique que le travail sera livré grâce à des plans définitifs, à des fermetures échelonnées des sites et à l’exécution par des entrepreneurs',
    ],
    answers: {
      bad:
        'L’entente soutient des améliorations à des installations publiques. Le projet améliorera l’accès et rendra les espaces plus fonctionnels pour la communauté.',
      mixed:
        'L’entente finance des travaux de réfection de toilettes publiques dans des sites très fréquentés de parcs et d’installations civiques. Elle vise à améliorer l’accessibilité, à remplacer des appareils usés et à rouvrir des installations modernisées pendant la durée de l’entente. Les travaux seront livrés grâce à des mises à jour de conception, à la planification de la construction et à l’installation réalisée par des entrepreneurs.',
      good:
        'Cette entente prévoit 1,05 million de dollars pour rénover des toilettes publiques à six sites de parc et de transport collectif. Elle cible six bâtiments entièrement rouverts, le remplacement de 72 appareils et des améliorations d’accessibilité à chacun des sites d’ici septembre 2027. Les travaux seront livrés grâce à des plans définitifs, à des fermetures de sites échelonnées et à l’exécution des travaux par des entrepreneurs sous la supervision de l’équipe municipale d’immobilisations immobilières.',
      off_topic:
        'Tenez l’archet assez souplement pour que le poignet puisse bouger, sinon le son devient mince et rêche sur les longues notes.',
    },
  },
  'culvert-replacement': {
    question:
      'Résumez cette entente sur le remplacement de ponceaux en indiquant ce qui est financé, quelles cibles d’infrastructure sont attendues et comment le projet sera livré.',
    criteria: [
      'Indique que l’entente finance des travaux de remplacement de ponceaux',
      'Nomme les cibles relatives aux ponceaux remplacés, à la capacité hydraulique et à la réouverture de la route',
      'Explique que le projet est livré grâce à des plans d’ingénierie, à la gestion de la circulation et à la construction par un entrepreneur',
    ],
    answers: {
      bad:
        'L’entente soutient des améliorations d’infrastructure dans un secteur vulnérable aux inondations. Le projet améliorera la résilience et traitera des actifs vieillissants.',
      mixed:
        'L’entente finance le remplacement de ponceaux sur un corridor routier rural touché par des inondations répétées et des risques d’emportement. Elle vise à améliorer la capacité de drainage et à achever les travaux pendant la saison de construction. Le projet sera livré grâce à la conception technique, à la planification de la circulation et à la construction par un entrepreneur.',
      good:
        'Cette entente prévoit 1,8 million de dollars pour remplacer deux ponceaux sous le chemin Range Road 14 et stabiliser le réseau de fossés adjacent. Elle cible le remplacement des deux ponceaux, une augmentation de 40 % de la capacité d’écoulement des eaux pluviales et la réouverture complète de la route avant novembre 2026. Le projet sera livré grâce à des plans d’ingénierie signés, à une gestion de la circulation par détour et à la construction supervisée par le service des transports du comté.',
      off_topic:
        'Écrasez l’avocat seulement à la fin si vous voulez une texture plus grossière, et ne gardez pas le noyau dedans parce qu’il n’empêche pas le brunissement.',
    },
  },
  'bus-shelter-installation': {
    question:
      'Que finance cette entente sur l’installation d’abribus, quelles cibles d’accès pour les usagers elle fixe et comment l’installation sera réalisée?',
    criteria: [
      'Indique que l’entente finance l’installation de nouveaux abribus',
      'Nomme les cibles relatives aux abribus, aux quais accessibles et aux arrêts prioritaires',
      'Explique que le travail sera réalisé grâce à l’approvisionnement, à la préparation des sites et à des équipes d’installation',
    ],
    answers: {
      bad:
        'L’entente soutient des améliorations au transport collectif. Le financement rendra les aires d’attente meilleures pour les usagers et améliorera l’accès public.',
      mixed:
        'L’entente finance l’installation de nouveaux abribus à des arrêts ayant un fort achalandage et une faible protection contre les intempéries. Elle vise à améliorer le confort des usagers et l’accessibilité à davantage d’arrêts pendant la période de déploiement. L’installation sera réalisée grâce à l’approvisionnement des abribus, à la préparation des sites et à des équipes sur le terrain.',
      good:
        'Cette entente prévoit 920 000 $ pour installer des abribus à 24 arrêts de transport collectif très fréquentés qui ne sont pas protégés contre les intempéries. Elle cible 24 nouveaux abribus, 18 améliorations de quais accessibles et l’achèvement de tous les arrêts prioritaires avant décembre 2026. Le travail sera réalisé grâce à l’approvisionnement des structures, à la préparation des dalles de béton, à la vérification des services publics et à des équipes d’installation coordonnées avec la division des opérations du transport collectif.',
      off_topic:
        'Un élan arrière plus lent aide souvent au contrôle au tennis parce qu’il vous laisse plus de temps pour orienter la raquette.',
    },
  },
  'stormwater-sensor-network': {
    question:
      'Décrivez cette entente sur un réseau de capteurs d’eaux pluviales : ce qui est financé, quelles cibles de surveillance sont attendues et comment le réseau sera déployé.',
    criteria: [
      'Indique que l’entente finance un réseau de capteurs d’eaux pluviales',
      'Nomme les cibles relatives aux capteurs, aux sites avec télémétrie et à l’intégration au tableau de bord',
      'Explique que le réseau est déployé grâce à l’achat d’équipement, à l’installation sur le terrain et à l’intégration des données',
    ],
    answers: {
      bad:
        'L’entente soutient des améliorations du suivi des infrastructures. Le projet aidera la municipalité à mieux comprendre l’état du réseau et à mieux planifier ses interventions.',
      mixed:
        'L’entente finance un réseau de capteurs d’eaux pluviales afin d’améliorer la surveillance dans des bassins et exutoires à risque d’inondation. Elle vise à ajouter plus de capteurs et à améliorer la visibilité en temps réel du réseau pendant la durée de l’entente. Le réseau sera déployé grâce à l’achat d’équipement, à l’installation sur le terrain et à l’intégration des données.',
      good:
        'Cette entente prévoit 610 000 $ pour déployer un réseau de capteurs d’eaux pluviales dans huit bassins et exutoires principaux vulnérables aux inondations. Elle cible l’installation de 36 capteurs de niveau et de débit, la télémétrie en temps réel sur les huit sites et l’intégration à un tableau de bord pour le personnel des opérations d’ici juillet 2027. Le réseau sera déployé grâce à l’achat d’équipement, à l’installation par des entrepreneurs et à l’intégration des flux de capteurs à la plateforme municipale existante des opérations de l’eau.',
      off_topic:
        'Repliez la carte sur ses plis d’origine avant de la ranger, sinon elle n’entrera plus jamais correctement dans le coffre à gants.',
    },
  },
  'library-roof-repair': {
    question:
      'Résumez cette entente sur la réparation du toit d’une bibliothèque : ce qu’elle finance, quelles cibles de réparation elle fixe et comment les travaux seront livrés.',
    criteria: [
      'Indique que l’entente finance des travaux de réparation du toit d’une bibliothèque',
      'Nomme les cibles relatives à la membrane remplacée, aux fuites éliminées et à la réouverture des espaces',
      'Explique que le travail est livré grâce à un appel d’offres public, à une construction estivale par étapes et à une inspection finale',
    ],
    answers: {
      bad:
        'L’entente soutient des réparations à un bâtiment public. Le projet protégera l’installation et améliorera l’entretien à long terme.',
      mixed:
        'L’entente finance des réparations de toiture à une bibliothèque publique touchée par des fuites persistantes et des dégâts d’eau. Elle vise à remplacer les sections endommagées et à terminer les travaux avant un autre hiver. Le travail sera livré grâce à l’appel d’offres, à la planification de la construction et à une inspection après travaux.',
      good:
        'Cette entente prévoit 430 000 $ pour réparer le toit qui fuit de la bibliothèque West Branch et empêcher d’autres dommages à l’intérieur. Elle cible le remplacement de 9 200 pieds carrés de membrane de toiture, l’élimination de toutes les fuites actives et la réouverture complète de la salle de lecture de l’étage supérieur d’ici octobre 2026. Les travaux seront livrés grâce à un appel d’offres public, à une construction estivale par étapes et à une inspection par un tiers avant l’acceptation finale.',
      off_topic:
        'Ramollir légèrement le beurre avant de le crémer donne une pâte plus lisse, mais il ne doit pas être fondu.',
    },
  },
  'rural-bridge-lighting': {
    question:
      'Que finance cette entente sur l’éclairage d’un pont rural, quelles cibles de sécurité sont attendues et comment le projet d’éclairage sera livré?',
    criteria: [
      'Indique que l’entente finance des améliorations d’éclairage sur un pont rural',
      'Nomme les cibles relatives aux appareils, à la couverture lumineuse et à l’achèvement du projet',
      'Explique que le projet est livré grâce à la conception électrique, à l’installation et à des essais de nuit',
    ],
    answers: {
      bad:
        'L’entente soutient des améliorations de sécurité routière. Les travaux amélioreront la visibilité et aideront les usagers à circuler plus sécuritairement.',
      mixed:
        'L’entente finance des améliorations d’éclairage sur un corridor de pont rural où la visibilité de nuit est mauvaise et où il existe des préoccupations liées aux collisions. Elle vise à améliorer l’éclairage et à créer des conditions de traversée plus sûres pendant la durée du projet. Le projet sera livré grâce à la conception électrique, à l’installation et à des essais.',
      good:
        'Cette entente prévoit 390 000 $ pour installer des améliorations d’éclairage sur le pont Pine River et ses deux segments d’approche. Elle cible 28 nouveaux luminaires DEL, une couverture lumineuse complète sur le tablier du pont et les accotements, et l’achèvement du projet avant la saison des brouillards de 2026. Le projet sera livré grâce à une conception électrique signée, à l’installation des poteaux et luminaires par un entrepreneur et à des essais nocturnes des niveaux de lumière avant la remise.',
      off_topic:
        'Rédigez le premier paragraphe en dernier si vous bloquez sur une dissertation, parce qu’il est plus facile à écrire une fois les idées principales déjà claires.',
    },
  },
  'playground-inclusion-upgrade': {
    question:
      'Décrivez cette entente sur la mise à niveau inclusive d’un terrain de jeu en indiquant ce qui est financé, quelles cibles de participation elle fixe et comment le projet sera livré.',
    criteria: [
      'Indique que l’entente finance des améliorations inclusives à un terrain de jeu',
      'Nomme les cibles relatives au site, aux éléments accessibles ou sensoriels et aux parcours sans obstacle',
      'Explique que le projet est livré grâce à une revue de conception universelle, à l’approvisionnement en équipement spécialisé et à l’installation par un entrepreneur',
    ],
    answers: {
      bad:
        'L’entente soutient des améliorations à un espace de loisirs public. Les travaux rendront l’endroit plus accueillant et amélioreront l’accès pour la communauté.',
      mixed:
        'L’entente finance des améliorations inclusives à un terrain de jeu afin que des enfants ayant différents besoins moteurs et sensoriels puissent utiliser le site plus facilement. Elle vise à ajouter des éléments accessibles et à accroître l’utilisation du terrain pendant la durée du projet. La mise à niveau sera livrée grâce à des travaux de conception, à l’approvisionnement en équipement et à l’installation.',
      good:
        'Cette entente prévoit 540 000 $ pour moderniser le terrain de jeu du parc Maple avec de l’équipement inclusif et des éléments d’accès. Elle cible un terrain entièrement modernisé, 12 nouveaux éléments de jeu accessibles ou sensoriels et des parcours sans obstacle depuis le stationnement et les toilettes d’ici juillet 2027. Le projet sera livré grâce à une revue de conception universelle, à l’approvisionnement en équipement spécialisé et à l’installation coordonnée par l’équipe des immobilisations des parcs.',
      off_topic:
        'Si la fermeture éclair coince, frottez un peu de savon sur les dents avant de forcer, sinon le tissu peut se déchirer autour de la couture.',
    },
  },
  'after-school-arts-program': {
    question:
      'Que finance cette entente sur un programme artistique après l’école, quelles cibles de participation des jeunes sont attendues et comment le programme sera livré?',
    criteria: [
      'Indique que l’entente finance un programme artistique après l’école',
      'Nomme les cibles relatives aux jeunes, aux séances de programme et aux parcours artistiques complétés',
      'Explique que le programme est livré grâce à des cours animés par des artistes dans des sites partenaires, avec aiguillage scolaire et suivi de présence',
    ],
    answers: {
      bad:
        'L’entente soutient des occasions artistiques pour les jeunes. L’organisation utilisera les fonds pour élargir la programmation et améliorer la mobilisation.',
      mixed:
        'L’entente finance un programme artistique après l’école pour des jeunes de quartiers mal desservis. Elle vise à accroître la participation et à offrir une programmation créative plus régulière pendant l’année scolaire. Le programme sera livré grâce à des cours animés par des artistes dans des sites partenaires.',
      good:
        'Cette entente prévoit 310 000 $ pour offrir un programme artistique après l’école à des jeunes de 11 à 17 ans dans quatre écoles de quartier et carrefours communautaires. Elle cible 220 jeunes participants, 180 séances de programme et 150 jeunes complétant au moins un parcours artistique de plusieurs semaines d’ici juin 2027. Le programme sera livré grâce à des cours hebdomadaires d’arts visuels, de musique et de médias animés par des artistes-enseignants, avec des aiguillages scolaires et un suivi de la présence.',
      off_topic:
        'Faites refroidir le riz sur une plaque si vous voulez l’utiliser plus tard pour du riz frit, car le riz chaud collé devient pâteux dans la poêle.',
    },
  },
  'seniors-checkin-network': {
    question:
      'Résumez cette entente sur un réseau de vérification auprès des aînés en indiquant ce qui est financé, quelles cibles de soutien de proximité sont attendues et comment le réseau fonctionnera.',
    criteria: [
      'Indique que l’entente finance un réseau de vérification auprès des aînés',
      'Nomme les cibles relatives aux aînés inscrits, aux vérifications et aux aiguillages',
      'Explique que le réseau fonctionne grâce à une planification centralisée, à des bénévoles et à un suivi par le personnel de navigation',
    ],
    answers: {
      bad:
        'L’entente soutient des services communautaires pour les aînés. Le financement aidera à réduire l’isolement et à améliorer les liens avec le soutien disponible.',
      mixed:
        'L’entente finance un réseau de vérification auprès des aînés pour des personnes âgées isolées ou vivant seules. Elle vise à augmenter les contacts réguliers et à relier davantage d’aînés à des soutiens communautaires pendant la durée de l’entente. Le réseau fonctionnera grâce à des contacts planifiés, à des bénévoles et à des aiguillages de suivi.',
      good:
        'Cette entente prévoit 280 000 $ pour exploiter un réseau de vérification auprès des aînés destiné à des adultes isolés de plus de 70 ans dans cinq quartiers. Elle cible 420 aînés inscrits, 9 600 vérifications téléphoniques ou au pas de la porte et 260 aiguillages vers des soutiens alimentaires, de transport ou de santé d’ici mars 2027. Le réseau fonctionnera grâce à une planification centralisée des contacts, à des bénévoles formés qui effectuent des suivis hebdomadaires et à des aiguillages coordonnés par un navigateur de programme.',
      off_topic:
        'Gardez les vis de chaque tablette dans des contenants séparés pendant le montage, sinon il devient difficile de savoir quelle longueur va où.',
    },
  },
  'food-pantry-cold-storage': {
    question:
      'Que finance cette entente sur l’entreposage frigorifique d’une banque alimentaire, quelles cibles de capacité sont attendues et comment le projet sera livré?',
    criteria: [
      'Indique que l’entente finance une augmentation de la capacité d’entreposage frigorifique dans une banque alimentaire',
      'Nomme les cibles relatives aux chambres froides, à la capacité réfrigérée et au volume d’aliments frais traités',
      'Explique que le projet est livré grâce à l’achat d’équipement, à l’installation par un entrepreneur et à des procédures mises à jour',
    ],
    answers: {
      bad:
        'L’entente soutient des améliorations aux services de distribution alimentaire. Le projet aidera la banque alimentaire à servir les gens plus efficacement et à réduire le gaspillage.',
      mixed:
        'L’entente finance une augmentation de la capacité d’entreposage frigorifique pour une banque alimentaire qui distribue des aliments frais aux ménages locaux. Elle vise à accroître le stockage réfrigéré et le volume d’aliments frais traités pendant la durée de l’entente. Le projet sera livré grâce à l’achat d’équipement, à l’installation et à la mise à jour des procédures du personnel.',
      good:
        'Cette entente prévoit 190 000 $ pour élargir la capacité d’entreposage frigorifique d’une banque alimentaire régionale au service de ménages à faible revenu. Elle cible l’installation de deux chambres froides, une augmentation de 60 % de la capacité réfrigérée et le traitement de 180 000 livres additionnelles d’aliments frais d’ici décembre 2026. Le projet sera livré grâce à l’achat d’équipement, à l’installation par un entrepreneur et à des procédures révisées de réception et de rotation mises en oeuvre par le personnel.',
      off_topic:
        'Épongez d’abord la tache au lieu de la frotter, sinon elle pénètre plus profondément dans le tissu et devient plus difficile à faire partir.',
    },
  },
  'neighbourhood-cleanup-microgrants': {
    question:
      'Décrivez cette entente sur des microsubventions de nettoyage de quartier en indiquant ce qui est financé, quelles cibles de nettoyage sont attendues et comment les subventions seront administrées.',
    criteria: [
      'Indique que l’entente finance des microsubventions pour des nettoyages de quartier',
      'Nomme les cibles relatives aux subventions accordées, aux événements de nettoyage et aux bénévoles',
      'Explique que les subventions sont administrées grâce à un court processus de demande, à des approbations continues et à des événements appuyés par la ville',
    ],
    answers: {
      bad:
        'L’entente soutient des activités d’amélioration de quartier. Le financement aidera les résidents à participer à des nettoyages communautaires et à d’autres projets locaux.',
      mixed:
        'L’entente finance des microsubventions de nettoyage de quartier pour des groupes de résidents et des associations locales. Elle vise à soutenir davantage d’événements de nettoyage et à améliorer la participation sur plusieurs sites pendant l’année. Les subventions seront administrées grâce à des demandes, à des approbations et à du soutien pour des événements de bénévoles.',
      good:
        'Cette entente prévoit 125 000 $ pour des microsubventions de nettoyage de quartier destinées à des groupes de résidents, des conseils d’école et des associations de rue. Elle cible 50 microsubventions accordées, 120 événements de nettoyage et 3 500 bénévoles mobilisés dans des parcs, ruelles et rives de ruisseaux d’ici octobre 2026. Les subventions seront administrées grâce à un court processus de demande, à des approbations continues par le personnel et à des événements appuyés comprenant les fournitures, la collecte des déchets et des formulaires de reddition de comptes.',
      off_topic:
        'Essayez une foulée plus courte dans les montées raides, car allonger le pas fatigue les jambes plus vite que de faire de petits pas rapides.',
    },
  },
  'cultural-festival-safety-plan': {
    question:
      'Que finance cette entente sur le plan de sécurité d’un festival culturel, quelles cibles de préparation d’événement elle fixe et comment le plan sera livré?',
    criteria: [
      'Indique que l’entente finance la planification de la sécurité et l’équipement pour un festival culturel',
      'Nomme les cibles relatives au plan approuvé, au nombre de personnes formées et à l’état de préparation d’urgence',
      'Explique que le plan est livré grâce à une planification conjointe, à l’achat d’équipement et à une formation coordonnée du personnel',
    ],
    answers: {
      bad:
        'L’entente soutient la préparation d’un festival communautaire. Les travaux amélioreront la sécurité et aideront les organisateurs à tenir l’événement plus efficacement.',
      mixed:
        'L’entente finance la planification de la sécurité et l’équipement pour un festival culturel de plusieurs jours dans une place publique du centre-ville. Elle vise à améliorer l’état de préparation de l’événement et à renforcer l’organisation du personnel et des mesures d’urgence avant l’ouverture du festival. Le plan sera livré grâce au travail de planification, à l’achat d’équipement et à la coordination du personnel.',
      good:
        'Cette entente prévoit 210 000 $ pour financer la planification de la sécurité, des barrières, des radios et de la formation pour le festival culturel River Lights. Elle cible un plan de sécurité approuvé, 140 employés et bénévoles formés et un état complet de préparation aux interventions d’urgence avant la première date de l’événement en août 2026. Le plan sera livré grâce à des rencontres conjointes avec les services d’urgence, à l’achat d’équipement de sécurité et à des horaires coordonnés de formation et de déploiement du personnel.',
      off_topic:
        'Gardez le chargeur enroulé sans le serrer dans le sac, car ce sont les plis trop serrés près de la fiche qui brisent le câble en premier.',
    },
  },
  'community-garden-irrigation': {
    question:
      'Résumez cette entente sur l’irrigation d’un jardin communautaire en indiquant ce qui est financé, quelles cibles de capacité du jardin sont attendues et comment les travaux seront livrés.',
    criteria: [
      'Indique que l’entente finance des améliorations d’irrigation dans un jardin communautaire',
      'Nomme les cibles relatives aux parcelles desservies, aux plates-bandes de production et aux pertes de récoltes',
      'Explique que le travail est livré grâce à la conception, à l’installation et à une coordination avec le comité du jardin',
    ],
    answers: {
      bad:
        'L’entente soutient des améliorations dans un jardin communautaire. Le projet aidera les jardiniers et améliorera le site pour les résidents du quartier.',
      mixed:
        'L’entente finance des améliorations d’irrigation dans un jardin communautaire ayant un accès à l’eau peu fiable et des pertes de récoltes pendant les périodes sèches. Elle vise à améliorer la couverture d’arrosage et à soutenir une meilleure utilisation du jardin pendant la saison. Les travaux seront livrés grâce à la conception du système, à l’installation et à une coordination avec les responsables du jardin.',
      good:
        'Cette entente prévoit 145 000 $ pour installer des améliorations d’irrigation au jardin communautaire Eastview. Elle cible un accès à l’eau pour les 84 parcelles, une irrigation goutte à goutte pour 26 plates-bandes de production partagées et une réduction de 30 % des pertes de récoltes d’été d’ici la fin de la saison de croissance 2027. Les travaux seront livrés grâce à la conception du tracé, à l’installation des conduites et des valves par un entrepreneur et à une coordination avec le comité du jardin pour le phasage et la formation.',
      off_topic:
        'Tapez légèrement tout autour du couvercle avec le manche d’une cuillère avant de réessayer si le pot est sous vide.',
    },
  },
  'community-media-lab': {
    question:
      'Que finance cette entente sur un laboratoire communautaire de médias, quelles cibles de participation sont attendues et comment le laboratoire sera livré?',
    criteria: [
      'Indique que l’entente finance un laboratoire communautaire de médias',
      'Nomme les cibles relatives aux participants, aux ateliers et aux projets terminés',
      'Explique que le laboratoire est livré grâce à l’achat d’équipement, à l’enseignement et à l’exploitation quotidienne du site',
    ],
    answers: {
      bad:
        'L’entente soutient de la programmation créative pour les membres de la communauté. Le financement améliorera l’accès à la technologie et aux occasions d’apprentissage.',
      mixed:
        'L’entente finance un laboratoire communautaire de médias où des jeunes et des adultes peuvent apprendre l’audio, la vidéo et la narration numérique. Elle vise à accroître la participation et à offrir davantage d’occasions d’apprentissage pratique pendant la durée de l’entente. Le laboratoire sera livré grâce à l’achat d’équipement, à l’enseignement et à l’exploitation du site.',
      good:
        'Cette entente prévoit 360 000 $ pour établir un laboratoire communautaire de médias axé sur la narration numérique, la baladodiffusion et le montage vidéo pour des jeunes et des adultes nouvellement arrivés. Elle cible 260 participants, 120 ateliers et 180 projets médiatiques complétés d’ici avril 2027. Le laboratoire sera livré grâce à l’achat d’équipement d’enregistrement et de montage, à des cours à horaire fixe animés par des éducateurs médias et à une exploitation quotidienne supervisée au carrefour d’apprentissage du centre-ville.',
      off_topic:
        'Orientez la lampe de bureau loin de l’écran si vous voulez moins de reflets pendant les appels vidéo en soirée.',
    },
  },
  'sports-league-fee-subsidy': {
    question:
      'Décrivez cette entente sur une subvention des frais d’inscription aux ligues sportives en indiquant ce qui est financé, quelles cibles d’inscription elle fixe et comment le programme sera livré.',
    criteria: [
      'Indique que l’entente finance des subventions de frais pour des ligues sportives',
      'Nomme les cibles relatives aux inscriptions subventionnées, aux enfants ayant complété une saison et aux sports couverts',
      'Explique que le programme est livré grâce à l’accueil des demandes, à la vérification de l’admissibilité et au traitement des paiements directs',
    ],
    answers: {
      bad:
        'L’entente soutient l’accès aux loisirs pour les familles. Le financement aidera à réduire les obstacles liés aux coûts et à améliorer la participation aux programmes locaux.',
      mixed:
        'L’entente finance des subventions de frais d’inscription à des ligues sportives pour des enfants de ménages à faible revenu. Elle vise à soutenir davantage d’inscriptions et à améliorer la participation à des activités structurées pendant l’année. Le programme sera livré grâce à l’accueil des demandes, à la vérification de l’admissibilité et au traitement des paiements.',
      good:
        'Cette entente prévoit 275 000 $ pour des subventions de frais d’inscription à des ligues sportives destinées à des enfants de 6 à 17 ans de familles à faible revenu. Elle cible 480 inscriptions subventionnées, 360 enfants complétant une saison entière et une participation dans le soccer, le basketball, la natation et le hockey d’ici mars 2027. Le programme sera livré grâce à l’accueil des demandes en ligne et en personne, à la vérification de l’admissibilité par le personnel des loisirs et au traitement des paiements directs avec les ligues participantes.',
      off_topic:
        'Vérifiez que les pieds de l’échelle reposent bien sur un sol solide avant de monter; l’instabilité à la base est le principal risque à éviter.',
    },
  },
  'eviction-mediation-service': {
    question:
      'Que finance cette entente sur un service de médiation en matière d’expulsion, quelles cibles de résolution sont attendues et comment le service sera livré?',
    criteria: [
      'Indique que l’entente finance un service de médiation en matière d’expulsion',
      'Nomme les cibles relatives aux accueils, aux ententes signées et aux expulsions évitées',
      'Explique que le service est livré grâce à un accueil centralisé, à des séances de médiation et à du soutien de suivi',
    ],
    answers: {
      bad:
        'L’entente soutient des services de stabilité résidentielle pour des locataires et des propriétaires. Le programme aidera à résoudre des conflits et à améliorer les résultats locaux.',
      mixed:
        'L’entente finance un service de médiation en matière d’expulsion pour des locataires et des propriétaires confrontés à des arriérés de loyer et à des différends locatifs. Elle vise à régler davantage de dossiers et à prévenir plus d’expulsions pendant la durée de l’entente. Le service sera livré grâce à l’accueil, à des séances de médiation et à du soutien de suivi.',
      good:
        'Cette entente prévoit 420 000 $ pour financer un service de médiation en matière d’expulsion destiné à des locataires à faible revenu et à de petits propriétaires avant l’escalade au tribunal. Elle cible 520 accueils en médiation, 300 ententes signées de remboursement ou de location et 220 expulsions évitées d’ici novembre 2027. Le service sera livré grâce à un accueil centralisé, à des séances dirigées par des médiateurs formés et à un soutien de suivi pour vérifier le respect des ententes.',
      off_topic:
        'Laissez infuser le thé un peu moins longtemps si les feuilles sont très petites, car les feuilles brisées libèrent plus vite leur amertume.',
    },
  },
  'modular-housing-site-setup': {
    question:
      'Résumez cette entente sur la préparation d’un site de logements modulaires : ce qui est financé, quelles cibles de préparation elle comprend et comment le site sera aménagé.',
    criteria: [
      'Indique que l’entente finance la préparation d’un site pour un projet de logements modulaires',
      'Nomme les cibles relatives au raccordement des services, aux fondations et à l’état de préparation à l’occupation',
      'Explique que le site sera préparé grâce aux travaux de viabilisation, aux fondations de béton et à une coordination de chantier hebdomadaire',
    ],
    answers: {
      bad:
        'L’entente soutient un nouveau projet de logement. Le projet préparera un site pour des résidents et améliorera la capacité locale.',
      mixed:
        'L’entente finance la préparation d’un site pour un projet de logements modulaires visant à créer rapidement une nouvelle capacité de logement supervisé. Elle vise à préparer le terrain, à raccorder les services et à rendre le projet prêt à l’occupation pendant la durée de l’entente. Le site sera aménagé grâce à des travaux de viabilisation, à l’installation des fondations et à une coordination entre entrepreneurs.',
      good:
        'Cette entente prévoit 2,4 millions de dollars pour préparer un ancien stationnement en vue d’un projet de 36 logements modulaires supervisés. Elle cible le raccordement complet des services pour 36 unités, l’achèvement des dalles de fondation et des voies d’accès, et l’état de préparation à l’occupation avant la livraison des modules en mars 2027. Le site sera aménagé grâce à des travaux souterrains de viabilisation, à des fondations de béton et à une coordination hebdomadaire entre l’entrepreneur civil, les fournisseurs de services publics et le constructeur modulaire.',
      off_topic:
        'Utilisez l’extrémité du pain pour faire de la chapelure au lieu de la jeter, car les bouts secs se réduisent particulièrement bien en miettes.',
    },
  },
  'womens-shelter-security-upgrades': {
    question:
      'Décrivez cette entente sur les améliorations de sécurité d’un refuge pour femmes en indiquant ce qui est financé, quelles cibles de sécurité elle fixe et comment les améliorations seront livrées.',
    criteria: [
      'Indique que l’entente finance des améliorations de sécurité dans un refuge pour femmes',
      'Nomme les cibles relatives aux caméras, aux points de contrôle d’accès et à la couverture des entrées et stationnements',
      'Explique que les travaux sont livrés grâce à l’achat d’équipement, à l’installation et à la formation du personnel sur les protocoles',
    ],
    answers: {
      bad:
        'L’entente soutient des améliorations de sécurité dans un refuge. Le financement aidera à rendre l’immeuble plus sûr pour les résidentes et le personnel.',
      mixed:
        'L’entente finance des améliorations de sécurité dans un refuge pour femmes accueillant des survivantes de violence et leurs enfants. Elle vise à renforcer le contrôle des accès, à améliorer la surveillance et à rendre le site plus sûr pendant la durée de l’entente. Les améliorations seront livrées grâce à l’approvisionnement, à l’installation et à la formation du personnel.',
      good:
        'Cette entente prévoit 330 000 $ pour financer des améliorations de sécurité dans un refuge pour femmes de 48 lits et dans son aile de soutien aux enfants. Elle cible 32 nouvelles caméras, des points de contrôle d’accès améliorés à toutes les portes extérieures et une couverture surveillée complète des entrées, couloirs et aires de stationnement d’ici janvier 2027. Les améliorations seront livrées grâce à l’achat d’équipement de sécurité, à l’installation par un entrepreneur et à la formation du personnel sur les protocoles d’accès et de surveillance.',
      off_topic:
        'Un linge humide enlève la plupart de la poussière sur les plantes d’intérieur mieux qu’un vaporisateur lustrant, qui laisse souvent une pellicule.',
    },
  },
  'sidewalk-snow-melt-pilot': {
    question:
      'Que finance cette entente sur un projet pilote de trottoir chauffant, quelles cibles pilotes elle fixe et comment le projet sera livré?',
    criteria: [
      'Indique que l’entente finance un projet pilote de fonte de neige sur trottoir',
      'Nomme les cibles relatives au segment chauffé, à la réduction des fermetures et à la disponibilité du système',
      'Explique que le projet pilote est livré grâce à une conception détaillée, à une installation par phases et à un suivi hivernal',
    ],
    answers: {
      bad:
        'L’entente soutient un projet d’entretien hivernal. Les travaux amélioreront l’accès piétonnier et permettront de tester une nouvelle approche.',
      mixed:
        'L’entente finance un projet pilote de trottoir chauffant près d’un hôpital et d’un échangeur de transport collectif où la circulation piétonne hivernale est forte. Elle vise à améliorer l’accès en hiver et à vérifier si le système peut garder les trottoirs prioritaires plus dégagés pendant les tempêtes. Le projet sera livré grâce à des travaux de conception, à l’installation et à un suivi hivernal.',
      good:
        'Cette entente prévoit 780 000 $ pour installer un projet pilote de trottoir chauffant sur 420 mètres près de l’entrée de l’hôpital régional et des arrêts de transport collectif adjacents. Elle cible une couverture de chauffage opérationnelle sur tout le segment pilote, une réduction des fermetures liées à la glace pendant les tempêtes hivernales et une disponibilité du système supérieure à 95 % durant l’hiver 2026-2027. Le projet sera livré grâce à une conception électrique et civile détaillée, à une installation par phases à l’automne et à un suivi hivernal des conditions de surface et de la consommation d’énergie.',
      off_topic:
        'Ciselez le basilic à la toute dernière minute, car les feuilles meurtries noircissent vite et perdent leur parfum.',
    },
  },
  'harbour-dock-repair': {
    question:
      'Résumez cette entente sur la réparation d’un quai portuaire en indiquant ce qui est financé, quelles cibles de réparation elle fixe et comment les travaux seront livrés.',
    criteria: [
      'Indique que l’entente finance des travaux de réparation sur un quai portuaire',
      'Nomme les cibles relatives aux pieux remplacés, à la surface de pont refaite et à la réouverture du quai',
      'Explique que les travaux sont livrés grâce à une conception d’ingénierie maritime, à une réparation par entrepreneur et à une inspection structurale',
    ],
    answers: {
      bad:
        'L’entente soutient des réparations à une installation riveraine. Le projet améliorera la sécurité et maintiendra le site en service.',
      mixed:
        'L’entente finance des travaux de réparation à un quai portuaire endommagé utilisé par des bateaux de pêche et un service de traversier. Elle vise à rétablir une exploitation sécuritaire et à compléter les principales réparations structurales pendant la fenêtre de construction maritime. Les travaux seront livrés grâce à l’ingénierie maritime, à la réparation par entrepreneur et à l’inspection.',
      good:
        'Cette entente prévoit 1,6 million de dollars pour réparer le quai principal du port de Bay Point et rétablir un amarrage sécuritaire pour les navires commerciaux et de passagers. Elle cible le remplacement de 22 pieux détériorés, la reconstruction de 180 mètres de surface de pont et la réouverture complète du quai avant la saison du printemps 2027. Les travaux seront livrés grâce à une conception d’ingénierie maritime, à une réparation par entrepreneur planifiée selon les marées et l’accès des navires, et à une inspection structurale avant la réouverture.',
      off_topic:
        'Ajoutez les ornements fragiles à la fin lorsque vous remplissez la boîte, et utilisez des vêtements autour d’eux avant de sortir le papier bulle.',
    },
  },
  'pedestrian-signal-retiming': {
    question:
      'Décrivez cette entente sur le recalibrage de signaux piétonniers en indiquant ce qui est financé, quelles cibles de traversée elle fixe et comment le projet sera livré.',
    criteria: [
      'Indique que l’entente finance un recalibrage de signaux piétonniers',
      'Nomme les cibles relatives aux intersections, aux durées de traversée et à la conformité aux normes accessibles',
      'Explique que le projet est livré grâce à l’analyse de circulation, à la programmation des contrôleurs et à des essais sur rue',
    ],
    answers: {
      bad:
        'L’entente soutient des améliorations aux intersections. Le projet améliorera la sécurité des piétons et rendra les traversées plus efficaces.',
      mixed:
        'L’entente finance le recalibrage de signaux piétonniers à des intersections achalandées du centre-ville ayant des minuteries vieillissantes. Elle vise à améliorer les intervalles de marche et à rendre les traversées plus sûres et plus faciles à utiliser pendant la durée du projet. Les travaux seront livrés grâce à l’analyse de circulation, à la programmation des signaux et à des essais sur le terrain.',
      good:
        'Cette entente prévoit 250 000 $ pour recalibrer les signaux piétonniers à 18 intersections du centre-ville et de zones scolaires. Elle cible des intervalles de traversée plus longs aux 18 sites, une synchronisation accessible conforme aux normes actuelles et l’achèvement des ajustements avant le début de l’année scolaire 2026. Le projet sera livré grâce à l’analyse de circulation, à la programmation des contrôleurs et à des essais sur rue avec le personnel municipal des opérations de circulation.',
      off_topic:
        'La pâte doit reposer avant d’être abaissée afin que le gluten se détende et que la pâte cesse de se rétracter sous le rouleau.',
    },
  },
  'library-maker-space': {
    question:
      'Que finance cette entente sur un makerspace en bibliothèque, quelles cibles de participation elle fixe et comment le makerspace sera livré?',
    criteria: [
      'Indique que l’entente finance un makerspace en bibliothèque',
      'Nomme les cibles relatives aux participants, aux séances animées et aux projets terminés',
      'Explique que le makerspace est livré grâce à l’achat d’équipement, à l’animation par le personnel et à des plages d’accès planifiées',
    ],
    answers: {
      bad:
        'L’entente soutient des occasions d’apprentissage à la bibliothèque publique. Le projet améliorera l’accès aux activités pratiques et à la programmation communautaire.',
      mixed:
        'L’entente finance un makerspace en bibliothèque où des jeunes et des adultes peuvent utiliser des outils de conception, de fabrication et de technologie créative. Elle vise à accroître la participation et à offrir plus de séances structurées pendant la durée de l’entente. Le makerspace sera livré grâce à l’achat d’équipement, à l’animation et à la planification de l’horaire par la bibliothèque.',
      good:
        'Cette entente prévoit 295 000 $ pour établir un makerspace en bibliothèque axé sur la fabrication numérique, le codage et l’électronique. Elle cible 340 participants, 110 séances animées et 220 projets terminés par les participants d’ici février 2027. Le makerspace sera livré grâce à l’achat d’équipement de fabrication, à l’animation par le personnel et des bénévoles, et à des plages d’accès planifiées à la bibliothèque centrale.',
      off_topic:
        'Tournez l’enveloppe pour que le rabat s’ouvre à l’opposé de vous avant d’utiliser l’ouvre-lettres; cela aide à ne pas déchirer la page à l’intérieur.',
    },
  },
  'newcomer-language-cafe': {
    question:
      'Résumez cette entente sur un café linguistique pour nouveaux arrivants en indiquant ce qui est financé, quelles cibles de participation elle comprend et comment le programme sera livré.',
    criteria: [
      'Indique que l’entente finance un café linguistique pour les nouveaux arrivants',
      'Nomme les cibles relatives aux participants, aux séances de conversation et aux heures de pratique guidée',
      'Explique que le programme est livré grâce à des animateurs formés, à des tables de conversation dirigées par des bénévoles et à des aiguillages vers des services',
    ],
    answers: {
      bad:
        'L’entente soutient des services pour les nouveaux arrivants. Le programme améliorera les liens sociaux et aidera les gens à gagner en confiance dans la communauté.',
      mixed:
        'L’entente finance un café linguistique pour les nouveaux arrivants où les personnes récemment arrivées peuvent pratiquer l’anglais et se relier à des soutiens d’établissement. Elle vise à accroître la participation et à offrir une pratique régulière de la conversation pendant la durée de l’entente. Le programme sera livré grâce à des animateurs, à des tables de conversation tenues par des bénévoles et à des aiguillages.',
      good:
        'Cette entente prévoit 165 000 $ pour exploiter un café linguistique destiné à des immigrants et réfugiés récemment arrivés qui ont besoin d’une pratique informelle de l’anglais. Elle cible 280 participants, 150 séances de conversation et 190 participants complétant au moins dix heures de pratique guidée d’ici juin 2027. Le programme sera livré grâce à des animateurs formés, à des tables de conversation dirigées par des bénévoles et à des aiguillages en établissement pour les participants qui ont besoin de cours de langue ou de soutien à l’emploi.',
      off_topic:
        'Une éponge légèrement plus humide ramasse mieux les miettes qu’une éponge sèche, mais elle ne devrait jamais dégoutter sur le comptoir.',
    },
  },
  }

function scenarioIdFromCaseId(id: string) {
  return id.replace(/-(bad|mixed|good|off-topic)$/, '')
}

function mapCriteria(
  originalCriteria: BenchmarkCriterion[],
  translatedLabels: [string, string, string],
): BenchmarkCriterion[] {
  return originalCriteria.map((criterion, index) => ({
    ...criterion,
    label: translatedLabels[index] ?? criterion.label,
  }))
}

export const BENCHMARK_CASES_FR_CA: BenchmarkCase[] = BENCHMARK_CASES.map((testCase) => {
  const scenario = SCENARIO_TRANSLATIONS[scenarioIdFromCaseId(testCase.id)]

  if (!scenario) {
    throw new Error(`Missing French translation for benchmark scenario: ${testCase.id}`)
  }

  return {
    ...testCase,
    question: scenario.question,
    criteria: mapCriteria(testCase.criteria, scenario.criteria),
    answer: scenario.answers[testCase.profile],
  }
})
