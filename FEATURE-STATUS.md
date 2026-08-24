# Happy Orbit Frontend — Feature Status

> First "what's built vs. not built" reference for the app. Compiled 2026-07-17 from a code audit of every feature area (`src/pages/*`) and the API layer (`src/api/*`). File:line citations point at the current code.
>
> **TL;DR:** This is a substantially-built, working product across all five areas — not a skeleton. Rough maturity order: **Quiz ≈ Game > Users/Home/Auth > Survey**. The Survey *Results* page is the single most unfinished piece; the biggest *buildable* structural gap is game-catalog authoring (user/account creation look like gaps but are backend-blocked by design — SERVICE-role-only — see "Not built"); and there are a handful of real bugs worth fixing before building anything new.

## Vision vs. built (from the founder's "New Culture Software" spec)

The original product vision (`orbit_features.pdf`, 2026-07) describes **five systems**. Three are substantially built; **two were never started**. Note the doc names things oppositely to the code: its "Feedback system" (1-question, weekly, anonymous) = the code's **Survey**; its "Training system" (10-question, scored, weekly) = the code's **Quiz**.

| Planned system | Intended | Status |
|---|---|---|
| **Gamification** | Points, live game board, tokens/avatars, prizes at levels | **Built** (Game) — minus avatars, prizes-at-levels, automated movement |
| **Feedback** (anonymous weekly pulse) | 1-question anonymous, auto-sent weekly, reminders | **Built** (Survey) — but Results unfinished; no reminder/follow-up engine |
| **Training** (scored weekly quiz) | 10 random questions, scored, tracks duration & wrong answers | **Built** (Quiz) — no wrong-answer-retraining view, no reminders |
| **Peer-to-Peer Recognition** (Kudos + Impact Award) | Employees recognize each other, award points, pass a digital Impact Award | **NOT BUILT** — no code anywhere |
| **Employee Sharing** (internal blog) | Lightweight blog: teaching, dept updates, book/recipe posts, news; tag/search/comment/profiles | **NOT BUILT** — no code anywhere |

**Cross-cutting vision items not built:**
- **Reminder / follow-up engine** — the spec repeatedly calls for auto-emailing employees about new surveys/quizzes and nudging non-responders "at multiple intervals." No such scheduling/notification system exists in the frontend (may be partly the domain of the Slack Interface service — needs backend confirmation).
- **Profiles & avatars / game tokens** — the board shows player initials; there's no profile creation or token/avatar selection.
- **Prizes at levels** — the catalog defines boards/stages with point values, but there's no prize definition or award-at-level UI.
- **Three-tier interface model** (Individual / Organization / Internal-super-admin across multiple orgs) — the app is effectively single-tier admin; multi-org "Internal Interface" (global templates, cross-org data) is not built (`AccountModel` CRUD is unused).
- **Prize Motion Graphics** — explicitly a *future* item in the spec; not built.

**Bottom line:** ~60% of the envisioned product exists (the three core weekly-engagement systems). The two entirely-missing systems (Peer Recognition, Employee Sharing) plus the reminder engine are the largest greenfield builds ahead.

## Live QA pass (running app, 2026-07-17)

Hands-on click-through of the running app against the test backend, logged in as an admin. Complements the code audit with real runtime behavior.

| Area | Live result |
|------|-------------|
| Home dashboard | ✅ Renders; all card groups present (no Survey group — nav only) |
| Game Board | ✅ Renders (board, log, player stats, admin controls) |
| Leaderboard | ✅ Clean empty state, **no spurious error toast** (confirms the 404-handling fix) |
| Game Catalog + detail | ✅ (verified during bug fixes: list, detail, start-game → board) |
| Sources (points) | ✅ Full list, search, add/delete/edit |
| Quiz — Questions | ✅ (verified during bug fixes; True/False fix confirmed end-to-end) |
| Quiz — History | ✅ Submission table, scores, "Show All Users" filter, timed-out flag |
| Quiz — Settings | ✅ All fields populated (frequency, timer, count, reward source) |
| Users list | ✅ Renders; **no "Add User" button** — later confirmed *intentional*: user creation is SERVICE-role-only in the Hub API (provisioned via Slack), not a buildable UI gap. See "Not built" below. |
| **Take A Quiz** (`/quiz`) | ✅ Redirects to Home when no quiz is ready, **with a toast message** (`toaster.info`) — correct behavior; the toast just faded before it was noticed in the first live pass. Not a bug. |
| **Survey (all pages)** | ❌ **Completely non-functional** — every survey page hangs on an **infinite loading spinner** with no error. The backend `survey.test.api.happyorbit.com` has no DNS record, so nothing loads. Not just "Results unfinished" — the whole section is dead in test. |

