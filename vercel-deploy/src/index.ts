import express from "express";
import cors from "cors";
import * as z from "zod";
import StatusCode from "./statusCodes";
import simpleGit from "simple-git";
import { generateRandomId, getPathsFromIdFolder } from "./utils";
import path from "path";
import { uploadToS3 } from "./uploadToS3";
import { createClient } from "redis";

const publisher = createClient();

const app = express();

app.use(cors());
app.use(express.json());

const urlObjectSchema = z.object({ repoURL: z.string() });
app.post("/deploy", async (req, res) => {
  const resolve = urlObjectSchema.safeParse(req.body);

  if (!resolve.success) {
    res
      .status(StatusCode.BAD_REQUEST)
      .json({ success: false, message: "Please send a valid request." });
  } else {
    const id = generateRandomId();
    try {
      await simpleGit().clone(
        req.body.repoURL,
        path.join(__dirname, `../output/${id}`)
      );
      //
      const files = getPathsFromIdFolder(
        path.join(__dirname, `../output/${id}`)
      );

      files.forEach(async (localFilePath) => {
        try {
          const upload = await uploadToS3(
            `output/${id}` + localFilePath.split(`/output/${id}`)[1],
            localFilePath
          );
        } catch (err) {
          throw Error;
        }
      });

      publisher.lPush("build-queue", id);
      publisher.hSet("status", id, "uploaded");
      res.json({ success: true, message: "repo cloned", id });
    } catch (error) {
      console.log(error);
      res
        .status(200)
        .json({ success: false, message: "Unable to clone repo." });
    }
  }
});

app.get("/status", async (req, res) => {
  const id = req.query.id;
  let status;
  try {
    status = await publisher.hGet("status", id as string);
    res.json({ success: true, status });
  } catch (err) {
    console.log("Failed to get status, error: ", err);
    res.json({ success: false });
  }
});

app.listen(3000, async () => {
  console.log("listening on port 3000...");
  publisher.on("error", (err) => {
    console.log("redis is down...", err);
  });
  await publisher.connect();
});
