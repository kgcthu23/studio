'use client';

import { Search } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import type { FilterType } from '@/app/page';

type FilterControlsProps = {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
};

export function FilterControls({
  currentFilter,
  onFilterChange,
  searchQuery,
  onSearchChange,
}: FilterControlsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
      <div className="relative w-full max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by title..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
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
