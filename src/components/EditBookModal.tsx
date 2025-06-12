import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { bookSchema, type BookFormValues } from "@/schemas/book";
import { useUpdateBook } from "@/hooks/useUpdateBook";
import type { Book } from "@/interfaces/books";
import { genres } from "@/constants";
import { toast } from "sonner";

interface BookFormProps {
  isOpen: boolean;
  onClose: () => void;
  book?: Book | null;
}

const EditBookModal: React.FC<BookFormProps> = ({ isOpen, onClose, book }) => {
  const updateBookMutation = useUpdateBook();
  const isLoading = updateBookMutation.isPending;
  console.log("Book to edit", book);

  const form = useForm<BookFormValues>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      title: book?.title ?? "",
      author: book?.author ?? "",
      genre: book?.genre ?? "",
      publishedYear: book?.publishedYear ?? new Date().getFullYear(),
      status: book?.status ?? "Available",
    },
  })

  // Reset form when book changes or modal opens/closes
  useEffect(() => {
    if (isOpen) {
      if (book) {
        form.reset({
          title: book.title,
          author: book.author,
          genre: book.genre,
          publishedYear: book.publishedYear,
          status: book.status,
        })
      }
    }
  }, [book, isOpen, form]);

  const onSubmit = async (data: BookFormValues) => {
    try {
      if (book) {
        await updateBookMutation.mutateAsync({
            ...book, 
            ...data, 
        });
        toast.success('Book updated successfully.');
      }
      onClose();
    } catch (error) {
      // Error handling is done in the mutation hooks
       toast.error('Book update failed.');
      console.error("Form submission error:", error);
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      form.reset();
      onClose();
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Book</DialogTitle>
          <DialogDescription>
            Update the book information below.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter book title" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="author"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Author *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter author name" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="genre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Genre *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} disabled={isLoading}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a genre" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="max-h-[200px]">
                      {genres.map((genre) => (
                        <SelectItem key={genre} value={genre}>
                          {genre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="publishedYear"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Published Year *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter published year"
                      {...field}
                      onChange={(e) => field.onChange(Number.parseInt(e.target.value) || 0)}
                      disabled={isLoading}
                      min="1000"
                      max={new Date().getFullYear()}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} disabled={isLoading}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Available">Available</SelectItem>
                      <SelectItem value="Issued">Issued</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center sm:flex-row gap-3 pt-4 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
                className="w-full sm:w-auto hover:cursor-pointer"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} className="w-full sm:w-auto hover:cursor-pointer">
                {isLoading ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                    {"Updating..."}
                  </>
                ) : "Update Book"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default EditBookModal;