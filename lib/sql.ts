import { neon } from "@neondatabase/serverless";

let sql: ReturnType<typeof neon> | null = null;

export function getSql() {
  if (!sql) {
    const url = process.env.POSTGRES_URL?.trim();
    if (!url) {
      throw new Error("POSTGRES_URL is not configured.");
    }
    sql = neon(url);
  }
  return sql;
}
