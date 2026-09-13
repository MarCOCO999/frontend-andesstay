# Fotografía real de las unidades

Hoy `catalog.component.html` usa ilustraciones SVG como placeholder (buscar los
comentarios `TODO: reemplazar por fotografia real`) para no depender de imágenes
externas que no se pueden verificar desde el código.

Para poner fotos reales de las cabañas/habitaciones/lodges de la red:

1. Copia las fotos aquí, por ejemplo `cabana-01.jpg`, `habitacion-01.jpg`.
2. En `catalog.component.html`, reemplaza el bloque `<svg>...</svg>` correspondiente por:
   ```html
   <img src="/images/cabana-01.jpg" alt="Cabaña {{ u.code }}" />
   ```
3. Si cada unidad tiene su propia foto, lo más prolijo es agregar un campo `photoUrl`
   al modelo `CatalogUnit` (y a la respuesta del backend) en vez de un nombre fijo.
