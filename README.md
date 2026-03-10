# Générateur de factures en ligne

Site Next.js : outil gratuit de génération de factures en PDF (sans inscription, sans backend).

## Prérequis

- Node.js 18+ (recommandé : 20 LTS)
- npm ou yarn

## Installation

```bash
npm install
```

> **Windows** : en cas d’erreurs `TAR_ENTRY_ERROR` ou chemins longs, essayez :
> - `npm install --legacy-peer-deps`
> - ou exécuter PowerShell en administrateur avec :  
>   `New-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem" -Name "LongPathsEnabled" -Value 1 -PropertyType DWORD -Force`

## Lancer en développement

```bash
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

## Build production

```bash
npm run build
npm start
```

## Structure

- `src/app/` — App Router Next.js
  - `page.tsx` — page d’accueil
  - `generateur-facture/page.tsx` — formulaire + aperçu + export PDF
  - `blog/`, `guide-facturation/` — pages à compléter (contenu éditorial)
- `src/components/` — Header, ApercuFacture
- `src/lib/genererPdf.ts` — génération PDF côté client (jsPDF + jspdf-autotable)
- `src/types/facture.ts` — types TypeScript (émetteur, client, lignes)

## Favicon et icône

- **Fichier** : `src/app/icon.svg` — icône par défaut (document bleu) utilisée comme favicon par Next.js.
- Pour un **favicon .ico** classique : ajouter `src/app/favicon.ico` (générer à partir de l’SVG ou d’une image avec un outil en ligne). Next.js priorise `favicon.ico` s’il est présent.

## Base de données et seed (blog)

- **Seed** : `prisma/seed.ts` crée 4 catégories (Guide, Conformité, Auto-entrepreneur, Freelance) et **8 articles de blog** publiés.
- Lancer le seed après `db:push` :
  ```bash
  npm install
  npx prisma db push
  npm run db:seed
  ```
  Ou avec la commande Prisma : `npx prisma db seed`.

## Déploiement Vercel

1. Pousser le projet sur GitHub/GitLab.
2. Importer le repo dans [Vercel](https://vercel.com) (Build command : `npm run build`, Output : `.next`).
3. Déployer.

Voir le **plan d’action** dans `PLAN-ACTION-EXECUTIF-GENERATEUR-FACTURES.md`.
