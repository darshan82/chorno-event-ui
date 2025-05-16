
import React from 'react';
import { EventDetail } from '@/components/EventDetail';

const EventDetailPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-primary-foreground">Event Hub</h1>
          <p className="text-primary-foreground/80">Discover and track exciting events</p>
        </div>
      </header>
      <main>
        <EventDetail />
      </main>
      <footer className="bg-muted py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 Event Hub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default EventDetailPage;
