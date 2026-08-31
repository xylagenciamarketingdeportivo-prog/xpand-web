const menuBoton = document.getElementById('menuBoton');
const nav = document.getElementById('navPrincipal');

if (menuBoton && nav) {
  menuBoton.addEventListener('click', () => {
    const abierto = nav.classList.toggle('abierto');
    menuBoton.setAttribute('aria-expanded', String(abierto));
  });

  nav.querySelectorAll('a').forEach((enlace) => {
    enlace.addEventListener('click', () => {
      nav.classList.remove('abierto');
      menuBoton.setAttribute('aria-expanded', 'false');
    });
  });
}
