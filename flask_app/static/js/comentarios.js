// comentarios.js - Sistema de comentarios con fetch

document.addEventListener("DOMContentLoaded", () => {
  const avisoId = document.getElementById("aviso-id")?.value;
  
  if (!avisoId) {
    console.error("No se encontró el ID del aviso");
    return;
  }

  // Cargar comentarios al iniciar
  cargarComentarios(avisoId);

  // Manejar envío del formulario
  const btnAgregarComentario = document.getElementById("btn-agregar-comentario");
  if (btnAgregarComentario) {
    btnAgregarComentario.addEventListener("click", (e) => {
      e.preventDefault();
      agregarComentario(avisoId);
    });
  }
});

/**
 * Cargar comentarios desde el servidor
 */
function cargarComentarios(avisoId) {
  fetch(`/api/comentarios/${avisoId}`)
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        mostrarComentarios(data.comentarios);
      } else {
        console.error("Error al cargar comentarios:", data.error);
      }
    })
    .catch(error => {
      console.error("Error en la petición:", error);
    });
}

/**
 * Agregar un nuevo comentario
 */
function agregarComentario(avisoId) {
  const nombre = document.getElementById("comentario-nombre").value.trim();
  const texto = document.getElementById("comentario-texto").value.trim();
  
  // Limpiar mensajes previos
  limpiarMensajes();

  // Validaciones cliente
  const errores = validarComentario(nombre, texto);
  if (errores.length > 0) {
    mostrarErroresComentario(errores);
    return;
  }

  // Deshabilitar botón mientras se procesa
  const btn = document.getElementById("btn-agregar-comentario");
  btn.disabled = true;
  btn.textContent = "Enviando...";

  // Enviar al servidor
  fetch(`/api/comentarios/${avisoId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ nombre, texto })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      // Limpiar formulario
      document.getElementById("comentario-nombre").value = "";
      document.getElementById("comentario-texto").value = "";
      
      // Mostrar mensaje de éxito
      mostrarMensajeExito("¡Comentario agregado exitosamente!");
      
      // Actualizar lista de comentarios
      mostrarComentarios(data.comentarios);
    } else {
      // Mostrar errores del servidor
      mostrarErroresComentario(data.errores || ["Error al agregar comentario"]);
    }
  })
  .catch(error => {
    console.error("Error:", error);
    mostrarErroresComentario(["Error de conexión. Intenta nuevamente."]);
  })
  .finally(() => {
    // Rehabilitar botón
    btn.disabled = false;
    btn.textContent = "Agregar comentario";
  });
}

/**
 * Validar datos del comentario (cliente)
 */
function validarComentario(nombre, texto) {
  const errores = [];

  if (!nombre || nombre.length < 3 || nombre.length > 80) {
    errores.push("El nombre debe tener entre 3 y 80 caracteres");
  }

  if (!texto || texto.length < 5 || texto.length > 300) {
    errores.push("El comentario debe tener entre 5 y 300 caracteres");
  }

  return errores;
}

/**
 * Mostrar lista de comentarios
 */
function mostrarComentarios(comentarios) {
  const contenedor = document.getElementById("lista-comentarios");
  
  if (!contenedor) return;

  if (comentarios.length === 0) {
    contenedor.innerHTML = '<p class="sin-comentarios">No hay comentarios todavía. ¡Sé el primero en comentar!</p>';
    return;
  }

  let html = '';
  comentarios.forEach(comentario => {
    html += `
      <div class="comentario-item">
        <div class="comentario-header">
          <strong class="comentario-nombre">${escapeHtml(comentario.nombre)}</strong>
          <span class="comentario-fecha">${comentario.fecha}</span>
        </div>
        <p class="comentario-texto">${escapeHtml(comentario.texto)}</p>
      </div>
    `;
  });

  contenedor.innerHTML = html;
}

/**
 * Mostrar errores de validación
 */
function mostrarErroresComentario(errores) {
  const contenedor = document.getElementById("comentario-errores");
  if (!contenedor) return;

  let html = '<ul>';
  errores.forEach(error => {
    html += `<li>${escapeHtml(error)}</li>`;
  });
  html += '</ul>';

  contenedor.innerHTML = html;
  contenedor.style.display = "block";
  contenedor.scrollIntoView({ behavior: "smooth", block: "center" });
}

/**
 * Mostrar mensaje de éxito
 */
function mostrarMensajeExito(mensaje) {
  const contenedor = document.getElementById("comentario-exito");
  if (!contenedor) return;

  contenedor.textContent = mensaje;
  contenedor.style.display = "block";

  // Ocultar después de 3 segundos
  setTimeout(() => {
    contenedor.style.display = "none";
  }, 3000);
}

/**
 * Limpiar mensajes de error y éxito
 */
function limpiarMensajes() {
  const errores = document.getElementById("comentario-errores");
  const exito = document.getElementById("comentario-exito");
  
  if (errores) {
    errores.style.display = "none";
    errores.innerHTML = "";
  }
  
  if (exito) {
    exito.style.display = "none";
    exito.textContent = "";
  }
}

/**
 * Escapar HTML para prevenir XSS
 */
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}