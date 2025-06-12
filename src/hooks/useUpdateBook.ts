import type { Book } from '@/interfaces/books';
import { updateBook } from '@/services/books';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useUpdateBook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (book: Book) => updateBook(book),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });
};
