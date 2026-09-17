// Newsletter — el email se guarda en una lista de contactos de Brevo.
//
// BREVO_ENDPOINT es la URL del formulario de suscripción de Brevo (la del
// atributo action="..." de su código para incrustar). Si algún día se rehace el
// formulario en Brevo, la URL cambia y hay que pegar aquí la nueva: es lo único
// que hay que tocar. Si se deja vacía, el JS no hace nada y el formulario se
// queda desactivado, diciendo "Próximamente" — preferible a aceptar emails que
// no se guardan en ninguna parte.
const BREVO_ENDPOINT = 'https://bd5fa941.sibforms.com/serve/MUIFAIYdgXRPRZwgwBIv-FWim5-36Ywbg1JiL8ntswR79jZBWgiGHoK8cGDMVIbjAvBIkQeJ9Nc5N8dfkKeJ3D-QB7vrZjcgHlaP0VCIqN79LT1dr4TCpeofR-Gi-I9SHEJ-CB3Noy_43iGtCWxq6XggoZbd8LOomKPgF6tbp5OIsUFSV1XdslhAyObUY023W9Q-Wde_fTjL_POI6w==';

const formNewsletter = document.getElementById('formNewsletter');
const notaNewsletter = document.getElementById('newsletterNota');

if (formNewsletter && notaNewsletter && BREVO_ENDPOINT) {
  const email = document.getElementById('newsletterEmail');
  const consentimiento = document.getElementById('newsletterConsentimiento');
  const trampa = formNewsletter.querySelector('input[name="email_address_check"]');
  const boton = formNewsletter.querySelector('button[type="submit"]');

  const avisar = (texto, estado) => {
    notaNewsletter.textContent = texto;
    notaNewsletter.classList.toggle('formulario__nota--ok', estado === 'ok');
    notaNewsletter.classList.toggle('formulario__nota--error', estado === 'error');
  };

  const exito = () => {
    formNewsletter.reset();
    boton.textContent = '¡Hecho!';
    avisar('¡Listo! Ya estás en la lista. Te escribimos cuando lancemos la newsletter.', 'ok');
  };

  // Se activa desde aquí, no desde el HTML: si el JS fallara, el formulario
  // seguiría desactivado en vez de tragarse emails.
  formNewsletter.action = BREVO_ENDPOINT;
  [email, consentimiento, boton].forEach((campo) => { campo.disabled = false; });
  boton.textContent = 'Suscribirme';
  avisar('Sin spam. Te puedes dar de baja cuando quieras.');

  formNewsletter.addEventListener('submit', async (evento) => {
    evento.preventDefault();
    if (boton.disabled) return;

    // Brevo acepta como válido cualquier cosa que le mandes (responde
    // {"success":true} hasta con el email vacío o inválido), así que la
    // comprobación de verdad se hace aquí.
    if (!email.checkValidity()) {
      avisar('Revisa el email, parece que falta algo.', 'error');
      email.focus();
      return;
    }
    if (!consentimiento.checked) {
      avisar('Marca la casilla para poder suscribirte.', 'error');
      consentimiento.focus();
      return;
    }

    boton.disabled = true;
    boton.textContent = 'Enviando…';
    avisar('Un momento…');

    // Trampa antispam rellena: es un bot. Se le da la enhorabuena y no se envía.
    if (trampa && trampa.value) {
      exito();
      return;
    }

    try {
      // Brevo devuelve cabeceras CORS, así que se puede leer su respuesta.
      // No sirve para validar (contesta {"success":true} a casi todo), pero sí
      // para detectar una URL caducada o mal pegada, que devuelve un 404.
      const respuesta = await fetch(BREVO_ENDPOINT, {
        method: 'POST',
        mode: 'cors',
        body: new URLSearchParams(new FormData(formNewsletter)),
      });
      if (!respuesta.ok) throw new Error(`Brevo ha respondido ${respuesta.status}`);
      exito();
    } catch (error) {
      // Aquí se llega si no hay conexión o si el endpoint ya no vale.
      boton.disabled = false;
      boton.textContent = 'Suscribirme';
      avisar('No hemos podido enviarlo. Revisa tu conexión o escríbenos a xylagenciamarketingdeportivo@gmail.com', 'error');
    }
  });
}
