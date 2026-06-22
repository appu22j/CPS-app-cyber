const vehicles = [
  { id: "threewheeler", name: "3 Wheeler Tempo", type: "Small city", length: 152, width: 122, height: 122, payload: 500, bestFor: "small local delivery", color: "#00a6c8" },
  { id: "tataace", name: "Tata Ace", type: "Mini truck", length: 214, width: 143, height: 137, payload: 750, bestFor: "light cartons", color: "#16a34a" },
  { id: "mahindrajeeto", name: "Mahindra Jeeto", type: "Mini truck", length: 193, width: 140, height: 129, payload: 700, bestFor: "city dispatch", color: "#f59e0b" },
  { id: "dost", name: "Ashok Leyland Dost", type: "Pickup", length: 250, width: 162, height: 155, payload: 1250, bestFor: "medium cartons", color: "#2563eb" },
  { id: "bolero", name: "Bolero Pickup", type: "Pickup", length: 244, width: 170, height: 160, payload: 1500, bestFor: "daily market load", color: "#7c3aed" },
  { id: "boleromaxi", name: "Bolero Maxitruck", type: "Pickup", length: 265, width: 170, height: 170, payload: 1700, bestFor: "bulk city load", color: "#e11d48" },
  { id: "supro", name: "Mahindra Supro", type: "Mini truck", length: 230, width: 154, height: 135, payload: 900, bestFor: "small cartons", color: "#14b8a6" },
  { id: "intra", name: "Tata Intra V30", type: "Pickup", length: 269, width: 160, height: 150, payload: 1300, bestFor: "balanced load", color: "#f97316" },
  { id: "tata407", name: "Tata 407", type: "Light truck", length: 304, width: 198, height: 198, payload: 2500, bestFor: "shop stock transfer", color: "#00a6c8" },
  { id: "canter10", name: "10 ft Canter", type: "Light truck", length: 305, width: 198, height: 198, payload: 3000, bestFor: "compact bulk load", color: "#16a34a" },
  { id: "truck12", name: "12 ft Truck", type: "Light truck", length: 366, width: 198, height: 198, payload: 3500, bestFor: "mid-size cargo", color: "#f59e0b" },
  { id: "eicher14", name: "14 ft Eicher", type: "Medium truck", length: 427, width: 213, height: 213, payload: 4500, bestFor: "warehouse dispatch", color: "#2563eb" },
  { id: "truck15", name: "15 ft Truck", type: "Medium truck", length: 457, width: 213, height: 213, payload: 5200, bestFor: "large carton load", color: "#7c3aed" },
  { id: "truck17", name: "17 ft Truck", type: "Large truck", length: 518, width: 229, height: 229, payload: 6500, bestFor: "heavy cartons", color: "#e11d48" },
  { id: "truck19", name: "19 ft Truck", type: "Large truck", length: 579, width: 229, height: 229, payload: 8500, bestFor: "large dispatch", color: "#14b8a6" },
  { id: "container20", name: "20 ft Container", type: "Container", length: 589, width: 235, height: 239, payload: 21000, bestFor: "containerized cargo", color: "#f97316" },
  { id: "container24", name: "24 ft Container", type: "Container", length: 731, width: 235, height: 239, payload: 24000, bestFor: "long route load", color: "#00a6c8" },
  { id: "truck22", name: "22 ft Truck", type: "Large truck", length: 671, width: 244, height: 244, payload: 12000, bestFor: "high volume cargo", color: "#16a34a" },
  { id: "truck32sxl", name: "32 ft SXL", type: "Heavy truck", length: 975, width: 244, height: 244, payload: 7000, bestFor: "light high-volume load", color: "#f59e0b" },
  { id: "truck32mxl", name: "32 ft MXL", type: "Heavy truck", length: 975, width: 244, height: 244, payload: 16000, bestFor: "heavy high-volume load", color: "#2563eb" },
  { id: "container40", name: "40 ft Container", type: "Container", length: 1203, width: 235, height: 239, payload: 26500, bestFor: "export style load", color: "#7c3aed" },
  { id: "trailer40", name: "40 ft Trailer", type: "Trailer", length: 1220, width: 244, height: 244, payload: 32000, bestFor: "full truck load", color: "#e11d48" }
];

