import { api, type DishResponse, type GuestResponse, type RSVPPayload } from "@/lib/api";

export async function listDishes(): Promise<DishResponse[]> {
  try {
    return await api.dishes.list();
  } catch {
    return [];
  }
}

export async function listGuests(): Promise<GuestResponse[]> {
  try {
    return await api.guests.list();
  } catch {
    return [];
  }
}

export async function submitRsvp(payload: RSVPPayload): Promise<GuestResponse> {
  return api.rsvp.submit(payload);
}
