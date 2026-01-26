package com.indievillan.demo.dto;

import org.springframework.data.mongodb.core.index.Indexed;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CadastroDTO {

    @NotBlank(message="Informe seu nome")
    private String nome;

    @NotBlank(message = "Informe seu email")
    @Email(message = "O formato do email é inválido")
    @Indexed(unique = true)
    private String email;
    
    @NotBlank(message = "Informe uma senha")
    private String senha;
}
