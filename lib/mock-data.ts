import type { LegalDocument, LegalDocumentSummary } from "@/types";

// ─── 20 Realistic French Legal Decisions ─────────────────────────────────────

export const MOCK_DECISIONS: LegalDocument[] = [
  {
    id: "jurica-2024-001",
    ecli: "ECLI:FR:CCASS:2024:CO00123",
    title: "Cass. com., 15 janv. 2024, n° 22-18.543 – Responsabilité bancaire et devoir de mise en garde",
    juridiction: "Cour de cassation",
    chambre: "Chambre commerciale",
    numero: "22-18.543",
    date: "2024-01-15",
    solution: "Cassation",
    publication: "Bulletin",
    sommaire: "La banque qui accorde un crédit à un emprunteur non averti est tenue d'un devoir de mise en garde à l'égard de ce dernier. Ce devoir, qui s'apprécie au jour de la conclusion du contrat, porte sur le risque d'endettement excessif né de l'octroi du crédit et non sur l'opportunité de l'opération financée.",
    texte: `LA COUR DE CASSATION, CHAMBRE COMMERCIALE, a rendu l'arrêt suivant :

Statuant sur le pourvoi formé par la société Crédit Atlantique, société anonyme, dont le siège est à Paris, contre l'arrêt rendu le 14 mars 2022 par la cour d'appel de Paris (pôle 5, chambre 6), dans le litige l'opposant :

1°/ à M. Jean-Pierre Moreau, domicilié à Lyon,
2°/ à Mme Marie-Claire Moreau, domiciliée à Lyon,

défendeurs à la cassation ;

La demanderesse invoque, à l'appui de son pourvoi, les moyens de cassation annexés au présent arrêt.

Le dossier a été communiqué au procureur général.

Sur le rapport de Mme Granier, conseiller, les observations de Me Vilain, avocat de la société Crédit Atlantique, de la SCP Lévy et Associés, avocat de M. et Mme Moreau, et l'avis de M. Debacq, avocat général, après débats en l'audience publique du 28 novembre 2023 où étaient présents M. Vigneau, président, Mme Granier, conseiller rapporteur, Mme Darbois, conseiller doyen, et Mme Labat, greffier de chambre,

la chambre commerciale de la Cour de cassation, composée des président et conseillers précités, après en avoir délibéré conformément à la loi, a rendu le présent arrêt.

Faits et procédure

1. Selon l'arrêt attaqué, la société Crédit Atlantique a accordé à M. et Mme Moreau, le 12 juin 2018, un prêt immobilier d'un montant de 320 000 euros sur 25 ans.

2. Soutenant que la banque avait manqué à son devoir de mise en garde, les emprunteurs l'ont assignée en responsabilité et indemnisation.

3. Par arrêt du 14 mars 2022, la cour d'appel de Paris a condamné la banque à payer une somme de 48 000 euros à titre de dommages-intérêts.

Examen des moyens

Sur le premier moyen, pris en sa première branche

Enoncé du moyen

4. La banque fait grief à l'arrêt de la condamner à payer des dommages-intérêts, alors « que le devoir de mise en garde de la banque ne s'applique qu'à l'égard des emprunteurs non avertis ; qu'en l'espèce, M. Moreau était directeur financier d'une PME et disposait d'une expérience certaine en matière financière ; qu'en qualifiant néanmoins les emprunteurs de non avertis, la cour d'appel a violé l'article 1231-1 du code civil ».

Réponse de la Cour

5. La qualité de non averti d'un emprunteur s'apprécie en considération de ses compétences, de son expérience et de sa situation personnelle au regard de l'opération de crédit envisagée.

6. Après avoir relevé que, si M. Moreau occupait un poste de directeur financier, son expérience portait sur la gestion d'une PME et non sur les opérations de crédit immobilier à titre personnel, la cour d'appel a pu en déduire, sans inverser la charge de la preuve, que les emprunteurs devaient être qualifiés de non avertis au sens de la jurisprudence applicable.

7. Le moyen n'est donc pas fondé.

PAR CES MOTIFS, et sans qu'il y ait lieu de statuer sur les autres griefs, la Cour :

CASSE ET ANNULE, en toutes ses dispositions, l'arrêt rendu le 14 mars 2022, entre les parties, par la cour d'appel de Paris ;

Remet l'affaire et les parties dans l'état où elles se trouvaient avant cet arrêt et les renvoie devant la cour d'appel de Versailles ;

Condamne la société Crédit Atlantique aux dépens ;

En application de l'article 700 du code de procédure civile, rejette la demande formée par la société Crédit Atlantique et la condamne à payer à M. et Mme Moreau la somme de 3 000 euros ;

Dit que sur les diligences du procureur général près la Cour de cassation, le présent arrêt sera transmis pour être transcrit en marge ou à la suite de l'arrêt cassé ;

Ainsi fait et jugé par la Cour de cassation, chambre commerciale, et prononcé par le président en son audience publique du quinze janvier deux mille vingt-quatre.`,
    visa: ["Article 1231-1 du Code civil", "Article L. 312-16 du Code de la consommation"],
    renvois: [
      { type: "citation", texte: "Cass. com., 3 mai 2016, n° 14-18.891", id: "jurica-2016-045" },
      { type: "citation", texte: "Cass. com., 22 mars 2011, n° 10-12.451" },
    ],
    themes: ["responsabilité bancaire", "devoir de mise en garde", "crédit immobilier", "emprunteur non averti"],
    source: "judilibre",
  },
  {
    id: "jurica-2024-002",
    ecli: "ECLI:FR:CCASS:2024:SO00245",
    title: "Cass. soc., 7 févr. 2024, n° 22-21.082 – Licenciement économique et obligation de reclassement",
    juridiction: "Cour de cassation",
    chambre: "Chambre sociale",
    numero: "22-21.082",
    date: "2024-02-07",
    solution: "Rejet",
    publication: "Bulletin",
    sommaire: "L'employeur qui procède à un licenciement pour motif économique est tenu de rechercher toutes les possibilités de reclassement existant dans le groupe auquel il appartient, parmi les entreprises dont les activités, l'organisation ou le lieu d'exploitation lui permettent d'effectuer la permutation de tout ou partie du personnel.",
    texte: `LA COUR DE CASSATION, CHAMBRE SOCIALE, a rendu l'arrêt suivant...

Attendu que M. Lambert, salarié de la société Industrielle du Nord depuis quinze ans en qualité de technicien de maintenance, a été licencié pour motif économique le 15 septembre 2020 dans le cadre d'une réorganisation de l'entreprise.

Attendu que M. Lambert soutient que son licenciement est sans cause réelle et sérieuse au motif que l'employeur n'aurait pas satisfait à son obligation de reclassement préalable, notamment en ne recherchant pas les postes disponibles au sein des filiales du groupe en Allemagne et en Belgique.

Mais attendu que la cour d'appel, après avoir analysé les recherches de reclassement effectuées par l'employeur, a constaté que celui-ci avait interrogé l'ensemble des sociétés du groupe, que les postes proposés correspondaient aux compétences du salarié et que le refus de ce dernier était intervenu sans justification valable.`,
    visa: ["Article L. 1233-4 du Code du travail", "Article L. 1237-19 du Code du travail"],
    renvois: [
      { type: "citation", texte: "Cass. soc., 24 juin 2020, n° 18-23.044" },
    ],
    themes: ["licenciement économique", "obligation de reclassement", "droit du travail", "groupe de sociétés"],
    source: "judilibre",
  },
  {
    id: "jurica-2023-003",
    ecli: "ECLI:FR:CCASS:2023:CI00312",
    title: "Cass. 1re civ., 18 oct. 2023, n° 21-24.789 – Responsabilité médicale et perte de chance",
    juridiction: "Cour de cassation",
    chambre: "Chambre civile 1",
    numero: "21-24.789",
    date: "2023-10-18",
    solution: "Cassation partielle",
    publication: "Bulletin",
    sommaire: "La perte de chance de survie ou d'éviter des séquelles causée par une faute médicale constitue un préjudice indemnisable distinct. La réparation doit être mesurée à la chance perdue et ne peut être égale à l'avantage qu'aurait procuré cette chance si elle s'était réalisée.",
    texte: `LA COUR DE CASSATION, CHAMBRE CIVILE 1, a rendu l'arrêt suivant :

La patiente, Mme Dubois, reproche au chirurgien un défaut de surveillance post-opératoire ayant conduit à un retard de diagnostic d'une complication grave. La cour d'appel avait alloué une indemnisation équivalente à la totalité du préjudice corporel subi, sans limitation à la seule perte de chance.

La Cour de cassation rappelle sa jurisprudence constante selon laquelle le préjudice indemnisable en cas de perte de chance doit être évalué en proportion de la probabilité que la chance se serait réalisée, et casse l'arrêt d'appel en ce qu'il a accordé une réparation intégrale sans appliquer ce coefficient de réduction.`,
    visa: ["Article 1231-1 du Code civil", "Article L. 1142-1 du Code de la santé publique"],
    renvois: [
      { type: "citation", texte: "Cass. 1re civ., 14 janv. 2010, n° 09-10.920" },
      { type: "citation", texte: "Cass. 1re civ., 9 avr. 2014, n° 13-13.599" },
    ],
    themes: ["responsabilité médicale", "perte de chance", "préjudice corporel", "faute médicale"],
    source: "judilibre",
  },
  {
    id: "jurica-2023-004",
    ecli: "ECLI:FR:CCASS:2023:CO00678",
    title: "Cass. com., 29 mars 2023, n° 21-15.902 – Clause pénale et réduction judiciaire",
    juridiction: "Cour de cassation",
    chambre: "Chambre commerciale",
    numero: "21-15.902",
    date: "2023-03-29",
    solution: "Rejet",
    publication: "Bulletin",
    sommaire: "Le juge peut modérer ou augmenter la peine qui a été convenue si elle est manifestement excessive ou dérisoire. Cette faculté de modération est d'ordre public et toute clause contraire est réputée non écrite.",
    texte: `LA COUR DE CASSATION, CHAMBRE COMMERCIALE, a rendu l'arrêt suivant :

La société Constructions Modernes conteste la réduction par le juge d'appel d'une clause pénale qu'elle juge parfaitement adaptée aux enjeux du contrat. Le contrat de promotion immobilière prévoyait une pénalité de 15% du prix total en cas de résiliation imputable au maître d'ouvrage.

La Cour confirme le pouvoir souverain des juges du fond de modérer les clauses pénales manifestement excessives au regard du préjudice réellement subi, et approuve la réduction à 5% opérée par la cour d'appel, au vu des éléments produits établissant un préjudice effectif limité.`,
    visa: ["Article 1231-5 du Code civil", "Article 1152 ancien du Code civil"],
    renvois: [],
    themes: ["clause pénale", "droit des contrats", "modération judiciaire", "promotion immobilière"],
    source: "judilibre",
  },
  {
    id: "jurica-2023-005",
    ecli: "ECLI:FR:CCASS:2023:CR00189",
    title: "Cass. crim., 12 sept. 2023, n° 22-85.421 – Abus de confiance et détournement par mandataire",
    juridiction: "Cour de cassation",
    chambre: "Chambre criminelle",
    numero: "22-85.421",
    date: "2023-09-12",
    solution: "Rejet",
    publication: "Bulletin",
    sommaire: "Constitue un abus de confiance le fait pour un mandataire de détourner des fonds remis à titre précaire, même si le mandat s'est éteint. Le détournement est caractérisé dès lors que le mandataire a utilisé les fonds pour un usage autre que celui convenu, à son profit ou au profit d'un tiers.",
    texte: `LA COUR DE CASSATION, CHAMBRE CRIMINELLE, a rendu l'arrêt suivant :

M. Fernandez, gestionnaire de patrimoine, était prévenu d'abus de confiance pour avoir prélevé sans autorisation des sommes importantes sur les comptes de ses clients. La cour d'appel l'avait déclaré coupable et condamné à 18 mois d'emprisonnement avec sursis et 50 000 euros d'amende.

La Cour rappelle que l'abus de confiance est constitué dès lors que le prévenu a, en connaissance de cause, utilisé des fonds qui lui avaient été remis et qu'il devait remettre ou représenter, à d'autres fins que celles convenues, peu important que la victime ait pu recouvrer ses fonds ultérieurement.`,
    visa: ["Article 314-1 du Code pénal"],
    renvois: [
      { type: "citation", texte: "Cass. crim., 20 mars 2019, n° 18-83.465" },
    ],
    themes: ["abus de confiance", "droit pénal", "mandataire", "détournement"],
    source: "judilibre",
  },
  {
    id: "jurica-2023-006",
    ecli: "ECLI:FR:CCASS:2023:CI00445",
    title: "Cass. 1re civ., 5 juill. 2023, n° 21-20.114 – Droit international privé et compétence internationale",
    juridiction: "Cour de cassation",
    chambre: "Chambre civile 1",
    numero: "21-20.114",
    date: "2023-07-05",
    solution: "Cassation",
    publication: "Bulletin",
    sommaire: "En matière de contrat de travail, le salarié peut saisir le juge du lieu où il accomplit habituellement son travail. Lorsque le salarié travaille dans plusieurs États, le lieu d'accomplissement habituel est celui à partir duquel il s'acquitte principalement de ses obligations envers son employeur.",
    texte: `LA COUR DE CASSATION, CHAMBRE CIVILE 1, a rendu l'arrêt suivant :

M. Kowalski, ressortissant polonais travaillant comme commercial itinérant pour une société française, couvrant la France, la Belgique et les Pays-Bas, a saisi le conseil de prud'hommes de Paris après son licenciement. La société conteste la compétence des juridictions françaises.

La Cour casse l'arrêt d'appel qui avait retenu la compétence sur le seul fondement du siège social de l'employeur, au lieu d'identifier le lieu à partir duquel le salarié organisait son activité et vers lequel il revenait après ses déplacements, conformément au Règlement (UE) n° 1215/2012.`,
    visa: ["Règlement UE n° 1215/2012 du 12 décembre 2012", "Article L. 1411-3 du Code du travail"],
    renvois: [
      { type: "citation", texte: "CJUE, 14 sept. 2017, aff. C-168/16 et C-169/16, Nogueira" },
    ],
    themes: ["droit international privé", "compétence internationale", "contrat de travail", "règlement Bruxelles I bis"],
    source: "judilibre",
  },
  {
    id: "jurica-2022-007",
    ecli: "ECLI:FR:CCASS:2022:CO01023",
    title: "Cass. com., 14 déc. 2022, n° 20-22.317 – Garantie des vices cachés et action rédhibitoire",
    juridiction: "Cour de cassation",
    chambre: "Chambre commerciale",
    numero: "20-22.317",
    date: "2022-12-14",
    solution: "Rejet",
    publication: "Bulletin",
    sommaire: "L'acheteur qui invoque la garantie des vices cachés doit agir dans un délai de deux ans à compter de la découverte du vice. Ce délai court à compter du jour où l'acheteur a eu connaissance du vice, et non à compter du jour où le vice s'est manifesté.",
    texte: `LA COUR DE CASSATION, CHAMBRE COMMERCIALE, a rendu l'arrêt suivant :

La société Agrotech a acquis une machine industrielle qui s'est révélée défectueuse 14 mois après la livraison. L'acheteur soutient que le délai biennal ne court qu'à compter de la révélation de l'origine exacte du vice, établie par expertise un an après la découverte initiale des dysfonctionnements.

La Cour rejette ce raisonnement et confirme que le délai de l'article 1648 du Code civil court à compter du jour où l'acquéreur a eu connaissance du vice, soit à compter des premiers dysfonctionnements constatés, sans attendre la détermination de leur cause exacte.`,
    visa: ["Article 1648 du Code civil", "Article 1641 du Code civil"],
    renvois: [
      { type: "citation", texte: "Cass. com., 10 juill. 2012, n° 11-21.954" },
    ],
    themes: ["garantie des vices cachés", "droit de la vente", "délai biennal", "action rédhibitoire"],
    source: "judilibre",
  },
  {
    id: "jurica-2022-008",
    ecli: "ECLI:FR:CCASS:2022:SO00834",
    title: "Cass. soc., 5 oct. 2022, n° 21-11.243 – Harcèlement moral et obligation de sécurité de l'employeur",
    juridiction: "Cour de cassation",
    chambre: "Chambre sociale",
    numero: "21-11.243",
    date: "2022-10-05",
    solution: "Cassation",
    publication: "Bulletin et Rapport annuel",
    sommaire: "L'employeur ne peut s'exonérer de sa responsabilité en matière de harcèlement moral que s'il justifie avoir pris toutes les mesures de prévention nécessaires et, lorsqu'il a eu connaissance de comportements susceptibles de constituer un harcèlement, avoir réagi immédiatement afin de faire cesser ces comportements.",
    texte: `LA COUR DE CASSATION, CHAMBRE SOCIALE, a rendu l'arrêt suivant :

Mme Petit, ingénieure dans une société de conseil, soutient avoir subi des agissements de harcèlement moral de la part de son supérieur hiérarchique pendant deux ans. Elle a alerté la direction des ressources humaines à plusieurs reprises sans qu'aucune mesure ne soit prise.

La cour d'appel avait rejeté sa demande d'indemnisation au motif que l'employeur avait finalement mis en œuvre une médiation. La Cour casse cet arrêt en rappelant que l'obligation de sécurité de l'employeur est une obligation de résultat renforcée : la seule mise en œuvre tardive d'une médiation, après plus d'un an de signalements restés sans suite, ne saurait suffire à l'exonérer.`,
    visa: ["Article L. 1152-1 du Code du travail", "Article L. 4121-1 du Code du travail"],
    renvois: [
      { type: "citation", texte: "Cass. soc., 1er juin 2016, n° 14-19.702" },
      { type: "citation", texte: "Cass. soc., 8 déc. 2021, n° 20-13.105" },
    ],
    themes: ["harcèlement moral", "obligation de sécurité", "droit du travail", "responsabilité employeur"],
    source: "judilibre",
  },
  {
    id: "jurica-2022-009",
    ecli: "ECLI:FR:CCASS:2022:CI00567",
    title: "Cass. 1re civ., 22 juin 2022, n° 20-18.533 – Divorce et prestation compensatoire",
    juridiction: "Cour de cassation",
    chambre: "Chambre civile 1",
    numero: "20-18.533",
    date: "2022-06-22",
    solution: "Rejet",
    publication: "Bulletin",
    sommaire: "Pour fixer le montant de la prestation compensatoire, le juge tient compte des besoins et des ressources de chacun des époux à la date du divorce, et des perspectives d'évolution de leur situation. Il prend notamment en considération la durée du mariage, l'âge et l'état de santé des époux, et les conséquences des choix professionnels faits par l'un des époux pendant la vie commune.",
    texte: `LA COUR DE CASSATION, CHAMBRE CIVILE 1, a rendu l'arrêt suivant :

M. et Mme Laurent divorcent après 22 ans de mariage. Mme Laurent, qui avait cessé son activité professionnelle pour s'occuper des trois enfants du couple à la demande de son époux, réclame une prestation compensatoire de 150 000 euros. M. Laurent conteste ce montant en invoquant sa propre situation financière dégradée depuis la crise sanitaire.

La Cour confirme l'arrêt d'appel qui, après analyse détaillée de la situation respective des parties, a fixé la prestation à 90 000 euros en capital, relevant notamment le sacrifice professionnel consenti par l'épouse et la disparité significative de situation créée par le divorce.`,
    visa: ["Article 271 du Code civil", "Article 272 du Code civil"],
    renvois: [],
    themes: ["divorce", "prestation compensatoire", "droit de la famille", "disparité de situation"],
    source: "judilibre",
  },
  {
    id: "jurica-2022-010",
    ecli: "ECLI:FR:CCASS:2022:CO00456",
    title: "Cass. com., 9 mars 2022, n° 20-14.277 – Cession de créance et opposabilité",
    juridiction: "Cour de cassation",
    chambre: "Chambre commerciale",
    numero: "20-14.277",
    date: "2022-03-09",
    solution: "Cassation partielle",
    publication: "Bulletin",
    sommaire: "Depuis l'entrée en vigueur de l'ordonnance du 10 février 2016, la cession de créance entre les parties est parfaite dès le seul accord de volontés, sans condition de forme. Elle est opposable aux tiers autres que le débiteur cédé dès la date certaine de l'acte.",
    texte: `LA COUR DE CASSATION, CHAMBRE COMMERCIALE, a rendu l'arrêt suivant :

La société Financière Alpha a cédé un portefeuille de créances à la société de titrisation Beta par contrat signé le 3 septembre 2018. Un créancier de la cédante, ayant pratiqué une saisie-attribution sur ces créances le 15 septembre 2018, conteste l'opposabilité de la cession.

La Cour précise l'articulation entre les règles du droit commun de la cession de créance issues de la réforme de 2016 et les règles spéciales du code monétaire et financier applicables aux organismes de titrisation.`,
    visa: ["Article 1321 du Code civil", "Articles L. 214-168 et suivants du Code monétaire et financier"],
    renvois: [
      { type: "citation", texte: "Cass. com., 13 oct. 2021, n° 19-20.143" },
    ],
    themes: ["cession de créance", "droit des obligations", "titrisation", "opposabilité"],
    source: "judilibre",
  },
  {
    id: "jurica-2021-011",
    ecli: "ECLI:FR:CCASS:2021:CO00789",
    title: "Cass. com., 17 nov. 2021, n° 19-18.891 – Cautionnement et proportionnalité",
    juridiction: "Cour de cassation",
    chambre: "Chambre commerciale",
    numero: "19-18.891",
    date: "2021-11-17",
    solution: "Rejet",
    publication: "Bulletin",
    sommaire: "Le cautionnement contracté par une personne physique envers un créancier professionnel est inopposable si, au moment de sa conclusion, il était manifestement disproportionné aux biens et revenus de la caution. La disproportion s'apprécie à la date de la souscription de l'acte de cautionnement.",
    texte: `LA COUR DE CASSATION, CHAMBRE COMMERCIALE, a rendu l'arrêt suivant :

M. Girard s'est porté caution personnelle et solidaire d'un prêt de 500 000 euros consenti par la Banque Régionale à sa société. Lors de la mise en jeu de la caution, M. Girard invoque la disproportion manifeste de son engagement au regard de ses revenus et patrimoine personnels.

La Cour confirme que la banque ne rapporte pas la preuve, qui lui incombe, que le patrimoine de la caution lui permettait de faire face à son engagement au moment de la souscription, et valide ainsi l'inopposabilité du cautionnement.`,
    visa: ["Article L. 332-1 du Code de la consommation", "Article 2290 du Code civil"],
    renvois: [
      { type: "citation", texte: "Cass. com., 22 janv. 2020, n° 17-20.966" },
    ],
    themes: ["cautionnement", "proportionnalité", "droit bancaire", "sûretés personnelles"],
    source: "judilibre",
  },
  {
    id: "jurica-2021-012",
    ecli: "ECLI:FR:CCASS:2021:SO00345",
    title: "Cass. soc., 23 juin 2021, n° 20-14.490 – Prise d'acte de la rupture et faits imputables à l'employeur",
    juridiction: "Cour de cassation",
    chambre: "Chambre sociale",
    numero: "20-14.490",
    date: "2021-06-23",
    solution: "Cassation partielle",
    publication: "Bulletin",
    sommaire: "La prise d'acte de la rupture du contrat de travail aux torts de l'employeur produit les effets d'un licenciement sans cause réelle et sérieuse si les faits invoqués la justifiaient. Il appartient au salarié d'établir les manquements de l'employeur, et au juge d'apprécier si ces manquements sont suffisamment graves pour empêcher la poursuite du contrat.",
    texte: `LA COUR DE CASSATION, CHAMBRE SOCIALE, a rendu l'arrêt suivant :

M. Hassan, technicien informatique, a pris acte de la rupture de son contrat de travail en invoquant le non-paiement de plusieurs mois de salaires et la modification unilatérale de ses conditions de travail. La cour d'appel avait requalifié la prise d'acte en démission au motif que les arriérés de salaires avaient été partiellement régularisés.

La Cour casse partiellement cet arrêt en relevant que la cour d'appel n'avait pas examiné le grief relatif à la modification unilatérale des conditions de travail, qui constituait en lui-même un manquement suffisamment grave.`,
    visa: ["Article L. 1237-2 du Code du travail (ancien article L. 1231-1)"],
    renvois: [
      { type: "citation", texte: "Cass. soc., 25 juin 2003, n° 01-43.578" },
    ],
    themes: ["prise d'acte", "rupture du contrat de travail", "droit du travail", "manquement employeur"],
    source: "judilibre",
  },
  {
    id: "jurica-2021-013",
    ecli: "ECLI:FR:CEASS:2021:432154",
    title: "CE, Ass., 2 avr. 2021, n° 432154 – Responsabilité de l'État pour méconnaissance du délai raisonnable",
    juridiction: "Conseil d'État",
    chambre: "Section du contentieux",
    numero: "432154",
    date: "2021-04-02",
    solution: "Annulation",
    publication: "Bulletin",
    sommaire: "L'État est responsable du préjudice causé par la méconnaissance du délai raisonnable de jugement devant les juridictions administratives. Ce droit à réparation est fondé sur l'article 6 § 1 de la Convention européenne des droits de l'homme et sur les règles générales de la responsabilité de la puissance publique.",
    texte: `LE CONSEIL D'ÉTAT, statuant au contentieux, a rendu la décision suivante :

M. et Mme Richon ont engagé un contentieux administratif en matière fiscale en 2009. La procédure a duré plus de 10 ans avant d'aboutir à une décision définitive. Ils demandent réparation du préjudice résultant du délai excessif de traitement de leur affaire.

Le Conseil d'État consacre le principe d'une responsabilité de l'État du fait du fonctionnement défectueux du service public de la justice administrative et fixe les critères d'appréciation du caractère raisonnable du délai : complexité de l'affaire, comportement des parties, enjeux du litige pour le requérant.`,
    visa: ["Article 6 § 1 de la Convention EDH", "Article L. 141-1 du Code de l'organisation judiciaire"],
    renvois: [
      { type: "citation", texte: "CEDH, 26 oct. 2000, Kudla c. Pologne, n° 30210/96" },
    ],
    themes: ["délai raisonnable", "responsabilité de l'État", "droit administratif", "CEDH"],
    source: "judilibre",
  },
  {
    id: "jurica-2020-014",
    ecli: "ECLI:FR:CCASS:2020:CO00567",
    title: "Cass. com., 2 déc. 2020, n° 18-25.224 – Droit des sociétés et abus de majorité",
    juridiction: "Cour de cassation",
    chambre: "Chambre commerciale",
    numero: "18-25.224",
    date: "2020-12-02",
    solution: "Rejet",
    publication: "Bulletin",
    sommaire: "L'abus de majorité est caractérisé lorsque les dirigeants ou associés majoritaires ont pris une décision contraire à l'intérêt général de la société et dans l'unique dessein de favoriser les membres de la majorité au détriment des membres de la minorité.",
    texte: `LA COUR DE CASSATION, CHAMBRE COMMERCIALE, a rendu l'arrêt suivant :

Les associés minoritaires de la SAS Dupont Technologies contestent une délibération de l'assemblée générale ayant décidé la non-distribution des bénéfices pour la cinquième année consécutive, alors que les associés majoritaires percevaient des rémunérations de dirigeant largement supérieures aux pratiques du secteur.

La Cour confirme la caractérisation de l'abus de majorité, relevant la combinaison d'une mise en réserve systématique et de rémunérations excessives, conduisant à priver les associés minoritaires de tout retour sur leur investissement.`,
    visa: ["Article 1833 du Code civil", "Article 1844-10 du Code civil"],
    renvois: [
      { type: "citation", texte: "Cass. com., 18 avr. 1961" },
    ],
    themes: ["abus de majorité", "droit des sociétés", "associés minoritaires", "gouvernance"],
    source: "judilibre",
  },
  {
    id: "jurica-2020-015",
    ecli: "ECLI:FR:CCASS:2020:CI00234",
    title: "Cass. 2e civ., 18 juin 2020, n° 19-15.341 – Assurance et déclaration du risque",
    juridiction: "Cour de cassation",
    chambre: "Chambre civile 2",
    numero: "19-15.341",
    date: "2020-06-18",
    solution: "Cassation",
    publication: "Bulletin",
    sommaire: "L'assureur qui n'a pas posé de questions à l'assuré lors de la conclusion du contrat ne peut pas lui opposer une réticence dolosive ou une fausse déclaration. L'obligation de déclaration spontanée du risque a été supprimée par la loi du 31 décembre 1989.",
    texte: `LA COUR DE CASSATION, CHAMBRE CIVILE 2, a rendu l'arrêt suivant :

M. Vidal a souscrit un contrat d'assurance-vie sans que la compagnie d'assurance ne lui pose de questionnaire médical. Après son décès, la compagnie a refusé de verser le capital aux bénéficiaires en invoquant une réticence dolosive relative à l'état de santé de l'assuré.

La Cour casse l'arrêt d'appel qui avait fait droit à la compagnie, en rappelant que depuis la loi Évin de 1989, l'assuré n'est tenu de déclarer que ce qui lui est demandé. À défaut de questionnaire, l'assureur ne peut pas invoquer une réticence ou une fausse déclaration.`,
    visa: ["Article L. 113-2 du Code des assurances", "Article L. 113-8 du Code des assurances"],
    renvois: [
      { type: "citation", texte: "Cass. 2e civ., 15 févr. 2018, n° 17-13.256" },
    ],
    themes: ["assurance", "déclaration du risque", "réticence dolosive", "droit des assurances"],
    source: "judilibre",
  },
  {
    id: "jurica-2019-016",
    ecli: "ECLI:FR:CCASS:2019:CO00901",
    title: "Cass. com., 4 déc. 2019, n° 18-17.869 – Procédure collective et période suspecte",
    juridiction: "Cour de cassation",
    chambre: "Chambre commerciale",
    numero: "18-17.869",
    date: "2019-12-04",
    solution: "Rejet",
    publication: "Bulletin",
    sommaire: "Les actes accomplis en période suspecte, entre la date de cessation des paiements et le jugement d'ouverture, peuvent être annulés par le tribunal saisi de la procédure collective. Les nullités de droit visent les actes à titre gratuit translatifs de propriété et les paiements pour dettes non échues.",
    texte: `LA COUR DE CASSATION, CHAMBRE COMMERCIALE, a rendu l'arrêt suivant :

Le liquidateur judiciaire de la société Bâtiment Provence demande la nullité de plusieurs actes accomplis en période suspecte, dont le remboursement anticipé d'un prêt consenti par un associé, intervenu 45 jours avant le jugement d'ouverture.

La Cour confirme la nullité de ce remboursement, qualifié de paiement de dette non échue au sens de l'article L. 632-1 du Code de commerce, indépendamment du caractère délibéré de la fraude.`,
    visa: ["Article L. 632-1 du Code de commerce", "Article L. 632-2 du Code de commerce"],
    renvois: [],
    themes: ["procédure collective", "période suspecte", "nullité", "liquidation judiciaire"],
    source: "judilibre",
  },
  {
    id: "jurica-2019-017",
    ecli: "ECLI:FR:CCASS:2019:SO00523",
    title: "Cass. soc., 3 juill. 2019, n° 17-28.671 – Égalité de traitement et discrimination syndicale",
    juridiction: "Cour de cassation",
    chambre: "Chambre sociale",
    numero: "17-28.671",
    date: "2019-07-03",
    solution: "Cassation",
    publication: "Bulletin et Rapport annuel",
    sommaire: "La discrimination syndicale est établie lorsque le salarié présente des éléments de fait laissant supposer l'existence d'une discrimination directe ou indirecte. Il appartient alors à l'employeur de prouver que les différences de traitement constatées sont justifiées par des éléments objectifs étrangers à toute discrimination.",
    texte: `LA COUR DE CASSATION, CHAMBRE SOCIALE, a rendu l'arrêt suivant :

M. Blanc, délégué syndical depuis 15 ans, constate un gel de sa rémunération et l'absence d'évolution de carrière depuis son mandat, contrairement à ses collègues ayant une ancienneté et des compétences comparables.

La Cour casse l'arrêt d'appel qui avait rejeté la demande après avoir imposé au salarié la charge de prouver l'intégralité de la discrimination. Rappel de la règle probatoire en deux temps caractéristique du droit de la non-discrimination.`,
    visa: ["Article L. 1132-1 du Code du travail", "Article L. 2141-5 du Code du travail"],
    renvois: [
      { type: "citation", texte: "Cass. soc., 10 nov. 2009, n° 07-42.849" },
    ],
    themes: ["discrimination syndicale", "égalité de traitement", "preuve", "droit syndical"],
    source: "judilibre",
  },
  {
    id: "jurica-2018-018",
    ecli: "ECLI:FR:CCASS:2018:CO00344",
    title: "Cass. com., 21 mars 2018, n° 16-26.155 – Rupture brutale de relations commerciales établies",
    juridiction: "Cour de cassation",
    chambre: "Chambre commerciale",
    numero: "16-26.155",
    date: "2018-03-21",
    solution: "Cassation partielle",
    publication: "Bulletin",
    sommaire: "Engage sa responsabilité l'auteur d'une rupture brutale d'une relation commerciale établie, en l'absence d'un préavis écrit suffisant. La durée du préavis doit tenir compte notamment de la durée des relations commerciales et du degré de dépendance économique de la victime.",
    texte: `LA COUR DE CASSATION, CHAMBRE COMMERCIALE, a rendu l'arrêt suivant :

La société Logistique Express entretenait depuis 12 ans des relations commerciales avec la société Retail Grande Distribution, qui représentait 68% de son chiffre d'affaires. La rupture notifiée avec un préavis de seulement deux mois a causé la mise en liquidation judiciaire du prestataire.

La Cour retient la brutalité de la rupture et évalue l'indemnisation due en fonction de la durée du préavis qui aurait été nécessaire, estimée à 18 mois au regard de l'ancienneté des relations et de la dépendance économique caractérisée.`,
    visa: ["Article L. 442-1 du Code de commerce (ancien L. 442-6)"],
    renvois: [
      { type: "citation", texte: "Cass. com., 15 sept. 2009, n° 08-19.200" },
    ],
    themes: ["rupture brutale", "relations commerciales établies", "préavis", "dépendance économique"],
    source: "judilibre",
  },
  {
    id: "jurica-2018-019",
    ecli: "ECLI:FR:CCASS:2018:CI00567",
    title: "Cass. 3e civ., 11 oct. 2018, n° 17-21.445 – Bail commercial et droit au renouvellement",
    juridiction: "Cour de cassation",
    chambre: "Chambre civile 3",
    numero: "17-21.445",
    date: "2018-10-11",
    solution: "Rejet",
    publication: "Bulletin",
    sommaire: "Le locataire commercial qui justifie avoir exploité effectivement le fonds de commerce dans les lieux loués a droit au renouvellement de son bail. La seule absence de domiciliation à l'adresse des locaux ne suffit pas à caractériser un défaut d'exploitation.",
    texte: `LA COUR DE CASSATION, CHAMBRE CIVILE 3, a rendu l'arrêt suivant :

Le bailleur refuse le renouvellement du bail commercial d'un restaurateur en invoquant l'absence de domiciliation administrative de la société locataire à l'adresse des locaux. Le restaurant avait néanmoins continué d'exploiter son fonds de commerce dans ces locaux sans interruption.

La Cour confirme le droit au renouvellement en relevant que l'exploitation effective du fonds dans les lieux est établie et que les exigences formelles de domiciliation sont sans effet sur ce droit substantiel.`,
    visa: ["Article L. 145-1 du Code de commerce", "Article L. 145-8 du Code de commerce"],
    renvois: [],
    themes: ["bail commercial", "droit au renouvellement", "fonds de commerce", "droit immobilier commercial"],
    source: "judilibre",
  },
  {
    id: "jurica-2017-020",
    ecli: "ECLI:FR:CCASS:2017:AP00001",
    title: "Cass. ass. plén., 3 juill. 2017, n° 16-13.578 – Fichier national des incidents de remboursement et responsabilité",
    juridiction: "Cour de cassation",
    chambre: "Assemblée plénière",
    numero: "16-13.578",
    date: "2017-07-03",
    solution: "Cassation",
    publication: "Bulletin et Rapport annuel",
    sommaire: "La banque qui mantient abusivement l'inscription au FICP d'un débiteur dont la dette a été soldée engage sa responsabilité délictuelle. Le préjudice résultant d'une inscription fautive au fichier des incidents de remboursement des crédits aux particuliers est présumé.",
    texte: `LA COUR DE CASSATION, ASSEMBLÉE PLÉNIÈRE, a rendu l'arrêt suivant :

M. Renard avait remboursé l'intégralité de sa dette envers la Banque Nationale mais demeurait inscrit au FICP pendant plus de 18 mois après le solde de son crédit. Cette inscription lui avait causé le refus de plusieurs demandes de crédit immobilier.

L'Assemblée plénière tranche un conflit de jurisprudence entre chambres et décide que le préjudice moral résultant d'une inscription maintenue fautivement au FICP n'a pas à être prouvé de manière concrète par le requérant ; il est présumé dès lors que la faute de la banque est établie.`,
    visa: ["Article 1382 ancien du Code civil (devenu 1240)", "Article L. 333-4 du Code de la consommation"],
    renvois: [
      { type: "citation", texte: "Cass. 1re civ., 7 déc. 2004, n° 02-14.939" },
      { type: "citation", texte: "Cass. com., 9 nov. 2010, n° 09-70.535" },
    ],
    themes: ["FICP", "fichier des incidents", "responsabilité bancaire", "préjudice moral", "assemblée plénière"],
    source: "judilibre",
  },
];

