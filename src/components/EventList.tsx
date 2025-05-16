import React, { useState, useMemo, useEffect } from "react";
import { EventCard } from "./EventCard";
import { EventFilters, FilterValues } from "./EventFilters";
import { Event, useEvents, getEventStatus } from "@/hooks/use-events";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from 'react-i18next';

export function EventList() {
  const { t } = useTranslation();
  const { data: events = [], isLoading, error } = useEvents();
  const [activeTab, setActiveTab] = useState<"all" | "upcoming" | "ongoing" | "expired">("all");
  const [filters, setFilters] = useState<FilterValues>({
    search: "",
    category: "",
    date: undefined,
  });

  const categories = useMemo(() => {
    if (!events.length) return [];
    const categorySet = new Set(events.map((event) => event.type));
    return Array.from(categorySet);
  }, [events]);

  const filteredEvents = useMemo(() => {
    if (!events.length) return [];

    return events.filter((event) => {
      // Status filter
      if (activeTab !== "all") {
        const status = getEventStatus(event);
        if (status !== activeTab) return false;
      }

      // Search filter
      if (filters.search && (!event.title?.toLowerCase().includes(filters.search.toLowerCase()) && 
          !event.location?.toLowerCase().includes(filters.search.toLowerCase()))) {
        return false;
      }

      // Category filter
      if (filters.category && filters.category !== "all-categories" && event.type !== filters.category) {
        return false;
      }

      // Date filter
      if (filters.date) {
        const filterDate = new Date(filters.date);
        const startDate = new Date(event.starts_at);
        const endDate = new Date(event.expires_at);
        
        // Check if filter date falls within event dates
        filterDate.setHours(0, 0, 0, 0);
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(0, 0, 0, 0);
        
        if (filterDate < startDate || filterDate > endDate) {
          return false;
        }
      }

      return true;
    });
  }, [events, activeTab, filters]);

  const tabCounts = useMemo(() => {
    if (!events.length) return { all: 0, upcoming: 0, ongoing: 0, expired: 0 };
    
    const counts = { all: events.length, upcoming: 0, ongoing: 0, expired: 0 };
    
    events.forEach((event) => {
      const status = getEventStatus(event);
      counts[status]++;
    });
    
    return counts;
  }, [events]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-pulse text-center">
          <div className="h-4 bg-muted rounded w-48 mb-4 mx-auto"></div>
          <div className="h-4 bg-muted rounded w-36 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 text-destructive">
        <p className="mb-4">{t('failedToLoadEvents')}</p>
        <p>{t('pleaseTryAgainLater')}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <EventFilters onFilter={setFilters} categories={categories} />
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
        <TabsList className="mb-6">
          <TabsTrigger value="all">
            {t('all')} ({tabCounts.all})
          </TabsTrigger>
          <TabsTrigger value="upcoming">
            {t('upcoming')} ({tabCounts.upcoming})
          </TabsTrigger>
          <TabsTrigger value="ongoing">
            {t('ongoing')} ({tabCounts.ongoing})
          </TabsTrigger>
          <TabsTrigger value="expired">
            {t('expired')} ({tabCounts.expired})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-0">
          {filteredEvents.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">{t('noEventsFound')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
