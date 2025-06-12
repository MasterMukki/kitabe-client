import type { Book, CreateBookDto } from "@/interfaces/books";
import axiosInstance from "@/lib/axios"


export const getBooks = async (): Promise<Book[]> => {
    const res =  await axiosInstance.get('/books');
    return res.data;
};

export const addBook = async (newBook: CreateBookDto): Promise<Book> => {
  const response = await axiosInstance.post('/books', newBook);
  return response.data;
};

export const deleteBook = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/books/${id}`);
};

export const updateBook = async (book: Book): Promise<Book> => {
  const response = await axiosInstance.put(`/books/${book.id}`, book);
  return response.data;
};