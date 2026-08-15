# Fase 6: Experiência Avançada

## Objetivo

Evoluir o produto além do fluxo principal, adicionando recursos de acompanhamento local, compartilhamento e uso recorrente.

## Escopo Incluído

- Ranking.
- Estatísticas.
- Compartilhamento de resultado.
- PWA.

## Fora De Escopo

- Backend obrigatório.
- Sincronização em tempo real obrigatória.
- Monetização.
- Perfis públicos.
- Administração avançada.
- Acompanhamento do placar em TV, projetor ou outro dispositivo, pois depende de backend e sincronização em tempo real.

## Dependências

- Fase 3 concluída para dados históricos.
- Fase 4 concluída para partidas consistentes.
- Fase 5 concluída se rankings e estatísticas considerarem torneios.

## Entregáveis

- Ranking local.
- Estatísticas por participante.
- Ação de compartilhamento.
- Configuração inicial de PWA.

## Regras Iniciais De Ranking E Estatísticas

- A identidade local de um participante é seu nome normalizado com `trim` e comparação sem diferenciar maiúsculas de minúsculas.
- O nome exibido preserva uma forma legível encontrada no histórico, enquanto a chave normalizada é usada para agrupar partidas.
- O ranking concede 3 pontos por vitória, 1 ponto por empate e 0 ponto por derrota.
- A ordenação usa, nesta ordem: pontos do ranking, número de vitórias, saldo de pontos e nome.
- O desempate por nome é crescente e sem diferenciar maiúsculas de minúsculas.
- As estatísticas por participante incluem jogos, vitórias, empates, derrotas, pontos pró, pontos contra, saldo de pontos e aproveitamento.
- O aproveitamento é calculado por `pontos do ranking / (jogos * 3) * 100`; sem jogos, é `0`.

## Escopo PWA Desta Fase

- A PWA inclui instalação e funcionamento offline do app shell e dos assets essenciais por service worker.
- Navegações da SPA usam o `index.html` em cache como fallback offline; assets locais visitados são armazenados sob demanda.
- O cache do app shell é versionado e versões antigas são removidas na ativação do novo service worker.
- Dados locais já persistidos continuam disponíveis conforme os mecanismos existentes do navegador.
- Sincronização entre dispositivos, backend, login, filas de escrita remota e resolução de conflitos permanecem fora de escopo.

## Tarefas Pequenas Detalhadas

### 1. Definir métricas iniciais de ranking e estatísticas

**Objetivo:** implementar as métricas definidas nesta fase a partir do histórico.

**Arquivos previstos:**

- `src/features/stats/types.ts`
- `docs/roadmap/fase-06-experiencia-avancada.md`

**Pré-requisitos:**

- Fase 3 concluída para dados históricos.
- Fase 4 concluída para partidas consistentes.
- Fase 5 concluída se torneios entrarem nos cálculos.

**Passos:**

- Usar nome normalizado (`trim` e case-insensitive) como identidade local do participante.
- Usar 3 pontos por vitória, 1 por empate e 0 por derrota.
- Aplicar desempates por vitórias, saldo de pontos e nome.
- Calcular jogos, vitórias, empates, derrotas, pontos pró/contra, saldo e aproveitamento.

**Critério de pronto:**

- Ranking e estatísticas têm regras explícitas antes da implementação.

**Paralelismo:** bloqueia cálculos reais, mas não bloqueia compartilhamento ou PWA.

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

**Paralelismo:** pode rodar em paralelo com ranking e PWA.

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

### 9. Configurar manifesto PWA

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

**Paralelismo:** pode rodar em paralelo com stats e sharing.

### 10. Configurar ícones e metadados de instalação

**Objetivo:** completar os recursos visuais mínimos do PWA.

**Arquivos previstos:**

- `public/icons/...`
- `index.html`

**Depende de:** tarefa 9.

**Passos:**

- Definir tamanhos mínimos de ícone.
- Referenciar ícones no manifesto.
- Adicionar metadados necessários no HTML.

**Critério de pronto:**

- Instalação usa ícones e nome corretos.

**Paralelismo:** sequencial após manifesto.

### 11. Configurar estratégia offline mínima

**Objetivo:** disponibilizar o app shell e os assets essenciais offline.

**Arquivos previstos:**

- `docs/roadmap/fase-06-experiencia-avancada.md`
- Arquivos de configuração PWA, se a decisão incluir service worker.

**Depende de:** tarefas 9 e 10.

**Passos:**

- Configurar service worker limitado ao app shell e aos assets essenciais.
- Validar abertura offline após ao menos um carregamento online.
- Não implementar sincronização, backend ou resolução de conflitos nesta fase.

**Critério de pronto:**

- App shell e assets essenciais ficam disponíveis offline, com limites documentados.

**Paralelismo:** pode ser decidido enquanto o manifesto é configurado.

### 12. Integrar recursos avançados na experiência principal

**Objetivo:** organizar ranking, estatísticas, compartilhamento e PWA sem poluir o fluxo principal.

**Arquivos previstos:**

- `src/app/App.tsx`
- Componentes das features `stats` e `sharing`.

**Depende de:** tarefas 6, 8, 9, 10 e 11.

**Passos:**

- Posicionar ranking e estatísticas perto do histórico.
- Colocar compartilhamento no contexto de resultado finalizado.

**Critério de pronto:**

- Recursos avançados ficam acessíveis, mas o placar continua simples de usar.

**Paralelismo:** sequencial após recursos principais.

### 13. Verificar a fase

**Objetivo:** confirmar que a Fase 6 está pronta.

**Arquivos previstos:**

- Sem arquivos novos obrigatórios.

**Depende de:** todas as tarefas anteriores.

**Passos:**

- Rodar `npm run typecheck`.
- Rodar `npm run build`.
- Conferir manualmente ranking, estatísticas, compartilhamento e manifesto PWA.

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
- Tarefa 9: manifesto PWA.

Deve ser sequencial:

- Tarefa 6 depende de cálculos e componentes de stats.
- Tarefa 8 depende do texto de compartilhamento.
- Tarefas 10 e 11 dependem do manifesto PWA.
- Tarefa 12 depende dos recursos avançados principais.
- Tarefa 13 depende de tudo.

## Critérios De Aceite

- Ranking usa dados reais do histórico.
- Estatísticas apresentam informações úteis por participante.
- Compartilhamento gera texto claro do resultado.
- Aplicação possui configuração inicial para instalação como PWA.
- App shell e assets essenciais funcionam offline após o primeiro carregamento.
- `npm run typecheck` passa.
- `npm run build` passa.

## Riscos E Decisões Pendentes

- Nomes diferentes que representem a mesma pessoa continuam sendo identidades distintas nesta versão, exceto por espaços externos e diferenças de caixa.
- A invalidação do cache do service worker deve acompanhar novas versões dos assets.
- Sincronização e identidade persistente por entidade dependem de uma fase futura com backend ou perfis.
- Acompanhamento em TV, projetor ou outro dispositivo permanece como evolução futura e exige backend com sincronização em tempo real.

## Decisões De Integração

- Ranking e estatísticas ocupam a seção própria `Ranking`, alimentada pelo mesmo histórico local das partidas, para não competir com o placar e a criação de torneios.
- Compartilhamento fica disponível no resultado recém-finalizado e nos detalhes da partida selecionada no histórico.
- A navegação principal usa três opções de largura equivalente (`Partidas`, `Torneio` e `Ranking`) para permanecer clara em telas pequenas.
