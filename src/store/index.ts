const KEY = "node_clipboard";

export const read = async <T = any>(): Promise<T> => {
  const value: string = await figma.clientStorage.getAsync(KEY);

  return JSON.parse(value);
};

export const save = async (value: any): Promise<void> =>
  figma.clientStorage.setAsync(KEY, JSON.stringify(value));
