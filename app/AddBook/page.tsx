"use client";

import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { addBook, thisAlreadyExists } from "@/lib/actions";
import toast from "react-hot-toast";
import Header from "../components/Header";
import styles from "./AddBook.module.css";
// import { Toaster } from "react-hot-toast";

const AddBook: React.FC = () => {
  const router = useRouter();
  const user = useContext(AuthContext);
  useEffect(() => {
    if (!user) router.push("/");
  }, [user]);

  function isEmpty(s: string) {
    if (s.trim() === "") return true;
  }

  async function add(formData: FormData) {
    const { email, name, author, genre, isbn, quantity } =
      Object.fromEntries(formData);
    var isbnString = isbn?.toString() ?? "";
    if (isEmpty(isbnString)) {
      toast.error("isbn number is empty, it can't be so!", {
        id: "1",
        duration: 3000,
      });
      return;
    } else if (isbnString.length !== 13) {
      toast.error("isbn number should be exactly 13 digits long!", {
        id: "2",
        duration: 3000,
      });
      return;
    }
    const emailString = email.toString() ?? "";
    if (isEmpty(emailString)) {
      toast.error("email is empty, it can't be so!", { id: "4" });
      return;
    }
    const exist = await thisAlreadyExists(isbnString, emailString);
    if (exist) {
      toast.error(
        "isbn number not unique: Book with this isbn number already exists in your library!",
        { id: "3", duration: 3000 }
      );
      return;
    }
    const nameString = name.toString() ?? "";
    if (isEmpty(nameString)) {
      toast.error("book's name is empty, it can't be so!", { id: "5" });
      return;
    }
    const authorString = author.toString() ?? "";
    if (isEmpty(authorString)) {
      toast.error("author's name is empty, it can't be so!", { id: "6" });
      return;
    }
    const quantityString = quantity.toString() ?? "";
    if (isEmpty(quantityString)) {
      toast.error("please specify the number of books you want to add!", {
        id: "7",
      });
      return;
    }
    const quantityInt = parseInt(quantityString);
    const genreString = genre.toString() ?? "";
    if (isEmpty(genreString)) {
      toast.error("genre is empty, it can't be so!", { id: "8" });
      return;
    }

    toast.loading("Adding book🚀", { id: "0" });
    addBook(
      emailString,
      nameString,
      authorString,
      genreString,
      isbnString,
      quantityInt
    )
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
              className={styles.nameInput}
            ></input>
          </div>
          <div className={styles.addFormRow}>
            <input
              type="text"
              placeholder="Author's name"
              name="author"
            ></input>
            <input type="text" placeholder="Genre" name="genre"></input>
          </div>
          <div className={styles.addFormRow}>
            <input
              type="text"
              placeholder="13 digit ISBN Number"
              name="isbn"
            ></input>
            <input
              type="number"
              placeholder="Quantity"
              name="quantity"
              min={1}
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
      {/* <Toaster /> */}
    </div>
  );
};

export default AddBook;
