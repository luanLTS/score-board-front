import { NewMatchForm } from "../../matches/components/NewMatchForm";

type TennisMatchSetupProps = {
  onStart: (participants: { first: string; second: string }) => void;
};

export function TennisMatchSetup({ onStart }: TennisMatchSetupProps) {
  return (
    <NewMatchForm
      onSubmit={({ participantOneName, participantTwoName }) => onStart({
        first: participantOneName,
        second: participantTwoName,
      })}
    />
  );
}
