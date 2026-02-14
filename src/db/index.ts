import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL!;
console.log(
  "🔌 DB Connection String:",
  connectionString.replace(/:[^:@]*@/, ":****@"),
); // Log masked URL

// Para migraciones y queries en el búnker
export const client = postgres(connectionString, {
  prepare: false,
  // debug: (connection, query, params, types) => {
  //   console.log('Query:', query);
  // }
});
export const db = drizzle(client, { schema });

// Test connection on startup
client`SELECT 1`
  .then(() => console.log("✅ DB Connected via postgres.js"))
  .catch((e) => console.error("❌ DB Connection Failed:", e));
