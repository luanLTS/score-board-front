# Design

## Context

Consulte `proposal.md` e as quatro capacidades desta mudança para motivação e comportamento esperado. Hoje, o histórico genérico guarda partidas finalizadas e alimenta `calculateRanking`/`calculatePlayerStats`, agrupando participantes por nome normalizado, com 3 pontos por vitória, 1 por empate, 0 por derrota e desempate por vitórias, saldo e nome. O workspace de tênis tem armazenamento separado: partidas simples de super tie-break podem ser salvas em `TennisHistoryRecord`, mas a data de início é criada no momento do registro, e partidas do campeonato não entram nesse histórico. O campeonato persiste somente o estado atual; o bracket tem `finished`, mas o campeonato não possui cancelamento nem arquivo.

Restrições relevantes: preservar os dados locais já gravados, manter a área `Placar` funcional e não adicionar tênis ao contrato genérico `GameKind`. Os componentes genéricos de ranking/estatísticas já aceitam resultados derivados; a UI atual de histórico está tipada diretamente para partidas genéricas e precisará de uma entrada de apresentação que aceite rótulo e detalhes próprios de tênis.

## Goals / Non-Goals

**Goals:**

- Registrar todos os resultados concluídos de tênis em um histórico único, com origem e placar detalhado.
- Aplicar as mesmas métricas globais de ranking e estatísticas do placar genérico aos resultados de tênis.
- Arquivar campeonatos finalizados e cancelados e permitir iniciar outro sem perder os arquivos nem os resultados individuais.
- Fazer gravações repetidas e restauração após recarga idempotentes.
- Preservar os contratos e os dados existentes da área `Placar` e aceitar registros antigos de tênis.

**Non-Goals:**

- Alterar regras de pontuação do tênis ou o seeding/bracket.
- Unificar a persistência ou o ranking de tênis com o placar genérico.
- Acrescentar sincronização remota, login ou edição de resultados concluídos.

## Decisions

### 1. Ampliar o contrato próprio de histórico de tênis

Manter `TennisHistoryRecord` e sua chave atual, acrescentando contexto da partida (simples, classificatória ou eliminatória), identificador/nome do campeonato quando aplicável, horário de início real e detalhes de games para eliminatórias. O placar resumido continuará sendo um par numérico: pontos do super tie-break para classificatórias e games vencidos para eliminatórias. Assim, os dados antigos continuam legíveis e os consumidores de ranking recebem o mesmo tipo de placar exibido ao usuário. Cada partida terá identificador estável: ID da partida simples ou combinação do campeonato, turno/rodada e confronto. A inclusão será deduplicada por esse identificador.

O estado de uma partida nova deve guardar seu horário de início quando ela é criada, não quando termina. Para registros antigos sem informação confiável de início, manter o valor que já foi salvo; não há como reconstruir o horário retroativamente.

Alternativa considerada: criar um segundo histórico para partidas de campeonato. Rejeitada porque isso impediria que o ranking e a lista de partidas apresentassem o conjunto completo com uma única leitura e abriria espaço para duplicidade.

### 2. Reutilizar cálculos e apresentações genéricas através de adaptadores

Criar um adaptador de resultados de tênis para o formato neutro que os cálculos genéricos já consomem. Ele fornece nomes, placar numérico, vencedor e datas, sem publicar `tennis` como `GameKind`. O ranking reutiliza agrupamento por nome normalizado, pontos por vitória/empate, ordenação e métricas documentadas na Fase 6. Uma partida de tênis não termina empatada, mas o contrato de cálculo continua compatível.

Reutilizar `RankingList` e `PlayerStatsPanel`. Para histórico, extrair dos componentes genéricos uma apresentação guiada por dados/slots (rótulo de modalidade, placar e detalhes adicionais), mantendo os consumidores atuais e os testes do placar genérico. A área de tênis fornece seus rótulos e o placar detalhado; o fluxo de compartilhamento usa participantes, formato e resultado de tênis. A UI genérica não importa tipos nem regras de tênis.

Alternativa considerada: duplicar todos os componentes dentro de tênis. Rejeitada porque perpetuaria a diferença de comportamento que originou esta mudança. Alternativa considerada: adicionar `tennis` a `GameKind`; rejeitada para preservar o isolamento de domínio e armazenamento já adotado.

### 3. Manter arquivo de campeonatos separado do campeonato atual

Preservar a chave versionada do campeonato atual e criar uma chave versionada para snapshots de campeonatos finalizados ou cancelados. Cada snapshot contém o estado consultável do bracket/ranking e os resultados concluídos; recebe timestamp terminal e é inserido de forma idempotente pelo ID do campeonato. O histórico é exibido do mais recente para o mais antigo. Ao terminar um campeonato, arquivar o snapshot. Ao iniciar outro depois de um estado terminal, garantir primeiro que o anterior foi arquivado e então iniciar a configuração limpa.

No cancelamento, registrar o snapshot como cancelado, conservar os confrontos concluídos e remover o estado do confronto ainda em andamento. Esse confronto incompleto não entra no histórico de partidas. A confirmação de cancelamento será uma confirmação na própria interface, explicando que resultados concluídos permanecem e a partida incompleta é descartada.

Alternativa considerada: substituir a chave do campeonato atual por uma coleção contendo todos os campeonatos. Rejeitada para evitar migração destrutiva e manter a restauração atual compatível.

### 4. Ler dados existentes sem migração destrutiva

Manter a chave atual do histórico de partidas de tênis e ampliar o validador para aceitar os campos opcionais novos. Registros antigos de super tie-break permanecem válidos e entram no ranking com os dados disponíveis. O novo histórico de campeonatos usa uma chave independente; nenhum dado genérico é movido, regravado ou removido.

## Risks / Trade-offs

- [Risco] O saldo mistura unidades de formatos diferentes (pontos de tie-break e games vencidos), como placares de modalidades diferentes no ranking genérico. → Mitigação: manter o mesmo cálculo de placar observado no histórico e identificar sempre o formato de cada resultado.
- [Risco] Uma conclusão após reload pode tentar arquivar ou registrar o mesmo resultado novamente. → Mitigação: IDs estáveis e operações idempotentes para histórico de partidas e de campeonatos.
- [Risco] O adaptador de tênis pode apresentar um placar incompleto ao ranking se omitir vencedor ou score. → Mitigação: validar records na fronteira e testar cada formato, preservando o teste de paridade do cálculo genérico.
- [Risco] Alterar contratos visuais do histórico pode afetar a área `Placar`. → Mitigação: manter a API genérica compatível, cobrir os consumidores atuais e limitar personalizações a dados fornecidos pelo chamador.

## Migration Plan

1. Ampliar leitura/validação do histórico atual de tênis mantendo compatibilidade com o formato salvo.
2. Passar a gravar datas e resultados completos para novas partidas concluídas simples e de campeonato.
3. Introduzir a chave e o arquivo de campeonatos sem alterar a chave do estado atual.
4. Conectar ranking, estatísticas, histórico e cancelamento à nova fonte unificada de resultados.
5. Em rollback, a versão anterior continua lendo os registros antigos da chave de histórico de partidas; a nova chave de arquivo de campeonatos pode ser ignorada sem afetar os dados genéricos.
