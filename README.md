# OKR-Backend

Este é o backend da aplicação Mentto, responsável por gerenciar os Objetivos e Resultados-Chave (OKRs).

## Estrutura do Projeto

O projeto segue uma estrutura modular, com diretórios para:
- `src/app.js`: Ponto de entrada da aplicação.
- `src/config/`: Configurações gerais.
- `src/controllers/`: Lógica de negócio para as rotas.
- `src/middleware/`: Middlewares para autenticação e outras funcionalidades.
- `src/models/`: Definições dos modelos de dados (Mongoose).
- `src/routes/`: Definição das rotas da API.
- `src/services/`: Serviços auxiliares, como envio de e-mail.

## Configuração

1.  **Variáveis de Ambiente**: Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:
    ```
    DB_USERNAME=username
    DB_PASSWORD=password
    DB_NAME=okr
    DB_HOST=localhost
    PORT=5000

    JWT_SECRET=okr

    RESEND_API_KEY=resend_api_key
    ```

2.  **Instalação de Dependências**: Navegue até o diretório raiz do projeto e execute:
    ```bash
    npm install
    ```

## Como Rodar

Para iniciar o servidor, execute:

```bash
node .\src\app.js
```

O servidor estará disponível em `http://localhost:5000` (ou na porta configurada no `.env`).

## Rotas da API

As rotas da API estão definidas no diretório `src/routes/` e incluem:
- Autenticação (`authRoutes.js`)
- OKRs (`okrRoutes.js`)
- Key Results (`keyResultRoutes.js`)
- Perfis (`profileRoutes.js`)

Para detalhes específicos sobre os endpoints e seus payloads, consulte os arquivos de rota correspondentes.