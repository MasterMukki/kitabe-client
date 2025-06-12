"use client"

import { useState, useMemo } from "react"
import { Plus, Search, Filter, BookOpen, Users, TrendingUp, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useGetBooks } from "@/hooks/useGetBooks"
import type { Book } from "@/interfaces/books"
import BookTable from "@/components/BookTable"
import EditBookModal from "@/components/EditBookModal"
import { useNavigate } from "react-router"

export default function Dashboard() {
    const [searchTerm, setSearchTerm] = useState("");
    const [genreFilter, setGenreFilter] = useState<string>("all");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingBook, setEditingBook] = useState<Book | null>(null);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const navigate = useNavigate();

    const { data: books = [], isLoading, error } = useGetBooks()

    // Filter and search logic
    const filteredBooks = useMemo(() => {
        return books.filter((book) => {
            const matchesSearch =
                book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                book.author.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesGenre = genreFilter === "all" || book.genre === genreFilter;
            const matchesStatus = statusFilter === "all" || book.status === statusFilter;

            return matchesSearch && matchesGenre && matchesStatus;
        })
    }, [books, searchTerm, genreFilter, statusFilter]);

    // Pagination logic
    const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);
    const paginatedBooks = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredBooks.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredBooks, currentPage]);

    // Get unique genres for filter
    const genres = useMemo(() => {
        const uniqueGenres = [...new Set(books.map((book) => book.genre))];
        return uniqueGenres.sort();
    }, [books]);

    // Statistics
    const stats = useMemo(() => {
        const totalBooks = books.length;
        const availableBooks = books.filter((book) => book.status === "Available").length;
        const issuedBooks = books.filter((book) => book.status === "Issued").length;
        const uniqueAuthors = new Set(books.map((book) => book.author)).size;

        return {
            totalBooks,
            availableBooks,
            issuedBooks,
            uniqueAuthors,
        };
    }, [books]);

    const handleAddBook = () => {
        navigate('/add/new-book');
    }

    const handleEditBook = (book: Book) => {
        setEditingBook(book);
        setIsFormOpen(true);
    }

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setEditingBook(null);
    }

    // Reset pagination when filters change
    const handleSearchChange = (value: string) => {
        setSearchTerm(value);
        setCurrentPage(1);
    }

    const handleGenreFilterChange = (value: string) => {
        setGenreFilter(value);
        setCurrentPage(1);
    }

    const handleStatusFilterChange = (value: string) => {
        setStatusFilter(value);
        setCurrentPage(1);
    }

    const handlePageSizeChange = (newPageSize: number) => {
        setItemsPerPage(newPageSize)
        setCurrentPage(1) // Reset to first page when changing page size
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Card className="max-w-md mx-auto">
                    <CardHeader>
                        <CardTitle className="text-destructive">Error</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>Failed to load books. Please try again later.</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8 space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Book Management Dashboard</h1>
                    <p className="text-muted-foreground">Manage your library collection with ease</p>
                </div>
                <Button onClick={handleAddBook} className="w-full sm:w-auto hover:cursor-pointer">
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Book
                </Button>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Books</CardTitle>
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{isLoading ? <Skeleton className="h-8 w-16" /> : stats.totalBooks}</div>
                        <p className="text-xs text-muted-foreground">Books in collection</p>
                    </CardContent>
                </Card>

                <Card className="shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Available</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">
                            {isLoading ? <Skeleton className="h-8 w-16" /> : stats.availableBooks}
                        </div>
                        <p className="text-xs text-muted-foreground">Ready to borrow</p>
                    </CardContent>
                </Card>

                <Card className="shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Issued</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-600">
                            {isLoading ? <Skeleton className="h-8 w-16" /> : stats.issuedBooks}
                        </div>
                        <p className="text-xs text-muted-foreground">Currently borrowed</p>
                    </CardContent>
                </Card>

                <Card className="shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Authors</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {isLoading ? <Skeleton className="h-8 w-16" /> : stats.uniqueAuthors}
                        </div>
                        <p className="text-xs text-muted-foreground">Unique authors</p>
                    </CardContent>
                </Card>
            </div>

            {/* Filters and Search */}
            <Card className="shadow-md">
                <CardHeader>
                    <CardTitle className="text-lg">Search & Filter</CardTitle>
                    <CardDescription>Find books by title, author, genre, or status</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                <Input
                                    placeholder="Search by title or author..."
                                    value={searchTerm}
                                    onChange={(e) => handleSearchChange(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Select value={genreFilter} onValueChange={handleGenreFilterChange}>
                                <SelectTrigger className="w-full sm:w-[180px]">
                                    <Filter className="mr-2 h-4 w-4" />
                                    <SelectValue placeholder="All Genres" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Genres</SelectItem>
                                    {genres.map((genre) => (
                                        <SelectItem key={genre} value={genre}>
                                            {genre}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
                                <SelectTrigger className="w-full sm:w-[180px]">
                                    <SelectValue placeholder="All Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="Available">Available</SelectItem>
                                    <SelectItem value="Issued">Issued</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Active Filters */}
                    {(searchTerm || genreFilter !== "all" || statusFilter !== "all") && (
                        <div className="flex flex-wrap gap-2 mt-4">
                            {searchTerm && (
                                <Badge variant="secondary" className="gap-1">
                                    Search: {searchTerm}
                                    <button
                                        onClick={() => handleSearchChange("")}
                                        className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                                    >
                                        ×
                                    </button>
                                </Badge>
                            )}
                            {genreFilter !== "all" && (
                                <Badge variant="secondary" className="gap-1">
                                    Genre: {genreFilter}
                                    <button
                                        onClick={() => handleGenreFilterChange("all")}
                                        className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                                    >
                                        ×
                                    </button>
                                </Badge>
                            )}
                            {statusFilter !== "all" && (
                                <Badge variant="secondary" className="gap-1">
                                    Status: {statusFilter}
                                    <button
                                        onClick={() => handleStatusFilterChange("all")}
                                        className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                                    >
                                        ×
                                    </button>
                                </Badge>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Books Table */}
            <BookTable
                books={paginatedBooks}
                isLoading={isLoading}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                onEditBook={handleEditBook}
                totalItems={filteredBooks.length}
                itemsPerPage={itemsPerPage}
                onPageSizeChange={handlePageSizeChange}
            />
            {/* Edit Book Form Modal */}
            <EditBookModal isOpen={isFormOpen} onClose={handleCloseForm} book={editingBook} />
        </div>
    )
}
