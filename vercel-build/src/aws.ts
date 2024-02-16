import fs from "fs";
import { S3 } from "aws-sdk";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

// here it seemed to work without the end point as well since i was using aws
const s3bucket = new S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  //endpoint: process.env.AWS_SIGN_IN_URL,
});

const bucketName = process.env.AWS_BUCKET_NAME!;

export default async function downloadS3Folder(id: string) {
  console.log("Downloading from bucket now.");

  try {
    const objects = await s3bucket
      .listObjectsV2({ Bucket: bucketName, Prefix: "output/" + id })
      .promise();

    if (!objects.Contents) throw Error;

    const downloadPromises = objects.Contents.map(async (object) => {
      return new Promise(async (res, rej) => {
        if (!object.Key) {
          res("");
          return;
        }

        const outputPath = path.join(__dirname, "../" + object.Key);

        const fileStream = fs.createWriteStream(outputPath);

        const dirName = path.dirname(outputPath);
        if (!fs.existsSync(dirName)) {
          fs.mkdirSync(dirName, { recursive: true });
        }

        s3bucket
          .getObject({ Bucket: bucketName, Key: object.Key })
          .createReadStream()
          .pipe(fileStream)
          .on("finish", () => {
            res("");
          });
      });
    });

    await Promise.all(downloadPromises);
  } catch (error) {
    console.log("Error downloading folder from S3: ", error);
  }
}

export async function uploadToS3(
  fileName: string,
  localFilePath: string
): Promise<any> {
  const readStream = fs.createReadStream(localFilePath);

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: fileName,
    Body: readStream,
  };

  return new Promise((res, rej) => {
    s3bucket.upload(params, (err: any, data: any) => {
      readStream.destroy();
      if (err) {
        console.log("upload failed, error:", err);
        return rej({ success: false, message: "There was an error." });
      }

      return res({ success: true, data });
    });
  });
}
