# Fase 6: Experiência Avançada

## Objetivo

Evoluir o produto além do fluxo principal, adicionando recursos de acompanhamento, apresentação, compartilhamento e uso recorrente.

## Escopo Incluído

- Ranking.
- Estatísticas.
- Compartilhamento de resultado.
- Modo apresentação.
- PWA.

## Fora De Escopo

- Backend obrigatório.
- Sincronização em tempo real obrigatória.
- Monetização.
- Perfis públicos.
- Administração avançada.

## Dependências

- Fase 3 concluída para dados históricos.
- Fase 4 concluída para partidas consistentes.
- Fase 5 concluída se rankings e estatísticas considerarem torneios.

## Entregáveis

- Ranking local.
- Estatísticas por participante.
- Ação de compartilhamento.
- Layout de apresentação para tela grande.
- Configuração inicial de PWA.

## Tarefas Pequenas Detalhadas

### 1. Definir métricas iniciais de ranking e estatísticas

**Objetivo:** decidir quais informações serão calculadas a partir do histórico.

**Arquivos previstos:**

- `src/features/stats/types.ts`
- `docs/roadmap/fase-06-experiencia-avancada.md`

**Pré-requisitos:**

- Fase 3 concluída para dados históricos.
- Fase 4 concluída para partidas consistentes.
- Fase 5 concluída se torneios entrarem nos cálculos.

**Passos:**

- Definir métrica de ranking inicial.
- Definir estatísticas por participante.
- Decidir se participante será identificado por nome textual ou entidade.

**Critério de pronto:**

- Ranking e estatísticas têm regras explícitas antes da implementação.

**Paralelismo:** bloqueia cálculos reais, mas não bloqueia PWA ou modo apresentação.

### 2. Criar funções de cálculo de ranking

**Objetivo:** gerar ranking local a partir de partidas finalizadas.

**Arquivos previstos:**

- `src/features/stats/utils/ranking.ts`

**Depende de:** tarefa 1.

**Passos:**

- Criar função para calcular ranking a partir do histórico.
- Ordenar participantes pela métrica definida.
- Tratar histórico vazio.

**Critério de pronto:**

- Ranking é calculado sem depender de React.

**Paralelismo:** pode rodar em paralelo com estatísticas por participante.

### 3. Criar funções de estatísticas por participante

**Objetivo:** resumir desempenho individual a partir do histórico.

**Arquivos previstos:**

- `src/features/stats/utils/playerStats.ts`

**Depende de:** tarefa 1.

**Passos:**

- Criar função para agrupar partidas por participante.
- Calcular totais definidos na tarefa 1.
- Tratar participante sem partidas ou histórico vazio.

**Critério de pronto:**

- Estatísticas podem ser testadas fora da UI.

**Paralelismo:** pode rodar em paralelo com ranking.

### 4. Criar componente de ranking

**Objetivo:** apresentar ranking local de forma legível.

**Arquivos previstos:**

- `src/features/stats/components/RankingList.tsx`

**Depende de:** tarefa 1 para formato; integração real depende da tarefa 2.

**Passos:**

- Criar lista ordenada de participantes.
- Exibir posição, nome e métrica principal.
- Criar estado vazio.

**Critério de pronto:**

- Ranking pode ser renderizado com dados reais ou mockados.

**Paralelismo:** pode começar com dados mockados.

### 5. Criar componente de estatísticas

**Objetivo:** exibir detalhes úteis por participante.

**Arquivos previstos:**

- `src/features/stats/components/PlayerStatsPanel.tsx`

**Depende de:** tarefa 1 para formato; integração real depende da tarefa 3.

**Passos:**

- Exibir estatísticas principais por participante.
- Criar estado vazio.
- Manter visual compacto para mobile.

**Critério de pronto:**

- Estatísticas são compreensíveis e não duplicam o ranking.

**Paralelismo:** pode começar com dados mockados.

### 6. Integrar ranking e estatísticas ao histórico

**Objetivo:** usar dados reais de partidas finalizadas.

**Arquivos previstos:**

- `src/features/stats/components/StatsView.tsx`
- `src/app/App.tsx`, se a composição estiver na tela principal.

**Depende de:** tarefas 2, 3, 4 e 5.

**Passos:**

- Carregar histórico real.
- Calcular ranking e estatísticas.
- Renderizar componentes com dados derivados.

**Critério de pronto:**

- Ranking e estatísticas refletem partidas finalizadas.

**Paralelismo:** sequencial após cálculos e componentes.

### 7. Criar formato textual de compartilhamento

**Objetivo:** gerar texto claro para compartilhar resultado.

**Arquivos previstos:**

- `src/features/sharing/formatResultShareText.ts`

**Depende de:** tipo `Match` consolidado.

**Passos:**

- Criar função para formatar resultado de uma partida.
- Incluir participantes, placar, tipo de jogo e data quando disponível.
- Tratar empate explicitamente.

**Critério de pronto:**

- Texto de compartilhamento é previsível e independente da UI.

**Paralelismo:** pode rodar em paralelo com ranking, modo apresentação e PWA.

### 8. Integrar Web Share API com fallback

**Objetivo:** permitir compartilhar resultado em dispositivos compatíveis e copiar quando não houver suporte.

**Arquivos previstos:**

- `src/features/sharing/shareResult.ts`
- `src/features/sharing/components/ShareResultButton.tsx`

**Depende de:** tarefa 7.

**Passos:**

- Detectar suporte a `navigator.share`.
- Usar Web Share API quando disponível.
- Criar fallback para copiar resultado.
- Exibir retorno visual simples para sucesso ou falha.

**Critério de pronto:**

- Compartilhamento funciona com ou sem Web Share API.

