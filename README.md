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

Los emails del formulario de Newsletter se guardan en una lista de contactos de
[Brevo](https://app.brevo.com). El formulario ya está montado (validación,
casilla de consentimiento, trampa antispam y mensajes de éxito/error), pero
**solo se activa cuando hay una URL de Brevo configurada**: mientras
`BREVO_ENDPOINT` esté vacía en `js/newsletter.js`, el campo y el botón se quedan
desactivados y el botón sigue diciendo "Próximamente". Es a propósito: es
preferible eso a un formulario que se traga los emails sin guardarlos.

### Activarlo

1. En Brevo, **Contactos → Listas → Crear una lista** (p. ej. `Newsletter web`).
2. **Marketing → Formularios de suscripción → Crear un formulario**. Elige la
   lista del paso 1. El diseño del formulario de Brevo da igual: la web usa el
   suyo propio, de Brevo solo se aprovecha la URL a la que se envían los datos.
3. Al terminar, Brevo da un código para incrustar. Copia la URL del
   `action="..."`, que tiene esta forma:
   `https://sibforms.com/serve/MUIFAKExxxxxxxxxxxxxxxxxx`.
4. Pégala en `js/newsletter.js`, en la primera línea de código:
   ```js
   const BREVO_ENDPOINT = 'https://sibforms.com/serve/MUIFAKExxxxxxxxxxxxxxxxxx';
   ```
5. `git push` a `main`. En 1-2 minutos el formulario está recogiendo emails.

No hace falta SMTP ni clave de API: la web no envía nada, solo da de alta el
contacto. La clave de API además no se puede usar aquí, porque en una web
estática quedaría a la vista de cualquiera.

### Detalles que conviene saber

- **Doble opt-in**: si lo activas en Brevo (recomendado), cada persona recibe un
  email de confirmación y no entra en la lista hasta que hace clic. Es un email
  automático de Brevo, no la newsletter: sigues sin enviar nada tú.
- La web manda el POST "a ciegas" (`mode: 'no-cors'`), porque el navegador no
  deja leer la respuesta de otro dominio. Si la petición sale, se da el alta por
  buena. El comprobante de verdad es el email de confirmación y la lista de
  contactos de Brevo.
- La casilla de consentimiento **no** se envía a Brevo, solo bloquea el envío
  hasta que se marca. Si algún día hace falta guardar ese consentimiento como
  dato del contacto, hay que crear un atributo en Brevo y añadirlo al formulario.
- Campos que se mandan: `EMAIL`, `locale=es` y `email_address_check` (la trampa
  antispam de Brevo, que va siempre vacía).

## Pendiente

- [ ] Copy definitivo de cada sección (todo el texto actual es provisional).
- [ ] Pegar la URL del formulario de Brevo en `js/newsletter.js` para que la
      Newsletter empiece a recoger emails (pasos arriba, en "Newsletter").
- [ ] Colaboradores xpertos: Fran y Paula no tienen todavía un descuento o
      ventaja concreta, aunque la intro de la sección los anuncia.
- [ ] Si me pasas una URL de referencia, ajustamos la estructura/orden de
      secciones a partir de ella.

Ya resuelto (histórico completo en `progress.txt`): DNS migrado a GitHub Pages,
landing antigua de Netlify y su repo eliminados, email de contacto real, las 4
redes sociales enlazadas, Equipo XPAND con 6 atletas reales y Colaboradores con
2 perfiles reales.
