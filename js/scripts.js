function adjustMinMax(el) {
  let id = el.id;
  let type = el.value;
  let tb = null;

  if (id == "dd-prayer-target-type") {
    tb = document.getElementById("tb-prayer-goal");
  }
  else if (id == "dd-farming-target-type") {
    tb = document.getElementById("tb-farming-goal");
  }
  else if (id == "dd-mining-target-type") {
    tb = document.getElementById("tb-mining-goal");
  }
  else if (id == "dd-dungeoneering-target-type") {
    tb = document.getElementById("tb-dungeoneering-goal");
  }

  if (tb != null) {
    if (type == "xp") {
      tb.min = 0;
      tb.max = 200000000;
    }
    else if (type == "level") {
      tb.min = 1;
      tb.max = 120;
    }
  }
}

function nemi(level, cap) {
  return ((2/3)*((Math.min(level, cap)**2)-(2*Math.min(level, cap))+100));
}

function calculateDays() {

  let tbIds = ["tb-current-prayer-xp", "tb-current-farming-xp", "tb-current-mining-xp", "tb-current-dungeoneering-xp"];
  let tarTypes = ["dd-prayer-target-type", "dd-farming-target-type", "dd-mining-target-type", "dd-dungeoneering-target-type"];
  let tarGoals = ["tb-prayer-goal", "tb-farming-goal", "tb-mining-goal", "tb-dungeoneering-goal"];
  let spnIds = ["spn-days-prayer", "spn-days-farming", "spn-days-mining", "spn-days-dungeoneering"];
  let nodes = [4, 3, 1, 1];
  let cap = [99, 99, 99, 120];

  for (let i = 0; i < 4; i++) {
    let currentXP = parseFloat(document.getElementById(tbIds[i]).value);
    let targetType = document.getElementById(tarTypes[i]).value;
    let goal;
    let days = 0;

    if (targetType == "xp") {
      goal = parseFloat(document.getElementById(tarGoals[i]).value);
    }
    else if (targetType == "level") {
      goal = getXP(parseFloat(document.getElementById(tarGoals[i]).value));
    }

    while (currentXP < goal) {
      for (let j = 0; j < nodes[i]; j++) {
        currentXP += nemi(getLevel(currentXP), cap[i]);
      }
      days++;
    }

    document.getElementById(spnIds[i]).textContent = days;
  }
}
