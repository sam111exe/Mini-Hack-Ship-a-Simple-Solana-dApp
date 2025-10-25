
const whiteText = "\x1b[97m";

const colors = ["red", "green", "yellow", "blue", "magenta", "cyan", "white", "black"] as const;
const bg_colors = ["bgBlack", "bgRed", "bgGreen", "bgYellow", "bgBlue", "bgMagenta", "bgCyan", "bgWhite"] as const;
const special_colors = ["bright", "dim", "underscore", "blink", "reverse", "hidden", "end"] as const;
const all_colors = [...colors, ...bg_colors, ...special_colors] as const;
type Color = typeof all_colors[number];

const debugEncoder = JSON.stringify;
const debugColors: Record<Color, string> = {
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[97m",
  end: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  underscore: "\x1b[4m",
  blink: "\x1b[5m",
  reverse: "\x1b[7m",
  hidden: "\x1b[8m",
  black: "\x1b[30m",
  bgBlack: "\x1b[40m" + whiteText,
  bgRed: "\x1b[41m" + whiteText,
  bgGreen: "\x1b[42m" + whiteText,
  bgYellow: "\x1b[43m" + whiteText,
  bgBlue: "\x1b[44m" + whiteText,
  bgMagenta: "\x1b[45m" + whiteText,
  bgCyan: "\x1b[46m" + whiteText,
  bgWhite: "\x1b[47m\x1b[30m",
};

export class Logger {
  static length = 62;
  static fillChar = " ";

  static log(msg: string, obj: any = null, color: Color = "bgBlue"): void {
    const colorCode = debugColors[color];
    const title = `${msg ?? "DEBUG"} ${Array(Logger.length).fill(Logger.fillChar).join("")}`;
    this.printDebug(
      `${colorCode} ${title.substring(0, Logger.length)} ${debugColors["end"]}${
        debugColors["bgWhite"]
      } [ ${new Date().toISOString()} ] ${debugColors["end"]}`
    ); // HEADER
    if (obj === null) {
    } else if (typeof obj === "object") {
      this.printDebug(`${debugColors["white"]}${debugEncoder(obj)}${debugColors["end"]}`);
    } else if (obj !== null) {
      this.printDebug(`${debugColors["white"]}${obj}${debugColors["end"]}`);
    }
  }
  static printDebug(obj: string): void {
    for (const line of obj.split("\n")) {
      console.log(line);
    }
  }
}
