const players = [
  { id: "home", name: "Jogador 1", score: 0 },
  { id: "away", name: "Jogador 2", score: 0 },
] as const;

export function App() {
  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-6 text-zinc-50">
      <section className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-5xl flex-col justify-center gap-6">
        <header className="space-y-2">
          <p className="text-sm font-medium uppercase tracking-wide text-emerald-300">
            Score Board
          </p>
          <h1 className="text-3xl font-bold sm:text-5xl">Placar da partida</h1>
        </header>

        <div className="grid gap-4 sm:grid-cols-2">
          {players.map((player) => (
            <article
              className="rounded-lg border border-zinc-800 bg-zinc-900 p-5 shadow-xl shadow-black/20"
              key={player.id}
            >
              <label
                className="block text-sm font-medium text-zinc-400"
                htmlFor={`${player.id}-name`}
              >
                Participante
              </label>
              <input
                className="mt-2 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-3 text-lg font-semibold text-zinc-50 outline-none transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-300/30"
                defaultValue={player.name}
                id={`${player.id}-name`}
              />

              <div className="my-8 text-center text-8xl font-black tabular-nums">
                {player.score}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button className="rounded-md border border-zinc-700 px-4 py-4 text-2xl font-bold transition hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-emerald-300">
                  -
                </button>
                <button className="rounded-md bg-emerald-400 px-4 py-4 text-2xl font-bold text-zinc-950 transition hover:bg-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-200">
                  +
                </button>
              </div>
            </article>
          ))}
        </div>

        <button className="self-stretch rounded-md border border-zinc-700 px-4 py-4 font-semibold transition hover:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-300 sm:self-center sm:px-8">
          Resetar placar
        </button>
      </section>
    </main>
  );
}
