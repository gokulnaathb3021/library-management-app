"use client";
import styles from "../page.module.css";
import { useContext, useRef, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { redirect } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/config";
import { ImPointDown } from "react-icons/im";
import { FirebaseError } from "firebase/app";

export default function Home() {
  const user = useContext(AuthContext);
  if (user) redirect("/books");

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const [errorText, setErrorText] = useState<string>("");
  const [registering, setRegistering] = useState<boolean>(false);

  async function handleRegister() {
    setErrorText("");
    setRegistering(true);
    const email = emailRef.current!.value;
    const password = passwordRef.current!.value;

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setRegistering(false);
    } catch (error) {
      setRegistering(false);
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
            Register your library with us
            <ImPointDown />
          </p>
          <div className={styles.inputsAndButton}>
            <input placeholder="email" type="email" ref={emailRef}></input>
            <input
              placeholder="password"
              type="password"
              ref={passwordRef}
            ></input>
            <button onClick={handleRegister}>Register</button>
            {errorText != "" && <p>{errorText}</p>}
            {registering && <p>Registering your library...</p>}
          </div>
          <p>
            Already having an account? <a href="/">Login</a>
          </p>
        </div>
      </div>
    </div>
  );
}
