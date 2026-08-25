import { createClient } from "@libsql/client";

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url) {
  throw new Error("Falta TURSO_DATABASE_URL en variables de entorno");
}

export const client = createClient({
  url,
  authToken
});

export async function ensureSchema() {
  await client.execute(`
    CREATE TABLE IF NOT EXISTS app_state (
      state_key TEXT PRIMARY KEY,
      state_json TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);
}

export async function getStateValue(key, fallback) {
  const result = await client.execute({
    sql: "SELECT state_json FROM app_state WHERE state_key = ?1 LIMIT 1",
    args: [key]
  });
  if (!result.rows.length) return fallback;
  try {
    return JSON.parse(String(result.rows[0].state_json || ""));
  } catch (e) {
    return fallback;
  }
}

export async function setStateValue(key, value) {
  await client.execute({
    sql: "INSERT INTO app_state(state_key, state_json, updated_at) VALUES (?1, ?2, ?3) ON CONFLICT(state_key) DO UPDATE SET state_json = excluded.state_json, updated_at = excluded.updated_at",
    args: [key, JSON.stringify(value), new Date().toISOString()]
  });
}