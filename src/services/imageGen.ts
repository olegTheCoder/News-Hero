const WORKER_URL = "https://news-hero-image.olegthecoder89.workers.dev";

export async function generateImage(
  prompt: string,
  _signal: AbortSignal,
  width = 1024,
  height = 1024
): Promise<{ imageUrl: string; model: string }> {
  const words = prompt.split(" ").slice(0, 100).join(" ");

  console.log("Worker: Starting request with prompt:", words.slice(0, 50));

  try {
    const res = await fetch(
      WORKER_URL,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: words,
          width,
          height,
        }),
      }
    );

    console.log("Worker: Response status:", res.status);

    const data = await res.json();
    console.log("Worker response:", data);

    if (data.success && data.imageBase64) {
      console.log("Worker: Success! Base64 image, model:", data.model);
      return { 
        imageUrl: `data:image/png;base64,${data.imageBase64}`,
        model: data.model 
      };
    }

    if (data.error) {
      console.log("Worker error:", data.error);
      throw new Error(data.error);
    }
  } catch (e) {
    console.log("Worker exception:", e);
    throw e;
  }

  throw new Error("Не удалось сгенерировать изображение");
}
