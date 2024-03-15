"use client";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import Header from "../components/Header";
import Link from "next/link";
import { getBooks } from "@/lib/actions";
import SearchBooks from "../components/SearchBooks";
import Pagination from "../components/Pagination";
import BooksList from "../components/BooksList";
import toast from "react-hot-toast";
import styles from "./books.module.css";
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

type BooksProps = {
  searchParams: string;
};

type quote = {
  quote: string;
  author: string;
};

const Books: React.FC<BooksProps> = ({ searchParams }) => {
  const router = useRouter();
  const user = useContext(AuthContext);
  const [books, setBooks] = useState<BookData[]>([]);
  const [count, setCount] = useState<number>(0);
  const [countWithoutq, setCounWithoutq] = useState<number>(0);
  const [quote, setQuote] = useState<quote | null>(null);
  // const q = searchParams?.q || "";
  const q = (searchParams as { q?: string; page?: string })?.q || "";
  const page =
    parseInt((searchParams as { q?: string; page?: string })?.page as string) ||
    1;

  const fetchQuote = () => {
    fetch("https://api.api-ninjas.com/v1/quotes?category=education", {
      method: "GET",
      headers: { "X-Api-Key": `${process.env.NEXT_PUBLIC_QUOTES_API_KEY}` },
    })
      .then((data) => {
        data
          .json()
          .then((content) => {
            setQuote({
              quote: content[0].quote,
              author: content[0].author,
            });
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const fetchBooks = () => {
    toast.loading("Fetching books🚀", { id: "0" });
    getBooks(q, page, user?.email as string)
      .then((data) => {
        setTimeout(() => {
          if (q.length > 0 && data.count === 0) {
            toast.error("No matching books with the entered name found😕", {
              id: "0",
              duration: 5000,
            });
          } else if (q.length === 0 && data.count === 0) {
            toast("You have no books to fetch, add one.", {
              id: "0",
              duration: 5000,
            });
          } else {
            toast.success("Books fetched🚀", { id: "0", duration: 1000 });
          }
          setCount(data.count);
          setBooks(data.books);
          setCounWithoutq(data.countWithoutq);
        }, 600);
      })
      .catch((error) => {
        console.error("Error fetching books:", error);
        if (error instanceof Error)
          toast.error(error.message, { id: "0", duration: 5000 });
        else toast.error("Error fetching books😕", { id: "0", duration: 5000 });
      });
  };

  useEffect(() => {
    if (!user) {
      router.push("/");
    } else {
      fetchBooks();
    }
  }, [user, q, page]);

  useEffect(() => {
    fetchQuote();
  }, []);

  return (
    <div className={styles.books}>
      <Header />
      <div className={styles.quote}>
        <div className={styles.quoteBox}>
          <p>"{quote?.quote}"</p>
          <p>-{quote?.author}</p>
        </div>
      </div>
      <div className={styles.booksTsx}>
        <div className={styles.booksTsxContent}>
          <Link
            href="/AddBook"
            style={{ textDecoration: "none", color: "white", width: "100%" }}
          >
            <button className={styles.addBookButton}>
              CLICK TO ADD A NEW BOOK
            </button>
          </Link>
          <SearchBooks countWithoutq={countWithoutq} />
          {books.length !== 0 && <BooksList books={books} />}
          <Pagination count={count} />
        </div>
      </div>
      {/* <Toaster /> */}
    </div>
  );
};

export default Books;
