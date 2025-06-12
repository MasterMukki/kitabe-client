import type { CreateBookDto } from '@/interfaces/books';
import { addBook } from '@/services/books';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useCreateBook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newBook: CreateBookDto) => addBook(newBook),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });
};