const palette = ["#00a6c8", "#f59e0b", "#16a34a", "#e11d48", "#7c3aed", "#2563eb", "#14b8a6", "#f97316"];
const els = {};
let boxes = [];
let selectedVehicleId = vehicles[8].id;
let editingBoxId = null;

function $(id) {
  return document.getElementById(id);
}

function init() {
  [
    "boxForm", "boxName", "boxQty", "boxLength", "boxWidth", "boxHeight", "boxWeight", "unitSelect", "stackableToggle",
    "allowRotate", "manualVehicleSelect", "selectedFitCard", "formTitle", "submitBoxBtn", "cancelEditBtn",
    "cargoList", "vehicleResults", "fleetGrid", "historyList", "totalBoxesStat", "totalVolumeStat",
    "totalWeightStat", "recommendationHint", "loadCanvas", "legend", "volumeUse", "weightUse",
    "saveScenarioBtn", "exportBtn", "clearBoxesBtn", "clearHistoryBtn"
  ].forEach((id) => {
    els[id] = $(id);
  });

  document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", () => switchPanel(tab.dataset.panel));
  });

  els.boxForm.addEventListener("submit", addBox);
  els.allowRotate.addEventListener("change", renderAll);
  els.manualVehicleSelect.addEventListener("change", () => {
    selectedVehicleId = els.manualVehicleSelect.value;
    renderAll();
  });
  els.clearBoxesBtn.addEventListener("click", () => {
    boxes = [];
    resetForm();
    renderAll();
  });
  els.cancelEditBtn.addEventListener("click", resetForm);
  els.saveScenarioBtn.addEventListener("click", saveScenario);
  els.exportBtn.addEventListener("click", exportReport);
  els.clearHistoryBtn.addEventListener("click", () => {
    localStorage.removeItem("loadfit-scenarios");
    renderHistory();
  });

  renderAll();
}

function switchPanel(panelId) {
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.panel === panelId);
  });
  document.querySelectorAll(".panel").forEach((panel) => {
    panel.classList.toggle("active", panel.id === panelId);
  });
  if (panelId === "historyPanel") renderHistory();
}

function addBox(event) {
  event.preventDefault();
  const unit = els.unitSelect.value;
  const factor = unit === "inch" ? 2.54 : 1;
  const length = Number(els.boxLength.value) * factor;
  const width = Number(els.boxWidth.value) * factor;
  const height = Number(els.boxHeight.value) * factor;
  const qty = Math.max(1, Math.floor(Number(els.boxQty.value)));
  const weight = Math.max(0, Number(els.boxWeight.value));

  if (!length || !width || !height || !qty) return;

  const boxData = {
    id: editingBoxId || (crypto.randomUUID ? crypto.randomUUID() : String(Date.now())),
    name: els.boxName.value.trim() || `Box ${boxes.length + 1}`,
    qty,
    length,
    width,
    height,
    weight,
    stackable: els.stackableToggle.checked,
    color: editingBoxId
      ? boxes.find((box) => box.id === editingBoxId)?.color || palette[boxes.length % palette.length]
      : palette[boxes.length % palette.length]
  };

  if (editingBoxId) {
    boxes = boxes.map((box) => box.id === editingBoxId ? boxData : box);
  } else {
    boxes.push(boxData);
  }

  resetForm();
  renderAll();
}

function resetForm() {
  editingBoxId = null;
  els.boxForm.reset();
  els.unitSelect.value = "cm";
  els.stackableToggle.checked = true;
  els.formTitle.textContent = "Enter box details";
  els.submitBoxBtn.textContent = "Add this box";
  els.cancelEditBtn.style.display = "none";
}

