# Design

## Context

Consulte `proposal.md` para a motivação e as especificações em `specs/` para o
contrato comportamental. Atualmente, `App` concentra a navegação, a partida
atual, o histórico e o torneio genérico. O placar usa pontuação linear e o
torneio existente gera diretamente um chaveamento de eliminação simples.

A mudança precisa preservar esses fluxos e introduzir um domínio de tênis com
pontuação não linear, estados de campeonato e uma navegação própria.

## Goals / Non-Goals

**Goals:**

- Separar as áreas `Placar` e `Tênis` na navegação da aplicação.
- Manter o placar e o chaveamento genéricos funcionando sem regras de esporte.
- Criar regras puras e testáveis para super tie-break e games com vantagem.
- Modelar o campeonato de tênis como uma máquina de estados explícita:
  configuração, turno em andamento, turno fechado, eliminatórias e finalizado.
- Reutilizar componentes visuais e o mecanismo de avanço do chaveamento quando
  isso não introduzir dependência das regras genéricas.
- Persistir partidas e campeonato de tênis de forma compatível com o padrão de
  armazenamento local existente.

**Non-Goals:**

- Duplas ou formação de equipes.
- Alteração do formato do chaveamento genérico.
- Backend, autenticação ou sincronização remota.
- Novos formatos de torneio além do fluxo de tênis especificado.

## Decisions

### 1. Criar uma feature dedicada de tênis

As regras de tênis ficarão em `src/features/tennis`, organizadas em tipos,
regras puras, hooks, componentes e persistência local quando necessário. O
placar genérico continuará em `src/features/scoreboard`, sem receber condições
para deuce, vantagem, games ou saque.

Alternativa considerada: adicionar `tennis` ao `GameKind` atual e expandir
`ScoreboardConfig`. Essa opção foi rejeitada porque pontuação linear não
representa corretamente os estados de um game, de um super tie-break e de um
campeonato com turnos.

### 2. Separar navegação principal de navegação interna

O `App` terá uma seleção de área principal (`Placar` ou `Tênis`). A área de
tênis terá um layout próprio e poderá oferecer as entradas de partida simples,
ranking e campeonato. O placar genérico continuará sendo a área inicial e
manterá seu histórico e chaveamento.

Alternativa considerada: manter uma única lista de abas e adicionar mais uma
aba para tênis. Essa opção foi rejeitada porque misturaria conceitos genéricos
com fluxos específicos e dificultaria a evolução do workspace de tênis.

### 3. Modelar as regras de pontuação como funções puras

O domínio de tênis terá funções independentes para:

- avançar pontos do super tie-break;
- calcular sacador e próximo bloco de saques;
- indicar troca de lado a cada seis pontos;
- verificar vitória por pelo menos dez pontos e diferença de dois;
- avançar pontos de um game com `0/15/30/40`, deuce e vantagem;
- avançar games até dois games vencidos.

O estado da partida deverá armazenar a pontuação necessária para continuar uma
partida restaurada, incluindo o primeiro sacador definido aleatoriamente e o
tipo de partida. A aleatoriedade será injetável nas funções ou no serviço de
criação para que os testes sejam determinísticos.

### 4. Tratar classificatória e eliminatórias como fases distintas

O campeonato de tênis terá uma fase classificatória composta por turnos. Um
turno gera cada par de participantes uma vez. Ao fechar um turno, os resultados
são acumulados no ranking do campeonato e o usuário escolhe entre iniciar outro
turno ou gerar as eliminatórias.

A fase eliminatória reutilizará o conceito de `TournamentBracket`, mas receberá
os participantes já ordenados pelo ranking. A ordenação será pareada do início
com o fim (`1º × último`, `2º × penúltimo`) e o gerador existente continuará
responsável por completar a estrutura com byes e avançar vencedores.

Alternativa considerada: salvar os resultados da classificatória apenas no
histórico geral e recalcular o ranking a partir dele. Essa opção foi rejeitada
porque permitiria misturar partidas de outros torneios e perderia a identidade
do ranking específico do campeonato.

### 5. Manter ranking geral e ranking do campeonato separados

O ranking geral atual continuará baseado no histórico geral da aplicação. O
ranking de tênis será calculado a partir dos resultados pertencentes ao
campeonato atual, acumulando todos os turnos. A ordenação usará vitórias, saldo
total de pontos nos super tie-breaks, confronto direto e sorteio. Os dois
rankings não devem compartilhar filtros implícitos nem alterar os resultados um
do outro.

### 6. Usar persistência local com novos contratos versionados

O estado de partida, o histórico de partidas e o campeonato de tênis terão
chaves de armazenamento próprias e validadores dedicados, seguindo o padrão
das features atuais:

- `score-board:tennis-current-match:v1` para a partida em andamento;
- `score-board:tennis-match-history:v1` para partidas simples finalizadas;
- `score-board:tennis-current-tournament:v1` para o campeonato, seus turnos,
  resultados, ranking acumulado e eliminatórias.

O histórico genérico continuará usando sua chave e seu contrato atuais. A
primeira entrega não adicionará `tennis` ao `GameKind` nem regravará dados
genéricos em um novo formato. O ranking do campeonato será derivado dos
resultados persistidos no próprio campeonato, evitando misturar partidas de
outros contextos.

## Risks / Trade-offs

- [Risco] O estado de uma partida de tênis é mais rico que dois números.  →
  Mitigação: usar tipos explícitos e testes de transição para cada estado de
  pontuação.
- [Risco] A integração direta com o torneio genérico pode vazar regras de
  tênis para o módulo genérico.  → Mitigação: o campeonato de tênis deve
  adaptar seus resultados ao bracket por uma fronteira própria.
- [Risco] Byes com pareamento por ranking podem produzir confrontos inesperados
  em quantidades não-potência-de-dois.  → Mitigação: testar explicitamente
  3, 4, 5, 6 e 8 participantes antes da integração visual.
- [Risco] Sorteio do primeiro sacador pode tornar testes instáveis.  →
  Mitigação: permitir uma fonte de aleatoriedade controlada nos testes e
  persistir o sacador escolhido.
- [Trade-off] O histórico compartilhado pode precisar de um contrato mais rico
  para exibir detalhes de tênis.  → Mitigação: começar com o resultado
  mínimo compatível e manter detalhes completos no armazenamento do tênis.

## Migration Plan

1. Introduzir os tipos e regras novas sem remover o fluxo genérico.
2. Adicionar a navegação `Placar`/`Tênis` mantendo `Placar` como entrada padrão.
3. Integrar partida simples de tênis e validar sua persistência.
4. Integrar turnos, ranking acumulado e transição para eliminatórias.
5. Migrar apenas os pontos de composição necessários no `App` e cobrir os
   fluxos genéricos com testes de regressão.

Se a entrega precisar ser revertida, a navegação pode voltar a exibir apenas a
área `Placar` e as novas chaves de armazenamento podem ser ignoradas sem
alterar os dados genéricos existentes.

