import plugin from "tailwindcss/plugin";

const SHIFT_LARGE = "0.3rem";
const SHIFT_SMALL = "0.1rem";
const SHIFT_BURST_1 = "3rem";
const SHIFT_BURST_2 = "1rem";
const SHIFT_BURST_3 = "2rem";

const R = "var(--tg-rgb-r)";
const G = "var(--tg-rgb-g)";
const B = "var(--tg-rgb-b)";
const BLUR = "var(--tg-rgb-blur)";

function shadow(offset: string, color1: string, color2: string): string {
  return `${offset} 0 0 ${color1}, -${offset} 0 0 ${color2}`;
}

function reverseShadow(offset: string, color1: string, color2: string): string {
  return `-${offset} 0 0 ${color1}, ${offset} 0 0 ${color2}`;
}

function zeroShadow(color1: string, color2: string): string {
  return `0 0 0 ${color1}, 0 0 0 ${color2}`;
}

function frame(textShadow: string, blur: boolean): Record<string, string> {
  return {
    "text-shadow": textShadow,
    filter: blur ? `blur(${BLUR})` : "blur(0)",
  };
}

/**
 * Build the full 0-100% glitch keyframes, replicating the original
 * @designbycode/tailwindcss-text-glitch animation sequence.
 */
function buildGlitchKeyframes(): Record<string, Record<string, string>> {
  const kf: Record<string, Record<string, string>> = {};

  const sections: Array<{
    start: number;
    end: number;
    textShadow: string;
    blur: boolean;
  }> = [
    // 0-4: large shift R/B
    { start: 0, end: 4, textShadow: shadow(SHIFT_LARGE, R, B), blur: false },
    // 5-10: reverse large R/B
    { start: 5, end: 10, textShadow: reverseShadow(SHIFT_LARGE, R, B), blur: false },
    // 11-13: small shift R/G with blur
    { start: 11, end: 13, textShadow: shadow(SHIFT_SMALL, R, G), blur: true },
    // 14-15: small shift R/G no blur
    { start: 14, end: 15, textShadow: shadow(SHIFT_SMALL, R, G), blur: false },
    // 16-20: reverse large R/G
    { start: 16, end: 20, textShadow: reverseShadow(SHIFT_LARGE, R, G), blur: false },
    // 21-25: small shift B/G
    { start: 21, end: 25, textShadow: shadow(SHIFT_SMALL, B, G), blur: false },
    // 26-27: small shift B/G with blur
    { start: 26, end: 27, textShadow: shadow(SHIFT_SMALL, B, G), blur: true },
    // 28-30: small shift B/G no blur
    { start: 28, end: 30, textShadow: shadow(SHIFT_SMALL, B, G), blur: false },
    // 31-40: reverse large B/G
    { start: 31, end: 40, textShadow: reverseShadow(SHIFT_LARGE, B, G), blur: false },
    // 41: burst B/G
    { start: 41, end: 41, textShadow: shadow(SHIFT_BURST_1, B, G), blur: false },
    // 42: zero B/G
    { start: 42, end: 42, textShadow: zeroShadow(B, G), blur: false },
    // 43-45: small shift R/G
    { start: 43, end: 45, textShadow: shadow(SHIFT_SMALL, R, G), blur: false },
    // 46: small shift R/G with blur
    { start: 46, end: 46, textShadow: shadow(SHIFT_SMALL, R, G), blur: true },
    // 47: reverse large R/G with blur
    { start: 47, end: 47, textShadow: reverseShadow(SHIFT_LARGE, R, G), blur: true },
    // 48-50: reverse large R/G no blur
    { start: 48, end: 50, textShadow: reverseShadow(SHIFT_LARGE, R, G), blur: false },
    // 51-54: large shift R/B
    { start: 51, end: 54, textShadow: shadow(SHIFT_LARGE, R, B), blur: false },
    // 55: large shift R/B with blur
    { start: 55, end: 55, textShadow: shadow(SHIFT_LARGE, R, B), blur: true },
    // 56-57: reverse large R/B with blur
    { start: 56, end: 57, textShadow: reverseShadow(SHIFT_LARGE, R, B), blur: true },
    // 58-60: reverse large R/B no blur
    { start: 58, end: 60, textShadow: reverseShadow(SHIFT_LARGE, R, B), blur: false },
    // 61: burst R/G
    { start: 61, end: 61, textShadow: shadow(SHIFT_BURST_2, R, G), blur: false },
    // 62: zero R/G
    { start: 62, end: 62, textShadow: zeroShadow(R, G), blur: false },
    // 63-65: small shift R/B
    { start: 63, end: 65, textShadow: shadow(SHIFT_SMALL, R, B), blur: false },
    // 66: small shift R/B with blur
    { start: 66, end: 66, textShadow: shadow(SHIFT_SMALL, R, B), blur: true },
    // 67: reverse large R/B with blur
    { start: 67, end: 67, textShadow: reverseShadow(SHIFT_LARGE, R, B), blur: true },
    // 68-70: reverse large R/B no blur
    { start: 68, end: 70, textShadow: reverseShadow(SHIFT_LARGE, R, B), blur: false },
    // 71: burst R/B
    { start: 71, end: 71, textShadow: shadow(SHIFT_BURST_3, R, B), blur: false },
    // 72: zero R/B
    { start: 72, end: 72, textShadow: zeroShadow(R, B), blur: false },
    // 73-76: large shift R/B
    { start: 73, end: 76, textShadow: shadow(SHIFT_LARGE, R, B), blur: false },
    // 77-80: reverse large R/B
    { start: 77, end: 80, textShadow: reverseShadow(SHIFT_LARGE, R, B), blur: false },
    // 81-82: small shift R/G
    { start: 81, end: 82, textShadow: shadow(SHIFT_SMALL, R, G), blur: false },
    // 83-85: small shift R/G with blur
    { start: 83, end: 85, textShadow: shadow(SHIFT_SMALL, R, G), blur: true },
    // 86-87: reverse large R/G with blur
    { start: 86, end: 87, textShadow: reverseShadow(SHIFT_LARGE, R, G), blur: true },
    // 88-90: reverse large R/G no blur
    { start: 88, end: 90, textShadow: reverseShadow(SHIFT_LARGE, R, G), blur: false },
    // 91: burst G/B
    { start: 91, end: 91, textShadow: shadow(SHIFT_BURST_2, G, B), blur: false },
    // 92-95: small shift B/G
    { start: 92, end: 95, textShadow: shadow(SHIFT_SMALL, B, G), blur: false },
    // 96-100: reverse large B/G
    { start: 96, end: 100, textShadow: reverseShadow(SHIFT_LARGE, B, G), blur: false },
  ];

  for (const section of sections) {
    for (let i = section.start; i <= section.end; i++) {
      kf[`${i}%`] = frame(section.textShadow, section.blur);
    }
  }

  return kf;
}

const CSS_VARIABLE_DEFAULTS = {
  "--tg-rgb-r": "red",
  "--tg-rgb-g": "limegreen",
  "--tg-rgb-b": "blue",
  "--tg-rgb-blur": "1px",
  "--tg-rgb-duration": "3s",
};

export default plugin(function textGlitchPlugin({ addBase, addUtilities }) {
  addBase({
    ":root": CSS_VARIABLE_DEFAULTS,
    "@keyframes glitch": buildGlitchKeyframes(),
  });

  addUtilities({
    ".text-glitch": {
      animation: "glitch var(--tg-rgb-duration) steps(100) infinite",
    },
  });
});
