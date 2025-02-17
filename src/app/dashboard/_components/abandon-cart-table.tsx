"use client";

import type { DataTableAdvancedFilterField, DataTableFilterField, DataTableRowAction } from "@/types";
import * as React from "react";

import { DataTable } from "@/components/data-table/data-table";
import { DataTableAdvancedToolbar } from "@/components/data-table/data-table-advanced-toolbar";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { useDataTable } from "@/hooks/use-data-table";

import { CART_STATUS } from "@/constants";
import { CartItem } from "@prisma/client";
import { getCartItems, getCartStatusCounts } from "../_lib/queries";
import { getStatusIcon } from "../_lib/utils";
import { AbandonedCartTableToolbarActions } from "./abandon-cart-table-toolbar-action";
import { getColumns } from "./abandoned-cart-table-columns";
import { DeleteCartItemsDialog } from "./delete-cart-item-dialog";
import { useFeatureFlags } from "./feature-flags-provider";

interface CartsTableProps {
  promises: Promise<[Awaited<ReturnType<typeof getCartItems>>, Awaited<ReturnType<typeof getCartStatusCounts>>]>;
  // data: CartItem[];
}

export function CartsTable({ promises }: CartsTableProps) {
  const { featureFlags } = useFeatureFlags();

  const [{ data, pageCount }, statusCounts] = React.use(promises);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [rowAction, setRowAction] = React.useState<DataTableRowAction<CartItem> | null>(null);

  const columns = React.useMemo(() => getColumns({ setRowAction }), [setRowAction]);

  /**
   * This component can render either a faceted filter or a search filter based on the `options` prop.
   *
   * @prop options - An array of objects, each representing a filter option. If provided, a faceted filter is rendered. If not, a search filter is rendered.
   *
   * Each `option` object has the following properties:
   * @prop {string} label - The label for the filter option.
   * @prop {string} value - The value for the filter option.
   * @prop {React.ReactNode} [icon] - An optional icon to display next to the label.
   * @prop {boolean} [withCount] - An optional boolean to display the count of the filter option.
   */
  const filterFields: DataTableFilterField<CartItem>[] = [
    {
      id: "productName",
      label: "Product Name",
      placeholder: "Filter titles...",
    },
    {
      id: "status",
      label: "Status",
      options: CART_STATUS.map((status) => ({
        label: status.label,
        value: status.value,
        icon: getStatusIcon(status.value),
        count: statusCounts[status.value],
      })),
    },
  ];

  /**
   * Advanced filter fields for the data table.
   * These fields provide more complex filtering options compared to the regular filterFields.
   *
   * Key differences from regular filterFields:
   * 1. More field types: Includes 'text', 'multi-select', 'date', and 'boolean'.
   * 2. Enhanced flexibility: Allows for more precise and varied filtering options.
   * 3. Used with DataTableAdvancedToolbar: Enables a more sophisticated filtering UI.
   * 4. Date and boolean types: Adds support for filtering by date ranges and boolean values.
   */
  const advancedFilterFields: DataTableAdvancedFilterField<CartItem>[] = [
    {
      id: "productName",
      label: "Product Name",
      type: "text",
    },
    {
      id: "properties",
      label: "Properties",
      placeholder: "Filter Instagram...",
      type: "text",
    },

    {
      id: "createdAt",
      label: "Created at",
      type: "date",
    },
  ];

  const enableAdvancedTable = featureFlags.includes("advancedTable");
  // const enableFloatingBar = featureFlags.includes("floatingBar");

  const { table } = useDataTable({
    data,
    columns,
    pageCount,
    filterFields,
    enableAdvancedFilter: enableAdvancedTable,
    initialState: {
      sorting: [{ id: "createdAt", desc: true }],
      columnPinning: { right: ["actions"] },
      columnVisibility:{
        
      }
    },
    getRowId: (originalRow) => originalRow.id.toString(),
    shallow: false,
    clearOnDefault: true,
  });

  return (
    <>
      <DataTable table={table}>
        {enableAdvancedTable ? (
          <DataTableAdvancedToolbar table={table} filterFields={advancedFilterFields} shallow={false}>
            <AbandonedCartTableToolbarActions table={table} />
            <></>
          </DataTableAdvancedToolbar>
        ) : (
          <DataTableToolbar table={table} filterFields={filterFields}>
            <AbandonedCartTableToolbarActions table={table} />
          </DataTableToolbar>
        )}
      </DataTable>
      {/* <UpdateCartsheet open={rowAction?.type === "update"} onOpenChange={() => setRowAction(null)} task={rowAction?.row.original ?? null} /> */}
      <DeleteCartItemsDialog
        open={rowAction?.type === "delete"}
        onOpenChange={() => setRowAction(null)}
        cartitem={rowAction?.row.original ? [rowAction?.row.original] : []}
        showTrigger={false}
        onSuccess={() => rowAction?.row.toggleSelected(false)}
      />
    </>
  );
}
