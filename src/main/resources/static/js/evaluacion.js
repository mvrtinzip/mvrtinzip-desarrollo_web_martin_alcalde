let idAvisoActual = null;
let calificacionSeleccionada = null;

function abrirVentanaEvaluacion(idAviso) {
    idAvisoActual = idAviso;
    calificacionSeleccionada = null;
    document.getElementById('idAvisoModal').textContent = idAviso;
    document.getElementById('ventanaModal').style.display = 'block';
    
    // limpia la selección anterior
    document.querySelectorAll('.boton-calificacion').forEach(boton => {
        boton.classList.remove('seleccionado');
    });
}

function cerrarVentana() {
    document.getElementById('ventanaModal').style.display = 'none';
    idAvisoActual = null;
    calificacionSeleccionada = null;
}

function seleccionarCalificacion(valor) {
    calificacionSeleccionada = valor;
    
    // Actualiza la interfaz
    document.querySelectorAll('.boton-calificacion').forEach(boton => {
        boton.classList.remove('seleccionado');
    });
    document.querySelector(`[data-valor="${valor}"]`).classList.add('seleccionado');
}

function enviarEvaluacion() {
    if (!calificacionSeleccionada) {
        mostrarAlerta('Por favor seleccione una calificación', 'error');
        return;
    }

    // crea los datos del formulario
    const datosFormulario = new FormData();
    datosFormulario.append('avisoId', idAvisoActual);
    datosFormulario.append('calificacion', calificacionSeleccionada);

    // Envia petición 
    fetch('/api/evaluaciones/nueva', {
        method: 'POST',
        body: datosFormulario
    })
    .then(respuesta => respuesta.json())
    .then(datos => {
        if (datos.exito) {
            // Actualiza el promedio en la tabla
            const elementoPromedio = document.getElementById(`promedio-${idAvisoActual}`);
            if (datos.promedio) {
                elementoPromedio.textContent = datos.promedio;
                elementoPromedio.className = 'valor-promedio';
            }
            
            mostrarAlerta('¡Evaluación registrada de manera correcta!', 'exito');
            cerrarVentana();
        } else {
            mostrarAlerta(datos.mensaje || 'Error al registrar evaluación', 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        mostrarAlerta('Error al procesar la solicitud', 'error');
    });
}

function mostrarAlerta(texto, tipo) {
    const alertaDiv = document.getElementById('alerta-mensaje');
    alertaDiv.className = tipo === 'exito' ? 'alerta alerta-exito' : 'alerta alerta-error';
    alertaDiv.textContent = texto;
    alertaDiv.style.display = 'block';
    
    setTimeout(() => {
        alertaDiv.style.display = 'none';
    }, 4000);
}

// cerrar el modal al hacer clic fuera
window.onclick = function(evento) {
    const modal = document.getElementById('ventanaModal');
    if (evento.target === modal) {
        cerrarVentana();
    }
}