package com.indievillan.demo.model.mongo;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
@Document(collection = "usuarios")
public class UsuarioMongo {
    @Id
    private String id;

    @NotBlank(message="Informe seu nome")
    private String nome;

    @NotBlank(message = "Informe seu email")
    @Email(message = "O formato do email é inválido")
    @Indexed(unique = true)
    private String email;

    @NotBlank(message = "Informe uma senha")
    private String senhaHash; // Nunca salvar senha em texto puro!
}