function editBox(boxId) {
  const box = boxes.find((item) => item.id === boxId);
  if (!box) return;
  editingBoxId = boxId;
  els.boxName.value = box.name;
  els.boxQty.value = box.qty;
  els.boxLength.value = Math.round(box.length * 10) / 10;
  els.boxWidth.value = Math.round(box.width * 10) / 10;
  els.boxHeight.value = Math.round(box.height * 10) / 10;
  els.boxWeight.value = box.weight;
  els.stackableToggle.checked = box.stackable !== false;
  els.unitSelect.value = "cm";
  els.formTitle.textContent = "Edit box details";
  els.submitBoxBtn.textContent = "Update box";
  els.cancelEditBtn.style.display = "inline-flex";
  els.boxName.focus();
}

function cargoTotals() {
  return boxes.reduce((acc, box) => {
    const volume = box.length * box.width * box.height * box.qty;
    acc.qty += box.qty;
    acc.volume += volume;
    acc.weight += box.weight * box.qty;
    return acc;
  }, { qty: 0, volume: 0, weight: 0 });
}

function vehicleVolume(vehicle) {
  return vehicle.length * vehicle.width * vehicle.height;
}

function orientations(box, allowRotate) {
  const dims = [
    [box.length, box.width, box.height],
    [box.width, box.length, box.height],
    [box.length, box.height, box.width],
    [box.height, box.length, box.width],
    [box.width, box.height, box.length],
    [box.height, box.width, box.length]
  ];
  const filtered = allowRotate && !box.fragile ? dims : [dims[0], dims[1]];
  return filtered.map(([length, width, height]) => ({ length, width, height }));
}

function bestOrientation(box, vehicle, allowRotate) {
  return orientations(box, allowRotate)
    .map((o) => {
      const perLayer = Math.floor(vehicle.length / o.length) * Math.floor(vehicle.width / o.width);
      const layers = box.stackable === false ? 1 : Math.floor(vehicle.height / o.height);
      return { ...o, perLayer, layers, capacity: perLayer * layers };
    })
    .sort((a, b) => b.capacity - a.capacity)[0];
}

function evaluateVehicle(vehicle) {
  const allowRotate = els.allowRotate ? els.allowRotate.checked : true;
  const totals = cargoTotals();
  const problems = [];
  let layerAreaNeeded = 0;
  let packedQty = 0;

  boxes.forEach((box) => {
    const best = bestOrientation(box, vehicle, allowRotate);
    if (!best || best.capacity <= 0) {
      problems.push(`${box.name} is larger than the loading bay`);
      return;
    }
    const layers = Math.max(1, best.layers);
    const floorPositions = Math.ceil(box.qty / layers);
    layerAreaNeeded += floorPositions * best.length * best.width;
    packedQty += Math.min(box.qty, best.capacity);
  });

  const floorArea = vehicle.length * vehicle.width;
  const floorUse = floorArea ? layerAreaNeeded / floorArea : 0;
  const volumeUse = vehicleVolume(vehicle) ? totals.volume / vehicleVolume(vehicle) : 0;
  const weightUse = vehicle.payload ? totals.weight / vehicle.payload : 0;
  const allDimensionsFit = packedQty >= totals.qty;

  if (volumeUse > 1) problems.push("Cargo volume exceeds vehicle volume");
  if (weightUse > 1) problems.push("Cargo weight exceeds payload");
  if (floorUse > 1.08) problems.push("Floor layout is too crowded");
  if (!allDimensionsFit) problems.push("Some boxes cannot be stacked inside");

  let status = "fit";
  if (problems.length) status = "fail";
  else if (volumeUse > 0.86 || weightUse > 0.86 || floorUse > 0.92) status = "tight";

  const score = Math.max(volumeUse, weightUse, floorUse);
  return { vehicle, totals, status, problems, floorUse, volumeUse, weightUse, score };
}

function renderAll() {
  renderStats();
  renderVehicleSelector();
  renderCargo();
  renderRecommendations();
  renderFleet();
  renderHistory();
  renderCanvas();
}

function renderStats() {
  const totals = cargoTotals();
  els.totalBoxesStat.textContent = totals.qty;
  els.totalVolumeStat.textContent = (totals.volume / 1000000).toFixed(2);
  els.totalWeightStat.textContent = Math.round(totals.weight);
}

