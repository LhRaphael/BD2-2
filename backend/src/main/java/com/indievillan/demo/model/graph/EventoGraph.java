package com.indievillan.demo.model.graph;

import org.springframework.data.neo4j.core.schema.Node;

import lombok.Data;

@Data
@Node("Evento")
public class EventoGraph {
    @org.springframework.data.neo4j.core.schema.Id
    private String mongoId; // Link com o Mongo
    private String titulo;
}
