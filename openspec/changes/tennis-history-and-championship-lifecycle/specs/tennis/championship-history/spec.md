# Spec Delta

## Purpose

Define o arquivo local de campeonatos de tênis encerrados, permitindo consultar campeonatos finalizados ou cancelados e os resultados que permaneceram registrados.

## ADDED Requirements

### Requirement: Campeonatos finalizados e cancelados devem permanecer consultáveis
O sistema SHALL manter um histórico local separado do campeonato atual para cada campeonato finalizado ou cancelado.

#### Scenario: Campeonato termina
- **WHEN** a final do campeonato é concluída
- **THEN** o sistema registra o campeonato como finalizado com participantes, classificação, chave, resultados e campeão

#### Scenario: Campeonato é cancelado
- **WHEN** o usuário cancela um campeonato em andamento
- **THEN** o sistema registra o campeonato como cancelado com participantes, fase atual, chave e resultados concluídos até o cancelamento

#### Scenario: Usuário consulta o histórico de campeonatos
- **WHEN** existem campeonatos finalizados ou cancelados
- **THEN** o sistema lista esses campeonatos do mais recente para o mais antigo e indica claramente o status de cada um

#### Scenario: Usuário abre um campeonato do histórico
- **WHEN** o usuário seleciona um campeonato arquivado
- **THEN** o sistema exibe seus participantes e resultados preservados, sem oferecer ações para retomar ou alterar confrontos

#### Scenario: Histórico de campeonatos está vazio
- **WHEN** nenhum campeonato foi finalizado ou cancelado
- **THEN** o sistema informa que ainda não há campeonatos no histórico

### Requirement: O cancelamento deve preservar partidas concluídas e descartar o confronto incompleto
O sistema SHALL manter no histórico de partidas cada confronto concluído antes do cancelamento e SHALL excluir do histórico qualquer confronto que ainda estava em andamento ou pendente.

#### Scenario: Campeonato é cancelado durante uma partida
- **WHEN** o usuário cancela o campeonato enquanto um confronto está em andamento
- **THEN** resultados de confrontos concluídos permanecem no histórico e o placar incompleto não é apresentado como partida concluída

#### Scenario: Campeonato é cancelado antes das eliminatórias
- **WHEN** o usuário cancela durante uma fase classificatória
- **THEN** partidas classificatórias já concluídas permanecem no histórico individual e no arquivo do campeonato
