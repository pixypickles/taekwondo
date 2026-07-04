(function(){
  function isGuarding(target){ return target.guard && target.id==="idle" && target.stun<=0; }

  function applyDamage(attacker,target,move){
    let d=move.damage||0;
    const spinBoost = attacker.isPlayer && attacker.spinBonus>0;
    const counterBoost = attacker.isPlayer && attacker.counterBoost>0;
    if(spinBoost) d=Math.ceil(d*(move.heavy?1.25:1.15));
    if(counterBoost){ d=Math.ceil(d*1.5); attacker.counterBoost=0; }

    if(isGuarding(target)){
      d=Math.ceil(d*.25);
      target.bal=Math.min(100,target.bal+4);
      attacker.bal=Math.max(0,attacker.bal-(move.heavy?24:8));
      if(move.heavy){
        attacker.stun = spinBoost ? .62 : .42;
        target.counterBoost=1;
        target.counterText=.8;
      }
    }else{
      target.bal=Math.max(0,target.bal-(move.bal||8)-(spinBoost?10:0));
    }

    const kb=(move.kb||20)+(spinBoost?18:0);
    if(target.f<0) target.x += kb; else target.x -= kb;
    if(move.push && isGuarding(target)) target.x += attacker.f*32;

    target.hp=Math.max(0,target.hp-d);
    target.hitFlash=.18;
    Effects.hitStop = spinBoost ? .065 : (move.heavy ? .045 : .025);
    if(target.bal<=0){ target.stun=1.0; target.bal=45; }

    if(target.hp<=0 && !target.ko){
      target.ko=true;
      Effects.roundText=1.5;
      Effects.restartTimer=2.2;
      if(target.isPlayer) Effects.eWins++; else Effects.pWins++;
    }
  }

  function tryHit(attacker,target){
    const move=attacker.move;
    if(!move.damage || attacker.lastHitMove===attacker.id) return;
    const p=attacker.progress();
    if(!move.hit || p<move.hit[0] || p>move.hit[1]) return;

    const fr=attacker.frame();
    const ax=attacker.x+(fr.x||0)*attacker.f;
    const ay=attacker.y+(fr.y||0);
    const hitX=ax+attacker.f*move.range;
    const hitY=ay+move.height;
    const tx=target.x-target.f*28;
    const ty=target.y-70;

    if(Math.abs(hitX-tx)<68 && Math.abs(hitY-ty)<78){
      applyDamage(attacker,target,move);
      attacker.lastHitMove=attacker.id;
      if(attacker.isPlayer) attacker.spinBonus=0;
    }
  }

  window.Collision = { tryHit };
})();
