import { useEffect } from "react";
import { HtmlHTMLAttributes, createContext, useContext, useState } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

export const DeskIdContext = createContext<number | null>(null);
export const SetDeskIdContext = createContext<(desk: number | null) => void>(
  () => {},
);

export function DeskProvider({ children }: HtmlHTMLAttributes<HTMLElement>) {
  // const [deskId, setDeskId] = useState<number | null>(null)

  // useEffect(() => {
  //   const localStorageDeskId = localStorage.getItem("deskId")
  //   if (localStorageDeskId) {
  //     setDeskId(JSON.parse(localStorageDeskId))
  //   }
  // }, [])

  // useEffect(() => {
  //   if (!deskId) return
  //   localStorage.setItem("deskId", JSON.stringify(deskId))
  // }, [deskId])

  const [deskId, setDeskId] = useLocalStorage<number | null>(null, "deskId");

  return (
    <DeskIdContext.Provider value={deskId}>
      <SetDeskIdContext.Provider value={setDeskId}>
        {children}
      </SetDeskIdContext.Provider>
    </DeskIdContext.Provider>
  );
}

export function useDeskId() {
  return useContext(DeskIdContext);
}

export function useSetDeskId() {
  return useContext(SetDeskIdContext);
}
