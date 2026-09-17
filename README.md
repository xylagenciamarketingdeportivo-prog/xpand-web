# XPAND — web de la agencia

Web pública de XPAND, agencia de marketing deportivo. HTML/CSS/JS plano, sin
build ni dependencias — a propósito, para mantenerla simple y fácil de editar.

## Estructura

```
index.html        una sola página con secciones ancladas (Servicios, Equipo XPAND,
                   Colaboradores, Sobre nosotros, Newsletter, Contacto)
css/style.css      estilos y tokens de marca
js/main.js         menú móvil y carruseles (Equipo XPAND, Colaboradores)
js/newsletter.js   formulario de newsletter (lo envía a Brevo)
assets/logo.svg    logo completo (copia de activos/logo.svg en xpand-carrusel)
assets/favicon.svg icono de pestaña (recorte del logo, colores fijos)
assets/iconos.svg  sprite de iconos (mismos SVG que activos/iconos/ en xpand-carrusel)
CNAME              dominio personalizado para GitHub Pages
```

## Seguridad

- **`main` está protegida**: no se puede forzar el historial ni borrar la rama,
  y la regla se aplica también a los administradores. Un `git push` normal
  funciona igual que siempre; solo se bloquean `--force` y el borrado. Para
  desactivarla en una emergencia hace falta entrar en Settings → Branches del
  repo.
- **CSP por `<meta>`** en `index.html`. Limita de dónde puede salir el código
  que ejecuta la página: scripts solo de este dominio, conexiones solo a Brevo,
  tipografías solo de Google Fonts. **Si algún día añades un script externo**
  (analítica, chat, píxel de Meta...), hay que añadir su dominio a esa etiqueta
  o el navegador lo bloqueará y parecerá que "no funciona".
- GitHub Pages no permite cabeceras propias, así que `Strict-Transport-Security`,
  `X-Frame-Options` y compañía no se pueden poner. Para tenerlas habría que
  meter Cloudflare (gratis) por delante del dominio.
- El repo no contiene secretos y no debe contener ninguno: todo lo que hay aquí
  se sirve públicamente. Nunca pegues una clave de API de Brevo ni de ningún
  otro servicio en estos archivos.

## Caché del navegador

`index.html` enlaza los archivos con una versión: `css/style.css?v=20260917`,
y lo mismo los dos `.js`. **Si cambias el CSS o el JS, sube ese número en las
tres etiquetas** (vale la fecha del día). Si no, quien ya haya visitado la web
puede seguir viendo la versión vieja durante un rato y parecerá que el cambio
no se ha publicado — ha pasado dos veces.

Por si acaso, las cosas que no pueden permitirse depender del CSS llevan su
estilo en línea. Es el caso del campo trampa antispam del formulario de
Newsletter: si el CSS no cargara o estuviera cacheado, seguiría invisible en
lugar de aparecer como un campo vacío enorme en mitad de la sección.

## Marca

Los tokens (`--lima: #C2D62E`, `--blanco: #F5F5F5`, tipografías Barlow /
Barlow Condensed) son los mismos que usa `motor/tema.py` en el repo
`xpand-carrusel`. Si la marca cambia, hay que actualizar los dos sitios.

## Ver la web en local

Los iconos usan `<use href="assets/iconos.svg#...">`, que los navegadores
bloquean si abres el archivo directamente con `file://`. Sirve la carpeta con
un servidor local:

```bash
python3 -m http.server 8000
# abre http://localhost:8000
```

## Publicar (GitHub Pages)

Este repo ya está configurado para publicarse con GitHub Pages desde la rama
`main` (raíz). Cada `git push` a `main` actualiza la web en 1-2 minutos.

### Conectar el dominio xpandyourlimits.es

**Ya hecho** (septiembre de 2026): el dominio está comprado en DonDominio y su
DNS ya apunta a GitHub Pages. Se deja la receta por si hay que rehacerla. En el
panel de DNS de DonDominio:

1. Elimina el registro `ANAME`/`ALIAS` actual de la raíz (el que apunta a
   `boisterous-llama-fbda6c.netlify.app`).
2. Añade 4 registros `A` en la raíz (`@`) apuntando a las IPs de GitHub Pages:
   ```
   185.199.108.153
   185.199.109.153
   185.199.110.153
   185.199.111.153
   ```
3. Cambia el `CNAME` de `www` para que apunte a
   `xylagenciamarketingdeportivo-prog.github.io` (en vez de a Netlify).
