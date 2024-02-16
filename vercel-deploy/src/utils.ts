import fs from "fs";
import path from "path";

// i am using a 12 digit id
export function generateRandomId() {
  const subset = "1234567890abcdefghiklmnopqrstuvwxyz";

  const MAX_LEN = 12;
  let id = "";
  for (let i = 0; i < MAX_LEN; i++) {
    id += subset[Math.floor(Math.random() * subset.length)];
  }
  return id;
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
