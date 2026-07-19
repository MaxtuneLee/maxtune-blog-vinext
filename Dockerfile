# syntax=docker/dockerfile:1
# vinext (Next.js-on-Vite) production image, using the blessed self-hosting path:
# next.config.ts sets output: "standalone", so `vinext build` emits a self-
# contained bundle at dist/standalone/ (server.js + minimal node_modules).
# See https://github.com/cloudflare/vinext — "node dist/standalone/server.js".
#
# content/ is NOT in the bundle: posts are read from process.cwd()/content at
# request time, so it is copied next to server.js and node runs from /app.

FROM node:22-slim AS base
ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
RUN corepack enable

# --- build: full deps, emit dist/standalone/ ---
FROM base AS build
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
COPY . .
RUN pnpm build:vinext

# --- runner: just the standalone bundle + content ---
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=4321
COPY --from=build /app/dist/standalone ./
COPY --from=build /app/content ./content
EXPOSE 4321
CMD ["node", "server.js"]
