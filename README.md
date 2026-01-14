## TalentWay

TalentWay is a modern platform for running **live coding interviews** with candidates.  
It combines **video calling, a collaborative code editor, interview scheduling, role-based dashboards**, and **recordings** into a single, clean experience.

### Core Features

- **Public landing page (`/`)**
  - Marketing-style hero with emerald/teal gradient branding.
  - Clear CTAs: **Go to Dashboard** and **Login** using Clerk.
  - Highlights of core capabilities (live coding, video, scheduling, recordings).

- **Candidate dashboard (`/dashboard`)**
  - Personalized “Welcome back” experience.
  - For candidates: list of **upcoming interviews** with quick join actions.
  - For interviewers: **quick actions** to start/join calls, schedule interviews, and access recordings.

- **Interviewer dashboard (`/interviewerDashboard`)**
  - Role-protected view for users with the **interviewer** role.
  - Full list of interviews, grouped by status (Upcoming, Completed, Succeeded, Failed).
  - Ability to **update interview outcomes**, leave comments, and review candidate details.

- **Meetings and recordings**
  - Live video powered by **Stream Video**.
  - Meeting room route with support for joining via invite.
  - Recordings page to review past sessions.

- **Role-based access & auth**
  - Authentication handled by **Clerk**.
  - Roles (interviewer / candidate) stored and read via **Convex**.
  - Public landing page; all protected routes use **SignedIn / SignedOut** and redirects.

### Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4, custom theme with emerald/teal gradients
- **UI Library**: shadcn-style components (Radix UI) – buttons, cards, dialogs, select, etc.
- **Auth**: Clerk (`@clerk/nextjs`)
- **Backend / Data**: Convex (`convex`), with typed data models and generated APIs
- **Video & Calls**: Stream Video (`@stream-io/video-react-sdk`, `@stream-io/node-sdk`)
- **State & Hooks**: Custom hooks for calls, user roles, and meeting actions
- **Notifications**: `react-hot-toast`

### Project Structure (High Level)

- `src/app/page.tsx` – Public landing page (marketing + CTAs).
- `src/app/(root)/dashboard/page.tsx` – Main dashboard after login.
- `src/app/(admin)/interviewerDashboard/page.tsx` – Interviewer-only dashboard.
- `src/components/` – Shared UI components (Navbar, MeetingRoom, MeetingModal, CodeEditor, etc.).
- `src/components/providers/` – Providers for Clerk + Convex, Stream, and theme.
- `src/hooks/` – Role and meeting related hooks (`useUserRole`, `useGetCalls`, etc.).
- `convex/` – Convex schema, queries, mutations, and webhooks (including Clerk sync).

### Getting Started (Local Development)

1. **Install dependencies**

   ```bash
   pnpm install
   # or
   npm install
   ```

2. **Set up environment variables**

   Create a `.env.local` file in the project root and provide the required keys:

   - Clerk:
     - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
     - `CLERK_JWT_ISSUER_DOMAIN`
     - `CLERK_WEBHOOK_SECRET`
   - Convex:
     - `NEXT_PUBLIC_CONVEX_URL`
   - Stream:
     - stream-related keys as required by your `StreamClientProvider` and actions.

3. **Run the dev server**

   ```bash
   pnpm dev
   # or
   npm run dev
   ```

4. **Open the app**

   Visit `http://localhost:3000` to see the **TalentWay** landing page.  
   - Use the **Login** / **Go to Dashboard** buttons to sign in via Clerk.
   - Once signed in, you’ll be redirected to `/dashboard`.

### Authentication & Routing Notes

- The root layout (`src/app/layout.tsx`) wraps the app in:
  - `ConvexClerkProvider` for Clerk + Convex integration.
  - `ThemeProvider` for dark/light mode.
  - `LayoutWrapper`, which:
    - Keeps `/` public.
    - Redirects signed-in users on `/` to `/dashboard`.
    - Protects other routes and sends unauthenticated users to Clerk sign-in.

- The Navbar shows:
  - **Login** button on the landing page when signed out.
  - **Dashboard button + user menu** when signed in.

### Scripts

- `pnpm dev` – Run the app in development mode.
- `pnpm build` – Build the production bundle.
- `pnpm start` – Start the production server.
- `pnpm lint` – Run ESLint.

### Deployment

- You can deploy TalentWay on any platform that supports Next.js 16 (e.g. Vercel).
- Ensure all required environment variables (Clerk, Convex, Stream) are configured in your deployment environment.

Once deployed, visitors hit the **public landing page**, sign in with Clerk, and are taken straight into their **role-aware dashboards** for running and reviewing coding interviews.
