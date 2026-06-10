# Fase 5: Torneios

## Objetivo

Adicionar uma camada de torneios acima das partidas, começando por criação de torneio, participantes, chaveamento eliminatório e avanço de vencedores.

## Escopo Incluído

- Criar torneio.
- Adicionar participantes.
- Gerar chaveamento eliminatório simples.
- Registrar resultados por confronto.
- Avançar vencedores.
- Finalizar torneio com campeão.

## Fora De Escopo

- Todos contra todos.
- Dupla eliminação.
- Inscrição online.
- Backend.
- Ranking global.

## Dependências

- Fase 4 concluída.
- Partidas finalizadas com vencedor definido.
- Histórico capaz de armazenar resultados.

## Entregáveis

- Módulo `src/features/tournaments`.
- Tipo `Tournament`.
- Tipo de confronto ou bracket match.
- Gerador puro de chaveamento eliminatório.
- UI básica de torneio.
- Integração entre confronto e placar reutilizável.

## Tarefas Pequenas Detalhadas

### 1. Preparar estrutura da feature de torneios

**Objetivo:** criar a base organizacional do módulo `tournaments`.

**Arquivos previstos:**

- `src/features/tournaments/types.ts`
- `src/features/tournaments/utils/bracket.ts`
- `src/features/tournaments/hooks/useTournament.ts`
- `src/features/tournaments/components/...`

**Pré-requisitos:**

- Fase 4 concluída.
- Partidas finalizadas possuem vencedor ou resultado explícito.
- Histórico armazena resultados.

**Passos:**

- Criar diretório `src/features/tournaments`.
- Criar subpastas `components`, `hooks` e `utils`.
- Manter torneios como camada acima de partidas.

**Critério de pronto:**

- Estrutura inicial existe.
- O placar não depende do módulo de torneios.

**Paralelismo:** bloqueia as demais tarefas da feature.

### 2. Consolidar tipos de torneio e confronto

**Objetivo:** definir os contratos centrais para torneio e confrontos do chaveamento.

**Arquivos previstos:**

- `src/features/tournaments/types.ts`

**Depende de:** tarefa 1.

**Passos:**

- Definir tipo `Tournament`.
- Definir tipo para confronto de torneio.
- Representar participantes, formato, status, fases e associação opcional com partida.

**Critério de pronto:**

- Torneio e confronto podem ser usados por funções puras e UI.
- O contrato não assume backend ou ranking global.

**Paralelismo:** desbloqueia validação, geração de chaveamento e UI mockada.

### 3. Criar validação de participantes

**Objetivo:** garantir entradas mínimas para criar torneios válidos.

**Arquivos previstos:**

- `src/features/tournaments/utils/participants.ts`

**Depende de:** tarefa 2.

**Passos:**

- Criar função para validar quantidade mínima de participantes.
- Definir mensagem ou resultado de erro para lista insuficiente.
- Preparar decisão sobre número ímpar sem implementar formato avançado.

**Critério de pronto:**

- Torneio não é criado com participantes insuficientes.

**Paralelismo:** pode rodar em paralelo com geração de chaveamento.

### 4. Criar gerador de chaveamento eliminatório

**Objetivo:** montar confrontos iniciais para eliminatória simples.

**Arquivos previstos:**

- `src/features/tournaments/utils/bracket.ts`

**Depende de:** tarefas 2 e 3.

**Passos:**

- Criar função para gerar chaveamento eliminatório.
- Distribuir participantes em confrontos iniciais.
- Representar vagas futuras sem exigir partida criada imediatamente.
- Tratar ou explicitar byes quando houver número ímpar.

**Critério de pronto:**

- Sistema gera confrontos iniciais previsíveis a partir dos participantes.

**Paralelismo:** sequencial após tipos e validação.

### 5. Criar avanço de vencedores

**Objetivo:** atualizar o chaveamento conforme resultados são registrados.

**Arquivos previstos:**

- `src/features/tournaments/utils/advanceWinner.ts`

**Depende de:** tarefa 4.

**Passos:**

- Criar função para registrar vencedor de confronto.
- Criar função para avançar vencedor para próxima fase.
- Impedir avanço quando o confronto ainda não tiver vencedor.

**Critério de pronto:**

- Vencedores avançam sem mutar dados de forma imprevisível.

**Paralelismo:** sequencial após chaveamento.

### 6. Criar detecção de campeão

**Objetivo:** identificar quando o torneio terminou.

**Arquivos previstos:**

- `src/features/tournaments/utils/tournamentResult.ts`

**Depende de:** tarefa 5.

**Passos:**

- Criar função para detectar campeão.
- Atualizar status do torneio quando a final terminar.
- Garantir retorno claro quando ainda não houver campeão.

**Critério de pronto:**

- Torneio identifica campeão apenas quando todos os confrontos necessários terminam.

**Paralelismo:** sequencial após avanço de vencedores.

### 7. Criar UI de criação de torneio

**Objetivo:** permitir criar torneio com nome e formato inicial.

**Arquivos previstos:**

- `src/features/tournaments/components/TournamentForm.tsx`

**Depende de:** tarefa 2 para tipos; pode começar com estado mockado.

**Passos:**

- Criar campo de nome do torneio.
- Fixar formato inicial como eliminatória simples.
- Expor ação para criar torneio em rascunho.

