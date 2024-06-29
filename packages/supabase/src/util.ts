import path from "path";
import { fileURLToPath } from "url";

import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

export function loadEnv() {
  const result = dotenv.config({ path: path.join(__dirname, "..", ".env") });
  if (result.parsed == undefined)
    throw new Error("Cannot loaded environment variables file.");
}
