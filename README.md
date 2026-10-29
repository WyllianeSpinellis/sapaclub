# SapaClub

O SapaClub é um fã-clube fictício criado para celebrar mulheres lésbicas. A proposta é imaginar um espaço online onde integrantes possam compartilhar interesses, criar vínculos e acompanhar uma coleção de emblemas que representa o tempo de participação no clube.

Este projeto está sendo desenvolvido como atividade de Desenvolvimento Front-end para Web. O site é demonstrativo: não possui contas reais, chat nem painel de administração conectado a um servidor.

## Emblemas

| Tempo de participação | Emblema |
| --- | --- |
| 1 mês | Faísca |
| 2 meses | Brilho |
| 6 meses | Orgulho |
| 12 meses | Lenda |
| 24 meses | Ícone |

## Funcionalidades da versão atual

- Página inicial com navegação e conteúdo sobre a comunidade fictícia.
- Emblemas SVG que aparecem conforme o tempo selecionado.
- Simulação do passe de integrante.
- Favoritos e progresso salvos no armazenamento local do navegador.
- Formulário demonstrativo com validação nativa; ele não envia o e-mail a um servidor.
- Layout responsivo e foco visível para navegação por teclado.

## Tecnologias

- HTML5 semântico
- CSS3
- JavaScript
- SVG

## Decisão sobre os gráficos

O SapaClub usa SVG nos emblemas e na ilustração do destaque. Como são gráficos vetoriais, eles podem aumentar ou diminuir sem perder nitidez. Os SVGs também têm título e descrição acessíveis. Canvas não foi necessário porque o site não precisa de desenho pixel a pixel nem de animações gráficas intensivas.

## Como visualizar

Abra `index.html` em um navegador. O projeto não precisa de instalação de dependências.

## Estrutura de arquivos

```text
sapaclub/
├── index.html
├── README.md
├── .gitignore
├── css/
│   └── style.css
└── js/
    └── script.js

## Aula 15 — DNS, domínios, SSL e deploy

O SapaClub foi publicado com GitHub Pages. A conexão HTTPS está ativada.

A publicação usa o domínio padrão do GitHub Pages; não foi configurado um domínio personalizado.

Acesse o site: [SapaClub](https://wyllianespinellis.github.io/sapaclub/)