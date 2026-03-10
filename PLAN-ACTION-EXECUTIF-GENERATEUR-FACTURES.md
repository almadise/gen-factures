# Plan d'action exécutif — Générateur de factures en ligne

**Document de référence** — Lancement site outil + contenu éditorial  
**Cible** : Freelances, auto-entrepreneurs, TPE (France, Canada, Belgique, Suisse, Afrique)  
**Stack** : Gratuite ou très abordable (objectif &lt; 15 €/mois)

---

## 1. PHASE TECHNIQUE (JOURS 1–4)

### 1.1 Stack recommandée

| Composant | Technologie | Coût | Justification |
|-----------|-------------|------|---------------|
| **Framework** | Next.js 14+ (App Router) | Gratuit | SSR/SSG pour SEO, API Routes pour logique légère, déploiement simple |
| **Hébergement** | Vercel (Hobby) | Gratuit | Déploiement Git, edge, bande passante généreuse |
| **Base de données** | Airtable (ou Supabase) | Gratuit (limites) | Données structurées sans serveur ; Airtable pour leads/analytics si besoin |
| **Styles** | Tailwind CSS | Gratuit | Rapidité, utilitaires, bon Core Web Vitals |
| **Génération PDF** | jsPDF + html2canvas (client) ou @react-pdf/renderer | Gratuit | Pas de backend dédié pour l’export PDF |
| **Domaine** | OVH / Gandi / Cloudflare | ~8–12 €/an | .fr ou .com |

**Coût mensuel cible** : 0 € (Vercel + Airtable free) + domaine annuel ~1 €/mois.

---

### 1.2 Choix technologiques (résumé)

- **Next.js** : pages statiques pour le blog (SEO), génération côté client pour l’outil (pas de stockage des factures = simplicité et conformité).
- **Vercel** : déploiement automatique, CDN, HTTPS, pas de serveur à gérer.
- **Pas de backend complexe** : formulaire → calculs en JS → génération PDF dans le navigateur → téléchargement immédiat. Aucune donnée personnelle stockée côté serveur (RGPD-friendly).
- **Airtable** : optionnel au début ; utile plus tard pour leads (newsletter), idées d’articles, ou analytics internes.

---

### 1.3 Architecture des pages

```
/                          → Landing + accès outil (above the fold)
/generateur-facture         → Outil principal (formulaire + aperçu + PDF)
/blog                      → Liste des articles (SEO)
/blog/[slug]               → Articles (ex. comment-facturer-freelance)
/guide-facturation         → Guide principal (pillar page)
/mentions-legales           → Obligatoire (France/EU)
/politique-confidentialite  → RGPD
/contact                   → Formulaire ou email (optionnel)
/cgu                       → Conditions d’utilisation (recommandé)
```

**Principe** : une URL = une intention (outil vs information). Pas de sous-pages inutiles pour l’outil (éviter /generateur-facture/etape-1, etc.) pour garder une UX simple et un maillage interne clair.

---

### 1.4 Configuration initiale étape par étape

#### Jour 1 — Environnement et repo

1. **Node.js** : installer la LTS (20.x recommandé).
2. **Créer le projet** :
   ```bash
   npx create-next-app@latest gen-factures --typescript --tailwind --eslint --app --src-dir
   cd gen-factures
   ```
3. **Dépendances pour le PDF** :
   ```bash
   npm install jspdf jspdf-autotable
   # ou pour un rendu React : npm install @react-pdf/renderer
   ```
4. **Connexion Git** : `git init`, repo GitHub/GitLab, puis liaison Vercel au repo.

#### Jour 2 — Page d’accueil et structure

1. **Layout racine** : `src/app/layout.tsx` — meta viewport, lang="fr", polices (ex. Inter ou system).
2. **Page d’accueil** : `src/app/page.tsx` — titre H1, sous-titre, CTA « Créer ma facture » vers `/generateur-facture`, bloc explicatif (gratuit, sans inscription, PDF immédiat).
3. **Navigation** : composant Header avec liens vers Accueil, Générateur, Blog, Guides, Contact.

Exemple minimal d’en-tête (structure HTML sémantique) :

```html
<header role="banner">
  <nav aria-label="Navigation principale">
    <a href="/">Accueil</a>
    <a href="/generateur-facture">Créer une facture</a>
    <a href="/blog">Blog</a>
    <a href="/guide-facturation">Guide</a>
  </nav>
</header>
```

