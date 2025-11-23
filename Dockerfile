# Etapa 1: Construcción
FROM node:24.11-alpine3.22 AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Etapa 2: Ejecución (Imagen final ligera)
FROM node:24.11-alpine3.22 AS runner

WORKDIR /app
ENV NODE_ENV=production

# Crea un usuario para seguridad (no ejecutar como root)
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copia los archivos necesarios de la etapa de construcción
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000

CMD ["node", "server.js"]
