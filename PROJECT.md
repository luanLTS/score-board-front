# Score Board

Aplicação web para marcar placares de jogos entre dois jogadores ou equipes, começando por um placar simples e reutilizável. O projeto deve nascer enxuto, mas com base técnica suficiente para evoluir para partidas, histórico, regras por jogo, torneios e chaveamentos.

## Visão Geral

O Score Board é uma aplicação React para controlar placares de confrontos rápidos. A primeira versão deve resolver bem o caso mais comum: dois participantes, nomes editáveis e botões para adicionar ou remover pontos.

O mesmo placar deve servir para contextos diferentes, como truco, FIFA, campeonatos entre amigos e confrontos eliminatórios. A ideia central é separar o componente visual do placar das regras específicas de cada jogo, permitindo evolução gradual sem reescrever a base.

## Objetivo

Criar uma experiência simples, rápida e responsiva para registrar pontuações durante partidas informais ou organizadas.

Objetivos técnicos:

- Construir uma base em React, TypeScript, Vite e TailwindCSS.
- Manter a lógica de pontuação isolada e testável.
- Permitir evolução para múltiplos tipos de jogo.
- Preparar o domínio para partidas, histórico e torneios.
- Evitar arquitetura pesada antes da necessidade real.

## Problema Que Resolve

Em jogos presenciais ou entre amigos, placares costumam ser marcados de forma improvisada: papel, notas no celular, memória ou aplicativos específicos demais. Isso dificulta acompanhar pontuações, repetir confrontos, organizar campeonatos e consultar resultados depois.

O Score Board resolve esse problema oferecendo um placar genérico, fácil de usar e adaptável a diferentes jogos.

## Público Alvo

- Pessoas que jogam truco, FIFA ou outros jogos entre amigos.
- Grupos que organizam campeonatos informais.
- Usuários que precisam de um placar rápido no celular.
- Jogadores que querem registrar confrontos e resultados.
- Organizadores de torneios pequenos.

## Funcionalidades Atuais

Funcionalidades planejadas para a primeira versão:

- Placar para 2 jogadores ou equipes.
- Nome editável para cada participante.
- Pontuação inicial igual a `0`.
- Botão para adicionar ponto.
- Botão para remover ponto.
- Bloqueio de pontuação negativa por padrão.
- Ação para resetar pontuações.
- Layout responsivo mobile-first.

## Funcionalidades Futuras

Possíveis evoluções:

- Seleção de tipo de jogo.
- Regras de pontuação específicas por jogo.
- Pontuação máxima configurável.
- Histórico de partidas.
- Gerenciamento de partidas.
- Persistência local.
- Persistência em backend.
- Criação de torneios.
- Chaveamento eliminatório.
- Tabela de classificação.
- Melhor de 3, melhor de 5 ou séries customizadas.
- Compartilhamento de placar.
- Exportação de resultados.

## Stack Utilizada

- React.
- TypeScript.
- Vite.
- TailwindCSS.

Possíveis bibliotecas futuras:

- Biblioteca de testes para componentes e hooks.
- Biblioteca de ícones para ações comuns.
- Biblioteca de estado apenas se o estado local deixar de ser suficiente.
- Biblioteca de persistência ou cliente HTTP quando houver backend.

## Arquitetura Prevista

A arquitetura deve ser orientada por features, começando pela feature de placar.

```txt
src/
  app/
  components/
    ui/
    layout/
  features/
    scoreboard/
      components/
      hooks/
      types/
      utils/
      constants.ts
    matches/
    tournaments/
  hooks/
  lib/
  styles/
  types/
```

Responsabilidades:

- `app`: composição principal da aplicação.
- `components/ui`: componentes visuais reutilizáveis.
- `features/scoreboard`: domínio e UI do placar.
- `features/matches`: gerenciamento futuro de partidas.
- `features/tournaments`: torneios e chaveamentos futuros.
- `hooks`: hooks genéricos.
- `lib`: utilitários independentes de React.
- `types`: contratos compartilhados.

## Estrutura De Módulos

### Scoreboard

Módulo inicial e principal.

Responsável por:

- Exibir dois participantes.
- Controlar pontuação.
- Editar nomes.
- Resetar placar.
- Aplicar regras simples de pontuação.

### Matches

Módulo futuro para representar uma partida.

Responsável por:

- Associar um placar a um jogo.
- Controlar status da partida.
- Registrar vencedor.
- Definir data, participantes e resultado final.

### Game Rules

Módulo de regras específicas por jogo, iniciado na Fase 2.

Responsável por:

- Definir pontuação mínima e pontuação máxima opcional.
- Definir se pontuação negativa é permitida.
- Validar ações de pontuação.
- Evoluir futuramente para incrementos específicos e cálculo de vitória.

