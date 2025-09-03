
const $ = (sel) => document.querySelector(sel);
const create = (tag, attrs = {}, children = []) => {
  const el = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (k === "class") el.className = v;
    else if (k === "text") el.textContent = v;
    else el.setAttribute(k, v);
  });
  children.forEach(c => el.appendChild(c));
  return el;
};
const isEmpty = (v) => !v || String(v).trim() === "";

/* ===== Regiones / Comunas (desde region_comuna.js) ===== */
function poblarRegiones() {
  const regionSel = $("#region");
  regionSel.innerHTML = '<option value="">Seleccione…</option>';
  // Estructura esperada: region_comuna.regiones = [{ nombre, comunas: [{nombre}, ...] }, ...]
  region_comuna.regiones.forEach(r => {
    regionSel.appendChild(create("option", { value: r.nombre, text: r.nombre }));
  });
}

function actualizarComunas() {
  const comunaSel = $("#comuna");
  comunaSel.innerHTML = '<option value="">Seleccione…</option>';
  const nombreRegion = $("#region").value;
  const region = region_comuna.regiones.find(r => r.nombre === nombreRegion);
  if (region) {
    region.comunas.forEach(c => {
      comunaSel.appendChild(create("option", { value: c.nombre, text: c.nombre }));
    });
    comunaSel.disabled = false;
  } else {
    comunaSel.disabled = true;
  }
}

/* ===== Contactar por (hasta 5) ===== */
const MEDIOS = ["whatsapp", "telegram", "X", "instagram", "tiktok", "otra"];
const MAX_CONTACTOS = 5;

function nuevaFilaContacto() {
  const wrap = create("div", { class: "contacto-item" });

  const sel = create("select");
  sel.appendChild(create("option", { value: "", text: "Seleccione medio…" }));
  MEDIOS.forEach(m => sel.appendChild(create("option", { value: m, text: m })));

  const input = create("input", {
    type: "text",
    placeholder: "ID o URL (4–50)",
    "aria-label": "ID o URL del contacto",
    disabled: true
  });

  const borrar = create("button", { type: "button", class: "boton", text: "Quitar" });

  sel.addEventListener("change", () => {
    input.disabled = sel.value === "";
    if (sel.value === "") input.value = "";
  });

  borrar.addEventListener("click", () => {
    wrap.remove();
    actualizarBotonContacto();
  });

  wrap.appendChild(create("div", { class: "ctrl" }, [sel]));
  wrap.appendChild(create("div", { class: "ctrl" }, [input]));
  wrap.appendChild(borrar);
  return wrap;
}

function actualizarBotonContacto() {
  $("#btn-add-contacto").disabled =
    document.querySelectorAll("#contactos .contacto-item").length >= MAX_CONTACTOS;
}

function agregarContacto() {
  $("#contactos").appendChild(nuevaFilaContacto());
  actualizarBotonContacto();
}

/* ===== Fotos (1 a 5 inputs file, solo imágenes) ===== */
const MAX_FOTOS = 5;

function nuevaEntradaFoto() {
  return create("div", { class: "foto-item" }, [
    create("input", { type: "file", accept: "image/*" })
  ]);
}

function totalFotos() {
  return document.querySelectorAll("#fotos input[type='file']").length;
}

function agregarFoto() {
  if (totalFotos() >= MAX_FOTOS) return;
  $("#fotos").appendChild(nuevaEntradaFoto());
  $("#btn-add-foto").disabled = totalFotos() >= MAX_FOTOS;
}

/* ===== Prefill fecha (ahora + 3 horas) ===== */
function prefillFecha() {
  const input = $("#fecha-entrega");
  const now = new Date();
  // evitar desplazamiento por zona horaria en datetime-local
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  const plus3 = new Date(now.getTime() + 3 * 60 * 60 * 1000);
  const yyyy = plus3.getFullYear();
  const mm = String(plus3.getMonth() + 1).padStart(2, "0");
  const dd = String(plus3.getDate()).padStart(2, "0");
  const hh = String(plus3.getHours()).padStart(2, "0");
  const mi = String(plus3.getMinutes()).padStart(2, "0");
  input.value = `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
  input.dataset.min = input.value; // para validación JS posterior
}

/* ===== Validaciones ===== */
function valRegionComuna() {
  const r = $("#region").value;
  const c = $("#comuna").value;
  let ok = true, err = [];
  if (isEmpty(r)) { ok = false; err.push("Región es obligatoria."); }
  if (isEmpty(c)) { ok = false; err.push("Comuna es obligatoria."); }
  return [ok, err];
}

function valSector() {
  const v = $("#sector").value.trim();
  return v.length > 100 ? [false, ["Sector: máximo 100 caracteres."]] : [true, []];
}

function valContactoBasico() {
  const nombre = $("#nombre").value.trim();
  const email = $("#email").value.trim();
  const tel = $("#telefono").value.trim();

  let ok = true, err = [];

  if (nombre.length < 3 || nombre.length > 200) {
    ok = false; err.push("Nombre: entre 3 y 200 caracteres.");
  }

  const reEmail = /^[\w.+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  if (!reEmail.test(email) || email.length > 100) {
    ok = false; err.push("Email: formato válido y largo ≤ 100.");
  }

  // Teléfono OBLIGATORIO: +NNN.NNNNNNNN  (ej: +569.12345678)
  const reTel = /^\+\d{3}\.\d{8}$/;
  if (tel === "") {
    ok = false; err.push("Teléfono: es obligatorio.");
  } else if (!reTel.test(tel)) {
    ok = false; err.push("Teléfono: formato +NNN.NNNNNNNN, ej: +569.12345678.");
  }

  return [ok, err];
}

function valContactosExtra() {
  const items = document.querySelectorAll("#contactos .contacto-item");
  let ok = true, err = [];
  if (items.length > MAX_CONTACTOS) {
    ok = false; err.push("Contactar por: máximo 5 medios.");
  }
  items.forEach((it, i) => {
    const sel = it.querySelector("select");
    const inp = it.querySelector("input[type='text']");
    const medio = sel.value;
    const val = (inp.value || "").trim();
    if (!isEmpty(medio)) {
      if (val.length < 4 || val.length > 50) {
        ok = false; err.push(`Contacto #${i + 1}: ID/URL entre 4 y 50 caracteres.`);
      }
    } else if (!isEmpty(val)) {
      ok = false; err.push(`Contacto #${i + 1}: seleccione medio para ese ID/URL.`);
    }
  });
  return [ok, err];
}