#### Jour 3 — Générateur de facture

1. **Route** : `src/app/generateur-facture/page.tsx`.
2. **État** : React (useState) ou formulaire contrôlé pour : émetteur (nom, SIRET, adresse, etc.), client, lignes (désignation, quantité, prix unitaire, TVA), devise, mentions légales.
3. **Aperçu** : composant qui reflète les champs en temps réel (structure type facture).
4. **Export PDF** : au clic sur « Télécharger le PDF », appel à jsPDF (et jspdf-autotable pour le tableau de lignes). Pas d’envoi des données à un serveur.

Exemple minimal (logique jsPDF) :

```javascript
import { jsPDF } from 'jspdf';

function downloadPDF(data) {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text('FACTURE', 20, 20);
  doc.setFontSize(10);
  doc.text(`Émetteur : ${data.emetteurNom}`, 20, 30);
  doc.text(`Client : ${data.clientNom}`, 20, 38);
  // ... lignes avec doc.table ou manuellement
  doc.save(`facture-${data.numero || 'export'}.pdf`);
}
```

5. **Mobile** : formulaire en colonne unique, bouton PDF bien visible (touch target ≥ 44px).

#### Jour 4 — Déploiement et SEO de base

1. **Vercel** : importer le repo, build command `npm run build`, output directory `.next`. Déployer.
2. **Variables d’environnement** : aucune obligatoire pour la V1 (pas d’API key exposée).
3. **SEO** : dans `layout.tsx` ou par page, définir `metadata` (title, description, openGraph). Exemple :
   ```javascript
   // src/app/layout.tsx
   export const metadata = {
     title: { default: 'Générateur de factures en ligne gratuit | Pas d\'inscription', template: '%s | NomDuSite' },
     description: 'Créez et téléchargez vos factures en PDF en quelques clics. Gratuit, sans inscription. Pour freelances et auto-entrepreneurs.',
   };
   ```
4. **Sitemap** : `src/app/sitemap.ts` avec `export default function sitemap()` retournant les URLs statiques + URLs des articles (si déjà en place).
5. **Robots** : `src/app/robots.ts` autoriser tout sauf éventuelles routes d’admin.

**Pièges à éviter** :
- Ne pas stocker de factures ou de données personnelles sur un serveur sans base légale et mentions RGPD.
- Ne pas bloquer le thread principal pendant la génération PDF (garder la page réactive ; si gros volume, envisager un Web Worker plus tard).
- Vérifier que le PDF généré respecte les mentions légales obligatoires (France : SIRET, TVA si assujetti, modalités de paiement, etc.).

---

## 2. PHASE CONTENU (JOURS 5–12)

### 2.1 Les 10 pages/articles essentiels

| # | Titre exact (suggestion) | Type | Ciblage | Mots-clés principaux |
|---|---------------------------|------|---------|------------------------|
| 1 | Générateur de factures en ligne gratuit | Page outil | Tous | générateur facture gratuit, facture en ligne |
| 2 | Comment facturer en tant que freelance (France 2025) | Article info | Freelances FR | facturation freelance, comment facturer freelance |
| 3 | Facture auto-entrepreneur : modèle et règles 2025 | Article info | Auto-entrepreneurs | facture auto-entrepreneur, modèle facture micro-entreprise |
| 4 | Guide complet de la facturation (obligations, TVA, délais) | Page métier (pillar) | TPE, tous | facturation entreprise, obligations facturation |
| 5 | Facture sans TVA : quand et comment l’appliquer ? | Article info | TPE, FR/BE/CH | facture sans TVA, exonération TVA |
| 6 | Comment créer une facture au Canada (Québec et provinces) | Article info | Canada | facture Canada, facturation Québec |
| 7 | Mentions obligatoires sur une facture (France et Belgique) | Article info | FR, BE | mentions légales facture, facture conforme |
| 8 | Délai de paiement et pénalités de retard (France) | Article info | TPE FR | délai paiement facture, pénalités retard |
| 9 | Facture en euros, en francs suisses ou en dollars : bonnes pratiques | Article info | International | facture devise, facture multidevise |
| 10 | Créer une facture en 2 minutes (tutoriel pas à pas) | Article info / tutoriel | Débutants | créer facture rapidement, tutoriel facture |