### History

Módulo futuro para armazenar partidas finalizadas.

Responsável por:

- Listar partidas anteriores.
- Filtrar por jogo ou participante.
- Reabrir detalhes de um confronto.
- Servir como base para estatísticas.

### Tournaments

Módulo futuro para campeonatos.

Responsável por:

- Criar torneios.
- Gerenciar participantes.
- Gerar chaveamentos.
- Avançar vencedores.
- Consolidar resultados.

## Fluxo Da Aplicação

Fluxo inicial:

1. Usuário abre a aplicação.
2. O placar exibe dois participantes padrão.
3. Usuário edita os nomes.
4. Usuário adiciona ou remove pontos durante o jogo.
5. Usuário pode resetar o placar para iniciar novo confronto.

Fluxo futuro com partidas:

1. Usuário cria uma partida.
2. Seleciona ou informa participantes.
3. Escolhe tipo de jogo.
4. A aplicação carrega regras compatíveis.
5. Usuário controla o placar.
6. Partida é finalizada.
7. Resultado é salvo no histórico.

Fluxo futuro com torneios:

1. Usuário cria torneio.
2. Adiciona participantes.
3. Escolhe formato.
4. Sistema gera confrontos.
5. Cada confronto usa o placar reutilizável.
6. Vencedores avançam conforme regra do torneio.
7. Torneio é finalizado com campeão e histórico.

## Entidades Principais

### Player

Representa um jogador ou equipe.

```ts
export type Player = {
  id: string;
  name: string;
};
```

### ScoreboardPlayer

Representa participante dentro de um placar.

```ts
export type ScoreboardPlayer = {
  id: string;
  name: string;
  score: number;
};
```

### ScoreboardState

Representa o estado atual do placar.

```ts
export type ScoreboardState = {
  players: [ScoreboardPlayer, ScoreboardPlayer];
};
```

### GameKind

Representa o tipo de jogo.

```ts
export type GameKind = "generic" | "truco" | "fifa";
```

### ScoreboardConfig

Representa configurações de pontuação.

```ts
export type ScoreboardConfig = {
  gameKind: GameKind;
  minScore: number;
  maxScore?: number;
  allowNegativeScore: boolean;
};
```

### Match

Representa uma partida futura.

```ts
export type Match = {
  id: string;
  gameKind: GameKind;
  players: [Player, Player];
  scores: [number, number];
  status: "pending" | "in_progress" | "finished";
  winnerId?: string;
  createdAt: string;
  finishedAt?: string;
};
```

### Tournament

Representa um torneio futuro.

```ts
export type Tournament = {
  id: string;
  name: string;
  format: "single_elimination" | "round_robin";
  participants: Player[];
  matchIds: string[];
  status: "draft" | "in_progress" | "finished";
};
```

## Regras De Negócio

Regras iniciais:

- O placar deve ter exatamente dois lados.
- Cada lado deve ter nome editável.
- Pontuação inicial deve ser `0`.
- Adicionar ponto aumenta a pontuação do lado selecionado.
- Remover ponto diminui a pontuação do lado selecionado.
- Pontuação não deve ser menor que `0` por padrão.
- Resetar placar deve zerar pontuações sem apagar nomes, salvo decisão explícita de UX.

Regras configuráveis:

- Cada jogo pode ter uma configuração própria.
- Os jogos conhecidos inicialmente são `generic`, `truco` e `fifa`.
- Toda configuração define `minScore` e `allowNegativeScore`.
- `maxScore` é opcional; quando ausente, o jogo não tem limite superior.
- O modo genérico mantém pontuação mínima `0` e não permite negativos por padrão.
- FIFA permanece sem limite máximo por enquanto.

Regras futuras:

- Uma partida pode ter status.
- Uma partida finalizada deve preservar resultado.
- Um torneio deve avançar vencedores com base no resultado da partida.
- Histórico não deve ser alterado sem ação explícita do usuário.

## Estratégia De Componentização

A primeira versão deve separar visual, estado e regra.

```txt
ScoreboardPage
  Scoreboard
    ScorePanel
      PlayerNameInput
      ScoreValue
      ScoreControls
    ScoreboardActions
```

Responsabilidades:

- `ScoreboardPage`: tela principal e composição.
- `Scoreboard`: organiza os dois lados do placar.
- `ScorePanel`: exibe nome, pontuação e controles de um participante.
- `PlayerNameInput`: edição de nome.
- `ScoreValue`: exibição da pontuação.
- `ScoreControls`: ações de adicionar e remover ponto.
- `ScoreboardActions`: ações gerais, como reset.

Hooks:

- `useScoreboard`: estado e ações principais do placar.
- `usePersistentScoreboard`: persistência futura.
- `useGameRules`: regras futuras por tipo de jogo.

