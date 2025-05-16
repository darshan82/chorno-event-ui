import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Event, getEventStatus, getEventTimeDisplay } from "@/hooks/use-events";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, MapPinIcon } from "lucide-react";
import { Link } from "react-router-dom";

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const status = getEventStatus(event);
  const timeDisplay = getEventTimeDisplay(event);

  return (
    <Link to={`/event/${event.id}`}>
      <Card className="h-full hover:shadow-md transition-shadow overflow-hidden group">
        <div className="aspect-video overflow-hidden">
          <img 
            src={event.image_url || "/placeholder.svg"} 
            alt={event.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/placeholder.svg";
            }}
          />
        </div>
        <CardHeader className="p-4">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg line-clamp-1">{event.title}</CardTitle>
            <Badge variant={status === "expired" ? "destructive" : status === "ongoing" ? "default" : "secondary"}>
              {status}
            </Badge>
          </div>
          <CardDescription className="flex items-center gap-1 text-xs">
            <MapPinIcon className="h-3 w-3" />
            {event.location}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <p className="text-sm line-clamp-2">{event.description}</p>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex flex-col items-start">
          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
            <CalendarIcon className="h-3 w-3" />
            <span>
              {new Date(event.starts_at).toLocaleDateString()} - {new Date(event.expires_at).toLocaleDateString()}
            </span>
          </div>
          <p className={`text-sm font-medium ${status === "expired" ? "text-destructive" : ""}`}>
            {timeDisplay}
          </p>
        </CardFooter>
      </Card>
    </Link>
  );
}
