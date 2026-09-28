/* ---------- Constants ---------- */
const DEFAULTS = {
  ciclo: "BUILD THE NEXT", inicio: "2026-09-25", dias: 90,
  metas: { cal: 2800, calTol: 0.10, protMin: 106, protMax: 145, gym: 4, runsMin: 1, runsMax: 2, deepMin: 90, comercialMin: 5 },
  finanzas: { liquidezInicial: 1000, deudaInicial: 600, pagoDeuda: 300, gastosFijos: 350, gastoVariable: 450, restarDeuda: true },
  meses: {
    "2026-09": { ingMin: 2400, ingMax: 2500, ahMin: 1000, ahMax: 1000 },
    "2026-10": { ingMin: 3000, ingMax: null, ahMin: 1500, ahMax: 1500 },
    "2026-11": { ingMin: null, ingMax: null, ahMin: 1500, ahMax: 2000 },
    "2026-12": { ingMin: null, ingMax: null, ahMin: 1500, ahMax: 2000 }
  },
  semanal: {
    autos: { contenido: 3, leads: 10, seguimientos: 10, citas: 2, ventas: 1 },
    ia: { prospectos: 25, conversaciones: 5, problemas: 2, demos: 1 }
  },
  autosShare: 0.5,
  agenda: {
    "1": ["Upper", "Autos · deep work", "IA · bloque"],
    "2": ["Lower", "IA · deep work", "Autos · bloque"],
    "3": ["Upper", "Autos", "IA / revisión financiera"],
    "4": ["Lower", "IA", "Autos"],
    "5": ["Arms/Delts (opcional)", "Proyecto de mayor retorno"],
    "6": ["Run o descanso", "Trabajo concreto de proyecto"],
    "0": ["Easy run", "Revisión financiera 20 min", "Revisión semanal"]
  },
  bloqueTrabajo: "15:00–19:00",
  hitos: {}
};
const VIEWS = [
  ["panel", "Panel"], ["hoy", "Hoy"], ["finanzas", "Finanzas"], ["fisico", "Físico"],
  ["proyectos", "Proyectos"], ["semana", "Semana"], ["plan", "90 días"], ["ajustes", "Ajustes"]
];
const ICON = {
  panel: '<path d="M3 3h6v8H3zM11 3h6v5h-6zM11 10h6v7h-6zM3 13h6v4H3z"/>',
  hoy: '<circle cx="10" cy="10" r="7"/><path d="M10 6v4l3 2"/>',
  finanzas: '<path d="M3 15l4-5 3 3 7-8"/><path d="M13 5h4v4"/>',
  fisico: '<path d="M2 10h16M5 6v8M15 6v8M3 8v4M17 8v4"/>',
  proyectos: '<path d="M10 2l8 4-8 4-8-4z"/><path d="M2 10l8 4 8-4M2 14l8 4 8-4"/>',
  semana: '<rect x="3" y="4" width="14" height="13" rx="2"/><path d="M3 8h14M7 2v4M13 2v4"/>',
  plan: '<path d="M3 17V3M3 4h11l-2 3 2 3H3"/>',
  ajustes: '<circle cx="10" cy="10" r="2.5"/><path d="M10 2v3M10 15v3M2 10h3M15 10h3M4.3 4.3l2.1 2.1M13.6 13.6l2.1 2.1M4.3 15.7l2.1-2.1M13.6 6.4l2.1-2.1"/>',
  mas: '<circle cx="4" cy="10" r="1.5"/><circle cx="10" cy="10" r="1.5"/><circle cx="16" cy="10" r="1.5"/>',
  gasto: '<path d="M10 2v16M14 5.5c0-1.4-1.8-2.5-4-2.5s-4 1.1-4 2.5S7.8 8 10 8.8s4 1.3 4 2.9-1.8 2.8-4 2.8-4-1.1-4-2.6"/>',
  ingreso: '<path d="M10 17V4M5 9l5-5 5 5"/>',
  peso: '<rect x="3" y="3" width="14" height="14" rx="3"/><path d="M7 8a4 4 0 016 0l-3 3"/>',
  run: '<circle cx="12" cy="4" r="1.6"/><path d="M6 18l3-5 3 2 1 3M8 9l3-2 2 3 3 1M9 13l-3-1"/>',
  nutri: '<path d="M6 2v7a2 2 0 002 2v7M8 2v5M4 2v5M14 18V2c-2 1-3 4-3 7h3"/>',
  kpi: '<path d="M3 17h14M5 17V9M9 17V5M13 17v-6M17 17V7"/>'
};
const svgI = (k) => `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON[k] || ""}</svg>`;
const PHASES = [
  { id: "control", name: "CONTROL", w: [1, 2], desc: "Presupuesto + trackers + rutina", items: ["Línea base financiera", "Tracker diario en uso", "Consistencia de entrenamiento", "Sistemas de proyecto armados"] },
  { id: "consistencia", name: "CONSISTENCIA", w: [3, 4], desc: "Score ≥75/100 + sistemas funcionando", items: ["Score semanal ≥75", "Rutina estable", "Registro financiero confiable", "Cadencia de proyectos"] },
  { id: "traccion", name: "TRACCIÓN", w: [5, 8], desc: "Más leads + validación IA + capital creciendo", items: ["Capital creciendo", "Más leads de autos", "Validación IA", "Actividad de proyecto medible"] },
  { id: "expansion", name: "EXPANSIÓN", w: [9, 10], desc: "Brasil + optimizar autos + oferta IA", items: ["Brasil dentro del presupuesto", "Optimizar autos", "Refinar oferta IA"] },
  { id: "cierre", name: "CIERRE", w: [11, 13], desc: "Capital final + resultados + plan enero", items: ["Calcular capital final", "Revisar progreso físico", "Revisar tracción de proyectos", "Preparar plan de enero"] }
];
const TX_TYPES = [["gasto", "Gasto"], ["ingreso", "Ingreso"], ["deuda", "Pago de deuda"], ["transferencia", "Transferencia interna"], ["inversion", "Inversión"]];
const TX_CATS = ["Vivienda", "Comida", "Transporte", "Entretenimiento", "Compras", "Viaje", "Gym", "Educación", "Negocio", "Deuda", "Otro"];
const TX_CLASS = [["variable", "Variable"], ["fijo", "Fijo"], ["viaje", "Viaje"], ["proyecto", "Proyecto"]];
const WORKOUTS = ["Upper A", "Lower A", "Upper B", "Lower B", "Arms/Delts", "Custom"];
const AUTOS_K = [["contenido", "Contenido", "Videos publicados"], ["leads", "Leads", "Leads nuevos"], ["seguimientos", "Seguimientos", "Leads contactados"], ["citas", "Citas", "Citas agendadas"], ["ventas", "Ventas", "Autos vendidos"]];
const IA_K = [["prospectos", "Prospectos", "Contactos nuevos"], ["conversaciones", "Conversaciones", "Conversaciones reales"], ["problemas", "Problemas", "Problemas repetidos"], ["demos", "Demos", "Demos realizadas"], ["propuestas", "Propuestas", "Propuestas enviadas"], ["clientes", "Clientes", "Clientes nuevos"]];
const DOW = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
const MON = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
const MONL = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

/* ---------- Helpers ---------- */
const clone = (o) => JSON.parse(JSON.stringify(o ?? null));
const isObj = (v) => v && typeof v === "object" && !Array.isArray(v);
function mergeDeep(base, over) { if (!isObj(over)) return base; for (const k of Object.keys(over)) { if (isObj(over[k]) && isObj(base[k])) base[k] = mergeDeep(base[k], over[k]); else base[k] = clone(over[k]); } return base; }
const pad = (n) => String(n).padStart(2, "0");
const keyOf = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const parseK = (k) => { const [y, m, d] = k.split("-").map(Number); return new Date(y, m - 1, d); };
const addDays = (k, n) => { const d = parseK(k); d.setDate(d.getDate() + n); return keyOf(d); };
const diffDays = (a, b) => Math.round((parseK(b) - parseK(a)) / 864e5);
const todayKey = () => keyOf(new Date());
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const num = (v) => (v === "" || v == null || isNaN(Number(v)) ? null : Number(v));
const money = (n, dec = 0) => n == null || isNaN(n) ? "—" : (n < 0 ? "−" : "") + "$" + Math.abs(n).toLocaleString("en-US", { minimumFractionDigits: dec, maximumFractionDigits: dec });
const f1 = (n) => n == null || isNaN(n) ? "—" : n.toLocaleString("es", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const pct = (n) => n == null || !isFinite(n) ? "—" : Math.round(n * 100) + "%";
const sdiv = (a, b) => (b ? a / b : null);
const uid = () => Math.random().toString(36).slice(2, 10);
const fmtDate = (k, long) => { const d = parseK(k); return long ? `${DOW[d.getDay()]} ${d.getDate()} de ${MONL[d.getMonth()].toLowerCase()}` : `${d.getDate()} ${MON[d.getMonth()]}`; };
function daysBetween(a, b) { const out = []; for (let k = a; k <= b; k = addDays(k, 1)) out.push(k); return out; }

/* ---------- State ---------- */
const S = {
  cfg: clone(DEFAULTS), days: {}, reviews: {}, trips: {},
  view: "hoy", date: todayKey(), week: null, mode: "loading",
  loaded: { cfg: false, days: false, reviews: false, trips: false }, readOnly: false
};
import { createClient } from "@supabase/supabase-js";
const SB_URL = import.meta.env.VITE_SUPABASE_URL, SB_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const sb = SB_URL && SB_KEY ? createClient(SB_URL, SB_KEY) : null;
const D = (k) => S.days[k] || {};
const C = () => S.cfg;

/* ---------- Cycle ---------- */
const cycleEnd = () => addDays(C().inicio, C().dias - 1);
const dayNum = (k) => diffDays(C().inicio, k) + 1;
const numWeeks = () => Math.ceil(C().dias / 7);
const weekOf = (k) => clamp(Math.floor((dayNum(k) - 1) / 7) + 1, 1, numWeeks());
const weekRange = (n) => { const a = addDays(C().inicio, 7 * (n - 1)); let b = addDays(a, 6); if (b > cycleEnd()) b = cycleEnd(); return [a, b]; };
const phaseOfWeek = (n) => PHASES.find((p) => n >= p.w[0] && n <= p.w[1]) || PHASES[PHASES.length - 1];
function curDay() { return clamp(dayNum(todayKey()), 1, C().dias); }
function curWeek() { return weekOf(todayKey() < C().inicio ? C().inicio : todayKey() > cycleEnd() ? cycleEnd() : todayKey()); }

/* ---------- Daily scoring ---------- */
function commercialCount(d) { return (d.comercial || 0) + (d.autos?.seguimientos || 0) + (d.ia?.prospectos || 0); }
function nutriState(d) {
  const m = C().metas;
  if (d.cal == null && d.prot == null) return null;
  const calOk = d.cal != null && Math.abs(d.cal - m.cal) <= m.cal * m.calTol;
  const protOk = d.prot != null && d.prot >= m.protMin;
  return calOk && protOk ? "good" : calOk || protOk ? "warn" : "bad";
}
function planSet(d) { return (d.manana || []).some((x) => x && x.trim()); }
function expensesLogged(d) { return (d.tx || []).length > 0 || !!d.sinGastos; }
function scoreCats(k) {
  const d = D(k), m = C().metas, com = commercialCount(d), ns = nutriState(d);
  return [
    { id: "train", label: "Entrenamiento / run", ok: !!(d.workout || d.run), rule: "Sesión de gym o run completado", detail: d.workout ? d.workout.tipo : d.run ? (d.run.km ? `Run · ${f1(d.run.km)} km` : "Run hecho") : "Pendiente" },
    { id: "deep", label: "Deep work", ok: (d.deepMin || 0) >= m.deepMin, rule: `Bloque enfocado de proyecto ≥ ${m.deepMin} min`, detail: `${d.deepMin || 0} / ${m.deepMin} min` },
    { id: "com", label: "Acción comercial", ok: com >= m.comercialMin, rule: `≥ ${m.comercialMin} prospectos o seguimientos`, detail: `${com} / ${m.comercialMin}` },
    { id: "nut", label: "Nutrición", ok: ns === "good", rule: `${m.cal.toLocaleString("en-US")} kcal ±${Math.round(m.calTol * 100)}% · proteína ≥ ${m.protMin} g`, detail: ns ? `${d.cal ?? "—"} kcal · ${d.prot ?? "—"} g` : "Sin registrar" },
    { id: "money", label: "Dinero / orden", ok: expensesLogged(d) && planSet(d), rule: "Gasto registrado + plan del día siguiente", detail: `${expensesLogged(d) ? "Gastos ✓" : "Gastos pendientes"} · ${planSet(d) ? "Mañana ✓" : "Mañana pendiente"}` }
  ];
}
const dayScore = (k) => scoreCats(k).filter((c) => c.ok).length * 2;
function dayMsg(s, hasData) {
  if (!hasData) return "Día en blanco. Empieza por lo que ya hiciste.";
  if (s === 10) return "Ejecución perfecta hoy. Protege el impulso.";
  if (s >= 8) return "Día fuerte. Un pequeño hueco. Sigue avanzando.";
  if (s >= 5) return "Día promedio. Mañana, simplifica y ejecuta lo básico.";
  return "Reset. Un buen día puede reiniciar el sistema.";
}
const hasDayData = (k) => { const d = S.days[k]; return !!d && Object.keys(d).some((x) => x !== "date"); };

/* ---------- Money ---------- */
function allTx() { const out = []; for (const [k, d] of Object.entries(S.days)) for (const t of d.tx || []) out.push({ ...t, date: k }); return out.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0)); }
function sumMoney(keys) {
  const set = new Set(keys); let inc = 0, exp = 0, debt = 0, inv = 0; const byClass = { fijo: 0, variable: 0, viaje: 0, proyecto: 0 };
  for (const k of set) for (const t of D(k).tx || []) {
    const m = Number(t.monto) || 0;
    if (t.tipo === "ingreso") inc += m;
    else if (t.tipo === "gasto") { exp += m; byClass[t.clase || "variable"] = (byClass[t.clase || "variable"] || 0) + m; }
    else if (t.tipo === "deuda") debt += m;
    else if (t.tipo === "inversion") inv += m;
  }
  return { inc, exp, debt, inv, sav: inc - exp - debt, byClass };
}
function finState(uptoKey) {
  const f = C().finanzas; let inc = 0, exp = 0, debt = 0, inv = 0;
  for (const [k, d] of Object.entries(S.days)) { if (uptoKey && k > uptoKey) continue; for (const t of d.tx || []) { const m = Number(t.monto) || 0; if (t.tipo === "ingreso") inc += m; else if (t.tipo === "gasto") exp += m; else if (t.tipo === "deuda") debt += m; else if (t.tipo === "inversion") inv += m; } }
  const liquidez = f.liquidezInicial + inc - exp - debt - inv;
  const deuda = Math.max(0, f.deudaInicial - debt);
  const capital = liquidez + inv - (f.restarDeuda ? deuda : 0);
  return { liquidez, deuda, invertido: inv, capital };
}
function monthPlan(ym) { const p = C().meses[ym]; if (!p) return null; const ah = p.ahMin != null && p.ahMax != null ? (p.ahMin + p.ahMax) / 2 : p.ahMin ?? p.ahMax; return { ...p, ah }; }
function dailySavingsTarget(k) { const ym = k.slice(0, 7), p = monthPlan(ym); if (!p || p.ah == null) return null; const d = parseK(k); const dim = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate(); return p.ah / dim; }
function savingsTargetFor(keys) { let t = 0, any = false; for (const k of keys) { const v = dailySavingsTarget(k); if (v != null) { t += v; any = true; } } return any ? t : null; }
function capitalStart() { return finState(addDays(C().inicio, -1)).capital; }
function capitalTarget() { const t = savingsTargetFor(daysBetween(C().inicio, cycleEnd())); return t == null ? null : capitalStart() + t; }
function forecast() {
  const t = todayKey(), elapsed = clamp(dayNum(t), 0, C().dias), remaining = C().dias - elapsed;
  const now = finState().capital;
  const txDays = Object.entries(S.days).filter(([k, d]) => k >= C().inicio && k <= t && (d.tx || []).length).length;
  if (elapsed < 7 || txDays < 5) return { ready: false, elapsed, txDays, now };
  const rate = (now - capitalStart()) / elapsed;
  const cons = rate > 0 ? rate * 0.7 : rate * 1.3, high = rate > 0 ? rate * 1.25 : rate * 0.7;
  return { ready: true, rate, now, remaining, cons: now + cons * remaining, base: now + rate * remaining, high: now + high * remaining };
}

