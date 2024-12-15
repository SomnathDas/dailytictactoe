export async function createRoom() {
  const response = await fetch("/api", { method: "POST" });
  const data = await response.json();
  return data;
}
