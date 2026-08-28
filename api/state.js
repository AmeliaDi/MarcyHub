import { defaultAdmins, defaultResources, defaultTasks } from "./_lib/defaults.js";
import { ensureSchema, getStateValue, setStateValue } from "./_lib/turso.js";
import { normalizeAdmins, normalizeResources, normalizeTasks } from "./_lib/state-normalizers.js";

export default async function handler(req, res) {
  if (req.method !== "GET" && req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  await ensureSchema();

  const fallbackTasks = defaultTasks();
  const fallbackResources = defaultResources();
  const fallbackAdmins = defaultAdmins();

  if (req.method === "GET") {
    const tasks = normalizeTasks(await getStateValue("tasks", fallbackTasks), fallbackTasks);
    const resources = normalizeResources(await getStateValue("resources", fallbackResources), fallbackResources);
    const admins = normalizeAdmins(await getStateValue("admins", fallbackAdmins), fallbackAdmins);

    await setStateValue("tasks", tasks);
    await setStateValue("resources", resources);
    await setStateValue("admins", admins);

    res.status(200).json({ tasks, resources, admins });
    return;
  }

  const body = req.body && typeof req.body === "object" ? req.body : {};
  const tasks = normalizeTasks(body.tasks, fallbackTasks);
  const resources = normalizeResources(body.resources, fallbackResources);
  const admins = normalizeAdmins(body.admins, fallbackAdmins);

  await setStateValue("tasks", tasks);
  await setStateValue("resources", resources);
  await setStateValue("admins", admins);

  res.status(200).json({ ok: true });
}