export { default as copy } from "./copy";
export { default as paste } from "./paste";
export { default as clear } from "./clear";

export enum Command {
  COPY = "copy",
  PASTE = "paste",
  CLEAR_CLIPBOARD = "clear",
}
