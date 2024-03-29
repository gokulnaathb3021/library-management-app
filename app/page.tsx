"use client";
import styles from "./page.module.css";
import { useContext, useRef, useState } from "react";
import { AuthContext } from "./context/AuthContext";
import { redirect } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/config";
import { ImPointDown } from "react-icons/im";
import { FirebaseError } from "firebase/app";

export default function Home() {
  const user = useContext(AuthContext);
  if (user) redirect("/books");

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const [errorText, setErrorText] = useState<string>("");
  const [loggingIn, setLoggingIn] = useState<boolean>(false);

  async function handleLogin() {
    setErrorText("");
    setLoggingIn(true);
    const email = emailRef.current!.value;
    const password = passwordRef.current!.value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setLoggingIn(false);
    } catch (error) {
      setLoggingIn(false);
      if (error instanceof FirebaseError) setErrorText(error.message);
    }
  }
  return (
    <div className={styles.login}>
      <div className={styles.loginContent}>
        <h1>Books Management App</h1>
        <h3>Manage all the books at your library with great ease!</h3>
        <div className={styles.loginForm}>
          <p className={styles.loginFormHeading}>
            Login to your library
            <ImPointDown />
          </p>
          <div className={styles.inputsAndButton}>
            <input placeholder="email" type="email" ref={emailRef}></input>
            <input
              placeholder="password"
              type="password"
              ref={passwordRef}
            ></input>
            <button onClick={handleLogin}>Login</button>
            {errorText && <p>{errorText}</p>}
            {loggingIn && <p>Logging you in...</p>}
          </div>
          <p>
            New user? <a href="/register">Register</a>
          </p>
        </div>
      </div>
    </div>
  );
}
