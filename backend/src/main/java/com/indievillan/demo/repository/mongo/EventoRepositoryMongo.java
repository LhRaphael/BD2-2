package com.indievillan.demo.repository.mongo;

import java.util.List;

import org.springframework.data.geo.Distance;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.indievillan.demo.model.mongo.EventoMongo;
import org.springframework.data.geo.Point;;

@Repository
public interface EventoRepositoryMongo extends MongoRepository<EventoMongo, String>{
    List<EventoMongo> findByLocalizacaoNear(Point pontoUsuario, Distance distancia);   
}
