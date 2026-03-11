import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function daysAgo(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d;
}

async function main() {
  // 1. Créer les catégories
  const guide = await prisma.category.upsert({
    where: { name: "Guide" },
    update: {},
    create: { name: "Guide" },
  });
  const conformite = await prisma.category.upsert({
    where: { name: "Conformité" },
    update: {},
    create: { name: "Conformité" },
  });
  const autoEntrepreneur = await prisma.category.upsert({
    where: { name: "Auto-entrepreneur" },
    update: {},
    create: { name: "Auto-entrepreneur" },
  });
  const freelance = await prisma.category.upsert({
    where: { name: "Freelance" },
    update: {},
    create: { name: "Freelance" },
  });
  const guideFreelance = await prisma.category.upsert({
    where: { name: "Guide Freelance" },
    update: {},
    create: { name: "Guide Freelance" },
  });

  // 2. Articles de blog
  const posts = [
    {
      title: "Mentions obligatoires sur une facture en France (2026)",
      slug: "mentions-obligatoires-facture-france-2026",
      excerpt:
        "Liste complète des mentions légales à faire figurer sur vos factures pour rester en conformité avec la réglementation française.",
      content: `<p>Une facture conforme en France doit comporter un certain nombre d’informations obligatoires. Voici ce que vous devez afficher.</p>
<p><strong>Pour l’émetteur :</strong> nom ou raison sociale, adresse, numéro SIRET, numéro de TVA si assujetti, mention du régime d’imposition (TVA, micro-entreprise, etc.).</p>
<p><strong>Pour le client :</strong> nom ou raison sociale et adresse de livraison ou de facturation.</p>
<p><strong>Sur la facture :</strong> numéro unique, date d’émission, date de prestation ou période, détail des prestations (quantité, prix unitaire HT, taux de TVA), montant HT, TVA, total TTC, conditions de paiement et pénalités de retard, mention d’exonération de TVA le cas échéant.</p>
<p>Notre générateur intègre ces champs par défaut pour vous faire gagner du temps.</p>`,
      categoryId: conformite.id,
      metaTitle: "Mentions obligatoires facture France 2026 | Guide complet",
      metaDesc: "Liste des mentions légales obligatoires sur une facture en France. Conformité 2026.",
      createdAt: daysAgo(60),
    },
    {
      title: "Comment facturer en tant qu’auto-entrepreneur",
      slug: "comment-facturer-auto-entrepreneur",
      excerpt:
        "Les règles de facturation pour les micro-entrepreneurs : ce qu’il faut indiquer et les pièges à éviter.",
      content: `<p>En micro-entreprise (auto-entrepreneur), vous devez émettre une facture pour chaque vente de biens ou de services, sauf cas particuliers (vente au particulier non assujetti, etc.).</p>
<p>Votre facture doit indiquer notamment : votre nom, votre numéro SIRET, la mention « TVA non applicable, article 293 B du CGI », le détail des prestations et le total TTC.</p>
<p>Vous ne facturez pas la TVA : le montant demandé au client est tout compris. Pensez à bien conserver un exemplaire de chaque facture pour votre comptabilité et l’URSSAF.</p>
<p>Utilisez notre outil gratuit pour générer en quelques clics une facture conforme au statut auto-entrepreneur.</p>`,
      categoryId: autoEntrepreneur.id,
      metaTitle: "Facturer en auto-entrepreneur : guide 2026",
      metaDesc: "Règles de facturation pour auto-entrepreneurs. Modèle conforme et gratuit.",
      createdAt: daysAgo(52),
    },
    {
      title: "Délai de paiement et pénalités de retard",
      slug: "delai-paiement-penalites-retard-facture",
      excerpt:
        "Délais légaux de paiement en France et calcul des pénalités de retard en cas de facture payée en retard.",
      content: `<p>En France, le délai de paiement par défaut est de 30 jours à compter de la date d’émission de la facture (45 jours en fin de mois ou 60 jours pour certains secteurs).</p>
<p>Vous pouvez prévoir un délai plus court par contrat ou conditions générales. Au-delà du délai convenu, des pénalités de retard peuvent s’appliquer.</p>
<p>Les pénalités de retard doivent être mentionnées sur la facture. Le taux légal minimum est le taux d’intérêt de la BCE majoré de 10 points. Une indemnité forfaitaire pour frais de recouvrement peut s’y ajouter (40 €).</p>
<p>Indiquez ces éléments dans les conditions de paiement de votre facture pour vous protéger en cas de retard.</p>`,
      categoryId: conformite.id,
      metaTitle: "Délai de paiement et pénalités de retard | Facturation",
      metaDesc: "Délais de paiement légaux et pénalités de retard sur facture en France.",
      createdAt: daysAgo(45),
    },
    {
      title: "Facture sans TVA : quand et comment l’appliquer ?",
      slug: "facture-sans-tva-quand-comment",
      excerpt:
        "Exonération de TVA, franchise en base, facturation hors taxes : ce qu’il faut savoir.",
      content: `<p>Certains professionnels ne sont pas assujettis à la TVA : auto-entrepreneurs sous franchise, associations, export, etc. Ils émettent des factures « TVA non applicable ».</p>
<p>Sur la facture, la mention « TVA non applicable, article 293 B du CGI » (ou autre base légale selon le cas) doit apparaître. Le client paie le montant TTC, qui correspond au montant HT car aucune TVA n’est ajoutée.</p>
<p>Si vous êtes assujetti à la TVA, vous devez en revanche faire figurer la TVA collectée et, le cas échéant, la TVA déductible. Notre générateur permet de choisir le taux (0 %, 2,1 %, 5,5 %, 10 %, 20 %) selon votre situation.</p>`,
      categoryId: conformite.id,
      metaTitle: "Facture sans TVA : exonération et franchise",
      metaDesc: "Quand et comment émettre une facture sans TVA. Mentions obligatoires.",
      createdAt: daysAgo(38),
    },
    {
      title: "Facturation freelance : bonnes pratiques",
      slug: "facturation-freelance-bonnes-pratiques",
      excerpt:
        "Conseils pour bien facturer en tant que freelance : numérotation, délais, relation client.",
      content: `<p>En tant que freelance, une facturation claire et professionnelle renforce la confiance et limite les litiges.</p>
<p><strong>Numérotation :</strong> utilisez une séquence unique et chronologique (ex. 2026-001, 2026-002). Ne réutilisez jamais un numéro.</p>
<p><strong>Délais :</strong> précisez la date d’échéance et les conditions de paiement (virement, chèque, délai). 30 ou 45 jours sont courants en B2B.</p>
<p><strong>Détail des prestations :</strong> décrivez chaque mission ou livrable avec quantité et prix unitaire HT pour que le client comprenne le montant total.</p>
<p>Conservez une copie de chaque facture et relancez poliment en cas de retard de paiement.</p>`,
      categoryId: freelance.id,
      metaTitle: "Facturation freelance : guide des bonnes pratiques",
      metaDesc: "Comment bien facturer en freelance. Numérotation, délais, contenu de la facture.",
      createdAt: daysAgo(31),
    },
    {
      title: "Créer une facture en moins de 2 minutes",
      slug: "creer-facture-2-minutes",
      excerpt:
        "Tutoriel pas à pas pour générer une facture conforme en PDF sans logiciel payant.",
      content: `<p>Avec un générateur en ligne, vous n’avez besoin d’aucun logiciel ni abonnement. Voici les étapes.</p>
<p><strong>1.</strong> Renseignez vos coordonnées (émetteur) et celles de votre client.</p>
<p><strong>2.</strong> Ajoutez les lignes de prestations : description, quantité, prix unitaire HT, taux de TVA. Le total HT, la TVA et le total TTC se calculent automatiquement.</p>
<p><strong>3.</strong> Vérifiez les mentions obligatoires (SIRET, TVA, conditions de paiement) puis téléchargez le PDF.</p>
<p>Notre outil est gratuit, sans inscription, et ne stocke aucune donnée sur un serveur. Vous gardez le contrôle total de vos informations.</p>`,
      categoryId: guide.id,
      metaTitle: "Créer une facture en 2 minutes | Tutoriel gratuit",
      metaDesc: "Générez une facture PDF conforme en 2 minutes. Sans inscription.",
      createdAt: daysAgo(24),
    },
    {
      title: "Numéro de facture : règles et exemples",
      slug: "numero-facture-regles-exemples",
      excerpt:
        "Comment numéroter ses factures ? Règles légales et exemples de séquences pour 2026.",
      content: `<p>Le numéro de facture doit être unique et suivi dans l’ordre chronologique. Il peut être composé librement (chiffres, lettres, tirets).</p>
<p>Exemples courants : 2026-001, FACT-2026-001, FA-001. L’important est de ne jamais réutiliser un numéro et de pouvoir prouver la continuité en cas de contrôle.</p>
<p>En cas d’activité multiple (plusieurs sociétés ou statuts), utilisez une séquence distincte par entité pour éviter les confusions.</p>
<p>Notre générateur vous laisse saisir le numéro de votre choix ou vous pouvez suivre une numérotation simple (année + séquence).</p>`,
      categoryId: guide.id,
      metaTitle: "Numéro de facture : règles et exemples 2026",
      metaDesc: "Comment numéroter ses factures. Exemples et conformité.",
      createdAt: daysAgo(17),
    },
    {
      title: "Facture en euros, CHF ou CAD : multi-devises",
      slug: "facture-multi-devises-euros-chf-cad",
      excerpt:
        "Facturer en euros, francs suisses ou dollars canadiens : ce qu’il faut indiquer sur la facture.",
      content: `<p>Si vous travaillez avec des clients en Suisse, au Canada ou ailleurs, vous pouvez facturer dans leur devise (CHF, CAD, etc.) ou en euros.</p>
<p>Indiquez clairement la devise sur la facture (symbole €, CHF, CAD) et, si utile, le taux de change appliqué ou la date de conversion. Pour les échanges intracommunautaires ou internationaux, les règles de TVA varient (TVA UE, exonération export, etc.).</p>
<p>Notre générateur propose plusieurs devises pour adapter la facture à votre client. Pensez à vérifier les obligations selon le pays du client (TVA, mentions locales).</p>`,
      categoryId: guide.id,
      metaTitle: "Facture multi-devises : euros, CHF, CAD",
      metaDesc: "Facturer en euros, francs suisses ou dollars. Bonnes pratiques.",
      createdAt: daysAgo(10),
    },
    {
      title: "Comment facturer un client à l'étranger (Hors Union Européenne) ?",
      slug: "facturation-client-hors-ue",
      excerpt:
        "TVA, mentions obligatoires, devise et frais bancaires : les règles essentielles pour facturer un client hors Union Européenne.",
      content: `<p>Travailler avec des clients situés aux États-Unis, au Canada, au Royaume-Uni ou en Afrique est une opportunité majeure pour un freelance ou une PME. Cependant, la facturation internationale répond à des règles fiscales strictes, notamment en ce qui concerne la TVA.</p>
<h2>1. L'exonération de TVA (Exportation)</h2>
<p>La règle de base est simple : lorsque vous vendez un service ou un produit à un client situé en dehors de l'Union Européenne, vous facturez Hors Taxes (HT).</p>
<p>En vertu de l'article 262 du CGI, les exportations sont exonérées de TVA. Cela signifie que vous ne devez pas collecter de TVA pour l'État français sur ces transactions.</p>
<h2>2. La mention obligatoire à ne pas oublier</h2>
<p>Pour que votre facture soit légale, vous devez justifier cette absence de taxe par une mention spécifique :</p>
<p><strong>\"Exonération de TVA, article 262 du CGI (ou article 259-1 pour les services).\"</strong></p>
<h2>3. Quelle devise utiliser ?</h2>
<p>Vous pouvez facturer dans la devise de votre choix (Dollar, Euro, FCFA). Cependant, votre comptabilité doit toujours être tenue dans votre monnaie nationale.</p>
<p><strong>Conseil :</strong> Précisez toujours le taux de change utilisé si vous facturez en devise étrangère pour éviter tout litige lors du paiement.</p>
<h2>4. Moyens de paiement et frais bancaires</h2>
<p>Les virements internationaux (SWIFT) peuvent engendrer des frais importants. Précisez bien dans vos conditions que les frais bancaires sont à la charge du client (clause \"OUR\") pour recevoir le montant exact de votre prestation.</p>`,
      categoryId: conformite.id,
      metaTitle: "Facturer un client hors UE : TVA et mentions obligatoires",
      metaDesc:
        "Guide pratique pour facturer un client hors Union Européenne : exonération de TVA, mentions obligatoires, devise et frais bancaires.",
      createdAt: daysAgo(6),
    },
    {
      title: "Facture Micro-Entrepreneur : Le guide des mentions spécifiques (TVA non applicable)",
      slug: "facture-micro-entrepreneur-tva-non-applicable",
      excerpt:
        "Vous lancez votre micro-entreprise ? Découvrez comment facturer légalement sans TVA et la mention obligatoire indispensable pour éviter les amendes.",
      content: `<p>Le régime de la micro-entreprise séduit par sa simplicité. Cependant, une erreur courante concerne la gestion de la Taxe sur la Valeur Ajoutée (TVA). En tant que micro-entrepreneur, vous bénéficiez généralement de la franchise en base de TVA. Voici comment rester en règle.</p>
<h2>1. Pourquoi ne facturez-vous pas de TVA ?</h2>
<p>Tant que votre chiffre d'affaires ne dépasse pas certains seuils (91 900 € pour la vente de marchandises ou 39 100 € pour les prestations de services en 2026), vous n'êtes pas assujetti à la TVA. Cela signifie que vous ne la facturez pas à vos clients, mais en contrepartie, vous ne pouvez pas la récupérer sur vos achats professionnels.</p>
<h2>2. La mention obligatoire « Magique »</h2>
<p>C'est le point le plus important. Si vous ne facturez pas de TVA, vous devez impérativement faire figurer cette mention sur TOUTES vos factures :</p>
<p><strong>« TVA non applicable, art. 293 B du CGI »</strong></p>
<p>Sans cette phrase, votre facture est considérée comme non conforme et vous vous exposez à une amende de 15 € par mention manquante.</p>
<h2>3. Comment présenter vos prix ?</h2>
<p>Sur votre facture, il ne doit y avoir aucune colonne « TVA ».</p>
<ul>
<li>Le prix unitaire doit être le prix final.</li>
<li>Le total doit être indiqué en HT (Hors Taxes).</li>
<li>Il est conseillé d'ajouter une ligne de total indiquant : « Net à payer ».</li>
</ul>
<h2>4. Que se passe-t-il si vous dépassez les seuils ?</h2>
<p>Si votre activité explose (félicitations !), vous sortirez du dispositif de franchise. À ce moment-là, vous devrez :</p>
<ul>
<li>Demander un numéro de TVA intracommunautaire au service des impôts.</li>
<li>Modifier vos modèles de factures pour inclure la TVA (20 % en général).</li>
<li>Supprimer la mention « Art. 293 B ».</li>
</ul>
<h2>Conclusion</h2>
<p>La simplicité est l'atout du micro-entrepreneur. En utilisant un outil adapté, vous vous assurez que ces mentions apparaissent automatiquement selon votre statut.</p>
<p><strong>Pas envie de gérer les calculs et les mentions légales à la main ?</strong> <a href="/generateur-facture">Utilisez notre Générateur de Facture pour Micro-Entrepreneur</a> : cochez simplement l'option « Exonération TVA » et nous nous occupons du reste.</p>`,
      categoryId: guideFreelance.id,
      metaTitle: "Facture Micro-Entrepreneur : mentions TVA non applicable (art. 293 B)",
      metaDesc: "Guide des mentions obligatoires pour facturer en micro-entreprise sans TVA. Évitez les amendes.",
      createdAt: daysAgo(3),
    },
  ];

  for (const post of posts) {
    await prisma.post.upsert({
      where: { slug: post.slug },
      update: {
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        categoryId: post.categoryId,
        published: true,
        metaTitle: post.metaTitle,
        metaDesc: post.metaDesc,
        createdAt: post.createdAt,
      },
      create: {
        ...post,
        published: true,
      },
    });
  }

  console.log("Seed terminé :", posts.length, "articles créés ou mis à jour.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
