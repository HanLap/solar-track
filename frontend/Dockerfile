FROM node:lts-alpine3.18 AS build

WORKDIR /app

RUN npm install -g pnpm

# Files required by pnpm install
COPY package.json pnpm-lock.yaml ./


RUN pnpm install --frozen-lockfile

# Bundle app source
COPY . .

RUN pnpm run build

#
FROM node:lts-alpine3.18

WORKDIR /app

RUN npm install -g pnpm

# Files required by pnpm install
COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile --prod

COPY migrate.js ./
COPY migrations/ ./migrations/
COPY --from=build /app/build ./build 

EXPOSE 3000
CMD node migrate.js && node build/index.js