## Estratégia De Persistência

Fase 1:

- Estado local em memória.
- Sem persistência obrigatória.

Fase 2:

- Sem persistência obrigatória.
- Regras configuráveis em memória para `generic`, `truco` e `fifa`.

Fase 3:

- Histórico local de partidas.
- Separação entre placar atual e partidas finalizadas.
- Persistência local do placar atual, se fizer sentido para a experiência.

Fase 4:

- Backend ou banco.
- Sincronização de partidas, torneios e usuários.

Contrato sugerido:

```ts
export type StorageAdapter<T> = {
  load: () => T | null;
  save: (value: T) => void;
  clear: () => void;
};
```

## Estratégia De Torneios E Chaveamentos

Torneios devem ser tratados como camada acima de partidas.

O placar não deve conhecer torneios diretamente. Um torneio cria ou referencia partidas; cada partida usa o placar para registrar seu resultado.

Modelo conceitual:

```txt
Tournament
  -> Match[]
    -> ScoreboardState
```

Primeiros formatos recomendados:

- Eliminatória simples.
- Todos contra todos.

Regras para evolução:

- Implementar um formato por vez.
- Manter geração de confrontos em função pura.
- Salvar resultados por partida.
- Calcular avanço de fase fora do componente visual.
- Não misturar renderização de chaveamento com regra de avanço.

## Estratégia De Reutilização Do Placar

O placar deve ser um módulo reutilizável.

Ele deve receber:

- Participantes.
- Pontuações.
- Configuração de jogo.
- Ações de alteração.

Ele não deve depender diretamente de:

- Histórico.
- Torneio.
- Backend.
- Rota específica.
- Persistência.

Com isso, o mesmo placar poderá ser usado em:

- Jogo avulso.
- Partida de torneio.
- Reedição de partida.
- Tela de histórico.
- Confronto eliminatório.

## Estratégia Mobile-First

A experiência principal deve ser pensada primeiro para celular.

Diretrizes:

- Pontuação grande e legível.
- Botões grandes para toque.
- Ações principais visíveis sem rolagem excessiva.
- Nomes editáveis sem quebrar layout.
- Interface utilizável em modo retrato.
- Layout adaptável para telas maiores.

Prioridade da tela:

1. Nome dos participantes.
2. Placar.
3. Botões de pontuação.
4. Ações secundárias.

## Possíveis Evoluções

Evoluções de produto:

- Tema claro e escuro.
- Compartilhar resultado.
- Estatísticas por jogador.
- Ranking entre amigos.
- Templates de jogos.
- Acompanhamento remoto em TV, projetor ou outro dispositivo, mediante backend e sincronização em tempo real.
- QR Code para acessar o acompanhamento remoto do placar.

Evoluções técnicas:

- Testes automatizados.
- Persistência local versionada.
- Backend com autenticação.
- Sincronização em tempo real.
- PWA para uso offline.
- Camada de analytics.

## Roadmap

Detalhamento por fase: [docs/roadmap/README.md](docs/roadmap/README.md).

### Fase 1: Placar Simples

- Criar projeto React com TypeScript, Vite e TailwindCSS.
- Criar placar para 2 participantes.
- Permitir editar nomes.
- Permitir adicionar e remover pontos.
- Impedir pontuação negativa.
- Criar ação de reset.
- Garantir responsividade.

### Fase 2: Regras Configuráveis

- Adicionar configuração de tipo de jogo.
- Criar regras para `generic`, `truco` e `fifa`.
- Suportar pontuação mínima e pontuação negativa configurável.
- Suportar pontuação máxima opcional.
- Manter FIFA sem limite máximo por enquanto.

### Fase 3: Persistência E Histórico

- Persistir placar atual.
- Salvar partidas finalizadas.
- Listar histórico.
- Reabrir detalhes de partida.

### Fase 4: Gerenciamento De Partidas

- Criar partidas com status.
- Definir vencedor.
- Separar placar atual de partida finalizada.
- Adicionar fluxo de nova partida.

### Fase 5: Torneios

- Criar torneio.
- Adicionar participantes.
- Gerar chaveamento eliminatório.
- Registrar resultados por confronto.
- Avançar vencedores.

### Fase 6: Experiência Avançada

- Ranking.
- Estatísticas.
- Compartilhamento.
- PWA.

## Critérios De Sucesso

O projeto será considerado bem estruturado se:

- A primeira versão for simples de usar.
- A lógica de pontuação estiver isolada da UI.
- O placar puder ser reutilizado em partidas e torneios.
- O código não depender de abstrações prematuras.
- A experiência mobile for confortável.
- Novas regras de jogo puderem ser adicionadas sem reescrever componentes principais.
- A documentação continuar alinhada ao comportamento real da aplicação.
