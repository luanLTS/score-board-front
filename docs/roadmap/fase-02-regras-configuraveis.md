# Fase 2: Regras Configuráveis

## Objetivo

Separar a lógica do placar das regras de pontuação, permitindo configurar tipo de jogo, pontuação mínima, pontuação máxima opcional e permissão de pontuação negativa para jogos como genérico, truco e FIFA.

## Escopo Incluído

- Tipo de jogo configurável.
- Configuração genérica de pontuação.
- Suporte a pontuação mínima.
- Suporte a pontuação máxima opcional.
- Suporte a `allowNegativeScore`.
- Preparação de regras para `generic`, `truco` e `fifa`.
- Validação de ações de pontuação por regra.

## Fora De Escopo

- Persistência da configuração.
- Finalização de partida.
- Histórico.
- Torneios.
- Estatísticas.

## Dependências

- Fase 1 concluída.
- Hook `useScoreboard` já isolado.
- Funções puras de pontuação disponíveis.

## Entregáveis

- Tipo `GameKind`.
- Tipo `ScoreboardConfig`.
- Registro de regras por jogo.
- Hook `useGameRules`.
- UI simples para escolher tipo de jogo se fizer sentido para a experiência.

## Tarefas Pequenas Detalhadas

### 1. Definir contratos de regras de jogo

**Objetivo:** criar os tipos que representam jogo e configuração de pontuação.

**Arquivos previstos:**

- `src/features/scoreboard/types.ts`
- `src/features/scoreboard/rules/types.ts`, se as regras forem separadas do domínio principal.

**Pré-requisitos:**

- Fase 1 concluída.
- Tipos do placar já existentes.

**Passos:**

- Criar tipo `GameKind`.
- Criar tipo `ScoreboardConfig`.
- Definir campos para pontuação mínima, pontuação máxima opcional e permissão de pontuação negativa.

**Critério de pronto:**

- Configurações podem ser representadas sem depender de React.
- Contratos não incluem persistência, partida ou torneio.

**Paralelismo:** bloqueia as tarefas de configuração e validação.

### 2. Criar configurações iniciais por jogo

**Objetivo:** declarar as regras iniciais para `generic`, `truco` e `fifa`.

**Arquivos previstos:**

- `src/features/scoreboard/rules/gameRules.ts`
- `src/features/scoreboard/constants.ts`, se o projeto preferir manter constantes do placar juntas.

**Depende de:** tarefa 1.

**Passos:**

- Definir configuração padrão para jogo genérico.
- Definir configuração inicial para truco.
- Definir configuração inicial para FIFA.
- Registrar todas as configurações em um mapa por `GameKind`.
- Manter `fifa` sem `maxScore` por enquanto.

**Critério de pronto:**

- Cada jogo conhecido tem uma configuração explícita.
- Valores pendentes continuam documentados em riscos e decisões, sem bloquear o contrato.
- O limite máximo real do truco continua pendente se ainda depender de decisão de produto.

**Paralelismo:** pode rodar em paralelo com a UI mockada de seleção de jogo.

### 3. Criar acesso seguro às regras

**Objetivo:** centralizar a obtenção de configuração por tipo de jogo.

**Arquivos previstos:**

- `src/features/scoreboard/rules/getGameRules.ts`
- `src/features/scoreboard/rules/index.ts`, se houver barrel local.

**Depende de:** tarefas 1 e 2.

**Passos:**

- Criar função para obter configuração por `GameKind`.
- Garantir fallback para configuração genérica quando necessário.
- Evitar que componentes acessem diretamente a estrutura interna do registro.

**Critério de pronto:**

- Consumidores pedem regras por `GameKind`.
- A UI não conhece detalhes internos do mapa de configurações.

**Paralelismo:** sequencial após as configurações existirem.

### 4. Atualizar funções puras de pontuação

**Objetivo:** aplicar configurações nas regras de incremento e decremento.

**Arquivos previstos:**

- `src/features/scoreboard/utils/score.ts`

**Depende de:** tarefas 1, 2 e 3.

**Passos:**

- Fazer as funções de pontuação receberem `ScoreboardConfig`.
- Bloquear decremento abaixo da pontuação mínima.
- Bloquear incremento quando a pontuação máxima for atingida.
- Manter comportamento atual para o modo genérico.

**Critério de pronto:**

- Regras configuráveis funcionam sem React.
- O placar genérico mantém o comportamento da Fase 1.

**Paralelismo:** deve ser sequencial porque muda o contrato usado pelo hook.

### 5. Atualizar `useScoreboard` para regras configuráveis

**Objetivo:** fazer o hook operar com a configuração ativa.

**Arquivos previstos:**

- `src/features/scoreboard/hooks/useScoreboard.ts`

**Depende de:** tarefa 4.

**Passos:**

- Permitir que o hook receba ou derive a configuração atual.
- Aplicar configuração nas ações de adicionar e remover ponto.
- Expor informação suficiente para a UI desabilitar ações indisponíveis.

**Critério de pronto:**

