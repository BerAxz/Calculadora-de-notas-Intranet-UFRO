# Calculadora de Aprobacion UFRO (Extension)

Extension de Chrome que calcula escenarios de aprobacion en la intranet UFRO a partir de las evaluaciones teoricas y practicas. Muestra el promedio actual, las evaluaciones pendientes y, cuando corresponde, las notas necesarias para aprobar.

## Como funciona

1. El contenido de la pagina se analiza para detectar las tablas de "Teorica" y "Practica".
2. Se extraen las evaluaciones y ponderaciones (nota o pendiente).
3. Se calculan escenarios por tipo:
   - Si no quedan evaluaciones: se muestra el promedio final.
   - Si queda 1 evaluacion: se muestra la nota necesaria para alcanzar 4.0.
   - Si quedan 2 evaluaciones: se muestran combinaciones que permiten aprobar.
   - Si quedan 3 o mas: se listan las evaluaciones pendientes.
4. El popup muestra los resultados por seccion.

## Estructura del proyecto

```
.
├── assets/
│   └── icon.png
├── src/
│   ├── calculo.js
│   ├── content.js
│   └── popup/
│       ├── popup.html
│       ├── popup.css
│       └── popup.js
├── manifest.json
└── README.md
```

## Instalacion desde el repositorio

1. Clona el repo:
   ```bash
   git clone <URL_DEL_REPO>
   ```
2. Entra a la carpeta:
   ```bash
   cd Calculadora-de-notas-Intranet-UFRO
   ```

## Instalacion (modo desarrollador)

1. Abre Chrome y entra a `chrome://extensions/`.
2. Activa "Modo de desarrollador" (Developer mode).
3. Haz clic en "Cargar sin empaquetar" (Load unpacked).
4. Selecciona la carpeta raiz del repositorio (donde esta `manifest.json`).
5. Abre la intranet UFRO y entra a la pagina de notas.
6. Haz clic en el icono de la extension para ver la calculadora.

## Archivos principales

- `manifest.json`: configuracion de la extension.
- `src/content.js`: extrae las evaluaciones desde la pagina.
- `src/calculo.js`: calcula escenarios de aprobacion.
- `src/popup/popup.html` y `src/popup/popup.css`: interfaz del popup.
- `src/popup/popup.js`: renderiza los resultados en el popup.

## Notas

- La extension solo considera filas con ponderacion en porcentaje.
- Las combinaciones se calculan con pasos de 0.1.
- El objetivo de aprobacion es 4.0 por defecto.
