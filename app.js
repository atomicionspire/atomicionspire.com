(()=>{
  const body=document.body;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const motionButton=document.querySelector('#motion');
  const menu=document.querySelector('#primary-links');
  const menuButton=document.querySelector('.menu-btn');
  let stored=null;
  try{stored=localStorage.getItem('ionspire-motion')}catch{}
  let motion=stored===null?!reduced.matches:stored==='on';
  const applyMotion=value=>{
    motion=Boolean(value)&&!reduced.matches;
    body.classList.toggle('no-motion',!motion);
    if(motionButton){motionButton.textContent='Motion: '+(motion?'on':'off');motionButton.setAttribute('aria-pressed',String(!motion))}
    try{localStorage.setItem('ionspire-motion',motion?'on':'off')}catch{}
    window.dispatchEvent(new CustomEvent('motionchange',{detail:motion}));
  };
  applyMotion(motion);
  motionButton?.addEventListener('click',()=>applyMotion(!motion));
  reduced.addEventListener?.('change',e=>{if(e.matches)applyMotion(false)});

  const closeMenu=()=>{if(!menu||!menuButton)return;menu.classList.remove('is-open');menuButton.setAttribute('aria-expanded','false')};
  menuButton?.addEventListener('click',e=>{e.stopPropagation();const open=menu.classList.toggle('is-open');menuButton.setAttribute('aria-expanded',String(open))});
  menu?.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
  document.addEventListener('click',e=>{if(menu?.classList.contains('is-open')&&!menu.contains(e.target)&&!menuButton.contains(e.target))closeMenu()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();if(e.key==='Tab')body.dataset.input='keyboard'});
  document.addEventListener('pointerdown',()=>{body.dataset.input='pointer'},{passive:true});

  const reveals=[...document.querySelectorAll('.reveal')];
  if(!motion||!('IntersectionObserver' in window)){reveals.forEach(el=>el.classList.add('is-visible'))}
  else{
    const io=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');io.unobserve(entry.target)}}),{threshold:.08,rootMargin:'0px 0px -7%'});
    reveals.forEach(el=>io.observe(el));
  }

  let pending=false;
  window.addEventListener('pointermove',e=>{
    if(!motion||e.pointerType==='touch'||pending)return;
    pending=true;
    requestAnimationFrame(()=>{
      document.documentElement.style.setProperty('--mx',e.clientX+'px');
      document.documentElement.style.setProperty('--my',e.clientY+'px');
      const tilt=document.querySelector('[data-tilt]');
      if(tilt&&innerWidth>860){const x=e.clientX/innerWidth-.5,y=e.clientY/innerHeight-.5;tilt.style.transform=`perspective(1100px) rotateX(${(-y*2.2).toFixed(2)}deg) rotateY(${(x*3.2).toFixed(2)}deg)`}
      pending=false;
    });
  },{passive:true});
  window.addEventListener('pointerleave',()=>{const tilt=document.querySelector('[data-tilt]');if(tilt)tilt.style.transform=''});
})();