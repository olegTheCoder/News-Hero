const LEONARDO_KEY = "d51f365a-9196-438f-8096-db97698ff24b";

export async function generateImage(
  prompt: string,
  _signal: AbortSignal
): Promise<{ imageUrl: string; model: string }> {
  console.log("Leonardo: Starting generation, prompt:", prompt.slice(0, 50));

  const truncated = prompt.slice(0, 1400);

  const genRes = await fetch("https://cloud.leonardo.ai/api/rest/v1/generations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${LEONARDO_KEY}`,
    },
    body: JSON.stringify({
      prompt: truncated,
      modelId: "de7d3faf-762f-48e0-b3b7-9d0ac3a3fcf3",
      num_images: 1,
      width: 1024,
      height: 1024,
    }),
  });

  console.log("Leonardo: Submit status:", genRes.status);

  const genData = await genRes.json();
  console.log("Leonardo: Response:", JSON.stringify(genData).slice(0, 300));

  const genId = genData.generationId || genData.sdGenerationJob?.generationId;
  if (!genId) {
    throw new Error(genData.error?.message || "No generation ID");
  }

  console.log("Leonardo: Polling for:", genId);

  for (let i = 0; i < 60; i++) {
    await new Promise(r => setTimeout(r, 3000));

    const statusRes = await fetch(
      `https://cloud.leonardo.ai/api/rest/v1/generations/${genId}`,
      { headers: { Authorization: `Bearer ${LEONARDO_KEY}` } }
    );

    const statusData = await statusRes.json();
    const status = statusData.generations_by_pk?.status;
    console.log(`Leonardo poll ${i + 1}:`, status);

    if (status === "COMPLETE") {
      const img = statusData.generations_by_pk.generated_images?.[0]?.url;
      if (!img) throw new Error("No image");

      const imgRes = await fetch(img);
      const blob = await imgRes.blob();
      console.log("Leonardo: Got image, size:", blob.size);

      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });

      return { imageUrl: base64, model: "leonardo-phoenix" };
    }

    if (status === "FAILED") {
      throw new Error("Generation failed");
    }
  }

  throw new Error("Timeout");
}