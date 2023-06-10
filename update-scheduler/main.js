import { CronJob } from "cron";

console.log("starting update scheduler");
const job = () =>
  new CronJob(
    process.env.CRON_PATTERN ?? "0 * * * * *",
    function () {
      console.log("querying solar max");
      fetch(`${process.env.API_PATH ?? "http://localhost:5173"}/api/measurement`);
    },
    null,
    false,
    "Europe/Berlin"
  );

job().start();
