class CPUFighter extends Fighter {
  constructor(x){ super(x, '#d62828', 'CPU', -1); this.cool=60; }
  handleAI(op){
    const dist=Math.abs(this.x-op.x); this.cool--;
    if(this.state==='idle'){
      if(dist>210) this.vx=-2.1;
      else if(dist<115) this.startState('backStep',14);
      else if(this.cool<=0){
        const r=Math.random();
        if(r<.25) this.startState('rotate',24);
        else if(r<.55) this.attack(MoveData.small);
        else if(r<.8) this.attack(MoveData.big);
        else this.guard=true;
        this.cool=45+Math.random()*50;
      }
    } else if(this.state==='rotate' && this.timer<17 && this.cool%2<1) this.attack(Math.random()<.55?MoveData.dwit:MoveData.dwiHurigi);
    if(this.state==='stepIn') this.vx=7*this.facing;
    if(this.state==='backStep') this.vx=-7*this.facing;
  }
}
