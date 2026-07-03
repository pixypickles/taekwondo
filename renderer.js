function line(ctx, x1, y1, x2, y2, w, color, alpha = 1) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = color;
  ctx.lineWidth = w;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.restore();
}

function ellipseTrail(ctx, x, y, rx, ry, start, end, alpha=.45) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = "white";
  ctx.lineWidth = 12;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, -0.22, start, end);
  ctx.stroke();
  ctx.restore();
}

function arcTrail(ctx, x, y, r, start, end, alpha=.42) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = "white";
  ctx.lineWidth = 11;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.arc(x, y, r, start, end);
  ctx.stroke();
  ctx.restore();
}

export class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.resize();
    window.addEventListener("resize", () => this.resize());
  }

  resize() {
    const dpr = window.devicePixelRatio || 1;
    this.w = Math.floor(innerWidth * dpr);
    this.h = Math.floor(innerHeight * dpr);
    this.canvas.width = this.w;
    this.canvas.height = this.h;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.sw = innerWidth;
    this.sh = innerHeight;
  }

  clear() {
    const ctx = this.ctx;
    ctx.fillStyle = "#182536";
    ctx.fillRect(0,0,this.sw,this.sh);
    ctx.fillStyle = "#2c3b49";
    ctx.fillRect(0, this.sh * .47, this.sw, this.sh * .53);
    ctx.strokeStyle = "rgba(255,255,255,.35)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, this.sh * .79);
    ctx.lineTo(this.sw, this.sh * .79);
    ctx.stroke();
  }

  drawOpponent() {
    const ctx = this.ctx;
    const x = this.sw * .70, y = this.sh * .50;
    this.drawSimpleFighter(x, y, -1, "#ff3a48", "idle", 0, 0);
  }

  drawPlayer(player) {
    const frame = player.currentFrame();
    const pose = frame.pose || "idle";
    const px = player.x + (frame.x || 0) * player.facing;
    const py = player.y + (frame.y || 0);
    this.drawTrails(px, py, player.facing, frame.trail, pose);
    this.drawSimpleFighter(px, py, player.facing, player.color, pose, frame.angle || 0, frame.y || 0);
  }

  drawTrails(x, y, f, trail, pose) {
    if (!trail) return;
    const ctx = this.ctx;

    if (trail === "shortLine") {
      line(ctx, x + f*34, y + 0, x + f*96, y - 4, 8, "white", .38);
    }
    if (trail === "roundArc") {
      arcTrail(ctx, x + f*28, y - 10, 78, f>0 ? -0.70 : Math.PI+0.70, f>0 ? 0.22 : Math.PI-0.22, .35);
    }
    if (trail === "straightHead") {
      line(ctx, x + f*20, y - 35, x + f*170, y - 65, 12, "white", .40);
    }
    if (trail === "headEllipse") {
      ellipseTrail(ctx, x + f*145, y - 72, 95, 44, f>0 ? Math.PI*1.08 : -0.08, f>0 ? Math.PI*1.88 : Math.PI*.92, .48);
    }
    if (trail === "axeArc") {
      arcTrail(ctx, x + f*50, y - 40, 98, f>0 ? -1.55 : Math.PI+1.55, f>0 ? .65 : Math.PI-.65, .35);
    }
  }

  drawSimpleFighter(x, y, f, color, pose, angleDeg) {
    const ctx = this.ctx;
    const ground = y + 118;
    let head = {x:x, y:y-100};
    let bodyTop = {x:x, y:y-62};
    let hip = {x:x, y:y+5};
    let frontHand = {x:x+f*48, y:y-42};
    let rearHand = {x:x-f*38, y:y-22};
    let footA = {x:x-f*36, y:ground};
    let footB = {x:x+f*58, y:ground};
    let kneeA = {x:x-f*18, y:y+56};
    let kneeB = {x:x+f*35, y:y+56};

    if (pose === "load") {
      hip.x -= f*8; kneeB.x -= f*16; footB.x -= f*20;
    }
    if (pose === "knee") {
      kneeB = {x:x+f*50, y:y+0}; footB = {x:x+f*70, y:y+10};
    }
    if (pose === "frontKick") {
      kneeB = {x:x+f*58, y:y-5}; footB = {x:x+f*125, y:y-10};
    }
    if (pose === "roundKick") {
      hip.x -= f*6; kneeB = {x:x+f*60, y:y-10}; footB = {x:x+f*135, y:y-35};
    }
    if (pose === "axeUp") {
      kneeB = {x:x+f*52, y:y-55}; footB = {x:x+f*75, y:y-132};
    }
    if (pose === "axeDown") {
      kneeB = {x:x+f*78, y:y-35}; footB = {x:x+f*116, y:y+24};
    }
    if (pose === "hopClosed") {
      footA = {x:x-f*10, y:ground-18}; footB = {x:x+f*12, y:ground-18};
      kneeA = {x:x-f*8, y:y+58}; kneeB = {x:x+f*10, y:y+58};
      frontHand = {x:x+f*25, y:y-40}; rearHand = {x:x-f*25, y:y-30};
    }
    if (pose === "backTurn") {
      head.x = x-f*8; frontHand = {x:x-f*28,y:y-35}; rearHand={x:x+f*20,y:y-30};
      footA={x:x+f*25,y:ground}; footB={x:x-f*42,y:ground};
      kneeA={x:x+f*18,y:y+55}; kneeB={x:x-f*26,y:y+55};
    }
    if (pose === "backKickLoad") {
      head.x = x-f*22; hip.x = x-f*6;
      kneeB = {x:x+f*18, y:y+0}; footB = {x:x+f*40, y:y+20};
      footA = {x:x-f*8, y:ground};
    }
    if (pose === "backKick" || pose === "jumpBackKick") {
      head.x = x-f*24; bodyTop.x = x-f*10; hip.x = x-f*8;
      kneeB = {x:x+f*70, y:y-34}; footB = {x:x+f*160, y:y-62};
      footA = {x:x-f*6, y:ground}; kneeA = {x:x-f*4, y:y+58};
    }
    if (pose === "hookReturn" || pose === "jumpHookReturn") {
      head.x = x-f*22; bodyTop.x = x-f*10; hip.x = x-f*6;
      kneeB = {x:x+f*96, y:y-72}; footB = {x:x+f*130, y:y-110};
      footA = {x:x-f*8, y:ground}; kneeA = {x:x-f*5, y:y+58};
    }
    if (pose === "jumpLoad") {
      hip.y += 6; kneeB={x:x+f*30,y:y+25}; footB={x:x+f*46,y:y+48};
    }
    if (pose === "retreatLoad") {
      hip.x -= f*18; footA.x -= f*22; footB.x -= f*28;
    }
    if (pose === "land") {
      hip.y += 8;
    }

    // limbs
    line(ctx, bodyTop.x, bodyTop.y, hip.x, hip.y, 22, color, 1);
    line(ctx, bodyTop.x, bodyTop.y, frontHand.x, frontHand.y, 14, color, 1);
    line(ctx, bodyTop.x, bodyTop.y+8, rearHand.x, rearHand.y, 14, color, 1);
    line(ctx, hip.x, hip.y, kneeA.x, kneeA.y, 18, color, 1);
    line(ctx, kneeA.x, kneeA.y, footA.x, footA.y, 18, color, 1);
    line(ctx, hip.x, hip.y, kneeB.x, kneeB.y, 18, color, 1);
    line(ctx, kneeB.x, kneeB.y, footB.x, footB.y, 18, color, 1);

    // shoes and hands
    line(ctx, footA.x-f*12, footA.y+2, footA.x+f*18, footA.y+2, 12, "#07101f", 1);
    line(ctx, footB.x-f*12, footB.y+2, footB.x+f*18, footB.y+2, 12, "#07101f", 1);
    ctx.fillStyle = "#ffd2b0";
    ctx.beginPath(); ctx.arc(frontHand.x, frontHand.y, 12, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(rearHand.x, rearHand.y, 12, 0, Math.PI*2); ctx.fill();

    // head
    ctx.fillStyle = "#ffc59f";
    ctx.beginPath(); ctx.arc(head.x, head.y, 28, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = "#111";
    ctx.beginPath(); ctx.arc(head.x + f*10, head.y-5, 5, 0, Math.PI*2); ctx.fill();
  }
}
