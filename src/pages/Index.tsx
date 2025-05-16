import React, { useEffect } from 'react';
import { EventList } from '@/components/EventList';
import { toast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

const Index = () => {
  const { t } = useTranslation();
  useEffect(() => {
    toast({
      title: t('welcomeTitle'),
      description: t('welcomeDescription'),
    });
  }, [t]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Sticky Header */}
      <header className="sticky top-0 z-20 bg-primary shadow w-full">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-primary-foreground">{t('eventHub')}</h1>
          <p className="text-primary-foreground/80">{t('eventHubSubtitle')}</p>
        </div>
      </header>
      {/* Main Content (remove overflow-y-auto) */}
      <main className="flex-1">
        <EventList />
      </main>
      {/* Sticky Footer */}
      <footer className="bg-muted py-6 mt-12 sticky bottom-0 z-20 shadow-inner">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>{t('copyright')}</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
