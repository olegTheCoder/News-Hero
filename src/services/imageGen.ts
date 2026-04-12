const SF_TOKEN = "sk-glxioukowaqnjvpawnnzokjysabktxdbokhjiwqirstqqret";

export async function generateImage(
  prompt: string,
  _signal: AbortSignal,
  width = 512,
  height = 512,
  originalImageUrl?: string
): Promise<string> {
  const words = prompt.split(" ").slice(0, 50).join(" ");

  try {
    const payload: Record<string, unknown> = {
      model: "black-forest-labs/FLUX.1-schnell",
      prompt: words,
      image_size: `${width}x${height}`,
    };

    if (originalImageUrl) {
      payload.image_url = originalImageUrl;
    }

    const res = await fetch("https://api.siliconflow.com/v1/images/generations", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SF_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.text();
      console.log("SiliconFlow error:", res.status, err);
      throw new Error(`API error: ${res.status}`);
    }

    const data = await res.json();
    console.log("SiliconFlow response:", data);
    let imageUrl = data.images?.[0]?.url;
    if (!imageUrl) {
      console.log("No image URL in response:", data);
      throw new Error("No image URL");
    }

    console.log("Image URL from API:", imageUrl);

    if (imageUrl.includes("delivery.")) {
      const path = imageUrl.replace("https://delivery", "");
      return "/bfl-image" + path;
    } else if (imageUrl.includes("s3.amazonaws.com")) {
      return imageUrl;
    }

    return imageUrl;
  } catch (e) {
    console.log("Generation error:", e);
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");

  const hues = [230, 260, 180, 300];
  const hue = hues[Math.floor(Math.random() * hues.length)];
  ctx.fillStyle = `hsl(${hue}, 60%, 15%)`;
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = `hsl(${hue}, 70%, 60%)`;
  ctx.beginPath();
  ctx.arc(width / 2, height / 2, 100, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = `hsl(${hue}, 80%, 80%)`;
  ctx.font = "bold 20px Arial";
  ctx.textAlign = "center";
  ctx.fillText(words.substring(0, 15), width / 2, height / 2 + 60);

  ctx.fillStyle = "#ffffff";
  ctx.font = "12px Arial";
  ctx.fillText("News Hero", width / 2, height - 15);

  return canvas.toDataURL("image/png");
}