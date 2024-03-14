import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Desk, Department, Client } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

let BACKEND_URL = "http://qms.local/api";

if (!import.meta.env.PROD) {
  BACKEND_URL = "http://localhost:3000";
}

export async function getDesks(): Promise<Desk[]> {
  const response = await fetch(`${BACKEND_URL}/desks`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const desks = await response.json();
  return desks;
}

export async function getClients(): Promise<Client[]> {
  const response = await fetch(`${BACKEND_URL}/clients`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const clients: Client[] = await response.json();
  return clients;
}

export async function getDepartments(): Promise<Department[]> {
  const response = await fetch(`${BACKEND_URL}/departments`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const departments = await response.json();
  return departments;
}

export async function createClient(
  departmentId: number,
  token: string,
): Promise<Client> {
  const response = await fetch(`${BACKEND_URL}/clients`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ departmentId }),
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const newClient = await response.json();
  return newClient;
}

export async function dequeueClient(
  deskId: number,
  departmentId: number,
  token: string,
): Promise<Client | null> {
  const response = await fetch(`${BACKEND_URL}/desk/${deskId}/dequeue`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ departmentId }),
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const nextClient = await response.json();
  return nextClient;
}

export async function callClient(
  deskId: number,
  clientId: number,
  token: string,
): Promise<Client | null> {
  const response = await fetch(`${BACKEND_URL}/desk/${deskId}/call`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ clientId }),
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const nextClient = await response.json();
  return nextClient;
}