/* ---------- Weekly ---------- */
function weekData(n) {
  const [a, b] = weekRange(n), ks = daysBetween(a, b), t = todayKey();
  let gym = 0, runs = 0, km = 0, expDays = 0, nutOK = 0, nutLogged = 0, meas = false, ws = [], waist = null, deepDays = 0, planned = false, scores = [];
  const au = { contenido: 0, leads: 0, seguimientos: 0, citas: 0, ventas: 0, utilidad: 0 }, ia = { prospectos: 0, conversaciones: 0, problemas: 0, demos: 0, propuestas: 0, clientes: 0, mrr: null };
  for (const k of ks) {
    const d = D(k);
    if (d.workout) gym++;
    if (d.run) { runs++; km += Number(d.run.km) || 0; }
    if (expensesLogged(d)) expDays++;
    const ns = nutriState(d); if (ns) nutLogged++; if (ns === "good") nutOK++;
    if (d.peso != null) { ws.push(d.peso); meas = true; }
    if (d.cintura != null) { waist = d.cintura; meas = true; }
    if ((d.deepMin || 0) >= C().metas.deepMin) deepDays++;
    if ((d.prioridades || []).some((x) => x && x.trim())) planned = true;
    for (const [kk] of AUTOS_K) au[kk] += Number(d.autos?.[kk]) || 0;
    au.utilidad += Number(d.autos?.utilidad) || 0;
    for (const [kk] of IA_K) ia[kk] += Number(d.ia?.[kk]) || 0;
    if (d.ia?.mrr != null) ia.mrr = d.ia.mrr;
    if (k <= t && hasDayData(k)) scores.push(dayScore(k));
  }
  const prev = S.reviews["w" + pad(n - 1)];
  if (prev && (prev.prioridades || []).some((x) => x && x.trim())) planned = true;
  const m = sumMoney(ks);
  return { n, a, b, ks, len: ks.length, ...m, gym, runs, km, expDays, nutOK, nutLogged, meas, wAvg: ws.length ? ws.reduce((x, y) => x + y, 0) / ws.length : null, waist, deepDays, planned, au, ia, review: S.reviews["w" + pad(n)], savT: savingsTargetFor(ks), dayAvg: scores.length ? scores.reduce((x, y) => x + y, 0) / scores.length : null, started: a <= t };
}
function weekScore(w) {
  const c = C(), L = w.len, ta = c.semanal.autos, ti = c.semanal.ia, rv = !!w.review;
  const P = (v, max) => Math.round(v * max * 10) / 10;
  const items = {
    fin: [
      ["Gastos registrados", P(clamp(w.expDays / L), 10), 10, `${w.expDays}/${L} días`],
      ["Ahorro objetivo", w.savT ? P(clamp(w.sav / w.savT), 15) : 0, 15, w.savT ? `${money(w.sav)} / ${money(w.savT)}` : "Sin objetivo del mes"],
      ["Revisión financiera", rv ? 5 : 0, 5, rv ? "Hecha" : "Pendiente"]
    ],
    fis: [
      [`Gym ${c.metas.gym} sesiones`, P(clamp(w.gym / c.metas.gym), 12), 12, `${w.gym}/${c.metas.gym}`],
      [`Runs ${c.metas.runsMin}–${c.metas.runsMax}`, w.runs >= c.metas.runsMin ? 5 : 0, 5, `${w.runs}/${c.metas.runsMax}`],
      ["Nutrición en rango", P(clamp(w.nutOK / L), 5), 5, `${w.nutOK}/${L} días`],
      ["Peso / cintura medidos", w.meas ? 3 : 0, 3, w.meas ? "Sí" : "No"]
    ],
    aut: [
      ["Contenido", P(clamp(w.au.contenido / (ta.contenido || 1)), 5), 5, `${w.au.contenido}/${ta.contenido}`],
      ["Leads", P(clamp(w.au.leads / (ta.leads || 1)), 5), 5, `${w.au.leads}/${ta.leads}`],
      ["Seguimientos", P(clamp(w.au.seguimientos / (ta.seguimientos || 1)), 5), 5, `${w.au.seguimientos}/${ta.seguimientos}`],
      ["Revisión de KPIs", rv ? 5 : 0, 5, rv ? "Hecha" : "Pendiente"]
    ],
    ia: [
      ["Prospección", P(clamp(w.ia.prospectos / (ti.prospectos || 1)), 7), 7, `${w.ia.prospectos}/${ti.prospectos}`],
      ["Conversaciones", P(clamp(w.ia.conversaciones / (ti.conversaciones || 1)), 5), 5, `${w.ia.conversaciones}/${ti.conversaciones}`],
      ["Problemas validados", P(clamp(w.ia.problemas / (ti.problemas || 1)), 4), 4, `${w.ia.problemas}/${ti.problemas}`],
      ["Demo / propuesta / cliente", P(clamp((w.ia.demos + w.ia.propuestas + w.ia.clientes) / (ti.demos || 1)), 4), 4, `${w.ia.demos + w.ia.propuestas + w.ia.clientes}/${ti.demos}`]
    ],
    ord: [
      ["Plan semanal", w.planned ? 2 : 0, 2, w.planned ? "Top 3 definido" : "Sin top 3"],
      ["Revisión del domingo", rv ? 3 : 0, 3, rv ? "Hecha" : "Pendiente"]
    ]
  };
  const pillars = [["fin", "Finanzas", 30], ["fis", "Físico", 25], ["aut", "Autos", 20], ["ia", "IA", 20], ["ord", "Orden", 5]].map(([id, name, max]) => {
    const pts = items[id].reduce((s, x) => s + x[1], 0);
    return { id, name, max, pts, items: items[id] };
  });
  const total = Math.round(pillars.reduce((s, p) => s + p.pts, 0));
  return { total, pillars };
}
const statusOf = (s) => (s >= 85 ? "good" : s >= 70 ? "warn" : "bad");
const statusLabel = (s) => (s >= 85 ? "En camino" : s >= 70 ? "Necesita atención" : "Reset");
const statusMsg = (s) => (s >= 85 ? "Mantén el sistema estable. No añadas metas innecesarias." : s >= 70 ? "Identifica el pilar más débil y corrígelo la próxima semana." : "Reduce la complejidad. Vuelve a lo básico.");
function weakest(ws) { return ws.pillars.slice().sort((a, b) => a.pts / a.max - b.pts / b.max)[0]; }

/* ---------- Physical ---------- */
function weights() { return Object.entries(S.days).filter(([, d]) => d.peso != null).map(([k, d]) => [k, d.peso]).sort((a, b) => (a[0] < b[0] ? -1 : 1)); }
function avgWeightAt(k, span = 7) { const a = addDays(k, -(span - 1)); const v = weights().filter(([x]) => x >= a && x <= k).map((x) => x[1]); return v.length ? v.reduce((s, x) => s + x, 0) / v.length : null; }
function lastWaist() { const e = Object.entries(S.days).filter(([, d]) => d.cintura != null).sort((a, b) => (a[0] < b[0] ? 1 : -1)); return e.length ? { k: e[0][0], v: e[0][1].cintura } : null; }

/* ---------- Streaks ---------- */
function streak(test) {
  const t = todayKey(), start = C().inicio; let cur = 0, best = 0, run = 0;
  const end = t < cycleEnd() ? t : cycleEnd();
  for (let k = start; k <= end; k = addDays(k, 1)) { if (test(k)) { run++; best = Math.max(best, run); } else run = 0; }
  let k = end; if (!test(k)) k = addDays(k, -1);
  while (k >= start && test(k)) { cur++; k = addDays(k, -1); }
  return { cur, best };
}

/* ---------- Priorities ---------- */
function effectivePriorities(k) {
  const d = D(k); if ((d.prioridades || []).some((x) => x && x.trim())) return { list: d.prioridades, src: "hoy" };
  const y = D(addDays(k, -1)); if (planSet(y)) return { list: y.manana, src: "ayer" };
  const n = weekOf(k), [a] = weekRange(n), rv = S.reviews["w" + pad(n - 1)];
  if (rv && (rv.prioridades || []).some(Boolean)) return { list: rv.prioridades, src: "semana" };
  return { list: ["", "", ""], src: "" };
}

/* ---------- Persistence (Supabase) ---------- */
// Each key gets its own queue so writes to the same row never overlap.
const queues = {};
let pending = 0;
function enqueue(key, job) {
  pending++; setSync();
  queues[key] = (queues[key] || Promise.resolve())
    .then(async () => { const { error } = await job(); if (error) throw error; })
    .catch((e) => { console.error(e); toast("No se pudo guardar. Revisa tu conexión e inténtalo otra vez."); })
    .finally(() => { pending--; setSync(); });
  return queues[key];
}
const uidOf = () => S.user?.id;
function upDay(k, fn) {
  const before = S.days[k]?.tx || [];
  const d = clone(S.days[k]) || { date: k }; fn(d); d.date = k; S.days[k] = d; render();
  const { tx = [], date, ...data } = d;
  enqueue("day:" + k, () => sb.from("daily_logs").upsert({ user_id: uidOf(), date: k, data, updated_at: new Date().toISOString() }, { onConflict: "user_id,date" }));
  const ids = new Set(tx.map((t) => t.id)), old = new Set(before.map((t) => t.id));
  for (const t of tx) if (!old.has(t.id)) enqueue("tx:" + t.id, () => sb.from("transactions").insert({ id: t.id, user_id: uidOf(), date: k, tipo: t.tipo, monto: t.monto, cat: t.cat || null, clase: t.clase || null, descripcion: t.desc || null, trip_id: t.trip || null }));
  for (const t of before) if (!ids.has(t.id)) enqueue("tx:" + t.id, () => sb.from("transactions").delete().eq("id", t.id));
}
function saveCfg(next) { S.cfg = mergeDeep(clone(DEFAULTS), next); render(); enqueue("cfg", () => sb.from("settings").upsert({ user_id: uidOf(), config: clone(S.cfg), updated_at: new Date().toISOString() })); }
function saveTrip(id, doc) { enqueue("trip:" + id, () => sb.from("trips").upsert({ user_id: uidOf(), id, data: doc }, { onConflict: "user_id,id" })); }
function deleteTrip(id) { enqueue("trip:" + id, () => sb.from("trips").delete().eq("id", id)); }
function saveReview(n, doc) { enqueue("rv:" + n, () => sb.from("weekly_reviews").upsert({ user_id: uidOf(), semana: n, score: doc.score, data: doc }, { onConflict: "user_id,semana" })); }

const DEFAULT_TRIPS = {
  brasil: { destino: "Brasil", proposito: "Mixto", inicio: null, fin: null, cuando: "Semanas 9–10 · Expansión", presupuesto: 1000, capitalMin: null, condicion: "Solo si es financieramente compatible", decision: "pendiente", estado: "planeado" },
  dubai: { destino: "Dubái (regreso)", proposito: "Mixto", inicio: null, fin: null, cuando: "Condicional", presupuesto: null, capitalMin: null, condicion: "Visa aprobada + calendario académico + capital suficiente. Presupuesto mensual ~$2,000 (renta ~$1,450)", decision: "pendiente", estado: "planeado" }
};
async function loadAll() {
  const [st, dl, tx, rv, tr] = await Promise.all([
    sb.from("settings").select("config").maybeSingle(),
    sb.from("daily_logs").select("date,data"),
    sb.from("transactions").select("*").order("created_at"),
    sb.from("weekly_reviews").select("semana,data"),
    sb.from("trips").select("id,data")
  ]);
  const err = [st, dl, tx, rv, tr].find((r) => r.error);
  if (err) throw err.error;
  if (!st.data) {
    // First sign-in: create this user's settings and the plan's default trips.
    const seeded = await Promise.all([
      sb.from("settings").insert({ user_id: uidOf(), config: clone(DEFAULTS) }),
      sb.from("trips").insert(Object.entries(DEFAULT_TRIPS).map(([id, data]) => ({ user_id: uidOf(), id, data })))
    ]);
    const e = seeded.find((r) => r.error); if (e) throw e.error;
    return loadAll();
  }
  const days = {};
  for (const r of dl.data) days[r.date] = { ...r.data, date: r.date, tx: [] };
  for (const t of tx.data) {
    const d = days[t.date] || (days[t.date] = { date: t.date, tx: [] });
    d.tx.push({ id: t.id, tipo: t.tipo, monto: Number(t.monto), cat: t.cat, clase: t.clase, desc: t.descripcion || "", trip: t.trip_id });
  }
  S.cfg = mergeDeep(clone(DEFAULTS), st.data.config || {});
  S.days = days;
  S.reviews = Object.fromEntries(rv.data.map((r) => ["w" + pad(r.semana), r.data]));
  S.trips = Object.fromEntries(tr.data.map((r) => [r.id, r.data]));
}
function setSync() {
  const sc = document.getElementById("sync"); if (!sc) return;
  sc.className = "syncchip " + (S.mode === "db" ? (pending ? "" : "ok") : "local");
  sc.querySelector("span").textContent = S.mode === "loading" ? "Conectando" : S.mode === "error" ? "Sin conexión" : pending ? "Guardando…" : "Sincronizado";
}

/* ---------- Rendering infra ---------- */
let pendingRender = false;
function render() {
  const a = document.activeElement;
  if (a && document.getElementById("view").contains(a) && /INPUT|TEXTAREA|SELECT/.test(a.tagName) && a.type !== "checkbox") { pendingRender = true; return; }
  pendingRender = false;
  renderNav();
  const v = document.getElementById("view");
  const fn = { panel: vPanel, hoy: vHoy, finanzas: vFin, fisico: vFis, proyectos: vProj, semana: vSemana, plan: vPlan, ajustes: vAjustes }[S.view] || vHoy;
  v.innerHTML = fn();
}
document.addEventListener("focusout", () => setTimeout(() => { if (pendingRender) render(); }, 0));
function renderNav() {
  const cur = S.view;
  document.getElementById("sidenav").innerHTML = VIEWS.map(([id, l]) => `<button data-act="nav" data-v="${id}" ${cur === id ? 'aria-current="page"' : ""}>${svgI(id)}${l}</button>`).join("");
  const mob = [["panel", "Panel"], ["hoy", "Hoy"], ["finanzas", "Finanzas"], ["fisico", "Físico"], ["proyectos", "Proyectos"]];
  const inMore = ["semana", "plan", "ajustes"].includes(cur);
  document.getElementById("bottomnav").innerHTML = mob.map(([id, l]) => `<button data-act="nav" data-v="${id}" ${cur === id ? 'aria-current="page"' : ""}>${svgI(id)}${l}</button>`).join("") + `<button data-act="more" ${inMore ? 'aria-current="page"' : ""}>${svgI("mas")}Más</button>`;
  const dn = dayNum(todayKey()), inC = dn >= 1 && dn <= C().dias;
  const meta = inC ? `Día ${dn} / ${C().dias}` : dn < 1 ? `Empieza en ${1 - dn} d` : "Ciclo cerrado";
  document.getElementById("topMeta").textContent = meta;
  document.getElementById("cycleMini").innerHTML = `<div class="eyebrow">${esc(C().ciclo)}</div><div class="num" style="font-size:22px;margin-top:4px">${meta}</div><div class="muted small">${fmtDate(C().inicio)} → ${fmtDate(cycleEnd())}</div>`;
  setSync();
}
function go(v) { S.view = v; try { history.replaceState(null, "", "#" + v); } catch (e) {} closeSheet(); render(); window.scrollTo(0, 0); }
function toast(msg) { const t = document.getElementById("toast"); t.textContent = msg; t.hidden = false; clearTimeout(toast.t); toast.t = setTimeout(() => (t.hidden = true), 2600); }
const W = () => Math.max(300, Math.min(1080, (document.getElementById("view")?.clientWidth || 700)));
const chartW = (cols) => (window.innerWidth <= 860 ? W() - 38 : Math.floor((W() - 16 * (cols - 1)) / cols) - 38);

