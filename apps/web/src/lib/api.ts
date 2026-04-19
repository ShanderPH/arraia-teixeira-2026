const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export interface DishResponse {
  id: string;
  name: string;
  created_at: string;
  guest_count: number;
}

export interface GuestResponse {
  id: string;
  name: string;
  attending: boolean;
  dish_id: string | null;
  created_at: string;
}

export interface RSVPPayload {
  name: string;
  attending: boolean;
  dish_name?: string | null;
}

async function request<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`API error ${res.status}: ${body}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  rsvp: {
    submit: (payload: RSVPPayload) =>
      request<GuestResponse>("/v1/rsvp", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
  },
  dishes: {
    list: () => request<DishResponse[]>("/v1/dishes"),
    create: (name: string) =>
      request<DishResponse>("/v1/dishes", {
        method: "POST",
        body: JSON.stringify({ name }),
      }),
  },
  guests: {
    list: () => request<GuestResponse[]>("/v1/guests"),
  },
};
