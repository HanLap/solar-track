FROM denoland/deno:alpine-1.34.2

COPY main.ts .

RUN deno cache main.ts

CMD ["run", "--allow-net", "main.ts"]