function meter(label, v, max, valTxt, cls) { const p = max ? clamp(v / max) * 100 : 0; return `<div class="meter"><span class="l">${esc(label)}</span><span class="v">${valTxt}</span><div class="bar"><i class="${cls || ""}" style="width:${p}%"></i></div></div>`; }
function pill(state, txt) { return `<span class="pill ${state}"><i></i>${esc(txt)}</span>`; }
function kpi(label, val, detail, extra = "") { return `<div class="kpi"><span class="eyebrow">${label}</span><span class="v num">${val}</span>${detail ? `<span class="d">${detail}</span>` : ""}${extra}</div>`; }

/* ---------- Charts ---------- */
function niceStep(r) { const p = Math.pow(10, Math.floor(Math.log10(r || 1))); const m = r / p; return (m <= 1 ? 1 : m <= 2 ? 2 : m <= 5 ? 5 : 10) * p; }
function lineChart({ w = 600, h = 200, xMax, series, yFmt = (v) => v, xLabels = [], yMinForce, yMaxForce }) {
  const all = series.flatMap((s) => s.pts.map((p) => p[1])).filter((v) => v != null);
  if (!all.length) return "";
  let lo = Math.min(...all), hi = Math.max(...all);
  if (yMinForce != null) lo = Math.min(lo, yMinForce); if (yMaxForce != null) hi = Math.max(hi, yMaxForce);
  if (lo === hi) { lo -= 1; hi += 1; }
  const st = niceStep((hi - lo) / 4); lo = Math.floor(lo / st) * st; hi = Math.ceil(hi / st) * st;
  const L = 52, R = 14, T = 10, B = 24, iw = w - L - R, ih = h - T - B;
  const X = (x) => L + (iw * x) / xMax, Y = (y) => T + ih * (1 - (y - lo) / (hi - lo));
  let g = "";
  for (let v = lo; v <= hi + st / 2; v += st) g += `<line class="grid-l" x1="${L}" x2="${w - R}" y1="${Y(v)}" y2="${Y(v)}"/><text x="${L - 8}" y="${Y(v) + 3.5}" text-anchor="end">${yFmt(v)}</text>`;
  for (const [x, t] of xLabels) g += `<text x="${X(x)}" y="${h - 6}" text-anchor="middle">${t}</text>`;
  for (const s of series) {
    const pts = s.pts.filter((p) => p[1] != null); if (!pts.length) continue;
    const d = pts.map((p, i) => `${i ? "L" : "M"}${X(p[0]).toFixed(1)} ${Y(p[1]).toFixed(1)}`).join("");
    if (s.area && pts.length > 1) g += `<path class="area" d="${d}L${X(pts[pts.length - 1][0])} ${Y(lo)}L${X(pts[0][0])} ${Y(lo)}Z" opacity=".6"/>`;
    if (s.cls && pts.length > 1) g += `<path class="${s.cls}" d="${d}"/>`;
    if (s.dots) for (const p of pts) g += `<circle class="dot" cx="${X(p[0])}" cy="${Y(p[1])}" r="2.4"/>`;
    if (s.end) { const p = pts[pts.length - 1]; g += `<circle class="end" cx="${X(p[0])}" cy="${Y(p[1])}" r="4.5"/>`; }
  }
  return `<svg class="chart" viewBox="0 0 ${w} ${h}" role="img">${g}</svg>`;
}
function weekBars(w = 600, h = 170) {
  const n = numWeeks(), cw = curWeek(), L = 30, R = 8, T = 8, B = 22, iw = w - L - R, ih = h - T - B, bw = iw / n;
  const Y = (v) => T + ih * (1 - v / 100);
  let g = "";
  for (const v of [0, 50, 100]) g += `<line class="grid-l" x1="${L}" x2="${w - R}" y1="${Y(v)}" y2="${Y(v)}"/><text x="${L - 6}" y="${Y(v) + 3.5}" text-anchor="end">${v}</text>`;
  g += `<line class="ref y" x1="${L}" x2="${w - R}" y1="${Y(70)}" y2="${Y(70)}"/><line class="ref g" x1="${L}" x2="${w - R}" y1="${Y(85)}" y2="${Y(85)}"/>`;
  for (let i = 1; i <= n; i++) {
    const x = L + bw * (i - 1) + bw * 0.18, bwi = bw * 0.64, wd = weekData(i);
    if (!wd.started) { g += `<rect class="b-empty" x="${x}" y="${Y(100)}" width="${bwi}" height="${ih}" rx="3" opacity=".5"/>`; }
    else { const s = weekScore(wd).total; g += `<rect class="b-${statusOf(s)}" x="${x}" y="${Y(s)}" width="${bwi}" height="${Math.max(1, Y(0) - Y(s))}" rx="3"/>`; if (i === cw) g += `<rect class="b-cur" x="${x - 2}" y="${Y(100) - 2}" width="${bwi + 4}" height="${ih + 4}" rx="4"/>`; }
    g += `<text x="${x + bwi / 2}" y="${h - 6}" text-anchor="middle">${i}</text>`;
  }
  return `<svg class="chart" viewBox="0 0 ${w} ${h}" role="img" aria-label="Score semanal por semana">${g}</svg>`;
}
function cycleGrid() {
  const n = numWeeks(), t = todayKey(), cw = curWeek(); let cols = "", heads = "", ph = "";
  for (let i = 1; i <= n; i++) {
    heads += `<span>S${i}</span>`;
    let cells = "";
    for (let j = 0; j < 7; j++) {
      const k = addDays(C().inicio, 7 * (i - 1) + j);
      if (k > cycleEnd()) { cells += `<span class="cell none"></span>`; continue; }
      const fut = k > t, s = hasDayData(k) ? dayScore(k) : 0, lvl = hasDayData(k) ? Math.max(1, Math.ceil(s / 2)) : 0;
      const cls = fut ? "future" : lvl ? "l" + lvl : "";
      cells += fut ? `<span class="cell future" title="Día ${dayNum(k)} · ${fmtDate(k)}"></span>` : `<button class="cell ${cls} ${k === t ? "today" : ""}" data-act="openDay" data-k="${k}" title="Día ${dayNum(k)} · ${fmtDate(k)} · ${s}/10" aria-label="Día ${dayNum(k)}, ${s} de 10"></button>`;
    }
    cols += `<div class="cyc-col">${cells}</div>`;
  }
  for (const p of PHASES) { const a = p.w[0], b = Math.min(p.w[1], n); ph += `<div class="phase ${cw >= a && cw <= b ? "cur" : ""}" style="grid-column:${a}/${b + 1}" title="${p.name}">${p.name}</div>`; }
  return `<div class="wkhead">${heads}</div><div class="cyc">${cols}</div><div class="phases">${ph}</div>
  <div class="legend" style="margin-top:12px"><span>Score diario:</span><span><span class="sw" style="background:var(--sunk)"></span>0</span><span><span class="sw" style="background:var(--l1)"></span>2</span><span><span class="sw" style="background:var(--l3)"></span>6</span><span><span class="sw" style="background:var(--l5)"></span>10</span></div>`;
}

/* ---------- Views ---------- */
function banner() {
  if (S.mode === "error") return `<div class="note bad">No se pudieron cargar tus datos. Revisa tu conexión y recarga la página.</div>`;
  if (S.mode === "loading") return `<div class="note">Cargando tus datos…</div>`;
  if (S.readOnly) return `<div class="note warn">Solo lectura: no tienes permiso para guardar cambios aquí.</div>`;
  const dn = dayNum(todayKey());
  if (dn < 1) return `<div class="note">El ciclo empieza el ${fmtDate(C().inicio, true)}. Puedes cambiar la fecha de inicio en Ajustes.</div>`;
  return "";
}

function vHoy() {
  const k = S.date, d = D(k), c = C(), n = dayNum(k), inC = n >= 1 && n <= c.dias, cats = scoreCats(k), sc = dayScore(k), isToday = k === todayKey();
  const wk = weekOf(k), ph = phaseOfWeek(wk), dow = parseK(k).getDay(), ag = c.agenda[String(dow)] || [];
  const pri = effectivePriorities(k), agDone = d.agendaDone || {}, priDone = d.priDone || [];
  const gymT = ag.find((x) => !/run|descanso/i.test(x) && /upper|lower|arms|delts|gym|push|pull|leg/i.test(x)) || "Custom";
  const catActs = {
    train: `<button class="chip ${d.workout ? "on" : ""}" data-act="trainQuick" data-t="${esc(gymT)}">✓ Gym · ${esc(gymT.replace(/\s*\(.*\)/, ""))}</button><button class="chip ${d.run ? "on" : ""}" data-act="runQuick">✓ Run</button><button class="chip" data-act="sheet" data-s="workout">Detalle</button>`,
    deep: `<button class="chip" data-act="deep" data-n="30">+30</button><button class="chip" data-act="deep" data-n="90">+90</button><button class="chip" data-act="sheet" data-s="deep">Ajustar</button>`,
    com: `<button class="chip" data-act="com" data-n="1">+1</button><button class="chip" data-act="com" data-n="5">+5</button><button class="chip" data-act="sheet" data-s="kpi" data-p="ia">KPI</button>`,
    nut: `<button class="chip" data-act="sheet" data-s="nut">Registrar</button>`,
    money: `<button class="chip" data-act="sheet" data-s="tx" data-t="gasto">+ Gasto</button><button class="chip ${d.sinGastos ? "on" : ""}" data-act="sinGastos">Sin gastos hoy</button>`
  };
  const logItems = [];
  for (const t of d.tx || []) logItems.push(`<div class="li"><div><b>${esc(t.desc || t.cat || "Movimiento")}</b><div class="small muted">${esc(TX_TYPES.find((x) => x[0] === t.tipo)?.[1] || t.tipo)} · ${esc(t.cat || "")}${t.clase && t.tipo === "gasto" ? " · " + esc(t.clase) : ""}</div></div><span class="num" style="font-size:17px;color:${t.tipo === "ingreso" ? "var(--good)" : "var(--ink)"}">${t.tipo === "ingreso" ? "+" : t.tipo === "gasto" || t.tipo === "deuda" ? "−" : ""}${money(Number(t.monto), 2).replace("−", "")}</span><button class="iconbtn" data-act="delTx" data-k="${k}" data-id="${t.id}" aria-label="Borrar movimiento">✕</button></div>`);
  if (d.workout) logItems.push(`<div class="li"><div><b>Gym · ${esc(d.workout.tipo)}</b><div class="small muted">${d.workout.min ? d.workout.min + " min · " : ""}${(d.workout.ejercicios || []).length} ejercicios</div></div><span></span><button class="iconbtn" data-act="delField" data-f="workout" data-k="${k}" aria-label="Borrar entreno">✕</button></div>`);
  if (d.run) logItems.push(`<div class="li"><div><b>Run</b><div class="small muted">${d.run.km ? f1(d.run.km) + " km" : "Sin distancia"}${d.run.min ? " · " + d.run.min + " min · " + pace(d.run) : ""}</div></div><span></span><button class="iconbtn" data-act="delField" data-f="run" data-k="${k}" aria-label="Borrar run">✕</button></div>`);
  if (d.peso != null || d.cintura != null) logItems.push(`<div class="li"><div><b>Medición</b><div class="small muted">${d.peso != null ? f1(d.peso) + " kg" : ""}${d.peso != null && d.cintura != null ? " · " : ""}${d.cintura != null ? f1(d.cintura) + " cm cintura" : ""}</div></div><span></span><button class="iconbtn" data-act="delField" data-f="peso,cintura" data-k="${k}" aria-label="Borrar medición">✕</button></div>`);
  const kp = (obj, list) => list.filter(([kk]) => obj?.[kk]).map(([kk, l]) => `${obj[kk]} ${l.toLowerCase()}`).join(" · ");
  if (d.autos && kp(d.autos, AUTOS_K)) logItems.push(`<div class="li"><div><b>Autos</b><div class="small muted">${kp(d.autos, AUTOS_K)}${d.autos.utilidad ? " · utilidad " + money(d.autos.utilidad) : ""}</div></div><span></span><button class="iconbtn" data-act="delField" data-f="autos" data-k="${k}" aria-label="Borrar KPIs Autos">✕</button></div>`);
  if (d.ia && (kp(d.ia, IA_K) || d.ia.mrr != null)) logItems.push(`<div class="li"><div><b>IA</b><div class="small muted">${kp(d.ia, IA_K)}${d.ia.mrr != null ? " · MRR " + money(d.ia.mrr) : ""}</div></div><span></span><button class="iconbtn" data-act="delField" data-f="ia" data-k="${k}" aria-label="Borrar KPIs IA">✕</button></div>`);

  return `${banner()}
  <div class="phead">
    <div>
      <div class="eyebrow">${inC ? `Día ${n} / ${c.dias} · Semana ${wk} · ${ph.name}` : n < 1 ? "Antes del ciclo" : "Después del ciclo"}</div>
      <h1 style="margin-top:6px">${fmtDate(k, true).replace(/^./, (x) => x.toUpperCase())}</h1>
    </div>
    <div class="datenav">
      <button class="btn sm" data-act="prevDay" aria-label="Día anterior">‹</button>
      ${isToday ? `<span class="pill neutral">Hoy</span>` : `<button class="btn sm" data-act="todayBtn">Ir a hoy</button>`}
      <button class="btn sm" data-act="nextDay" aria-label="Día siguiente">›</button>
    </div>
  </div>
  <div class="grid g-main">
    <div class="stack" style="gap:16px">
      <section class="card">
        <div class="hero">
          <div><div class="eyebrow">Score de hoy</div><div class="bigscore num" style="margin-top:10px">${sc}<small> / 10</small></div></div>
          <div><div class="segs">${cats.map((x) => `<i class="${x.ok ? "on" : ""}"></i>`).join("")}</div><div class="msg">${dayMsg(sc, hasDayData(k))}</div></div>
        </div>
      </section>
      <section class="card">
        <h2>Scorecard diario <span class="eyebrow">2 pts c/u · sí o no</span></h2>
        <div class="cats">${cats.map((x) => `<div class="cat"><span class="check ${x.ok ? "on" : ""}" aria-label="${x.ok ? "Cumplido" : "Pendiente"}">✓</span><div><div class="t">${x.label} <span class="pts">${x.ok ? 2 : 0}/2</span></div><div class="r">${x.rule}</div><div class="small" style="font-weight:600;margin-top:2px">${esc(x.detail)}</div></div><div class="acts">${catActs[x.id]}</div></div>`).join("")}</div>
      </section>
      <section class="card">
        <h2>Top 3 prioridades ${pri.src === "ayer" ? `<span class="tag">Plan de ayer</span>` : pri.src === "semana" ? `<span class="tag">De la revisión semanal</span>` : ""}</h2>
        <div class="stack">${[0, 1, 2].map((i) => `<div class="pri ${priDone[i] ? "done" : ""}"><input type="checkbox" id="pd${i}" data-bind="priDone" data-i="${i}" ${priDone[i] ? "checked" : ""} aria-label="Prioridad ${i + 1} hecha"><input type="text" id="pr${i}" data-bind="pri" data-i="${i}" value="${esc(pri.list[i] || "")}" placeholder="Prioridad ${i + 1}"></div>`).join("")}</div>
      </section>
    </div>
    <div class="stack" style="gap:16px">
      <section class="card">
        <h2>Registrar</h2>
        <div class="qas">
          ${[["tx", "gasto", "Gasto", "gasto"], ["tx", "ingreso", "Ingreso", "ingreso"], ["peso", "", "Peso", "peso"], ["workout", "", "Entreno", "fisico"], ["run", "", "Run", "run"], ["nut", "", "Nutrición", "nutri"], ["kpi", "autos", "Autos", "kpi"], ["kpi", "ia", "IA", "proyectos"]].map(([s, t, l, ic]) => `<button class="qa" data-act="sheet" data-s="${s}" data-t="${t}" data-p="${t}">${svgI(ic)}${l}</button>`).join("")}
        </div>
      </section>
      <section class="card">
        <h2>Agenda · ${DOW[dow]} <span class="eyebrow">Trabajo ${esc(c.bloqueTrabajo)}</span></h2>
        <div class="agenda">${ag.length ? ag.map((x, i) => `<label class="${agDone[i] ? "done" : ""}"><input type="checkbox" id="ag${i}" data-bind="agenda" data-i="${i}" ${agDone[i] ? "checked" : ""}><span>${esc(x)}</span></label>`).join("") : `<div class="muted">Sin agenda para este día.</div>`}</div>
      </section>
      <section class="card">
        <h2>Plan de mañana <span class="eyebrow">Cuenta para Dinero / orden</span></h2>
        <div class="stack">${[0, 1, 2].map((i) => `<div class="pri"><span class="eyebrow">${i + 1}</span><input type="text" id="mn${i}" data-bind="manana" data-i="${i}" value="${esc((d.manana || [])[i] || "")}" placeholder="Acción de mayor impacto"></div>`).join("")}</div>
      </section>
      <section class="card">
        <h2>Registro del día <span class="eyebrow">${logItems.length} entradas</span></h2>
        ${logItems.length ? `<div class="log">${logItems.join("")}</div>` : `<div class="empty">Aún no hay registros para este día. Usa los botones de Registrar.</div>`}
        <div class="field" style="margin-top:12px"><label for="nota">¿Qué pasó hoy?</label><textarea id="nota" rows="2" data-bind="nota" placeholder="Una línea basta">${esc(d.nota || "")}</textarea></div>
      </section>
    </div>
  </div>`;
}
function pace(r) { if (!r.km || !r.min) return ""; const p = r.min / r.km, m = Math.floor(p), s = Math.round((p - m) * 60); return `${m}:${pad(s === 60 ? 0 : s)} /km`; }

