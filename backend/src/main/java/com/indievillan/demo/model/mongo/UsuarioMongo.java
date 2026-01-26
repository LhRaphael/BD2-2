package com.indievillan.demo.model.mongo;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Data
@Document(collection = "usuarios")
public class UsuarioMongo {
    @Id
    private String id;

    private String nome;
    private String email;
    private String senhaHash; // Nunca salvar senha em texto puro!
}
