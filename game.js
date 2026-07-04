(function(){
  const canvas=document.getElementById("game");
  const renderer=new Renderer(canvas);
  const input=new Input();
  const player=new Fighter(innerWidth*.30,innerHeight*.50,1,"#1594ff",true);
  const cpu=new Fighter(innerWidth*.70,innerHeight*.50,-1,"#ff3a48",false);

  function updateHud(){
    document.getElementById("pHp").style.width=player.hp+"%";
    document.getElementById("eHp").style.width=cpu.hp+"%";
    document.getElementById("pBal").style.width=player.bal+"%";
    document.getElementById("eBal").style.width=cpu.bal+"%";
    const spin=document.getElementById("spinText");
    if(player.spinText>0) spin.textContent="SPIN BONUS!";
    else if(player.spinReady>0 && player.id==="rot") spin.textContent="SPIN READY";
    else spin.textContent="";
  }

  function resetAll(){
    Effects.hitStop=0;Effects.roundText=0;Effects.restartTimer=0;Effects.pWins=0;Effects.eWins=0;
    player.resetRound(innerWidth*.30); cpu.resetRound(innerWidth*.70);
    document.getElementById("moveName").textContent="構え";
  }

  function startPlayer(id){
    player.start(id);
    document.getElementById("moveName").textContent=player.move.name;
  }

  function handleInput(dt){
    player.guard=input.isDown("guard") && player.id==="idle" && player.stun<=0;
    player.spinReady=Math.max(0,player.spinReady-dt);
    player.spinText=Math.max(0,player.spinText-dt);
    player.stepTimer=Math.max(0,player.stepTimer-dt);
    player.counterText=Math.max(0,player.counterText-dt);

    const evs=input.consume();
    for(const ev of evs){
      if(ev.type==="reset"){ resetAll(); continue; }
      if(ev.type==="double" && ev.name==="right"){ player.stepTimer=.32; player.stepDir=1; player.x+=40; continue; }
      if(ev.type==="double" && ev.name==="left"){ player.stepTimer=.32; player.stepDir=-1; player.x-=40; continue; }
      if(ev.type!=="press" || player.stun>0 || player.ko) continue;

      const up=input.isDown("up"), back=input.isDown("left"), forward=input.isDown("right");
      if(player.armed && ev.name==="small"){
        player.spinBonus=player.spinReady>0?1:0; if(player.spinBonus)player.spinText=.55; startPlayer("dwit");
      }else if(player.armed && ev.name==="big"){
        player.spinBonus=player.spinReady>0?1:0; if(player.spinBonus)player.spinText=.55; startPlayer("huri");
      }else if(ev.name==="rotate"){
        startPlayer("rot");
      }else if(ev.name==="small" && up){
        startPlayer("na");
      }else if(ev.name==="big" && up){
        startPlayer("jumpHuri");
      }else if(ev.name==="small" && (forward || (player.stepTimer>0 && player.stepDir===1))){
        startPlayer("putcho");
      }else if(ev.name==="big" && (forward || (player.stepTimer>0 && player.stepDir===1))){
        startPlayer("milgi");
      }else if(ev.name==="small" && back){
        startPlayer("retDol");
      }else if(ev.name==="big" && back){
        startPlayer("retDwit");
      }else if(ev.name==="small"){
        startPlayer("ap");
      }else if(ev.name==="big"){
        startPlayer("dol");
      }
    }
  }

  function updatePlayer(dt){
    if(player.stun>0){ player.stun=Math.max(0,player.stun-dt); return; }
    if(player.id==="idle"){
      if(input.isDown("left")) player.x-=160*dt;
      if(input.isDown("right")) player.x+=160*dt;
    }else{
      if(player.id==="rot" || player.id==="dwit" || player.id==="huri"){
        if(input.isDown("right")) player.x+=90*dt;
        if(input.isDown("left")) player.x-=90*dt;
      }
      player.time+=dt*1000;
      if(player.id==="rot"){
        const rp=player.progress();
        if(rp>.76 && rp<.96) player.spinReady=input.isDown("right")?.22:.16;
      }
      Collision.tryHit(player,cpu);
      if(player.time>player.move.dur) startPlayer("idle");
    }
    player.x=Math.max(60,Math.min(innerWidth-60,player.x));
  }

  function updateRound(dt){
    if(player.ko || cpu.ko){
      Effects.roundText=Math.max(0,Effects.roundText-dt);
      Effects.restartTimer=Math.max(0,Effects.restartTimer-dt);
      if(Effects.restartTimer<=0){
        player.resetRound(innerWidth*.30);
        cpu.resetRound(innerWidth*.70);
        Effects.roundText=0; Effects.hitStop=0;
        document.getElementById("moveName").textContent="構え";
      }
      return true;
    }
    return false;
  }

  let last=performance.now();
  function loop(now){
    const dt=Math.min(.033,(now-last)/1000); last=now;
    player.y=innerHeight*.50; cpu.y=innerHeight*.50;

    if(Effects.hitStop>0){ Effects.hitStop=Math.max(0,Effects.hitStop-dt); updateHud(); renderer.draw(player,cpu); requestAnimationFrame(loop); return; }
    if(!updateRound(dt)){
      handleInput(dt);
      updatePlayer(dt);
      CPU.update(cpu,player,dt,innerWidth);
      Collision.tryHit(cpu,player);
      player.hitFlash=Math.max(0,player.hitFlash-dt); cpu.hitFlash=Math.max(0,cpu.hitFlash-dt);
    }
    updateHud();
    renderer.draw(player,cpu);
    requestAnimationFrame(loop);
  }
  resetAll();
  requestAnimationFrame(loop);
})();
