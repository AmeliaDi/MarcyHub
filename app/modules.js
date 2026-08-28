"use strict";

(function(global) {
  var HOLIDAYS = {
    "01-01": "Año Nuevo",
    "02-05": "Día de la Constitución",
    "03-21": "Natalicio de Benito Juárez",
    "05-01": "Día del Trabajo",
    "09-16": "Día de la Independencia",
    "11-20": "Día de la Revolución",
    "12-25": "Navidad"
  };

  function asDate(value) {
    if (value instanceof Date) return new Date(value.getTime());
    var date = new Date(value);
    if (Number.isNaN(date.getTime())) return new Date();
    return date;
  }

  function normalizeText(value, fallback) {
    if (typeof value !== "string") return fallback || "";
    var clean = value.trim();
    return clean || (fallback || "");
  }

  function safeIsoDate(value) {
    var date = new Date(value);
    if (Number.isNaN(date.getTime())) return new Date().toISOString();
    return date.toISOString();
  }

  function safeIsoDateOrEmpty(value) {
    if (!value) return "";
    var date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return date.toISOString();
  }

  function createLocalId(prefix) {
    return (prefix || "id") + "_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 8);
  }

  function normalizeEmail(email) {
    return String(email || "").trim().toLowerCase();
  }

  function inferDisplayName(email) {
    var clean = normalizeEmail(email);
    if (!clean) return "Admin";
    var alias = clean.split("@")[0] || "Admin";
    var parts = alias.split(/[._-]+/).filter(Boolean);
    if (!parts.length) return alias;
    return parts.map(function(p) {
      return p.charAt(0).toUpperCase() + p.slice(1);
    }).join(" ");
  }

  function resolveAuditActor(meta) {
    var m = meta || {};
    if (m.isAdmin) {
      return normalizeText(m.adminName, inferDisplayName(m.adminEmail));
    }
    return normalizeText(m.fallback, "Sistema");
  }

  function makeDate(offsetDays) {
    var dt = new Date();
    dt.setDate(dt.getDate() + offsetDays);
    return dt;
  }

  function fmtDate(date) {
    return new Date(date).toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" });
  }

  function fmtDateTime(date) {
    return asDate(date).toLocaleString("es-MX", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  function daysUntil(date) {
    var now = new Date();
    now.setHours(0, 0, 0, 0);
    var target = new Date(date);
    target.setHours(0, 0, 0, 0);
    return Math.round((target - now) / 86400000);
  }

  function getSemesterRange(now) {
    var year = now.getFullYear();
    var month = now.getMonth();
    if (month <= 5) {
      return {
        start: new Date(year, 0, 12, 0, 0, 0, 0),
        end: new Date(year, 5, 30, 23, 59, 59, 999)
      };
    }
    return {
      start: new Date(year, 7, 11, 0, 0, 0, 0),
      end: new Date(year, 11, 5, 23, 59, 59, 999)
    };
  }

  function getSemesterProgressPct(now) {
    var current = now instanceof Date ? now : new Date();
    var range = getSemesterRange(current);
    var totalMs = range.end.getTime() - range.start.getTime();
    if (totalMs <= 0) return 0;
    var elapsedMs = current.getTime() - range.start.getTime();
    var ratio = elapsedMs / totalMs;
    if (ratio < 0) ratio = 0;
    if (ratio > 1) ratio = 1;
    return Math.round(ratio * 100);
  }

  function getCycleWeekInfo(now) {
    var current = asDate(now);
    var range = getSemesterRange(current);
    var start = new Date(range.start);
    var end = new Date(range.end);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    var currentDay = new Date(current);
    currentDay.setHours(0, 0, 0, 0);
    var totalDays = Math.max(1, Math.floor((end.getTime() - start.getTime()) / 86400000) + 1);
    var totalWeeks = Math.max(1, Math.ceil(totalDays / 7));
    if (currentDay < start) {
      return { week: 0, totalWeeks: totalWeeks, weeksRemaining: totalWeeks, inRange: false };
    }
    if (currentDay > end) {
      return { week: totalWeeks, totalWeeks: totalWeeks, weeksRemaining: 0, inRange: false };
    }
    var elapsedDays = Math.floor((currentDay.getTime() - start.getTime()) / 86400000);
    var week = Math.min(totalWeeks, Math.floor(elapsedDays / 7) + 1);
    return {
      week: week,
      totalWeeks: totalWeeks,
      weeksRemaining: Math.max(totalWeeks - week, 0),
      inRange: true
    };
  }

  function getHolidayInfo(date) {
    var current = asDate(date);
    var key = String(current.getMonth() + 1).padStart(2, "0") + "-" + String(current.getDate()).padStart(2, "0");
    var name = HOLIDAYS[key] || "";
    if (!name) return null;
    var readableDate = current.toLocaleDateString("es-MX", { day: "numeric", month: "long" });
    return {
      key: key,
      name: name,
      date: readableDate,
      label: readableDate + " — " + name
    };
  }

  function normalizeTaskAttachment(rawAttachment, fallbackActor, fallbackDate) {
    if (!rawAttachment || typeof rawAttachment !== "object") return null;
    var url = normalizeText(rawAttachment.contentDataUrl || rawAttachment.url, "");
    if (!url) return null;
    return {
      id: normalizeText(rawAttachment.id, createLocalId("att")),
      name: normalizeText(rawAttachment.name, "adjunto.pdf"),
      mimeType: normalizeText(rawAttachment.mimeType, "application/pdf"),
      size: Number(rawAttachment.size) || 0,
      contentDataUrl: url,
      uploadedBy: normalizeText(rawAttachment.uploadedBy, fallbackActor || "Sistema"),
      uploadedAt: safeIsoDate(rawAttachment.uploadedAt || fallbackDate || new Date())
    };
  }

  function normalizeTaskAttachments(list, legacyFileData, fallbackActor, fallbackDate) {
    var normalized = [];
    if (Array.isArray(list)) {
      list.forEach(function(item) {
        var parsed = normalizeTaskAttachment(item, fallbackActor, fallbackDate);
        if (parsed) normalized.push(parsed);
      });
    }
    if (!normalized.length && legacyFileData && typeof legacyFileData === "object") {
      var legacy = normalizeTaskAttachment({
        id: createLocalId("att"),
        name: legacyFileData.name || "adjunto.pdf",
        mimeType: legacyFileData.mimeType || "application/pdf",
        size: legacyFileData.size || 0,
        contentDataUrl: legacyFileData.contentDataUrl || legacyFileData.url,
        uploadedBy: legacyFileData.uploadedBy,
        uploadedAt: legacyFileData.uploadedAt
      }, fallbackActor, fallbackDate);
      if (legacy) normalized.push(legacy);
    }
    return normalized;
  }

  function normalizeTaskLink(rawLink, fallbackActor, fallbackDate) {
    if (!rawLink || typeof rawLink !== "object") return null;
    var url = normalizeText(rawLink.url || rawLink.link, "");
    if (!/^https?:\/\//i.test(url)) return null;
    return {
      id: normalizeText(rawLink.id, createLocalId("lnk")),
      label: normalizeText(rawLink.label || rawLink.name, "Abrir enlace"),
      url: url,
      addedBy: normalizeText(rawLink.addedBy, fallbackActor || "Sistema"),
      addedAt: safeIsoDate(rawLink.addedAt || fallbackDate || new Date())
    };
  }

  function normalizeTaskLinks(list, fallbackActor, fallbackDate) {
    if (!Array.isArray(list)) return [];
    return list.map(function(item) {
      return normalizeTaskLink(item, fallbackActor, fallbackDate);
    }).filter(Boolean);
  }

  function buildTaskAttachmentFromFile(file, dataUrl, actor, nowIso) {
    return {
      id: createLocalId("att"),
      name: normalizeText(file && file.name, "adjunto.pdf"),
      mimeType: normalizeText(file && file.type, "application/pdf"),
      size: Number(file && file.size) || 0,
      contentDataUrl: dataUrl,
      uploadedBy: normalizeText(actor, "Sistema"),
      uploadedAt: safeIsoDate(nowIso || new Date())
    };
  }

  function fileToDataUrl(file) {
    return new Promise(function(resolve, reject) {
      var reader = new FileReader();
      reader.onload = function() {
        resolve(String(reader.result || ""));
      };
      reader.onerror = function() {
        reject(new Error("file_read_error"));
      };
      reader.readAsDataURL(file);
    });
  }

  function isPdfFile(file) {
    if (!file || !file.name) return false;
    var ext = String(file.name).split(".").pop().toLowerCase();
    return ext === "pdf";
  }

  function normalizeTask(rawTask, options) {
    var opts = options || {};
    var actor = resolveAuditActor(opts.audit || {});
    var nowIso = safeIsoDate(opts.now || new Date());
    var due = rawTask && rawTask.due ? safeIsoDate(rawTask.due) : nowIso;
    var createdAt = safeIsoDate(rawTask && rawTask.createdAt ? rawTask.createdAt : nowIso);
    var createdBy = normalizeText(rawTask && rawTask.createdBy, actor);
    var attachments = normalizeTaskAttachments(
      rawTask && rawTask.attachments,
      rawTask && rawTask.fileData,
      actor,
      createdAt
    );
    var links = normalizeTaskLinks(rawTask && rawTask.links, actor, createdAt);
    var deliveredAt = safeIsoDateOrEmpty(rawTask && rawTask.deliveredAt);
    return {
      id: Number(rawTask && rawTask.id) || 0,
      subjectClave: normalizeText(rawTask && rawTask.subjectClave, ""),
      title: normalizeText(rawTask && rawTask.title, ""),
      desc: normalizeText(rawTask && rawTask.desc, "Sin descripción."),
      due: due,
      completed: !!(rawTask && rawTask.completed),
      responsible: normalizeText(rawTask && rawTask.responsible, "Sin responsable"),
      deliveredAt: deliveredAt,
      deliveredBy: normalizeText(rawTask && rawTask.deliveredBy, ""),
      createdBy: createdBy,
      createdAt: createdAt,
      attachments: attachments,
      links: links,
      fileData: attachments.length
        ? {
            name: attachments[0].name,
            url: attachments[0].contentDataUrl,
            mimeType: attachments[0].mimeType,
            size: attachments[0].size,
            uploadedBy: attachments[0].uploadedBy,
            uploadedAt: attachments[0].uploadedAt
          }
        : null
    };
  }

  function normalizeTaskList(rawTasks, options) {
    if (!Array.isArray(rawTasks)) return [];
    return rawTasks.map(function(rawTask) {
      return normalizeTask(rawTask, options);
    }).filter(function(task) {
      return task.id > 0 && !!task.subjectClave && !!task.title;
    });
  }

  function serializeTaskForApi(task, options) {
    return normalizeTask(task, options);
  }

  function serializeTaskListForApi(taskList, options) {
    return normalizeTaskList(taskList, options);
  }

  function getTaskDayKey(date) {
    var d = new Date(date);
    if (isNaN(d.getTime())) return "";
    var map = ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"];
    return map[d.getDay()] || "";
  }

  function getTasksForSlot(taskList, subjectClave, slotDay) {
    var source = Array.isArray(taskList) ? taskList : [];
    var bySubject = source.filter(function(t) {
      return t && t.subjectClave === subjectClave;
    });
    var byDay = bySubject.filter(function(t) {
      return getTaskDayKey(t.due) === slotDay;
    });
    var scoped = byDay.length ? byDay : bySubject;
    return scoped.sort(function(a, b) {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      return new Date(a.due) - new Date(b.due);
    });
  }

  global.MarcyModules = {
    dates: {
      makeDate: makeDate,
      fmtDate: fmtDate,
      fmtDateTime: fmtDateTime,
      daysUntil: daysUntil,
      asDate: asDate,
      safeIsoDate: safeIsoDate,
      safeIsoDateOrEmpty: safeIsoDateOrEmpty
    },
    semester: {
      getRange: getSemesterRange,
      getProgressPct: getSemesterProgressPct,
      getWeekInfo: getCycleWeekInfo
    },
    users: {
      normalizeEmail: normalizeEmail,
      inferDisplayName: inferDisplayName,
      resolveAuditActor: resolveAuditActor
    },
    files: {
      isPdfFile: isPdfFile,
      fileToDataUrl: fileToDataUrl,
      buildTaskAttachmentFromFile: buildTaskAttachmentFromFile,
      normalizeTaskAttachment: normalizeTaskAttachment,
      normalizeTaskAttachments: normalizeTaskAttachments,
      normalizeTaskLink: normalizeTaskLink,
      normalizeTaskLinks: normalizeTaskLinks
    },
    tasks: {
      normalizeTask: normalizeTask,
      normalizeTaskList: normalizeTaskList,
      serializeTaskForApi: serializeTaskForApi,
      serializeTaskListForApi: serializeTaskListForApi
    },
    calendar: {
      getTaskDayKey: getTaskDayKey,
      getTasksForSlot: getTasksForSlot
    },
    holidays: {
      getHolidayInfo: getHolidayInfo
    }
  };
})(window);
