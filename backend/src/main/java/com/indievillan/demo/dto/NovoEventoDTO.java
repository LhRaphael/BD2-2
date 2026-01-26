package com.indievillan.demo.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class NovoEventoDTO {
    @NotBlank(message = "Informe o título do evento")
    private String titulo;
    private String descricao; 
    private String criadorId; 
    private Double latitude; 
    private Double longitude; 
}
