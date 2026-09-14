# NOCTURNE — Experiencia Digital de Alta Joyería

Proyecto frontend (HTML + CSS + JS) construido como experiencia cinematográfica de lujo para una joyería. Sin frameworks ni build step: se abre directamente en un navegador o se sirve con WAMP/Apache.

## Estructura

```
/joyeria
  index.html
  /css
    style.css        → paleta, tipografía, layout, componentes
    animations.css    → keyframes, estados de reveal, reduced-motion
    responsive.css     → breakpoints tablet/mobile
  /js
    main.js           → Lenis, intro cinemática, estado de nav en scroll
    products.js        → datos de producto, galería editorial, quick-view, carrito visual
    navigation.js       → menú móvil fullscreen, buscador, panel de filtros
    interactions.js      → cursor personalizado, parallax de mouse, botones magnéticos
    gallery.js           → lightbox del lookbook
    animations.js        → GSAP ScrollTrigger: reveals, split-text, parallax, storytelling
  /assets
    /images, /icons, /fonts   → vacíos, listos para fotografía real de producto
  README.md
```

## Cómo verlo

Con WAMP: coloca el proyecto en `www/joyeria` (ya está ahí) y abre `http://localhost/joyeria/`.
Sin servidor: abre `index.html` directamente en el navegador (todas las librerías se cargan por CDN).

## Librerías usadas (CDN, sin build step)

- **GSAP + ScrollTrigger** — animaciones y storytelling por scroll.
- **Lenis** — scroll suave.
- Google Fonts: **Cormorant Garamond** (display/serif) + **Jost** (UI/sans).

No se usa Three.js: el objeto "joya" del Hero es una ilustración SVG original animada con CSS/GSAP y parallax de mouse (CSS 3D), siguiendo el criterio de "prioridad al resultado que funciona" cuando no hay modelo 3D real.

## Contenido pendiente — buscar `[AGREGAR ...]`

Todo el contenido real (precios, dirección, teléfono, historia de marca, reseñas, materiales exactos, políticas de envío/devolución) está marcado con placeholders `[AGREGAR ...]` en `index.html`. Reemplázalos antes de publicar. **No se inventó ningún dato de negocio.**

## Fotografía — importante

Las imágenes actuales son **fotografía de stock con licencia libre (Unsplash)**, usadas solo como marcador de posición de composición/color. No se usó ninguna fotografía de joyerías, empleados o clientes reales de terceros (derechos de autor + privacidad). Cada imagen tiene:
- un `alt` que empieza con `[REEMPLAZAR: ...]`,
- un `onerror` que muestra una etiqueta `[AGREGAR FOTOGRAFÍA...]` si la imagen no carga,

de modo que sea fácil ubicar y sustituir cada foto por fotografía real de producto/lookbook.

## E-commerce

El carrito (`products.js`) es solo visual (contador + toast), sin pagos ni inventario reales — listo para integrar una pasarela de pago y backend de inventario cuando el proyecto lo requiera. No se implementaron pagos falsos, según lo solicitado.

## Accesibilidad y rendimiento

- `prefers-reduced-motion` desactiva intro, cursor, parallax y la mayoría de transiciones.
- Cursor personalizado y parallax de mouse se desactivan en touch (`hover:none`).
- Imágenes con `loading="lazy"`, `alt` descriptivo, `aria-*` en overlays/menús, `inert` en paneles cerrados, foco visible.
- Sin imágenes propias que optimizar todavía; al añadir fotografía real, usa WebP/AVIF con `srcset` y comprime antes de subir.
