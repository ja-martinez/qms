import { useState, useEffect, Dispatch, SetStateAction } from "react";

export function useLocalStorage<StateType>(
  initialState: StateType,
  name: string,
): [StateType, Dispatch<SetStateAction<StateType>>] {
  const [state, setState] = useState<StateType>(initialState);

  useEffect(() => {
    const localStorageDeskId = localStorage.getItem(name);
    if (localStorageDeskId) {
      setState(JSON.parse(localStorageDeskId));
    }
  }, [name]);

  useEffect(() => {
    if (!state) return;
    localStorage.setItem(name, JSON.stringify(state));
  }, [name, state]);

  return [state, setState];
}