function renderVehicleSelector() {
  els.manualVehicleSelect.innerHTML = vehicles.map((vehicle) => `
    <option value="${vehicle.id}" ${vehicle.id === selectedVehicleId ? "selected" : ""}>
      ${vehicle.name} - ${vehicle.payload} kg - ${(vehicleVolume(vehicle) / 1000000).toFixed(1)} m3
    </option>
  `).join("");
  renderSelectedFit();
}

function renderSelectedFit() {
  const vehicle = vehicles.find((item) => item.id === selectedVehicleId);
  const result = evaluateVehicle(vehicle);
  if (!boxes.length) {
    els.selectedFitCard.innerHTML = `<div class="fit-badge">Ready</div><h4>${vehicle.name}</h4><p>Add boxes to check if this vehicle can load them.</p>`;
    return;
  }

  const label = result.status === "fit" ? "Fits well" : result.status === "tight" ? "Fits, but tight" : "Will not fit";
  const reason = result.problems.length
    ? result.problems.join(". ")
    : `Good for ${vehicle.bestFor}. Uses ${pct(result.volumeUse)} volume, ${pct(result.weightUse)} payload and ${pct(result.floorUse)} floor.`;
  els.selectedFitCard.innerHTML = `
    <div class="fit-badge">${label}</div>
    <h4>${vehicle.name}</h4>
    <p>${reason}</p>
  `;
}

function renderCargo() {
  if (!boxes.length) {
    els.cargoList.innerHTML = $("emptyTemplate").innerHTML;
    return;
  }

  els.cargoList.innerHTML = boxes.map((box) => `
    <article class="cargo-item">
      <div class="cargo-color" style="background:${box.color}"></div>
      <strong>${escapeHtml(box.name)}</strong>
      <span>${box.qty} pcs | ${cm(box.length)} x ${cm(box.width)} x ${cm(box.height)}</span>
      <span>${box.weight} kg each | ${box.stackable === false ? "not stackable" : "stackable"}</span>
      <div class="cargo-actions">
        <span>${((box.length * box.width * box.height * box.qty) / 1000000).toFixed(2)} m3</span>
        <button class="mini-button" data-edit="${box.id}" type="button">Edit</button>
        <button class="mini-button" data-remove="${box.id}" type="button">Remove</button>
      </div>
    </article>
  `).join("");

  els.cargoList.querySelectorAll("[data-edit]").forEach((button) => {
    button.addEventListener("click", () => editBox(button.dataset.edit));
  });

  els.cargoList.querySelectorAll(".cargo-item").forEach((card) => {
    card.addEventListener("click", (event) => {
      if (event.target.closest("button")) return;
      editBox(card.querySelector("[data-edit]").dataset.edit);
    });
  });

  els.cargoList.querySelectorAll("[data-remove]").forEach((button) => {
    button.addEventListener("click", () => {
      boxes = boxes.filter((box) => box.id !== button.dataset.remove);
      renderAll();
    });
  });
}

function renderRecommendations() {
  if (!boxes.length) {
    els.recommendationHint.textContent = "Waiting for cargo";
    els.vehicleResults.innerHTML = $("emptyTemplate").innerHTML;
    return;
  }

  const results = vehicles.map(evaluateVehicle).sort((a, b) => {
    const statusRank = { fit: 0, tight: 1, fail: 2 };
    if (statusRank[a.status] !== statusRank[b.status]) {
      return statusRank[a.status] - statusRank[b.status];
    }
    if (a.status === "fail") return a.score - b.score;
    return vehicleVolume(a.vehicle) - vehicleVolume(b.vehicle) || a.vehicle.payload - b.vehicle.payload;
  });
  const best = results.find((result) => result.status !== "fail");
  els.recommendationHint.textContent = best ? `Recommended: ${best.vehicle.name}` : "No single vehicle fits";

  els.vehicleResults.innerHTML = results.slice(0, 9).map((result, index) => {
    const label = result.status === "fit" ? "Fit" : result.status === "tight" ? "Tight" : "No fit";
    return `
      <article class="result-card ${index === 0 && result.status !== "fail" ? "best" : ""}">
        <span class="status-pill ${result.status}">${label}</span>
        <strong>${result.vehicle.name}</strong>
        <span>${result.vehicle.type} | ${cm(result.vehicle.length)} x ${cm(result.vehicle.width)} x ${cm(result.vehicle.height)}</span>
        <span>${result.vehicle.payload} kg payload | ${(vehicleVolume(result.vehicle) / 1000000).toFixed(1)} m3 | ${result.vehicle.bestFor}</span>
        <div class="capacity-bars">
          ${bar("Volume", result.volumeUse)}
          ${bar("Weight", result.weightUse)}
          ${bar("Floor", result.floorUse)}
        </div>
      </article>
    `;
  }).join("");
}

