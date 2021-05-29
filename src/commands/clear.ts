import * as Store from "@/store";

const clear = async (): Promise<void> => {
  await Store.save(null);
  figma.closePlugin("Clipboard cleared!");
};

export default clear;
