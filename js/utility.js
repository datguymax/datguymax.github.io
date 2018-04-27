var levelToXP = {};

function calculateXP(level) {
  let xp = 0;
  for (let n = 1; n < level; n++) {
    xp += Math.floor(n + 300 * 2**(n/7));
  }
  return Math.floor(0.25*xp);
}

function buildDictionaries() {
  for(let i = 1; i <= 126; i++) {
    let xp = calculateXP(i);

    levelToXP[i] = xp;
  }
}

buildDictionaries();

// Function that mirrors the getLevel function for continuity
// O(1)
function getXP(level) {
  return levelToXP[level];
}

// Binary search for level in levelToXP dictionary
// O(log n)
function getLevel(xp) {
  let l = 1;
  let r = 126;
  let m;

  while (l <= r) {
    m = l + Math.floor((r - l)/2);

    if (xp == levelToXP[m]) {
      return m;
    }
    if (xp < levelToXP[m] && xp > levelToXP[m-1]) {
      return m - 1;
    }

    if (levelToXP[m] < xp) {
      l = m + 1;
    }
    else {
      r = m - 1;
    }
  }

  return m;
}
