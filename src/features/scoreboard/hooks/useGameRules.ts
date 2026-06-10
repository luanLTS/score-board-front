import { useState } from "react";

import { getGameRules } from "../rules";
import type { GameKind } from "../types";

export const useGameRules = (initialGameKind: GameKind = "generic") => {
  const [gameKind, setGameKind] = useState<GameKind>(initialGameKind);

  return {
    gameKind,
    config: getGameRules(gameKind),
    selectGameKind: setGameKind,
  };
};
