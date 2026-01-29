package com.indievillan.demo.dto;

import lombok.Data;

@Data
public class NovoEventoDTO {
    private String titulo;
    private String descricao; 
    private String criadorId; 
    private Double latitude; 
    private Double longitude; 
}
