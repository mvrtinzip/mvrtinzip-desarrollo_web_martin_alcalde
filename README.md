# Tarea 1 — Aplicaciones Web

## Detalles importantes

- Desarrollé el proyecto en **HTML5, CSS3 y JavaScript**.  

- NO utiliza servidor web ni almacenamiento de datos. 

- Todas las validaciones del formulario las implementé en JavaScript (`app.js`).   

- Organicé el proyecto en 5 diferentes páginas:  
  - `index.html`: Portada con los últimos 5 avisos.  
  - `agregar.html`: Formulario para ingresar un aviso con validaciones.  
  - `listado.html`: Tabla completa con más información de los avisos.  
  - `aviso.html`: Detalle de un aviso seleccionado desde el listado.  
  - `estadisticas.html`: Gráficos estáticos de avisos.  

- Los gráficos de estadísticas fueron generados con Python/Matplotlib, y exportados como imágenes.

- Centralicé el diseño en un único archivo `styles.css` para mantener consistencia entre todas las páginas. 


## Consideraciones para la corrección
- El archivo `region_comuna.js` debe estar presente para que funcionen los selects de Región/Comuna.

- Las imágenes dentro de la carpeta `img/` deben existir para que aparezcan correctamente en la portada, detalle y estadísticas.

- Probé el proyecto en distintos navegadores (Chrome, Firefox, Edge) y en distintas resoluciones de pantalla.  

- Decidí que el **teléfono fuese obligatorio** porque considero que es más fácil contactar a una persona de esta manera, igualmente mantuve el formato `+NNN.NNNNNNNN` 

