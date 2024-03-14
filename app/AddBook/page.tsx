"use client";

import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { addBook } from "@/lib/actions";
import toast from "react-hot-toast";
import Header from "../components/Header";
import styles from "./AddBook.module.css";
import { Toaster } from "react-hot-toast";

const AddBook: React.FC = () => {
  const router = useRouter();
  const user = useContext(AuthContext);
  useEffect(() => {
    if (!user) router.push("/");
  }, []);

  function add(formData: FormData) {
    toast.loading("Adding book🚀", { id: "0" });
    addBook(formData)
      .then(() => {
        setTimeout(() => {
          toast.success("Book added🚀", { id: "0" });
          setTimeout(() => {
            router.push("/books");
          }, 1000);
        }, 1000);
      })
      .catch((error) => {
        toast.error(error.message, { id: "0", duration: 6000 });
      });
  }

  return (
    <div className={styles.addBookTsx}>
      <Header />
      <div className={styles.addBookContent}>
        <h1>FILL IN THE DETAILS OF THE BOOK</h1>
        <form action={add} className={styles.addForm}>
          <div className={styles.addFormRow}>
            <input
              type="hidden"
              value={user?.email as string}
              name="email"
              required
            ></input>
            <input
              type="text"
              placeholder="Book's name"
              name="name"
              required
              className={styles.nameInput}
            ></input>
          </div>
          <div className={styles.addFormRow}>
            <input
              type="text"
              placeholder="Author's name"
              name="author"
              required
            ></input>
            <input
              type="text"
              placeholder="Genre"
              name="genre"
              required
            ></input>
          </div>
          <div className={styles.addFormRow}>
            <input
              type="text"
              placeholder="13 digit ISBN Number"
              name="isbn"
              required
            ></input>
            <input
              type="number"
              placeholder="Quantity"
              name="quantity"
              min={1}
              required
            ></input>
          </div>
          <div className={styles.buttons}>
            <button
              type="button"
              onClick={() => {
                router.push("/books");
              }}
            >
              GO BACK
            </button>
            <button type="submit">ADD BOOK</button>
          </div>
        </form>
      </div>
      <Toaster />
    </div>
  );
};

export default AddBook;
