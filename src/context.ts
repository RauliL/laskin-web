import { Context, newQuoteValue, SymbolNode } from "laskin";

export const createContext = (): Context => {
  const context = new Context();
  const addAlias = (a: string, b: string) => {
    context.define(a, newQuoteValue([{ type: "Symbol", id: b } as SymbolNode]));
  };

  addAlias("×", "*");
  addAlias("÷", "/");

  return context;
};
