(function(){
  function Renderer(canvas){
    this.canvas=canvas; this.ctx=canvas.getContext("2d"); this.resize();
    addEventListener("resize",()=>this.resize());
  }
  Renderer.prototype.resize=function(){
    this.W=innerWidth; this.H=innerHeight; const d=devicePixelRatio||1;
    this.canvas.width=this.W*d; this.canvas.height=this.H*d; this.ctx.setTransform(d,0,0,d,0,0);
  };

  function line(ctx,x1,y1,x2,y2,w,c,a=1){
    ctx.save();ctx.globalAlpha=a;ctx.strokeStyle=c;ctx.lineWidth=w;ctx.lineCap="round";
    ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();ctx.restore();
  }
  function arc(ctx,x,y,r,s,e,w=11,a=.35){
    ctx.save();ctx.globalAlpha=a;ctx.strokeStyle="white";ctx.lineWidth=w;ctx.lineCap="round";
    ctx.beginPath();ctx.arc(x,y,r,s,e);ctx.stroke();ctx.restore();
  }
  function ell(ctx,x,y,rx,ry,rot,s,e,w=12,a=.44){
    ctx.save();ctx.globalAlpha=a;ctx.strokeStyle="white";ctx.lineWidth=w;ctx.lineCap="round";
    ctx.beginPath();ctx.ellipse(x,y,rx,ry,rot,s,e);ctx.stroke();ctx.restore();
  }
  function bodySpin(ctx,x,y,f,phase){
    const cx=x+f*2, cy=y-18;
    ell(ctx,cx,cy-20,58,18,-.25,Math.PI*1.05,Math.PI*1.86,10,phase===2?.42:.32);
    ell(ctx,cx,cy+28,54,16,-.22,Math.PI*.10,Math.PI*.86,10,.26);
    if(phase===2) ell(ctx,cx,cy+66,48,15,-.18,Math.PI*.10,Math.PI*.78,9,.22);
  }
  function trails(ctx,x,y,f,t){
    if(!t) return;
    if(t==="bodySpin1") return bodySpin(ctx,x,y,f,1);
    if(t==="bodySpin2") return bodySpin(ctx,x,y,f,2);
    if(t==="bodySpin3") return bodySpin(ctx,x,y,f,3);
    if(t==="short") line(ctx,x+f*34,y,x+f*84,y-3,8,"white",.34);
    if(t==="snap") arc(ctx,x+f*44,y-12,46,f>0?-.55:Math.PI+.55,f>0?.15:Math.PI-.15,9,.35);
    if(t==="push") line(ctx,x+f*36,y-20,x+f*136,y-20,13,"white",.35);
    if(t==="round") arc(ctx,x+f*28,y-10,78,f>0?-.7:Math.PI+.7,f>0?.22:Math.PI-.22,11,.35);
    if(t==="straight") line(ctx,x+f*20,y-35,x+f*170,y-65,12,"white",.40);
    if(t==="ellipse") ell(ctx,x+f*145,y-72,95,44,-.22,f>0?Math.PI*1.08:-.08,f>0?Math.PI*1.88:Math.PI*.92,12,.48);
    if(t==="axe") arc(ctx,x+f*50,y-40,98,f>0?-1.55:Math.PI+1.55,f>0?.65:Math.PI-.65,11,.35);
  }

  function fighter(ctx,u){
    const fr=u.frame(); const x=u.x+(fr.x||0)*u.f, y=u.y+(fr.y||0), f=u.f, color=u.hitFlash>0?"#fff":(u.guard?"#9fd8ff":u.color), pose=fr.pose||"idle";
    const ground=y+118; let head={x,y:y-100}, top={x,y:y-62}, hip={x,y:y+5}, fh={x:x+f*48,y:y-42}, rh={x:x-f*38,y:y-22}, fa={x:x-f*36,y:ground}, fb={x:x+f*58,y:ground}, ka={x:x-f*18,y:y+56}, kb={x:x+f*35,y:y+56};

    if(pose==="load"){hip.x-=f*8;kb.x-=f*16;fb.x-=f*20}
    if(pose==="stepIn"){hip.x+=f*12;fa.x+=f*18;fb.x+=f*18}
    if(pose==="putchoLoad"){kb={x:x+f*44,y:y+8};fb={x:x+f*62,y:y+18}}
    if(pose==="putcho"){kb={x:x+f*55,y:y-14};fb={x:x+f*118,y:y-38}}
    if(pose==="pushLoad"){kb={x:x+f*45,y:y+2};fb={x:x+f*58,y:y+8}}
    if(pose==="pushKick"){kb={x:x+f*72,y:y-12};fb={x:x+f*148,y:y-22}}
    if(pose==="knee"){kb={x:x+f*50,y:y};fb={x:x+f*70,y:y+10}}
    if(pose==="front"){kb={x:x+f*58,y:y-5};fb={x:x+f*125,y:y-10}}
    if(pose==="round"){hip.x-=f*6;kb={x:x+f*60,y:y-10};fb={x:x+f*135,y:y-35}}
    if(pose==="axeUp"){kb={x:x+f*52,y:y-55};fb={x:x+f*75,y:y-132}}
    if(pose==="axeDown"){kb={x:x+f*78,y:y-35};fb={x:x+f*116,y:y+24}}
    if(pose==="closed"){fa={x:x-f*10,y:ground-18};fb={x:x+f*12,y:ground-18};ka={x:x-f*8,y:y+58};kb={x:x+f*10,y:y+58};fh={x:x+f*25,y:y-40};rh={x:x-f*25,y:y-30}}
    if(pose==="back"){head.x=x-f*8;fh={x:x-f*28,y:y-35};rh={x:x+f*20,y:y-30};fa={x:x+f*25,y:ground};fb={x:x-f*42,y:ground};ka={x:x+f*18,y:y+55};kb={x:x-f*26,y:y+55}}
    if(pose==="backLoad"){head.x=x-f*22;hip.x=x-f*6;kb={x:x+f*18,y:y};fb={x:x+f*40,y:y+20};fa={x:x-f*8,y:ground}}
    if(pose==="backKick"||pose==="jumpBack"){head.x=x-f*24;top.x=x-f*10;hip.x=x-f*8;kb={x:x+f*70,y:y-34};fb={x:x+f*160,y:y-62};fa={x:x-f*6,y:ground};ka={x:x-f*4,y:y+58}}
    if(pose==="hook"||pose==="jumpHook"){head.x=x-f*22;top.x=x-f*10;hip.x=x-f*6;kb={x:x+f*96,y:y-72};fb={x:x+f*130,y:y-110};fa={x:x-f*8,y:ground};ka={x:x-f*5,y:y+58}}
    if(pose==="jumpLoad"){hip.y+=6;kb={x:x+f*30,y:y+25};fb={x:x+f*46,y:y+48}}
    if(pose==="retreat"){hip.x-=f*18;fa.x-=f*22;fb.x-=f*28}
    if(pose==="land")hip.y+=8;

    trails(ctx,x,y,f,fr.trail);
    if(u.spinBonus && (fr.trail==="straight"||fr.trail==="ellipse")){
      ctx.save();ctx.globalAlpha=.42;ctx.strokeStyle="white";ctx.lineWidth=5;ctx.beginPath();ctx.arc(x+f*80,y-55,42,0,Math.PI*2);ctx.stroke();ctx.restore();
    }
    if(u.guard){ctx.save();ctx.globalAlpha=.55;ctx.strokeStyle="#9fd8ff";ctx.lineWidth=5;ctx.beginPath();ctx.arc(x+f*42,y-45,42,f>0?2.1:-1.1,f>0?4.2:1.1);ctx.stroke();ctx.restore();}

    line(ctx,top.x,top.y,hip.x,hip.y,22,color);
    line(ctx,top.x,top.y,fh.x,fh.y,14,color); line(ctx,top.x,top.y+8,rh.x,rh.y,14,color);
    line(ctx,hip.x,hip.y,ka.x,ka.y,18,color); line(ctx,ka.x,ka.y,fa.x,fa.y,18,color);
    line(ctx,hip.x,hip.y,kb.x,kb.y,18,color); line(ctx,kb.x,kb.y,fb.x,fb.y,18,color);
    line(ctx,fa.x-f*12,fa.y+2,fa.x+f*18,fa.y+2,12,"#07101f"); line(ctx,fb.x-f*12,fb.y+2,fb.x+f*18,fb.y+2,12,"#07101f");
    ctx.fillStyle="#ffd2b0"; ctx.beginPath();ctx.arc(fh.x,fh.y,12,0,Math.PI*2);ctx.fill(); ctx.beginPath();ctx.arc(rh.x,rh.y,12,0,Math.PI*2);ctx.fill();
    ctx.fillStyle="#ffc59f"; ctx.beginPath();ctx.arc(head.x,head.y,28,0,Math.PI*2);ctx.fill(); ctx.fillStyle="#111";ctx.beginPath();ctx.arc(head.x+f*10,head.y-5,5,0,Math.PI*2);ctx.fill();

    if(u.hitFlash>0){
      ctx.save();ctx.strokeStyle="white";ctx.lineWidth=4;ctx.globalAlpha=.9;const sx=x+f*42,sy=y-78;
      ctx.beginPath();ctx.moveTo(sx-18,sy);ctx.lineTo(sx+18,sy);ctx.moveTo(sx,sy-18);ctx.lineTo(sx,sy+18);ctx.moveTo(sx-13,sy-13);ctx.lineTo(sx+13,sy+13);ctx.moveTo(sx-13,sy+13);ctx.lineTo(sx+13,sy-13);ctx.stroke();ctx.restore();
    }
  }

  Renderer.prototype.draw=function(player,cpu){
    const ctx=this.ctx,W=this.W,H=this.H;
    ctx.fillStyle="#182536";ctx.fillRect(0,0,W,H);
    ctx.fillStyle="#2c3b49";ctx.fillRect(0,H*.47,W,H*.53);
    line(ctx,0,H*.79,W,H*.79,3,"rgba(255,255,255,.35)");
    fighter(ctx,cpu); fighter(ctx,player);
    if(player.counterText>0){ctx.save();ctx.fillStyle="white";ctx.font="900 26px system-ui";ctx.fillText("COUNTER CHANCE!",W*.33,H*.28);ctx.restore();}
    if(Effects.roundText>0 || player.ko || cpu.ko){
      ctx.save();ctx.textAlign="center";ctx.fillStyle="white";ctx.font="900 54px system-ui";ctx.fillText(player.ko?"YOU LOSE":"K.O.",W/2,H*.34);
      ctx.font="900 18px system-ui";ctx.fillText("NEXT ROUND...",W/2,H*.34+36);ctx.fillText("PLAYER "+Effects.pWins+" - "+Effects.eWins+" CPU",W/2,H*.34+62);ctx.restore();
    }
  };
  window.Renderer=Renderer;
})();
