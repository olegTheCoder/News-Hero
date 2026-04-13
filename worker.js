const LEONARDO_API_KEY = "d51f365a-9196-438f-8096-db97698ff24b";
const MODEL_ID = "b2614463-296c-462a-9586-aafdb8f00e36"; // Flux Dev

export default {
  async fetch(request, env, ctx) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { prompt, width = 1024, height = 1024 } = body;

    if (!prompt) {
      return new Response(JSON.stringify({ error: "No prompt provided" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    try {
      console.log("Leonardo: Starting text-to-image generation with Phoenix...");
      console.log("Leonardo: Prompt:", prompt.slice(0, 100));

      const genRes = await fetch(
        "https://cloud.leonardo.ai/api/rest/v1/generations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${LEONARDO_API_KEY}`,
          },
          body: JSON.stringify({
            prompt: prompt,
            modelId: MODEL_ID,
            num_images: 1,
            width,
            height,
            contrast: 3.5,
          }),
        }
      );

      const genData = await genRes.json();
      console.log("Leonardo: API response:", JSON.stringify(genData).slice(0, 500));

      const generationId = genData.generationId || genData.sdGenerationJob?.generationId;

      if (!generationId) {
        console.log("Leonardo: No generation ID, full response:", JSON.stringify(genData));
        throw new Error(genData.error?.message || "No generation ID");
      }

      console.log("Leonardo: Polling for generation:", generationId);

      for (let i = 0; i < 90; i++) {
        await new Promise((r) => setTimeout(r, 3000));

        const statusRes = await fetch(
          `https://cloud.leonardo.ai/api/rest/v1/generations/${generationId}`,
          {
            headers: {
              Authorization: `Bearer ${LEONARDO_API_KEY}`,
            },
          }
        );

        const statusData = await statusRes.json();
        const status = statusData.generations_by_pk?.status;
        console.log(`Leonardo: Poll ${i + 1} - Status:`, status);

        if (status === "COMPLETE") {
          const images = statusData.generations_by_pk.generated_images;
          if (images?.[0]?.url) {
            console.log("Leonardo: Success!", images[0].url);
            
            const imgRes = await fetch(images[0].url);
            const imgBlob = await imgRes.blob();
            const arrayBuffer = await imgBlob.arrayBuffer();
            const base64 = btoa(
              new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), "")
            );

            return new Response(JSON.stringify({
              success: true,
              imageBase64: base64,
              model: "leonardo-flux-dev",
            }), {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
          }
        }

        if (status === "FAILED") {
          console.log("Leonardo: Generation failed, details:", statusData);
          throw new Error("Generation failed");
        }
      }

      throw new Error("Timeout waiting for generation");
    } catch (e) {
      console.log("Leonardo error:", e.message);
      return new Response(JSON.stringify({ error: e.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  },
};
