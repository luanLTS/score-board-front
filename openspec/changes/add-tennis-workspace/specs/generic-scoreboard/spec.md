# Spec Delta

## Purpose

Oferece um placar neutro para registrar partidas simples e resultados de
chaveamentos sem acoplar a interface a regras específicas de um esporte.

## ADDED Requirements

### Requirement: O placar genérico deve controlar dois participantes
O sistema SHALL permitir iniciar uma partida simples com dois participantes,
nomes editáveis e pontuação numérica ajustável pelo usuário.

#### Scenario: Usuário inicia uma partida genérica
- **WHEN** o usuário informa dois participantes na área `Placar`
- **THEN** o sistema cria uma partida com pontuação inicial igual a zero

#### Scenario: Usuário ajusta a pontuação
- **WHEN** o usuário adiciona ou remove pontos de um participante
- **THEN** o sistema atualiza somente a pontuação desse participante

### Requirement: O placar genérico não deve aplicar regras de tênis
O sistema SHALL tratar a pontuação genérica como valores lineares e não SHALL
exigir deuce, vantagem, games, sets ou sequência de saques.

#### Scenario: Usuário registra uma pontuação genérica
- **WHEN** o usuário aumenta a pontuação de um participante
- **THEN** o sistema permite o incremento conforme as regras genéricas vigentes

#### Scenario: Usuário finaliza uma partida genérica
- **WHEN** o usuário encerra uma partida com pontuações diferentes
- **THEN** o sistema registra o participante com maior pontuação como vencedor

### Requirement: O chaveamento genérico deve continuar disponível
O sistema SHALL manter o fluxo atual de criação, execução e avanço de um
chaveamento genérico na área `Placar`.

#### Scenario: Usuário cria um chaveamento genérico
- **WHEN** o usuário cria um torneio genérico com participantes
- **THEN** o sistema gera o chaveamento genérico e disponibiliza os confrontos prontos

#### Scenario: Usuário finaliza um confronto genérico
- **WHEN** o usuário registra o vencedor de um confronto do chaveamento
- **THEN** o sistema avança o vencedor para a próxima posição compatível

