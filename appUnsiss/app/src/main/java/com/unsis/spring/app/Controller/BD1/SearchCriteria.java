package com.unsis.spring.app.Controller.BD1;

public class SearchCriteria {
    private Long institutoId;
    private Long idArticulo;
    private Long autorId;
    private String fechaInicio;
    private String fechaFin;
    private Integer tipo;
    private Integer estatus;
    private Boolean compilado;

    // Getters
    public Long getInstitutoId() {
        return institutoId;
    }

    Long getArticuloId(){
        return idArticulo;
    }

    public Long getAutorId() {
        return autorId;
    }

    public String getFechaInicio() {
        return fechaInicio;
    }

    public String getFechaFin() {
        return fechaFin;
    }

    public Integer getTipo() {
        return tipo;
    }

    public Integer getEstatus(){
        return estatus;
    }

    public Boolean getCompilado() {
        return compilado;
    }

    // Setters
    public void setInstitutoId(Long institutoId) {
        this.institutoId = institutoId;
    }

    public void setArticuloId(Long idArticulo){
        this.idArticulo = idArticulo;
    }

    public void setAutorId(Long autorId) {
        this.autorId = autorId;
    }

    public void setFechaInicio(String fechaInicio) {
        this.fechaInicio = fechaInicio;
    }

    public void setFechaFin(String fechaFin) {
        this.fechaFin = fechaFin;
    }

    public void setTipo(Integer tipo) {
        this.tipo = tipo;
    }

    public void setEstatus(Integer estatus) {
        this.estatus = estatus;
    }

    public void setCompilado(Boolean compilado) {
        this.compilado = compilado;
    }
}