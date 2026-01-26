package com.indievillan.demo.model.mongo;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.data.mongodb.core.index.GeoSpatialIndexType;
import org.springframework.data.mongodb.core.index.GeoSpatialIndexed;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Document(collection = "eventos")
public class EventoMongo {
    @Id
    private String id;
    private String titulo;
    private String descricao;
    private LocalDateTime dataCriacao = LocalDateTime.now();
    
    // ID do criador para referência rápida
    private String criadorId; 
    private String criadorNome;

    // Campo Geoespacial Obrigatório para o Leaflet
    @GeoSpatialIndexed(type = GeoSpatialIndexType.GEO_2DSPHERE)
    private GeoJsonPoint localizacao;

    public EventoMongo(String titulo, String descricao, String criadorId, String criadorNome, Double longitude, Double latitude) {
        this.titulo = titulo;
        this.descricao = descricao;
        this.criadorId = criadorId;
        this.criadorNome = criadorNome;
        // Importante: MongoDB usa Ordem [Longitude, Latitude] (X, Y)
        this.localizacao = new GeoJsonPoint(longitude, latitude);
    }
}
