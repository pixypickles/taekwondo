(function(){
  function Input(){
    this.down = new Set();
    this.events = [];
    this.lastTap = {};
    this.doubleTapMs = 260;
    this.setupButtons();
    this.setupKeys();
  }
  Input.prototype.press = function(name){
    const now = performance.now();
    if(this.down.has(name)) return;
    this.down.add(name);
    this.events.push({type:"press",name,time:now});
    if(name==="left" || name==="right"){
      if(now-(this.lastTap[name]||0)<this.doubleTapMs){
        this.events.push({type:"double",name,time:now});
      }
      this.lastTap[name]=now;
    }
  };
  Input.prototype.release = function(name){
    this.down.delete(name);
    this.events.push({type:"release",name,time:performance.now()});
  };
  Input.prototype.isDown = function(name){ return this.down.has(name); };
  Input.prototype.consume = function(){ const e=this.events; this.events=[]; return e; };
  Input.prototype.setupButtons = function(){
    document.querySelectorAll("[data-btn]").forEach(el=>{
      const name=el.dataset.btn;
      el.addEventListener("pointerdown",e=>{e.preventDefault();el.classList.add("down");this.press(name);},{passive:false});
      const up=e=>{e.preventDefault();el.classList.remove("down");this.release(name);};
      el.addEventListener("pointerup",up,{passive:false});
      el.addEventListener("pointercancel",up,{passive:false});
      el.addEventListener("pointerleave",up,{passive:false});
    });
  };
  Input.prototype.setupKeys = function(){
    const map={ArrowUp:"up",ArrowLeft:"left",ArrowRight:"right",ArrowDown:"rotate",z:"small",x:"big",c:"guard",Z:"small",X:"big",C:"guard"};
    addEventListener("keydown",e=>{
      if(e.key==="r"||e.key==="R"){ this.events.push({type:"reset",name:"reset",time:performance.now()}); return; }
      const b=map[e.key]; if(!b) return; e.preventDefault(); this.press(b);
    });
    addEventListener("keyup",e=>{const b=map[e.key]; if(!b) return; e.preventDefault(); this.release(b);});
  };
  window.Input = Input;
})();
