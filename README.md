# XPAND — web de la agencia

Web pública de XPAND, agencia de marketing deportivo. HTML/CSS/JS plano, sin
build ni dependencias — a propósito, para mantenerla simple y fácil de editar.

## Estructura

```
index.html        una sola página con secciones ancladas (Servicios, Casos de
                   éxito, Sobre nosotros, Newsletter, Contacto)
css/style.css      estilos y tokens de marca
js/main.js         menú móvil
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

El dominio ya está comprado en DonDominio y su DNS apunta hoy a la landing
antigua en Netlify (que se está retirando). Para apuntarlo a GitHub Pages,
en el panel de DNS de DonDominio:

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

## Pendiente

- [ ] Copy definitivo de cada sección (todo el texto actual es provisional).
- [ ] Casos de éxito reales: fotos y resultados aprobados por los atletas
      (de momento hay tres tarjetas de marcador de posición sin fotos).
- [ ] Conectar el formulario de Newsletter a un proveedor (Web3Forms,
      Mailchimp, Brevo...) — de momento está desactivado a propósito para no
      fingir que funciona.
- [ ] Confirmar el email de contacto real (ahora mismo es un placeholder:
      `hola@xpandyourlimits.es`).
- [ ] Enlace real a Instagram en Contacto y en el pie.
- [ ] Si me pasas una URL de referencia, ajustamos la estructura/orden de
      secciones a partir de ella.
- [ ] Retirar la landing antigua: borrar el sitio en Netlify y (si se
      confirma) el repo `xylagenciamarketingdeportivo-prog/xylagenciamarketingdeportivo`.
