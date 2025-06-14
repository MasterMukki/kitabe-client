
export interface Book {
  id: number;
  title: string;
  author: string;
  genre: string;
  publishedYear: number;
  status: 'Available' | 'Issued';
};

export type CreateBookDto = Omit<Book, 'id'>;