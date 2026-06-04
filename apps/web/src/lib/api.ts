const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export interface DishResponse {
  id: string;
  name: string;
  category: string;
  emoji: string;
  photo_url: string | null;
  created_at: string;
  guest_count: number;
}

export interface GuestResponse {
  id: string;
  name: string;
  attending: boolean;
  guest_count: number;
  dish_id: string | null;
  created_at: string;
}

export interface RSVPPayload {
  name: string;
  attending: boolean;
  guest_count?: number;
  dish_name?: string | null;
}

export interface GalleryPhotoResponse {
  id: string;
  title: string;
  photo_url: string;
  sort_order: number;
  created_at: string;
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
  if (res.status === 204 || res.headers.get("content-length") === "0") {
    return undefined as T;
  }
  return res.json() as Promise<T>;
}

async function requestFormData<T>(
  path: string,
  formData: FormData,
  method = "POST"
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    body: formData,
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
    uploadPhoto: (dishId: string, file: File) => {
      const fd = new FormData();
      fd.append("file", file);
      return requestFormData<DishResponse>(`/v1/dishes/${dishId}/photo`, fd, "POST");
    },
    deletePhoto: (dishId: string) =>
      request<DishResponse>(`/v1/dishes/${dishId}/photo`, { method: "DELETE" }),
  },
  guests: {
    list: () => request<GuestResponse[]>("/v1/guests"),
    delete: (guestId: string) =>
      request<void>(`/v1/guests/${guestId}`, { method: "DELETE" }),
  },
  gallery: {
    list: () => request<GalleryPhotoResponse[]>("/v1/gallery"),
    upload: (title: string, file: File) => {
      const fd = new FormData();
      fd.append("title", title);
      fd.append("file", file);
      return requestFormData<GalleryPhotoResponse>("/v1/gallery", fd, "POST");
    },
    delete: (photoId: string) =>
      request<void>(`/v1/gallery/${photoId}`, { method: "DELETE" }),
    reorder: (items: Array<{ id: string; sort_order: number }>) =>
      request<void>("/v1/gallery/reorder", {
        method: "PATCH",
        body: JSON.stringify({ items }),
      }),
  },
};
