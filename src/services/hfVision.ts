const HF_API_URL = "/api/hf/models/Salesforce/blip-image-captioning-large";

export async function describeImage(file: File): Promise<string> {
  const token = import.meta.env.VITE_HF_TOKEN as string | undefined;

  if (!token) {
    return "";
  }

  const bytes = await file.arrayBuffer();

  const res = await fetch(HF_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": file.type,
    },
    body: bytes,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HF API ${res.status}: ${text}`);
  }

  const data = await res.json();

  if (Array.isArray(data) && data[0]?.generated_text) {
    return data[0].generated_text as string;
  }

  return "";
}
