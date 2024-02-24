import {
  createContext,
  useContext,
  useSyncExternalStore,
  useState,
  useEffect,
} from "react";
import { auth } from "@/firebase";
import { onAuthStateChanged, User } from "firebase/auth";

export const isInitializingContext = createContext<boolean>(true);
export const UserContext = createContext<User | null>(null);

export function UserProvider({ children }: React.HTMLAttributes<HTMLElement>) {
  const [isInitializing, setIsInitializing] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (isInitializing) {
        setIsInitializing(false)
      }
      setUser(user);
    });

    return unsubscribe;
  }, []);

  return (
    <isInitializingContext.Provider value={isInitializing}>
      <UserContext.Provider value={user}>{children}</UserContext.Provider>
    </isInitializingContext.Provider>
  );

  // return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

export function useUser() {
  return useContext(UserContext);
}

export function useIsInitializing() {
  return useContext(isInitializingContext);
}
