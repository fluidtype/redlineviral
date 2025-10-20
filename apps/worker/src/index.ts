import { config } from "./config";

console.log("Worker boot OK with prefix:", config.bullPrefix);
process.on("SIGTERM", () => process.exit(0));
