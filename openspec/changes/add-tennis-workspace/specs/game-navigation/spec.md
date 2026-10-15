# Spec Delta

## Purpose

Organiza a aplicação em áreas de produto independentes, permitindo que o
usuário escolha entre o placar genérico e a experiência especializada de tênis.

## ADDED Requirements

### Requirement: O usuário deve poder escolher a área principal da aplicação
O sistema SHALL apresentar uma navegação principal com as áreas `Placar` e
`Tênis`, mantendo uma indicação clara da área atualmente selecionada.

#### Scenario: Usuário entra na área de tênis
- **WHEN** o usuário seleciona `Tênis` na navegação principal
- **THEN** o sistema exibe o workspace de tênis e suas opções específicas

#### Scenario: Usuário retorna ao placar genérico
- **WHEN** o usuário seleciona `Placar` na navegação principal
- **THEN** o sistema exibe a experiência genérica de partidas e chaveamentos

### Requirement: Cada área deve exibir somente suas opções de produto
O sistema SHALL manter as opções de tênis separadas das opções do placar
genérico, sem exigir que o placar genérico conheça regras específicas de tênis.

#### Scenario: Workspace de tênis está ativo
- **WHEN** a área selecionada é `Tênis`
- **THEN** o sistema oferece acesso a partida simples, ranking de tênis e campeonato de tênis

#### Scenario: Área genérica está ativa
- **WHEN** a área selecionada é `Placar`
- **THEN** o sistema oferece acesso a partida simples genérica e chaveamento genérico

### Requirement: A navegação deve preservar o uso existente do placar
O sistema SHALL manter disponíveis as partidas simples, o histórico e o
chaveamento genérico existentes ao introduzir a área de tênis.

#### Scenario: Usuário utiliza um chaveamento genérico após a mudança
- **WHEN** o usuário acessa `Placar` e inicia um chaveamento genérico
- **THEN** o fluxo genérico permanece utilizável sem exigir configuração de tênis

