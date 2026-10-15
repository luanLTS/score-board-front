# Proposta: workspace de tênis

## Por quê

O Score Board já possui um placar genérico, histórico, ranking e chaveamento,
mas as regras específicas de tênis não cabem bem no modelo atual de pontos
lineares. A nova experiência deve separar o placar genérico de um workspace de
tênis, permitindo controlar partidas simples e campeonatos com regras próprias.

## O que muda

- Adicionar uma navegação principal entre o placar genérico e o workspace de
  tênis.
- Manter o placar genérico para partidas simples e chaveamentos sem regras
  específicas de FIFA, truco ou tênis.
- Remover a dependência do seletor de tipo de jogo dentro do placar genérico,
  preservando a compatibilidade com dados e fluxos existentes quando necessário.
- Criar partida simples de tênis em formato super tie-break.
- Sortear automaticamente o primeiro sacador e aplicar a sequência oficial de
  saques e troca de lados do super tie-break.
- Criar campeonato de tênis com turnos classificatórios, ranking acumulado e
  fase eliminatória.
- Persistir partidas e campeonatos de tênis em contratos e chaves próprias,
  mantendo o histórico genérico separado.
- Permitir fechar um turno concluído e escolher entre iniciar outro turno ou
  avançar para as eliminatórias.
- Gerar o chaveamento das eliminatórias pela classificação, enfrentando o
  melhor colocado contra o pior colocado e usando byes quando necessário.
- Preservar o chaveamento genérico já existente dentro da área de placar.

Ficam fora desta mudança:

- partidas de duplas;
- formação, cadastro ou gerenciamento de equipes;
- backend, sincronização entre dispositivos ou autenticação;
- formatos de torneio diferentes da fase classificatória por turnos seguida de
  eliminatórias;
- migração completa dos documentos históricos para o OpenSpec.

## Capacidades

### Novas capacidades

- `game-navigation`: permite alternar entre a área de placar genérico e o
  workspace especializado de tênis.
- `generic-scoreboard`: mantém partidas simples e chaveamentos genéricos sem
  regras específicas de um jogo.
- `tennis/simple-match`: controla partidas simples de tênis com super tie-break
  e partida eliminatória de melhor de 3 games.
- `tennis/tournament`: controla turnos classificatórios, ranking acumulado,
  avanço para eliminatórias e chaveamento de tênis por classificação.

### Capacidades modificadas

Nenhuma capacidade OpenSpec existente é modificada, pois o projeto ainda não
possui especificações principais arquivadas. Os comportamentos atuais do
placar, histórico e chaveamento serão tratados como contratos de
compatibilidade durante a implementação.

## Impacto

- Interface principal e navegação da aplicação.
- Tipos, hooks, regras e componentes do placar.
- Novo módulo de feature para tênis.
- Modelo de torneio, incluindo estados de turno e eliminatórias.
- Ranking específico de tênis, separado do ranking geral baseado no histórico.
- Persistência local de partida e torneio.
- Histórico próprio de partidas de tênis e integração dos resultados do
  campeonato com seu ranking e chaveamento.
- Testes unitários e de componentes para regras, ranking, transições e
  preservação dos fluxos existentes.
- Nenhuma dependência externa nova prevista.
