(function(){
  function Fighter(x,y,facing,color,isPlayer){
    this.x=x; this.y=y; this.f=facing; this.color=color; this.isPlayer=!!isPlayer;
    this.hp=100; this.bal=100; this.id="idle"; this.move=MOVES.idle; this.time=0;
    this.guard=false; this.armed=false; this.stun=0; this.hitFlash=0; this.ko=false;
    this.lastHitMove=null; this.attackCooldown=0; this.counterBoost=0; this.counterText=0;
    this.spinReady=0; this.spinBonus=0; this.spinText=0; this.stepTimer=0; this.stepDir=0;
  }
  Fighter.prototype.start = function(id){
    this.id=id; this.move=MOVES[id]||MOVES.idle; this.time=0; this.lastHitMove=null;
    this.armed=(id==="rot");
  };
  Fighter.prototype.progress = function(){
    return this.move.dur ? Math.min(1,this.time/this.move.dur) : 0;
  };
  Fighter.prototype.frame = function(){
    const p=this.progress(); let f=this.move.frames[0];
    for(const k of this.move.frames){ if(p>=k.t) f=k; }
    return f;
  };
  Fighter.prototype.resetRound = function(x){
    this.x=x; this.hp=100; this.bal=100; this.id="idle"; this.move=MOVES.idle; this.time=0;
    this.guard=false; this.armed=false; this.stun=0; this.hitFlash=0; this.ko=false;
    this.lastHitMove=null; this.attackCooldown=.4; this.counterBoost=0; this.counterText=0;
    this.spinReady=0; this.spinBonus=0; this.spinText=0; this.stepTimer=0; this.stepDir=0;
  };
  window.Fighter = Fighter;
})();
