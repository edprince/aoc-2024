let fs = require("fs/promises");
import * as path from "path";

export default async (file: string, callback: Function) => {
  try {
    const data = await fs.readFile(path.join(__dirname, `${file}.txt`), "utf8");
    callback(data);
  } catch (err) {
    console.error(err);
  }
};
