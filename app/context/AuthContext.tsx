import { ReactNode, createContext, useEffect, useState } from "react";
import firebase, { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/config";

export const AuthContext = createContext<firebase.User | null>(null); // schema of the state we're going to manage with the Context API.

type providerPropsType = {
  children: ReactNode;
};

export const AuthProvider: React.FC<providerPropsType> = ({ children }) => {
  const [user, setUser] = useState<firebase.User | null>(null); // the actual state whose schema we defined earlier.

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return unsubscribe;
  }, []);
  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
};
