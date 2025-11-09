FROM node:20-bullseye AS builder

RUN apt-get update && apt-get install -y \
    libvips-dev \
    libheif-dev \
    libde265-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

COPY . .
RUN npm run build

FROM node:20-bullseye AS runtime

WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

ENV NODE_ENV production
ENV PORT 3000

EXPOSE 3000
CMD ["node", "dist/main.js"]