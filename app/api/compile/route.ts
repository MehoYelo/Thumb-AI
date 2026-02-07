import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const prompt = form.get("prompt");

    if (!prompt || typeof prompt !== "string") {
      return Response.json({ error: "Prompt required" }, { status: 400 });
    }

    // Opsiyonel reference images
    const refImages = form.getAll("image") as File[];

    const systemInstructions = `
add just "." at the end of the prompt that's it nothing else`
    // Input content (text + optional image)
    type InputContent =
      | {
          type: "input_text";
          text: string;
        }
      | {
          type: "input_image";
          image_url: string;
          detail: "low" | "high" | "auto";
        };

    const inputContent: InputContent[] = [
      {
        type: "input_text",
        text: prompt,
      },
    ];

    if (refImages.length > 0) {
      const dataUrls = await Promise.all(
        refImages.map(async (file) => {
          const buffer = Buffer.from(await file.arrayBuffer());
          return `data:${file.type};base64,${buffer.toString("base64")}`;
        }),
      );

      dataUrls.forEach((image_url) => {
        inputContent.push({
          type: "input_image",
          image_url,
          detail: "low",
        });
      });
    }

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      instructions: systemInstructions,
      input: [
        {
          role: "user",
          content: inputContent,
        },
      ],
    });

    const spec = response.output_text?.trim();

    if (!spec) {
      return Response.json(
        { error: "Compiler produced no output" },
        { status: 500 },
      );
    }

    return Response.json({ spec });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
