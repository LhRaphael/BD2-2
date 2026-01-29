package com.indievillan.demo.repository.mongo;

import com.indievillan.demo.model.mongo.UsuarioMongo;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UsuarioRepositoryMongo extends MongoRepository<UsuarioMongo, String>{
    Optional<UsuarioMongo> findByEmail(String email);
    Optional<Boolean> deleteByEmail(String email);
}
