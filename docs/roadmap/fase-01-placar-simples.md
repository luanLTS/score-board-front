# Fase 1: Placar Simples

## Objetivo

Entregar a primeira versão utilizável do Score Board: um placar responsivo para dois participantes, com nomes editáveis, controle de pontos, bloqueio de pontuação negativa e ação de reset.

## Escopo Incluído

- Placar com exatamente dois participantes.
- Nomes editáveis.
- Pontuação inicial igual a `0`.
- Adicionar ponto.
- Remover ponto.
- Impedir pontuação negativa.
- Resetar pontuações sem apagar nomes.
- Layout mobile-first.
- Lógica de pontuação isolada da UI.

## Fora De Escopo

- Persistência em `localStorage`.
- Histórico de partidas.
- Tipo de jogo selecionável.
- Regras específicas de truco ou FIFA.
- Torneios.

## Dependências

- Projeto React, TypeScript, Vite e TailwindCSS configurado.
- Estrutura base em `src/app` e `src/styles`.

## Entregáveis

- Componentes de placar em `src/features/scoreboard/components`.
- Hook `useScoreboard` em `src/features/scoreboard/hooks`.
- Tipos do domínio em `src/features/scoreboard/types`.
- Utilitários puros de pontuação em `src/features/scoreboard/utils`.
- Tela principal usando o módulo de placar.

## Tarefas Pequenas Detalhadas

### 1. Preparar estrutura da feature de placar

**Objetivo:** criar a base organizacional do módulo `scoreboard`.

**Arquivos previstos:**

- `src/features/scoreboard/types.ts`
- `src/features/scoreboard/constants.ts`
- `src/features/scoreboard/utils/score.ts`
- `src/features/scoreboard/hooks/useScoreboard.ts`
- `src/features/scoreboard/components/...`

**Pré-requisitos:**

- Projeto React configurado.
- `src/app` e `src/styles` existentes.

**Passos:**

- Criar diretório `src/features/scoreboard`.
- Criar subpastas `components`, `hooks` e `utils`.
- Evitar criar arquivos sem uso imediato.

**Critério de pronto:**

- Estrutura inicial existe.
- Não há abstrações futuras fora do escopo da Fase 1.

**Paralelismo:** bloqueia as demais tarefas da feature.

### 2. Definir tipos do domínio

**Objetivo:** representar os participantes e o estado do placar.

**Arquivos previstos:**

- `src/features/scoreboard/types.ts`

**Depende de:** tarefa 1.

**Passos:**

- Definir `ScoreboardPlayer`.
- Definir `ScoreboardState`.
- Garantir que o estado represente exatamente dois participantes.

**Critério de pronto:**

- Tipos expressam o domínio inicial sem incluir partidas, histórico ou torneios.

**Paralelismo:** pode rodar antes da UI e desbloqueia hook e utils.

### 3. Criar funções puras de pontuação

**Objetivo:** isolar regras de adicionar, remover e resetar pontos.

**Arquivos previstos:**

- `src/features/scoreboard/utils/score.ts`

**Depende de:** tarefas 1 e 2.

**Passos:**

- Criar função para adicionar ponto.
- Criar função para remover ponto respeitando mínimo `0`.
- Criar função para resetar pontuações mantendo nomes.

**Critério de pronto:**

- Regras funcionam sem depender de React.
- Pontuação negativa é impedida por padrão.

**Paralelismo:** pode rodar em paralelo com componentes visuais pequenos.

### 4. Criar hook `useScoreboard`

**Objetivo:** concentrar estado e ações do placar.

**Arquivos previstos:**

- `src/features/scoreboard/hooks/useScoreboard.ts`

**Depende de:** tarefas 2 e 3.

**Passos:**

- Inicializar dois participantes com score `0`.
- Expor ações para editar nome, adicionar ponto, remover ponto e resetar.
- Usar as funções puras de pontuação.

**Critério de pronto:**

- UI consegue consumir estado e ações sem conhecer regras internas.

**Paralelismo:** deve ser sequencial após tipos e utils.

### 5. Criar componentes visuais básicos

**Objetivo:** criar peças pequenas e reutilizáveis da interface.

**Arquivos previstos:**

