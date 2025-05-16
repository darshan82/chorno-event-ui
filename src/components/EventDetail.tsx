import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Event, getEventStatus, getEventTimeDisplay, BASE_API_URL } from "@/hooks/use-events";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Clock, MapPin, ArrowLeft, User } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export function EventDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState("");
  const fetchEvent = async () => {
    try {
      const response = await fetch(`${BASE_API_URL}/events?id=${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch event details");
      }
      const data = await response.json();
      if (data && data.length > 0) {
        setEvent(data[0]);
        setTimeLeft(getEventTimeDisplay(data[0]));
      } else {
        toast({
          title: "Error",
          description: "Event not found",
          variant: "destructive",
        });
        navigate("/");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load event details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {


    if (id) {
      fetchEvent();
    }

    // Update countdown timer every minute
    const timer = setInterval(() => {
      if (event) {
        setTimeLeft(getEventTimeDisplay(event));
      }
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-3/4 mb-6"></div>
          <div className="h-64 bg-muted rounded-lg mb-6"></div>
          <div className="h-4 bg-muted rounded w-1/2 mb-4"></div>
          <div className="h-4 bg-muted rounded w-full mb-4"></div>
          <div className="h-4 bg-muted rounded w-full mb-4"></div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Event not found</h1>
        <Button onClick={() => navigate("/")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Events
        </Button>
      </div>
    );
  }

  const status = getEventStatus(event);

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="outline"
        className="mb-6"
        onClick={() => navigate("/")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Events
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="mb-6">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
              <h1 className="text-3xl font-bold">{event.title}</h1>
              <Badge
                variant={
                  status === "expired"
                    ? "destructive"
                    : status === "ongoing"
                      ? "default"
                      : "secondary"
                }
                className="text-sm px-3 py-1"
              >
                {status}
              </Badge>
            </div>
            <p className={`text-md font-medium ${status === "expired" ? "text-destructive" : ""}`}>
              {timeLeft}
            </p>
          </div>

          <div className="mb-8 rounded-lg overflow-hidden aspect-video">
            <img
              src={event.image_url || "/placeholder.svg"}
              alt={event.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/placeholder.svg";
              }}
            />
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">About this event</h2>
            <p className="whitespace-pre-line">
              {event.description}
            </p>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-card rounded-lg p-6 sticky top-6 shadow-sm border">
            <h2 className="text-xl font-semibold mb-4">Event Details</h2>

            <div className="space-y-4">
              <div className="flex items-start">
                <CalendarIcon className="h-5 w-5 mr-3 mt-0.5 text-muted-foreground" />
                <div>
                  <h3 className="font-medium">Date & Time</h3>
                  <p className="text-sm">
                    {new Date(event.starts_at).toLocaleDateString()} - {new Date(event.expires_at).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(event.starts_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -
                    {new Date(event.expires_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <MapPin className="h-5 w-5 mr-3 mt-0.5 text-muted-foreground" />
                <div>
                  <h3 className="font-medium">Location</h3>
                  <p className="text-sm">{event.location}</p>
                </div>
              </div>

              <div className="pt-2">
                <h3 className="font-medium mb-2">Type</h3>
                <Badge variant="outline" className="mr-2">
                  {event.type}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
