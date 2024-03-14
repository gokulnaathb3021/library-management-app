import Book from "./Book";

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
  books: BookData[];
};

const BooksList: React.FC<props> = ({ books }) => {
  return (
    <div>
      {books.map((book) => (
        <Book book={book} key={book.id} />
      ))}
    </div>
  );
};

export default BooksList;
