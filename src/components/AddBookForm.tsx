import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BookOpenCheck, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { bookSchema, type BookFormValues } from "@/schemas/book";
import { genres } from "@/constants";
import { toast } from "sonner"; import { useNavigate } from "react-router";
import { useCreateBook } from "@/hooks/useCreateBook";
;


const AddBookForm: React.FC = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const createBookMutation = useCreateBook();

    // Initialize the form with default values
    const form = useForm<BookFormValues>({
        resolver: zodResolver(bookSchema),
        defaultValues: {
            title: "",
            author: "",
            genre: "",
            publishedYear: new Date().getFullYear(),
            status: "Available",
        },
    });

    // Handle form submission
    const onSubmit = async (data: BookFormValues) => {
        setIsSubmitting(true);
        try {
        const res = await createBookMutation.mutateAsync(data);
        if(res) {
            toast.success('Book added successfully!');
            navigate('/');
        }
        } catch (error) {
            console.error("Error adding book:", error)
            toast.error('Failed to add book');
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Card className="w-full max-w-3xl mx-auto">
            <CardHeader>
                <div className="flex items-center gap-2 justify-center">
                    <div className="p-2 rounded-full bg-primary/10">
                        <BookOpenCheck className="h-6 w-6 text-green-700" />
                    </div>
                    <div>
                        <CardTitle className="text-2xl">Add New Book</CardTitle>
                        <CardDescription>Add a new book to your library collection</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            {/* Title Field */}
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Book Title</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter book title" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Author Field */}
                            <FormField
                                control={form.control}
                                name="author"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Author</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter author name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Genre Field */}
                            <FormField
                                control={form.control}
                                name="genre"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Genre</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a genre" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
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

                            {/* Published Year Field */}
                            <FormField
                                control={form.control}
                                name="publishedYear"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Published Year</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="YYYY"
                                                {...field}
                                                onChange={(e) =>
                                                    field.onChange(e.target.value === "" ? "" : Number.parseInt(e.target.value, 10))
                                                }
                                            />
                                        </FormControl>
                                        <FormDescription>Year when the book was published</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Status Field */}
                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Status</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                                        <FormDescription>Current availability status of the book</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex gap-4 justify-end">
                            <Button variant="outline" type="button" onClick={() => form.reset()} className="hover:cursor-pointer">
                                Reset
                            </Button>
                            <Button type="submit" disabled={isSubmitting} className="hover:cursor-pointer">
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Adding Book...
                                    </>
                                ) : (
                                    "Add Book"
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}


export default AddBookForm;