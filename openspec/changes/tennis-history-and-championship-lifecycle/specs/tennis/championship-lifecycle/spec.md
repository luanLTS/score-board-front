# Spec Delta

## Purpose

Define como o usuário encerra um campeonato de tênis em andamento e inicia campeonatos subsequentes sem perder o acesso aos resultados anteriores.

## ADDED Requirements

### Requirement: O usuário pode cancelar um campeonato em andamento
O sistema SHALL oferecer o cancelamento de um campeonato ativo e SHALL registrar seu estado terminal como cancelado.

#### Scenario: Usuário confirma o cancelamento
- **WHEN** o usuário confirma o cancelamento de um campeonato em andamento
- **THEN** o campeonato passa ao status cancelado, deixa de aceitar novas partidas e fica disponível no histórico de campeonatos

#### Scenario: Usuário desiste do cancelamento
- **WHEN** o usuário inicia o cancelamento e escolhe não confirmá-lo
- **THEN** o campeonato permanece inalterado e pode continuar

#### Scenario: Campeonato já está encerrado
- **WHEN** o campeonato está finalizado ou cancelado
- **THEN** a ação de cancelar não é oferecida

### Requirement: O usuário pode iniciar um novo campeonato após um estado terminal
O sistema SHALL permitir criar um novo campeonato quando o atual estiver finalizado ou cancelado.

#### Scenario: Novo campeonato após finalização
- **WHEN** o campeonato atual termina e o usuário escolhe iniciar outro
- **THEN** o sistema inicia o fluxo de configuração de um novo campeonato sem remover o campeonato anterior do histórico

#### Scenario: Novo campeonato após cancelamento
- **WHEN** o campeonato atual está cancelado e o usuário escolhe iniciar outro
- **THEN** o sistema inicia o fluxo de configuração de um novo campeonato sem remover o campeonato cancelado nem as partidas concluídas dos participantes

#### Scenario: Campeonato está em andamento
- **WHEN** o usuário tenta iniciar outro campeonato enquanto existe um campeonato ativo
- **THEN** o sistema mantém o campeonato atual e exige que ele seja concluído ou cancelado antes de criar outro
