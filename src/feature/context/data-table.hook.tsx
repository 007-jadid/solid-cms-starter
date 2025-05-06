import { useContext } from "solid-js";
import { DataTableContext } from "./data-table.context";

export const useDataTable = () => {
  return useContext(DataTableContext);
};
