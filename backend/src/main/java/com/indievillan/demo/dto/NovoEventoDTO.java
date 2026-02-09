package com.indievillan.demo.dto;

import jakarta.validation.constraints.NotNull; 
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class NovoEventoDTO {
    @NotBlank(message = "O título é obrigatório")
    private String titulo;
    
    private String descricao; 
    
    @NotBlank(message = "ID do criador é obrigatório")
    private String criadorId; 
    
    @NotNull(message = "Latitude é obrigatória")
    private Double latitude; 
    
    @NotNull(message = "Longitude é obrigatória")
    private Double longitude; 
}