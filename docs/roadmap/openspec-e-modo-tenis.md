# Roadmap: OpenSpec e modo tênis

Este documento registra o plano de adoção do OpenSpec no Score Board e a
primeira feature que será conduzida por esse fluxo: o modo de jogo tênis.

## Objetivo

Adotar um processo leve de Spec-Driven Development para que novas features
tenham requisitos claros, cenários verificáveis e uma implementação alinhada
com a arquitetura existente.

O OpenSpec será introduzido de forma incremental. Não vamos migrar
imediatamente os documentos históricos do projeto.

## Estado atual da implementação

O projeto já foi inicializado com OpenSpec no schema `spec-driven` e a feature
está sendo implementada na branch isolada `feat/add-tennis-workspace`.

O produto possui duas áreas independentes:

- `Placar`: partidas, histórico e chaveamento genéricos;
- `Tênis`: partidas, ranking e campeonato com regras específicas.

O histórico e o estado do tênis usam armazenamento próprio no `localStorage`,
sem adicionar `tennis` ao contrato `GameKind` genérico:

- `score-board:tennis-current-match:v1`;
- `score-board:tennis-match-history:v1`;
- `score-board:tennis-current-tournament:v1`.

O histórico genérico e suas chaves permanecem compatíveis com os dados
existentes.

## Fluxo do OpenSpec

1. Explorar a ideia e as decisões de produto.
2. Propor a mudança.
3. Revisar os artefatos antes de escrever código.
4. Implementar a mudança seguindo as tarefas.
5. Validar o código e a especificação.
6. Arquivar a mudança concluída.

## Etapas

### 1. Definir o escopo do tênis — concluído

- [ ] Decidir o nível de fidelidade das regras.
- [ ] Definir pontuação de pontos, games e sets.
- [ ] Decidir o comportamento de deuce e vantagem.
- [ ] Decidir se haverá tie-break.
- [ ] Definir melhor de 3 ou melhor de 5.
- [ ] Decidir se a primeira versão cobre simples, duplas ou ambos.
- [ ] Definir como o placar será apresentado na interface.

Nesta etapa não haverá alteração de código. O objetivo é alinhar o
comportamento do produto.

### 2. Fazer a leitura mínima do OpenSpec — concluído

- [ ] Ler o Quickstart.
- [ ] Ler a documentação de instalação.
- [ ] Ler a configuração do projeto.
- [ ] Ler o schema padrão `spec-driven`.
- [ ] Confirmar como o OpenSpec pode ser usado com Codex.

Não é necessário estudar os recursos avançados antes do primeiro uso.

### 3. Instalar e inicializar o OpenSpec — concluído

- [ ] Instalar o CLI.
- [ ] Executar `openspec init` na raiz do projeto.
- [ ] Verificar os arquivos gerados.
- [ ] Selecionar o schema padrão `spec-driven`.
- [ ] Confirmar que nenhuma funcionalidade do produto foi alterada.

### 4. Configurar o contexto do projeto — concluído

Adicionar ao contexto do OpenSpec as referências existentes:

- `PROJECT.md`;
- `instructions.md`;
- arquitetura por features;
- comandos de teste e build;
- regras de preservação das funcionalidades existentes;
- convenções de React e TypeScript.

### 5. Explorar o modo tênis — concluído

Usar o fluxo de exploração para analisar a feature sem escrever código.

Pontos a investigar:

- impacto no módulo `scoreboard`;
- impacto no módulo `matches`;
- representação do estado de uma partida de tênis;
- compatibilidade com histórico;
- compatibilidade com os modos existentes;
- cenários de pontuação e encerramento.

### 6. Criar a proposta formal — concluído

Criar uma mudança semelhante a:

```txt
openspec/changes/add-tennis-game/
├── proposal.md
├── specs/
│   └── tennis-scoring/
│       └── spec.md
├── design.md
└── tasks.md
```

`proposal.md` explicará o motivo e o escopo. `spec.md` descreverá o
comportamento observável. `design.md` registrará as decisões técnicas e
`tasks.md` servirá como checklist de implementação.

### 7. Revisar a proposta antes do código — concluído

- [ ] Revisar o problema e o escopo em `proposal.md`.
- [ ] Revisar os requisitos e cenários em `spec.md`.
- [ ] Revisar a solução técnica em `design.md`.
- [ ] Confirmar que `tasks.md` cobre todos os requisitos.
- [ ] Remover tarefas e abstrações que não sejam necessárias.

### 8. Implementar com testes — em andamento

- [ ] Criar ou atualizar os testes das regras puras.
- [ ] Implementar a lógica de pontuação do tênis.
- [ ] Integrar tipos e regras ao placar atual.
- [ ] Integrar o fluxo de partida quando necessário.
- [ ] Atualizar a interface.
- [ ] Preservar os modos `generic`, `truco` e `fifa`.
- [ ] Atualizar histórico e compartilhamento se o contrato exigir.

### 9. Validar — parcial, repetir ao final

Executar:

```bash
npm test
npm run typecheck
npm run build
openspec validate
```

Também será feita uma verificação manual dos cenários principais de uma
partida de tênis.

### 10. Arquivar a mudança — pendente

- [ ] Confirmar que todas as tarefas foram concluídas.
- [ ] Arquivar a mudança no OpenSpec.
- [ ] Verificar que as especificações principais foram atualizadas.
- [ ] Registrar decisões importantes para futuras features.

## Primeira decisão funcional

Precisamos decidir se a primeira versão terá:

1. tênis completo, com pontos `0/15/30/40`, deuce, vantagem, games, sets e
   tie-break; ou
2. uma versão inicial simplificada, para validar o fluxo antes de modelar
   todas as regras oficiais.

