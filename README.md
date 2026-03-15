# Crea Lalie Art

Site vitrine de Lalie, artiste collagiste basée à Nîmes.

## Stack

- **Next.js 14** — App Router, TypeScript
- **Supabase** — base de données PostgreSQL + storage bucket `artworks`
- **CSS custom** — pas de Tailwind côté public, globals.css
- **Vercel** — déploiement continu

## Setup local

### 1. Cloner et installer

```bash
git clone <repo>
cd lalie-art
npm install
```

### 2. Variables d'environnement

Créer un fichier `.env.local` à la racine :

```env
NEXT_PUBLIC_SUPABASE_URL=<url du projet Supabase>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<clé anon publique>
```

Ces valeurs se trouvent dans le dashboard Supabase → Settings → API.

### 3. Lancer en développement

```bash
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

## Structure du projet

```
src/
  app/
    (public)/       # Pages publiques (home, galerie, à propos, détail œuvre)
    admin/          # Espace admin (authentification Supabase)
    globals.css     # CSS global (design system, composants)
    layout.tsx      # Root layout
  components/       # Composants partagés (Header, Footer, ArtworkCard…)
  lib/
    supabase/       # Clients Supabase (server + client)
public/             # Assets statiques (logo, og-image…)
```

## Branches et déploiement

| Branche   | Usage                        | Déploiement                     |
|-----------|------------------------------|---------------------------------|
| `develop` | Développement en cours       | Preview Vercel (URL automatique) |
| `main`    | Production                   | [crealalieart.fr](https://crealalieart.fr) |

**Règle** : tous les commits sur `develop`. Merge vers `main` uniquement sur demande explicite.

## Supabase

- **Tables principales** : `artworks`, `artwork_images`, `content_pages`
- **Storage** : bucket `artworks` (images des œuvres)
- **Auth** : Supabase Auth pour l'accès à `/admin`

## Commandes utiles

```bash
npm run dev      # Serveur de développement
npm run build    # Build de production
npm run lint     # ESLint
```