function valMascota() {
  const tipo = $("#tipo").value;
  const cantidad = Number($("#cantidad").value);
  const edad = Number($("#edad").value);
  const unidad = $("#unidad-edad").value;

  let ok = true, err = [];
  if (isEmpty(tipo)) { ok = false; err.push("Tipo es obligatorio."); }
  if (!Number.isInteger(cantidad) || cantidad < 1) { ok = false; err.push("Cantidad: entero mínimo 1."); }
  if (!Number.isInteger(edad) || edad < 1) { ok = false; err.push("Edad: entero mínimo 1."); }
  if (isEmpty(unidad)) { ok = false; err.push("Unidad de edad es obligatoria."); }
  return [ok, err];
}

function valFechaEntrega() {
  const v = $("#fecha-entrega").value;
  if (isEmpty(v)) return [false, ["Fecha disponible para entrega es obligatoria."]];
  const min = $("#fecha-entrega").dataset.min;
  return (min && v < min) ? [false, ["Fecha debe ser ≥ a la prellenada (hoy + 3 h)."]] : [true, []];
}

function valFotos() {
  const files = document.querySelectorAll("#fotos input[type='file']");
  let count = 0, ok = true, err = [];
  files.forEach((f, i) => {
    if (f.files && f.files.length > 0) {
      count++;
      const file = f.files[0];
      if (!file.type.startsWith("image/")) {
        ok = false; err.push(`Foto #${i + 1}: solo imágenes.`);
      }
    }
  });
  if (count < 1) { ok = false; err.push("Debes adjuntar al menos 1 foto."); }
  if (files.length > MAX_FOTOS) { ok = false; err.push("Máximo 5 fotos."); }
  return [ok, err];
}

/* ===== Mostrar/Ocultar resultados ===== */
function mostrarErrores(lista) {
  const box = $("#errores");
  const ul = $("#lista-errores");
  ul.innerHTML = "";
  lista.forEach(msg => ul.appendChild(create("li", { text: msg })));
  box.style.display = "block";
  box.scrollIntoView({ behavior: "smooth", block: "start" });
}
function ocultarErrores() {
  $("#errores").style.display = "none";
  $("#lista-errores").innerHTML = "";
}
function mostrarOK() {
  $("#form-aviso").style.display = "none";
  $("#resultado").style.display = "block";
  $("#resultado").scrollIntoView({ behavior: "smooth", block: "start" });
}

/* ===== Init ===== */
document.addEventListener("DOMContentLoaded", () => {
  // Regiones/Comunas
  poblarRegiones();
  $("#region").addEventListener("change", actualizarComunas);

  // Contactos
  agregarContacto(); // parte con 1 fila
  $("#btn-add-contacto").addEventListener("click", agregarContacto);

  // Fotos
  agregarFoto(); // parte con 1 input
  $("#btn-add-foto").addEventListener("click", agregarFoto);

  // Fecha
  prefillFecha();

  // Envío/validación
  $("#btn-enviar").addEventListener("click", () => {
    ocultarErrores();
    let errores = [];
    [ valRegionComuna(), valSector(), valContactoBasico(), valContactosExtra(),
      valMascota(), valFechaEntrega(), valFotos()
    ].forEach(([ok, err]) => { if (!ok) errores = errores.concat(err); });

    if (errores.length > 0) {
      mostrarErrores(errores);
      return;
    }

    const seguro = window.confirm("¿Está seguro que desea agregar este aviso de adopción?");
    if (seguro) mostrarOK();
    // Si elige "No", simplemente se mantiene el formulario visible.
  });
});
