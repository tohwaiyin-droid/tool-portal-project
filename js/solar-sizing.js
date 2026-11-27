// Solar system sizing calculator.
// calculate() is plain maths with no page code, so it can be tested on its own.

var LOSSES_FACTOR = 0.75; // real systems keep about 75% of their rated power

// Round for display and drop pointless trailing zeros (2.80 -> "2.8").
function fmt(number, decimals) {
  return String(Number(number.toFixed(decimals)));
}

// inputs: { dailyUse, sunHours, panelWatts, backupDays, depthPct } (numbers, NaN if blank)
function calculate(inputs) {
  var dailyUse = inputs.dailyUse;
  var sunHours = inputs.sunHours;
  var panelWatts = inputs.panelWatts;
  var backupDays = inputs.backupDays;
  var depthPct = inputs.depthPct;

  var errors = [];
  if (!(dailyUse > 0)) errors.push("Daily electricity use must be more than 0.");
  if (!(sunHours > 0 && sunHours <= 12)) errors.push("Peak sun hours must be more than 0 and at most 12.");
  if (!(panelWatts > 0)) errors.push("Panel power must be more than 0 watts.");
  if (!(backupDays >= 0)) errors.push("Days of battery backup must be 0 or more.");
  if (!(depthPct >= 1 && depthPct <= 100)) errors.push("Usable battery depth must be between 1 and 100.");
  if (errors.length) return { ok: false, errors: errors };

  var neededKw = dailyUse / (sunHours * LOSSES_FACTOR);
  // The small subtraction stops tiny rounding errors from adding an extra panel.
  var panels = Math.ceil(neededKw * 1000 / panelWatts - 1e-9);
  var arrayKw = panels * panelWatts / 1000;
  var batteryKwh = dailyUse * backupDays / (depthPct / 100);

  var steps = [
    "Array size needed = daily use ÷ (sun hours × losses factor) = " +
      fmt(dailyUse, 2) + " ÷ (" + fmt(sunHours, 2) + " × " + LOSSES_FACTOR + ") = " + fmt(neededKw, 2) + " kW",
    "Panels = array size needed ÷ one panel, rounded up = " +
      fmt(neededKw, 2) + " kW ÷ " + fmt(panelWatts / 1000, 3) + " kW = " +
      fmt(neededKw * 1000 / panelWatts, 2) + " → " + panels + " panels",
    "Actual array size = panels × one panel = " + panels + " × " + fmt(panelWatts, 0) + " W = " + fmt(arrayKw, 2) + " kW",
    "Battery size = daily use × backup days ÷ usable depth = " +
      fmt(dailyUse, 2) + " × " + fmt(backupDays, 2) + " ÷ " + fmt(depthPct / 100, 2) + " = " + fmt(batteryKwh, 2) + " kWh"
  ];

  return {
    ok: true,
    neededKw: neededKw,
    panels: panels,
    arrayKw: arrayKw,
    batteryKwh: batteryKwh,
    steps: steps
  };
}

// Page wiring (skipped when this file is loaded outside a browser, e.g. in tests).
if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", function () {
    var $ = function (id) { return document.getElementById(id); };
    var form = $("sizing-form");
    var sunInput = $("sun-hours");
    var climate = $("climate");

    // A blank box counts as "not a number" so it shows a message instead of 0.
    function read(id) {
      var text = $(id).value.trim();
      return text === "" ? NaN : Number(text);
    }

    function show() {
      var dailyBlank = $("daily-use").value.trim() === "";
      var result = calculate({
        dailyUse: read("daily-use"),
        sunHours: read("sun-hours"),
        panelWatts: read("panel-watts"),
        backupDays: read("backup-days"),
        depthPct: read("depth")
      });

      var message = $("message");
      var list = $("results-list");
      var workingSection = $("working-section");
      var workingList = $("working-list");

      if (!result.ok) {
        list.hidden = true;
        workingSection.hidden = true;
        message.className = dailyBlank ? "message" : "message error";
        message.textContent = dailyBlank
          ? "Enter your daily electricity use to see the results."
          : result.errors.join(" ");
        return;
      }

      message.className = "message";
      message.textContent = "";
      $("out-panels").textContent = result.panels + (result.panels === 1 ? " panel" : " panels");
      $("out-array").textContent = fmt(result.arrayKw, 2) + " kW";
      $("out-battery").textContent = fmt(result.batteryKwh, 2) + " kWh";

      workingList.textContent = "";
      result.steps.forEach(function (text) {
        var item = document.createElement("li");
        item.textContent = text;
        workingList.appendChild(item);
      });

      list.hidden = false;
      workingSection.hidden = false;
    }

    // Picking an example climate fills the sun-hours box.
    climate.addEventListener("change", function () {
      if (climate.value !== "custom") {
        sunInput.value = climate.value;
        show();
      }
    });

    // Typing a sun-hours number picks the matching example, or "Custom".
    sunInput.addEventListener("input", function () {
      var match = Array.prototype.some.call(climate.options, function (option) {
        return option.value !== "custom" && Number(option.value) === Number(sunInput.value);
      });
      climate.value = match ? String(Number(sunInput.value)) : "custom";
    });

    form.addEventListener("input", show);
    form.addEventListener("submit", function (event) { event.preventDefault(); });
    show();
  });
}

if (typeof module !== "undefined") module.exports = { calculate: calculate };
