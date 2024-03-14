"use client";
import { deleteBook, fetchById, updateBookById } from "@/lib/actions";
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
  }, []);
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
  const updateBook = (formData: FormData) => {
    toast.loading("Updating book🚀", { id: "2" });
    updateBookById(formData, book?.id as string)
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
            <input type="hidden" value={book?.id} name="id"></input>
            <input
              type="hidden"
              value={user?.email as string}
              name="email"
            ></input>
            <input
              type="text"
              placeholder="Book's name"
              name="name"
              defaultValue={book?.name || ""}
              required
            ></input>
          </div>
          <div className={styles.editFormRow}>
            <input
              type="text"
              placeholder="Author's name"
              name="author"
              defaultValue={book?.author || ""}
              required
            ></input>
            <input
              type="text"
              placeholder="Genre"
              name="genre"
              defaultValue={book?.genre || ""}
              required
            ></input>
          </div>
          <div className={styles.editFormRow}>
            <input
              type="text"
              placeholder="13 digit ISBN Number"
              name="isbn"
              defaultValue={book?.isbn || ""}
              required
            ></input>
            <input
              type="number"
              placeholder="Quantity"
              name="quantity"
              min={0}
              defaultValue={book?.quantity || ""}
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
