"use client";
import {
  deleteBook,
  fetchById,
  thisIsbnAlreadyExists,
  updateBookById,
} from "@/lib/actions";
import { useParams, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import styles from "./EditBook.module.css";
import Header from "@/app/components/Header";
import { AuthContext } from "@/app/context/AuthContext";
// import { Toaster } from "react-hot-toast";

type BookData = {
  id: string;
  email: string;
  name: string;
  author: string;
  genre: string;
  isbn: string;
  quantity: number;
  date: Date;
};
const EditBook: React.FC = () => {
  const user = useContext(AuthContext);
  useEffect(() => {
    if (!user) router.push("/");
  }, [user]);
  const { id } = useParams();
  const [book, setBook] = useState<BookData | null>(null);
  function fetchBook(id: string) {
    toast.loading("Fetching book🚀", { id: "1" });
    fetchById(id)
      .then((data) => {
        setTimeout(() => {
          setBook(data);
          toast.success("Book fetched🚀", { id: "1", duration: 500 });
        }, 500);
      })
      .catch((error) => {
        toast.error(error.message, { id: "1", duration: 50000 });
      });
  }
  useEffect(() => {
    fetchBook(id as string);
  }, []);

  const router = useRouter();

  function isEmpty(s: string) {
    if (s.trim() === "") return true;
  }
  const updateBook = async (formData: FormData) => {
    const { email, name, author, genre, isbn, quantity } =
      Object.fromEntries(formData);

    const isbnString = isbn?.toString() ?? "";
    if (isEmpty(isbnString)) {
      toast.error("isbn number is empty, it can't be so!", {
        id: "7",
        duration: 5000,
      });
      return;
    } else if (isbnString.length !== 13) {
      toast.error("isbn number should be exactly 13 digits long!", {
        id: "8",
        duration: 5000,
      });
      return;
    }
    const emailString = email?.toString() ?? "";
    if (isEmpty(emailString)) {
      toast.error("email is empty, it can't be so!", {
        id: "9",
        duration: 5000,
      });
      return;
    }

    const exist = await thisIsbnAlreadyExists(
      isbnString,
      emailString,
      book?.id as string
    );
    if (exist) {
      toast.error("Book with this ISBN already exists in your library!", {
        id: "10",
        duration: 5000,
      });
      return;
    }

    const nameString = name?.toString() ?? "";
    if (isEmpty(nameString)) {
      toast.error("book's name is empty, it can't be so!", {
        id: "4",
        duration: 5000,
      });
      return;
    }
    const authorString = author?.toString() ?? "";
    if (isEmpty(authorString)) {
      toast.error("author's name is empty, it can't be so!", {
        id: "5",
        duration: 5000,
      });
      return;
    }
    const genreString = genre?.toString() ?? "";
    if (isEmpty(genreString)) {
      toast.error("genre is empty, it can't be so!", {
        id: "6",
        duration: 5000,
      });
      return;
    }

    const quantityString = quantity?.toString() ?? "";
    if (isEmpty(quantityString)) {
      toast.error("please specify the number of books", {
        id: "11",
        duration: 5000,
      });
      return;
    }

    const quantityInt = parseInt(quantityString);

    toast.loading("Updating book🚀", { id: "2" });
    updateBookById(
      nameString,
      authorString,
      genreString,
      isbnString,
      quantityInt,
      book?.id as string
    )
      .then(() => {
        setTimeout(() => {
          toast.success("Book updated🚀", { id: "2" });
          setTimeout(() => {
            router.push("/books");
          }, 500);
        }, 500);
      })
      .catch((error) => {
        toast.error(error.message, { id: "2", duration: 50000 });
      });
  };

  const delete_book = (id: string) => {
    toast.loading("Deleting book🚀", { id: "3" });
    deleteBook(id)
      .then(() => {
        setTimeout(() => {
          toast.success("Book deleted🚮", { id: "3" });
          setTimeout(() => {
            router.push("/books");
          }, 500);
        }, 500);
      })
      .catch((error) => {
        toast.error(error.message, { id: "3", duration: 50000 });
      });
  };
  return (
    <div className={styles.editBookTsx}>
      <Header />
      <div className={styles.editBookContent}>
        <h1>MAKE YOUR EDITS THROUGH THIS FORM</h1>
        <form action={updateBook} className={styles.editForm}>
          <div className={styles.editFormRow}>
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
              defaultValue={book?.name || ""}
            ></input>
          </div>
          <div className={styles.editFormRow}>
            <input
              type="text"
              placeholder="Author's name"
              name="author"
              defaultValue={book?.author || ""}
            ></input>
            <input
              type="text"
              placeholder="Genre"
              name="genre"
              defaultValue={book?.genre || ""}
            ></input>
          </div>
          <div className={styles.editFormRow}>
            <input
              type="text"
              placeholder="13 digit ISBN Number"
              name="isbn"
              defaultValue={book?.isbn || ""}
            ></input>
            <input
              type="number"
              placeholder="Quantity"
              name="quantity"
              min={0}
              defaultValue={book?.quantity || ""}
            ></input>
          </div>
          <div className={styles.buttons}>
            <button
              type="button"
              onClick={() => {
                router.push("/books");
              }}
            >
              Back
            </button>
            <button type="submit">Update</button>
            <button type="button" onClick={() => delete_book(id as string)}>
              Delete
            </button>
          </div>
        </form>
      </div>
      {/* <Toaster /> */}
    </div>
  );
};

export default EditBook;
