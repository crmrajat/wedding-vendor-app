"use client"

import type * as React from "react"
import { useState } from "react"
import { Trash2 } from "lucide-react"
import { toast } from "sonner"

import { CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface DeletableTableRowProps {
  id: string | number
  onDelete: (id: string | number) => void
  onRestore?: (id: string | number, data: any) => void
  confirmMessage?: string
  children: React.ReactNode
  rowData?: any
}

export function DeletableTableRow({
  id,
  onDelete,
  onRestore,
  confirmMessage = "Are you sure you want to delete this item?",
  children,
  rowData,
}: DeletableTableRowProps) {
  const [showDeleteAlert, setShowDeleteAlert] = useState(false)

  const handleDelete = () => {
    onDelete(id)
    setShowDeleteAlert(false)

    if (onRestore) {
      toast.error("Item deleted", {
        description: "This item has been removed",
        action: {
          label: "Undo",
          onClick: () => onRestore(id, rowData),
        },
      })
    }
  }

  return (
    <tr className="relative group">
      {children}
      <td className="p-2 sm:p-4 text-right">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowDeleteAlert(true)}
          className="opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Trash2 className="h-4 w-4 text-muted-foreground" />
          <span className="sr-only">Delete</span>
        </Button>
      </td>

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>{confirmMessage}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-col-reverse sm:flex-row gap-2">
            <AlertDialogCancel className="w-full sm:w-auto">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 w-full sm:w-auto"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </tr>
  )
}

interface DeletableTableContentProps extends React.ComponentPropsWithoutRef<typeof CardContent> {
  data: any[]
  idField?: string
  onDeleteRow: (id: string | number) => void
  onRestoreRow?: (id: string | number, data: any) => void
  confirmMessage?: string
  renderRow: (item: any, index: number) => React.ReactNode
}

export function DeletableTableContent({
  data,
  idField = "id",
  onDeleteRow,
  onRestoreRow,
  confirmMessage,
  renderRow,
  ...props
}: DeletableTableContentProps) {
  return (
    <CardContent {...props}>
      <div className="relative w-full overflow-auto">
        <table className="w-full caption-bottom text-sm">
          <tbody>
            {data.map((item, index) => (
              <DeletableTableRow
                key={item[idField] || index}
                id={item[idField] || index}
                onDelete={onDeleteRow}
                onRestore={onRestoreRow}
                confirmMessage={confirmMessage}
                rowData={item}
              >
                {renderRow(item, index)}
              </DeletableTableRow>
            ))}
          </tbody>
        </table>
      </div>
    </CardContent>
  )
}

