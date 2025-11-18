package com.sistemaadopcion.tarea4.controladores;

import com.sistemaadopcion.tarea4.modelos.AvisoAdopcion;
import com.sistemaadopcion.tarea4.servicios.ServicioAvisos;
import com.sistemaadopcion.tarea4.servicios.ServicioEvaluaciones;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
public class ControladorListado {
    
    private final ServicioAvisos servicioAvisos;
    private final ServicioEvaluaciones servicioEvaluaciones;
    
    public ControladorListado(ServicioAvisos servicioAvisos, 
                             ServicioEvaluaciones servicioEvaluaciones) {
        this.servicioAvisos = servicioAvisos;
        this.servicioEvaluaciones = servicioEvaluaciones;
    }
    
    @GetMapping("/")
    public String inicio() {
        return "redirect:/listado";
    }
    
    @GetMapping("/listado")
    public String mostrarListado(Model model) {
        List<AvisoAdopcion> avisos = servicioAvisos.obtenerTodos();
        
        // Calcular los promedios 
        Map<Integer, Double> promedios = new HashMap<>();
        for (AvisoAdopcion aviso : avisos) {
            Double promedio = servicioEvaluaciones.calcularPromedio(aviso.getId());
            promedios.put(aviso.getId(), promedio);
        }
        
        model.addAttribute("avisos", avisos);
        model.addAttribute("promedios", promedios);
        
        return "listado";
    }
}