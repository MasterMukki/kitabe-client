import { AlertTriangle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDeleteBook } from "@/hooks/useDeleteBook";
import { useGetBooks } from "@/hooks/useGetBooks";
import { toast } from "sonner";

interface DeleteConfirmationProps {
  bookId: number;
  onClose: () => void;
}

const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({ bookId, onClose }) => {
  const deleteBookMutation = useDeleteBook();
  const { data: books = [] } = useGetBooks();

  const book = (books).find((b) => b.id === bookId);
  const isLoading = deleteBookMutation.isPending;

  const handleDelete = async () => {
    try {
      await deleteBookMutation.mutateAsync(bookId);
      toast.success('Book deleted successfully.');
      onClose()
    } catch (error) {
      // Error handling is done in the mutation hook
      toast.error('Book deletion failed.');
      console.error("Delete error:", error);
    }
  }

  return (
    <AlertDialog open={true} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Delete Book
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>Are you sure you want to delete this book? This action cannot be undone.</p>
            {book && (
              <div className="bg-muted p-3 rounded-md">
                <p className="font-medium">{book.title}</p>
                <p className="text-sm text-muted-foreground">by {book.author}</p>
              </div>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer" disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isLoading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 text-white cursor-pointer"
          >
            {isLoading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                Deleting...
              </>
            ) : (
              "Delete Book"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteConfirmation;