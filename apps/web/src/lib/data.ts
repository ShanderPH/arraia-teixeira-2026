import { api, type DishResponse, type GuestResponse } from "@/lib/api";

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

export async function submitRsvp(payload: {
  name: string;
  attending: boolean;
  dish_name?: string | null;
}): Promise<GuestResponse> {
  return api.rsvp.submit(payload);
}
