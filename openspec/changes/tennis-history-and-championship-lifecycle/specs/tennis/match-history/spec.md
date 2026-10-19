# Spec Delta

## Purpose

Define o histórico consultável de partidas de tênis concluídas em partidas simples e campeonatos, com dados suficientes para identificar participantes, resultado e regras usadas.

## ADDED Requirements

### Requirement: Toda partida de tênis concluída deve entrar no histórico
O sistema SHALL registrar uma única vez cada partida de tênis concluída, seja simples, classificatória ou eliminatória.

#### Scenario: Partida simples é concluída
- **WHEN** uma partida simples de tênis termina com vencedor
- **THEN** o histórico de tênis inclui participantes, formato, placar, vencedor e horários de início e fim

#### Scenario: Partida classificatória é concluída
- **WHEN** uma partida de super tie-break de um campeonato termina
- **THEN** o histórico de tênis inclui o resultado e identifica os participantes e o campeonato de origem

#### Scenario: Partida eliminatória é concluída
- **WHEN** uma partida de melhor de três games termina
- **THEN** o histórico preserva o resultado dos games, os pontos dos games disputados, o vencedor e o campeonato de origem

#### Scenario: Campeonato com partidas concluídas é cancelado
- **WHEN** um campeonato é cancelado depois de partidas terem sido concluídas
- **THEN** cada resultado concluído continua no histórico de tênis e associado aos participantes, mesmo que o campeonato esteja cancelado

#### Scenario: Finalização é processada novamente após restauração
- **WHEN** o sistema restaura um estado cuja partida já foi registrada no histórico
- **THEN** o histórico continua contendo somente um registro daquela partida

### Requirement: O usuário deve poder consultar e selecionar partidas concluídas
O sistema SHALL apresentar partidas de tênis concluídas em uma lista selecionável, com estado vazio quando não houver resultados.

#### Scenario: Histórico contém partidas
- **WHEN** o usuário abre o histórico de tênis
- **THEN** o sistema lista os resultados com participantes, placar, formato e data de conclusão

#### Scenario: Usuário seleciona uma partida
- **WHEN** o usuário seleciona um resultado da lista
- **THEN** o sistema exibe detalhes do resultado, incluindo vencedor, placar detalhado e horários de início e fim, e oferece compartilhamento

#### Scenario: Histórico está vazio
- **WHEN** não há partidas concluídas de tênis
- **THEN** o sistema informa que nenhuma partida foi finalizada
