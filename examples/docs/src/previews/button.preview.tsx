import { Button } from "~/components/ui/Button";

export const PreviewProps = {
  title: "Button Variants Test",
  variants: [
    {
      title: "variant",
      options: ["primary", "secondary", "success", "warning", "danger"],
      default: "primary",
    },
    {
      title: "disabled",
      options: [true, false],
      default: false,
    },
  ],
};

export default function Preview({ ...props }) {
  return (
    <div>
      <Button variant={props.variant}>asdasd</Button>
    </div>
  );
}
