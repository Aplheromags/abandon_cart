import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { DateRangePicker } from "@/components/date-range-picker";
import { Shell } from "@/components/shell";
import { Skeleton } from "@/components/ui/skeleton";
import { SearchParams } from "@/types";
import React from "react";
import { CartsTable } from "./_components/abandon-cart-table";
import { FeatureFlagsProvider } from "./_components/feature-flags-provider";
import { getCartItems, getCartStatusCounts } from "./_lib/queries";
import { searchParamsCache } from "./_lib/validations";
import { getValidFilters } from "@/lib/data-table";

interface DashboardPageProps {
  searchParams: Promise<SearchParams>;
}

const DashboardPage = async (props: DashboardPageProps) => {
  const searchParams = await props.searchParams;
  const search = searchParamsCache.parse(searchParams);

  const validFilters = getValidFilters(search.filters)

  const promises = Promise.all([
    getCartItems({
      ...search,
      filters: validFilters,
    }),
    getCartStatusCounts()
  ])

  return (
    <Shell className="gap-2">
      <FeatureFlagsProvider>
        <React.Suspense fallback={<Skeleton className="h-7 w-52" />}>
          <DateRangePicker triggerSize="sm" triggerClassName="ml-auto w-56 sm:w-60" align="end" shallow={false} />
        </React.Suspense>
        <React.Suspense
          fallback={
            <DataTableSkeleton columnCount={6} searchableColumnCount={1} filterableColumnCount={2} cellWidths={["10rem", "40rem", "12rem", "12rem", "8rem", "8rem"]} shrinkZero />
          }
        >
          <CartsTable promises={promises} />
        </React.Suspense>
      </FeatureFlagsProvider>
    </Shell>
  );
};

export default DashboardPage;
