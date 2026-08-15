import type { FinishedMatch } from "../matches/types";

const gameKindLabels: Record<FinishedMatch["gameKind"], string> = {
  generic: "Genérico",
  truco: "Truco",
  fifa: "Fifa",
};

export type ResultDateFormatter = (value: Date | string) => string;

const defaultDateFormatter: ResultDateFormatter = (value) =>
  new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));

export function formatResultShareText(
  match: FinishedMatch,
  formatDate: ResultDateFormatter = defaultDateFormatter,
): string {
  const [first, second] = match.participants;
  const winnerId =
    match.result?.type === "winner" ? match.result.winnerId : match.winnerId;
  const winner = winnerId
    ? match.participants.find((participant) => participant.id === winnerId)
    : undefined;
  const result = match.result?.type === "draw"
    ? "Resultado: empate"
    : winner
      ? `Vencedor: ${winner.name}`
      : "Resultado: não informado";

  return [
    "Resultado da partida",
    `${first.name} ${first.score} x ${second.score} ${second.name}`,
    `Jogo: ${gameKindLabels[match.gameKind]}`,
    `Data: ${formatDate(match.finishedAt)}`,
    result,
  ].join("\n");
}
