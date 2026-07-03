const canvas=document.getElementById('game'), ctx=canvas.getContext('2d');
const input=new Input(); const player=new Fighter(260,'#1266d6','PLAYER',1); const cpu=new CPUFighter(700);
function drawStage(){
  const g=ctx.createLinearGradient(0,0,0,420); g.addColorStop(0,'#6ec8ff'); g.addColorStop(1,'#eaf7ff'); ctx.fillStyle=g; ctx.fillRect(0,0,960,540);
  ctx.fillStyle='#6faa66'; ctx.beginPath(); ctx.arc(180,360,220,Math.PI,0); ctx.fill(); ctx.beginPath(); ctx.arc(720,350,250,Math.PI,0); ctx.fill();
  ctx.fillStyle='#b98b62'; ctx.fillRect(0,320,960,20); ctx.fillStyle='#8d6b50'; for(let x=0;x<960;x+=80)ctx.fillRect(x,270,8,70); ctx.fillRect(0,270,960,10); ctx.fillRect(0,300,960,8);
  ctx.fillStyle='#285ca8'; ctx.fillRect(0,340,960,200); ctx.fillStyle='#b52a2a'; ctx.fillRect(0,340,960,18);
}
function loop(){
  player.facing = player.x < cpu.x ? 1 : -1; cpu.facing = cpu.x < player.x ? 1 : -1;
  player.update(input,cpu,true); cpu.update(input,player,false); resolveHits(player,cpu);
  drawStage(); drawHUD(ctx,player,cpu); player.draw(ctx); cpu.draw(ctx);
  if(player.hp<=0||cpu.hp<=0){ ctx.fillStyle='#000a'; ctx.fillRect(0,0,960,540); ctx.fillStyle='#fff'; ctx.font='56px system-ui'; ctx.textAlign='center'; ctx.fillText(player.hp<=0?'CPU WIN':'PLAYER WIN',480,270); }
  input.endFrame(); requestAnimationFrame(loop);
}
loop();
