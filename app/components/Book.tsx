import Link from "next/link";
import styles from "./Book.module.css";
import { useState } from "react";
import { updateQuantity } from "@/lib/actions";
import { GiBlackBook } from "react-icons/gi";
import { FiPenTool } from "react-icons/fi";
import toast from "react-hot-toast";

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

type props = {
  book: BookData;
};

const Book: React.FC<props> = ({ book }) => {
  const [quant, setQuant] = useState<number>(book.quantity);

  function handleIncDec(_quantity: number) {
    updateQuantity(book.id, _quantity)
      .then(() => {
        setQuant(_quantity);
      })
      .catch((error) => {
        console.log(error.message);
        toast.error("Couldn't update the quantity😕 Try refreshing the page.", {
          id: "0",
          duration: 5000,
        });
      });
  }

  return (
    <div
      style={{ backgroundColor: quant == 0 ? "#fcd7d7" : "white" }}
      className={styles.aBook}
    >
      <div className={styles.bookRow}>
        <h2>
          <GiBlackBook />
          {book.name}
        </h2>
        <Link href={`/EditBook/${book.id}`}>
          <button className={styles.edit}>Edit</button>
        </Link>
      </div>
      <div className={styles.bookRow}>
        <p>
          <FiPenTool />
          {book.author}
        </p>
        <p>{book.isbn}</p>
      </div>
      <div className={styles.bookRow}>
        <p>{book.genre}</p>
        <div className={styles.quantity}>
          <button
            onClick={() => handleIncDec(quant - 1)}
            disabled={quant === 0}
          >
            -
          </button>
          <p>{quant}</p>
          <button onClick={() => handleIncDec(quant + 1)}>+</button>
        </div>
      </div>
      {!quant && (
        <p className={styles.notAvailable}>
          Availability status: Not available
        </p>
      )}
    </div>
  );
};

export default Book;
