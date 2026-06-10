# Instruções de Desenvolvimento

Este documento define as regras que o Codex deve seguir ao implementar a aplicação web de placar. Ele deve ser tratado como a referência principal de engenharia para manter o projeto simples no início, mas preparado para evoluir para partidas, histórico, torneios e chaveamentos.

## Princípios Do Projeto

- Começar pelo placar simples para 2 jogadores ou equipes.
- Priorizar clareza, previsibilidade e boa experiência mobile.
- Manter a lógica de pontuação isolada da interface.
- Evitar decisões irreversíveis antes de existir necessidade real.
- Escrever código fácil de testar, ler e substituir.
- Evoluir por módulos pequenos, com contratos explícitos.
- Não implementar persistência, torneios ou regras avançadas antes de haver uma feature concreta pedindo isso.

## Stack Padrão

- React para interface.
- TypeScript para segurança de tipos.
- Vite para build e desenvolvimento.
- TailwindCSS para estilos utilitários.
- React hooks para estado local e composição.
- Testes devem ser adicionados conforme o risco da feature crescer.

## Worktrees E Dependencias

Ao criar uma worktree para executar fases ou microfases em paralelo, nao rode `npm install` dentro da worktree por padrao. Reutilize as dependencias instaladas na raiz do projeto criando um link simbolico de `node_modules` dentro da worktree antes de executar comandos Node.

Para worktrees criadas em `.worktrees/<nome-da-branch>`, use:

```powershell
New-Item -ItemType SymbolicLink -Path .worktrees/<nome-da-branch>/node_modules -Target ../../node_modules
```

Se a worktree estiver fora da raiz do projeto, use o caminho absoluto da `node_modules` da raiz como `-Target`.

Regras:

- A raiz do projeto deve ser a fonte unica de `node_modules`.
- Instale ou atualize dependencias apenas na raiz do projeto quando `package.json` ou `package-lock.json` mudarem.
- Cada nova worktree deve receber o link simbolico antes de rodar `npm.cmd test`, `npm.cmd run typecheck`, `npm.cmd run build` ou `npm.cmd run dev`.
- Se o Windows bloquear links simbolicos por permissao, pare e avise antes de usar outra estrategia.

## Estrutura De Pastas

A estrutura recomendada para a aplicação é:

```txt
src/
  app/
    App.tsx
    providers/
  components/
    ui/
    scoreboard/
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

Regras:

- `features/scoreboard` concentra a primeira versão funcional do placar.
- `components/ui` deve conter componentes genéricos e reutilizáveis, como botões, campos e controles.
- `components/scoreboard` ou `features/scoreboard/components` deve conter componentes específicos do placar.
- `lib` deve conter funções genéricas que não dependem de React.
- `types` deve conter tipos globais apenas quando usados por mais de uma feature.
- Não criar pastas vazias por antecipação.

## Arquitetura

A aplicação deve seguir uma arquitetura simples por features:

- A camada de UI renderiza estados e dispara eventos.
- Hooks coordenam estado e ações.
- Funções utilitárias puras concentram regras de negócio.
- Tipos ficam próximos da feature que os usa.
- Persistência futura deve ser conectada por uma camada própria, sem contaminar componentes.

Fluxo recomendado:

```txt
Componentes -> hooks da feature -> regras puras -> estado/persistência
```

Evite acoplar a UI diretamente a regras de jogo, localStorage, APIs ou formatos de torneio.

## Convenções De Código

- Usar nomes claros e específicos.
- Preferir funções pequenas com uma responsabilidade.
- Evitar abreviações que não sejam óbvias.
- Usar retornos antecipados quando melhorarem a leitura.
- Não duplicar regras de pontuação em componentes diferentes.
- Não misturar cálculo de estado com marcação JSX extensa.
- Não introduzir bibliotecas sem necessidade clara.
- Não criar abstrações para "futuro possível" sem uso atual.

Exemplo:

```ts
type ScoreAction = "increment" | "decrement";

function calculateNextScore(currentScore: number, action: ScoreAction): number {
  if (action === "increment") return currentScore + 1;
  return Math.max(0, currentScore - 1);
}
```

## Convenções De TypeScript

- Evitar `any`.
- Preferir `type` para modelos simples e unions.
- Usar `interface` quando houver extensão natural de contrato.
- Modelar estados com tipos explícitos.
- Usar unions para tipos de jogo, status de partida e modos de placar.
- Não usar enum sem necessidade; prefira unions de string.
- Tipar props de componentes de forma explícita.
- Tipar retornos de hooks quando isso melhorar a leitura.

Exemplo:

```ts
export type PlayerSide = "home" | "away";

