const POLLINATIONS_API = "https://image.pollinations.ai/prompt";

export async function generateImage(
  prompt: string,
  signal: AbortSignal,
  width = 1280,
  height = 768
): Promise<string> {
  const seed = Math.floor(Math.random() * 999999);
  const url = `${POLLINATIONS_API}/${encodeURIComponent(prompt)}?width=${width}&height=${height}&nologo=true&seed=${seed}`;

  const res = await fetch(url, { signal, mode: "cors" });

  if (!res.ok) {
    throw new Error(`Pollinations ${res.status}`);
  }

  const blob = await res.blob();
  return URL.createObjectURL(blob);
}
