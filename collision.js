function resolveHits(a,b){ [ [a,b], [b,a] ].forEach(([p,o])=>{
  if(p.state!=='attack'||p.hitDone||!p.move) return;
  const total=p.move.startup+p.move.active+p.move.recovery;
  const elapsed=total-p.timer;
  if(elapsed < p.move.startup || elapsed > p.move.startup+p.move.active) return;
  const dist=Math.abs(p.x-o.x);
  if(dist < p.move.reach+35){
    p.hitDone=true;
    let dmg=p.move.power;
    if(o.state==='guard'||o.guard){ dmg*=0.25; o.balance=Math.max(0,o.balance-10); }
    else { o.balance=Math.max(0,o.balance-18); }
    o.hp=Math.max(0,o.hp-dmg);
  }
}); }
