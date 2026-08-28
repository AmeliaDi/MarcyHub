function normalizeText(value, fallback = "") {
  if (typeof value !== "string") return fallback;
  const clean = value.trim();
  return clean || fallback;
}

function createId(prefix) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function safeIsoDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return new Date().toISOString();
  return date.toISOString();
}

export function safeIsoDateOrEmpty(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString();
}

export function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function inferAdminName(email) {
  const alias = normalizeEmail(email).split("@")[0] || "Admin";
  const parts = alias.split(/[._-]+/).filter(Boolean);
  if (!parts.length) return alias;
  return parts.map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
}

export function normalizeAdmins(admins, fallbackAdmins) {
  if (!Array.isArray(admins)) return fallbackAdmins;
  const clean = admins
    .filter((a) => a && typeof a.email === "string" && typeof a.password === "string")
    .map((a) => ({
      email: normalizeEmail(a.email),
      name: normalizeText(a.name, inferAdminName(a.email)),
      password: String(a.password),
      createdAt: normalizeText(a.createdAt, "")
    }))
    .filter((a) => !!a.email && !!a.password);
  return clean.length ? clean : fallbackAdmins;
}

function normalizeTaskAttachment(attachment, fallbackActor, fallbackDate) {
  if (!attachment || typeof attachment !== "object") return null;
  const contentDataUrl = normalizeText(attachment.contentDataUrl || attachment.url, "");
  if (!contentDataUrl) return null;
  return {
    id: normalizeText(attachment.id, createId("att")),
    name: normalizeText(attachment.name, "adjunto.pdf"),
    mimeType: normalizeText(attachment.mimeType, "application/pdf"),
    size: Number(attachment.size) || 0,
    contentDataUrl,
    uploadedBy: normalizeText(attachment.uploadedBy, fallbackActor),
    uploadedAt: safeIsoDate(attachment.uploadedAt || fallbackDate)
  };
}

function normalizeTaskAttachments(attachments, legacyFileData, fallbackActor, fallbackDate) {
  const normalized = [];
  if (Array.isArray(attachments)) {
    attachments.forEach((attachment) => {
      const parsed = normalizeTaskAttachment(attachment, fallbackActor, fallbackDate);
      if (parsed) normalized.push(parsed);
    });
  }
  if (!normalized.length && legacyFileData && typeof legacyFileData === "object") {
    const parsedLegacy = normalizeTaskAttachment(
      {
        id: createId("att"),
        name: legacyFileData.name || "adjunto.pdf",
        mimeType: legacyFileData.mimeType || "application/pdf",
        size: legacyFileData.size || 0,
        contentDataUrl: legacyFileData.contentDataUrl || legacyFileData.url,
        uploadedBy: legacyFileData.uploadedBy,
        uploadedAt: legacyFileData.uploadedAt
      },
      fallbackActor,
      fallbackDate
    );
    if (parsedLegacy) normalized.push(parsedLegacy);
  }
  return normalized;
}

function normalizeTaskLink(link, fallbackActor, fallbackDate) {
  if (!link || typeof link !== "object") return null;
  const url = normalizeText(link.url || link.link, "");
  if (!/^https?:\/\//i.test(url)) return null;
  return {
    id: normalizeText(link.id, createId("lnk")),
    label: normalizeText(link.label || link.name, "Abrir enlace"),
    url,
    addedBy: normalizeText(link.addedBy, fallbackActor),
    addedAt: safeIsoDate(link.addedAt || fallbackDate)
  };
}

function normalizeTaskLinks(links, fallbackActor, fallbackDate) {
  if (!Array.isArray(links)) return [];
  return links.map((link) => normalizeTaskLink(link, fallbackActor, fallbackDate)).filter(Boolean);
}

function normalizeTask(task) {
  const actor = normalizeText(task?.createdBy, "Sistema");
  const createdAt = safeIsoDate(task?.createdAt || new Date());
  const normalizedAttachments = normalizeTaskAttachments(task?.attachments, task?.fileData, actor, createdAt);
  const normalizedLinks = normalizeTaskLinks(task?.links, actor, createdAt);
  return {
    id: Number(task?.id) || 0,
    subjectClave: normalizeText(task?.subjectClave, ""),
    title: normalizeText(task?.title, ""),
    desc: normalizeText(task?.desc, "Sin descripción."),
    due: safeIsoDate(task?.due || new Date()),
    completed: !!task?.completed,
    responsible: normalizeText(task?.responsible, "Sin responsable"),
    deliveredAt: safeIsoDateOrEmpty(task?.deliveredAt),
    deliveredBy: normalizeText(task?.deliveredBy, ""),
    createdBy: actor,
    createdAt,
    attachments: normalizedAttachments,
    links: normalizedLinks,
    fileData: normalizedAttachments.length
      ? {
          name: normalizedAttachments[0].name,
          url: normalizedAttachments[0].contentDataUrl,
          mimeType: normalizedAttachments[0].mimeType,
          size: normalizedAttachments[0].size,
          uploadedBy: normalizedAttachments[0].uploadedBy,
          uploadedAt: normalizedAttachments[0].uploadedAt
        }
      : null
  };
}

export function normalizeTasks(tasks, fallbackTasks) {
  if (!Array.isArray(tasks)) {
    return Array.isArray(fallbackTasks) ? fallbackTasks.map((task) => normalizeTask(task)) : [];
  }
  const clean = tasks
    .map((task) => normalizeTask(task))
    .filter((task) => task.id > 0 && !!task.subjectClave && !!task.title);
  if (clean.length) return clean;
  return Array.isArray(fallbackTasks) ? fallbackTasks.map((task) => normalizeTask(task)) : [];
}

export function normalizeResources(resources, fallbackResources) {
  if (!Array.isArray(resources)) return fallbackResources;
  const clean = resources
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
  return clean.length ? clean : fallbackResources;
}