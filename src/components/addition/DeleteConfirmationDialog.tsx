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

interface DeleteConfirmationDialogProps {
  entityName: string; // Name of the entity to display in the dialog
  entityType: string; // Type of entity (e.g., "mata kuliah", "tugas", etc.)
  onDelete: () => Promise<void>; // Async function to handle the delete action
  open: boolean; // Control dialog visibility
  onOpenChange: (open: boolean) => void; // Handle dialog open/close state changes
}

export function DeleteConfirmationDialog({
  entityName,
  entityType,
  onDelete,
  open,
  onOpenChange,
}: DeleteConfirmationDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
          <AlertDialogDescription>
            Tindakan ini akan menghapus {entityType} "{entityName}" secara permanen. Anda tidak dapat membatalkan
            tindakan ini.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction onClick={onDelete}>Hapus</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
