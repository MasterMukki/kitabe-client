import { useState } from "react";
import { Edit, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Book } from "@/interfaces/books";
import DeleteConfirmation from "./DeleteBookModal";
import BooksTableSkeleton from "./common/BooksTableSkeleton";
import TablePagination from "./common/TablePagination";

interface BookTableProps {
    books: Book[];
    isLoading: boolean;
    currentPage: number;
    totalPages: number;
    totalItems: number;
    onPageChange: (page: number) => void;
    onEditBook: (book: Book) => void;
    onPageSizeChange: (pageSize: number) => void;
    itemsPerPage: number;
}

const BookTable: React.FC<BookTableProps> = ({
    books,
    isLoading,
    currentPage,
    totalPages,
    totalItems,
    onPageChange,
    onEditBook,
    itemsPerPage, 
    onPageSizeChange, 
}) => {
    const [deleteBookId, setDeleteBookId] = useState<number | null>(null);
    const [viewingBook, setViewingBook] = useState<Book | null>(null);

    const handleDeleteClick = (bookId: number) => {
        setDeleteBookId(bookId);
    }

    const handleDeleteClose = () => {
        setDeleteBookId(null);
    }

    const handleViewBook = (book: Book) => {
        setViewingBook(book);
    }

    const handleCloseView = () => {
        setViewingBook(null);
    }

    const getStatusBadge = (status: string) => {
        return status === "Available" ? (
            <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-200">
                Available
            </Badge>
        ) : (
            <Badge variant="secondary" className="bg-orange-100 text-orange-800 hover:bg-orange-200">
                Issued
            </Badge>
        )
    }

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Books Collection</CardTitle>
                    <CardDescription>{isLoading ? "Loading books..." : `${totalItems} books found`}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="min-w-[200px]">Title</TableHead>
                                    <TableHead className="min-w-[150px]">Author</TableHead>
                                    <TableHead className="min-w-[120px]">Genre</TableHead>
                                    <TableHead className="min-w-[100px]">Year</TableHead>
                                    <TableHead className="min-w-[100px]">Status</TableHead>
                                    <TableHead className="min-w-[120px]">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading && <BooksTableSkeleton />}
                                {books.length ? (
                                    <>
                                        {
                                            books.map((book) => (
                                                <TableRow key={book.id} className="hover:bg-muted/50">
                                                    <TableCell className="font-medium">{book.title}</TableCell>
                                                    <TableCell>{book.author}</TableCell>
                                                    <TableCell>{book.genre}</TableCell>
                                                    <TableCell>{book.publishedYear}</TableCell>
                                                    <TableCell>{getStatusBadge(book.status)}</TableCell>
                                                    <TableCell>
                                                        <div className="flex gap-2">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleViewBook(book)}
                                                                className="h-8 w-8 p-0 cursor-pointer"
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                                <span className="sr-only">View book</span>
                                                            </Button>
                                                            <Button variant="ghost" size="sm" onClick={() => onEditBook(book)} className="h-8 w-8 p-0 cursor-pointer">
                                                                <Edit className="h-4 w-4" />
                                                                <span className="sr-only">Edit book</span>
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleDeleteClick(book.id)}
                                                                className="h-8 w-8 p-0 text-destructive hover:text-destructive cursor-pointer"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                                <span className="sr-only">Delete book</span>
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        }
                                    </>
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8">
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="text-muted-foreground">No books found</div>
                                                <div className="text-sm text-muted-foreground">Try adjusting your search or filters</div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* TABLE PAGINATION  */}
                    <TablePagination
                        onPageChange={onPageChange}
                        totalItems={totalItems}
                        totalPages={totalPages}
                        currentPage={currentPage}
                        itemsPerPage={itemsPerPage}
                        onPageSizeChange={onPageSizeChange}
                    />
                </CardContent>
            </Card>

            {/* Book Details Modal */}
            <Dialog open={!!viewingBook} onOpenChange={handleCloseView}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Book Details</DialogTitle>
                        <DialogDescription>Complete information about this book</DialogDescription>
                    </DialogHeader>
                    {viewingBook && (
                        <div className="space-y-4">
                            <div>
                                <h3 className="font-semibold text-lg">{viewingBook.title}</h3>
                                <p className="text-muted-foreground">by {viewingBook.author}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Genre</label>
                                    <p className="text-sm">{viewingBook.genre}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Published Year</label>
                                    <p className="text-sm">{viewingBook.publishedYear}</p>
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Status</label>
                                <div className="mt-1">{getStatusBadge(viewingBook.status)}</div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            {deleteBookId && <DeleteConfirmation bookId={deleteBookId} onClose={handleDeleteClose} />}
        </>
    )
}

export default BookTable;