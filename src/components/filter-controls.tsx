'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { FilterType } from '@/app/page';

type FilterControlsProps = {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
};

export function FilterControls({ currentFilter, onFilterChange }: FilterControlsProps) {
  return (
    <div className="flex justify-center">
      <Tabs value={currentFilter} onValueChange={(value) => onFilterChange(value as FilterType)}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unwatched">Unwatched</TabsTrigger>
          <TabsTrigger value="watched">Watched</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