function renderFleet() {
  els.fleetGrid.innerHTML = vehicles.map((vehicle) => `
    <article class="fleet-card">
      <span class="status-pill fit" style="background:${vehicle.color}22;color:${vehicle.color}">${vehicle.type}</span>
      <h3>${vehicle.name}</h3>
      <strong>${cm(vehicle.length)} x ${cm(vehicle.width)} x ${cm(vehicle.height)}</strong>
      <span>${(vehicleVolume(vehicle) / 1000000).toFixed(2)} m3 | ${vehicle.payload} kg payload | ${vehicle.bestFor}</span>
    </article>
  `).join("");
}

function renderCanvas() {
  const canvas = els.loadCanvas;
  const ctx = canvas.getContext("2d");
  const vehicle = vehicles.find((item) => item.id === selectedVehicleId);
  const result = evaluateVehicle(vehicle);
  const pad = 44;
  const bayW = canvas.width - pad * 2;
  const bayH = canvas.height - pad * 2;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#05070f";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "rgba(0,245,255,0.12)";
  ctx.lineWidth = 1;
  for (let gx = 0; gx < canvas.width; gx += 44) {
    ctx.beginPath();
    ctx.moveTo(gx, 0);
    ctx.lineTo(gx, canvas.height);
    ctx.stroke();
  }
  for (let gy = 0; gy < canvas.height; gy += 44) {
    ctx.beginPath();
    ctx.moveTo(0, gy);
    ctx.lineTo(canvas.width, gy);
    ctx.stroke();
  }
  ctx.fillStyle = "#00f5ff";
  ctx.font = "700 26px Inter, Arial";
  ctx.fillText(vehicle.name, pad, 34);
  ctx.font = "15px Inter, Arial";
  ctx.fillStyle = "#8ea3b8";
  ctx.fillText(`Floor plan: ${cm(vehicle.length)} x ${cm(vehicle.width)} | height ${cm(vehicle.height)}`, pad, 60);

  ctx.strokeStyle = "#00f5ff";
  ctx.lineWidth = 3;
  ctx.strokeRect(pad, pad + 44, bayW, bayH - 44);

  if (!boxes.length) {
    ctx.fillStyle = "#8ea3b8";
    ctx.font = "600 22px Inter, Arial";
    ctx.fillText("Add boxes to activate load map", pad + 28, canvas.height / 2);
    els.volumeUse.textContent = "0% volume";
    els.weightUse.textContent = "0% weight";
    els.legend.innerHTML = "";
    return;
  }

  const scale = Math.min(bayW / vehicle.length, (bayH - 44) / vehicle.width);
  let x = pad;
  let y = pad + 44;
  let rowHeight = 0;

  boxes.forEach((box) => {
    const fit = bestOrientation(box, vehicle, els.allowRotate.checked);
    if (!fit || !fit.capacity) return;
    const drawW = Math.max(4, fit.length * scale);
    const drawH = Math.max(4, fit.width * scale);
    const visibleQty = Math.min(box.qty, 320);

    for (let i = 0; i < visibleQty; i += 1) {
      if (x + drawW > pad + bayW) {
        x = pad;
        y += rowHeight;
        rowHeight = 0;
      }
      if (y + drawH > pad + bayH) return;
      ctx.fillStyle = box.color;
      ctx.globalAlpha = 0.86;
      ctx.fillRect(x + 2, y + 2, drawW - 4, drawH - 4);
      ctx.globalAlpha = 1;
      ctx.strokeStyle = "rgba(255,255,255,0.5)";
      ctx.lineWidth = 1;
      ctx.strokeRect(x + 2, y + 2, drawW - 4, drawH - 4);
      x += drawW;
      rowHeight = Math.max(rowHeight, drawH);
    }
  });

  els.volumeUse.textContent = `${pct(result.volumeUse)} volume`;
  els.weightUse.textContent = `${pct(result.weightUse)} weight`;
  els.legend.innerHTML = boxes.map((box) => `
    <span class="legend-item"><span class="legend-swatch" style="background:${box.color}"></span>${escapeHtml(box.name)}</span>
  `).join("");
}

