package com.sistemaadopcion.tarea4.repositorio;

import com.sistemaadopcion.tarea4.modelos.AvisoAdopcion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RepositorioAvisos extends JpaRepository<AvisoAdopcion, Integer> {
}