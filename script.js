/* Shared navigation works on every route, with keyboard and history support. */
(() => {
  const nav = document.querySelector('.nav');
  const button = document.querySelector('.menu-btn');
  const links = document.querySelector('#primary-links');
  const setMenu = (open) => {
    links?.classList.toggle('open', open);
    button?.setAttribute('aria-expanded', String(open));
    if (button) button.textContent = open ? 'Close' : 'Menu';
  };
  button?.addEventListener('click', () => setMenu(button.getAttribute('aria-expanded') !== 'true'));
  links?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && button?.getAttribute('aria-expanded') === 'true') {
      setMenu(false);
      button.focus();
    }
  });
  document.addEventListener('click', event => { if (!nav?.contains(event.target)) setMenu(false); });
  window.matchMedia('(min-width: 861px)').addEventListener('change', () => setMenu(false));
  window.addEventListener('pageshow', () => setMenu(false));
  document.querySelectorAll('[data-year]').forEach(element => { element.textContent = String(new Date().getFullYear()); });
})();
