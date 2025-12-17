# syntax=docker/dockerfile:1.18-labs

# -------- Production Builder --------
FROM node:lts AS builder

WORKDIR /app

# Copy manifests 
COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/
COPY --parents packages/*/package.json ./

# Install workspace deps
RUN npm install --legacy-peer-deps

# Copy in only what the API needs
COPY apps/api apps/api
COPY packages packages

# Build the api (outputs to apps/api/dist)
RUN npm run build --workspace=apps/api

# -------- Production --------
FROM node:lts AS prod

WORKDIR /app

RUN apk add --no-cache curl

COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/package.json ./

CMD ["node", "dist/server.js"]

# -------- Dev (with hot reload) --------
FROM node:lts AS dev

RUN apk add --no-cache curl

WORKDIR /app

CMD ["npm", "run", "dev", "--workspace=apps/api"]