**Types** : **Page outil** = objectif conversion (utilisation de l’outil). **Article info** = trafic SEO et autorité. **Page métier** = pillar qui regroupe les sous-thèmes (maillage interne).

---

### 2.2 Structure d’article optimisée SEO (format à suivre)

- **Title (H1)** : 1 seul, mot-clé principal en tête, 50–60 caractères si possible.
- **Introduction** : 80–120 mots, réponse courte à l’intention (ex. « En France, une facture auto-entrepreneur doit contenir… »), mot-clé dans le premier paragraphe.
- **Sous-titres H2** : 3–5 par article, reflétant le plan (questions ou thématiques). Mots-clés secondaires dans certains H2.
- **Paragraphes** : 2–4 phrases, une idée par paragraphe. Listes à puces pour énumérations (mentions obligatoires, étapes).
- **Conclusion** : résumé + CTA (ex. « Utilisez notre générateur de factures gratuit pour appliquer ces règles. »).
- **CTA interne** : lien vers l’outil et vers le guide principal (pillar).
- **Longueur** : 800–1 500 mots pour les articles info ; 1 500–2 500 pour le guide pillar.

**Bonnes pratiques** :
- Répondre directement à la requête (snippet potentiel).
- Utiliser des données à jour (année, références juridiques).
- Liens internes vers l’outil, le guide et d’autres articles pertinents.
- Image avec attribut `alt` descriptif (ex. capture d’écran du générateur).

---

### 2.3 Conseils de rédaction

- **Ton** : professionnel mais accessible (éviter le jargon sans renoncer à la précision).
- **Ciblage géo** : préciser « en France », « au Québec », « en Belgique » quand c’est pertinent ; une section ou un paragraphe par pays si l’article est transversal.
- **E-E-A-T** : auteur ou « rédaction » + date de mise à jour affichée.
- **Pièges à éviter** : contenu dupliqué entre articles ; titres clickbait sans réponse réelle ; oublier le CTA vers l’outil.

---

## 3. PHASE MONÉTISATION (JOURS 13–30)

### 3.1 Stratégie à 3 niveaux

| Niveau | Canal | Délai de mise en place | Objectif |
|--------|--------|-------------------------|----------|
| 1 | Google AdSense | Jours 13–20 | Revenus dès l’approbation (trafic qualifié) |
| 2 | Affiliation (logiciels, compta, banques) | Jours 21–30 | Commissions sur clics/ventes (Quidco, Awin, programmes directs) |
| 3 | Lead magnet (newsletter, checklist PDF) | Mois 2 | Base email pour partenariats et offres ciblées |

---

### 3.2 Implémentation technique des blocs AdSense

Une fois le site approuvé par AdSense, insérer les unités via le script fourni par Google. Exemple d’intégration dans Next.js avec `next/script` :

```html
<!-- Dans layout.tsx ou _document, après validation AdSense -->
<script
  async
  src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXX"
  crossOrigin="anonymous"
></script>
```

Emplacements recommandés :
- **Haut de sidebar** (desktop) ou après le premier paragraphe (mobile) sur les articles.
- **Entre deux sections** dans le guide (ex. après un H2).
- **Bas de page** (avant le footer) sur l’outil et les articles.

Exemple de bloc d’annonce (à remplacer par votre code AdSense) :

```html
<!-- Emplacement : après le 1er paragraphe d’un article -->
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-XXXXXXXX"
     data-ad-slot="YYYYYY"
     data-ad-format="rectangle"
     data-full-width-responsive="true"></ins>
<script>
  (adsbygoogle = window.adsbygoogle || []).push({});
</script>
```

**Bonnes pratiques** :
- Ne pas placer plus de 3–4 blocs par page pour éviter la surcharge et les risques de pénalité.
- Utiliser `data-full-width-responsive="true"` pour le responsive.
- Ne pas placer d’annonces sur le formulaire de l’outil (au-dessus du fold) pour préserver l’UX et les Core Web Vitals.

---

### 3.3 Optimisation du CPC (AdSense)

