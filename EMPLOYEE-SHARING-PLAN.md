# Build Plan — Employee Sharing (Internal Blog)

> The second unbuilt system from the founder's spec (see FEATURE-STATUS.md). Larger than Peer Recognition — it's a genuine new content service — but much of it reuses existing patterns.

## 1. What the spec asks for

- A **lightweight internal blogging platform** for employees to share: teaching, department updates, book reviews & recommendations, recipes, plus company-wide posts (ESP calendars, "meet the team", important news).
- Access is **internal / behind login** (the existing Hub auth covers this).
- **Tag** posts, **group by tag**, and **search by word**.
- **Comment** on posts.
- **User profiles** (create/edit).
- Add/remove users (already exists in the Users area — the *profile* piece is the new part).

## 2. Two useful signals from the existing setup

- **`ckeditor5` is already forked into the Gravitas-GM org.** CKEditor is a rich-text editor — almost certainly staged for *this* system. Strong hint the blog was pre-planned; use that fork as the post editor rather than picking a new one.
- **A working tag system already exists** — Quiz has `QuestionTag` CRUD + membership (`src/pages/quiz/Tags/`, `src/api/Quiz/Models/QuestionTag`). Copy that pattern wholesale for post tags.

## 3. Recommended scope & phasing

- **Phase 1 (MVP):** Posts (create / read / list) + tags + word search + comments. The core blog loop.
- **Phase 2:** User **profiles** + avatars — a *cross-cutting* feature (also needed by Peer Recognition and the gamification "game token/avatar" from the spec). Build once, reuse everywhere.
- **Phase 3:** Structured content types (ESP calendars, "meet the team" templates), notifications, richer moderation.

## 4. Backend home — decision needed

This genuinely needs a **new content store** (posts, comments, tags) — it doesn't map onto points or game state. Recommended: a **new `Orbit-Sharing-API` Symfony service + MySQL**, matching the hub/catalog/quiz/survey convention (new EC2 box, DB, repo, DNS). Heavier than Peer Recognition's "extend Point-Tracking" option — there's no existing service to fold this into.

**Profiles are the exception:** because profiles are user-centric and shared across systems, put them in **Hub** (the users service), not the sharing service. Build the profile model/endpoints in Hub and let Sharing, Recognition, and the game board all read from it.

## 5. Data model

**Post** — `id`, `account_id`, `author_user_id`, `title`, `body` (rich HTML from CKEditor), `type`/category, `published` (draft vs live), `created_date`, `updated_date`
**Tag** + **Post↔Tag** membership — mirror `QuestionTag`
**Comment** — `id`, `post_id`, `author_user_id`, `body`, `created_date`
**Profile** (in Hub) — `user_id`, `display_name`, `bio`, `avatar`, (+ game token/avatar for gamification)

Categories (teaching / dept update / book review / recipe / company news / ESP calendar / meet-the-team): model as a fixed `type` enum **and** allow free tags (the spec asks for both categorized content and "group by tag").

## 6. API endpoints

- Posts: `GET /posts` (list; supports `?q=word`, `?tag=`, `?type=`, pagination), `GET /posts/:id`, `POST /posts`, `PATCH /posts/:id`, `DELETE /posts/:id`
- Comments: `GET /posts/:id/comments`, `POST /posts/:id/comments`, `DELETE /comments/:id`
- Tags: `GET/POST/DELETE /tags` (copy Quiz tag endpoints)
- Profiles (Hub): `GET /profiles/:user`, `PUT /profiles/:user`
- Search: word search via MySQL `FULLTEXT` index on `title`/`body` — a search engine is overkill for "lightweight."

## 7. Frontend implementation (mirrors existing patterns)

**API layer** — new `src/api/Sharing/` (client `init()`, `Models/Post.ts`, `Models/Comment.ts`, `Models/Tag.ts`); Profile model added under `src/api/Hub/`. Add `SHARING_URL` to `src/config.ts` + `.env`. Wire auth in `src/api/jwt.ts`.

**Pages** — new `src/pages/sharing/`:
- `index.tsx` — `<Routes>` (open to all logged-in users).
- `Feed` — post list with search box + tag/category filters (reuse `components/ObjectList`).
- `Post` — read a post + comment thread + add-comment form.
- `PostEditor` — create/edit: title, **CKEditor** body, category, tag multi-select. Author or admin.
- `Tags` — admin tag management (copy `pages/quiz/Tags/`).
- `Profile` — view/edit a user profile + avatar (Phase 2; reuse in Users editor and the game board).
- `MyPosts` — posts I authored.

**Wiring** — `home/cards/SharingCards.tsx`, `NavHeader/SharingMenu.tsx`, mount `/sharing/*` in `src/Layout.tsx`.

**New dependency:** integrate the org's **ckeditor5** fork as a React component for the post body. This is the one genuinely new frontend piece (everything else is established patterns).

**Reuse inventory:** the whole Quiz tag system, `ObjectList` (list + search + pagination), `ValidationAwareFormGroup`, `FormControls`, user list, `toaster`, `NonIdealState`.

## 8. Open decisions (for the team)

1. Confirm the **ckeditor5 fork** was intended for this (its config/build may already be tailored).
2. Who can post — all employees, or a gated set? Draft→publish workflow, or post-immediately?
3. Comment **moderation** — pre-approval or admin-delete-after?
4. Categories: fixed enum vs. tags vs. both (plan assumes both).
5. **Profiles**: confirm they live in Hub and are shared with Recognition + gamification avatars (build once).
6. Image/file uploads in posts? If yes, they'd land in the `cdn.happyorbit.com` S3 bucket (already exists for assets) — needs an upload endpoint.
7. Company-wide vs. per-department feeds/visibility.

## 9. Rough effort

Larger than Peer Recognition: a **new backend service** (posts/comments/tags + search) + **CKEditor integration** are real work. But tags, lists, search UI, forms, and auth are all established patterns. **Phase 1** (posts + tags + search + comments) is a coherent first release; **profiles** (Phase 2) are worth doing early since three systems want them.
