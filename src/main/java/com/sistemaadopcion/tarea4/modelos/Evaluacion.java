package com.sistemaadopcion.tarea4.modelos;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "nota")
public class Evaluacion {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(name = "aviso_id", nullable = false)
    private Integer avisoId;
    
    @Column(nullable = false)
    private Integer nota;
    
    @ManyToOne
    @JoinColumn(name = "aviso_id", insertable = false, updatable = false)
    private AvisoAdopcion aviso;

    public Evaluacion() {
    }

    // constructor con todos los parametros
    public Evaluacion(Integer id, Integer avisoId, Integer nota, AvisoAdopcion aviso) {
        this.id = id;
        this.avisoId = avisoId;
        this.nota = nota;
        this.aviso = aviso;
    }

    // Getters y Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getAvisoId() {
        return avisoId;
    }

    public void setAvisoId(Integer avisoId) {
        this.avisoId = avisoId;
    }

    public Integer getNota() {
        return nota;
    }

    public void setNota(Integer nota) {
        this.nota = nota;
    }

    public AvisoAdopcion getAviso() {
        return aviso;
    }

    public void setAviso(AvisoAdopcion aviso) {
        this.aviso = aviso;
    }

    @Override
    public String toString() {
        return "Evaluacion{" +
                "id=" + id +
                ", avisoId=" + avisoId +
                ", nota=" + nota +
                '}';
    }
}