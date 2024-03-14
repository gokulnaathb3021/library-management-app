"use client";

import { auth } from "@/firebase/config";
import { signOut } from "firebase/auth";

const Signout: React.FC = () => {
  return (
    <button
      onClick={() => {
        signOut(auth);
      }}
    >
      Signout
    </button>
  );
};

export default Signout;