**Cross-cutting (console):**
- **React 18 warning** on every page: the app boots with the legacy `ReactDOM.render` instead of `createRoot`, so it silently runs in React 17 compatibility mode. Tech debt; one-line fix at the entry point.

**Takeaways beyond the code audit:**
1. Survey is the worst offender live — an infinite spinner is a worse experience than a broken page. First fix when the survey backend/test-env is restored: give every survey page a load timeout + error state so it fails visibly instead of hanging.
2. "Take A Quiz" needs a "no quiz available right now" message instead of a silent bounce to Home.

## Area maturity at a glance

| Area | State | Headline |
|------|-------|----------|
| **Quiz** | Most complete | Full question/tag CRUD, settings, take-quiz → results → history all work. Minor bugs + one dead API. |
| **Game** | Largely complete | Play loop, leaderboard, points sources, hide/restore wired to real endpoints. No catalog authoring UI. |
| **Users / Home / Auth** | Complete for what exists | All auth flows, user edit/delete, points & quiz-tag editors work. No user/account *creation*. |
| **Survey** | Least complete | Bank/question CRUD & submission work, but **Results is unfinished** and historical results don't render. Most fragile (single backend, the one whose test env has no DNS). |

---

## Confirmed bugs (fix before building new features)

1. ~~**Quiz True/False editor is inverted.** `src/pages/quiz/QuestionEditor/QuestionForm/BooleanForm.tsx:39-41` — selecting "True" stores `answer = false` and vice-versa.~~ **FIXED 2026-07-17** — swapped the radio `value` props so True→`+true`/False→`+false`, matching the (correct) quiz-taking and results sides. Verified end-to-end against the DB: read (answer=1→"True" shown, answer=0→"False" shown) and write (selecting "False" now stores `0`).
2. **Survey Results — smaller than first thought (corrected after reading the backend, 2026-07-17).**
   - `Orbit-Survey` serves `/surveys/{id}` (historical) with the **same serializer** as `/surveys/results` (current) — `SurveyController::readPrevious`/`results` + shared `createSerializerContext`. `summarized` = "questions have summary data" (`Survey::isSummarized`), set by an async `SurveySummarizer` when a survey completes. **No new backend endpoint needed** — historical results render for any summarized survey. The earlier "needs a backend endpoint" was a wrong inference from the frontend alone.
   - **Real, confirmed frontend gap:** post-submit redirect to Results is commented out — users go to `/` instead of results. `src/pages/survey/Form/index.tsx:106-108`. Fix = re-enable it + degrade gracefully when a survey isn't summarized yet.
   - Caveat: can't verify live until the survey **test** backend exists (no DNS/deployment); likely already works in production.
3. ~~**Game "Start Game" from catalog detail dead-ends.**~~ **FIXED 2026-07-17** — after a successful start, `confirmStartGame` now redirects to `/game`. Verified: confirming "Start Game" navigates to the board showing the started game. `src/pages/game/Catalog/GameInfo.tsx`.
4. ~~**Game catalog error-redirect is broken** (`/catalog` instead of `/game/catalog`).~~ **FIXED 2026-07-17** — `redirect` state now holds the target path; error path sends to `/game/catalog`. Verified: a bad game ID lands on the catalog list. `src/pages/game/Catalog/GameInfo.tsx`.
5. **Leaderboard 404 handling is backwards vs. its own comment.** A 404 (no active game) flips the error flag instead of being ignored; other errors are swallowed. `src/pages/game/Leaderboard/index.tsx:154-161`.
6. **User editor validation errors never display.** `validationFailures` is captured but the form uses plain `FormGroup`, not `ValidationAwareFormGroup`. `src/pages/users/Editor/UserTab.tsx:20,33,47-80,119`.
7. **Auth plumbing gap.** `setToken` sets the auth header on hub/pointTracking/gameState/gameCatalog but **not** quizClient/surveyClient, so logout/refresh doesn't update those. `src/api/jwt.ts:81-89`.
8. **Divide-by-zero → `NaN%`** when a quiz has 0 questions. `src/pages/quiz/Results/index.tsx:82-85` (reused by `History/index.tsx:159`).
9. **Survey scale slider default desyncs** from the value that gets submitted until the user drags it. `src/pages/survey/Form/Question/ScaleQuestion.tsx:18` vs `Form/index.tsx:56`.

## Known TODOs left in code

