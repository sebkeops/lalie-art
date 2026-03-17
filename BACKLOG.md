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

- 🔄 **Lightbox page détail — z-index** — fix appliqué (`z-index: 9999` lightbox, `10000` close button). À valider visuellement en preview : header et panneau infos ne doivent plus passer devant l'overlay.

- ✅ **Favicon** — `logo-secondaire-clair.png` copié en `src/app/icon.png` (Next.js App Router)

- ⬜ **Apple Touch Icon** — ajouter `src/app/apple-icon.png` (180×180px) pour l'icône d'accueil iOS/iPadOS

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

### Sécurité
- ⬜ **Pages admin exclues du crawl** — vérifier que `/admin/*` est bien bloqué dans `robots.txt` ET que les pages admin ont `robots: { index: false }` dans leurs métadonnées

### Pages légales (obligatoire légalement en France)
- ⬜ **Mentions légales** — nom, statut, adresse, hébergeur (Vercel), éditeur
- ⬜ **Politique de confidentialité** — si analytics activé : données collectées, durée de conservation, droits RGPD
- ⬜ Liens vers ces pages visibles dans le footer sur toutes les pages
- ⬜ Pages incluses dans le `sitemap.xml`

### Déploiement & infrastructure
- ⬜ **Redirection www → apex** — vérifier sur Vercel que `www.crealalieart.fr` redirige bien vers `crealalieart.fr` (ou inverse)

### Performance
- ⬜ **Audit Lighthouse en prod** — mesurer les Core Web Vitals réels sur `crealalieart.fr` (LCP < 2,5s, INP < 200ms, CLS < 0,1) et noter la baseline

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

### À traiter
- ⬜ **Balise `canonical`** — ajouter `alternates.canonical` dans les métadonnées de chaque page (Next.js App Router le gère nativement)
- ⬜ **`og:url` via variable d'env** — vérifier que l'URL de base n'est pas hardcodée dans les metadata (utiliser `process.env.NEXT_PUBLIC_BASE_URL`)
- ⬜ **Schema.org JSON-LD** — pertinent pour un site d'artiste : schema `Person` (artiste) + `LocalBusiness` ou `ArtGallery` sur la home, `VisualArtwork` sur les pages détail œuvre

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
