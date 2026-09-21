const routes = ['index.html','projects.html','eve.html','ionspire-os.html','about.html','contact.html','games.html','parallel-earth.html','president-simulator.html','ai-dungeon-master.html','privacy.html','terms.html'];
const fixture = document.querySelector('#fixture');
const route = document.querySelector('#route');
const width = document.querySelector('#width');
const scale = document.querySelector('#scale');
const status = document.querySelector('#status');
route.innerHTML = routes.map(page => '<option>' + page + '</option>').join('');
function load(page = route.value, size = width.value, large = scale.checked) {
  return new Promise(resolve => {
    fixture.style.width = size + 'px';
    fixture.onload = async () => {
      const doc = fixture.contentDocument;
      if (large) {
        const textScale = doc.createElement('style');
        textScale.textContent = 'html { font-size: 200% !important; }';
        doc.head.append(textScale);
      }
      await Promise.all([...doc.images].map(image => image.decode().catch(() => null)));
      await doc.fonts.ready;
      requestAnimationFrame(() => requestAnimationFrame(resolve));
    };
    fixture.src = '/' + page + '?v=3.0.1' + (large ? '&qa-scale=2' : '');
  });
}
document.querySelector('#load').addEventListener('click', () => load());
document.querySelector('#hero').addEventListener('click', () => fixture.contentDocument.querySelector('.brand-stage, .game-art, .eve-visual, .os-visual')?.scrollIntoView({ block: 'center' }));
document.querySelector('#bottom').addEventListener('click', () => fixture.contentDocument.querySelector('.footer').scrollIntoView({ block: 'end' }));
document.querySelector('#run').addEventListener('click', async () => {
  const report = [];
  const sizes = [320,360,390,430,600,768,860,1024,1440];
  for (const page of routes) {
    for (const [size,large] of [...sizes.map(size => [size,false]), [390,true]]) {
      status.textContent = page + ' / ' + size + (large ? ' / 200%' : '');
      await load(page,size,large);
      const doc = fixture.contentDocument, win = fixture.contentWindow, errors = [];
      if (doc.documentElement.scrollWidth > win.innerWidth + 1) errors.push('document horizontal overflow: '+doc.documentElement.scrollWidth);
      for (const element of doc.querySelectorAll('nav a, .menu-btn, h1, h2, h3, p, .actions a, .footer, .card, .feature')) {
        if (win.getComputedStyle(element).display === 'none' || !element.getClientRects().length) continue;
        const rect = element.getBoundingClientRect();
        if (rect.left < -1 || rect.right > win.innerWidth + 1) errors.push('offscreen '+element.tagName+'.'+element.className);
        if (element.scrollWidth > element.clientWidth + 2 && win.getComputedStyle(element).display !== 'inline') errors.push('text/content overflow '+element.tagName+'.'+element.className);
      }
      for(const image of doc.images) if(!image.complete || image.naturalWidth === 0 || image.naturalHeight === 0) errors.push('image failed '+image.getAttribute('src'));
      if(doc.querySelectorAll('.brand-mark').length !== 2) errors.push('inconsistent header/footer');
      const button = doc.querySelector('.menu-btn'), links = doc.querySelector('#primary-links');
      if(size <= 860) {
        button.click();
        if(button.getAttribute('aria-expanded') !== 'true' || win.getComputedStyle(links).display === 'none') errors.push('menu did not open');
        doc.dispatchEvent(new win.KeyboardEvent('keydown',{key:'Escape',bubbles:true}));
        if(button.getAttribute('aria-expanded') !== 'false' || win.getComputedStyle(links).display !== 'none') errors.push('menu did not close with Escape');
        button.click(); doc.querySelector('h1').click();
        if(button.getAttribute('aria-expanded') !== 'false') errors.push('outside click did not close menu');
      }
      for(const card of doc.querySelectorAll('a.card')) if(win.getComputedStyle(card).textDecorationLine !== 'none') errors.push('underlined project card');
      report.push({page,width:size,textScale:large?2:1,errors});
    }
  }
  document.querySelector('#results').textContent = JSON.stringify({views:report.length,failed:report.filter(r=>r.errors.length),report},null,2);
  status.textContent = 'Complete: '+report.length+' views; '+report.filter(r=>r.errors.length).length+' failures';
  await load();
});
load();
