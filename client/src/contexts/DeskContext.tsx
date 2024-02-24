import React, { useEffect } from "react";
import { HtmlHTMLAttributes, createContext, useContext, useState } from "react";
import { Desk } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { getDesks } from "@/lib/utils";


export const DeskContext = createContext<Desk | null>(null)
export const SetDeskContext = createContext<(desk: Desk | null) => void>(() => {})

export function DeskProvider({children}: HtmlHTMLAttributes<HTMLElement>) {
  const [desk, setDesk] = useState<Desk | null>(null)

  const {data: desks} = useQuery({
    queryKey: ["desks"],
    queryFn: getDesks
  })

  useEffect(() => {
    if (!desks) return

    const localStorageDeskId = localStorage.getItem("deskId")

    if (localStorageDeskId) {
      
      setDesk(localStorageDesk)
    }
  }, [desks])

  return (
    <DeskContext.Provider value={desk}>
      <SetDeskContext.Provider value={setDesk}>
      {children}
      </SetDeskContext.Provider>
    </DeskContext.Provider>
  )
}

export function useDesk() {
  return useContext(DeskContext)
}

export function useSetDesk() {
  return useContext(SetDeskContext)
}