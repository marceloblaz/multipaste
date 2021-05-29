import { clear, Command, copy, paste } from "@/commands";

switch (figma.command) {
  case Command.COPY:
    copy();
    break;
  case Command.PASTE:
    paste();
    break;
  case Command.CLEAR_CLIPBOARD:
    clear();
    break;
}
