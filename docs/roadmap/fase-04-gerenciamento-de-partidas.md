# Fase 4: Gerenciamento De Partidas

## Objetivo

Transformar o placar em parte de um fluxo de partida, com criação, status, vencedor e separação clara entre partida em andamento e partida finalizada.

## Escopo Incluído

- Criar nova partida.
- Controlar status `pending`, `in_progress` e `finished`.
- Definir vencedor ao finalizar.
- Separar placar atual de resultado final.
- Fluxo de nova partida após finalização.

## Fora De Escopo

- Torneios.
- Ranking.
- Estatísticas agregadas.
- Backend.
- Múltiplas partidas simultâneas.

## Dependências

- Fase 1 concluída.
- Fase 2 concluída para regras por jogo.
- Fase 3 concluída para persistência e histórico.

## Entregáveis

- Módulo `src/features/matches`.
- Tipos e utilitários de partida.
- Hook para gerenciar partida atual.
- Fluxo de criação e finalização.
- Integração com histórico.

## Tarefas Pequenas Detalhadas

### 1. Preparar estrutura da feature de partidas

**Objetivo:** criar a base organizacional do módulo `matches`.

**Arquivos previstos:**

- `src/features/matches/types.ts`
- `src/features/matches/utils/matchLifecycle.ts`
- `src/features/matches/hooks/useCurrentMatch.ts`
- `src/features/matches/components/...`

**Pré-requisitos:**

- Fase 1 concluída.
- Fase 2 concluída.
- Fase 3 concluída.

**Passos:**

- Criar diretório `src/features/matches`.
- Criar subpastas `components`, `hooks` e `utils`.
- Evitar misturar histórico e torneios dentro do módulo de partidas.

**Critério de pronto:**

- Estrutura inicial existe.
- O módulo tem fronteira clara com `scoreboard` e `history`.

**Paralelismo:** bloqueia as demais tarefas da feature.

### 2. Consolidar tipo `Match`

**Objetivo:** transformar o modelo inicial da Fase 3 no contrato principal de partida.

**Arquivos previstos:**

- `src/features/matches/types.ts`
- `src/features/history/types.ts`, se houver tipo duplicado a remover.

**Depende de:** tarefa 1.

**Passos:**

- Definir `MatchStatus` com `pending`, `in_progress` e `finished`.
- Consolidar `Match` com jogo, participantes, pontuações, status, vencedor e datas.
- Garantir compatibilidade com histórico já criado na Fase 3.

**Critério de pronto:**

- Existe uma única fonte de verdade para o tipo de partida.
- Histórico consome o tipo consolidado.

**Paralelismo:** desbloqueia funções puras e UI mockada.

### 3. Criar funções puras de ciclo de vida da partida

**Objetivo:** modelar criação, início e finalização sem depender de React.

**Arquivos previstos:**

- `src/features/matches/utils/matchLifecycle.ts`

**Depende de:** tarefa 2.

**Passos:**

- Criar função para criar partida pendente.
- Criar função para iniciar partida.
- Criar função para finalizar partida.
- Garantir que transições inválidas não alterem estado silenciosamente.

**Critério de pronto:**

- Ciclo de vida pode ser testado fora da UI.
- Status só muda por funções explícitas.

**Paralelismo:** pode rodar em paralelo com UI de criação mockada.

### 4. Criar cálculo de vencedor e empate

**Objetivo:** definir resultado final a partir das pontuações.

**Arquivos previstos:**

- `src/features/matches/utils/matchResult.ts`

**Depende de:** tarefa 2.

**Passos:**

- Criar função para calcular vencedor a partir do placar.
- Tratar empate explicitamente.
- Retornar resultado sem acoplar ao componente visual.

**Critério de pronto:**

- Vitória e empate têm representação clara.
- A decisão pendente sobre empate está refletida no contrato.

**Paralelismo:** pode rodar em paralelo com tarefa 3.

### 5. Criar hook `useCurrentMatch`

**Objetivo:** gerenciar a partida atual e suas transições na aplicação.

**Arquivos previstos:**

- `src/features/matches/hooks/useCurrentMatch.ts`

**Depende de:** tarefas 3 e 4.

**Passos:**

- Armazenar partida atual.
- Expor ações para criar, iniciar, finalizar e preparar nova partida.
- Integrar resultado calculado ao finalizar.

**Critério de pronto:**

- A UI consegue controlar a partida sem manipular status manualmente.

**Paralelismo:** sequencial após funções puras.

### 6. Criar UI de criação de nova partida

**Objetivo:** permitir iniciar um novo confronto a partir de dados básicos.

**Arquivos previstos:**

- `src/features/matches/components/NewMatchForm.tsx`

**Depende de:** tarefa 2 para tipos; pode começar com estado mockado.

**Passos:**

- Criar formulário ou painel simples para participantes.
- Permitir escolher ou confirmar tipo de jogo.
- Acionar criação de partida pendente ou em andamento conforme decisão de UX.

**Critério de pronto:**

- Usuário consegue iniciar o fluxo de nova partida.
- UI não salva histórico diretamente.

**Paralelismo:** pode rodar em paralelo com tarefas 3 e 4.

