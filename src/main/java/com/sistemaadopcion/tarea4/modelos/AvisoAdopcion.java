package com.sistemaadopcion.tarea4.modelos;

import java.time.LocalDateTime;
import java.util.List;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "aviso_adopcion")
public class AvisoAdopcion {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(name = "fecha_ingreso", nullable = false)
    private LocalDateTime fechaIngreso;
    
    @Column(name = "comuna_id", nullable = false)
    private Integer comunaId;
    
    @Column(length = 100)
    private String sector;
    
    @Column(nullable = false, length = 200)
    private String nombre;
    
    @Column(nullable = false, length = 100)
    private String email;
    
    @Column(length = 15)
    private String celular;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoMascota tipo;
    
    @Column(nullable = false)
    private Integer cantidad;
    
    @Column(nullable = false)
    private Integer edad;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "unidad_medida", nullable = false, length = 1)
    private UnidadMedida unidadMedida;
    
    @Column(name = "fecha_entrega", nullable = false)
    private LocalDateTime fechaEntrega;
    
    @Column(length = 500)
    private String descripcion;
    
    @ManyToOne
    @JoinColumn(name = "comuna_id", insertable = false, updatable = false)
    private Comuna comuna;
    
    @OneToMany(mappedBy = "aviso")
    private List<Evaluacion> evaluaciones;
    
    public enum TipoMascota {
        gato, perro
    }
    
    public enum UnidadMedida {
        a, m
    }

    public AvisoAdopcion() {
    }

    // constructor con todos los parametros
    public AvisoAdopcion(Integer id, LocalDateTime fechaIngreso, Integer comunaId, String sector,
                        String nombre, String email, String celular, TipoMascota tipo, Integer cantidad,
                        Integer edad, UnidadMedida unidadMedida, LocalDateTime fechaEntrega,
                        String descripcion, Comuna comuna, List<Evaluacion> evaluaciones) {
        this.id = id;
        this.fechaIngreso = fechaIngreso;
        this.comunaId = comunaId;
        this.sector = sector;
        this.nombre = nombre;
        this.email = email;
        this.celular = celular;
        this.tipo = tipo;
        this.cantidad = cantidad;
        this.edad = edad;
        this.unidadMedida = unidadMedida;
        this.fechaEntrega = fechaEntrega;
        this.descripcion = descripcion;
        this.comuna = comuna;
        this.evaluaciones = evaluaciones;
    }

    // Getters y Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public LocalDateTime getFechaIngreso() {
        return fechaIngreso;
    }

    public void setFechaIngreso(LocalDateTime fechaIngreso) {
        this.fechaIngreso = fechaIngreso;
    }

    public Integer getComunaId() {
        return comunaId;
    }

    public void setComunaId(Integer comunaId) {
        this.comunaId = comunaId;
    }

    public String getSector() {
        return sector;
    }

    public void setSector(String sector) {
        this.sector = sector;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getCelular() {
        return celular;
    }

    public void setCelular(String celular) {
        this.celular = celular;
    }

    public TipoMascota getTipo() {
        return tipo;
    }

    public void setTipo(TipoMascota tipo) {
        this.tipo = tipo;
    }

    public Integer getCantidad() {
        return cantidad;
    }

    public void setCantidad(Integer cantidad) {
        this.cantidad = cantidad;
    }

    public Integer getEdad() {
        return edad;
    }

    public void setEdad(Integer edad) {
        this.edad = edad;
    }

    public UnidadMedida getUnidadMedida() {
        return unidadMedida;
    }

    public void setUnidadMedida(UnidadMedida unidadMedida) {
        this.unidadMedida = unidadMedida;
    }

    public LocalDateTime getFechaEntrega() {
        return fechaEntrega;
    }

    public void setFechaEntrega(LocalDateTime fechaEntrega) {
        this.fechaEntrega = fechaEntrega;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public Comuna getComuna() {
        return comuna;
    }

    public void setComuna(Comuna comuna) {
        this.comuna = comuna;
    }

    public List<Evaluacion> getEvaluaciones() {
        return evaluaciones;
    }

    public void setEvaluaciones(List<Evaluacion> evaluaciones) {
        this.evaluaciones = evaluaciones;
    }

    @Override
    public String toString() {
        return "AvisoAdopcion{" +
                "id=" + id +
                ", fechaIngreso=" + fechaIngreso +
                ", sector='" + sector + '\'' +
                ", tipo=" + tipo +
                ", cantidad=" + cantidad +
                ", edad=" + edad +
                '}';
    }
}