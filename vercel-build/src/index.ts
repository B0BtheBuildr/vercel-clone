import Redis from "ioredis";
import downloadS3Folder, { uploadToS3 } from "./aws";
import { buildProject, getPathsFromIdFolder } from "./utils";
import path from "path";

const redis = new Redis();
let errorCount = 0;

async function processQueue() {
  try {
    const item = await redis.rpop("build-queue");
    if (item !== null) {
      console.log("Received from queue: ", item);
      console.log("Initializing download.");

      await downloadS3Folder(item);
      console.log("Download complete");

      await buildProject(item);

      const files = getPathsFromIdFolder(
        path.join(__dirname, `../output/${item}/dist/`)
      );

      try {
        files.forEach(async (localFilePath) => {
          try {
            const upload = await uploadToS3(
              `dist/${item}` + localFilePath.split(`/output/${item}/dist`)[1],
              localFilePath
            );
          } catch (err) {
            throw Error;
          }
        });
        console.log("built and deployed.");
        redis.hset("status", item, "deployed");
      } catch (err) {
        console.log("unable to deploy ", err);
      }
    } else {
      console.log("empty queue");
    }
  } catch (err) {
    errorCount++;
    console.log("an error occurred: ", err);
  }
}

const process = setInterval(async () => {
  if (errorCount < 30) {
    await processQueue();
  } else {
    clearInterval(process);
    console.log("Exiting process due to too many errors...");
  }
}, 3000);
