import fs from "fs";
import { S3 } from "aws-sdk";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

type DataObject = {
  success: boolean;
  body?: S3.Body | undefined;
};

// here it seemed to work without the end point as well since i was using aws
const s3bucket = new S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  //endpoint: process.env.AWS_SIGN_IN_URL,
});

const bucketName = process.env.AWS_BUCKET_NAME!;

export default async function providePage(
  id: string,
  path: string
): Promise<DataObject> {
  console.log("Displaying page now...");

  return new Promise(async (resolve, reject) => {
    try {
      const key = `dist/${id}${path}`;

      const object = await s3bucket
        .getObject({ Bucket: bucketName, Key: key })
        .promise();
      resolve({ success: true, body: object.Body });
    } catch (err) {
      console.log("Unable to fetch the page. ", err);
      reject({ success: false });
    }
  });
}