- O hook continua simples para o modo genérico.
- A UI consegue saber quando uma ação não deve ser permitida.

**Paralelismo:** sequencial após as funções puras atualizadas.

### 6. Criar hook `useGameRules`

**Objetivo:** encapsular seleção de jogo e acesso à configuração ativa.

**Arquivos previstos:**

- `src/features/scoreboard/hooks/useGameRules.ts`

**Depende de:** tarefas 2 e 3.

**Passos:**

- Armazenar o `GameKind` selecionado.
- Retornar a configuração correspondente.
- Expor ação para trocar o tipo de jogo.

**Critério de pronto:**

- Seleção de jogo fica isolada do componente principal.
- Decisão de resetar ou manter placar ao trocar jogo fica explícita.

**Paralelismo:** pode avançar em paralelo com a adaptação visual, mas integração depende da tarefa 5.

### 7. Adicionar seleção simples de tipo de jogo

**Objetivo:** permitir que o usuário escolha entre os jogos configurados.

**Arquivos previstos:**

- `src/features/scoreboard/components/GameKindSelect.tsx`
- `src/features/scoreboard/components/Scoreboard.tsx`

**Depende de:** tarefas 1 e 6 para integração real; pode começar com dados mockados após a tarefa 1.

**Passos:**

- Criar controle simples para escolher `generic`, `truco` ou `fifa`.
- Conectar o controle ao estado de regras.
- Manter a seleção visualmente secundária em relação ao placar.

**Critério de pronto:**

- Usuário consegue trocar tipo de jogo.
- A troca atualiza as regras usadas pelo placar.

**Paralelismo:** UI pode começar em paralelo, integração final é sequencial.

### 8. Ajustar estados de botões por regra

**Objetivo:** refletir visualmente ações bloqueadas pelas regras atuais.

**Arquivos previstos:**

- `src/features/scoreboard/components/ScoreControls.tsx`
- `src/features/scoreboard/components/ScorePanel.tsx`
- `src/features/scoreboard/components/Scoreboard.tsx`

**Depende de:** tarefas 5 e 7.

**Passos:**

- Desabilitar decremento quando o mínimo for atingido.
- Desabilitar incremento quando a pontuação máxima for atingida.
- Garantir que botões desabilitados tenham estilo e acessibilidade adequados.

**Critério de pronto:**

- UI comunica claramente quando uma ação não está disponível.
- Regras continuam aplicadas mesmo se algum botão for acionado indevidamente.

**Paralelismo:** sequencial após integração de regras.

### 9. Atualizar documentação conceitual se necessário

**Objetivo:** manter `PROJECT.md` alinhado às regras reais implementadas.

**Arquivos previstos:**

- `PROJECT.md`
- `docs/roadmap/fase-02-regras-configuraveis.md`

**Depende de:** decisões fechadas durante as tarefas 1 a 8.

**Passos:**

- Revisar tipos e regras descritos no projeto.
- Atualizar pontuações ou decisões que tenham mudado.
- Manter decisões pendentes quando ainda não houver definição de produto.

**Critério de pronto:**

- Documentação não contradiz o comportamento planejado.

**Paralelismo:** pode rodar em paralelo com ajustes visuais, mas deve ser revisada no final.

### 10. Verificar a fase

**Objetivo:** confirmar que a Fase 2 está pronta.

**Arquivos previstos:**

- Sem arquivos novos obrigatórios.

**Depende de:** todas as tarefas anteriores.

**Passos:**

- Rodar `npm run typecheck`.
- Rodar `npm run build`.
- Conferir manualmente modo genérico, truco, FIFA, mínimo e máximo.

**Critério de pronto:**

- Typecheck passa.
- Build passa.
- Critérios de aceite da Fase 2 foram conferidos.

**Paralelismo:** não pode ser paralelo; é validação final.

## Execução Paralela

Pode ser paralelo depois da tarefa 1:

- Tarefa 2: configurações iniciais por jogo.
- Tarefa 7: UI de seleção usando dados mockados.
- Tarefa 9: documentação conceitual preliminar.

Deve ser sequencial:

- Tarefa 3 depende do registro de configurações.
- Tarefa 4 depende do acesso seguro às regras.
- Tarefa 5 depende das funções puras atualizadas.
- Tarefa 6 pode avançar após as regras existirem, mas integração depende da tarefa 5.
- Tarefa 8 depende de hook e UI conectados.
- Tarefa 10 depende de tudo.

## Critérios De Aceite

- O placar continua funcionando no modo genérico.
- Cada jogo possui configuração própria.
- Pontuação máxima impede novos incrementos quando configurada.
- Pontuação mínima continua impedindo valores negativos por padrão.
- A UI não conhece detalhes internos das regras.
- `npm run typecheck` passa.
- `npm run build` passa.

## Riscos E Decisões Pendentes

- Avaliar se a pontuação máxima real do truco deve ser fechada nesta versão.
- FIFA permanece sem limite máximo por enquanto.
- Decidir se a troca de tipo de jogo deve resetar o placar.
