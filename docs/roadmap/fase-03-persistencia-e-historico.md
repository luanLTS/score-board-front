# Fase 3: Persistência E Histórico

## Objetivo

Permitir que o placar atual sobreviva ao recarregamento da página e iniciar o histórico de partidas finalizadas.

## Escopo Incluído

- Persistência local do placar atual.
- Adaptador isolado para `localStorage`.
- Salvar partidas finalizadas.
- Listar histórico básico.
- Reabrir detalhes de uma partida finalizada.

## Fora De Escopo

- Backend.
- Autenticação.
- Sincronização entre dispositivos.
- Edição avançada de histórico.
- Torneios.

## Dependências

- Fase 1 concluída.
- Fase 2 concluída ou com contrato mínimo de `GameKind` definido.
- Modelo inicial de `Match`.

## Entregáveis

- `StorageAdapter<T>`.
- Hook `usePersistentScoreboard`.
- Tipos e utilitários iniciais de histórico.
- Lista básica de partidas finalizadas.
- Tela ou seção de detalhes da partida.

## Tarefas Pequenas Detalhadas

### 1. Definir contrato de armazenamento local

**Objetivo:** padronizar como dados são salvos, carregados e limpos.

**Arquivos previstos:**

- `src/lib/storage/types.ts`
- `src/lib/storage/index.ts`, se houver exportação central.

**Pré-requisitos:**

- Fase 1 concluída.
- Contrato mínimo de `GameKind` definido pela Fase 2 ou por compatibilidade temporária.

**Passos:**

- Criar contrato `StorageAdapter<T>`.
- Definir retorno seguro para leitura vazia ou inválida.
- Manter o contrato independente de placar e histórico.

**Critério de pronto:**

- O contrato pode ser reutilizado por placar atual, histórico e torneios futuros.

**Paralelismo:** bloqueia adaptadores e hooks persistentes.

### 2. Criar adaptador para `localStorage`

**Objetivo:** encapsular acesso direto ao armazenamento do navegador.

**Arquivos previstos:**

- `src/lib/storage/localStorageAdapter.ts`

**Depende de:** tarefa 1.

**Passos:**

- Implementar `load`, `save` e `clear`.
- Tratar JSON inválido sem quebrar a aplicação.
- Tratar ambiente sem `localStorage` disponível.

**Critério de pronto:**

- Falha de leitura retorna estado seguro.
- Componentes e hooks não acessam `localStorage` diretamente.

**Paralelismo:** pode rodar em paralelo com modelagem de `Match`.

### 3. Definir chaves versionadas de persistência

**Objetivo:** evitar colisões e preparar migração futura de dados salvos.

**Arquivos previstos:**

- `src/lib/storage/keys.ts`
- `src/features/scoreboard/persistence/keys.ts`, se as chaves ficarem por feature.

**Depende de:** tarefa 1.

**Passos:**

- Criar chave versionada para o placar atual.
- Criar chave versionada para partidas finalizadas.
- Documentar o padrão de versão no nome da chave.

**Critério de pronto:**

- Chaves são explícitas e não ficam espalhadas pelo código.

**Paralelismo:** pode rodar em paralelo com adaptador e tipos de histórico.

### 4. Criar serialização segura do placar atual

**Objetivo:** proteger o app contra dados antigos, vazios ou corrompidos.

**Arquivos previstos:**

- `src/features/scoreboard/persistence/scoreboardStorage.ts`
- `src/features/scoreboard/persistence/parseScoreboardState.ts`

**Depende de:** tarefas 1, 2 e 3.

**Passos:**

- Criar função para salvar o placar atual.
- Criar função para carregar e validar o placar atual.
- Retornar `null` ou estado padrão quando os dados não forem válidos.

**Critério de pronto:**

- Recarregar dados inválidos não quebra a aplicação.
- O formato salvo permanece isolado do componente visual.

**Paralelismo:** sequencial após adaptador e chaves.

### 5. Criar hook `usePersistentScoreboard`

**Objetivo:** conectar o placar atual à persistência local.

**Arquivos previstos:**

- `src/features/scoreboard/hooks/usePersistentScoreboard.ts`

**Depende de:** tarefa 4.

**Passos:**

- Carregar estado inicial salvo quando existir.
- Salvar alterações relevantes do placar.
- Expor ação para limpar placar atual sem apagar histórico.

**Critério de pronto:**

- O placar sobrevive ao recarregamento da página.
- Limpar placar atual não remove partidas finalizadas.

**Paralelismo:** sequencial após serialização segura.

### 6. Integrar persistência ao placar atual

**Objetivo:** substituir o estado puramente em memória pelo estado persistido.

**Arquivos previstos:**

- `src/features/scoreboard/components/Scoreboard.tsx`
- `src/app/App.tsx`, se a integração estiver no nível da tela.

**Depende de:** tarefa 5.

**Passos:**

- Usar `usePersistentScoreboard` no ponto de composição do placar.
- Manter comportamento de adicionar, remover, editar nome e resetar.
- Confirmar que o reset preserva nomes conforme definido na Fase 1.

**Critério de pronto:**

- Recarregar a página mantém placar e nomes.

**Paralelismo:** sequencial.

### 7. Definir modelo inicial de partida finalizada

**Objetivo:** representar resultados salvos no histórico.

**Arquivos previstos:**

- `src/features/matches/types.ts`
- `src/features/history/types.ts`, se histórico ficar separado de partidas.

**Depende de:** contratos de placar da Fase 1 e `GameKind` da Fase 2.

**Passos:**