**Paralelismo:** sequencial após formato textual.

### 9. Criar modo apresentação

**Objetivo:** oferecer layout ampliado para tela grande, TV ou projetor.

**Arquivos previstos:**

- `src/features/presentation/components/PresentationScoreboard.tsx`

**Depende de:** placar funcional da Fase 1 e partida atual da Fase 4.

**Passos:**

- Criar visual de placar ampliado.
- Priorizar nomes e pontuação.
- Reduzir controles ou deixá-los fora do modo apresentação.

**Critério de pronto:**

- Placar fica legível em tela grande.

**Paralelismo:** pode rodar em paralelo com stats, sharing e PWA.

### 10. Adicionar acesso ao modo apresentação

**Objetivo:** permitir alternar entre uso normal e apresentação.

**Arquivos previstos:**

- `src/app/App.tsx`
- `src/features/presentation/components/PresentationToggle.tsx`

**Depende de:** tarefa 9.

**Passos:**

- Criar alternância ou rota simples para apresentação.
- Preservar o mesmo estado de placar ou partida.
- Permitir sair do modo apresentação.

**Critério de pronto:**

- Usuário consegue entrar e sair do modo apresentação sem perder estado.

**Paralelismo:** sequencial após modo apresentação.

### 11. Configurar manifesto PWA

**Objetivo:** preparar instalação básica da aplicação.

**Arquivos previstos:**

- `public/manifest.webmanifest`
- `index.html`

**Depende de:** definição mínima de nome, cores e ícones.

**Passos:**

- Criar manifesto com nome, short name, display e cores.
- Referenciar manifesto no `index.html`.
- Garantir metadados básicos para instalação.

**Critério de pronto:**

- Aplicação possui manifesto válido.

**Paralelismo:** pode rodar em paralelo com stats, sharing e apresentação.

### 12. Configurar ícones e metadados de instalação

**Objetivo:** completar os recursos visuais mínimos do PWA.

**Arquivos previstos:**

- `public/icons/...`
- `index.html`

**Depende de:** tarefa 11.

**Passos:**

- Definir tamanhos mínimos de ícone.
- Referenciar ícones no manifesto.
- Adicionar metadados necessários no HTML.

**Critério de pronto:**

- Instalação usa ícones e nome corretos.

**Paralelismo:** sequencial após manifesto.

### 13. Avaliar estratégia offline mínima

**Objetivo:** decidir se a fase inclui suporte offline além do cache padrão do navegador.

**Arquivos previstos:**

- `docs/roadmap/fase-06-experiencia-avancada.md`
- Arquivos de configuração PWA, se a decisão incluir service worker.

**Depende de:** tarefas 11 e 12.

**Passos:**

- Definir se haverá service worker nesta fase.
- Se houver, limitar escopo a shell estático e assets essenciais.
- Se não houver, documentar que PWA inicial cobre instalação, não offline completo.

**Critério de pronto:**

- Escopo offline está decidido e documentado.

**Paralelismo:** pode ser decidido enquanto o manifesto é configurado.

### 14. Integrar recursos avançados na experiência principal

**Objetivo:** organizar ranking, estatísticas, compartilhamento, apresentação e PWA sem poluir o fluxo principal.

**Arquivos previstos:**

- `src/app/App.tsx`
- Componentes das features `stats`, `sharing` e `presentation`.

**Depende de:** tarefas 6, 8, 10, 11, 12 e 13.

**Passos:**

- Posicionar ranking e estatísticas perto do histórico.
- Colocar compartilhamento no contexto de resultado finalizado.
- Manter modo apresentação acessível sem disputar com ações principais.

**Critério de pronto:**

- Recursos avançados ficam acessíveis, mas o placar continua simples de usar.

**Paralelismo:** sequencial após recursos principais.

### 15. Verificar a fase

**Objetivo:** confirmar que a Fase 6 está pronta.

**Arquivos previstos:**

- Sem arquivos novos obrigatórios.

**Depende de:** todas as tarefas anteriores.

**Passos:**

- Rodar `npm run typecheck`.
- Rodar `npm run build`.
- Conferir manualmente ranking, estatísticas, compartilhamento, apresentação e manifesto PWA.

**Critério de pronto:**

- Typecheck passa.
- Build passa.
- Critérios de aceite da Fase 6 foram conferidos.

**Paralelismo:** não pode ser paralelo; é validação final.

## Execução Paralela

Pode ser paralelo depois da tarefa 1:

- Tarefa 2: cálculo de ranking.
- Tarefa 3: cálculo de estatísticas.
- Tarefa 4: UI de ranking com dados mockados.
- Tarefa 5: UI de estatísticas com dados mockados.
- Tarefa 7: formato de compartilhamento.
- Tarefa 9: modo apresentação.
- Tarefa 11: manifesto PWA.

Deve ser sequencial:

- Tarefa 6 depende de cálculos e componentes de stats.
- Tarefa 8 depende do texto de compartilhamento.
- Tarefa 10 depende do modo apresentação.
- Tarefas 12 e 13 dependem do manifesto PWA.
- Tarefa 14 depende dos recursos avançados principais.
- Tarefa 15 depende de tudo.

## Critérios De Aceite

- Ranking usa dados reais do histórico.
- Estatísticas apresentam informações úteis por participante.
- Compartilhamento gera texto claro do resultado.
- Modo apresentação funciona em tela grande.
- Aplicação possui configuração inicial para instalação como PWA.
- `npm run typecheck` passa.
- `npm run build` passa.

## Riscos E Decisões Pendentes

- Definir regra de pontuação do ranking.
- Decidir se estatísticas serão por nome textual ou por entidade de participante.
- Definir quais recursos PWA entram antes de backend ou login.
