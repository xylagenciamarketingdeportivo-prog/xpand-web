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

// Carrusel de Casos de éxito: repite las tarjetas hasta cubrir el ancho visible y
// duplica ese conjunto, para que la animación CSS (de -50% a 0) haga un bucle sin saltos.
const carrusel = document.querySelector('.carrusel');
const pista = carrusel && carrusel.querySelector('.carrusel__pista');
const PIXELES_POR_SEGUNDO = 40;

if (pista && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const originales = Array.from(pista.children);
  let anchoAnterior = 0;

  const clonar = (tarjeta) => {
    const copia = tarjeta.cloneNode(true);
    copia.setAttribute('aria-hidden', 'true');
    copia.querySelectorAll('a').forEach((enlace) => enlace.setAttribute('tabindex', '-1'));
    pista.appendChild(copia);
  };

  const montar = () => {
    const ancho = carrusel.clientWidth;
    if (ancho === anchoAnterior) return;
    anchoAnterior = ancho;

    pista.replaceChildren(...originales);
    const anchoConjunto = originales.reduce(
      (total, tarjeta) => total + tarjeta.offsetWidth + parseFloat(getComputedStyle(tarjeta).marginRight),
      0
    );
    const repeticiones = Math.ceil(ancho / anchoConjunto);
    for (let i = 1; i < repeticiones * 2; i++) originales.forEach(clonar);

    pista.style.setProperty('--duracion', `${(anchoConjunto * repeticiones) / PIXELES_POR_SEGUNDO}s`);
    carrusel.classList.add('carrusel--animado');
  };

  montar();
  window.addEventListener('resize', montar);
}
