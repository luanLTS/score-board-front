# Tasks

## 1. Ampliar o contrato do histórico de partidas

- [x] 1.1 Estender os tipos e o parser do histórico de tênis para aceitar origem da partida, identificação do campeonato, placar detalhado e horários, preservando registros antigos; verificar com testes de parsing para os formatos antigo e novo.
- [x] 1.2 Criar conversores de partidas super tie-break e melhor de três para registros históricos completos, com IDs estáveis e placares por game; verificar vencedores, datas, participantes e detalhes em testes unitários.

## 2. Registrar resultados de todas as partidas de tênis

- [x] 2.1 Registrar partidas simples concluídas com horários reais de início e fim, garantindo uma única entrada após restauração; verificar com teste de persistência e prevenção de duplicata.
- [x] 2.2 Registrar partidas classificatórias e eliminatórias ao concluir cada confronto, vinculando campeonato, turno/rodada e partida; verificar que ambos os formatos produzem um único registro com score e vencedor corretos.
- [x] 2.3 Garantir que a conclusão do campeonato ou a restauração de estado não repita registros já persistidos; verificar a idempotência de cada origem de partida.

## 3. Reutilizar ranking e estatísticas globais

- [x] 3.1 Adaptar registros de tênis para os cálculos genéricos sem adicionar `tennis` a `GameKind`; verificar paridade de pontos, vitórias, saldo, ordenação e aproveitamento com o mesmo conjunto de resultados.
- [x] 3.2 Conectar ranking e painel de estatísticas do workspace de tênis às partidas concluídas simples e de campeonato; verificar agregação por nome normalizado e estado vazio em testes de componente.

## 4. Unificar a consulta do histórico de partidas

- [x] 4.1 Generalizar a apresentação reutilizável do histórico e detalhes sem alterar o comportamento do placar genérico; verificar lista, seleção, detalhes e compartilhamento nos testes atuais da área `Placar`.
- [x] 4.2 Apresentar no workspace de tênis a lista unificada, detalhes específicos de cada formato e compartilhamento do resultado; verificar partidas simples, classificatórias, eliminatórias e estado vazio em testes de componente.

## 5. Arquivar campeonatos terminalizados

- [x] 5.1 Criar armazenamento versionado e parser para snapshots de campeonatos finalizados/cancelados, deduplicando pelo ID e mantendo a chave atual do campeonato; verificar dados válidos, inválidos, ordenação e duplicatas em testes de persistência.
- [x] 5.2 Arquivar campeonato e campeão quando a final for concluída, mantendo participantes, classificação, chave e resultados; verificar snapshot após reload e uma única entrada no arquivo.
- [x] 5.3 Exibir o histórico selecionável de campeonatos com status e detalhes somente de leitura; verificar estados vazio, finalizado e cancelado em testes de componente.

## 6. Cancelar e iniciar campeonatos subsequentes

- [x] 6.1 Implementar confirmação e cancelamento do campeonato ativo, arquivando resultados concluídos e descartando o placar incompleto; verificar o fluxo nas fases classificatória e eliminatória.
- [x] 6.2 Permitir iniciar um novo campeonato após término ou cancelamento, preservando arquivos anteriores e exigindo estado terminal para sair do campeonato ativo; verificar transições e persistência com testes de componente.

## 7. Verificação integrada

- [x] 7.1 Executar `npm test`, `npm run typecheck`, `npm run build` e `openspec validate`; corrigir falhas e confirmar regressão zero na área genérica.
- [x] 7.2 Cobrir com testes automatizados o histórico/ranking de tênis, cancelamento durante uma partida, preservação de resultados concluídos, criação de novo campeonato e consulta dos arquivos, evitando depender de partidas completas para regressão.

## Workflow follow-up

- Arquivar esta mudança OpenSpec após revisão e conclusão das tarefas.
