import {
  Dialog,
  DialogClose,
  DialogTitle,
  DialogContent,
  DialogTrigger,
  DialogDescription,
} from "~/components/ui/Dialog";

export default function DialogPreview() {
  return (
    <Dialog>
      <DialogTrigger>
        <button type="button" className="bg-green-300 text-black p-3">
          Open Dialog
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Dialog Title</DialogTitle>
        <DialogDescription>Dialog Description</DialogDescription>
        <DialogClose>
          <button type="button" className="bg-red-300 text-black p-3">
            Close Dialog
          </button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
