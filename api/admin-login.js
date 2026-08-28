import { defaultAdmins } from "./_lib/defaults.js";
import { ensureSchema, getStateValue, setStateValue } from "./_lib/turso.js";
import { normalizeAdmins, normalizeEmail } from "./_lib/state-normalizers.js";

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

  const fallbackAdmins = defaultAdmins();
  const adminsRaw = await getStateValue("admins", fallbackAdmins);
  const admins = normalizeAdmins(adminsRaw, fallbackAdmins);

  if (!Array.isArray(adminsRaw)) {
    await setStateValue("admins", admins);
  }

  const found = admins.find((a) => normalizeEmail(a.email) === email && String(a.password || "") === password);
  if (!found) {
    res.status(401).json({ ok: false });
    return;
  }

  res.status(200).json({
    ok: true,
    admin: {
      email: found.email,
      name: found.name || found.email
    }
  });
}