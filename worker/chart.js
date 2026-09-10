// /api/chart — Swiss Ephemeris (WASM) แทน astrology.buildweb.pro
// คืน format เดิม: { six_points_identity, planets, houses, meta }
import SwissEPH from 'sweph-wasm';
import factory from 'sweph-wasm/wasm/swisseph';
import wasmModule from 'sweph-wasm/dist/wasm/swisseph.wasm';

let swePromise;
function getSwe() {
  swePromise ??= factory({
    instantiateWasm: (imports, cb) => { cb(new WebAssembly.Instance(wasmModule, imports)); return {}; },
  }).then(mod => new SwissEPH(mod));
  return swePromise;
}

const SEFLG_MOSEPH = 4, SEFLG_SPEED = 256;
const FLAGS = SEFLG_MOSEPH | SEFLG_SPEED;

// id ตาม Swiss Ephemeris
const PLANETS = [
  [0, 'อาทิตย์', 'Sun'], [1, 'จันทร์', 'Moon'], [2, 'พุธ', 'Mercury'], [3, 'ศุกร์', 'Venus'],
  [4, 'อังคาร', 'Mars'], [5, 'พฤหัสบดี', 'Jupiter'], [6, 'เสาร์', 'Saturn'], [7, 'ยูเรนัส', 'Uranus'],
  [8, 'เนปจูน', 'Neptune'], [9, 'พลูโต', 'Pluto'], [10, 'ราหู (Mean Node)', 'Node'],
  // Uranian / Hamburg transneptunians
  [40, 'คิวปิโด', 'Cupido'], [41, 'ฮาเดส', 'Hades'], [42, 'ซุส', 'Zeus'], [43, 'โครโนส', 'Kronos'],
  [44, 'อพอลลอน', 'Apollon'], [45, 'แอดเมโทส', 'Admetos'], [46, 'วัลคานุส', 'Vulkanus'], [47, 'โพไซดอน', 'Poseidon'],
];
const SIGNS = ['เมษ', 'พฤษภ', 'เมถุน', 'กรกฎ', 'สิงห์', 'กันย์', 'ตุลย์', 'พิจิก', 'ธนู', 'มังกร', 'กุมภ์', 'มีน'];

const norm = d => ((d % 360) + 360) % 360;
function fmt(lon) {
  lon = norm(lon);
  const signIdx = Math.floor(lon / 30);
  const inSign = lon - signIdx * 30;
  const degree = Math.floor(inSign);
  const minute = Math.floor((inSign - degree) * 60);
  return { longitude: +lon.toFixed(4), sign: SIGNS[signIdx], sign_index: signIdx + 1, degree, minute };
}
function houseOf(lon, cusps) {
  // cusps[1..12]
  for (let i = 1; i <= 12; i++) {
    const a = cusps[i], b = cusps[i === 12 ? 1 : i + 1];
    const span = norm(b - a), pos = norm(lon - a);
    if (pos < span) return i;
  }
  return 12;
}

export async function computeChart({ date, time = '12:00', lat = 13.7563, lon = 100.5018, tz = 7, hsys = 'P' }) {
  const swe = await getSwe();
  const [y, m, d] = date.split('-').map(Number);
  const [hh, mm] = time.split(':').map(Number);
  if (!y || !m || !d || Number.isNaN(hh)) throw new Error('date/time invalid');
  const utHour = hh + (mm || 0) / 60 - Number(tz);
  const jd = swe.swe_julday(y, m, d, utHour, 1);

  const planets = {};
  for (const [id, th, en] of PLANETS) {
    try {
      const r = swe.swe_calc_ut(jd, id, FLAGS);
      planets[th] = { ...fmt(r[0]), speed: +r[3].toFixed(4), retrograde: r[3] < 0, en };
    } catch (e) { planets[th] = { error: String(e), en }; }
  }

  const h = swe.swe_houses(jd, Number(lat), Number(lon), hsys);
  const cusps = h.cusps, ascmc = h.ascmc;
  const houses = {};
  for (let i = 1; i <= 12; i++) houses[i] = fmt(cusps[i]);
  for (const k of Object.keys(planets)) if (planets[k].longitude != null) planets[k].house = houseOf(planets[k].longitude, cusps);

  const asc = ascmc[0], mc = ascmc[1];
  const six_points_identity = {
    'จุดเมษ (Aries Point)': fmt(0),
    'ลัคนา (Ascendant)': fmt(asc),
    'เมอริเดียน (MC)': fmt(mc),
    'อาทิตย์ (Sun)': fmt(planets['อาทิตย์'].longitude),
    'จันทร์ (Moon)': fmt(planets['จันทร์'].longitude),
    'ราหู (Node)': fmt(planets['ราหู (Mean Node)'].longitude),
  };

  return {
    meta: { date, time, lat: Number(lat), lon: Number(lon), tz: Number(tz), jd_ut: jd, house_system: hsys, ephemeris: 'swisseph-moshier' },
    six_points_identity, planets, houses,
  };
}
