class Input {
  constructor(){
    this.down = {}; this.pressed = {}; this.lastTap = {}; this.doubleTap = {};
    this.map = {ArrowLeft:'left', ArrowRight:'right', ArrowUp:'up', ArrowDown:'down', z:'small', Z:'small', x:'big', X:'big', c:'guard', C:'guard'};
    addEventListener('keydown', e=>this.set(this.map[e.key], true));
    addEventListener('keyup', e=>this.set(this.map[e.key], false));
    document.querySelectorAll('[data-input]').forEach(b=>{
      const k=b.dataset.input;
      b.addEventListener('touchstart',e=>{e.preventDefault();this.set(k,true)}, {passive:false});
      b.addEventListener('touchend',e=>{e.preventDefault();this.set(k,false)}, {passive:false});
      b.addEventListener('mousedown',()=>this.set(k,true)); b.addEventListener('mouseup',()=>this.set(k,false));
      b.addEventListener('mouseleave',()=>this.set(k,false));
    });
  }
  set(k,v){ if(!k) return; if(v && !this.down[k]){ this.pressed[k]=true; const now=performance.now(); if(now-(this.lastTap[k]||0)<280) this.doubleTap[k]=true; this.lastTap[k]=now; } this.down[k]=v; }
  consume(k){ const v=this.pressed[k]; this.pressed[k]=false; return v; }
  consumeDouble(k){ const v=this.doubleTap[k]; this.doubleTap[k]=false; return v; }
  endFrame(){ this.pressed={}; this.doubleTap={}; }
}
