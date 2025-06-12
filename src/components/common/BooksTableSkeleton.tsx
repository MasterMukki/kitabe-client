import { Skeleton } from "../ui/skeleton";
import { TableCell, TableRow } from "../ui/table";

const BooksTableSkeleton: React.FC = () => {
    return Array.from({ length: 5 }, (_, i) => (
        <TableRow key={i}>
            <TableCell>
                <Skeleton className="h-4 w-48" />
            </TableCell>
            <TableCell>
                <Skeleton className="h-4 w-32" />
            </TableCell>
            <TableCell>
                <Skeleton className="h-4 w-24" />
            </TableCell>
            <TableCell>
                <Skeleton className="h-4 w-16" />
            </TableCell>
            <TableCell>
                <Skeleton className="h-6 w-20" />
            </TableCell>
            <TableCell>
                <div className="flex gap-2">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                </div>
            </TableCell>
        </TableRow>
    ))
}

export default BooksTableSkeleton;