function vPanel() {
  const t = todayKey(), c = C(), cw = curWeek(), wd = weekData(cw), ws = weekScore(wd), fs = finState(), dn = dayNum(t);
  const inC = dn >= 1 && dn <= c.dias, tk = inC ? t : dn < 1 ? c.inicio : cycleEnd();
  const wAvg = avgWeightAt(t), wPrev = avgWeightAt(addDays(t, -7));
  const dsc = dayScore(tk), cats = scoreCats(tk);
  const s8 = streak((k) => hasDayData(k) && dayScore(k) >= 8), sExp = streak((k) => expensesLogged(D(k)));
  const ym = t.slice(0, 7), mk = daysBetween(ym + "-01", t), mm = sumMoney(mk), mp = monthPlan(ym);
  const pri = effectivePriorities(tk);
  const wk = weakest(ws);
  const ctd = daysBetween(c.inicio, t < cycleEnd() ? t : cycleEnd());
  const au = { leads: 0, ventas: 0, utilidad: 0, contenido: 0 }, ia = { prospectos: 0, conversaciones: 0, clientes: 0 }; let mrr = null;
  for (const k of ctd) { const d = D(k); for (const x in au) au[x] += Number(d.autos?.[x]) || 0; for (const x in ia) ia[x] += Number(d.ia?.[x]) || 0; if (d.ia?.mrr != null) mrr = d.ia.mrr; }
  const trips = Object.entries(S.trips).map(([id, x]) => ({ id, ...x })).filter((x) => x.estado !== "descartado").sort((a, b) => (a.inicio || "9") < (b.inicio || "9") ? -1 : 1);
  const nextTrip = trips[0];
  const cT = capitalTarget();
  const upcoming = PHASES.filter((p) => p.w[1] >= cw).slice(0, 2);
  return `${banner()}
  <div class="phead"><div><div class="eyebrow">${esc(c.ciclo)} · ${fmtDate(c.inicio)} → ${fmtDate(cycleEnd())}</div><h1 style="margin-top:6px">Centro de mando</h1></div>${wd.started ? pill(statusOf(ws.total), statusLabel(ws.total)) : ""}</div>
  <div class="kpis">
    ${kpi("Ciclo", inC ? `${dn}<small> / ${c.dias}</small>` : dn < 1 ? "0<small> / " + c.dias + "</small>" : `${c.dias}<small> / ${c.dias}</small>`, inC ? `${c.dias - dn} días restantes · Semana ${cw}` : dn < 1 ? `Empieza en ${1 - dn} días` : "Ciclo completo")}
    ${kpi("Hoy", `${dsc}<small> / 10</small>`, `Racha ≥8: ${s8.cur} · mejor ${s8.best}`)}
    ${kpi("Score semanal", `${wd.started ? ws.total : "—"}<small> / 100</small>`, wd.started ? statusLabel(ws.total) : "Aún no empieza")}
    ${kpi("Capital", money(fs.capital), `<span class="tag actual">Real</span> ${cT != null ? `objetivo ${money(cT)}` : ""}`)}
    ${kpi("Peso prom. 7d", wAvg != null ? f1(wAvg) + "<small> kg</small>" : "—", wAvg != null && wPrev != null ? `${wAvg - wPrev >= 0 ? "+" : ""}${f1(wAvg - wPrev)} kg vs semana anterior` : "Registra 3–7 pesajes por semana")}
  </div>
  <div class="grid g-main">
    <section class="card"><h2>90 días <span class="eyebrow">Toca un día para abrirlo</span></h2>${cycleGrid()}</section>
    <section class="card"><h2>Score semanal <span class="legend"><span><span class="sw" style="background:var(--good)"></span>≥85</span><span><span class="sw" style="background:var(--warn)"></span>70–84</span><span><span class="sw" style="background:var(--bad)"></span>&lt;70</span></span></h2>${weekBars(chartW(2), 190)}
      ${wd.started ? `<div class="note ${statusOf(ws.total)}" style="margin-top:12px">${statusMsg(ws.total)} Pilar más débil esta semana: <b>${wk.name}</b> (${Math.round(wk.pts)}/${wk.max}).</div>` : ""}
    </section>
  </div>
  <div class="grid g3">
    <section class="card"><h2>Hoy <button class="btn sm" data-act="nav" data-v="hoy">Ganar el día</button></h2>
      <div class="stack">${cats.map((x) => `<div class="row between"><span>${x.label}</span><span class="${x.ok ? "" : "muted"}" style="font-family:var(--mono);font-size:12px">${x.ok ? 2 : 0}/2</span></div>`).join("")}</div>
      <div class="hr" style="margin:12px 0"></div>
      <div class="eyebrow" style="margin-bottom:6px">Top 3</div>
      ${pri.list.some((x) => x && x.trim()) ? `<ol style="margin:0;padding-left:18px">${pri.list.filter((x) => x && x.trim()).map((x) => `<li style="font-weight:600;padding:2px 0">${esc(x)}</li>`).join("")}</ol>` : `<div class="muted small">Define tus 3 prioridades en Hoy.</div>`}
    </section>
    <section class="card"><h2>Finanzas · ${MONL[Number(ym.slice(5)) - 1]} <button class="btn sm ghost" data-act="nav" data-v="finanzas">Ver</button></h2>
      <div class="stack">
        ${meter("Ingreso del mes", mm.inc, mp?.ingMin || 0, `${money(mm.inc)} / ${mp?.ingMin ? money(mp.ingMin) : "sin dato"}`, "good")}
        ${meter("Ahorro del mes", Math.max(0, mm.sav), mp?.ah || 0, `${money(mm.sav)} / ${mp?.ah ? money(mp.ah) : "sin dato"}`, mm.sav < 0 ? "bad" : "")}
        <div class="row between"><span>Gasto del mes</span><b class="tab">${money(mm.exp)}</b></div>
        <div class="row between"><span>Deuda restante</span><b class="tab">${money(fs.deuda)}</b></div>
        <div class="row between"><span>Tasa de ahorro</span><b class="tab">${pct(sdiv(mm.sav, mm.inc))}</b></div>
      </div>
    </section>
    <section class="card"><h2>Físico · semana ${cw} <button class="btn sm ghost" data-act="nav" data-v="fisico">Ver</button></h2>
      <div class="stack">
        ${meter("Gym", wd.gym, c.metas.gym, `${wd.gym}/${c.metas.gym}`, wd.gym >= c.metas.gym ? "good" : "")}
        ${meter("Runs", wd.runs, c.metas.runsMax, `${wd.runs}/${c.metas.runsMax}`, wd.runs >= c.metas.runsMin ? "good" : "")}
        ${meter("Nutrición en rango", wd.nutOK, wd.len, `${wd.nutOK}/${wd.len}`, "")}
        <div class="row between"><span>Cintura</span><b class="tab">${lastWaist() ? f1(lastWaist().v) + " cm" : "—"}</b></div>
      </div>
    </section>
    <section class="card"><h2>Autos · ciclo <button class="btn sm ghost" data-act="nav" data-v="proyectos">Ver</button></h2>
      <div class="facts"><div><span class="eyebrow">Contenido</span><b>${au.contenido}</b></div><div><span class="eyebrow">Leads</span><b>${au.leads}</b></div><div><span class="eyebrow">Ventas</span><b>${au.ventas}</b></div><div><span class="eyebrow">Tu ${Math.round(c.autosShare * 100)}%</span><b>${money(au.utilidad * c.autosShare)}</b></div></div>
    </section>
    <section class="card"><h2>IA · ciclo <button class="btn sm ghost" data-act="nav" data-v="proyectos">Ver</button></h2>
      <div class="facts"><div><span class="eyebrow">Prospectos</span><b>${ia.prospectos}</b></div><div><span class="eyebrow">Conversac.</span><b>${ia.conversaciones}</b></div><div><span class="eyebrow">Clientes</span><b>${ia.clientes}</b></div><div><span class="eyebrow">MRR</span><b>${money(mrr)}</b></div></div>
    </section>
    <section class="card"><h2>Viajes <button class="btn sm ghost" data-act="nav" data-v="finanzas">Ver</button></h2>
      ${nextTrip ? tripSummary(nextTrip, true) : `<div class="empty">Sin viajes planeados.</div>`}
    </section>
  </div>
  <div class="grid g2">
    <section class="card"><h2>Rachas</h2>
      <table><thead><tr><th>Hábito</th><th class="r">Actual</th><th class="r">Mejor</th></tr></thead><tbody>
      <tr><td>Score diario ≥ 8</td><td class="r">${s8.cur}</td><td class="r">${s8.best}</td></tr>
      <tr><td>Gastos registrados</td><td class="r">${sExp.cur}</td><td class="r">${sExp.best}</td></tr>
      <tr><td>Deep work cumplido</td><td class="r">${streak((k) => (D(k).deepMin || 0) >= c.metas.deepMin).cur}</td><td class="r">${streak((k) => (D(k).deepMin || 0) >= c.metas.deepMin).best}</td></tr>
      <tr><td>Revisión semanal</td><td class="r" colspan="2">${Object.keys(S.reviews).length} de ${Math.max(0, cw - 1)} semanas cerradas</td></tr>
      </tbody></table>
      <div class="small muted" style="margin-top:8px">Un día perdido no borra tu historial: la mejor racha queda guardada.</div>
    </section>
    <section class="card"><h2>Próximos hitos <button class="btn sm ghost" data-act="nav" data-v="plan">Ver plan</button></h2>
      <div class="stack">${upcoming.map((p) => `<div><div class="row between"><b>${p.name}</b><span class="eyebrow">Sem ${p.w[0]}–${p.w[1]}</span></div><div class="small muted">${p.desc}</div><div class="small" style="margin-top:4px">${p.items.filter((it, i) => c.hitos[p.id + i]).length}/${p.items.length} completados</div></div>`).join('<div class="hr"></div>')}</div>
    </section>
  </div>`;
}

function tripSummary(tr, compact) {
  const spent = tripSpent(tr.id), fs = finState();
  const budget = Number(tr.presupuesto) || 0;
  const cond = tr.capitalMin != null ? (fs.capital >= tr.capitalMin ? `<span class="pill good"><i></i>Condición cumplida</span>` : `<span class="pill warn"><i></i>Condición no cumplida</span>`) : "";
  const dec = { pendiente: "Pendiente", si: "Voy", no: "No voy" }[tr.decision || "pendiente"];
  return `<div class="stack">
    <div class="row between"><b style="font-size:15px">${esc(tr.destino)}</b><span class="eyebrow">${tr.inicio ? fmtDate(tr.inicio) + (tr.fin ? " → " + fmtDate(tr.fin) : "") : esc(tr.cuando || "Fecha por definir")}</span></div>
    ${budget ? meter("Gastado", spent, budget, `${money(spent)} / ${money(budget)}`, spent > budget ? "bad" : "") : ""}
    ${budget ? `<div class="row between small"><span class="muted">Restante</span><b class="tab">${money(budget - spent)}</b></div>` : ""}
    ${tr.condicion ? `<div class="small"><span class="tag target">Condición</span> ${esc(tr.condicion)}${tr.capitalMin != null ? ` · capital ≥ ${money(tr.capitalMin)} (hoy ${money(fs.capital)})` : ""}</div>` : ""}
    ${compact ? "" : `<div class="row">${cond}<span class="tag decision">Decisión: ${dec}</span></div>`}
  </div>`;
}
function tripSpent(id) { let s = 0; for (const t of allTx()) if (t.trip === id && (t.tipo === "gasto")) s += Number(t.monto) || 0; return s; }

