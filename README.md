# 🎨 MyVerse Interface – Frontend

Interface web da aplicação **MyVerse**, uma plataforma pessoal para acompanhar resenhas de livros, filmes e séries, e também organizar itens que o usuário deseja consumir. Esta aplicação se conecta à [MyVerse API]([https://github.com/seu-usuario/api-myverse](https://github.com/Allysson-ryan/MyVerse-Api)) para fornecer uma experiência completa e integrada.

---

## 📑 Sumário

- [📱 Sobre o Projeto](#-sobre-o-projeto)
- [🛠️ Funcionalidades](#️-funcionalidades)
- [🚀 Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [📦 Instalação e Uso](#-instalação-e-uso)
- [🧩 Estrutura da Interface](#-estrutura-da-interface)
- [🔗 Integração com a API](#-integração-com-a-api)

---

## 📱 Sobre o Projeto

O **MyVerse** oferece uma plataforma amigável, organizada e fluida para que usuários possam registrar suas experiências com mídias (resenhas) ou criar listas de desejos para consumir no futuro.  
Esta interface foi desenvolvida com foco em responsividade, acessibilidade, performance e boas práticas de UI/UX.

---

## 🛠️ Funcionalidades

- Login com conta Google (OAuth)
- Cadastro e visualização de resenhas
- Controle de progresso (páginas/episódios)
- Filtros por categoria, status e nome
- Página para projetos em consumo
- Listagem dos últimos projetos cadastrados
- Lista de desejos separada
- Edição e exclusão de qualquer item
- Componente de carrossel para destaques

---

## 🚀 Tecnologias Utilizadas

### ⚛️ React + Vite

| Ferramenta                        | Descrição                                    |
| --------------------------------- | -------------------------------------------- |
| **React.js 19**                   | Biblioteca para construção de interfaces SPA |
| **Vite**                          | Bundler e Dev Server rápido                  |
| **Tailwind CSS**                  | Estilização moderna com classes utilitárias  |
| **Mantine UI + MUI**              | Componentes visuais e interativos            |
| **Axios**                         | Requisições HTTP à API                       |
| **React Router DOM**              | Gerenciamento de rotas SPA                   |
| **jwt-decode**                    | Decodificação do token JWT                   |
| **Lucide / Phosphor / MUI Icons** | Ícones estilizados e acessíveis              |
| **Embla Carousel**                | Carrossel com controle total                 |
| **Tailwind Scrollbar Hide**       | Scroll invisível em componentes específicos  |

---

## 📦 Instalação e Uso

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/interface-myverse.git

# Acesse o projeto
cd interface-myverse

# Instale as dependências
npm install

# Execute o ambiente de desenvolvimento
npm run dev
```

A aplicação será executada em `http://localhost:5173` ou na porta definida pelo Vite.

---

## 🧩 Estrutura da Interface

```bash
src/
├── assets/              # Imagens e ícones
├── components/          # Componentes reutilizáveis
├── contexts/            # Gerenciamento de estado global
├── hooks/               # Hooks customizados
├── pages/               # Páginas da aplicação
├── services/            # Comunicação com a API (apiService.js)
├── styles/              # Estilos globais (Tailwind)
├── App.jsx              # Arquivo principal
├── main.jsx             # Ponto de entrada do app
```

---

## 🔗 Integração com a API

- Todas as requisições são feitas com **Axios**, centralizadas no arquivo `apiService.js`
- As rotas privadas exigem token JWT no header:  
  `Authorization: Bearer <token>`
- O token é armazenado de forma segura no `localStorage`
- O sistema faz logout automático caso o token expire ou seja inválido
