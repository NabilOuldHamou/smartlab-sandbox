FROM node:20-alpine

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code and schema
COPY src ./src
COPY tsconfig.json ./
COPY prisma ./prisma

# Generate Prisma Client
RUN pnpm exec prisma generate

# Build the application
RUN pnpm build

# Copy entrypoint script
COPY entrypoint.sh ./
RUN chmod +x ./entrypoint.sh

EXPOSE 3001
EXPOSE 41234

# Set environment to production
ENV NODE_ENV=production

# Start the application
CMD ["./entrypoint.sh"]
