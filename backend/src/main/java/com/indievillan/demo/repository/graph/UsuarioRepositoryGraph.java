package com.indievillan.demo.repository.graph;

import org.springframework.data.mongodb.repository.Query;

public interface UsuarioRepositoryGraph {
    @Query("MERGE (u:Usuario {mongoId: $userId}) " +
           "ON CREATE SET u.nome = $userName " +
           "MERGE (e:Evento {mongoId: $eventId, titulo: $eventTitle}) " +
           "MERGE (u)-[:CRIOU]->(e)")
    void registrarCriacaoEvento(String userId, String userName, String eventId, String eventTitle);
}
