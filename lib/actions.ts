"use server";

import prisma from "@/prisma";
import { connect } from "@/util/db";

function validityCheck(s: string, field: string) {
  if (s.trim() === "") throw new Error(`${field} is empty! It can't be so!`);
  if (field === "isbn" && s.length !== 13)
    throw new Error(
      "Invalid ISBN number! ISBN number should be 13 digits long!"
    );
}

export async function addBook(formData: FormData) {
  try {
    await connect();
    const { email, name, author, genre, isbn, quantity } =
      Object.fromEntries(formData);
    var isbnString = isbn?.toString() ?? "";
    validityCheck(isbnString, "isbn");
    const bookExists = await prisma.book.findFirst({
      where: {
        isbn: isbnString,
      },
    });
    if (bookExists) throw new Error("Book with this ISBN already exists!");
    const emailString = email?.toString() ?? "";
    validityCheck(emailString, "email");
    const nameString = name?.toString() ?? "";
    validityCheck(nameString, "name");
    const authorString = author?.toString() ?? "";
    validityCheck(authorString, "author");
    const genreString = genre?.toString() ?? "";
    validityCheck(genreString, "genre");
    const quantityString = quantity?.toString() ?? "";
    validityCheck(quantityString, "quantity");
    const quantityInt = parseInt(quantityString);
    await prisma.book.create({
      data: {
        email: emailString,
        name: nameString,
        author: authorString,
        genre: genreString,
        isbn: isbnString,
        quantity: quantityInt,
      },
    });
  } catch (error) {
    if (error instanceof Error) throw new Error(error.message);
    else throw new Error("Some error, couldn't add the book!");
  }
}

export async function getBooks(q: string, page: number, email: string) {
  const ITEM_PER_PAGE = 2;

  const regex = new RegExp(q, "i");
  try {
    await connect();
    const count = (
      await prisma.book.findMany({
        where: { email, name: { contains: regex.source, mode: "insensitive" } },
      })
    ).length;
    const countWithoutq = (
      await prisma.book.findMany({
        where: { email },
      })
    ).length;
    const books = await prisma.book.findMany({
      where: {
        email,
        name: {
          contains: regex.source,
          mode: "insensitive",
        },
      },
      orderBy: { date: "desc" },
      take: ITEM_PER_PAGE,
      skip: (page - 1) * ITEM_PER_PAGE,
    });
    return { books, count, countWithoutq };
  } catch (error) {
    if (error instanceof Error) throw new Error(error.message);
    else
      throw new Error("Failed to load books. Please try refreshing the page!");
  }
}

export async function deleteBook(id: string) {
  try {
    await connect();
    await prisma.book.delete({ where: { id } });
  } catch (error) {
    throw new Error("Couldn't delete the book!");
  }
}

export async function fetchById(id: string) {
  try {
    await connect();
    const book = await prisma.book.findFirst({
      where: {
        id,
      },
    });
    return book;
  } catch (error) {
    throw new Error("Couldn't fetch the book!");
  }
}

export async function updateBookById(formData: FormData, id: string) {
  try {
    await connect();
    const { name, author, genre, isbn, quantity } =
      Object.fromEntries(formData);
    const nameString = name?.toString() ?? "";
    validityCheck(nameString, "name");
    const authorString = author?.toString() ?? "";
    validityCheck(authorString, "author");
    const genreString = genre?.toString() ?? "";
    validityCheck(genreString, "genre");
    const isbnString = isbn?.toString() ?? "";
    validityCheck(isbnString, "isbn");
    const quantityString = quantity?.toString() ?? "";
    validityCheck(quantityString, "quantity");
    const quantityInt = parseInt(quantityString);
    await prisma.book.update({
      data: {
        name: nameString,
        author: authorString,
        genre: genreString,
        isbn: isbnString,
        quantity: quantityInt,
      },
      where: { id },
    });
  } catch (error) {
    if (error instanceof Error) throw new Error(error.message);
    else throw new Error("Couldn't update the book!");
  }
}

export async function updateQuantity(id: string, quantity: number) {
  try {
    await connect();
    await prisma.book.update({
      data: { quantity },
      where: { id },
    });
  } catch (error) {
    throw new Error("Couldn't update the quantity!");
  }
}