// ─── Helper: Build summary from full document ────────────────────────────────

export function toSummary(doc: LegalDocument, query?: string): LegalDocumentSummary {
  const snippet = query
    ? buildHighlightedSnippet(doc.sommaire, query)
    : doc.sommaire.substring(0, 220) + "...";

  return {
    id: doc.id,
    ecli: doc.ecli,
    title: doc.title,
    juridiction: doc.juridiction,
    chambre: doc.chambre,
    numero: doc.numero,
    date: doc.date,
    solution: doc.solution,
    publication: doc.publication,
    sommaire: doc.sommaire,
    snippet,
    themes: doc.themes,
    score: doc.score ?? 0.95,
  };
}

function buildHighlightedSnippet(text: string, query: string): string {
  const words = query.toLowerCase().split(/\s+/).filter(w => w.length > 3);
  const lower = text.toLowerCase();
  let bestPos = 0;
  for (const word of words) {
    const pos = lower.indexOf(word);
    if (pos !== -1) { bestPos = Math.max(0, pos - 60); break; }
  }
  return text.substring(bestPos, bestPos + 240) + "...";
}

// ─── Search function ──────────────────────────────────────────────────────────

export function searchDecisions(
  query: string,
  filters: {
    juridiction?: string;
    chambre?: string;
    date_from?: string;
    date_to?: string;
    solution?: string;
    publication?: string;
  } = {},
  page = 1,
  perPage = 10
) {
  let results = [...MOCK_DECISIONS];

  // Text search
  if (query.trim()) {
    const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
    results = results.filter(doc => {
      const searchText = [doc.title, doc.sommaire, doc.texte, ...doc.themes, ...doc.visa].join(" ").toLowerCase();
      return terms.some(term => searchText.includes(term));
    });
    // Sort by relevance (simple scoring)
    results = results.map(doc => {
      const searchText = [doc.title, doc.sommaire, ...doc.themes].join(" ").toLowerCase();
      const score = terms.reduce((s, t) => s + (searchText.includes(t) ? 1 : 0), 0) / terms.length;
      return { ...doc, score };
    }).sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
  }

  // Filters
  if (filters.juridiction) results = results.filter(d => d.juridiction === filters.juridiction);
  if (filters.chambre) results = results.filter(d => d.chambre.includes(filters.chambre!));
  if (filters.solution) results = results.filter(d => d.solution === filters.solution);
  if (filters.publication) results = results.filter(d => d.publication === filters.publication);
  if (filters.date_from) results = results.filter(d => d.date >= filters.date_from!);
  if (filters.date_to) results = results.filter(d => d.date <= filters.date_to!);

  const total = results.length;
  const totalPages = Math.ceil(total / perPage);
  const start = (page - 1) * perPage;
  const paginated = results.slice(start, start + perPage);

  return {
    documents: paginated.map(d => toSummary(d, query)),
    total,
    page,
    per_page: perPage,
    total_pages: totalPages,
    query_time_ms: Math.floor(Math.random() * 80) + 20,
  };
}

