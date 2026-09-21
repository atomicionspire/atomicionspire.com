(()=>{
  const canvas=document.querySelector('#energy-field');if(!canvas)return;
  const ctx=canvas.getContext('2d',{alpha:true});if(!ctx)return;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let active=!reduced.matches&&!document.body.classList.contains('no-motion'),raf=0,w=0,h=0,dpr=1,points=[];
  const count=()=>innerWidth<600?16:innerWidth<1000?24:38;
  function reset(){dpr=Math.min(devicePixelRatio||1,1.6);w=innerWidth;h=innerHeight;canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);canvas.style.width=w+'px';canvas.style.height=h+'px';ctx.setTransform(dpr,0,0,dpr,0,0);points=Array.from({length:count()},(_,i)=>({x:(i*97.3%100)/100*w,y:(i*61.7%100)/100*h,r:.6+(i%4)*.22,v:.04+(i%5)*.012,a:.1+(i%6)*.018}))}
  function frame(){if(!active||document.hidden){raf=0;return}ctx.clearRect(0,0,w,h);const g=ctx.createRadialGradient(w*.76,h*.22,0,w*.76,h*.22,Math.min(w,h)*.7);g.addColorStop(0,'rgba(174,25,14,.035)');g.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=g;ctx.fillRect(0,0,w,h);for(const p of points){p.y-=p.v;if(p.y<-8){p.y=h+8;p.x=(p.x+137)%w}ctx.beginPath();ctx.fillStyle=`rgba(255,73,48,${p.a})`;ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill()}raf=requestAnimationFrame(frame)}
  function start(){cancelAnimationFrame(raf);raf=0;if(active&&!document.hidden)raf=requestAnimationFrame(frame);else ctx.clearRect(0,0,w,h)}
  reset();start();
  addEventListener('resize',()=>{reset();start()},{passive:true});document.addEventListener('visibilitychange',start);window.addEventListener('motionchange',e=>{active=Boolean(e.detail)&&!reduced.matches;start()});reduced.addEventListener?.('change',e=>{active=!e.matches&&!document.body.classList.contains('no-motion');start()});
})();