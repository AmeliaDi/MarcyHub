import { defaultAdmins, defaultResources, defaultTasks } from "./_lib/defaults.js";
import { ensureSchema, getStateValue, setStateValue } from "./_lib/turso.js";

function safeIsoDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return new Date().toISOString();
  return date.toISOString();
}

function normalizeAdmins(admins) {
  if (!Array.isArray(admins)) return defaultAdmins();
  const clean = admins
    .filter((a) => a && typeof a.email === "string" && typeof a.password === "string")
    .map((a) => ({
      email: a.email.trim().toLowerCase(),
      password: String(a.password),
      createdAt: a.createdAt || ""
    }));
  return clean.length ? clean : defaultAdmins();
}

function normalizeTasks(tasks) {
  if (!Array.isArray(tasks)) return defaultTasks();
  return tasks
    .filter((t) => t && typeof t.subjectClave === "string" && typeof t.title === "string")
    .map((t) => ({
      id: Number(t.id) || 0,
      subjectClave: t.subjectClave,
      title: t.title,
      desc: typeof t.desc === "string" ? t.desc : "Sin descripción.",
      due: t.due ? safeIsoDate(t.due) : new Date().toISOString(),
      completed: !!t.completed,
      fileData: t.fileData || null
    }))
    .filter((t) => t.id > 0);
}

function normalizeResources(resources) {
  if (!Array.isArray(resources)) return defaultResources();
  return resources
    .filter((r) => r && typeof r.subjectClave === "string" && typeof r.title === "string")
    .map((r) => ({
      id: Number(r.id) || 0,
      subjectClave: r.subjectClave,
      type: r.type || "pdf",
      title: r.title,
      author: r.author || "",
      link: r.link || "",
      fileData: r.fileData || null,
      unit: r.unit || "General",
      uploadedBy: r.uploadedBy || "",
      uploadedAt: r.uploadedAt || ""
    }))
    .filter((r) => r.id > 0);
}

export default async function handler(req, res) {
  if (req.method !== "GET" && req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  await ensureSchema();

  if (req.method === "GET") {
    const tasks = normalizeTasks(await getStateValue("tasks", defaultTasks()));
    const resources = normalizeResources(await getStateValue("resources", defaultResources()));
    const admins = normalizeAdmins(await getStateValue("admins", defaultAdmins()));

    await setStateValue("tasks", tasks);
    await setStateValue("resources", resources);
    await setStateValue("admins", admins);

    res.status(200).json({ tasks, resources, admins });
    return;
  }

  const body = req.body && typeof req.body === "object" ? req.body : {};
  const tasks = normalizeTasks(body.tasks);
  const resources = normalizeResources(body.resources);
  const admins = normalizeAdmins(body.admins);

  await setStateValue("tasks", tasks);
  await setStateValue("resources", resources);
  await setStateValue("admins", admins);

  res.status(200).json({ ok: true });
}