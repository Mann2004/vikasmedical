import { projectId, publicAnonKey } from '/utils/supabase/info';

const BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-7b6c090f`;

const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${publicAnonKey}`,
};

async function request(path: string, options?: RequestInit) {
  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers: { ...headers, ...(options?.headers || {}) } });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

export const api = {
  // Users
  register: (payload: { name: string; mobile: string; dob: string }) =>
    request('/users/register', { method: 'POST', body: JSON.stringify(payload) }),

  login: (payload: { name: string; dob: string }) =>
    request('/users/login', { method: 'POST', body: JSON.stringify(payload) }),

  // Medicines
  getMedicines: (mobile: string) =>
    request(`/medicines/${mobile}`),

  saveMedicines: (mobile: string, medicines: any[]) =>
    request(`/medicines/${mobile}`, { method: 'POST', body: JSON.stringify({ medicines }) }),

  // Contact
  sendContact: (payload: { name: string; phone: string; message: string }) =>
    request('/contact', { method: 'POST', body: JSON.stringify(payload) }),
};
