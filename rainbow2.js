/** @param {NS} ns */
export async function main(ns) {
    ns.tail();
    const HSLToRGB = (h, s, l) => {
      // https://www.30secondsofcode.org/js/s/hsl-to-rgb
      s /= 100;
      l /= 100;
      const k = n => (n + h / 30) % 12;
      const a = s * Math.min(l, 1 - l);
      const f = n =>
        l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
      // return [255 * f(0), 255 * f(8), 255 * f(4)];
      return `#${[0, 8, 4].map(x => Math.round(255 * f(x)).toString(16).padStart(2, "0")).join("")}`;
    };
    let theme = ns.ui.getTheme();
    let setThemeWithColor = async color => {
      theme.primary = color;
      ns.ui.setTheme(theme);
      await ns.asleep(0);
    }
    while (true) {
      for (let h = 360; h > 0; h -= 10) {
        await setThemeWithColor(HSLToRGB(h, 80, 60));
      }
    }
  }