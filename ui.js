function bar(ctx,x,y,w,h,value,max,label,color){
  ctx.fillStyle='#222'; ctx.fillRect(x,y,w,h); ctx.fillStyle=color; ctx.fillRect(x,y,w*(value/max),h); ctx.strokeStyle='#111'; ctx.strokeRect(x,y,w,h); ctx.fillStyle='#fff'; ctx.font='18px system-ui'; ctx.textAlign='center'; ctx.fillText(label, x+w/2, y+h-5);
}
function drawHUD(ctx,p,cpu){
  bar(ctx,24,18,360,26,p.hp,1000,Math.round(p.hp)+' / 1000','#22cc22');
  bar(ctx,24,52,360,14,p.balance,100,'BALANCE','#1674d1');
  bar(ctx,576,18,360,26,cpu.hp,1000,Math.round(cpu.hp)+' / 1000','#22cc22');
  bar(ctx,576,52,360,14,cpu.balance,100,'BALANCE','#d11616');
  ctx.fillStyle='#111c'; ctx.fillRect(430,10,100,80); ctx.fillStyle='#fff'; ctx.font='44px system-ui'; ctx.textAlign='center'; ctx.fillText('60',480,70);
  ctx.font='16px system-ui'; ctx.fillText('ROUND 1',480,28);
  ctx.fillStyle='#fff'; ctx.font='18px system-ui'; ctx.textAlign='left';
  ctx.fillText('前前:ステップイン / 後後:バックステップ / ↓:回転フェイント / Z小 X大 Cガード',28,515);
}
