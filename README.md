# 🌍 EvenTech - Plataforma de Encontros Tecnológicos

> Projeto acadêmico de persistência poliglota utilizando MongoDB (Geoespacial) e Neo4j (Grafos).

O **EvenTech** é uma aplicação web fullstack que permite aos usuários descobrir, criar e participar de eventos tecnológicos baseados na sua localização atual. O sistema utiliza uma arquitetura híbrida de banco de dados para maximizar a eficiência: **MongoDB** para dados transacionais e geoespaciais, e **Neo4j** para recomendações e relacionamentos sociais.

---

## 🚀 Tecnologias Utilizadas

### Backend (API REST)
* **Java 17+** com **Spring Boot 3**
* **Spring Data MongoDB:** Persistência de documentos e queries geoespaciais (`$near`).
* **Spring Data Neo4j:** Persistência de grafos para relacionamentos (`User` -[:PARTICIPARA]-> `Event`).
* **Spring Security:** Autenticação e hash de senhas (BCrypt).
* **Maven:** Gerenciamento de dependências.

### Frontend (SPA)
* **React.js:** Biblioteca principal de interface.
* **Leaflet & React-Leaflet:** Renderização de mapas interativos.
* **Axios:** Consumo da API REST.
* **Lucide React:** Ícones modernos e leves.
* **React Toastify:** Notificações visuais.
* **Google ReCAPTCHA:** Segurança contra bots na alteração de senhas.

---

## ⚙️ Pré-requisitos

Antes de começar, você precisa ter instalado em sua máquina:
* [Java JDK 17](https://www.oracle.com/java/technologies/downloads/) ou superior.
* [Node.js](https://nodejs.org/) (v16 ou superior).
* [MongoDB](https://www.mongodb.com/) (Instância local ou MongoDB Atlas).
* [Neo4j](https://neo4j.com/) (Instância local ou Neo4j Aura).

---

## 🔧 Configuração e Instalação

### 1. Backend (Spring Boot)

1.  Clone o repositório e navegue até a pasta do backend.
2.  Configure o arquivo `src/main/resources/application.properties` com as credenciais dos seus bancos de dados:

```properties
# Configuração do MongoDB (Banco Primário)
spring.data.mongodb.uri=mongodb+srv://<SEU_USUARIO>:<SUA_SENHA>@cluster.mongodb.net/eventech?retryWrites=true&w=majority

# Configuração do Neo4j (Banco Secundário)
spring.neo4j.uri=bolt://localhost:7687
spring.neo4j.authentication.username=neo4j
spring.neo4j.authentication.password=<SUA_SENHA_NEO4J>

# Configuração do Servidor
server.port=8080

# 1. Execute a aplicação:
mvn spring-boot:run

# 2. Frontend (React)
Navegue até a pasta do frontend (cd eventech-front).

Instale as dependências:
npm install

# 3. Inicie o servidor 
npm start