function vFin() {
  const t = todayKey(), c = C(), fs = finState(), ym = t.slice(0, 7), mk = daysBetween(ym + "-01", t), mm = sumMoney(mk), mp = monthPlan(ym);
  const fc = forecast(), cT = capitalTarget(), cs = capitalStart();
  const endK = t < cycleEnd() ? t : cycleEnd();
  const actual = [[0, cs]]; if (t >= c.inicio) for (const k of daysBetween(c.inicio, endK)) actual.push([dayNum(k), finState(k).capital]);
  const target = [[0, cs]]; let acc = cs; for (const k of daysBetween(c.inicio, cycleEnd())) { acc += dailySavingsTarget(k) || 0; target.push([dayNum(k), acc]); }
  const fore = fc.ready ? [[dayNum(endK), fs.capital], [c.dias, fc.base]] : [];
  const xl = [[0, "D0"], [30, "D30"], [60, "D60"], [c.dias, "D" + c.dias]];
  const d0 = new Date(), dim = new Date(d0.getFullYear(), d0.getMonth() + 1, 0).getDate(), mprog = d0.getDate() / dim;
  const alerts = [];
  const varSp = mm.byClass.variable || 0;
  if (varSp > c.finanzas.gastoVariable) alerts.push(["warn", "El gasto variable está por encima de tu plan mensual (" + money(varSp) + " / " + money(c.finanzas.gastoVariable) + ")."]);
  for (const [id, tr] of Object.entries(S.trips)) if (tr.presupuesto && tripSpent(id) > tr.presupuesto) alerts.push(["bad", `Presupuesto de viaje excedido: ${tr.destino}.`]);
  if (mp?.ah && mprog >= 0.7 && mm.sav < mp.ah * mprog) alerts.push(["warn", "El ritmo de ahorro va por debajo del objetivo. Revisa gastos e ingresos."]);
  if (fs.deuda === 0 && c.finanzas.deudaInicial > 0) alerts.push(["good", "Deuda saldada."]);
  const months = Object.keys(c.meses).sort();
  const txs = allTx().filter((x) => x.date.slice(0, 7) === (S.txMonth || ym));
  const txMonths = [...new Set([ym, ...allTx().map((x) => x.date.slice(0, 7))])].sort().reverse();
  const trips = Object.entries(S.trips).map(([id, x]) => ({ id, ...x }));
  return `${banner()}
  <div class="phead"><div><div class="eyebrow">La cifra más importante es cuánto capital acumulas</div><h1 style="margin-top:6px">Finanzas</h1></div>
    <div class="row"><button class="btn primary" data-act="sheet" data-s="tx" data-t="gasto">+ Gasto</button><button class="btn" data-act="sheet" data-s="tx" data-t="ingreso">+ Ingreso</button></div></div>
  <div class="kpis">
    ${kpi("Capital", money(fs.capital), `<span class="tag actual">Real</span> liquidez ${money(fs.liquidez)}${fs.invertido ? " · invertido " + money(fs.invertido) : ""}`)}
    ${kpi("Ingreso del mes", money(mm.inc), mp ? `objetivo ${mp.ingMin ? money(mp.ingMin) + (mp.ingMax ? "–" + money(mp.ingMax) : "+") : "DATO FALTANTE"}` : "sin objetivo")}
    ${kpi("Gasto del mes", money(mm.exp), `fijo ${money(mm.byClass.fijo)} · variable ${money(mm.byClass.variable)}`)}
    ${kpi("Ahorro del mes", money(mm.sav), `tasa ${pct(sdiv(mm.sav, mm.inc))} · objetivo ${mp?.ah ? money(mp.ah) : "—"}`)}
    ${kpi("Deuda", money(fs.deuda), `${money(c.finanzas.pagoDeuda)}/mes · ${c.finanzas.restarDeuda ? "se resta del capital" : "no se resta del capital"}`)}
  </div>
  ${alerts.length ? `<div class="stack">${alerts.map(([s, m]) => `<div class="note ${s}">${m}</div>`).join("")}</div>` : ""}
  <div class="grid g-main">
    <section class="card"><h2>Capital en el ciclo <span class="legend"><span><b></b>Real</span><span><b class="t"></b>Objetivo</span><span><b class="f"></b>Pronóstico</span></span></h2>
      ${lineChart({ w: chartW(2) + 30, h: 220, xMax: c.dias, xLabels: xl, yFmt: (v) => "$" + (Math.abs(v) >= 1000 ? (v / 1000).toFixed(v % 1000 ? 1 : 0) + "k" : v), series: [{ pts: target, cls: "l-target" }, { pts: actual, cls: "l-actual", end: true }, { pts: fore, cls: "l-fore" }] })}
      <div class="small muted" style="margin-top:8px">Objetivo derivado de tus metas de ahorro mensuales: ${cT != null ? money(cT) : "—"} al día ${c.dias}.</div>
    </section>
    <section class="card"><h2>Escenarios al cierre <span class="tag fore">Pronóstico</span></h2>
      ${fc.ready ? `<div class="stack">
        ${[["Conservador", fc.cons], ["Base", fc.base], ["Alto", fc.high]].map(([l, v]) => `<div class="row between"><span>${l}</span><b class="num" style="font-size:22px">${money(v)}</b></div>`).join("")}
        <div class="small muted">Basado en tu ritmo real (${money(fc.rate * 7)}/semana). Es una proyección, no un hecho ni una garantía.</div></div>`
      : `<div class="empty">Necesitas al menos 7 días de ciclo y 5 días con movimientos para proyectar. Llevas ${fc.elapsed || 0} días y ${fc.txDays || 0} con movimientos.</div>`}
      <div class="hr" style="margin:14px 0"></div>
      <div class="stack small">
        <div class="row between"><span><span class="tag target">Objetivo</span> capital día ${c.dias}</span><b class="tab">${cT != null ? money(cT) : "—"}</b></div>
        <div class="row between"><span><span class="tag actual">Real</span> capital hoy</span><b class="tab">${money(fs.capital)}</b></div>
        <div class="row between"><span><span class="tag fore">Pronóstico</span> base</span><b class="tab">${fc.ready ? money(fc.base) : "—"}</b></div>
        <div class="row between"><span><span class="tag decision">Decisión</span> viajes y gastos grandes</span><b>Tú decides</b></div>
      </div>
    </section>
  </div>
  <section class="card"><h2>Metas por mes <span class="eyebrow">Objetivos operativos · se recalculan con el ingreso real</span></h2>
    <div class="tbl-wrap"><table><thead><tr><th>Mes</th><th class="r">Ingreso objetivo</th><th class="r">Ingreso real</th><th class="r">Ahorro objetivo</th><th class="r">Ahorro real</th><th class="r">Gasto</th><th>Estado</th></tr></thead><tbody>
    ${months.map((m) => { const p = monthPlan(m), [y, mo] = m.split("-").map(Number), last = new Date(y, mo, 0).getDate(), ks = daysBetween(m + "-01", `${m}-${pad(last)}`), s = sumMoney(ks), fut = m > ym;
      const st = fut ? pill("neutral", "Por venir") : p?.ah ? (s.sav >= p.ah ? pill("good", "Cumplido") : m === ym ? pill("accent", "En curso") : pill("bad", "No cumplido")) : pill("neutral", "Sin objetivo");
      return `<tr class="${m === ym ? "cur" : ""}"><td><b>${MONL[mo - 1]}</b></td><td class="r">${p?.ingMin ? money(p.ingMin) + (p.ingMax ? "–" + money(p.ingMax) : "+") : `<span class="muted">Dato faltante</span>`}</td><td class="r">${fut ? "—" : money(s.inc)}</td><td class="r">${p?.ahMin ? money(p.ahMin) + (p.ahMax && p.ahMax !== p.ahMin ? "–" + money(p.ahMax) : "") : "—"}</td><td class="r">${fut ? "—" : money(s.sav)}</td><td class="r">${fut ? "—" : money(s.exp)}</td><td>${st}</td></tr>`; }).join("")}
    </tbody></table></div>
  </section>
  <div class="grid g2">
    <section class="card"><h2>Gasto del mes por tipo</h2>
      <div class="stack">${TX_CLASS.map(([id, l]) => meter(l, mm.byClass[id] || 0, Math.max(mm.exp, 1), money(mm.byClass[id] || 0), "")).join("")}
      <div class="small muted">Plan: fijos ${money(c.finanzas.gastosFijos)} · variable ${money(c.finanzas.gastoVariable)} al mes.</div></div>
    </section>
    <section class="card"><h2>Viajes <button class="btn sm" data-act="sheet" data-s="trip">+ Viaje</button></h2>
      ${trips.length ? `<div class="stack">${trips.map((tr) => `${tripSummary(tr)}<div class="row"><button class="btn sm" data-act="sheet" data-s="trip" data-id="${tr.id}">Editar</button><button class="btn sm ghost" data-act="sheet" data-s="tx" data-t="gasto" data-trip="${tr.id}">+ Gasto de viaje</button></div>`).join('<div class="hr"></div>')}</div>` : `<div class="empty">Sin viajes. Añade uno con presupuesto y, si quieres, una condición de capital.</div>`}
    </section>
  </div>
  <section class="card"><h2>Movimientos
    <select id="txMonth" data-bind="txMonth" class="btn sm" aria-label="Mes">${txMonths.map((m) => `<option value="${m}" ${m === (S.txMonth || ym) ? "selected" : ""}>${MONL[Number(m.slice(5)) - 1]} ${m.slice(0, 4)}</option>`).join("")}</select></h2>
    ${txs.length ? `<div class="tbl-wrap"><table><thead><tr><th>Fecha</th><th>Descripción</th><th>Tipo</th><th>Categoría</th><th class="r">Monto</th><th></th></tr></thead><tbody>
    ${txs.map((x) => `<tr><td>${fmtDate(x.date)}</td><td>${esc(x.desc || "—")}${x.trip && S.trips[x.trip] ? ` <span class="tag">${esc(S.trips[x.trip].destino)}</span>` : ""}</td><td>${esc(TX_TYPES.find((y) => y[0] === x.tipo)?.[1] || x.tipo)}</td><td>${esc(x.cat || "")}${x.tipo === "gasto" && x.clase ? ` · ${esc(x.clase)}` : ""}</td><td class="r" style="color:${x.tipo === "ingreso" ? "var(--good)" : "inherit"}">${x.tipo === "ingreso" ? "+" : x.tipo === "gasto" || x.tipo === "deuda" ? "−" : ""}${money(Number(x.monto), 2)}</td><td class="r"><button class="iconbtn" data-act="delTx" data-k="${x.date}" data-id="${x.id}" aria-label="Borrar">✕</button></td></tr>`).join("")}
    </tbody></table></div>` : `<div class="empty">Sin movimientos este mes. Registrar el real, no el esperado.</div>`}
  </section>`;
}

function vFis() {
  const t = todayKey(), c = C(), cw = curWeek(), wd = weekData(cw), ws = weights();
  const wAvg = avgWeightAt(t), wPrev = avgWeightAt(addDays(t, -7)), wMonth = avgWeightAt(addDays(t, -28)), lw = lastWaist();
  const series = ws.filter(([k]) => k >= c.inicio && k <= cycleEnd()).map(([k, v]) => [dayNum(k), v]);
  const avgSeries = ws.filter(([k]) => k >= c.inicio && k <= cycleEnd()).map(([k]) => [dayNum(k), avgWeightAt(k)]);
  const waistS = Object.entries(S.days).filter(([k, d]) => d.cintura != null && k >= c.inicio).sort().map(([k, d]) => [dayNum(k), d.cintura]);
  const wks = daysBetween(wd.a, wd.b);
  const workouts = Object.entries(S.days).filter(([, d]) => d.workout).sort((a, b) => (a[0] < b[0] ? 1 : -1)).slice(0, 12);
  const runs = Object.entries(S.days).filter(([, d]) => d.run).sort((a, b) => (a[0] < b[0] ? 1 : -1)).slice(0, 10);
  const ex = {};
  for (const [k, d] of Object.entries(S.days).sort()) for (const e of d.workout?.ejercicios || []) { const n = (e.nombre || "").trim(); if (!n) continue; const r = ex[n] || (ex[n] = { best: 0, reps: 0, last: null, prev: null, e1rm: 0 }); const kg = Number(e.kg) || 0, reps = Number(e.reps) || 0; if (kg > r.best || (kg === r.best && reps > r.reps)) { r.best = kg; r.reps = reps; } r.e1rm = Math.max(r.e1rm, kg * (1 + reps / 30)); r.prev = r.last; r.last = { k, kg, reps, series: e.series }; }
  const mkm = runs.filter(([k]) => k.slice(0, 7) === t.slice(0, 7)).reduce((s, [, d]) => s + (Number(d.run.km) || 0), 0);
  return `${banner()}
  <div class="phead"><div><div class="eyebrow">No necesitas adivinar si estás progresando</div><h1 style="margin-top:6px">Físico</h1></div>
    <div class="row"><button class="btn primary" data-act="sheet" data-s="peso">+ Peso</button><button class="btn" data-act="sheet" data-s="workout">+ Entreno</button><button class="btn" data-act="sheet" data-s="run">+ Run</button><button class="btn" data-act="sheet" data-s="nut">+ Nutrición</button></div></div>
  <div class="kpis">
    ${kpi("Peso prom. 7d", wAvg != null ? f1(wAvg) + "<small> kg</small>" : "—", wAvg != null && wPrev != null ? `${wAvg - wPrev >= 0 ? "+" : ""}${f1(wAvg - wPrev)} kg semana · ${wMonth != null ? (wAvg - wMonth >= 0 ? "+" : "") + f1(wAvg - wMonth) + " kg 4 sem" : ""}` : "Promedio de 3–7 pesajes")}
    ${kpi("Cintura", lw ? f1(lw.v) + "<small> cm</small>" : "—", lw ? "medida " + fmtDate(lw.k) : "1 medición semanal")}
    ${kpi("Gym", `${wd.gym}<small> / ${c.metas.gym}</small>`, `Semana ${cw}`)}
    ${kpi("Run", `${wd.runs}<small> / ${c.metas.runsMax}</small>`, `${f1(wd.km)} km esta semana · ${f1(mkm)} km el mes`)}
    ${kpi("Nutrición", `${wd.nutOK}<small> / ${wd.len}</small>`, "días dentro del objetivo")}
  </div>
  <div class="grid g-main">
    <section class="card"><h2>Peso <span class="legend"><span><span class="sw" style="background:var(--muted);border-radius:50%"></span>Pesaje</span><span><b style="border-color:var(--accent)"></b>Promedio 7 días</span></span></h2>
      ${series.length ? lineChart({ w: chartW(2) + 30, h: 220, xMax: c.dias, xLabels: [[0, "D0"], [30, "D30"], [60, "D60"], [c.dias, "D" + c.dias]], yFmt: (v) => v.toFixed(1), series: [{ pts: series, dots: true }, { pts: avgSeries, cls: "l-avg", end: true }] }) : `<div class="empty">Registra tu primer peso para ver la tendencia. La métrica principal es el promedio semanal, no un pesaje suelto.</div>`}
      ${waistS.length > 1 ? `<div class="eyebrow" style="margin:14px 0 6px">Cintura (cm)</div>${lineChart({ w: chartW(2) + 30, h: 120, xMax: c.dias, series: [{ pts: waistS, cls: "l-actual", dots: true, end: true }], yFmt: (v) => v.toFixed(0) })}` : ""}
    </section>
    <section class="card"><h2>Nutrición · semana ${cw} <span class="eyebrow">Consistencia &gt; perfección</span></h2>
      <div class="tbl-wrap"><table><thead><tr><th>Día</th><th class="r">kcal</th><th class="r">Proteína</th><th>Estado</th></tr></thead><tbody>
      ${wks.map((k) => { const d = D(k), s = nutriState(d); return `<tr><td>${DOW[parseK(k).getDay()].slice(0, 3)} ${parseK(k).getDate()}</td><td class="r">${d.cal ?? "—"}</td><td class="r">${d.prot != null ? d.prot + " g" : "—"}</td><td>${s ? pill(s, s === "good" ? "En rango" : s === "warn" ? "Uno falló" : "Ambos fallaron") : `<span class="muted small">${k > t ? "" : "Sin datos"}</span>`}</td></tr>`; }).join("")}
      </tbody></table></div>
      <div class="small muted" style="margin-top:8px">Objetivo: ~${c.metas.cal.toLocaleString("en-US")} kcal (±${Math.round(c.metas.calTol * 100)}%) y ${c.metas.protMin}–${c.metas.protMax} g de proteína. Son puntos de partida configurables, no una prescripción médica.</div>
      ${ws.length && wAvg != null && avgWeightAt(addDays(t, -14)) != null && Math.abs(wAvg - avgWeightAt(addDays(t, -14))) < 0.2 && wd.nutOK / wd.len >= 0.8 ? `<div class="note warn" style="margin-top:10px">El peso promedio no ha cambiado en ~2 semanas con buena adherencia. Revisa el objetivo de calorías.</div>` : ""}
    </section>
  </div>
  <div class="grid g2">
    <section class="card"><h2>Entrenos recientes</h2>
      ${workouts.length ? `<div class="log">${workouts.map(([k, d]) => `<div class="li"><div><b>${esc(d.workout.tipo)}</b><div class="small muted">${fmtDate(k, true)}${d.workout.min ? " · " + d.workout.min + " min" : ""}${(d.workout.ejercicios || []).length ? " · " + d.workout.ejercicios.map((e) => esc(e.nombre)).join(", ") : ""}</div></div><span></span><button class="iconbtn" data-act="delField" data-f="workout" data-k="${k}" aria-label="Borrar">✕</button></div>`).join("")}</div>` : `<div class="empty">Sin entrenos todavía. Objetivo: ${c.metas.gym} sesiones por semana.</div>`}
    </section>
    <section class="card"><h2>Runs</h2>
      ${runs.length ? `<div class="tbl-wrap"><table><thead><tr><th>Fecha</th><th class="r">km</th><th class="r">min</th><th class="r">Ritmo</th></tr></thead><tbody>${runs.map(([k, d]) => `<tr><td>${fmtDate(k)}</td><td class="r">${d.run.km ? f1(d.run.km) : "—"}</td><td class="r">${d.run.min || "—"}</td><td class="r">${pace(d.run) || "—"}</td></tr>`).join("")}</tbody></table></div>` : `<div class="empty">Sin runs. Objetivo: ${c.metas.runsMin}–${c.metas.runsMax} por semana.</div>`}
    </section>
  </div>
  <section class="card"><h2>Progresión por ejercicio <span class="eyebrow">1RM estimado (Epley)</span></h2>
    ${Object.keys(ex).length ? `<div class="tbl-wrap"><table><thead><tr><th>Ejercicio</th><th class="r">Mejor</th><th class="r">1RM est.</th><th class="r">Última sesión</th><th class="r">Anterior</th><th>Tendencia</th></tr></thead><tbody>
    ${Object.entries(ex).map(([n, r]) => { const up = r.prev && (r.last.kg > r.prev.kg || (r.last.kg === r.prev.kg && r.last.reps > r.prev.reps)); const down = r.prev && r.last.kg < r.prev.kg; return `<tr><td><b>${esc(n)}</b></td><td class="r">${r.best} kg × ${r.reps}</td><td class="r">${f1(r.e1rm)} kg</td><td class="r">${r.last.kg} × ${r.last.reps}</td><td class="r">${r.prev ? r.prev.kg + " × " + r.prev.reps : "—"}</td><td>${r.prev ? (up ? pill("good", "Sube") : down ? pill("warn", "Baja") : pill("neutral", "Igual")) : ""}</td></tr>`; }).join("")}
    </tbody></table></div>` : `<div class="empty">Añade ejercicios con series, reps y kg al registrar un entreno para ver tu progresión.</div>`}
  </section>`;
}

