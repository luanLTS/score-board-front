# Proposal

## Why

A experiência de tênis ainda não acompanha o comportamento que os usuários já têm no placar genérico: partidas de torneio não aparecem no histórico geral de tênis, não alimentam um ranking global por participante e campeonatos não podem ser consultados após terminar ou cancelar. Esta mudança fecha essas lacunas para que o tênis tenha o mesmo ciclo de consulta e continuidade do placar, preservando suas regras próprias de pontuação.

## What Changes

- Registrar no histórico de tênis toda partida concluída, seja simples, classificatória ou eliminatória, com participantes, formato, placar, vencedor e datas.
- Derivar ranking e estatísticas globais dos participantes a partir das partidas concluídas de tênis, incluindo as partidas jogadas em campeonatos posteriormente cancelados.
- Manter um histórico de campeonatos finalizados e cancelados, com status, participantes, classificação, chave e resultados disponíveis.
- Permitir cancelar um campeonato em andamento e iniciar outro depois que o campeonato atual terminar ou for cancelado.
- Permitir iniciar um novo campeonato após o encerramento do atual sem apagar o histórico de partidas nem o histórico de campeonatos anteriores.
- Alinhar os pontos de entrada, estados vazios, seleção e detalhes de histórico e ranking à experiência genérica, usando os dados e regras de resultado próprios do tênis.

## Fora de escopo

- Alterar pontuação de super tie-break, games, saque, vantagem ou chaveamento.
- Misturar partidas de tênis com o histórico ou ranking da área `Placar`.
- Sincronizar dados entre dispositivos ou adicionar backend/contas.
- Permitir editar resultados depois de concluídos ou restaurar campeonato cancelado.

## Capabilities

### New Capabilities

- `tennis/match-history`: histórico único de partidas concluídas de tênis em todos os contextos e formatos.
- `tennis/player-ranking`: ranking e estatísticas globais por participante, calculados sobre o histórico de partidas de tênis.
- `tennis/championship-history`: consulta de campeonatos finalizados e cancelados, preservando seus resultados.
- `tennis/championship-lifecycle`: cancelamento de campeonato e criação de um novo campeonato após término ou cancelamento.

### Modified Capabilities

Nenhuma. O projeto ainda não possui especificações principais arquivadas; as capacidades acima passam a definir os comportamentos novos do workspace de tênis.

## Impact

- A área `Tênis` e seus históricos locais passarão a incluir partidas de campeonatos e a apresentar ranking/estatísticas derivados desses resultados.
- A persistência local de campeonatos precisará conservar snapshots finalizados e cancelados, além do campeonato atual.
- A área `Placar`, seus contratos genéricos e suas chaves de armazenamento devem continuar funcionando sem alterações observáveis.
- Não são necessárias dependências externas; a implementação deve seguir a arquitetura React/TypeScript e armazenamento local existente.
