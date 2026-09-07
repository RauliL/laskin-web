import { LaskinContext, createLaskin } from "laskin";
import laskinWasmUrl from "../node_modules/laskin/laskin.wasm?url";

export const createContext = async (): Promise<LaskinContext> => {
  const context = await createLaskin({
    locateFile: () => laskinWasmUrl,
  });

  context.run("(*) -> ×");
  context.run("(/) -> ÷");

  return context;
};
