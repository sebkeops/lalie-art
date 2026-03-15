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

- ⬜ **Favicon** — ajouter le logo comme favicon (fichier `icon.png` ou `favicon.ico` dans `src/app/`)

- ⬜ **Prix sur page détail** — afficher le prix même pour les œuvres réservées ou vendues (actuellement masqué si statut ≠ "available")

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
- ⬜ Focus visible : vérifier que l'outline n'est pas supprimé dans globals.css
- ⬜ Lightbox page détail : ajouter `role="dialog"`, `aria-modal`, fermeture par `Escape`, piège focus
- ⬜ Alt texts plus descriptifs : ex. "Collage de Lalie — [titre]" plutôt que juste le titre
- ⬜ Balises sémantiques : ajouter `<article>` sur les cards d'œuvres, `aria-label` sur les `<section>`
- ⬜ Formulaires admin : vérifier aria-labels sur tous les inputs

### Code quality
- ⬜ Supprimer les `as any` restants dans le code (galerie détail, home)
- ⬜ Vérifier le RLS Supabase — s'assurer que les policies protègent bien les données admin côté client

### Dev & Maintenance
- ⬜ Vérifier/créer un README projet (setup local, variables d'env, déploiement)
- ⬜ Revoir la stratégie de branches Git (feature branches plutôt que tout sur main)

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
- ✅ Open Graph — preview réseaux sociaux (og:title, og:description)
- ✅ URLs propres — slugs lisibles (/gallery/mon-oeuvre)

### Chantier structurel
- ⬜ Convertir les pages publiques en Server Components (voir section Critique ci-dessus)

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
