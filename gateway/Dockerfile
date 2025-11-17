FROM node:20-alpine

ENV CI=true

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY . .

# Fix line endings for the entrypoint script
RUN sed -i 's/\r$//' ./entrypoint.sh

# Install dependencies
RUN pnpm install --frozen-lockfile

# Generate Prisma Client
RUN pnpm exec prisma generate

# Build the application
RUN pnpm build

RUN chmod +x ./entrypoint.sh

EXPOSE 3001
EXPOSE 41234

# Set environment to production
ENV NODE_ENV=production

# Start the application
CMD ["./entrypoint.sh"]
