export interface FaqItem {
  q: string;
  a: string;
  category: "Orientation" | "Formations" | "Finance" | "Compte et paiement";
}

export const faq: FaqItem[] = [
  { category: "Orientation", q: "Le questionnaire est-il vraiment gratuit ?", a: "Oui. Il ne nécessite ni inscription ni paiement, et les résultats sont complets : profil, domaines compatibles, contraintes, budget indicatif et parcours recommandé. Tu peux t'en servir sans jamais acheter de formation." },
  { category: "Orientation", q: "Que signifie le pourcentage de compatibilité ?", a: "Il mesure l'adéquation entre tes réponses (intérêts, temps, budget, niveau, objectifs, type de travail) et les exigences d'un domaine. Ce n'est pas une probabilité de réussite : ta réussite dépend surtout de ton travail, de ta régularité et du contexte." },
  { category: "Orientation", q: "Comment le score est-il calculé ?", a: "Chaque domaine est décrit par des critères (temps minimum, budget de départ, exigence pour un débutant, délai avant premiers résultats, affinités). Tes réponses sont comparées à ces critères, pondérées puis combinées. Les contraintes fortes, comme un budget insuffisant ou une condition d'âge, plafonnent le score et sont signalées. La méthode complète est détaillée sur la page Méthode." },
  { category: "Orientation", q: "Mes réponses sont-elles conservées ?", a: "Sans compte, tes résultats restent uniquement dans ton navigateur. Si tu crées un compte, ils sont enregistrés dans ton espace pour que tu puisses les retrouver. Tu peux les supprimer à tout moment." },
  { category: "Formations", q: "À qui s'adressent les formations ?", a: "Principalement aux 16-30 ans qui veulent acquérir des compétences concrètes. La plupart des formations sont accessibles aux débutants complets ; le niveau requis est indiqué sur chaque fiche." },
  { category: "Formations", q: "Les formations promettent-elles des revenus ?", a: "Non, jamais. Nous enseignons des compétences et des méthodes. Les résultats financiers dépendent de nombreux facteurs que personne ne peut garantir. Méfie-toi de toute formation qui te promet de gagner de l'argent rapidement." },
  { category: "Formations", q: "Combien de temps ai-je accès à une formation ?", a: "L'accès est prévu sans limite de durée, mises à jour comprises. Les conditions définitives seront précisées dans les conditions générales de vente." },
  { category: "Formations", q: "Faut-il un budget en plus du prix de la formation ?", a: "Cela dépend du domaine. Chaque fiche indique un budget de départ indicatif (outils, abonnements, tests). Beaucoup de formations ne demandent aucun budget supplémentaire." },
  { category: "Finance", q: "Les formations trading permettent-elles de gagner de l'argent ?", a: "Elles permettent de comprendre les marchés et de gérer le risque. Le trading comporte un risque élevé de perte en capital, et une part importante des particuliers perd de l'argent. Nos formations ne sont pas un conseil en investissement : tous les exercices pratiques se font sur compte de démonstration." },
  { category: "Finance", q: "Puis-je suivre les formations finance si j'ai moins de 18 ans ?", a: "Tu peux suivre les contenus pédagogiques. En revanche, l'ouverture d'un compte chez un courtier est réservée aux personnes majeures : avant 18 ans, la pratique se limite aux comptes de démonstration." },
  { category: "Compte et paiement", q: "Comment fonctionne le remboursement ?", a: "Nous prévoyons une politique de remboursement claire, détaillée sur la page dédiée. Elle sera finalisée avec l'ouverture des paiements." },
  { category: "Compte et paiement", q: "Les paiements sont-ils disponibles ?", a: "Les inscriptions payantes ouvrent prochainement. En attendant, tu peux rejoindre la liste d'attente sur chaque fiche formation et explorer l'espace membre en mode aperçu." },
];