- `src/pages/quiz/QuestionEditor/AnswerForm.tsx:44-45` — default question kind hardcoded to FreeText ("change back to MultipleChoice /tyler").
- `src/pages/survey/Bank/Question/ScaleQuestion.tsx:58` — scale label generation "breaks if start > end" (and loops forever if step ≤ 0).
- `src/api/jwt.ts:76` — client-auth wiring should be centralized.
- `src/pages/game/Leaderboard/index.tsx:135` — sequential fetches should be parallelized.

---

## Not built (structural gaps)

**Authoring / admin:**
- **Game catalog authoring** — games, boards, stages, board images are **read-only** (`GameModel`/`BoardModel`/`StageModel` expose only `list`/`read`). No way to create/edit a game in-app despite the catalog being admin-gated. *(Biggest structural gap.)*
- **User creation** — ⚠️ **NOT a buildable frontend gap — backend-blocked by design (confirmed live 2026-07-22).** `UserModel.create` / `PUT /users` exists in the frontend layer, but the Hub API decorates the create (and delete) route with `#[IsGranted(FirewallRole::SERVICE)]` — a **service-to-service role no human admin holds**. Building an "Add User" dialog and clicking Create returns **403**. Users are provisioned by the **Slack integration** (which has the SERVICE role); that's why the email is "only updatable via Slack" and why there's no "Add User" button. Intentional, not missing.
- **Account creation/management** — ⚠️ **Same backend block.** `AccountModel.create/delete` defined in the frontend, but Hub's `/accounts` list, create, **and** delete all require `#[IsGranted(FirewallRole::SERVICE)]`. Not buildable as an admin UI.
- **Survey "week" assignment** — rotating-survey week numbers are display-only; new bank items are created with an empty payload; can't set which week maps to which survey. `src/pages/survey/Bank/SurveyList.tsx:164,317`.
- **Fine-grained roles/permissions** — only an admin Yes/No toggle; `permissions.ts` defines just `Admin`. No permission-editing UI.

**Reporting / views:**
- **Quiz "my submissions" self-service** — entire `src/api/Quiz/Models/Users.ts` (`/users/me`, `/users/me/submissions`) is unused; the view was designed for but never built.
- **Quiz analytics** — only individual submissions listed; no per-question stats / pass-rates despite the data being available.
- **Points revocation UI in Game** — `PointsModel.delete` endpoints exist; you can assign points but not revoke an individual claim from any game screen.
- **End-of-game / winner state** — "no remaining boards" is only a toast; no game-complete UI.
- **Exports** — CSV export exists for the leaderboard only; nothing for history/log or survey data.

## Tech debt / polish (non-blocking)

- Uncontrolled radio inputs via direct object mutation in quiz-taking (`Quiz/Questions/BooleanQuestion.tsx`, `MultipleChoiceQuestion.tsx`); inconsistent with `FreeTextQuestion` which uses state.
- Prop mutation: `TopRankedPlayersCard/index.tsx:17` sorts a prop array in place inside `useMemo`.
- Stale `useCallback` deps: `src/pages/game/Sources/TableItem.tsx:24` (lists `onDelete`, uses `onEdit`).
- Missing React `key`s on mapped list items: `quiz/QuestionEditor/QuestionForm/MultipleChoiceForm.tsx:37`, `FreeTextForm.tsx:37`.
- Shared `components/ObjectList/index.tsx:31-33` — documented "total pages doesn't update when items change" bug, affects every list page.
- Dead code: `SurveySubmissionModel.denormalize`, `SurveyModel.denormalize` (partial), `AuthenticationModel.refreshAuth`, `PointsModel.getSummary`.
- Backend/frontend contract patches for deleted-player updates (backend returns only `player_id`): `src/api/Game-State/Models/Games.ts:93-99,211-217` — signals an unsettled API contract worth firming up.

---

## Backend capability map (what the APIs can do)

Six services back the app (`src/api/index.ts:102-107`): **Hub** (Symfony — users/accounts/auth), **Point-Tracking** (Rust/Rocket), **Game-State** (Rust/Rocket), **Game-Catalog** (Symfony, read-only from FE), **Quiz** (Symfony), **Survey** (Symfony). Several endpoints are defined but unused by the UI (user/account creation, per-user point summaries, quiz self-service) — these represent the lowest-effort "not built" items, since the backend already supports them.

## Suggested first moves

- **Quick wins (real bugs, small diffs):** the True/False inversion (#1), the two Game catalog redirect/navigation bugs (#3, #4), and the UserTab validation display (#6).
- **Highest user-visible value:** finish the **Survey Results** page (#2) — it's the largest dark feature and the redirect is already stubbed for it.
- **Biggest project:** a **game-catalog authoring UI** — currently the only way to define games is outside the app.
