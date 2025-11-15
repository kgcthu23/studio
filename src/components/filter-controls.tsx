'use client';

import { ListFilter, Search } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { FilterType } from '@/app/page';

type FilterControlsProps = {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  allGenres: string[];
  selectedGenres: string[];
  onGenreChange: (genres: string[]) => void;
};

export function FilterControls({
  currentFilter,
  onFilterChange,
  searchQuery,
  onSearchChange,
  allGenres,
  selectedGenres,
  onGenreChange,
}: FilterControlsProps) {
  const handleGenreSelect = (genre: string) => {
    const newSelectedGenres = selectedGenres.includes(genre)
      ? selectedGenres.filter((g) => g !== genre)
      : [...selectedGenres, genre];
    onGenreChange(newSelectedGenres);
  };

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

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="relative">
            <ListFilter className="mr-2 h-4 w-4" />
            Genre
            {selectedGenres.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
                {selectedGenres.length}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Filter by Genre</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {allGenres.map((genre) => (
            <DropdownMenuCheckboxItem
              key={genre}
              checked={selectedGenres.includes(genre)}
              onCheckedChange={() => handleGenreSelect(genre)}
              onSelect={(e) => e.preventDefault()} // Prevent menu from closing on item click
            >
              {genre}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
