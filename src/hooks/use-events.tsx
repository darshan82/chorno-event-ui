import { useQuery } from "@tanstack/react-query";

export interface Event {
  id: number;
  title: string;
  description: string;
  image_url: string;
  starts_at: string;
  expires_at: string;
  location: string;
  type: string;
}

export type EventStatus = "upcoming" | "ongoing" | "expired";

export const BASE_API_URL = "https://68148b33225ff1af16292eee.mockapi.io/api/v1";

const fetchEvents = async (params = ""): Promise<Event[]> => {
  const response = await fetch(`${BASE_API_URL}/events${params}`);
  if (!response.ok) {
    throw new Error("Failed to fetch events");
  }
  return response.json();
};

export function useEvents(params = "") {
  return useQuery({
    queryKey: ["events", params],
    queryFn: () => fetchEvents(params),
  });
}

export function getEventStatus(event: Event): EventStatus {
  const now = new Date();
  const startDate = new Date(event.starts_at);
  const endDate = new Date(event.expires_at);

  if (now < startDate) {
    return "upcoming";
  } else if (now >= startDate && now <= endDate) {
    return "ongoing";
  } else {
    return "expired";
  }
}

export function getEventTimeDisplay(event: Event): string {
  const now = new Date();
  const startDate = new Date(event.starts_at);
  const endDate = new Date(event.expires_at);
  const status = getEventStatus(event);

  if (status === "expired") {
    return "Expired";
  }

  const targetDate = status === "upcoming" ? startDate : endDate;
  const diffTime = Math.abs(targetDate.getTime() - now.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const diffMinutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));

  return status === "upcoming" 
    ? `Starting in ${diffDays} days : ${diffHours} hours : ${diffMinutes} minutes`
    : `Ending in ${diffDays} days : ${diffHours} hours : ${diffMinutes} minutes`;
}
