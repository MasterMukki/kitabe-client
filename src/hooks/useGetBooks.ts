import { getBooks } from '@/services/books';
import { useQuery } from '@tanstack/react-query';

export const useGetBooks = () => {
  return useQuery({
    queryKey: ['books'],
    queryFn: getBooks,
  });
};
