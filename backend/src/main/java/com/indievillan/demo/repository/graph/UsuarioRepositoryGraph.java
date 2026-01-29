package com.indievillan.demo.repository.graph;

import java.util.List;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import com.indievillan.demo.model.graph.UsuarioGraph;

public interface UsuarioRepositoryGraph extends Neo4jRepository<UsuarioGraph, String>{
    
    @Query("MERGE (u:Usuario {mongoId: $userId}) " +
           "ON CREATE SET u.nome = $userName " +
           "MERGE (e:Evento {mongoId: $eventId, titulo: $eventTitle}) " +
           "MERGE (u)-[:CRIOU]->(e)")
    void registrarCriacaoEvento(String userId, String userName, String eventId, String eventTitle);

    @Query("MERGE (u:Usuario {mongoId: $userId}) " +
           "ON CREATE SET u.nome = $userName " +   // Garante que o nome seja salvo se criar agora
           "MERGE (e:Evento {mongoId: $eventId}) " +
           "ON CREATE SET e.titulo = $eventTitle " + // Garante o título
           "MERGE (u)-[:PARTICIPARA]->(e)")
    void confirmarPresenca(String userId, String userName, String eventId, String eventTitle);

    @Query("MATCH (u:Usuario)-[:PARTICIPARA]->(e:Evento {mongoId: $eventId}) RETURN u")
    List<UsuarioGraph> listarParticipantes(String eventId);

    @Query("MATCH (u:Usuario {mongoId: $userId})-[r:PARTICIPARA]->(e:Evento {mongoId: $eventId}) DELETE r")
    void removerPresenca(String userId, String eventId);
    
    @Query("RETURN EXISTS( (:Usuario {mongoId: $userId})-[:PARTICIPARA]->(:Evento {mongoId: $eventId}) )")
    Boolean verificarPresenca(String userId, String eventId);
}