import fs from "fs";
import { S3 } from "aws-sdk";
import dotenv from "dotenv";

dotenv.config();

// here it seemed to work without the end point as well since i was using aws
const s3bucket = new S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  //endpoint: process.env.AWS_SIGN_IN_URL,
});

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