export type ScoreboardPlayer = {
  id: string;
  name: string;
  score: number;
};
```

## Componentização

Componentes devem ser organizados por responsabilidade:

- Componentes de apresentação exibem dados e recebem callbacks.
- Componentes de feature conhecem regras do placar.
- Hooks encapsulam estado, ações e orquestração.
- Funções puras calculam mudanças de pontuação.

Exemplo de separação:

```txt
ScoreboardPage
  Scoreboard
    ScorePanel
    PlayerNameInput
    ScoreControls
```

Regras:

- Um componente não deve saber mais do que precisa.
- Botões de ponto não devem calcular regras complexas.
- Inputs de nome não devem conhecer persistência.
- Componentes reutilizáveis não devem importar tipos específicos de torneios.

## Convenções Para Hooks

- Hooks customizados devem começar com `use`.
- Hooks de feature devem ficar dentro da pasta da feature.
- Hooks genéricos devem ficar em `src/hooks`.
- Hooks devem expor ações com nomes orientados ao domínio.
- Evitar retornar muitos valores soltos; quando crescer, retornar objeto nomeado.

Exemplo:

```ts
const {
  players,
  incrementScore,
  decrementScore,
  renamePlayer,
  resetScores,
} = useScoreboard();
```

## Convenções Para Types

- Tipos específicos devem ficar próximos da feature.
- Tipos compartilhados devem ir para `src/types`.
- Tipos de domínio devem usar nomes de negócio, não nomes visuais.
- Evitar tipos globais prematuros.

Exemplo:

```ts
export type GameKind = "generic" | "truco" | "fifa";

