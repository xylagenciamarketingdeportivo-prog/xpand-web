// Newsletter — el email se guarda en una lista de contactos de Brevo.
//
// PARA ACTIVARLO: pega abajo la URL de envío del formulario de Brevo. Es la que
// aparece en el atributo action="..." del código que da Brevo al crear un
// formulario de suscripción, y tiene esta pinta:
//
//   const BREVO_ENDPOINT = 'https://sibforms.com/serve/MUIFAKExxxxxxxxxxxxxxxx';
//
// Mientras esta constante esté vacía, el formulario se queda desactivado y sigue
// diciendo "Próximamente": preferimos eso a un formulario que no guarda nada.
const BREVO_ENDPOINT = '';

const formNewsletter = document.getElementById('formNewsletter');
const notaNewsletter = document.getElementById('newsletterNota');

if (formNewsletter && notaNewsletter && BREVO_ENDPOINT) {
  const email = document.getElementById('newsletterEmail');
  const consentimiento = document.getElementById('newsletterConsentimiento');
  const boton = formNewsletter.querySelector('button[type="submit"]');

  const avisar = (texto, estado) => {
    notaNewsletter.textContent = texto;
    notaNewsletter.classList.toggle('formulario__nota--ok', estado === 'ok');
    notaNewsletter.classList.toggle('formulario__nota--error', estado === 'error');
  };

  // Se activa aquí, no en el HTML: si el JS falla, el formulario queda desactivado
  // en vez de aceptar emails que no van a ninguna parte.
  formNewsletter.action = BREVO_ENDPOINT;
  [email, consentimiento, boton].forEach((campo) => { campo.disabled = false; });
  boton.textContent = 'Suscribirme';
  avisar('Sin spam. Te puedes dar de baja cuando quieras.');

  formNewsletter.addEventListener('submit', async (evento) => {
    evento.preventDefault();
    if (boton.disabled) return;

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

    try {
      // mode:'no-cors' — Brevo recibe el POST, pero el navegador no nos deja leer
      // su respuesta desde otro dominio. Por eso se envía "a ciegas": si la
      // petición sale, damos el alta por buena. La confirmación de verdad es el
      // email que Brevo manda al suscriptor (doble opt-in).
      await fetch(BREVO_ENDPOINT, {
        method: 'POST',
        mode: 'no-cors',
        body: new URLSearchParams(new FormData(formNewsletter)),
      });
      formNewsletter.reset();
      boton.textContent = '¡Hecho!';
      avisar('¡Listo! Revisa tu correo para confirmar la suscripción.', 'ok');
    } catch (error) {
      // Solo llega aquí si no hay conexión: con no-cors, una respuesta de error
      // de Brevo es indistinguible de una correcta.
      boton.disabled = false;
      boton.textContent = 'Suscribirme';
      avisar('No hemos podido enviarlo. Revisa tu conexión o escríbenos a xylagenciamarketingdeportivo@gmail.com', 'error');
    }
  });
}