function funnel(steps) {
  const max = Math.max(1, ...steps.map((s) => s[1]));
  let h = "";
  steps.forEach(([l, v], i) => {
    if (i) { const p = steps[i - 1][1]; h += `<div class="conv">↓ ${p ? pct(v / p) : "—"}</div>`; }
    h += `<div class="fstep"><span class="fl">${l}</span><div class="fb"><i style="width:${(v / max) * 100}%"></i></div><span class="fv">${v}</span></div>`;
  });
  return `<div class="funnel">${h}</div>`;
}
function vProj() {
  const c = C(), t = todayKey(), cw = curWeek(), wd = weekData(cw), ta = c.semanal.autos, ti = c.semanal.ia;
  const ctd = daysBetween(c.inicio, t < cycleEnd() ? t : cycleEnd());
  const au = { contenido: 0, leads: 0, seguimientos: 0, citas: 0, ventas: 0, utilidad: 0 }, ia = { prospectos: 0, conversaciones: 0, problemas: 0, demos: 0, propuestas: 0, clientes: 0 }; let mrr = null;
  if (t >= c.inicio) for (const k of ctd) { const d = D(k); for (const x in au) au[x] += Number(d.autos?.[x]) || 0; for (const x in ia) ia[x] += Number(d.ia?.[x]) || 0; if (d.ia?.mrr != null) mrr = d.ia.mrr; }
  const weeks = []; for (let i = 1; i <= Math.min(cw, numWeeks()); i++) weeks.push(weekData(i));
  return `${banner()}
  <div class="phead"><div><div class="eyebrow">Medir el camino hasta la venta, no solo las views</div><h1 style="margin-top:6px">Proyectos</h1></div>
    <div class="row"><button class="btn primary" data-act="sheet" data-s="kpi" data-p="autos">+ KPI Autos</button><button class="btn" data-act="sheet" data-s="kpi" data-p="ia">+ KPI IA</button></div></div>
  <div class="grid g2">
    <section class="card"><h2>Autos · semana ${cw} ${pill("good", "Activo")}</h2>
      <div class="stack">${AUTOS_K.map(([k, l]) => meter(l, wd.au[k], ta[k], `${wd.au[k]} / ${ta[k]}`, wd.au[k] >= ta[k] ? "good" : "")).join("")}
      <div class="row between"><span>Utilidad total · tu ${Math.round(c.autosShare * 100)}%</span><b class="num" style="font-size:20px">${money(wd.au.utilidad)} · ${money(wd.au.utilidad * c.autosShare)}</b></div></div>
      <div class="small muted" style="margin-top:8px">Meta de diciembre: intentar 2 ventas por semana. Es un objetivo, no un resultado garantizado.</div>
    </section>
    <section class="card"><h2>IA · semana ${cw} ${pill("accent", "Validación")}</h2>
      <div class="stack">${[["prospectos", "Prospectos"], ["conversaciones", "Conversaciones"], ["problemas", "Problemas repetidos"], ["demos", "Demos"]].map(([k, l]) => meter(l, wd.ia[k], ti[k], `${wd.ia[k]} / ${ti[k]}`, wd.ia[k] >= ti[k] ? "good" : "")).join("")}
      <div class="row between"><span>Propuestas · clientes · MRR</span><b class="num" style="font-size:20px">${wd.ia.propuestas} · ${wd.ia.clientes} · ${money(mrr)}</b></div></div>
      <div class="small muted" style="margin-top:8px">La métrica principal es el aprendizaje comercial hasta encontrar un problema por el que alguien pague.</div>
    </section>
    <section class="card"><h2>Embudo Autos · ciclo</h2>${funnel([["Contenido", au.contenido], ["Leads", au.leads], ["Seguimientos", au.seguimientos], ["Citas", au.citas], ["Ventas", au.ventas]])}
      <div class="row" style="margin-top:12px;gap:16px"><span class="small">Lead → cita <b>${pct(sdiv(au.citas, au.leads))}</b></span><span class="small">Cita → venta <b>${pct(sdiv(au.ventas, au.citas))}</b></span><span class="small">Lead → venta <b>${pct(sdiv(au.ventas, au.leads))}</b></span></div>
      <div class="row between" style="margin-top:10px"><span>Utilidad del ciclo · tu parte</span><b class="num" style="font-size:22px">${money(au.utilidad * c.autosShare)}</b></div>
    </section>
    <section class="card"><h2>Embudo IA · ciclo</h2>${funnel([["Prospectos", ia.prospectos], ["Conversaciones", ia.conversaciones], ["Problemas", ia.problemas], ["Demos", ia.demos], ["Propuestas", ia.propuestas], ["Clientes", ia.clientes]])}
      <div class="row between" style="margin-top:12px"><span>MRR actual</span><b class="num" style="font-size:22px">${money(mrr)}</b></div>
    </section>
  </div>
  <section class="card"><h2>Por semana</h2>
    ${weeks.length && t >= c.inicio ? `<div class="tbl-wrap"><table><thead><tr><th>Sem</th><th class="r">Contenido</th><th class="r">Leads</th><th class="r">Seguim.</th><th class="r">Citas</th><th class="r">Ventas</th><th class="r">Tu utilidad</th><th class="r">Prospectos IA</th><th class="r">Conversac.</th><th class="r">Demos</th></tr></thead><tbody>
    ${weeks.map((w) => `<tr class="${w.n === cw ? "cur" : ""}"><td>${w.n}</td><td class="r">${w.au.contenido}</td><td class="r">${w.au.leads}</td><td class="r">${w.au.seguimientos}</td><td class="r">${w.au.citas}</td><td class="r">${w.au.ventas}</td><td class="r">${money(w.au.utilidad * c.autosShare)}</td><td class="r">${w.ia.prospectos}</td><td class="r">${w.ia.conversaciones}</td><td class="r">${w.ia.demos}</td></tr>`).join("")}
    </tbody></table></div>` : `<div class="empty">Las semanas aparecerán aquí cuando empiece el ciclo.</div>`}
  </section>`;
}

function vSemana() {
  const c = C(), n = S.week || curWeek(), wd = weekData(n), ws = weekScore(wd), rv = wd.review, wk = weakest(ws), fs = finState(wd.b);
  const past = Object.values(S.reviews).sort((a, b) => b.semana - a.semana);
  return `${banner()}
  <div class="phead"><div><div class="eyebrow">Semana ${n} de ${numWeeks()} · ${fmtDate(wd.a)} → ${fmtDate(wd.b)} · ${phaseOfWeek(n).name}</div><h1 style="margin-top:6px">Score semanal</h1></div>
    <div class="datenav"><button class="btn sm" data-act="wk" data-d="-1" ${n <= 1 ? "disabled" : ""} aria-label="Semana anterior">‹</button><span class="pill neutral">S${n}</span><button class="btn sm" data-act="wk" data-d="1" ${n >= numWeeks() ? "disabled" : ""} aria-label="Semana siguiente">›</button></div></div>
  <div class="grid g-main">
    <section class="card">
      <div class="hero"><div><div class="eyebrow">Acciones controlables</div><div class="bigscore num" style="margin-top:10px">${wd.started ? ws.total : "—"}<small> / 100</small></div></div>
      <div>${wd.started ? pill(statusOf(ws.total), statusLabel(ws.total)) : pill("neutral", "Aún no empieza")}<div class="msg">${wd.started ? statusMsg(ws.total) : "Esta semana todavía no empieza."}</div></div></div>
      ${wd.started ? `<div class="note" style="margin-top:14px">${wk.name} fue tu pilar más débil (${Math.round(wk.pts)}/${wk.max}). La próxima semana, conviértelo en la primera tarea.</div>` : ""}
      <div class="hr" style="margin:16px 0"></div>
      <div class="stack" style="gap:18px">${ws.pillars.map((p) => `<div><div class="row between"><b>${p.name}</b><span class="num" style="font-size:18px">${Math.round(p.pts)}<small class="muted" style="font-size:12px"> / ${p.max}</small></span></div>
        <div class="stack" style="gap:6px;margin-top:8px">${p.items.map(([l, v, m, dt]) => meter(l, v, m, `${dt} · ${Math.round(v * 10) / 10}/${m}`, v >= m ? "good" : "")).join("")}</div></div>`).join("")}</div>
      <div class="small muted" style="margin-top:12px">Puntos proporcionales al avance dentro de cada rubro. Los objetivos se editan en Ajustes.</div>
    </section>
    <div class="stack" style="gap:16px">
      <section class="card"><h2>Revisión del domingo · 20 min</h2>
        ${rv ? `<div class="stack"><div class="row">${pill("good", "Semana cerrada")}<span class="small muted">Guardada ${fmtDate(rv.fecha)}</span></div>
          <div class="facts"><div><span class="eyebrow">Score</span><b>${rv.score}</b></div><div><span class="eyebrow">Capital</span><b>${money(rv.capital)}</b></div><div><span class="eyebrow">Peso</span><b>${rv.pesoProm != null ? f1(rv.pesoProm) : "—"}</b></div></div>
          ${rv.error ? `<div><div class="eyebrow">Mayor error</div><div>${esc(rv.error)}</div></div>` : ""}
          ${rv.funciono ? `<div><div class="eyebrow">Qué funcionó</div><div>${esc(rv.funciono)}</div></div>` : ""}
          ${rv.dejar ? `<div><div class="eyebrow">Qué elimino</div><div>${esc(rv.dejar)}</div></div>` : ""}
          <div><div class="eyebrow">Top 3 próxima semana</div><ol style="margin:4px 0 0;padding-left:18px">${(rv.prioridades || []).filter(Boolean).map((x) => `<li>${esc(x)}</li>`).join("")}</ol></div>
          <button class="btn sm" data-act="review" data-n="${n}">Editar revisión</button></div>`
        : `<div class="stack"><div class="muted">10 pasos: dinero, score, físico, Autos, IA, errores, lo que funcionó, qué dejar y tus 3 prioridades.</div><button class="btn primary" data-act="review" data-n="${n}" ${wd.started ? "" : "disabled"}>Cerrar la semana</button></div>`}
      </section>
      <section class="card"><h2>Resumen</h2>
        <div class="stack small">
          <div class="row between"><span>Ingresos</span><b class="tab">${money(wd.inc)}</b></div>
          <div class="row between"><span>Gastos</span><b class="tab">${money(wd.exp)}</b></div>
          <div class="row between"><span>Ahorro</span><b class="tab">${money(wd.sav)}</b></div>
          <div class="row between"><span>Capital al cierre</span><b class="tab">${money(fs.capital)}</b></div>
          <div class="row between"><span>Score diario promedio</span><b class="tab">${wd.dayAvg != null ? f1(wd.dayAvg) : "—"}</b></div>
          <div class="row between"><span>Días con deep work</span><b class="tab">${wd.deepDays}/${wd.len}</b></div>
        </div>
      </section>
    </div>
  </div>
  <section class="card"><h2>Revisiones guardadas</h2>
    ${past.length ? `<div class="tbl-wrap"><table><thead><tr><th>Sem</th><th class="r">Score</th><th class="r">Capital</th><th class="r">Peso</th><th>Qué elimino</th><th>Top 3</th></tr></thead><tbody>
    ${past.map((r) => `<tr><td>${r.semana}</td><td class="r">${pill(statusOf(r.score), String(r.score))}</td><td class="r">${money(r.capital)}</td><td class="r">${r.pesoProm != null ? f1(r.pesoProm) : "—"}</td><td>${esc(r.dejar || "—")}</td><td>${(r.prioridades || []).filter(Boolean).map(esc).join(" · ")}</td></tr>`).join("")}
    </tbody></table></div>` : `<div class="empty">Tu primera revisión aparecerá aquí al cerrar la semana.</div>`}
  </section>`;
}

function vPlan() {
  const c = C(), cw = curWeek(), n = numWeeks(), t = todayKey();
  const rows = []; for (let i = 1; i <= n; i++) rows.push(weekData(i));
  return `${banner()}
  <div class="phead"><div><div class="eyebrow">No necesitas ganar todo; necesitas llegar a cada checkpoint</div><h1 style="margin-top:6px">Plan de 90 días</h1></div><span class="pill neutral">Semana ${cw} · ${phaseOfWeek(cw).name}</span></div>
  <div class="timeline">${PHASES.map((p) => { const done = p.items.filter((_, i) => c.hitos[p.id + i]).length, cur = cw >= p.w[0] && cw <= p.w[1];
    return `<div class="ph ${cur ? "cur" : ""}"><div class="eyebrow">Sem ${p.w[0]}–${p.w[1]}${cur ? " · Ahora" : ""}</div><div class="nm">${p.name}</div><div class="small muted">${p.desc}</div>
    <div class="stack" style="gap:6px">${p.items.map((it, i) => `<label><input type="checkbox" id="h-${p.id}${i}" data-bind="hito" data-id="${p.id + i}" ${c.hitos[p.id + i] ? "checked" : ""}>${esc(it)}</label>`).join("")}</div>
    <div class="small" style="margin-top:auto"><b>${done}/${p.items.length}</b> completados</div></div>`; }).join("")}</div>
  <section class="card"><h2>Plantilla semanal <span class="eyebrow">Se llena sola con tus registros</span></h2>
    <div class="tbl-wrap"><table><thead><tr><th>Semana</th><th class="r">Score</th><th class="r">Capital</th><th class="r">Peso prom.</th><th class="r">Gym</th><th class="r">Run</th><th class="r">Autos leads</th><th class="r">Autos ventas</th><th class="r">IA acciones</th><th class="r">IA conversac.</th><th>Top 3</th></tr></thead><tbody>
    ${rows.map((w) => { const s = w.started ? weekScore(w).total : null; return `<tr class="${w.n === cw ? "cur" : ""}"><td>${w.n} <span class="muted small">${fmtDate(w.a)}</span></td><td class="r">${s != null ? pill(statusOf(s), String(s)) : "—"}</td><td class="r">${w.started ? money(finState(w.b < t ? w.b : t).capital) : "—"}</td><td class="r">${w.wAvg != null ? f1(w.wAvg) : "—"}</td><td class="r">${w.started ? w.gym + "/" + c.metas.gym : "—"}</td><td class="r">${w.started ? w.runs + "/" + c.metas.runsMax : "—"}</td><td class="r">${w.started ? w.au.leads : "—"}</td><td class="r">${w.started ? w.au.ventas : "—"}</td><td class="r">${w.started ? w.ia.prospectos + w.ia.conversaciones : "—"}</td><td class="r">${w.started ? w.ia.conversaciones : "—"}</td><td class="small">${(w.review?.prioridades || []).filter(Boolean).map(esc).join(" · ") || ""}</td></tr>`; }).join("")}
    </tbody></table></div>
  </section>
  <div class="grid g2">
    <section class="card"><h2>Semáforo de progreso</h2>
      <div class="stack">
        <div class="note good"><b>85–100 · Verde.</b> Capital creciendo, entrenamiento cumplido, proyectos generando evidencia.</div>
        <div class="note warn"><b>70–84 · Amarillo.</b> Algún área se queda atrás. Corrígela la semana siguiente.</div>
        <div class="note bad"><b>&lt;70 · Rojo.</b> Reduce complejidad. Vuelve a las acciones básicas. No añadas objetivos nuevos.</div>
      </div>
    </section>
    <section class="card"><h2>Tu regla</h2>
      <div class="brand" style="font-size:26px;line-height:1.05">SHOW UP.<br>DO THE WORK.<br>LOG THE RESULT.</div>
      <div class="muted" style="margin-top:10px">La motivación viene después de la evidencia. No medir cómo te sientes: medir qué hiciste.</div>
    </section>
  </div>
  <section class="card"><h2>Identidad</h2>
    <div class="ident">${[["DISCIPLINE", "Hago lo que dije que haría."], ["CAPITAL", "Conservo y acumulo recursos."], ["BODY", "Entreno y como para construir."], ["BUSINESS", "Creo sistemas que producen."], ["EXPERIENCE", "Viajo sin sabotear mi futuro."]].map(([a, b]) => `<div><b>${a}</b><span class="small muted">${b}</span></div>`).join("")}</div>
  </section>`;
}