- `src/features/scoreboard/components/PlayerNameInput.tsx`
- `src/features/scoreboard/components/ScoreValue.tsx`
- `src/features/scoreboard/components/ScoreControls.tsx`
- `src/features/scoreboard/components/ScoreboardActions.tsx`

**Depende de:** tarefa 1.

**Passos:**

- Criar input de nome controlado.
- Criar exibição de pontuação.
- Criar botões de `+` e `-`.
- Criar ação geral de reset.

**Critério de pronto:**

- Componentes recebem dados e callbacks por props.
- Nenhum componente visual contém regra de pontuação.

**Paralelismo:** pode rodar em paralelo com tarefas 2 e 3.

### 6. Compor `ScorePanel` e `Scoreboard`

**Objetivo:** montar a experiência completa do placar com dois lados.

**Arquivos previstos:**

- `src/features/scoreboard/components/ScorePanel.tsx`
- `src/features/scoreboard/components/Scoreboard.tsx`

**Depende de:** tarefas 4 e 5.

**Passos:**

- Criar painel para um participante.
- Renderizar dois painéis no placar.
- Conectar ações vindas do hook aos componentes.

**Critério de pronto:**

- Os dois participantes podem ser controlados independentemente.
- Reset afeta as pontuações sem apagar nomes.

**Paralelismo:** sequencial após hook e componentes básicos.

### 7. Integrar no `App`

**Objetivo:** substituir o preview estático pelo placar real.

**Arquivos previstos:**

- `src/app/App.tsx`

**Depende de:** tarefa 6.

**Passos:**

- Remover dados estáticos do preview.
- Renderizar o componente `Scoreboard`.
- Manter a tela principal simples e mobile-first.

**Critério de pronto:**

- A aplicação abre direto no placar funcional.

**Paralelismo:** sequencial.

### 8. Ajustar responsividade e estados visuais

**Objetivo:** garantir boa usabilidade em celular e desktop.

**Arquivos previstos:**

- Componentes da feature `scoreboard`.
- `src/app/App.tsx`, se necessário.

**Depende de:** tarefas 5, 6 e 7.

**Passos:**

- Ajustar espaçamentos e tamanhos para toque.
- Garantir leitura clara da pontuação.
- Garantir que nomes longos não quebrem a tela.
- Indicar visualmente quando remover ponto não é possível.

**Critério de pronto:**

- Interface funciona bem em viewport mobile.
- Layout continua confortável em desktop.

**Paralelismo:** pode iniciar com UI mockada, mas validação final depende da integração.

### 9. Verificar a fase

**Objetivo:** confirmar que a Fase 1 está pronta.

**Arquivos previstos:**

- Sem arquivos novos obrigatórios.

**Depende de:** todas as tarefas anteriores.

**Passos:**

- Rodar `npm run typecheck`.
- Rodar `npm run build`.
- Conferir manualmente edição de nomes, `+`, `-`, bloqueio em `0` e reset.

**Critério de pronto:**

- Typecheck passa.
- Build passa.
- Critérios de aceite da Fase 1 foram conferidos.

**Paralelismo:** não pode ser paralelo; é validação final.

## Execução Paralela

Pode ser paralelo depois da tarefa 1:

- Tarefa 2: tipos do domínio.
- Tarefa 3: funções puras, depois que os tipos existirem.
- Tarefa 5: componentes visuais básicos.

Deve ser sequencial:

- Tarefa 4 depende de tipos e funções puras.
- Tarefa 6 depende do hook e dos componentes básicos.
- Tarefa 7 depende do placar composto.
- Tarefa 8 depende da UI integrada para validação final.
- Tarefa 9 depende de tudo.

## Critérios De Aceite

- Usuário consegue editar os dois nomes.
- Botão `+` aumenta a pontuação correta.
- Botão `-` diminui a pontuação correta.
- Pontuação nunca fica menor que `0`.
- Reset zera pontuações e mantém nomes.
- Interface funciona bem em telas pequenas.
- `npm run typecheck` passa.
- `npm run build` passa.

## Riscos E Decisões Pendentes

- Decidir se os botões devem ter ícones já nesta fase ou apenas texto.
- Decidir se a pontuação pode ter limite visual para valores muito grandes.
- Decidir se nomes vazios devem ser permitidos ou substituídos por fallback.
