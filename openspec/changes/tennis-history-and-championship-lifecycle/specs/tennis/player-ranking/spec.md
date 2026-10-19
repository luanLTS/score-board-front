# Spec Delta

## Purpose

Define o ranking global e as estatísticas individuais de tênis a partir de todas as partidas concluídas, independentemente de serem simples ou parte de um campeonato.

## ADDED Requirements

### Requirement: O ranking global deve incluir todas as partidas concluídas de tênis
O sistema SHALL calcular o ranking global de tênis com base no histórico completo de partidas concluídas, incluindo partidas de campeonatos cancelados.

#### Scenario: Participante tem partidas em mais de um contexto
- **WHEN** o mesmo participante possui partidas simples, classificatórias ou eliminatórias concluídas
- **THEN** o ranking global combina esses resultados em uma única entrada do participante

#### Scenario: Participante disputa partidas de campeonato cancelado
- **WHEN** partidas concluídas de um campeonato cancelado permanecem no histórico
- **THEN** esses resultados continuam contribuindo para o ranking e as estatísticas dos participantes

#### Scenario: Partida ainda não foi concluída
- **WHEN** uma partida de tênis está pendente ou em andamento
- **THEN** seu placar não altera ranking nem estatísticas

### Requirement: A identidade global do participante deve seguir o comportamento genérico
O sistema SHALL agrupar resultados pelo nome do participante após remover espaços externos e ignorar diferenças entre maiúsculas e minúsculas, preservando um nome legível para exibição.

#### Scenario: Nome varia apenas por espaços ou capitalização
- **WHEN** partidas usam nomes que diferem somente por espaços externos ou capitalização
- **THEN** o sistema apresenta uma única entrada no ranking e agrega suas estatísticas

### Requirement: O ranking deve aplicar a pontuação e a ordenação genéricas
O sistema SHALL atribuir três pontos por vitória, um ponto por empate e zero ponto por derrota, e SHALL ordenar por pontos de ranking, vitórias, saldo de placar e nome crescente sem diferenciar capitalização.

#### Scenario: Participantes possuem resultados diferentes
- **WHEN** o ranking global é calculado
- **THEN** o sistema aplica os critérios nessa ordem e atribui posições consecutivas

#### Scenario: Participantes empatam nos critérios anteriores
- **WHEN** participantes têm os mesmos pontos de ranking, vitórias e saldo de placar
- **THEN** o sistema os ordena pelo nome sem diferenciar maiúsculas de minúsculas

### Requirement: As estatísticas devem apresentar as métricas genéricas
O sistema SHALL calcular jogos, vitórias, empates, derrotas, pontos a favor, pontos contra, saldo e aproveitamento para cada participante, usando aproveitamento igual a pontos de ranking divididos por três vezes o número de jogos, multiplicado por cem.

#### Scenario: Participante tem partidas concluídas
- **WHEN** o usuário consulta as estatísticas de um participante
- **THEN** o sistema apresenta todas as métricas calculadas sobre suas partidas concluídas de tênis

#### Scenario: Participante ainda não tem partidas concluídas
- **WHEN** o histórico não contém partidas concluídas de tênis
- **THEN** o ranking e as estatísticas exibem estados vazios e o aproveitamento é zero

#### Scenario: Aproveitamento é calculado
- **WHEN** um participante possui partidas concluídas
- **THEN** o sistema calcula o aproveitamento usando pontos de ranking dividido por três vezes o número de jogos, multiplicado por cem
