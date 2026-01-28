package com.indievillan.demo.service;

import java.util.List;

import org.springframework.data.geo.Distance;
import org.springframework.data.geo.Metrics;
import org.springframework.data.geo.Point;
import org.springframework.stereotype.Service;

import com.indievillan.demo.dto.AtlzEventoDTO;
import com.indievillan.demo.dto.NovoEventoDTO;
import com.indievillan.demo.model.mongo.EventoMongo;
import com.indievillan.demo.model.mongo.UsuarioMongo;
import com.indievillan.demo.repository.graph.UsuarioRepositoryGraph;
import com.indievillan.demo.repository.mongo.EventoRepositoryMongo;
import com.indievillan.demo.repository.mongo.UsuarioRepositoryMongo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EventoService {

    private final UsuarioRepositoryMongo usuarioRepositoryMongo;
    private final EventoRepositoryMongo eventoRepositoryMongo;
    private final UsuarioRepositoryGraph usuarioRepositoryGraph;

    //Create 
    public EventoMongo criarEventoMongo(NovoEventoDTO dto){
        UsuarioMongo criador = usuarioRepositoryMongo.findById(dto.getCriadorId()).orElseThrow(()-> new SecurityException("Usuário não encontrado"));

        EventoMongo evento = new EventoMongo(
            dto.getTitulo(),
            dto.getDescricao(),
            criador.getId(),
            criador.getNome(),
            dto.getLongitude(),
            dto.getLatitude()
        );

        EventoMongo eventoSalvo = eventoRepositoryMongo.save(evento);

        try {
            usuarioRepositoryGraph.registrarCriacaoEvento(
                    criador.getId(),
                    criador.getNome(),
                    eventoSalvo.getId(),
                    eventoSalvo.getTitulo()
            );
        } catch (Exception e) {
            System.err.println("Erro crítico: Falha ao criar relacionamento no grafo. " + e.getMessage());
        }

        return evento;
    }

    //Read
    public List<EventoMongo> buscarEventoMongos(Double lat, Double lng, Double raioKm){
        if (lat == null || lng == null) {
            throw new IllegalArgumentException("Latitude e Longitude são obrigatórias.");
        }
        
        Point pontoUsuario = new Point(lng, lat);
        Distance distancia = new Distance(raioKm, Metrics.KILOMETERS);
        
        return eventoRepositoryMongo.findByLocalizacaoNear(pontoUsuario, distancia);
    }

    //Update
    public EventoMongo atualizarEvento(AtlzEventoDTO dto){
        EventoMongo evento = eventoRepositoryMongo.findById(dto.getId()).orElseThrow(()-> new SecurityException("Evento não encontrado"));
        evento.setTitulo(dto.getTitulo());
        evento.setDescricao(dto.getDescricao());
        return eventoRepositoryMongo.save(evento);
    }

    //Delete
    public Boolean excluirEvento(String id){
        try{
            eventoRepositoryMongo.deleteById(id);
        }catch(Exception e){
            throw e;
        }
        return true;
    }

    //Delete
    public Boolean exclirEventosUsuario(String criadorId){
        eventoRepositoryMongo.deleteAllByCriadorId(criadorId).orElseThrow(()-> new SecurityException("Erro ao excluir todos os eventos"));
        return true;
    }
}
