// Filtro de comunas por región 
document.addEventListener("DOMContentLoaded", () => {
  const regionSelect = document.getElementById("region_id");
  const comunaSelect = document.getElementById("comuna_id");

  if (regionSelect && comunaSelect) {
    regionSelect.addEventListener("change", () => {
      const regionId = regionSelect.value;

      Array.from(comunaSelect.options).forEach(opt => {
        if (opt.value === "") {
          opt.hidden = false;
          opt.selected = true;
        } else {
          opt.hidden = opt.dataset.regionId !== regionId;
        }
      });
    });
  }

// Activar validación al hacer clic en enviar
  const btn = document.getElementById("btn-enviar");
  if (btn) {
    btn.addEventListener("click", () => {
      const errores = validarFormulario();
      if (errores.length > 0) {
        mostrarErrores(errores);
      } else {
        mostrarConfirmacion();
      }
    });
  }
});

// Funciones de validación

function mostrarErrores(errores) {
  const div = document.getElementById("errores");
  const lista = document.getElementById("lista-errores");
  lista.innerHTML = "";
  errores.forEach(err => {
    const li = document.createElement("li");
    li.textContent = err;
    lista.appendChild(li);
  });
  div.style.display = "block";
  div.scrollIntoView({ behavior: "smooth", block: "center" });
}

function validarFormulario() {
  const errores = [];

  const region = document.getElementById("region_id").value;
  const comuna = document.getElementById("comuna_id").value;
  const nombre = document.getElementById("nombre").value.trim();
  const email = document.getElementById("email").value.trim();
  const numero = document.getElementById("numero").value.trim();
  const tipo = document.getElementById("tipo").value;
  const cantidad = document.getElementById("cantidad").value;
  const edad = document.getElementById("edad").value;
  const unidad = document.getElementById("unidad").value;
  const fecha = document.getElementById("fecha").value;
  const fotoInputs = document.querySelectorAll('.foto-input');

  if (!region) errores.push("La región es obligatoria.");
  if (!comuna) errores.push("La comuna es obligatoria.");

  if (nombre.length < 3 || nombre.length > 200) {
    errores.push("Nombre: entre 3 y 200 caracteres.");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email) || email.length > 100) {
    errores.push("Email: formato válido y largo ≤ 100.");
  }

  const telRegex = /^\+\d{3}\.\d{8}$/;
  if (!telRegex.test(numero)) {
    errores.push("Número celular: debe tener formato +NNN.NNNNNNNN (ej: +569.12345678).");
  }

  // Validar contacto único 
  const tipoContacto = document.getElementById("contacto-tipo").value;
  const idContacto = document.getElementById("contacto-id").value.trim();

  if (tipoContacto && !idContacto) {
    errores.push("Si seleccionas un medio de contacto, debes ingresar el ID o URL.");
  } else if (tipoContacto && (idContacto.length < 4 || idContacto.length > 50)) {
    errores.push("El ID o URL del contacto debe tener entre 4 y 50 caracteres.");
  }

  if (!tipo) errores.push("Tipo es obligatorio.");
  if (!cantidad || cantidad < 1) errores.push("Cantidad: debe ser ≥ 1.");
  if (!edad || edad < 1) errores.push("Edad: debe ser ≥ 1.");
  if (!unidad) errores.push("Unidad de edad es obligatoria.");

  if (!fecha) {
    errores.push("La fecha de entrega es obligatoria.");
  } else {
    const fechaEntrega = new Date(fecha);
    const ahora = new Date();
    if (fechaEntrega < ahora) {
      errores.push("La fecha debe ser posterior a la actual.");
    }
  }

  // Validar fotos 
  let fotosConArchivo = 0;
  fotoInputs.forEach(input => {
    if (input.files.length > 0) {
      fotosConArchivo++;
    }
  });

  if (fotosConArchivo === 0) {
    errores.push("Debes subir al menos una foto.");
  } else if (fotosConArchivo > 5) {
    errores.push("Máximo 5 fotos permitidas.");
  }

  return errores;
}

// Modal de confirmación personalizado
function mostrarConfirmacion() {
  // Crear overlay 
  const overlay = document.createElement("div");
  overlay.id = "modal-overlay";
  overlay.className = "modal-confirmacion-overlay";

  // Crear modal
  const modal = document.createElement("div");
  modal.className = "modal-confirmacion";

  modal.innerHTML = `
    <h2 class="modal-titulo">Confirmación</h2>
    <p class="modal-mensaje">
      ¿Está seguro que desea agregar este aviso de adopción?
    </p>
    <div class="modal-botones">
      <button id="btn-confirmar-si" class="modal-btn modal-btn-si">Sí, estoy seguro</button>
      <button id="btn-confirmar-no" class="modal-btn modal-btn-no">No, quiero volver al formulario</button>
    </div>
  `;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  // Botón de SÍ: enviar formulario
  document.getElementById("btn-confirmar-si").addEventListener("click", () => {
    document.body.removeChild(overlay);
    document.getElementById("form-aviso").submit();
  });

  // Botón de NO: cerrar modal
  document.getElementById("btn-confirmar-no").addEventListener("click", () => {
    document.body.removeChild(overlay);
  });

  // Cerrar al hacer clic fuera del modal
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      document.body.removeChild(overlay);
    }
  });
}