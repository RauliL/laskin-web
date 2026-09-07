import { LaskinContext, createContext as createLaskin } from "laskin";
import laskinWasmUrl from "laskin/laskin.wasm?url";

export const createContext = async (): Promise<LaskinContext> => {
  const context = await createLaskin({ locateFile: () => laskinWasmUrl });

  context.run("(*) -> ×");
  context.run("(/) -> ÷");

  return context;
};
