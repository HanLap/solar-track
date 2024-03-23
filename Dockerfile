FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS build
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run -r build
RUN pnpm deploy --filter=frontend --prod /prod/frontend
RUN pnpm deploy --filter=update-scheduler --prod /prod/update-scheduler

####
FROM base AS frontend
COPY --from=build /prod/frontend /prod/frontend
WORKDIR /prod/frontend
EXPOSE 8000
CMD node migrate.js && node build/index.js

####
FROM base AS update-scheduler
COPY --from=build /prod/update-scheduler /prod/update-scheduler
WORKDIR /prod/update-scheduler
CMD [ "node", "main.js" ]

####
FROM python:3.12.0-alpine3.18 as solarmax-service
WORKDIR /prod/solarmax-service
RUN python3 -m venv /opt/venv
COPY solarmax-service/requirements.txt .
RUN . /opt/venv/bin/activate && pip install -r requirements.txt
COPY ./solarmax-service/src ./src
EXPOSE 8000
CMD . /opt/venv/bin/activate && uvicorn src.main:app --host 0.0.0.0
