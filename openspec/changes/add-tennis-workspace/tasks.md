# Tasks

## 1. Separar as áreas da aplicação

- [x] 1.1 Criar o estado de navegação entre `Placar` e `Tênis`, mantendo `Placar` como área inicial, e verificar com teste de componente que as duas áreas podem ser selecionadas.
- [x] 1.2 Ajustar a composição do `App` para que o placar genérico mantenha partidas, histórico e chaveamento, e verificar com os testes existentes de `App` e torneio.
- [x] 1.3 Criar o layout inicial do workspace de tênis com entradas para partida simples, ranking e campeonato, e verificar que a navegação renderiza as três opções.

## 2. Preservar o placar genérico

- [x] 2.1 Remover a dependência visual do seletor de tipo de jogo no fluxo genérico sem quebrar a restauração de partidas existentes, verificando `Scoreboard`, `CurrentMatchView` e testes de persistência.
- [x] 2.2 Manter partidas simples genéricas e chaveamentos genéricos funcionando, adicionando testes de regressão para criação, pontuação, finalização e avanço de vencedor.
- [x] 2.3 Documentar no código ou nos tipos a compatibilidade necessária para dados antigos que ainda contenham `gameKind`, verificando `npm run typecheck`.

## 3. Implementar regras puras de tênis

- [x] 3.1 Criar os tipos de estado para super tie-break, saque, troca de lado, game e partida eliminatória, verificando que representam estados válidos sem `any`.
- [x] 3.2 Implementar a progressão de pontos do super tie-break, a condição de vitória por pelo menos 10 pontos e diferença de 2, e testar `10–8`, `9–9`, `11–9` e sequências prolongadas.
- [x] 3.3 Implementar a sequência oficial de saques e a indicação de troca de lados a cada 6 pontos, testando primeiro saque, bloco de dois saques e transições de lado.
- [x] 3.4 Implementar pontos de game em `0/15/30/40`, deuce, vantagem e retorno ao deuce, verificando todos os cenários da especificação.
- [x] 3.5 Implementar melhor de 3 games, encerrando ao alcançar 2 games vencidos, e cobrir o fluxo com testes unitários.

## 4. Criar partida simples de tênis

- [x] 4.1 Criar a feature `src/features/tennis` com contratos de partida simples, regras e adaptadores de apresentação, verificando a estrutura mínima usada pelos consumidores.
- [x] 4.2 Criar a criação de partida com sorteio injetável do primeiro sacador e persistência do resultado do sorteio, verificando que restauração não sorteia novamente.
- [x] 4.3 Criar a interface de partida simples de tênis para super tie-break e eliminatória, verificando a exibição do sacador, pontuação atual, troca de lado e vencedor.
- [x] 4.4 Integrar partidas simples de tênis ao histórico próprio, sem perder participantes, modalidade, placar detalhado e resultado, verificando criação, finalização e leitura do registro salvo.
- [x] 4.5 Criar o formulário de partida simples de tênis com nomes editáveis, persistindo os participantes escolhidos e conectando a criação ao placar de super tie-break.

## 5. Implementar campeonato classificatório

- [x] 5.1 Criar os tipos e estados do campeonato de tênis para configuração, turno em andamento, turno fechado, eliminatórias e finalizado, verificando transições válidas e rejeição de transições inválidas.
- [x] 5.2 Gerar as partidas de um turno completo de todos contra todos, testando grupos com 3 e 4 participantes e garantindo que cada par apareça uma vez por turno.
- [x] 5.3 Impedir o fechamento de turno com partidas pendentes e permitir o fechamento quando todas tiverem resultado, verificando os estados e mensagens da interface.
- [x] 5.4 Calcular ranking acumulado entre turnos por vitórias, saldo total de pontos, confronto direto e sorteio, adicionando testes para empates e múltiplos turnos.
- [x] 5.5 Implementar a escolha entre iniciar novo turno e avançar para eliminatórias, verificando que resultados de turnos anteriores permanecem no ranking.

## 6. Integrar ranking e eliminatórias de tênis

- [x] 6.1 Gerar o seeding eliminatório determinístico com `1º × último`, `2º × penúltimo` e assim por diante, testando 3, 4, 5, 6 e 8 participantes.
- [x] 6.2 Integrar o seeding ao bracket existente sem alterar o gerador genérico, verificando byes, avanço de vencedores e definição do campeão.
- [x] 6.3 Garantir que partidas classificatórias usem super tie-break e partidas eliminatórias usem melhor de 3 games, verificando o tipo de regra usado em cada fase.
- [x] 6.4 Criar a interface do campeonato com lista de partidas, ranking acumulado, ação de fechar turno, ação de novo turno e acesso ao chaveamento, verificando o fluxo completo com teste de componente.
- [x] 6.5 Integrar o campeonato ao workspace de tênis, permitindo cadastrar participantes, jogar partidas classificatórias, atualizar o ranking e abrir as eliminatórias.

## 7. Persistência e regressão

- [x] 7.1 Criar chaves e validadores de persistência específicos para partida atual, histórico de partidas e campeonato de tênis, testando dados válidos, dados incompletos e restauração após recarregar.
- [x] 7.2 Preservar as chaves e os formatos de armazenamento genéricos existentes, executando os testes atuais de scoreboard, histórico e torneios.
- [x] 7.3 Revisar a documentação do roadmap para registrar a separação entre placar genérico e workspace de tênis, verificando que as decisões de escopo estão refletidas no arquivo.

## 8. Validação integrada

- [x] 8.1 Executar `npm test` e corrigir falhas de regressão ou de cobertura das regras de tênis.
- [x] 8.2 Executar `npm run typecheck` e confirmar que todos os contratos genéricos e de tênis estão tipados.
- [x] 8.3 Executar `npm run build` e validar manualmente navegação, partida simples, fechamento de turno, ranking e eliminatórias.
- [x] 8.4 Executar `openspec validate` e corrigir qualquer inconsistência entre proposta, specs, design e tarefas.

## Workflow follow-up

- Arquivar a mudança somente depois que todas as tarefas forem concluídas e revisadas.
- Verificar as specs principais geradas pelo arquivamento.
