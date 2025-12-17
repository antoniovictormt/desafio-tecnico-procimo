# syntax=docker/dockerfile:1.18-labs

# -------- Production Builder --------
FROM node:lts AS builder

WORKDIR /app

# Copy manifests 
COPY package.json package-lock.json ./
COPY apps/web/package.json apps/web/
COPY --parents packages/*/package.json ./

# Install workspace deps
RUN npm install --legacy-peer-deps

# Copy in only what the Web needs
COPY apps/web apps/web
COPY packages packages

# Build the app 
RUN npm run build --workspace=apps/web

# -------- Production --------
FROM node:lts AS prod

WORKDIR /app

RUN apk add --no-cache curl

COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/public ./apps/web/public
COPY --from=builder /app/apps/web/.next/static ./apps/web/.next/static

CMD ["node", "apps/web/server.js"]

# -------- Development (with hot reload) --------
FROM node:lts AS dev

RUN apk add --no-cache curl

WORKDIR /app

CMD ["npm", "run", "dev", "--workspace=apps/web"]