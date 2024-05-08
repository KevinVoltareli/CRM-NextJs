// IdContext.tsx

import { createContext, useContext } from "react";

interface IdContextProps {
  id: string | null;
}

const IdContext = createContext<IdContextProps>({ id: null });

export function useIdContext() {
  return useContext(IdContext);
}

export default IdContext;
