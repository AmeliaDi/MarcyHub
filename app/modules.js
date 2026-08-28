"use strict";

(function(global) {
  function makeDate(offsetDays) {
    var dt = new Date();
    dt.setDate(dt.getDate() + offsetDays);
    return dt;
  }

  function fmtDate(date) {
    return new Date(date).toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" });
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

  global.MarcyModules = {
    dates: {
      makeDate: makeDate,
      fmtDate: fmtDate,
      daysUntil: daysUntil
    },
    semester: {
      getRange: getSemesterRange,
      getProgressPct: getSemesterProgressPct
    }
  };
})(window);
