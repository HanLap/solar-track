import { CronJob } from "cron";

console.log("starting update scheduler");
const job = () =>
  new CronJob(
    process.env.CRON_PATTERN ?? "0 * * * * *",
    async function () {
      console.log("querying solar max");
      try {

        await fetch(`${process.env.API_PATH ?? "http://localhost:5173"}/api/measurement`, {
          method: "POST",
        });

      } catch (error) {
        console.log('error wile querying solar max', error);
      }
    },
    null,
    false,
    "Europe/Berlin"
  );

job().start();
