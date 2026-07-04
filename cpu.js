(function(){
  function updateCPU(cpu,player,dt,W){
    if(cpu.ko) return;
    if(cpu.stun>0){ cpu.stun=Math.max(0,cpu.stun-dt); cpu.guard=false; return; }

    if(cpu.id!=="idle"){
      cpu.time+=dt*1000;
      Collision.tryHit(cpu,player);
      if(cpu.time>cpu.move.dur){ cpu.start("idle"); cpu.attackCooldown=.35+Math.random()*.45; }
      return;
    }

    cpu.attackCooldown=Math.max(0,cpu.attackCooldown-dt);
    const dist=cpu.x-player.x;
    cpu.guard=false;

    if(player.id!=="idle" && player.progress()<.58 && Math.random()<.028) cpu.guard=true;

    if(dist>270) cpu.x-=105*dt;
    else if(dist<145) cpu.x+=115*dt;
    else if(cpu.attackCooldown<=0){
      const r=Math.random();
      if(dist<175 && r<.35) cpu.start("putcho");
      else if(dist<230 && r<.62) cpu.start("milgi");
      else if(r<.80) cpu.start("ap");
      else if(r<.94) cpu.start("dol");
      else cpu.start("na");
    }
    cpu.x=Math.max(W*.18,Math.min(W-70,cpu.x));
  }
  window.CPU = { update:updateCPU };
})();
