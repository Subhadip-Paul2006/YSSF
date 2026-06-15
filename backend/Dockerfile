FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate && npm run build

FROM node:20-alpine
WORKDIR /app

# Install only production dependencies in the final image.
COPY package*.json ./
RUN npm ci --omit=dev

# Build stage must have produced dist/ before this layer is reached.
COPY --from=builder /app/dist ./dist
COPY prisma ./prisma
COPY start.sh ./start.sh
RUN chmod +x ./start.sh && npx prisma generate

ENV NODE_ENV=production
ENV PORT=3001

USER node

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3001/api/health || exit 1

CMD ["sh", "./start.sh"]