- Definir tipo `Match`.
- Incluir participantes, pontuações, tipo de jogo, status e datas.
- Manter vencedor opcional, se a Fase 4 ainda for responsável por consolidar vencedor.

**Critério de pronto:**

- Histórico consegue representar uma partida finalizada sem depender de torneios.

**Paralelismo:** pode rodar em paralelo com tarefas 2 a 4.

### 8. Criar finalização básica a partir do placar atual

**Objetivo:** transformar o estado atual em um registro de histórico.

**Arquivos previstos:**

- `src/features/history/utils/createFinishedMatch.ts`
- `src/features/matches/utils/createFinishedMatch.ts`, se ficar no módulo de partidas.

**Depende de:** tarefas 6 e 7.

**Passos:**

- Criar função para montar uma partida finalizada.
- Gerar identificador e datas.
- Copiar nomes e pontuações sem manter referência mutável ao placar atual.

**Critério de pronto:**

- Um resultado final pode ser criado a partir do placar atual.

**Paralelismo:** sequencial após modelo de `Match` e persistência do placar.

### 9. Criar armazenamento local para histórico

**Objetivo:** salvar e carregar partidas finalizadas.

**Arquivos previstos:**

- `src/features/history/persistence/historyStorage.ts`

**Depende de:** tarefas 2, 3, 7 e 8.

**Passos:**

- Criar funções para listar partidas salvas.
- Criar função para adicionar partida finalizada.
- Criar leitura segura para lista vazia ou inválida.

**Critério de pronto:**

- Histórico persiste entre recarregamentos.
- Falha de leitura não quebra a aplicação.

**Paralelismo:** sequencial após modelo de histórico.

### 10. Criar componentes básicos de histórico

**Objetivo:** exibir partidas finalizadas em lista.

**Arquivos previstos:**

- `src/features/history/components/HistoryList.tsx`
- `src/features/history/components/HistoryItem.tsx`

**Depende de:** tarefa 7 para tipos; pode começar com dados mockados.

**Passos:**

- Criar item com participantes, placar, tipo de jogo e data.
- Criar lista com estado vazio.
- Manter o visual secundário em relação ao placar atual.

**Critério de pronto:**

- Histórico pode ser renderizado com dados reais ou mockados.

**Paralelismo:** pode rodar em paralelo com tarefas 8 e 9.

### 11. Criar visualização simples de detalhes

**Objetivo:** permitir abrir uma partida finalizada para consulta.

**Arquivos previstos:**

- `src/features/history/components/MatchDetails.tsx`

**Depende de:** tarefas 7 e 10.

**Passos:**

- Exibir participantes, placar, tipo de jogo e datas.
- Deixar claro que o registro é finalizado.
- Evitar edição avançada nesta fase.

**Critério de pronto:**

- Usuário consegue consultar detalhes de uma partida salva.

**Paralelismo:** pode avançar após componentes de lista existirem.

### 12. Integrar finalização e histórico na tela

**Objetivo:** conectar placar atual, ação de finalizar e lista de histórico.

**Arquivos previstos:**

- `src/app/App.tsx`
- `src/features/scoreboard/components/ScoreboardActions.tsx`
- `src/features/history/components/...`

**Depende de:** tarefas 8, 9, 10 e 11.

**Passos:**

- Adicionar ação para finalizar partida atual.
- Salvar a partida finalizada no histórico.
- Atualizar a lista após salvar.
- Adicionar ação para limpar placar atual sem apagar histórico.

**Critério de pronto:**

- Finalizar partida cria registro visível no histórico.
- Limpar placar atual preserva histórico.

**Paralelismo:** sequencial após armazenamento e UI de histórico.

### 13. Verificar a fase

**Objetivo:** confirmar que a Fase 3 está pronta.

**Arquivos previstos:**

- Sem arquivos novos obrigatórios.

**Depende de:** todas as tarefas anteriores.

**Passos:**

- Rodar `npm run typecheck`.
- Rodar `npm run build`.
- Conferir manualmente recarregamento, finalização, histórico, detalhes e leitura inválida.

**Critério de pronto:**

- Typecheck passa.
- Build passa.
- Critérios de aceite da Fase 3 foram conferidos.

**Paralelismo:** não pode ser paralelo; é validação final.

## Execução Paralela

Pode ser paralelo depois da tarefa 1:

- Tarefa 2: adaptador de `localStorage`.
- Tarefa 3: chaves versionadas.
- Tarefa 7: modelo inicial de `Match`.
- Tarefa 10: componentes de histórico com dados mockados, depois que o tipo estiver definido.

Deve ser sequencial:

- Tarefa 4 depende de adaptador e chaves.
- Tarefa 5 depende da serialização segura.
- Tarefa 6 depende do hook persistente.
- Tarefa 8 depende do placar persistido e do tipo `Match`.
- Tarefa 9 depende do armazenamento e do modelo de histórico.
- Tarefa 12 depende da finalização, armazenamento e UI.
- Tarefa 13 depende de tudo.

## Critérios De Aceite

- Recarregar a página mantém o placar atual.
- Finalizar uma partida salva um registro no histórico.
- Histórico mostra participantes, pontuações, tipo de jogo e data.
- Usuário consegue abrir detalhes de uma partida.
- Falhas de leitura do `localStorage` não quebram a aplicação.
- `npm run typecheck` passa.
- `npm run build` passa.

## Riscos E Decisões Pendentes

- Definir se histórico poderá ser apagado nesta fase.
- Definir formato de data exibido.
- Definir estratégia de migração caso o formato salvo mude.
