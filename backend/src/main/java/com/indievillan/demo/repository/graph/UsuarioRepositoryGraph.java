package com.indievillan.demo.repository.graph;

import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.neo4j.repository.Neo4jRepository;

import com.indievillan.demo.model.graph.UsuarioGraph;

public interface UsuarioRepositoryGraph extends Neo4jRepository<UsuarioGraph, String>{
    @Query("MERGE (u:Usuario {mongoId: $userId}) " +
           "ON CREATE SET u.nome = $userName " +
           "MERGE (e:Evento {mongoId: $eventId, titulo: $eventTitle}) " +
           "MERGE (u)-[:CRIOU]->(e)")
    void registrarCriacaoEvento(String userId, String userName, String eventId, String eventTitle);
}
