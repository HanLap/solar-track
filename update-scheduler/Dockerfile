FROM node:lts-alpine3.18

WORKDIR /app

RUN npm install -g pnpm

# Files required by pnpm install
COPY package.json pnpm-lock.yaml ./


RUN pnpm install --frozen-lockfile

COPY main.js .

CMD [ "node", "main.js" ]