function saveScenario() {
  const totals = cargoTotals();
  if (!boxes.length) return;
  const scenarios = getScenarios();
  scenarios.unshift({
    id: Date.now(),
    date: new Date().toLocaleString(),
    vehicleId: selectedVehicleId,
    boxes,
    totals
  });
  localStorage.setItem("loadfit-scenarios", JSON.stringify(scenarios.slice(0, 12)));
  renderHistory();
}

function renderHistory() {
  const scenarios = getScenarios();
  if (!scenarios.length) {
    els.historyList.innerHTML = `<div class="empty-state"><strong>No saved scenarios</strong><p>Save a plan from the planner to see it here.</p></div>`;
    return;
  }
  els.historyList.innerHTML = scenarios.map((scenario) => {
    const vehicle = vehicles.find((item) => item.id === scenario.vehicleId) || vehicles[0];
    return `
      <article class="history-item">
        <div>
          <strong>${vehicle.name}</strong>
          <span>${scenario.date} | ${scenario.totals.qty} boxes | ${(scenario.totals.volume / 1000000).toFixed(2)} m3 | ${Math.round(scenario.totals.weight)} kg</span>
        </div>
        <button class="mini-button" data-load="${scenario.id}" type="button">Load</button>
      </article>
    `;
  }).join("");

  els.historyList.querySelectorAll("[data-load]").forEach((button) => {
    button.addEventListener("click", () => {
      const scenario = getScenarios().find((item) => String(item.id) === button.dataset.load);
      if (!scenario) return;
      boxes = scenario.boxes;
      selectedVehicleId = scenario.vehicleId;
      switchPanel("plannerPanel");
      renderAll();
    });
  });
}

function exportReport() {
  const totals = cargoTotals();
  const vehicle = vehicles.find((item) => item.id === selectedVehicleId);
  const result = evaluateVehicle(vehicle);
  const lines = [
    "LoadFit Pro Report",
    `Vehicle: ${vehicle.name}`,
    `Status: ${result.status}`,
    `Total boxes: ${totals.qty}`,
    `Total volume: ${(totals.volume / 1000000).toFixed(2)} m3`,
    `Total weight: ${Math.round(totals.weight)} kg`,
    "",
    "Cargo:",
    ...boxes.map((box) => `- ${box.name}: ${box.qty} pcs, ${cm(box.length)} x ${cm(box.width)} x ${cm(box.height)}, ${box.weight} kg each, ${box.stackable === false ? "not stackable" : "stackable"}`)
  ];
  const blob = new Blob([lines.join("\n")], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "loadfit-report.txt";
  anchor.click();
  URL.revokeObjectURL(url);
}

function getScenarios() {
  try {
    return JSON.parse(localStorage.getItem("loadfit-scenarios")) || [];
  } catch {
    return [];
  }
}

function bar(label, value) {
  const width = Math.min(100, Math.round(value * 100));
  return `<div><span>${label}: ${pct(value)}</span><div class="bar"><span style="width:${width}%"></span></div></div>`;
}

function cm(value) {
  return `${Math.round(value)} cm`;
}

function pct(value) {
  return `${Math.round(value * 100)}%`;
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

init();