// ─── Mock RAG responses ───────────────────────────────────────────────────────

export const MOCK_RAG_TEMPLATES = [
  {
    keyword: "responsabilité bancaire",
    sections: [
      {
        title: "Principe général du devoir de mise en garde",
        content: "La jurisprudence de la Cour de cassation a progressivement construit un régime de responsabilité bancaire fondé sur le devoir de mise en garde [1]. Ce devoir s'impose à la banque lorsqu'elle accorde un crédit à un emprunteur non averti dont elle connaît, ou devrait connaître, le risque d'endettement excessif [2].",
        citations: [0, 1],
      },
      {
        title: "Conditions d'application",
        content: "Le devoir de mise en garde suppose réunies deux conditions cumulatives : d'une part, la qualité de non averti de l'emprunteur, qui s'apprécie in concreto [1] ; d'autre part, l'existence d'un risque d'endettement excessif au regard de ses capacités financières [3]. La charge de la preuve de la qualité d'averti incombe à la banque.",
        citations: [0, 2],
      },
      {
        title: "Étendue de la réparation",
        content: "Le préjudice réparable consiste en la perte de chance de ne pas contracter ou de contracter à des conditions plus favorables [2]. Cette perte de chance doit être mesurée à la probabilité que le dommage ne se serait pas produit si l'avertissement avait été donné.",
        citations: [1],
      },
    ],
  },
  {
    keyword: "licenciement",
    sections: [
      {
        title: "Obligation de reclassement préalable",
        content: "Préalablement à tout licenciement économique, l'employeur est tenu de rechercher les possibilités de reclassement [1]. Cette obligation s'étend à l'ensemble du groupe auquel appartient l'entreprise, y compris aux entités étrangères si elles peuvent accueillir le salarié [2].",
        citations: [0, 1],
      },
      {
        title: "Critères d'appréciation",
        content: "La Cour de cassation apprécie le sérieux des recherches de reclassement au regard des diligences accomplies : envoi de questionnaires aux entités du groupe [1], examen des postes disponibles correspondant aux qualifications du salarié, propositions formulées dans un délai raisonnable [2].",
        citations: [0],
      },
    ],
  },
];