function vAjustes() {
  const c = C(), m = c.metas, f = c.finanzas, sa = c.semanal.autos, si = c.semanal.ia;
  const inp = (name, val, label, opt = {}) => `<div class="field ${opt.full ? "full" : ""}"><label for="s-${name}">${label}</label><input id="s-${name}" name="${name}" type="${opt.type || "number"}" ${opt.step ? `step="${opt.step}"` : 'step="any"'} value="${val ?? ""}" ${opt.ph ? `placeholder="${opt.ph}"` : ""}>${opt.hint ? `<span class="hint">${opt.hint}</span>` : ""}</div>`;
  const months = Object.keys(c.meses).sort();
  return `${banner()}
  <div class="phead"><div><div class="eyebrow">Todo es editable. Nada es un hecho fijo</div><h1 style="margin-top:6px">Ajustes</h1></div></div>
  <form id="settingsForm" class="stack" style="gap:16px">
    <fieldset><legend>Ciclo</legend><div class="fgrid">
      ${inp("ciclo", esc(c.ciclo), "Nombre del ciclo", { type: "text" })}
      ${inp("inicio", c.inicio, "Fecha de inicio", { type: "date", hint: `Termina el ${fmtDate(cycleEnd(), true)} (${c.dias} días)` })}
      ${inp("bloqueTrabajo", esc(c.bloqueTrabajo), "Bloque de trabajo (reservado)", { type: "text" })}
    </div></fieldset>
    <fieldset><legend>Metas diarias y físicas</legend><div class="fgrid">
      ${inp("metas.cal", m.cal, "Calorías (kcal/día)")}
      ${inp("metas.calTol", Math.round(m.calTol * 100), "Tolerancia de calorías (%)")}
      ${inp("metas.protMin", m.protMin, "Proteína mínima (g)")}
      ${inp("metas.protMax", m.protMax, "Proteína máxima (g)")}
      ${inp("metas.gym", m.gym, "Sesiones de gym por semana")}
      ${inp("metas.runsMin", m.runsMin, "Runs mínimos por semana")}
      ${inp("metas.runsMax", m.runsMax, "Runs objetivo por semana")}
      ${inp("metas.deepMin", m.deepMin, "Deep work diario (min)")}
      ${inp("metas.comercialMin", m.comercialMin, "Acciones comerciales diarias")}
    </div></fieldset>
    <fieldset><legend>Finanzas</legend><div class="fgrid">
      ${inp("finanzas.liquidezInicial", f.liquidezInicial, "Capital líquido al inicio (USD)")}
      ${inp("finanzas.deudaInicial", f.deudaInicial, "Deuda al inicio (USD)")}
      ${inp("finanzas.pagoDeuda", f.pagoDeuda, "Pago mensual de deuda")}
      ${inp("finanzas.gastosFijos", f.gastosFijos, "Gastos fijos mensuales")}
      ${inp("finanzas.gastoVariable", f.gastoVariable, "Plan de gasto variable mensual")}
      <div class="field"><label for="s-restar">Capital</label><select id="s-restar" name="finanzas.restarDeuda"><option value="1" ${f.restarDeuda ? "selected" : ""}>Capital = liquidez − deuda</option><option value="0" ${f.restarDeuda ? "" : "selected"}>Capital = liquidez (sin restar deuda)</option></select></div>
    </div></fieldset>
    <fieldset><legend>Metas mensuales</legend>
      <div class="tbl-wrap"><table><thead><tr><th>Mes</th><th>Ingreso mín.</th><th>Ingreso máx.</th><th>Ahorro mín.</th><th>Ahorro máx.</th></tr></thead><tbody>
      ${months.map((mo) => { const p = c.meses[mo]; return `<tr><td><b>${MONL[Number(mo.slice(5)) - 1]}</b></td>${["ingMin", "ingMax", "ahMin", "ahMax"].map((x) => `<td><input class="btn sm" style="width:100px;font-weight:500" type="number" step="any" id="s-${mo}-${x}" name="meses.${mo}.${x}" value="${p[x] ?? ""}" placeholder="Dato faltante"></td>`).join("")}</tr>`; }).join("")}
      </tbody></table></div>
    </fieldset>
    <fieldset><legend>Objetivos semanales de proyectos</legend><div class="fgrid">
      ${AUTOS_K.map(([k, l]) => inp("semanal.autos." + k, sa[k], "Autos · " + l)).join("")}
      ${inp("autosShare", Math.round(c.autosShare * 100), "Tu parte de la utilidad de Autos (%)")}
      ${[["prospectos", "Prospectos"], ["conversaciones", "Conversaciones"], ["problemas", "Problemas validados"], ["demos", "Demos / propuestas / clientes"]].map(([k, l]) => inp("semanal.ia." + k, si[k], "IA · " + l)).join("")}
    </div></fieldset>
    <fieldset><legend>Agenda semanal por defecto</legend><div class="fgrid">
      ${[1, 2, 3, 4, 5, 6, 0].map((d) => `<div class="field"><label for="s-ag${d}">${DOW[d].replace(/^./, (x) => x.toUpperCase())}</label><input id="s-ag${d}" type="text" name="agenda.${d}" value="${esc((c.agenda[String(d)] || []).join(", "))}"><span class="hint">Separa con comas</span></div>`).join("")}
    </div></fieldset>
    <div id="settingsErr" class="err" hidden></div>
    <div class="row"><button class="btn primary" type="submit">Guardar ajustes</button><button class="btn" type="button" data-act="export">Exportar datos (JSON)</button><button class="btn ghost" type="button" data-act="logout">Cerrar sesión${S.user?.email ? " · " + esc(S.user.email) : ""}</button></div>
  </form>`;
}

/* ---------- Sheets ---------- */
let sheetSubmit = null;
function openSheet(title, body, onSubmit, submitLabel = "Guardar") {
  document.getElementById("sheetTitle").textContent = title;
  const f = document.getElementById("sheetForm");
  f.innerHTML = body + (onSubmit ? `<div class="err" id="sheetErr" hidden></div><div class="sheet-foot"><button class="btn" type="button" data-act="closeSheet">Cancelar</button><button class="btn primary" type="submit">${submitLabel}</button></div>` : "");
  sheetSubmit = onSubmit;
  document.getElementById("sheet").hidden = false;
  setTimeout(() => f.querySelector("input:not([type=hidden]),select,textarea")?.focus(), 30);
}
function closeSheet() { document.getElementById("sheet").hidden = true; sheetSubmit = null; }
function sheetErr(msg) { const e = document.getElementById("sheetErr"); if (e) { e.textContent = msg; e.hidden = false; } }
const dateField = (k) => `<div class="field"><label for="f-fecha">Fecha</label><input id="f-fecha" name="fecha" type="date" value="${k || S.date}" required></div>`;
const fld = (name, label, opt = {}) => `<div class="field ${opt.full ? "full" : ""}"><label for="f-${name}">${label}</label><input id="f-${name}" name="${name}" type="${opt.type || "number"}" ${opt.type === "text" ? "" : 'inputmode="decimal" step="any"'} value="${esc(opt.v ?? "")}" ${opt.ph ? `placeholder="${esc(opt.ph)}"` : ""}>${opt.hint ? `<span class="hint">${opt.hint}</span>` : ""}</div>`;
const sel = (name, label, opts, v) => `<div class="field"><label for="f-${name}">${label}</label><select id="f-${name}" name="${name}">${opts.map(([a, b]) => `<option value="${esc(a)}" ${a === v ? "selected" : ""}>${esc(b)}</option>`).join("")}</select></div>`;
const exRow = (e = {}) => `<div class="exrow"><div class="field"><label>Ejercicio</label><input name="exN" type="text" value="${esc(e.nombre || "")}" placeholder="Press banca"></div><div class="field"><label>Series</label><input name="exS" type="number" inputmode="numeric" value="${e.series ?? ""}"></div><div class="field"><label>Reps</label><input name="exR" type="number" inputmode="numeric" value="${e.reps ?? ""}"></div><div class="field"><label>kg</label><input name="exK" type="number" inputmode="decimal" step="any" value="${e.kg ?? ""}"></div><button type="button" class="iconbtn" data-act="rmEx" aria-label="Quitar">✕</button></div>`;

const SHEETS = {
  tx(ds) {
    const tipo = ds.t || "gasto", trips = Object.entries(S.trips);
    openSheet(tipo === "ingreso" ? "Registrar ingreso" : "Registrar gasto", `<div class="fgrid">
      ${sel("tipo", "Tipo", TX_TYPES, tipo)}
      ${fld("monto", "Monto (USD)", { ph: "0.00" })}
      ${sel("cat", "Categoría", TX_CATS.map((x) => [x, x]), tipo === "ingreso" ? "Negocio" : ds.trip ? "Viaje" : "Comida")}
      ${sel("clase", "Clase de gasto", TX_CLASS, ds.trip ? "viaje" : "variable")}
      ${fld("desc", "Descripción", { type: "text", full: true, ph: "Qué fue" })}
      ${trips.length ? sel("trip", "Viaje (opcional)", [["", "Ninguno"], ...trips.map(([id, t]) => [id, t.destino])], ds.trip || "") : ""}
      ${dateField()}
    </div><div class="small muted">Las transferencias entre tus cuentas no cambian el capital. Registrar lo real, no lo esperado.</div>`, (fd) => {
      const monto = num(fd.get("monto")); if (!monto || monto <= 0) return sheetErr("Escribe un monto mayor que 0.");
      const k = fd.get("fecha"); if (!k) return sheetErr("Elige una fecha.");
      const t = { id: crypto.randomUUID(), tipo: fd.get("tipo"), monto, cat: fd.get("cat"), clase: fd.get("clase"), desc: (fd.get("desc") || "").trim(), trip: fd.get("trip") || null };
      upDay(k, (d) => { d.tx = [...(d.tx || []), t]; if (t.tipo === "gasto") d.sinGastos = false; });
      toast(t.tipo === "ingreso" ? "Ingreso registrado" : "Movimiento registrado"); return true;
    });
  },
  peso() {
    const d = D(S.date);
    openSheet("Peso y cintura", `<div class="fgrid">${fld("peso", "Peso (kg)", { v: d.peso ?? "", ph: "66.0" })}${fld("cintura", "Cintura (cm, opcional)", { v: d.cintura ?? "", hint: "1 vez por semana, mismo momento" })}${dateField()}</div>`, (fd) => {
      const p = num(fd.get("peso")), w = num(fd.get("cintura")), k = fd.get("fecha");
      if (p == null && w == null) return sheetErr("Escribe al menos el peso o la cintura.");
      if (p != null && (p < 30 || p > 250)) return sheetErr("El peso debe estar entre 30 y 250 kg.");
      upDay(k, (d) => { if (p != null) d.peso = p; if (w != null) d.cintura = w; }); toast("Medición registrada"); return true;
    });
  },
  workout() {
    const d = D(S.date), w = d.workout || {}, ag = C().agenda[String(parseK(S.date).getDay())] || [];
    const guess = w.tipo || (ag[0] && /upper/i.test(ag[0]) ? "Upper A" : ag[0] && /lower/i.test(ag[0]) ? "Lower A" : ag[0] && /arms|delts/i.test(ag[0]) ? "Arms/Delts" : "Custom");
    const types = WORKOUTS.includes(guess) ? WORKOUTS : [guess, ...WORKOUTS];
    openSheet("Registrar entreno", `<div class="fgrid">${sel("tipo", "Tipo", types.map((x) => [x, x]), guess)}${fld("min", "Duración (min)", { v: w.min ?? "" })}${dateField()}</div>
      <div class="stack" id="exList">${(w.ejercicios?.length ? w.ejercicios : [{}]).map(exRow).join("")}</div>
      <button type="button" class="btn sm" data-act="addEx">+ Ejercicio</button>`, (fd) => {
      const names = fd.getAll("exN"), s = fd.getAll("exS"), r = fd.getAll("exR"), kg = fd.getAll("exK");
      const ej = names.map((n, i) => ({ nombre: n.trim(), series: num(s[i]), reps: num(r[i]), kg: num(kg[i]) })).filter((e) => e.nombre);
      upDay(fd.get("fecha"), (d) => { d.workout = { tipo: fd.get("tipo"), min: num(fd.get("min")), ejercicios: ej }; }); toast("Entreno registrado"); return true;
    });
  },
  run() {
    const d = D(S.date), r = d.run || {};
    openSheet("Registrar run", `<div class="fgrid">${fld("km", "Distancia (km)", { v: r.km ?? "" })}${fld("min", "Duración (min)", { v: r.min ?? "" })}${fld("fc", "FC promedio (opcional)", { v: r.fc ?? "" })}${dateField()}</div>`, (fd) => {
      const km = num(fd.get("km")), min = num(fd.get("min"));
      if (km != null && km <= 0) return sheetErr("La distancia debe ser mayor que 0.");
      upDay(fd.get("fecha"), (d) => { d.run = { km, min, fc: num(fd.get("fc")) }; }); toast("Run registrado"); return true;
    });
  },
  nut() {
    const d = D(S.date), m = C().metas;
    openSheet("Nutrición del día", `<div class="fgrid">${fld("cal", "Calorías totales", { v: d.cal ?? "", hint: `Objetivo ~${m.cal.toLocaleString("en-US")} kcal` })}${fld("prot", "Proteína total (g)", { v: d.prot ?? "", hint: `${m.protMin}–${m.protMax} g` })}${fld("comidas", "Comidas", { v: d.comidas ?? "", hint: "Objetivo: 4" })}${dateField()}</div>`, (fd) => {
      const cal = num(fd.get("cal")), prot = num(fd.get("prot"));
      if (cal == null && prot == null) return sheetErr("Escribe calorías o proteína.");
      upDay(fd.get("fecha"), (d) => { d.cal = cal; d.prot = prot; d.comidas = num(fd.get("comidas")); }); toast("Nutrición registrada"); return true;
    });
  },
  deep() {
    const d = D(S.date);
    openSheet("Deep work", `<div class="fgrid">${fld("min", "Minutos enfocados hoy (total)", { v: d.deepMin ?? "", hint: `Cuenta con ≥ ${C().metas.deepMin} min` })}${dateField()}</div>`, (fd) => {
      const v = num(fd.get("min")); if (v == null || v < 0) return sheetErr("Escribe los minutos (0 o más).");
      upDay(fd.get("fecha"), (d) => (d.deepMin = v)); return true;
    });
  },
  kpi(ds) {
    const p = ds.p === "ia" ? "ia" : "autos", list = p === "ia" ? IA_K : AUTOS_K;
    openSheet(p === "ia" ? "KPI · IA" : "KPI · Autos", `<div class="small muted">Suma lo que hiciste. Se añade a lo ya registrado ese día.</div><div class="fgrid">
      ${list.map(([k, l, h]) => fld(k, l, { hint: h, ph: "0" })).join("")}
      ${p === "autos" ? fld("utilidad", "Utilidad total de ventas (USD)", { hint: `Tu parte: ${Math.round(C().autosShare * 100)}%` }) : fld("mrr", "MRR actual (USD)", { hint: "Reemplaza el valor anterior" })}
      ${dateField()}</div>`, (fd) => {
      const vals = {}; let any = false;
      for (const [k] of list) { const v = num(fd.get(k)); if (v != null) { if (v < 0) return sheetErr("Los valores no pueden ser negativos."); vals[k] = v; any = true; } }
      const extra = p === "autos" ? num(fd.get("utilidad")) : num(fd.get("mrr"));
      if (!any && extra == null) return sheetErr("Escribe al menos un valor.");
      upDay(fd.get("fecha"), (d) => { const o = { ...(d[p] || {}) }; for (const k in vals) o[k] = (Number(o[k]) || 0) + vals[k]; if (extra != null) { if (p === "autos") o.utilidad = (Number(o.utilidad) || 0) + extra; else o.mrr = extra; } d[p] = o; });
      toast("KPI registrado"); return true;
    });
  },
  trip(ds) {
    const id = ds.id, t = id ? S.trips[id] : {};
    openSheet(id ? "Editar viaje" : "Nuevo viaje", `<div class="fgrid">
      ${fld("destino", "Destino", { type: "text", v: t.destino || "" })}
      ${sel("proposito", "Propósito", ["Ocio", "Networking", "Negocio", "Contenido", "Familia", "Mixto"].map((x) => [x, x]), t.proposito || "Mixto")}
      ${fld("inicio", "Inicio", { type: "date", v: t.inicio || "" })}
      ${fld("fin", "Fin", { type: "date", v: t.fin || "" })}
      ${fld("presupuesto", "Presupuesto (USD)", { v: t.presupuesto ?? "" })}
      ${fld("capitalMin", "Condición: capital mínimo (USD)", { v: t.capitalMin ?? "", hint: "Opcional. La app muestra la condición; no decide por ti." })}
      ${fld("condicion", "Otras condiciones", { type: "text", full: true, v: t.condicion || "" })}
      ${sel("decision", "Tu decisión", [["pendiente", "Pendiente"], ["si", "Voy"], ["no", "No voy"]], t.decision || "pendiente")}
      ${sel("estado", "Estado", [["planeado", "Planeado"], ["confirmado", "Confirmado"], ["hecho", "Hecho"], ["descartado", "Descartado"]], t.estado || "planeado")}
    </div>${id ? `<button type="button" class="btn sm ghost" data-act="delTrip" data-id="${id}" style="align-self:flex-start;color:var(--bad)">Borrar viaje</button>` : ""}`, (fd) => {
      const destino = (fd.get("destino") || "").trim(); if (!destino) return sheetErr("Escribe el destino.");
      const ini = fd.get("inicio") || null, fin = fd.get("fin") || null; if (ini && fin && fin < ini) return sheetErr("La fecha de fin es anterior al inicio.");
      const doc = { ...(t || {}), destino, proposito: fd.get("proposito"), inicio: ini, fin, presupuesto: num(fd.get("presupuesto")), capitalMin: num(fd.get("capitalMin")), condicion: (fd.get("condicion") || "").trim(), decision: fd.get("decision"), estado: fd.get("estado") };
      const tid = id || "t" + uid(); S.trips = { ...S.trips, [tid]: doc }; render(); saveTrip(tid, doc); toast("Viaje guardado"); return true;
    });
  }
};

