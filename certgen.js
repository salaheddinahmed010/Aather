/* مولّد شهادات آثر: يكتب الاسم والنتيجة والتاريخ والوقت فوق صورة الشهادة (base64 في certs.js) */
window.makeCert = async function (c) {
  const img = new Image(); img.src = CERT_IMGS[c.type];
  await img.decode(); await document.fonts.load("700 40px Cairo");
  const W = img.width, H = img.height, k = W / 1376;
  const cv = document.createElement("canvas"); cv.width = W; cv.height = H;
  const g = cv.getContext("2d"); g.drawImage(img, 0, 0);
  g.direction = "rtl"; g.textBaseline = "middle";
  if (c.type === "daily") { const p = g.getImageData(400 * k, 478 * k, 1, 1).data; g.fillStyle = `rgb(${p[0]},${p[1]},${p[2]})`; g.fillRect(420 * k, 452 * k, 540 * k, 54 * k); } /* تغطية سطر النتيجة المكتوب مثالًا */
  const fri = c.type === "friday", ink = fri ? "#5a3d00" : "#1f4d3a";
  const pct = Math.round(c.score / c.total * 100);
  const t = (s, x, y, size, col, al) => { g.font = `700 ${size * k}px Cairo`; g.fillStyle = col; g.textAlign = al || "center"; g.fillText(s, x * W, y * H); };
  const P = fri
    ? { name: [.5, .535], date: [.655, .482], res: [.5, .60] }
    : { name: [.5, .39], date: [.650, .5625], res: [.5, .622], pct: [.461, .68] };
  t(c.name, ...P.name, 46, ink);
  t(`${c.dateStr} — ${c.timeStr}`, ...P.date, 25, ink, "right");
  if (fri) t(`النتيجة: ${c.score} / ${c.total}  ·  نسبة النجاح: ${pct}%`, ...P.res, 30, ink);
  else { t(`النتيجة: ${c.score} / ${c.total}`, ...P.res, 34, ink); t(`${pct}%`, ...P.pct, 30, "#a67c1f", "right"); }
  return cv.toDataURL("image/png");
};
