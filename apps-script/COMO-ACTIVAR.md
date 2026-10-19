# Activar reservas con calendario y factura (una sola vez)

Mientras esto no esté activo, la página funciona igual: cada reserva y cada registro se envían por WhatsApp al +57 321 645 0983.

Hazlo con la cuenta **flyview23@gmail.com**. Desde el iPhone abre Safari, toca **aA → Solicitar sitio web de escritorio** para ver el editor completo.

1. Entra a **script.google.com** → **Nuevo proyecto**. Ponle de nombre *Flyview23 Reservas*.
2. Borra lo que aparece en `Código.gs` y pega **todo** el contenido del archivo `apps-script/Code.gs` de este repositorio. Guarda (ícono del disquete).
3. Arriba, en el menú de funciones, elige **configurar** y toca **Ejecutar**. Google pide permisos: **Revisar permisos → tu cuenta → Avanzado → Ir a Flyview23 Reservas → Permitir**. Esto crea la hoja *Flyview23 · Reservas y comunidad* y la carpeta *Flyview23 · Facturas* en tu Drive.
4. **Implementar → Nueva implementación →** tipo **Aplicación web**.
   - Ejecutar como: **Yo (flyview23@gmail.com)**
   - Quién tiene acceso: **Cualquier usuario**
   Toca **Implementar** y copia la **URL de la aplicación web** (termina en `/exec`).
5. Pásale esa URL a Claude. Va en `js/config.js`, en la línea `FV23_ENDPOINT = '...'`.

Listo: desde ese momento cada reserva crea el evento en tu Google Calendar (en naranja), genera la factura en PDF, se la manda al cliente y a ti, y queda anotada en la hoja.

## Si cambias precios
Los precios viven en `js/precios.js`. Al cambiarlos hay que volver a pegar `apps-script/Code.gs` y en **Implementar → Gestionar implementaciones → editar → Versión: nueva** para que el script use los mismos precios que la página.
