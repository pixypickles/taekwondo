export const MOVES = {
  idle: { name: "構え", duration: 1, keyframes: [{ t: 0, pose: "idle" }] },

  apchagi: {
    name: "アプチャギ",
    duration: 360,
    keyframes: [
      { t: 0, pose: "load" },
      { t: .28, pose: "knee" },
      { t: .52, pose: "frontKick", trail: "shortLine" },
      { t: 1, pose: "idle" }
    ]
  },

  dollyo: {
    name: "トルリョチャギ",
    duration: 430,
    keyframes: [
      { t: 0, pose: "load" },
      { t: .30, pose: "knee" },
      { t: .58, pose: "roundKick", trail: "roundArc" },
      { t: 1, pose: "idle" }
    ]
  },

  rotate: {
    name: "回転フェイント",
    duration: 520,
    rotateWindow: true,
    keyframes: [
      { t: 0, pose: "hopClosed", angle: 0, y: -8 },
      { t: .42, pose: "backTurn", angle: 180, y: 0 },
      { t: .68, pose: "hopClosed", angle: 180, y: -8 },
      { t: 1, pose: "idle", angle: 360, y: 0 }
    ]
  },

  dwitchagi: {
    name: "ティッチャギ",
    duration: 430,
    keyframes: [
      { t: 0, pose: "hopClosed", angle: 0, y: -8 },
      { t: .25, pose: "backTurn", angle: 180, y: -3 },
      { t: .45, pose: "backKickLoad", angle: 180, y: -6 },
      { t: .68, pose: "backKick", angle: 180, y: -8, trail: "straightHead" },
      { t: 1, pose: "idle", angle: 360, y: 0 }
    ]
  },

  dwihurigi: {
    name: "ティフリギ",
    duration: 520,
    keyframes: [
      { t: 0, pose: "hopClosed", angle: 0, y: -8 },
      { t: .25, pose: "backTurn", angle: 180, y: -3 },
      { t: .48, pose: "backKick", angle: 180, y: -8, trail: "straightHead" },
      { t: .72, pose: "hookReturn", angle: 180, y: -4, trail: "headEllipse" },
      { t: 1, pose: "idle", angle: 360, y: 0 }
    ]
  },

  naeryo: {
    name: "ネリョチャギ",
    duration: 480,
    keyframes: [
      { t: 0, pose: "load" },
      { t: .30, pose: "axeUp", trail: "axeArc" },
      { t: .62, pose: "axeDown", trail: "axeArc" },
      { t: 1, pose: "idle" }
    ]
  },

  jumpDwihurigi: {
    name: "跳びティフリギ",
    duration: 610,
    keyframes: [
      { t: 0, pose: "jumpLoad", y: 0 },
      { t: .28, pose: "jumpBackKick", y: -26, trail: "straightHead" },
      { t: .55, pose: "jumpHookReturn", y: -20, trail: "headEllipse" },
      { t: .78, pose: "land", y: 0 },
      { t: 1, pose: "idle" }
    ]
  },

  retreatDollyo: {
    name: "下がりトルリョチャギ",
    duration: 480,
    keyframes: [
      { t: 0, pose: "retreatLoad", x: -20 },
      { t: .45, pose: "roundKick", x: -45, trail: "roundArc" },
      { t: 1, pose: "idle", x: -55 }
    ]
  },

  retreatJumpDwit: {
    name: "下がり跳びティッチャギ",
    duration: 560,
    keyframes: [
      { t: 0, pose: "jumpLoad", x: -10, y: 0 },
      { t: .42, pose: "jumpBackKick", x: -55, y: -24, trail: "straightHead" },
      { t: 1, pose: "idle", x: -65, y: 0 }
    ]
  }
};
