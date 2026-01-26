package com.indievillan.demo.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.indievillan.demo.dto.CadastroDTO;
import com.indievillan.demo.dto.LoginDTO;
import com.indievillan.demo.service.UsuarioService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class UsuarioController {
    private final UsuarioService usuarioService;

    @PostMapping("/cadastro")
    public ResponseEntity<?> cadastrar(@Valid @RequestBody CadastroDTO dto){
        try{
            var usuario = usuarioService.cadastrarUsuarioMongo(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(usuario);
        
        } catch (IllegalArgumentException e) {
            // O Service lança IllegalArgumentException se o email já existir
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro interno ao cadastrar usuário.");
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginDTO dto) {
        try {
            var usuario = usuarioService.autenticarUsuarioMongo(dto);
            return ResponseEntity.ok(usuario);
        } catch (SecurityException e) {
            // O Service lança SecurityException para falha de autenticação
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro ao processar login.");
        }
    }

    @DeleteMapping("/usuario/{id}")
    public ResponseEntity<?> delete(@PathVariable String id){
        try{
            var usuario = usuarioService.excluirUsuarioMongo(id);
            return ResponseEntity.ok(usuario);
        }catch (SecurityException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }catch(Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro ao excluir usuário");
        }
    }
}
