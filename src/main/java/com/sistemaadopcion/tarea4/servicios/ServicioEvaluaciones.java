package com.sistemaadopcion.tarea4.servicios;

import org.springframework.stereotype.Service;
import com.sistemaadopcion.tarea4.modelos.Evaluacion;
import com.sistemaadopcion.tarea4.repositorio.RepositorioEvaluaciones;

@Service
public class ServicioEvaluaciones {
    
    private final RepositorioEvaluaciones repositorioEvaluaciones;
    
    public ServicioEvaluaciones(RepositorioEvaluaciones repositorioEvaluaciones) {
        this.repositorioEvaluaciones = repositorioEvaluaciones;
    }
    
    public Evaluacion crearEvaluacion(Integer avisoId, Integer calificacion) {
        if (calificacion < 1 || calificacion > 7) {
            throw new IllegalArgumentException("La calificación debe estar entre 1 y 7");
        }
        Evaluacion evaluacion = new Evaluacion();
        evaluacion.setAvisoId(avisoId);
        evaluacion.setNota(calificacion);
        
        return repositorioEvaluaciones.save(evaluacion);
    }
    
    public Double calcularPromedio(Integer avisoId) {
        Double promedio = repositorioEvaluaciones.calcularPromedioDeAviso(avisoId);
        return promedio != null ? Math.round(promedio * 10.0) / 10.0 : null;
    }
    
    public Long contarEvaluaciones(Integer avisoId) {
        return repositorioEvaluaciones.contarPorAvisoId(avisoId);
    }
}