- **Mots-clés commerciaux** : « logiciel facturation », « facture en ligne payant », « outil compta freelance » → contenu dédié (comparatifs, guides) pour capter ces requêtes.
- **Géo-ciblage** : FR, CA (français), BE, CH en priorité ; créer des pages ou sections par pays pour renforcer la pertinence.
- **Format** : display responsive ; essayer blocs « in-article » sur le blog pour un meilleur taux de clic.
- **Timing** : laisser 2–4 semaines de trafic naturel après approbation avant d’ajuster massivement les emplacements.

---

### 3.4 Timing par type de monétisation

| Semaine | Action |
|---------|--------|
| 3 (J13–20) | Intégration AdSense, demande d’approbation, 4–5 articles publiés, contenu de qualité |
| 4 (J21–30) | Inscription plateformes affiliation (Awin, etc.), choix produits (compta, banque pro), liens dans articles |
| Mois 2 | Mise en place lead magnet (formulaire + checklist PDF ou mini-guide), pop-up ou bandeau discret avec consentement |

---

## 4. PHASE TRAFIC & SCALING (MOIS 2–6)

### 4.1 Objectifs de trafic (indicatifs)

| Mois | Visites/mois (objectif bas) | Visites/mois (objectif ambitieux) | Priorité |
|------|-----------------------------|-----------------------------------|----------|
| 2 | 1 000 | 3 000 | SEO on-page, 2–3 nouveaux articles |
| 3 | 2 500 | 6 000 | Netlinking léger, partages ciblés |
| 4 | 5 000 | 12 000 | Renforcer mots-clés commerciaux |
| 5 | 8 000 | 20 000 | Ezoic possible si critères atteints |
| 6 | 12 000 | 35 000 | Optimisation taux de conversion, tests A/B |

---

### 4.2 Acquisition gratuite

- **Forums et communautés** : répondre de façon utile sur Reddit (r/freelance, r/smallbusiness), forums francophones (auto-entrepreneur, freelances), sans spam — signature ou lien contextuel vers un article ou l’outil.
- **Partenariats** : blogs/comptes « freelance » ou « création d’entreprise » : échange d’articles invités, liens vers votre outil en ressource.
- **Réseaux sociaux** : LinkedIn (posts courts « comment bien facturer »), partage d’extraits d’articles ; Twitter/X et Facebook groupes métier si pertinent.
- **SEO** : maillage interne (guide pillar ↔ articles ↔ outil), netlinking naturel (contenu digne de backlinks).

---

### 4.3 Passage à Ezoic / Mediavine

- **Ezoic** : souvent accessible plus tôt (trafic plus faible). Utile pour tester emplacements et optimiser revenus sans toucher au code.
- **Mediavine** : exigences de trafic plus élevées (ordre de grandeur 50k+ sessions/mois). À viser une fois le site mature.
- **Stratégie** : rester sur AdSense jusqu’à ~10–15k sessions/mois, puis tester Ezoic ; comparer revenus et UX avant de s’engager long terme.

---

## 5. BONUS SPÉCIFIQUES

### 5.1 Section TCF Canada (consentement / intérêt)

Pour le ciblage Canada (et conformité aux pratiques publicitaires), vous pouvez ajouter une section « Préférences » ou « Gestion du consentement » qui enregistre les choix (ex. publicité personnalisée, newsletter) et les réutilise pour les bannières (Google TCF, CMP). Idée : un lien « Gérer mes préférences » dans le footer, page dédiée avec cases à cocher (publicité, analytics, contenu personnalisé) et stockage en `localStorage` ou cookie avec durée limitée. À documenter dans la politique de confidentialité (RGPD + lois canadiennes applicables).

Exemple de structure (côté front uniquement) :

```html
<section aria-label="Préférences de confidentialité">
  <h2>Gestion de vos préférences (TCF Canada)</h2>
  <p>Vous pouvez gérer votre consentement pour la publicité et les cookies.</p>
  <label><input type="checkbox" id="consent-ads" /> Publicité personnalisée</label>
  <label><input type="checkbox" id="consent-analytics" /> Statistiques du site</label>
  <button type="button" id="save-consent">Enregistrer</button>
</section>
```

À connecter ensuite à votre solution de bandeaux (ex. Google Consent Mode v2 si vous utilisez les tags Google).

---

### 5.2 Mini-outils complémentaires

