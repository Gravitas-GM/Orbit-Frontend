# Build Plan — Peer-to-Peer Recognition (Kudos + Impact Award)

> One of the two unbuilt systems from the founder's spec (see FEATURE-STATUS.md). This plan turns it into something executable the moment backend/org access lands. Grounded in the existing architecture (React 18 + Parcel + Blueprint.js frontend; Symfony + Rust/Rocket microservices).

## 1. What the spec asks for

- Employees select other employees from a central list and send **Kudos** (positive recognition with a message).
- Receiving a Kudo **awards points** to the recipient.
- Kudos are kept in a **central feed**, shown on the Individual and Organization interfaces.
- A single **Impact Award** can be **passed** from its current holder to another employee, with a stated reason; passing it **awards points**. (Includes John's quote about the award's meaning.)
- Employees are **alerted/emailed** when they receive a Kudo.

## 2. Recommended scope & phasing

- **Phase 1 (MVP):** Give a Kudo → award points → show a central Kudos feed + "Kudos I received." No Impact Award, no email (Slack notification optional).
- **Phase 2:** Impact Award — view current holder, holder passes it with a reason → award points.
- **Phase 3:** Notifications (email + Slack via the existing Orbit Slack Interface service), admin moderation, configurable point values.

## 3. Backend home — decision needed

Two viable options (decide with whoever owns the backend):

- **Option A — extend Point-Tracking** (Rust/Rocket, MongoDB). Kudos are fundamentally point-award events with metadata; Point-Tracking already owns points and is a schema-flexible document store. Least infra (no new EC2/DB/repo). **Recommended for MVP.**
- **Option B — a new `Orbit-Recognition-API` microservice.** Matches the team's one-service-per-feature convention (quiz/survey/game-state/point-tracking are all separate) and keeps concerns clean, but needs a new EC2 box, DB, repo, and DNS. Better long-term if recognition grows.

Either way, **awarding points reuses the existing Point-Tracking flow** — a Kudo/Award creates a point claim for the recipient under a dedicated point source (e.g. "Kudos", "Impact Award"), exactly like `PointsModel.create` against `/points/users/:user` does today.

## 4. Data model

**Kudo**
- `id`, `account_id`, `from_user_id`, `to_user_id`, `message`, `created_date`, `points_awarded`, `point_claim_id` (link to the awarded point claim)

**Impact Award (one active holder per account)**
- `id`, `account_id`, `current_holder_user_id`, plus a **pass history**: `{ id, from_user_id, to_user_id, reason, awarded_date, points_awarded }`

**Settings (per account)** — mirrors Quiz/Survey Settings pattern
- `kudos_point_value`, `impact_award_point_value`, `kudos_point_source_id`, `impact_award_point_source_id`, `notify_on_kudo` (bool)

## 5. API endpoints (REST, matching existing conventions)

- `POST /kudos` — body `{ to_user, message }` → creates Kudo, awards points, returns the Kudo. (Guard: can't Kudo yourself.)
- `GET /kudos/account/:account` — paginated feed (newest first). Supports the same projection/query params other endpoints use.
- `GET /kudos/users/:user` — Kudos a user has received.
- `DELETE /kudos/:id` — admin moderation.
- `GET /impact-award/account/:account` — current holder (+ optional history).
- `POST /impact-award` — body `{ to_user, reason }` → only the current holder may call; passes award, awards points.
- `GET /settings/account/:account` / `PATCH /settings/account/:account` — recognition settings.

## 6. Frontend implementation (mirrors existing patterns)

**API layer** — new `src/api/Recognition/` (or fold into `src/api/Point-Tracking/`):
- `index.ts` — client `init()` like the other services; add auth wiring in `src/api/jwt.ts` (note: quiz/survey clients are currently missing there — fix that at the same time).
- `Models/Kudo.ts`, `Models/ImpactAward.ts`, `Models/Settings.ts` — `Endpoints` interface + `Model` class with `denormalize`, exactly like `SurveyModel` / `QuestionModel`.
- If a new service: add `RECOGNITION_URL` to `src/config.ts` + `.env` / `.env.production`.

**Pages** — new `src/pages/recognition/`:
- `index.tsx` — `<Routes>` with the sub-pages (open to all users; admin sub-pages gated with `withPermissionRestriction(Permission.Admin)`, matching Quiz/Survey).
- `GiveKudos` — recipient picker (reuse the multi-select from `game/Sources/AssignPointsDialog.tsx`) + message field (`ValidationAwareFormGroup`), submit via `KudoModel.create`.
- `Feed` — central Kudos list (reuse `components/ObjectList` for search/pagination).
- `MyKudos` — Kudos received (`KudoModel.getForUser`).
- `ImpactAward` — show holder + John's quote; if you're the holder, a "Pass the Award" dialog (recipient + reason).
- `Settings` — admin: point values + point-source pickers (copy `pages/quiz/Settings`).

**Wiring**
- `src/pages/home/cards/` — add `RecognitionCards.tsx` (Give Kudos, Kudos Feed, Impact Award) to the dashboard.
- `src/components/NavHeader/` — add `RecognitionMenu.tsx`.
- Mount `/recognition/*` in `src/Layout.tsx` alongside the other route groups.

**Reuse inventory:** `ObjectList`, `ValidationAwareFormGroup`, `FormControls`, the user-select dialog pattern, `PointSourceModel` (source pickers), `PointsModel` (awarding), `toaster`, `NonIdealState` empty states.

## 7. Open decisions (for the team)

1. Backend: extend Point-Tracking vs. new service (§3).
2. Point values: fixed or per-account configurable? (plan assumes configurable, via Settings.)
3. Feed visibility: whole company vs. per-department?
4. Kudos attribution: **attributed** (unlike the anonymous Feedback/Survey system) — confirm.
5. Impact Award: how is the **first** holder seeded? Anti-abuse (no self-pass, rate limits, one hold at a time)?
6. Notifications: email, Slack (via Orbit Slack Interface), or both — and at what point in phasing.
7. Moderation: is admin delete enough, or is approval needed before a Kudo posts?

## 8. Rough effort

- Backend (Option A): endpoints + point-award integration + settings — small-to-medium.
- Frontend: ~5 pages + api models + dashboard/nav wiring, all following established patterns — medium, low-risk (heavy reuse).
- Phase 1 alone (Give Kudo + Feed + points) is a tight, demoable slice.
