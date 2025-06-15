import {
  Dialog,
  DialogClose,
  DialogTitle,
  DialogContent,
  DialogTrigger,
  DialogDescription,
} from "~/components/ui/Dialog";

export const PreviewProps = {
  title: "Dialog Test!",
  variants: [
    {
      title: "test",
      options: ["1", "2", "three"],
      default: "2",
    },
  ],
};

export default function DialogPreview({ ...props }) {
  return (
    <Dialog>
      <DialogTrigger>
        <button type="button" className="bg-green-300 text-black p-3">
          Open Dialog {props.test}
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