### 7. Integrar seleção de jogo ao fluxo de partida

**Objetivo:** fazer a partida carregar o tipo de jogo usado pelo placar.

**Arquivos previstos:**

- `src/features/matches/components/NewMatchForm.tsx`
- `src/features/scoreboard/hooks/useGameRules.ts`
- `src/features/matches/hooks/useCurrentMatch.ts`

**Depende de:** tarefas 5 e 6.

**Passos:**

- Passar `GameKind` escolhido para a partida criada.
- Garantir que o placar use a mesma configuração da partida atual.
- Evitar divergência entre seleção visual e estado da partida.

**Critério de pronto:**

- Partida e placar compartilham o mesmo tipo de jogo.

**Paralelismo:** sequencial após hook e UI inicial.

### 8. Integrar placar com partida em andamento

**Objetivo:** fazer o placar representar e alterar a partida atual.

**Arquivos previstos:**

- `src/features/matches/components/CurrentMatchView.tsx`
- `src/features/scoreboard/components/Scoreboard.tsx`
- `src/app/App.tsx`

**Depende de:** tarefas 5 e 7.

**Passos:**

- Renderizar placar apenas quando houver partida em andamento.
- Sincronizar pontuações do placar com a partida atual.
- Preservar separação entre componente visual de placar e regra de partida.

**Critério de pronto:**

- Usuário controla a pontuação de uma partida em andamento.

**Paralelismo:** sequencial.

### 9. Salvar partida finalizada no histórico

**Objetivo:** integrar o fim da partida ao armazenamento da Fase 3.

**Arquivos previstos:**

- `src/features/matches/hooks/useCurrentMatch.ts`
- `src/features/history/persistence/historyStorage.ts`
- `src/app/App.tsx`, se a composição estiver na tela.

**Depende de:** tarefas 5, 8 e histórico da Fase 3.

**Passos:**

- Ao finalizar, calcular resultado.
- Persistir a partida finalizada no histórico.
- Atualizar a lista de histórico exibida.

**Critério de pronto:**

- Partida finalizada aparece no histórico com resultado consistente.

**Paralelismo:** sequencial após integração do placar.

### 10. Criar fluxo de novo confronto após finalização

**Objetivo:** permitir continuar usando o app depois de finalizar uma partida.

**Arquivos previstos:**

- `src/features/matches/components/MatchFinishedActions.tsx`
- `src/features/matches/hooks/useCurrentMatch.ts`

**Depende de:** tarefa 9.

**Passos:**

- Exibir ação para iniciar novo confronto.
- Criar nova partida com placar limpo.
- Preservar histórico anterior.

**Critério de pronto:**

- Usuário consegue finalizar uma partida e começar outra sem recarregar a página.

**Paralelismo:** sequencial.

### 11. Bloquear edição de partida finalizada

**Objetivo:** impedir mudanças acidentais em resultado consolidado.

**Arquivos previstos:**

- `src/features/scoreboard/components/Scoreboard.tsx`
- `src/features/matches/components/CurrentMatchView.tsx`
- `src/features/matches/utils/matchLifecycle.ts`

**Depende de:** tarefas 8, 9 e 10.

**Passos:**

- Desabilitar controles do placar quando a partida estiver finalizada.
- Evitar que ações do hook alterem resultado finalizado.
- Exibir estado final de forma clara.

**Critério de pronto:**

- Resultado final não muda sem uma ação explícita futura.

**Paralelismo:** sequencial.

### 12. Verificar a fase

**Objetivo:** confirmar que a Fase 4 está pronta.

**Arquivos previstos:**

- Sem arquivos novos obrigatórios.

**Depende de:** todas as tarefas anteriores.

**Passos:**

- Rodar `npm run typecheck`.
- Rodar `npm run build`.
- Conferir manualmente criação, início, finalização, empate, histórico e novo confronto.

**Critério de pronto:**

- Typecheck passa.
- Build passa.
- Critérios de aceite da Fase 4 foram conferidos.

**Paralelismo:** não pode ser paralelo; é validação final.

## Execução Paralela

Pode ser paralelo depois da tarefa 2:

- Tarefa 3: funções de ciclo de vida.
- Tarefa 4: cálculo de vencedor e empate.
- Tarefa 6: UI de criação com estado mockado.

Deve ser sequencial:

- Tarefa 5 depende das funções puras.
- Tarefa 7 depende do hook e da UI de criação.
- Tarefa 8 depende da partida com jogo definido.
- Tarefa 9 depende do placar integrado.
- Tarefas 10 e 11 dependem da finalização.
- Tarefa 12 depende de tudo.

## Critérios De Aceite

- Usuário consegue criar uma partida.
- Partida passa pelos status esperados.
- Finalização define vencedor quando houver pontuação maior.
- Empate é tratado explicitamente.
- Resultado final não muda depois da finalização sem ação explícita.
- Nova partida começa com placar limpo.
- `npm run typecheck` passa.
- `npm run build` passa.

## Riscos E Decisões Pendentes

- Decidir como tratar empate.
- Decidir se a partida pode ser cancelada.
- Decidir se participantes devem ser entidades reutilizáveis ou texto livre nesta fase.