export type ScoreboardConfig = {
  gameKind: GameKind;
  minScore: number;
  maxScore?: number;
  allowNegativeScore: boolean;
};
```

## Lógica De Pontuação

A lógica de pontuação deve ser tratada como regra de domínio.

Regras iniciais:

- O placar começa com dois participantes.
- Cada participante tem nome editável.
- Cada participante começa com pontuação `0`.
- É possível adicionar ponto.
- É possível remover ponto.
- A pontuação não deve ficar negativa por padrão.
- Deve existir ação para resetar o placar quando a UI pedir.

Regras futuras devem ser configuráveis:

- Pontuação máxima por jogo.
- Incrementos diferentes por ação.
- Regras específicas de truco.
- Regras específicas de FIFA.
- Regras de partida eliminatória.
- Vencedor calculado por regra de jogo.

Exemplo de função pura:

```ts
export function applyScoreDelta(
  currentScore: number,
  delta: number,
  minScore = 0,
  maxScore?: number,
): number {
  const nextScore = currentScore + delta;
  const withMinimum = Math.max(minScore, nextScore);

  if (typeof maxScore === "number") {
    return Math.min(maxScore, withMinimum);
  }

  return withMinimum;
}
```

## Estado E Persistência

Na primeira versão, use estado local do React.

Regras:

- Não adicionar gerenciamento global antes de existir necessidade.
- Não adicionar backend antes de uma feature exigir.
- Não acoplar componentes diretamente ao `localStorage`.
- Se usar persistência local, criar uma camada isolada.
- Persistência deve ser reversível e fácil de trocar por API.

Estratégia evolutiva:

1. Estado local com `useState` ou `useReducer`.
2. Persistência local com adaptador simples.
3. Histórico local de partidas.
4. Sincronização com backend ou banco.

Exemplo de fronteira futura:

```ts
export type ScoreboardStorage = {
  load: () => ScoreboardState | null;
  save: (state: ScoreboardState) => void;
  clear: () => void;
};
```

## Responsividade

A aplicação deve ser mobile-first.

Regras:

- O placar deve funcionar bem em celulares.
- Controles principais devem ser grandes o suficiente para toque.
- Nomes e pontuações devem permanecer legíveis em telas pequenas.
- Evitar layouts que dependam de hover.
- Usar breakpoints do Tailwind apenas quando houver ganho real.
- Garantir que botões não fiquem pequenos demais em modo mobile.
- Manter contraste adequado entre texto, fundo e ações.

Prioridade visual:

1. Pontuação atual.
2. Nomes dos participantes.
3. Ações de adicionar e remover ponto.
4. Ações secundárias, como reset e troca de jogo.

## UI/UX

A interface deve ser direta, limpa e rápida de usar.

Regras:

- O usuário deve conseguir alterar o placar com poucos toques.
- A pontuação deve ser o elemento de maior destaque.
- Nomes editáveis devem ser fáceis de identificar.
- Ações destrutivas, como resetar, devem ser claras.
- Não usar textos explicativos longos dentro da interface.
- Preferir ícones em ações simples quando houver biblioteca disponível.
- Manter estados de foco acessíveis.
- Evitar animações que atrapalhem uso repetido.

Estados mínimos:

- Placar inicial.
- Nome em edição.
- Pontuação atualizada.
- Pontuação no mínimo permitido.
- Reset de placar.

## Clean Code

- Código deve ser simples antes de ser flexível.
- Cada arquivo deve ter propósito claro.
- Não criar helpers genéricos para um único uso.
- Não criar factories, services ou managers sem necessidade.
- Evitar comentários para explicar código confuso; simplificar o código primeiro.
- Comentários são aceitáveis para regras de negócio não óbvias.
- Preferir nomes descritivos a comentários.

## Evitar Overengineering

Não implementar antecipadamente:

- Backend.
- Autenticação.
- Banco de dados.
- Sistema completo de torneios.
- Regras de todos os jogos.
- Estado global complexo.
- Internacionalização.
- Tema avançado.
- Permissões de usuário.

Permitido preparar:

- Tipos extensíveis.
- Funções puras para regras.
- Pastas de feature quando houver código real nelas.
- Configuração simples de jogo quando usada pela UI.

Regra prática:

> Se a abstração não remove duplicação real, não protege uma regra importante ou não simplifica uma feature atual, ela ainda não deve existir.

## Escalabilidade

O sistema deve crescer por camadas:

- `scoreboard`: placar reutilizável.
- `matches`: gerenciamento de partidas individuais.
- `history`: registro de resultados.
- `game-rules`: regras específicas por jogo.
- `tournaments`: torneios e chaveamentos.

Cada camada deve depender da anterior por contratos explícitos, não por detalhes internos.

Exemplo:

```txt
tournaments -> matches -> scoreboard -> score rules
```

## Critérios De Aceite Das Features

Toda feature deve ter critérios objetivos.

Para o placar inicial:

- Exibe dois participantes.
- Permite editar o nome de cada participante.
- Permite adicionar ponto para cada participante.
- Permite remover ponto de cada participante.
- Não permite pontuação negativa por padrão.
- Permite resetar pontuações.
- Funciona bem em mobile.
- Não quebra layout com nomes longos.
- Mantém lógica de pontuação fora do JSX.

Para futuras features:

- Definir comportamento esperado antes de implementar.
- Definir estados de erro, vazio e carregamento quando existirem.
- Definir impacto em mobile.
- Definir se precisa de persistência.
- Definir como será testada.

## Testes

Prioridade de testes:

- Funções puras de pontuação.
- Hooks de estado quando tiverem regras relevantes.
- Componentes críticos de interação.
- Fluxos de partida e torneio quando existirem.

Exemplos de cenários:

- Incrementar ponto.
- Decrementar ponto.
- Impedir pontuação negativa.
- Alterar nome.
- Resetar placar.
- Aplicar pontuação máxima quando configurada.

## Evolução Futura

Ao adicionar novas funcionalidades, manter estas perguntas como checklist:

- Esta feature pertence ao placar, à partida ou ao torneio?
- A regra é genérica ou específica de um jogo?
- O estado precisa sobreviver ao refresh?
- A UI continua simples no celular?
- Há alguma função pura que deve ser extraída?
- O componente ficou responsável por regras demais?
- Existe critério de aceite claro?

## Definição De Pronto

Uma entrega só deve ser considerada pronta quando:

- Atende aos critérios de aceite.
- Mantém o projeto compilando.
- Não introduz abstrações desnecessárias.
- Preserva responsividade.
- Mantém regras de pontuação testáveis.
- Atualiza documentação quando altera comportamento relevante.
- Não adiciona dependências sem justificativa.
