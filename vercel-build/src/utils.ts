import { exec } from "child_process";
import path from "path";
import fs from "fs";

export function buildProject(id: string) {
  return new Promise((res) => {
    const process = exec(
      `cd ${path.join(
        __dirname,
        "../output/" + id
      )} && npm install && npm run build`
    );

    process.stdout?.on("data", (data) => {
      console.log("stdout: ", data);
    });

    process.stderr?.on("data", (err) => {
      console.log("stderr: ", err);
    });

    process.on("close", () => {
      res("");
    });
  });
}

export function getPathsFromIdFolder(folderPath: string) {
  let filePaths: string[] = [];
  const allFiles = fs.readdirSync(folderPath);

  for (const file of allFiles) {
    const name = path.join(folderPath, file);
    if (fs.statSync(name).isDirectory()) {
      filePaths = filePaths.concat(getPathsFromIdFolder(name));
    } else {
      filePaths.push(name);
    }
  }
  return filePaths;
}
