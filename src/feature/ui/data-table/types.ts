/*
    ! *** All Config should be optional by-default;
    ******* Config Should be like this *********
    --- It contains table condig like
    **** show filter ---  {{ showFilter: true, filterComp: <FilterComp /> }}
    **** show pagination {{ showPagination: false, customPagination: <CustomPagination /> }}
    **** pinning, pinning columns {{ isPinning: false // default to true, pinningColumns: ["id", ..some other column names] // default to all }}
    **** show collapsible {{showCollapsible: true // default to true }}
    **** culumn visible list - default show all
    **** column selection - default to false {{ columnSelection: true }}
*/

import type { QueryOptions } from "@tanstack/solid-query";
import type { ColumnDef } from "@tanstack/solid-table";
import type { JSX } from "solid-js";

type DefaultColType = Record<string, unknown>;
type TableElement = () => JSX.Element;

type KeysOf<T> = keyof T extends infer K
  ? K extends string
    ? K
    : never
  : never;

type DataTableColumn<Col = DefaultColType> = ColumnDef<Col>;

type DataTableConfig<Cols = DefaultColType> = {
  hidePagination?: boolean;
  paginationComp?: TableElement;
  showCollapsible?: boolean;
  defaultColumnList?: Array<KeysOf<Cols>>;
  columnSelection?: boolean;
} & (
  | { showFilter: boolean; filterComp: TableElement }
  | {
      showFilter?: boolean;
      filterComp?: never;
    }
) & {
    columnPinning?: {
      left?: Array<KeysOf<Cols>>;
      right?: Array<KeysOf<Cols>>;
    };
  };

type DataTableRequriedProps<Col = DefaultColType> = {
  columns: DataTableColumn<Col>[];
};

type Data = Record<string, unknown>[];

type FetcherConfig = {
  fetcherConfig?: QueryOptions;
};

export type DataTableProps<Col = DefaultColType> = DataTableRequriedProps<Col> &
  (
    | { url: string; data?: never }
    | { url?: string; data: Data }
    | {
        url?: never;
        data?: never;
        dataFetcher: () => void; // this need to be added later;
      }
  ) &
  DataTableConfig<Col> &
  FetcherConfig;

export type DataTable = {};
