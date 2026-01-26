package com.indievillan.demo.service;

import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Service;

import com.indievillan.demo.dto.CadastroDTO;
import com.indievillan.demo.model.graph.UsuarioGraph;
import com.indievillan.demo.model.mongo.UsuarioMongo;
import com.indievillan.demo.repository.graph.UsuarioRepositoryGraph;
import com.indievillan.demo.repository.mongo.EventoRepositoryMongo;
import com.indievillan.demo.repository.mongo.UsuarioRepositoryMongo;

import lombok.RequiredArgsConstructor;
@Service
@RequiredArgsConstructor
public class UsuarioService {
    private final UsuarioRepositoryGraph  usuarioRepositoryGraph;
    private final UsuarioRepositoryMongo usuarioRepositoryMongo;
    private final EventoRepositoryMongo eventoRepositoryMongo;

    public UsuarioMongo cadastrarUsuarioMongo(CadastroDTO dto){
        UsuarioMongo usuario = new UsuarioMongo();
        usuario.setNome(dto.getNome());
        usuario.setEmail(dto.getEmail());
        usuario.setSenhaHash(BCrypt.hashpw(dto.getSenha(), BCrypt.gensalt())); // criptografa a senha

        UsuarioMongo salvo = usuarioRepositoryMongo.save(usuario);
        // faz a lincagem com o banco de dados neo4j
        try {
            UsuarioGraph node = new UsuarioGraph();
            node.setMongoId(salvo.getId());
            node.setNome(salvo.getNome());
            usuarioRepositoryGraph.save(node);
        } catch (Exception e) {
            System.err.println("Aviso: Falha ao sincronizar usuário no Neo4j: " + e.getMessage());
        }

        return salvo;

    }
}
