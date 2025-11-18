package com.sistemaadopcion.tarea4.controladores;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.sistemaadopcion.tarea4.modelos.Evaluacion;
import com.sistemaadopcion.tarea4.servicios.ServicioEvaluaciones;

@RestController
@RequestMapping("/api/evaluaciones")
public class ControladorAPI {
    
    private final ServicioEvaluaciones servicioEvaluaciones;
    
    public ControladorAPI(ServicioEvaluaciones servicioEvaluaciones) {
        this.servicioEvaluaciones = servicioEvaluaciones;
    }
    
    @PostMapping("/nueva")
    public ResponseEntity<Map<String, Object>> crearEvaluacion(
            @RequestParam("avisoId") Integer avisoId,
            @RequestParam("calificacion") Integer calificacion) {
        
        Map<String, Object> respuesta = new HashMap<>();
        
        try {
            // validar la calificación
            if (calificacion == null || calificacion < 1 || calificacion > 7) {
                respuesta.put("exito", false);
                respuesta.put("mensaje", "La calificación debe ser entre 1 y 7");
                return ResponseEntity.badRequest().body(respuesta);
            }
            
            // Crear la evaluación
            Evaluacion evaluacion = servicioEvaluaciones.crearEvaluacion(avisoId, calificacion);
            
            // obtener un nuevo promedio
            Double promedioActualizado = servicioEvaluaciones.calcularPromedio(avisoId);
            Long totalEvaluaciones = servicioEvaluaciones.contarEvaluaciones(avisoId);
            
            respuesta.put("exito", true);
            respuesta.put("mensaje", "¡Evaluación registrada de manera correcta!");
            respuesta.put("evaluacionId", evaluacion.getId());
            respuesta.put("promedio", promedioActualizado);
            respuesta.put("totalEvaluaciones", totalEvaluaciones);
            
            return ResponseEntity.ok(respuesta);
            
        } catch (IllegalArgumentException e) {
            respuesta.put("exito", false);
            respuesta.put("mensaje", e.getMessage());
            return ResponseEntity.badRequest().body(respuesta);
            
        } catch (Exception e) {
            respuesta.put("exito", false);
            respuesta.put("mensaje", "Error al procesar: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(respuesta);
        }
    }
    
    @GetMapping("/promedio/{avisoId}")
    public ResponseEntity<Map<String, Object>> consultarPromedio(@PathVariable Integer avisoId) {
        Map<String, Object> respuesta = new HashMap<>();
        
        Double promedio = servicioEvaluaciones.calcularPromedio(avisoId);
        Long total = servicioEvaluaciones.contarEvaluaciones(avisoId);
        
        respuesta.put("avisoId", avisoId);
        respuesta.put("promedio", promedio);
        respuesta.put("totalEvaluaciones", total);
        
        return ResponseEntity.ok(respuesta);
    }
}