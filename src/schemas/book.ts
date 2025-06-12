import { z } from 'zod';

export const bookSchema = z.object({
  title: z.string({ required_error: 'Title is required' }).min(1, 'Title cannot be empty'),
  author: z.string({ required_error: 'Author is required' }).min(1, 'Author cannot be empty'),
  genre: z.string({ required_error: 'Genre is required' }).min(1, 'Genre cannot be empty'),
  publishedYear: z
    .number({ required_error: 'Published year is required' })
    .int('Published year must be an integer')
    .gte(0, 'Published year must be a valid year'),
  status: z.enum(['Available', 'Issued'], {
    required_error: 'Status is required',
    invalid_type_error: 'Status must be either "Available" or "Issued"',
  }),
});


export type BookFormValues = z.infer<typeof bookSchema>;
