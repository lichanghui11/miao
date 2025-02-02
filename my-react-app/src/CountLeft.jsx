import { countLeftAtom } from "./store";
import { useAtom } from "jotai";

export default function CountLeft() {
  const [countLeft] = useAtom(countLeftAtom);
  return (
    <span>
      {countLeft} item{countLeft > 1 ? "s" : ""} left.
    </span>
  );
}
