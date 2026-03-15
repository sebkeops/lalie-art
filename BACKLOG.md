# Backlog — Lalie Art

Légende : ✅ Traité · 🔄 En cours · ⬜ À faire · ❌ Abandonné

---

## 🔴 Critique (impact direct utilisateurs / SEO)

- ✅ **Images non optimisées** — `<img>` remplacés par `<Image>` Next.js sur toutes les pages publiques (WebP/AVIF auto, lazy loading, srcset, priority sur LCP)
  - Admin gardé en `<img>` (previews blob: URL non supportées par next/image)

- ✅ **Pages publiques en Server Components** — Home, Galerie, À propos, Détail œuvre convertis
  - Fetch Supabase côté serveur, HTML complet dès le premier chargement
  - Animations Framer Motion extraites en sous-composants clients (`HomeAnimatedSections.tsx`)
  - Lightbox extraite en `ArtworkImageWithLightbox` (client)
  - Scroll-to-contact extrait en `ContactScrollEffect` (client)

---

## 🟠 Haute priorité

- ✅ **Favicon** — `logo-secondaire-clair.png` copié en `src/app/icon.png` (Next.js App Router)

- ✅ **Prix sur page détail** — prix affiché même pour les œuvres réservées ou vendues

- ✅ **Loader** — remplacement du logo secondaire moche par `logo.svg` avec animation douce

- ✅ **OG image** — `og-image.jpg` (1200×630) ajoutée et déclarée dans les métadonnées Open Graph

- ✅ **Security headers** — ajoutés dans `next.config.ts` : X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy

- ✅ **Page 404 custom** — `src/app/not-found.tsx` créé (cohérent avec le design, liens retour accueil + galerie)

- ✅ **Google Search Console** — propriété validée, sitemap soumis (`crealalieart.fr/sitemap.xml`)

- ⬜ **Analytics** — intégrer Plausible (privacy-first, léger) ou Google Analytics
  - Si analytics → prévoir bandeau RGPD

---

## 🟡 Priorité moyenne

### Accessibilité (a11y)
- ⬜ Audit complet : Lighthouse + navigation clavier + contrastes WCAG AA
- ⬜ Contraste couleurs : auditer `--wine`, `.muted`, `--rose` sur fond sombre (ratio min 4.5:1)
- ✅ Focus visible : règle `:focus-visible` globale ajoutée dans globals.css (`outline: 2px solid var(--wine)`)
- ✅ Lightbox page détail : `role="dialog"`, `aria-modal`, fermeture `Escape`, piège focus, retour focus sur déclencheur
- ✅ Alt texts plus descriptifs : "Collage de Lalie — [titre]" sur toutes les images d'œuvres
- ✅ Balises sémantiques : `<article>` sur les cards, `aria-label` sur toutes les `<section>` publiques
- ✅ Formulaires admin : tous les inputs ont un label associé (audit complet OK)

### Code quality
- ✅ Supprimer les `as any` restants — remplacés par `"available" | "reserved" | "sold"` dans les pages admin
- ⬜ Vérifier le RLS Supabase — s'assurer que les policies protègent bien les données admin côté client

### Dev & Maintenance
- ✅ README projet — setup local, variables d'env, structure, déploiement
- ✅ Stratégie de branches Git — develop/main en place, documentée dans README et CLAUDE.md

---

## 🟢 Priorité basse / Futures évolutions

- ⬜ Formulaire de contact avec Resend (si forte demande) — prévoir rate limiting à ce moment
- ⬜ Refonte thème clair — fond ivoire/rose, texte vin sombre (chantier complet, tous les composants à retravailler)
- ⬜ Tests — au moins les fonctions critiques (slugify, formatage prix, génération sitemap)
- ⬜ `font-display: swap` — actuellement géré par Adobe Fonts, hors de notre contrôle

---

## SEO ✅

### Quick wins (traités)
- ✅ robots.txt
- ✅ sitemap.xml dynamique (pages statiques + slugs œuvres)
- ✅ Metadata par page (titre, description) via layouts serveur
- ✅ Open Graph — preview réseaux sociaux (og:title, og:description, og:image)
- ✅ URLs propres — slugs lisibles (/gallery/mon-oeuvre)
- ✅ SEO local — localisation Nîmes dans metadata et section contact

---

## Design & UI ✅

- ✅ Logo visible dans le header
- ✅ Section contact avec email cliquable (home : "Prenons contact" + email + téléphone)
- ✅ CTA boutons full-width sur mobile
- ✅ Respiration verticale entre sections sur mobile
- ✅ Police Nautica via Adobe Fonts
- ✅ Animation d'entrée sur les cards galerie
- ✅ Page À propos : layout deux colonnes desktop

---

## Corrections & bugs traités ✅

- ✅ Refactoring : slugify partagé, FormFields communs
- ✅ Suppression doublons CSS (brandLoader)
- ✅ ArtworkCard : classes Tailwind → CSS custom
- ✅ Auto-logout admin (15 min d'inactivité)
- ✅ Scroll to top lors des navigations entre pages
- ✅ Scroll vers #contact depuis n'importe quelle page (sessionStorage)
- ✅ Boutons Acheter/Contacter sur page détail → scroll vers footer contact
- ✅ Liens Accueil/Logo : rechargement si déjà sur la home
- ✅ Admin : prévisualisation image avant upload (new + edit)
