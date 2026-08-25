import { defaultAdmins } from "./_lib/defaults.js";
import { ensureSchema, getStateValue, setStateValue } from "./_lib/turso.js";

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  await ensureSchema();

  const email = normalizeEmail(req.body?.email);
  const password = String(req.body?.password || "");

  if (!email || !password) {
    res.status(400).json({ ok: false, error: "Credenciales incompletas" });
    return;
  }

  const adminsRaw = await getStateValue("admins", defaultAdmins());
  const admins = Array.isArray(adminsRaw) ? adminsRaw : defaultAdmins();

  if (!Array.isArray(adminsRaw)) {
    await setStateValue("admins", defaultAdmins());
  }

  const found = admins.find((a) => normalizeEmail(a.email) === email && String(a.password || "") === password);
  if (!found) {
    res.status(401).json({ ok: false });
    return;
  }

  res.status(200).json({ ok: true });
}