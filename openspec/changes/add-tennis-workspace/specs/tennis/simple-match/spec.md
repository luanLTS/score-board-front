# Spec Delta

## Purpose

Permite registrar partidas de tênis individuais com super tie-break ou com
games tradicionais, aplicando pontuação, saque e condições de vitória próprias.

## ADDED Requirements

### Requirement: A partida simples deve permitir informar os participantes
O sistema SHALL permitir que o usuário informe e edite os nomes dos dois
participantes antes de iniciar a partida simples de tênis.

#### Scenario: Usuário inicia uma partida com nomes personalizados
- **WHEN** o usuário informa dois nomes válidos e inicia a partida
- **THEN** o sistema exibe os nomes escolhidos no placar e os preserva ao restaurar a partida

### Requirement: O histórico de tênis deve ser independente do histórico genérico
O sistema SHALL salvar partidas simples de tênis em um histórico próprio, sem
adicionar `tennis` ao contrato `GameKind` do placar genérico.

#### Scenario: Partida simples de tênis é finalizada
- **WHEN** uma partida de tênis é concluída
- **THEN** o sistema salva participantes, modalidade, placar detalhado e resultado no histórico próprio de tênis

#### Scenario: Histórico genérico é consultado
- **WHEN** o usuário acessa o histórico da área `Placar`
- **THEN** o sistema mantém o contrato e os registros genéricos existentes sem misturar partidas de tênis

### Requirement: A partida de tênis deve sortear o primeiro sacador
O sistema SHALL sortear automaticamente qual participante inicia o saque quando
uma partida de tênis for iniciada e SHALL exibir o resultado do sorteio.

#### Scenario: Partida de super tie-break é iniciada
- **WHEN** o usuário inicia uma partida de tênis
- **THEN** o sistema escolhe aleatoriamente o primeiro sacador e informa o participante escolhido

#### Scenario: A partida é retomada
- **WHEN** o sistema restaura uma partida de tênis em andamento
- **THEN** o sistema preserva o primeiro sacador já definido e não realiza novo sorteio

### Requirement: O super tie-break deve aplicar a pontuação e os saques oficiais
O sistema SHALL aplicar a sequência oficial de saque do super tie-break e SHALL
trocar os lados após cada bloco de seis pontos.

#### Scenario: Primeiro ponto do super tie-break
- **WHEN** o super tie-break começa
- **THEN** o primeiro sacador realiza somente o primeiro ponto

#### Scenario: Segundo e terceiro pontos
- **WHEN** o primeiro ponto termina
- **THEN** o outro participante realiza os dois pontos seguintes

#### Scenario: Pontos posteriores
- **WHEN** os três primeiros pontos já foram disputados
- **THEN** os participantes realizam blocos alternados de dois saques

#### Scenario: Troca de lados
- **WHEN** o total de pontos disputados alcança um múltiplo positivo de seis
- **THEN** o sistema indica que os participantes devem trocar de lado

### Requirement: O super tie-break deve exigir dez pontos e dois de vantagem
O sistema SHALL declarar vencedor o participante que alcançar pelo menos dez
 pontos e tiver dois pontos de vantagem sobre o adversário.

#### Scenario: Vitória ao alcançar dez pontos
- **WHEN** um participante alcança dez pontos e o adversário tem no máximo oito
- **THEN** o sistema encerra o super tie-break e declara esse participante vencedor

#### Scenario: Empate em nove pontos
- **WHEN** o placar chega a `9–9`
- **THEN** o sistema mantém a partida em andamento até que exista uma diferença de dois pontos

#### Scenario: Vitória após o limite inicial
- **WHEN** o placar chega a `11–9` ou a qualquer outro resultado com dois pontos de diferença após dez
- **THEN** o sistema encerra o super tie-break e declara o participante líder vencedor

### Requirement: A partida eliminatória deve usar melhor de três games
O sistema SHALL permitir uma partida eliminatória de tênis em que cada game use
`0`, `15`, `30`, `40` e vantagem, e SHALL declarar vencedor quem ganhar dois
games.

#### Scenario: Participante vence dois games
- **WHEN** um participante vence dois games antes do adversário
- **THEN** o sistema encerra a partida e declara esse participante vencedor

#### Scenario: Game chega a quarenta iguais
- **WHEN** os dois participantes alcançam `40` no mesmo game
- **THEN** o sistema entra em deuce e exige vantagem para vencer o game

#### Scenario: Participante perde a vantagem
- **WHEN** um participante tem vantagem e o adversário vence o ponto seguinte
- **THEN** o game retorna para deuce