4. En GitHub → Settings → Pages del repo, marca "Enforce HTTPS" en cuanto el
   certificado esté disponible (puede tardar hasta un par de horas tras el
   cambio de DNS).

No toques los registros `TXT` (SPF/correo) ni `bbdd/ftp/imap/mail/pop/pop3`:
son del correo y hosting de DonDominio, no de la web.

## Newsletter (Brevo)

**Ya está conectado y recogiendo emails.** Los correos del formulario de
Newsletter entran en una lista de contactos de [Brevo](https://app.brevo.com),
en la cuenta "Xpand Your Limits". La web no envía nada: solo da de alta el
contacto. La newsletter, cuando se lance, se escribe y se manda desde Brevo.

Toda la configuración cabe en una línea, la de `BREVO_ENDPOINT` en
`js/newsletter.js`: es la URL del formulario de suscripción de Brevo, la que
aparece en el `action="..."` de su código para incrustar (Brevo → Marketing →
Formularios → el formulario → paso "Compartir" → pestaña "HTML simple"). Si
algún día se rehace el formulario en Brevo, la URL cambia y hay que pegar aquí
la nueva; no hay nada más que tocar.

Si esa constante se deja vacía, el JS no hace nada: el campo y el botón se
quedan desactivados y el botón dice "Próximamente". Es a propósito, y es
preferible a un formulario que acepta emails sin guardarlos. Por eso también es
el JS —y no el HTML— quien activa los campos: si el JS fallara, el formulario
queda inerte en vez de tragarse correos.

No hace falta SMTP ni clave de API. SMTP sirve para enviar emails automáticos
desde un servidor, que no es el caso. Y una clave de API no se puede usar aquí:
en una web estática quedaría a la vista de cualquiera que mire el código.

### Cosas que conviene saber

- **Está en simple opt-in** ("Sin e-mail de confirmación" en Brevo): el contacto
  entra en la lista al instante y no recibe ningún correo. Si algún día se
  activa el doble opt-in, hay que cambiar el mensaje de éxito de
  `js/newsletter.js`, que ahora mismo no menciona ningún email de confirmación.
- **Brevo responde `{"success":true}` a casi todo**: a un email inválido, a uno
  vacío, a un alta repetida e incluso con la trampa antispam rellena. Su
  respuesta no vale para validar nada, así que toda la validación real se hace
  en el navegador. Lo que sí detecta es una URL caducada o mal pegada, que
  devuelve un 404, y entonces la web muestra el mensaje de error.
- La casilla de consentimiento **no** se envía a Brevo, solo bloquea el envío
  hasta que se marca. Para guardarla como dato del contacto habría que crear un
  atributo en Brevo y añadirlo al formulario.
- Campos que se mandan: `EMAIL`, `locale=es`, `html_type=simple` y
  `email_address_check` (la trampa antispam de Brevo, siempre vacía).
- Los contactos se ven en Brevo → **Contactos**, y desde ahí se exportan o se
  borran.

## Pendiente

- [ ] Copy definitivo de cada sección (todo el texto actual es provisional).
- [ ] Escribir y lanzar la primera newsletter desde Brevo (el formulario ya
      está recogiendo emails).
- [ ] Doble opt-in: hoy no se puede activar porque Brevo exige tener la cuenta
      Transaccional activa y la da a mano tras revisar las cuentas nuevas. Hay
      que pedírselo a su soporte. Cuando esté, se cambia la opción en el
      formulario de Brevo y se revierte el mensaje de éxito de
      `js/newsletter.js` para que vuelva a decir "Revisa tu correo para
      confirmar la suscripción".
- [ ] Buzón propio en el dominio antes de enviar la newsletter en serio. Hoy
      `xpandyourlimits.es` no tiene registros MX y el remitente tendría que ser
      el Gmail de la agencia; Gmail y Yahoo penalizan el correo masivo enviado
      "desde" una dirección @gmail.com a través de otro proveedor, así que
      acabaría en spam. Detalles del DNS en `progress.txt`, entrada 2026-09-17 (5).
- [ ] Colaboradores xpertos: Fran y Paula no tienen todavía un descuento o
      ventaja concreta, aunque la intro de la sección los anuncia.
- [ ] Si me pasas una URL de referencia, ajustamos la estructura/orden de
      secciones a partir de ella.

Ya resuelto (histórico completo en `progress.txt`): DNS migrado a GitHub Pages,
landing antigua de Netlify y su repo eliminados, email de contacto real, las 4
redes sociales enlazadas, Equipo XPAND con 6 atletas reales, Colaboradores con
2 perfiles reales y el formulario de Newsletter conectado a Brevo.
