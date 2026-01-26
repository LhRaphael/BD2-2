package com.indievillan.demo.model.graph;

import org.springframework.data.neo4j.core.schema.Node;

import lombok.Data;

@Data
@Node("Usuario")
public class UsuarioGraph {
    @org.springframework.data.neo4j.core.schema.Id
    private String mongoId; // Link com o Mongo
    private String nome;
}
