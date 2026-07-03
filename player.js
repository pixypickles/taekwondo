class Fighter {
  constructor(x, color, name, facing=1){
    this.x=x; this.y=405; this.vx=0; this.color=color; this.name=name; this.facing=facing;
    this.hp=1000; this.balance=100; this.state='idle'; this.timer=0; this.move=null; this.hitDone=false; this.guard=false;
  }
  startState(s, t){ this.state=s; this.timer=t; this.hitDone=false; }
  attack(move){ if(this.state==='attack') return; this.move=move; this.balance=Math.max(0,this.balance-move.balanceCost); this.startState('attack', move.startup+move.active+move.recovery); }
  update(input, opponent, isPlayer=true){
    this.guard=false; this.vx=0;
    if(this.state!=='idle'){ this.timer--; if(this.timer<=0){this.state='idle'; this.move=null;} }
    if(isPlayer) this.handlePlayerInput(input); else this.handleAI(opponent);
    this.x += this.vx; this.x=Math.max(70, Math.min(890, this.x));
    if(this.state==='idle') this.balance=Math.min(100, this.balance+0.05);
  }
  handlePlayerInput(input){
    const forward = this.facing===1 ? 'right' : 'left'; const back = this.facing===1 ? 'left' : 'right';
    if(this.state==='idle'){
      if(input.consumeDouble(forward)) this.startState('stepIn', 12);
      else if(input.consumeDouble(back)) this.startState('backStep', 14);
      else if(input.down.left) this.vx=-3;
      else if(input.down.right) this.vx=3;
      if(input.down.guard) { this.guard=true; this.state='guard'; this.timer=2; }
      if(input.consume('down')) this.startState('rotate', 26);
      if(input.consume('small')) this.attack(input.down.up?MoveData.naeryo:input.down[back]?MoveData.backSmall:MoveData.small);
      if(input.consume('big')) this.attack(input.down.up?MoveData.jumpSpin:input.down[back]?MoveData.backBig:MoveData.big);
    } else if(this.state==='rotate'){
      if(input.consume('small')) this.attack(MoveData.dwit);
      if(input.consume('big')) this.attack(MoveData.dwiHurigi);
    }
    if(this.state==='stepIn') this.vx=7*this.facing;
    if(this.state==='backStep') this.vx=-7*this.facing;
  }
  handleAI(opponent){ /* overwritten */ }
  draw(ctx){
    ctx.save(); ctx.translate(this.x,this.y); ctx.scale(this.facing,1);
    const c=this.color;
    ctx.lineWidth=6; ctx.lineCap='round'; ctx.strokeStyle='#171717'; ctx.fillStyle=c;
    // body
    ctx.fillStyle=c; ctx.fillRect(-24,-112,48,72); ctx.strokeRect(-24,-112,48,72);
    ctx.fillStyle='#111'; ctx.fillRect(-30,-43,60,9);
    // head eyes
    ctx.fillStyle='#f2c89f'; ctx.beginPath(); ctx.arc(0,-142,24,0,Math.PI*2); ctx.fill(); ctx.stroke();
    ctx.fillStyle='#111'; ctx.beginPath(); ctx.arc(8,-145,3,0,Math.PI*2); ctx.fill();
    // arms
    ctx.strokeStyle='#171717'; ctx.beginPath(); ctx.moveTo(-22,-96); ctx.lineTo(-48,-76); ctx.lineTo(-35,-62); ctx.moveTo(22,-96); ctx.lineTo(50,-80); ctx.lineTo(42,-60); ctx.stroke();
    // legs, animated
    let kick=0, rear=0; if(this.state==='attack'){ const total=this.move.startup+this.move.active+this.move.recovery; const p=1-this.timer/total; kick=Math.sin(Math.min(1,p*1.7)*Math.PI); }
    if(this.state==='rotate'){ ctx.rotate(Math.sin(this.timer/3)*0.18); }
    ctx.beginPath(); ctx.moveTo(-15,-40); ctx.lineTo(-34,0); ctx.lineTo(-40,28); ctx.moveTo(15,-40); ctx.lineTo(35+kick*75, -2-kick*35); ctx.lineTo(55+kick*115, 20-kick*55); ctx.stroke();
    if(this.state==='guard'){ ctx.fillStyle='#444'; ctx.fillRect(25,-110,14,58); }
    ctx.fillStyle='#fff'; ctx.font='14px system-ui'; ctx.textAlign='center'; ctx.fillText(this.state==='attack'?this.move.name:this.state,0,-178);
    ctx.restore();
  }
}
