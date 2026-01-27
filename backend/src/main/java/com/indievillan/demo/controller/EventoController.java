package com.indievillan.demo.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.indievillan.demo.dto.AtlzEventoDTO;
import com.indievillan.demo.dto.NovoEventoDTO;
import com.indievillan.demo.service.EventoService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class EventoController {
    private final EventoService eventoService;

    @PostMapping("/eventos")
    public ResponseEntity<?> criarEvento(@Valid @RequestBody NovoEventoDTO dto) {
        try {
            var evento = eventoService.criarEventoMongo(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(evento);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro ao criar evento.");
        }
    }

    @GetMapping("/eventos")
    public ResponseEntity<?> listarEventosProximos(
            @RequestParam Double lat,
            @RequestParam Double lng,
            @RequestParam(defaultValue = "10") Double raioKm) {
        try {
            var eventos = eventoService.buscarEventoMongos(lat, lng, raioKm);
            return ResponseEntity.ok(eventos);
        } catch (IllegalArgumentException e) {
            // Retorna 400 se faltar lat ou lng
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro ao buscar eventos.");
        }
    }

    @PatchMapping("/evento/atualizar")
    public ResponseEntity<?> atualizarEvento(@RequestBody AtlzEventoDTO dto){
        try{
            var evento = eventoService.atualizarEvento(dto);
            return ResponseEntity.ok(evento);
        }catch(Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro ao atualizar evento.");
        }
    }

    @DeleteMapping("/evento/{id}")
    public ResponseEntity<?> deletarEvento(@PathVariable String id){
        try{
            var evento = eventoService.excluirEvento(id);
            return ResponseEntity.ok(evento);
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro ao excluir evento.");
        }
    }
}
