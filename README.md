# SolarTrack

Collects metrics from SolarMax inverters and provides a UI to display them.

This Project was originally created because the software for my parents solar panels was helplessly outdated. To collect data it required a desktop app that needed to be open to collect data. SolarTrack can be deployed to a Raspberry Pi and thus continuously collect data without requiring an opened desktop client.


The logic for communicating with the inverters is based on [python-solarmax](https://github.com/bwurst/python-solarmax). Thank you so much for your work! You spared me the trouble of reverse engineering the protocoll myself.


## How to Deploy

requires docker with docker compose

```bash
docker compose -f docker-compose-prod.yml up -d
```

## How to Develop

Requirements:

- Node.js 24+
- pnpm
- docker compose

1. install dependencies:

```bash
pnpm i
```

2. start database:

```bash
docker compose up -d
```

3. switch to frontend directory

```
cd frontend
```

4. run migrations && start service

```bash
cd frontend
pnpm db:migrate
pnpm dev
```
