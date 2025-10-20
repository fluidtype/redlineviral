import { env, requireKey } from "@shared/env";

void env;

export const config = {
  redisUrl: requireKey("REDIS_URL"),
  bullPrefix: requireKey("BULLMQ_PREFIX"),
  supabaseUrl: requireKey("SUPABASE_URL"),
  databaseUrl: requireKey("DATABASE_URL"),
  workerJwtSecret: requireKey("WORKER_JWT_SECRET"),
  r2: {
    accountId: requireKey("R2_ACCOUNT_ID"),
    bucket: requireKey("R2_BUCKET"),
    accessKeyId: requireKey("R2_ACCESS_KEY_ID"),
    secretAccessKey: requireKey("R2_SECRET_ACCESS_KEY"),
  },
  ai: {
    openai: requireKey("OPENAI_API_KEY"),
    grok: requireKey("GROK_API_KEY"),
  },
};
