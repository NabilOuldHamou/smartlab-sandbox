# Gateway — Local Development

Quick start (typical)

1. Install dependencies

   ```bash
   pnpm install # RECOMMENDED
   ```

2. Environment

   - Copy example environment file and edit required variables

   ```
   cp .env.example .env
   ```

   - A docker compose file is provided with the database

   ```
   docker-compose up db -d
   ```

3. Database

   - Create the database schema

   ```
   pnpm dlx prisma db push
   ```

   - Generate the Prisma client

   ```
   pnpm dlx prisma generate
   ```

4. Start in development mode

   - Project usually exposes a dev script that enables hot reload

   ```
   pnpm dev
   ```
