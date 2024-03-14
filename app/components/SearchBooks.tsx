"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import styles from "./SearchBooks.module.css";

type searchPropsType = {
  countWithoutq: number;
};

const SearchBooks: React.FC<searchPropsType> = ({ countWithoutq }) => {
  const { replace } = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const handleSearch = useDebouncedCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const params = new URLSearchParams(searchParams);

      //   Whenever we change our input, first page should be shown.
      params.set("page", "1");
      if (e.target.value) {
        e.target.value.length > 2 && params.set("q", e.target.value);
      } else {
        params.delete("q");
      }
      replace(`${pathname}?${params}`);
    },
    600
  );
  return (
    <div className={styles.inputContainer}>
      <input
        readOnly={countWithoutq === 0}
        placeholder={
          countWithoutq === 0
            ? "No books to search for"
            : "Search by book's name"
        }
        style={{ display: "block" }}
        onChange={handleSearch}
      ></input>
    </div>
  );
};

export default SearchBooks;
