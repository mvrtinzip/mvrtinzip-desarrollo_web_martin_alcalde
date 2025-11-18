package com.sistemaadopcion.tarea4.repositorio;

import com.sistemaadopcion.tarea4.modelos.Evaluacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RepositorioEvaluaciones extends JpaRepository<Evaluacion, Integer> {
    
    List<Evaluacion> findByAvisoId(Integer avisoId);
    
    @Query("SELECT AVG(e.nota) FROM Evaluacion e WHERE e.avisoId = :avisoId")
    Double calcularPromedioDeAviso(@Param("avisoId") Integer avisoId);
    
    @Query("SELECT COUNT(e) FROM Evaluacion e WHERE e.avisoId = :avisoId")
    Long contarPorAvisoId(@Param("avisoId") Integer avisoId);
}