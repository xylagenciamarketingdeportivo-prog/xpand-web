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

// Carruseles (Casos de éxito y Colaboradores): repiten los elementos hasta cubrir el ancho
// visible y duplican ese conjunto, para que la animación CSS (de -50% a 0) haga un bucle sin saltos.
// Con .carrusel--vaiven no se repite nada: el conjunto va de izquierda a derecha y vuelve.
const PIXELES_POR_SEGUNDO = 40;

const iniciarCarrusel = (carrusel) => {
  const pista = carrusel.querySelector('.carrusel__pista');
  const originales = Array.from(pista.children);
  const vaiven = carrusel.classList.contains('carrusel--vaiven');
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

    if (vaiven) {
      // Recorrido entre los dos bordes difuminados (10% a cada lado, como la máscara del CSS).
      const margen = ancho * 0.1;
      const ultimo = originales[originales.length - 1];
      const visible = anchoConjunto - parseFloat(getComputedStyle(ultimo).marginRight);
      const inicio = margen;
      const fin = ancho - margen - visible;
      pista.style.setProperty('--desde', `${Math.min(inicio, fin)}px`);
      pista.style.setProperty('--hasta', `${Math.max(inicio, fin)}px`);
      pista.style.setProperty('--duracion', `${Math.max(Math.abs(fin - inicio) / PIXELES_POR_SEGUNDO, 4)}s`);
    } else {
      const repeticiones = Math.ceil(ancho / anchoConjunto);
      for (let i = 1; i < repeticiones * 2; i++) originales.forEach(clonar);
      pista.style.setProperty('--duracion', `${(anchoConjunto * repeticiones) / PIXELES_POR_SEGUNDO}s`);
    }

    carrusel.classList.add('carrusel--animado');
  };

  montar();
  window.addEventListener('resize', montar);
};

if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.querySelectorAll('.carrusel').forEach(iniciarCarrusel);
}
