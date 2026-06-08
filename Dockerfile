# Deploy Railway — build sekali, node_modules production dari stage yang sama
FROM node:20-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --include=dev

COPY . .
RUN npm run build && npm prune --omit=dev

FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

COPY package.json package-lock.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
# Vite hanya untuk dev lokal — jangan ikut image production
RUN rm -f dist/vite-dev.js

RUN mkdir -p uploads/campaigns uploads/menu

EXPOSE 3000
CMD ["node", "dist/index.js"]