| Outil | Description | Intérêt SEO / UX |
|-------|-------------|-------------------|
| **Calculatrice URSSAF** | Saisie CA ou revenus → estimation cotisations (tranches, pourcentages à jour) | Mots-clés « calcul cotisations urssaf », « simulateur auto-entrepreneur » |
| **Simulateur TVA** | Montant TTC/TVA/TVA déductible (taux FR/BE/CH) | « calcul TVA », « montant HT TTC » |
| **Générateur de numéro de facture** | Suggestion de numérotation (année, séquence) | Renforcement sémantique « facture » |

Idée d’architecture : une page par outil (`/outils/calculatrice-urssaf`, `/outils/simulateur-tva`) avec formulaire + résultat en temps réel, lien vers le générateur de factures et vers les articles associés.

---

### 5.3 Projection financière (ordre de grandeur, 12–24 mois)

Hypothèses : trafic principal France/Belgique/Suisse/Canada francophone ; RPM AdSense moyen 2–5 € ; affiliation 50–200 €/mois à partir du moment où des articles comparatifs/outils génèrent des clics.

| Période | Trafic (sessions/mois) | AdSense (€/mois) | Affiliation (€/mois) | Total (€/mois) |
|---------|-------------------------|------------------|----------------------|----------------|
| Mois 1–3 | 500 – 3 000 | 0 – 50 | 0 | 0 – 50 |
| Mois 4–6 | 5 000 – 15 000 | 50 – 200 | 20 – 100 | 70 – 300 |
| Mois 7–12 | 15 000 – 40 000 | 200 – 600 | 100 – 300 | 300 – 900 |
| An 2 | 40 000 – 100 000 | 600 – 2 000 | 300 – 800 | 900 – 2 800 |

Ces chiffres sont indicatifs ; les revenus dépendent du taux d’approbation AdSense, du trafic réel et des partenariats affiliation conclus.

---

## 6. CHECKLIST DE LANCEMENT (7 JOURS — 2 SEMAINES)

### Semaine 1

| Jour | Action | Priorité |
|------|--------|----------|
| **J1** | Créer le projet Next.js, Git, Tailwind, dépendances PDF | Critique |
| **J2** | Page d’accueil + navigation + route `/generateur-facture` (formulaire basique) | Critique |
| **J3** | Logique complète du générateur (champs, aperçu, export PDF) + test mobile | Critique |
| **J4** | Déploiement Vercel, domaine (si prêt), metadata SEO, sitemap, robots | Critique |
| **J5** | Rédaction article 1 (ex. « Comment facturer en tant que freelance ») + publication | Haute |
| **J6** | Rédaction article 2 (ex. « Facture auto-entrepreneur ») + maillage vers l’outil | Haute |
| **J7** | Page Mentions légales + Politique de confidentialité (RGPD) + lien dans le footer | Critique |

### Semaine 2

| Jour | Action | Priorité |
|------|--------|----------|
| **J8** | Article 3 + structure pillar « Guide facturation » (page + plan) | Haute |
| **J9** | Intégration des blocs AdSense (après approbation) ou préparation des emplacements | Moyenne |
| **J10** | Article 4 (ex. « Mentions obligatoires facture ») | Haute |
| **J11** | Page Contact ou email + vérification formulaire (pas de collecte inutile) | Moyenne |
| **J12** | Vérification Core Web Vitals (LCP, FID, CLS), corrections si besoin | Haute |
| **J13** | Inscription programmes affiliation, choix 2–3 offres | Moyenne |
| **J14** | Relecture globale (liens, orthographe, CTA), planification contenu mois 2 | Moyenne |

**Priorisation** : Technique (J1–J4) et légal (J7) en premier ; contenu et monétisation en parallèle dès que le site est en ligne.

---

## Récapitulatif des contraintes respectées

- **Stack** : Next.js, Vercel, Tailwind, jsPDF — gratuite ; domaine seul en coût annuel.
- **Outil** : fonctionnel sans backend (PDF côté client).
- **Performance** : pas d’annonces sur le formulaire principal, scripts async, images optimisées (Next/Image).
- **Conformité** : mentions légales, politique de confidentialité, consentement (TCF Canada) documenté et prévu en bonus.

Ce plan est exploitable tel quel pour démarrer le projet et ajuster au fur et à mesure des premiers retours (trafic, revenus, temps disponible).
