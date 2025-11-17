# Step 1: Build the app
FROM node:22-alpine AS build

ENV CI=true

# Create app directory
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

COPY . .
RUN pnpm install --frozen-lockfile

# Build the Nuxt app
RUN pnpm build

# Step 2: Production image
FROM node:22-alpine

WORKDIR /app

# Copy only the build output and dependencies
COPY --from=build /app/.output ./.output
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json

EXPOSE 3000

# Run Nuxt in production mode
CMD ["node", ".output/server/index.mjs"]