/* ---------- Weekly review wizard ---------- */
let wiz = null;
function openReview(n) {
  const wd = weekData(n), ws = weekScore(wd), rv = wd.review || {}, fs = finState(wd.b), prevCap = finState(addDays(wd.a, -1)).capital;
  wiz = { n, step: 0, wd, ws, fs, prevCap, data: { error: rv.error || "", funciono: rv.funciono || "", dejar: rv.dejar || "", fisNota: rv.fisNota || "", autosNota: rv.autosNota || "", iaNota: rv.iaNota || "", prioridades: rv.prioridades ? [...rv.prioridades] : ["", "", ""] } };
  renderWiz();
}
const WSTEPS = ["¿Cuántos puntos hiciste?", "¿Cuánto capital agregaste?", "¿Qué pasó en lo físico?", "¿Qué produjo Autos?", "¿Qué aprendiste en IA?", "¿Cuál fue el mayor error?", "¿Qué funcionó?", "¿Qué vas a eliminar, delegar o dejar de hacer?", "Tus 3 acciones de mayor impacto para la próxima semana", "Compromiso"];
function renderWiz() {
  const { step, wd, ws, fs, prevCap, data } = wiz, c = C();
  const ta = (name, ph) => `<div class="field"><label for="w-${name}" class="small muted">Nota</label><textarea id="w-${name}" name="${name}" rows="3" placeholder="${ph}">${esc(data[name])}</textarea></div>`;
  let body = `<div class="steps">${WSTEPS.map((_, i) => `<i class="${i <= step ? "on" : ""}"></i>`).join("")}</div><div class="eyebrow">Paso ${step + 1} de 10 · Semana ${wiz.n}</div><h3 style="font-size:17px">${WSTEPS[step]}</h3>`;
  if (step === 0) body += `<div class="facts"><div><span class="eyebrow">Score</span><b>${ws.total}/100</b></div>${ws.pillars.map((p) => `<div><span class="eyebrow">${p.name}</span><b>${Math.round(p.pts)}/${p.max}</b></div>`).join("")}</div><div class="note ${statusOf(ws.total)}">${statusMsg(ws.total)}</div>`;
  if (step === 1) body += `<div class="facts"><div><span class="eyebrow">Entró</span><b>${money(wd.inc)}</b></div><div><span class="eyebrow">Salió</span><b>${money(wd.exp + wd.debt)}</b></div><div><span class="eyebrow">Capital</span><b>${money(fs.capital)}</b></div><div><span class="eyebrow">Cambio</span><b>${fs.capital - prevCap >= 0 ? "+" : ""}${money(fs.capital - prevCap)}</b></div></div>`;
  if (step === 2) body += `<div class="facts"><div><span class="eyebrow">Peso prom.</span><b>${wd.wAvg != null ? f1(wd.wAvg) : "—"}</b></div><div><span class="eyebrow">Cintura</span><b>${wd.waist != null ? f1(wd.waist) : "—"}</b></div><div><span class="eyebrow">Gym</span><b>${wd.gym}/${c.metas.gym}</b></div><div><span class="eyebrow">Run</span><b>${wd.runs}/${c.metas.runsMax}</b></div></div>${ta("fisNota", "Cargas, energía, sueño…")}`;
  if (step === 3) body += `<div class="facts">${AUTOS_K.map(([k, l]) => `<div><span class="eyebrow">${l}</span><b>${wd.au[k]}</b></div>`).join("")}</div>${ta("autosNota", "Contenido → leads → citas → ventas")}`;
  if (step === 4) body += `<div class="facts">${IA_K.slice(0, 4).map(([k, l]) => `<div><span class="eyebrow">${l}</span><b>${wd.ia[k]}</b></div>`).join("")}</div>${ta("iaNota", "Problemas repetidos, objeciones, aprendizajes")}`;
  if (step === 5) body += ta("error", "Sé concreto");
  if (step === 6) body += ta("funciono", "Qué repetir");
  if (step === 7) body += ta("dejar", "Una cosa");
  if (step === 8) body += `<div class="stack">${[0, 1, 2].map((i) => `<div class="field"><label for="w-p${i}">Prioridad ${i + 1}</label><input id="w-p${i}" name="p${i}" type="text" value="${esc(data.prioridades[i] || "")}"></div>`).join("")}</div>`;
  if (step === 9) body += `<div class="facts"><div><span class="eyebrow">Score</span><b>${ws.total}</b></div><div><span class="eyebrow">Capital</span><b>${money(fs.capital)}</b></div></div><div class="stack small">${data.dejar ? `<div><b>Elimino:</b> ${esc(data.dejar)}</div>` : ""}<div><b>Top 3:</b> ${data.prioridades.filter(Boolean).map(esc).join(" · ") || "—"}</div></div><label class="row" style="font-weight:650"><input type="checkbox" id="w-commit" name="commit" ${wiz.commit ? "checked" : ""} style="width:18px;height:18px;accent-color:var(--good)"> Me comprometo con este plan</label>`;
  body += `<div class="err" id="sheetErr" hidden></div><div class="sheet-foot"><button class="btn" type="button" data-act="${step ? "wizBack" : "closeSheet"}">${step ? "Atrás" : "Cancelar"}</button><button class="btn primary" type="submit">${step === 9 ? "Cerrar la semana" : "Siguiente"}</button></div>`;
  openSheet("Revisión del domingo", body, null);
  sheetSubmit = wizNext;
}
function wizCollect() {
  const f = document.getElementById("sheetForm"), fd = new FormData(f);
  for (const k of ["fisNota", "autosNota", "iaNota", "error", "funciono", "dejar"]) if (fd.has(k)) wiz.data[k] = fd.get(k);
  if (fd.has("p0")) wiz.data.prioridades = [0, 1, 2].map((i) => (fd.get("p" + i) || "").trim());
  wiz.commit = fd.get("commit") === "on";
}
function wizNext() {
  wizCollect();
  if (wiz.step === 8 && !wiz.data.prioridades.some(Boolean)) { sheetErr("Escribe al menos una prioridad."); return false; }
  if (wiz.step < 9) { wiz.step++; renderWiz(); return false; }
  if (!wiz.commit) { sheetErr("Marca el compromiso para cerrar la semana."); return false; }
  const { n, ws, wd, fs } = wiz;
  const doc = { semana: n, fecha: todayKey(), score: ws.total, desglose: Object.fromEntries(ws.pillars.map((p) => [p.id, Math.round(p.pts * 10) / 10])), capital: fs.capital, pesoProm: wd.wAvg, gym: wd.gym, runs: wd.runs, autos: wd.au, ia: wd.ia, ...wiz.data, compromiso: true };
  S.reviews = { ...S.reviews, ["w" + pad(n)]: doc }; saveReview(n, doc);
  closeSheet(); render(); toast("Semana cerrada"); return true;
}

/* ---------- Events ---------- */
const ACT = {
  nav: (b) => go(b.dataset.v),
  more: () => openSheet("Más", `<div class="stack">${[["semana", "Semana · score y revisión"], ["plan", "Plan de 90 días"], ["ajustes", "Ajustes"]].map(([v, l]) => `<button type="button" class="btn" style="justify-content:flex-start;padding:14px" data-act="nav" data-v="${v}">${svgI(v)}${l}</button>`).join("")}</div>`, null),
  prevDay: () => { S.date = addDays(S.date, -1); render(); },
  nextDay: () => { S.date = addDays(S.date, 1); render(); },
  todayBtn: () => { S.date = todayKey(); render(); },
  openDay: (b) => { S.date = b.dataset.k; go("hoy"); },
  sheet: (b) => SHEETS[b.dataset.s]?.(b.dataset),
  closeSheet: () => closeSheet(),
  deep: (b) => upDay(S.date, (d) => (d.deepMin = (d.deepMin || 0) + Number(b.dataset.n))),
  com: (b) => upDay(S.date, (d) => (d.comercial = Math.max(0, (d.comercial || 0) + Number(b.dataset.n)))),
  trainQuick: (b) => upDay(S.date, (d) => { if (d.workout) delete d.workout; else d.workout = { tipo: b.dataset.t.replace(/\s*\(.*\)/, ""), min: null, ejercicios: [] }; }),
  runQuick: () => upDay(S.date, (d) => { if (d.run) delete d.run; else d.run = { km: null, min: null }; }),
  sinGastos: () => upDay(S.date, (d) => (d.sinGastos = !d.sinGastos)),
  delTx: (b) => upDay(b.dataset.k, (d) => (d.tx = (d.tx || []).filter((t) => t.id !== b.dataset.id))),
  delField: (b) => upDay(b.dataset.k, (d) => { for (const f of b.dataset.f.split(",")) delete d[f]; }),
  delTrip: (b) => { const id = b.dataset.id; const o = { ...S.trips }; delete o[id]; S.trips = o; closeSheet(); render(); deleteTrip(id); toast("Viaje borrado"); },
  wk: (b) => { S.week = clamp((S.week || curWeek()) + Number(b.dataset.d), 1, numWeeks()); render(); },
  review: (b) => openReview(Number(b.dataset.n)),
  wizBack: () => { wizCollect(); wiz.step--; renderWiz(); },
  addEx: () => document.getElementById("exList").insertAdjacentHTML("beforeend", exRow()),
  rmEx: (b) => b.closest(".exrow").remove(),
  export: async () => {
    const json = JSON.stringify({ exportado: new Date().toISOString(), config: S.cfg, dias: S.days, revisiones: S.reviews, viajes: S.trips }, null, 2);
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([json], { type: "application/json" }));
    a.download = `build-the-next-${todayKey()}.json`;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  },
  logout: async () => { await sb.auth.signOut(); location.hash = ""; location.reload(); }
};
document.addEventListener("click", (e) => {
  const b = e.target.closest("[data-act]"); if (!b || b.disabled) return;
  if (S.readOnly && !["nav", "more", "prevDay", "nextDay", "todayBtn", "openDay", "closeSheet", "wk", "wizBack", "export", "logout"].includes(b.dataset.act)) { toast("Solo lectura"); return; }
  e.preventDefault(); ACT[b.dataset.act]?.(b, e);
});
document.getElementById("sheet").addEventListener("click", (e) => { if (e.target.id === "sheet") closeSheet(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !document.getElementById("sheet").hidden) closeSheet(); });
document.getElementById("sheetForm").addEventListener("submit", (e) => {
  e.preventDefault(); if (!sheetSubmit) return;
  const r = sheetSubmit(new FormData(e.target)); if (r === true && sheetSubmit !== wizNext) closeSheet();
});
const BIND = {
  pri: () => upDay(S.date, (d) => (d.prioridades = [0, 1, 2].map((i) => document.getElementById("pr" + i).value.trim()))),
  priDone: (el) => upDay(S.date, (d) => { const a = [...(d.priDone || [false, false, false])]; a[Number(el.dataset.i)] = el.checked; d.priDone = a; if (!(d.prioridades || []).some(Boolean)) d.prioridades = [0, 1, 2].map((i) => document.getElementById("pr" + i).value.trim()); }),
  agenda: (el) => upDay(S.date, (d) => { d.agendaDone = { ...(d.agendaDone || {}), [el.dataset.i]: el.checked }; }),
  manana: () => upDay(S.date, (d) => (d.manana = [0, 1, 2].map((i) => document.getElementById("mn" + i).value.trim()))),
  nota: (el) => upDay(S.date, (d) => (d.nota = el.value)),
  txMonth: (el) => { S.txMonth = el.value; render(); },
  hito: (el) => { const n = clone(S.cfg); n.hitos = { ...(n.hitos || {}), [el.dataset.id]: el.checked }; saveCfg(n); }
};
document.addEventListener("change", (e) => {
  const el = e.target; if (!el.dataset?.bind) return;
  if (S.readOnly && el.dataset.bind !== "txMonth") { toast("Solo lectura"); render(); return; }
  BIND[el.dataset.bind]?.(el);
});
document.addEventListener("submit", (e) => {
  if (e.target.id !== "settingsForm") return;
  e.preventDefault();
  const fd = new FormData(e.target), n = clone(S.cfg), err = document.getElementById("settingsErr");
  const setPath = (obj, path, v) => { const ps = path.split("."); let o = obj; for (let i = 0; i < ps.length - 1; i++) { o[ps[i]] = o[ps[i]] || {}; o = o[ps[i]]; } o[ps[ps.length - 1]] = v; };
  for (const [k, v] of fd.entries()) {
    if (k === "ciclo" || k === "bloqueTrabajo") setPath(n, k, String(v).trim() || DEFAULTS[k]);
    else if (k === "inicio") { if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) { err.textContent = "Elige una fecha de inicio válida."; err.hidden = false; return; } n.inicio = v; }
    else if (k.startsWith("agenda.")) setPath(n, k, String(v).split(",").map((x) => x.trim()).filter(Boolean));
    else if (k === "finanzas.restarDeuda") n.finanzas.restarDeuda = v === "1";
    else if (k.startsWith("meses.")) { const [, mo, f] = k.split("."); n.meses[mo] = n.meses[mo] || {}; n.meses[mo][f] = num(v); }
    else { let x = num(v); if (x == null) { err.textContent = "Revisa los campos numéricos: hay uno vacío o inválido."; err.hidden = false; return; } if (k === "metas.calTol" || k === "autosShare") x = x / 100; setPath(n, k, x); }
  }
  err.hidden = true; saveCfg(n); toast("Ajustes guardados");
});
let rz; window.addEventListener("resize", () => { clearTimeout(rz); rz = setTimeout(render, 150); });

/* ---------- Boot ---------- */
(function () { const h = (location.hash || "").slice(1); if (VIEWS.some(([v]) => v === h)) S.view = h; })();
function showApp(on) {
  document.getElementById("login").hidden = on;
  document.getElementById("app").hidden = !on;
  document.getElementById("bottomnav").hidden = !on;
}
async function refresh() {
  if (!S.user || pending) return; // never overwrite edits that are still saving
  try { await loadAll(); S.mode = "db"; } catch (e) { console.error(e); S.mode = "error"; }
  render();
}
async function startSession(user) {
  if (S.user?.id === user.id) return;
  S.user = user; S.mode = "loading"; showApp(true); render();
  await refresh();
}
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value.trim(), msg = document.getElementById("loginMsg"), btn = document.getElementById("loginBtn");
  msg.hidden = false; msg.className = "small";
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { msg.className = "err"; msg.textContent = "Escribe un email válido."; return; }
  btn.disabled = true; msg.textContent = "Enviando…";
  const { error } = await sb.auth.signInWithOtp({ email, options: { emailRedirectTo: location.origin } });
  btn.disabled = false;
  if (error) {
    msg.className = "err";
    msg.textContent = error.status === 429 ? "Se enviaron demasiados correos. Espera unos minutos y vuelve a intentarlo." : "No se pudo enviar el correo: " + error.message;
    return;
  }
  msg.className = "small ok-msg"; msg.textContent = `Listo. Revisa ${email} y abre el link en este dispositivo.`;
});
document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible") refresh(); });
setInterval(() => { if (document.visibilityState === "visible") refresh(); }, 60000);

if (!sb) {
  document.getElementById("login").hidden = false;
  document.getElementById("loginForm").innerHTML = `<div class="note bad">Falta configurar VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY.</div>`;
} else {
  sb.auth.onAuthStateChange((event, session) => {
    if (session?.user) setTimeout(() => startSession(session.user), 0);
    else { S.user = null; showApp(false); }
  });
}
