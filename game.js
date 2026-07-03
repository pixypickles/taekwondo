import { Input } from "./input.js";
import { Player } from "./player.js";
import { Renderer } from "./renderer.js";

const canvas = document.getElementById("game");
const renderer = new Renderer(canvas);
const input = new Input();
const player = new Player(innerWidth * .30, innerHeight * .50, 1, "#1594ff");

let last = performance.now();

function loop(now) {
  const dt = Math.min(.033, (now - last) / 1000);
  last = now;

  player.y = innerHeight * .50;
  player.update(dt, input);

  renderer.clear();
  renderer.drawOpponent();
  renderer.drawPlayer(player);

  document.getElementById("moveName").textContent = player.move.name;
  document.getElementById("debug").textContent =
    "小=アプチャギ / 大=トルリョチャギ / 回→小=ティッチャギ / 回→大=ティフリギ / 上+大=跳びティフリギ";

  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
