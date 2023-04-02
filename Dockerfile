FROM node:18-alpine

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./

RUN pnpm install

COPY . .

EXPOSE ${SERVER_PORT}

RUN pnpm exec prisma generate

CMD ["pnpm", "run", "start:dev"]
