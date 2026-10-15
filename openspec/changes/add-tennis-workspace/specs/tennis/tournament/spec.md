# Spec Delta

## Purpose

Permite organizar campeonatos de tênis com turnos classificatórios acumulados e
uma fase eliminatória determinada pelo ranking final dos participantes.

## ADDED Requirements

### Requirement: O campeonato deve organizar turnos completos
O sistema SHALL representar um turno como um ciclo em que cada participante
enfrenta cada outro participante uma vez.

#### Scenario: Primeiro turno é iniciado
- **WHEN** o usuário inicia um campeonato de tênis com participantes individuais
- **THEN** o sistema cria as partidas necessárias para que todos se enfrentem uma vez

#### Scenario: Novo turno é iniciado
- **WHEN** o usuário escolhe jogar outro turno após fechar o anterior
- **THEN** o sistema cria novamente as partidas de todos contra todos

### Requirement: O turno só pode ser fechado após todas as partidas
O sistema SHALL impedir o fechamento de um turno enquanto existir partida
classificatória não finalizada.

#### Scenario: Ainda existem partidas pendentes
- **WHEN** o usuário tenta fechar um turno com alguma partida em andamento ou pendente
- **THEN** o sistema mantém o turno aberto e informa que todas as partidas precisam terminar

#### Scenario: Todas as partidas foram finalizadas
- **WHEN** todas as partidas do turno possuem resultado
- **THEN** o sistema permite fechar o turno e exibe o ranking acumulado

### Requirement: O ranking deve acumular resultados entre turnos
O sistema SHALL somar os resultados de todos os turnos fechados sem reiniciar a
classificação ao iniciar um novo turno.

#### Scenario: Participante vence partidas em turnos diferentes
- **WHEN** um participante obtém vitórias em mais de um turno
- **THEN** suas vitórias e o saldo total de pontos são acumulados no ranking do campeonato

#### Scenario: Usuário escolhe outro turno
- **WHEN** o usuário inicia um novo turno
- **THEN** o ranking anterior permanece armazenado e continua sendo atualizado com os novos resultados

### Requirement: O ranking deve aplicar critérios de desempate determinísticos
O sistema SHALL ordenar participantes por vitórias, saldo total de pontos,
confronto direto e, persistindo o empate, sorteio.

#### Scenario: Participantes têm números diferentes de vitórias
- **WHEN** o ranking é calculado
- **THEN** o participante com mais vitórias aparece primeiro

#### Scenario: Participantes empatam em vitórias
- **WHEN** dois ou mais participantes têm o mesmo número de vitórias
- **THEN** o sistema aplica os critérios seguintes na ordem definida

#### Scenario: Empate persiste após os critérios numéricos
- **WHEN** os critérios de saldo total de pontos e confronto direto não resolvem o empate
- **THEN** o sistema realiza um sorteio e registra a ordem resultante

### Requirement: O usuário deve escolher quando avançar para as eliminatórias
O sistema SHALL oferecer, após o fechamento de cada turno, as opções de iniciar
outro turno ou avançar para a fase eliminatória.

#### Scenario: Usuário continua a classificação
- **WHEN** o usuário escolhe iniciar outro turno
- **THEN** o campeonato permanece na fase classificatória e cria o próximo turno

#### Scenario: Usuário encerra a classificação
- **WHEN** o usuário escolhe avançar para as eliminatórias
- **THEN** o sistema congela o ranking classificatório e gera o chaveamento eliminatório

### Requirement: O chaveamento deve usar a classificação final
O sistema SHALL incluir todos os participantes nas eliminatórias e SHALL parear o
melhor colocado contra o pior colocado, seguindo essa regra até formar todos os
confrontos possíveis.

#### Scenario: Quatro participantes avançam
- **WHEN** a fase classificatória termina com quatro participantes
- **THEN** o sistema cria os confrontos `1º × 4º` e `2º × 3º`

#### Scenario: Quantidade de participantes não é potência de dois
- **WHEN** todos os participantes avançam e a quantidade não forma um bracket completo
- **THEN** o sistema usa byes para completar o chaveamento sem eliminar um participante por sorteio

#### Scenario: Confrontos têm classificação definida
- **WHEN** o chaveamento é gerado
- **THEN** os confrontos são determinísticos e não são sorteados novamente

### Requirement: O campeonato deve preservar a separação entre classificação e eliminatórias
O sistema SHALL usar super tie-break nas partidas classificatórias e melhor de
três games nas partidas eliminatórias.

#### Scenario: Partida classificatória é criada
- **WHEN** o sistema cria uma partida dentro de um turno
- **THEN** a partida usa as regras de super tie-break

#### Scenario: Partida eliminatória é criada
- **WHEN** o sistema cria um confronto a partir do chaveamento
- **THEN** a partida usa as regras de melhor de três games com vantagem