**Critério de pronto:**

- Usuário consegue iniciar cadastro de torneio.

**Paralelismo:** pode rodar em paralelo com funções puras.

### 8. Criar UI de cadastro de participantes

**Objetivo:** permitir montar a lista de participantes do torneio.

**Arquivos previstos:**

- `src/features/tournaments/components/TournamentParticipants.tsx`

**Depende de:** tarefas 2 e 3.

**Passos:**

- Adicionar participante por nome.
- Listar participantes adicionados.
- Impedir geração de chaveamento quando a lista for insuficiente.

**Critério de pronto:**

- Usuário consegue montar lista válida para torneio.

**Paralelismo:** pode rodar em paralelo com UI de chaveamento mockada.

### 9. Criar UI de visualização de chaveamento

**Objetivo:** mostrar confrontos e fases do torneio.

**Arquivos previstos:**

- `src/features/tournaments/components/BracketView.tsx`
- `src/features/tournaments/components/BracketMatchCard.tsx`

**Depende de:** tarefa 2 para tipos; integração real depende da tarefa 4.

**Passos:**

- Renderizar confrontos por fase.
- Indicar confrontos pendentes, em andamento e concluídos.
- Manter leitura confortável em mobile.

**Critério de pronto:**

- Chaveamento pode ser visualizado com dados gerados.

**Paralelismo:** UI pode começar com dados mockados.

### 10. Integrar confronto com fluxo de partida

**Objetivo:** usar o placar e partidas existentes para registrar resultados de confrontos.

**Arquivos previstos:**

- `src/features/tournaments/hooks/useTournament.ts`
- `src/features/tournaments/components/BracketMatchCard.tsx`
- `src/features/matches/hooks/useCurrentMatch.ts`

**Depende de:** tarefas 5, 6 e Fase 4 estável.

**Passos:**

- Criar partida a partir de confronto selecionado.
- Registrar resultado da partida no confronto.
- Avançar vencedor no chaveamento.

**Critério de pronto:**

- Cada confronto pode ser resolvido usando o fluxo de partida existente.

**Paralelismo:** sequencial após domínio de torneio e partidas.

### 11. Persistir estado do torneio localmente

**Objetivo:** manter torneio e chaveamento entre recarregamentos.

**Arquivos previstos:**

- `src/features/tournaments/persistence/tournamentStorage.ts`
- `src/lib/storage/keys.ts`, se as chaves forem centralizadas.

**Depende de:** tarefas 2, 4, 5 e contrato de armazenamento da Fase 3.

**Passos:**

- Criar chave versionada para torneio atual.
- Salvar criação, participantes, confrontos e avanços.
- Carregar torneio salvo com leitura segura.

**Critério de pronto:**

- Recarregar a página mantém torneio em andamento.

**Paralelismo:** pode avançar após o formato final do estado estar definido.

### 12. Integrar tela básica de torneio

**Objetivo:** compor criação, participantes, chaveamento e confronto em uma experiência única.

**Arquivos previstos:**

- `src/features/tournaments/components/TournamentView.tsx`
- `src/app/App.tsx`, se ainda não houver navegação.

**Depende de:** tarefas 7, 8, 9, 10 e 11.

**Passos:**

- Conectar formulário, participantes e chaveamento.
- Exibir estado do torneio atual.
- Mostrar campeão ao final.

**Critério de pronto:**

- Usuário consegue criar torneio, gerar confrontos, registrar resultados e ver campeão.

**Paralelismo:** sequencial após peças principais.

### 13. Verificar a fase

**Objetivo:** confirmar que a Fase 5 está pronta.

**Arquivos previstos:**

- Sem arquivos novos obrigatórios.

**Depende de:** todas as tarefas anteriores.

**Passos:**

- Rodar `npm run typecheck`.
- Rodar `npm run build`.
- Conferir manualmente criação, participantes, chaveamento, avanço, campeão e persistência.

**Critério de pronto:**

- Typecheck passa.
- Build passa.
- Critérios de aceite da Fase 5 foram conferidos.

**Paralelismo:** não pode ser paralelo; é validação final.

## Execução Paralela

Pode ser paralelo depois da tarefa 2:

- Tarefa 3: validação de participantes.
- Tarefa 7: UI de criação de torneio.
- Tarefa 8: UI de cadastro de participantes.
- Tarefa 9: UI de chaveamento com dados mockados.

Deve ser sequencial:

- Tarefa 4 depende de tipos e validação.
- Tarefa 5 depende do chaveamento.
- Tarefa 6 depende do avanço de vencedores.
- Tarefa 10 depende do domínio de torneio e do fluxo de partidas.
- Tarefa 11 depende do formato final do estado.
- Tarefa 12 depende das peças integradas.
- Tarefa 13 depende de tudo.

## Critérios De Aceite

- Usuário consegue criar torneio com participantes.
- Sistema gera confrontos eliminatórios.
- Cada confronto pode receber resultado.
- Vencedores avançam corretamente.
- Torneio identifica campeão.
- Placar continua reutilizável e não conhece detalhes internos do torneio.
- `npm run typecheck` passa.
- `npm run build` passa.

## Riscos E Decisões Pendentes

- Definir como lidar com número ímpar de participantes.
- Definir se participantes podem ser editados depois do início.
- Definir como representar fases do chaveamento na UI mobile.
