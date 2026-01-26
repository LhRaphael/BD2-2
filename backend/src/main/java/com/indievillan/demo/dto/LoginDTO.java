package com.indievillan.demo.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginDTO {

    @NotBlank(message = "Informe seu email")
    @Email(message = "O formato do email é inválido")
    private String email;
    
    @NotBlank(message = "Informe uma senha")
    private String senha;

}
