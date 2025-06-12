import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface TablePaginationProps {
    onPageChange: (pageNum: number) => void;
    totalPages: number;
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
    onPageSizeChange: (pageSize: number) => void;
}

const TablePagination: React.FC<TablePaginationProps> = ({
    onPageChange,
    totalItems,
    currentPage,
    totalPages,
    itemsPerPage,
    onPageSizeChange, 
}) => {
    const startItem = Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)
    const endItem = Math.min(currentPage * itemsPerPage, totalItems)

    const pageSizeOptions = [5, 10, 20, 50, 100]

    return (
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4 mt-4">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="text-sm text-muted-foreground">
            {totalItems === 0 ? "No books to display" : `Showing ${startItem} to ${endItem} of ${totalItems} books`}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Show:</span>
            <Select value={itemsPerPage.toString()} onValueChange={(value) => onPageSizeChange(Number(value))}>
              <SelectTrigger className="w-20 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {pageSizeOptions.map((size) => (
                  <SelectItem key={size} value={size.toString()}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">per page</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1 || totalItems === 0}
            className="cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          <div className="flex items-center gap-1">
            {totalPages > 0 ? (
              Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum
                if (totalPages <= 5) {
                  pageNum = i + 1
                } else if (currentPage <= 3) {
                  pageNum = i + 1
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i
                } else {
                  pageNum = currentPage - 2 + i
                }

                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => onPageChange(pageNum)}
                    className="w-8 h-8 p-0 cursor-pointer"
                    disabled={totalItems === 0}
                  >
                    {pageNum}
                  </Button>
                )
              })
            ) : (
              <Button variant="outline" size="sm" className="w-8 h-8 p-0 cursor-pointer" disabled>
                1
              </Button>
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages || totalItems === 0 || totalPages <= 1}
            className="cursor-pointer"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    )
}

export default TablePagination;