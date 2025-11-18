package com.sistemaadopcion.tarea4.servicios;

import com.sistemaadopcion.tarea4.modelos.AvisoAdopcion;
import com.sistemaadopcion.tarea4.repositorio.RepositorioAvisos;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ServicioAvisos {
    
    private final RepositorioAvisos repositorioAvisos;
    
    public ServicioAvisos(RepositorioAvisos repositorioAvisos) {
        this.repositorioAvisos = repositorioAvisos;
    }
    public List<AvisoAdopcion> obtenerTodos() {
        return repositorioAvisos.findAll();
    }
    public AvisoAdopcion buscarPorId(Integer id) {
        return repositorioAvisos.findById(id).orElse(null);
    }
}