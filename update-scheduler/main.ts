import { CronJob } from "npm:cron@2.3.1";

console.log("starting update scheduler");
const job = () =>
  new CronJob(
    Deno.env.CRON_PATTERN ?? "0 * * * * *",
    function () {
      console.log("querying solar max");
      fetch(`${Deno.env.API_PATH ?? "http://localhost:5173"}/api/measurement`);
    },
    null,
    false,
    "Europe/Berlin"
  );

job().start();
