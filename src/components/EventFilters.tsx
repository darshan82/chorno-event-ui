import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Search, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useTranslation } from 'react-i18next';

interface EventFiltersProps {
  onFilter: (filters: FilterValues) => void;
  categories: string[];
}

export interface FilterValues {
  search: string;
  category: string;
  date: Date | undefined;
}

export function EventFilters({ onFilter, categories }: EventFiltersProps) {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);

  const applyFilters = () => {
    onFilter({ search, category, date });
  };

  const resetFilters = () => {
    setSearch("");
    setCategory("");
    setDate(undefined);
    onFilter({ search: "", category: "", date: undefined });
  };

  return (
    <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-end">
      <div className="flex-1 flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="flex-1">
          <div className="text-sm font-medium mb-1.5">{t('searchPlaceholder')}</div>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('searchPlaceholder')}
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="w-full sm:w-[180px]">
          <div className="text-sm font-medium mb-1.5">{t('category')}</div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder={t('all')} />
            </SelectTrigger>
            <SelectContent className="bg-popover">
              <SelectItem value="all-categories">{t('all')}</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-full sm:w-[180px]">
          <div className="text-sm font-medium mb-1.5">{t('date')}</div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>{t('date')}</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-popover" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="flex gap-2 mt-2 sm:mt-0">
        <Button variant="default" onClick={applyFilters}>
          {t('applyFilters')}
        </Button>
        <Button variant="outline" onClick={resetFilters} className="gap-1">
          <X className="h-4 w-4" /> {t('reset')}
        </Button>
      </div>
    </div>
  );
}
