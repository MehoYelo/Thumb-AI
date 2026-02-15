import OpenAI from "openai";
import path from "path";
import { readFile } from "fs/promises";
import { createServerSupabase } from "@/lib/supabase/server";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const supabase = await createServerSupabase();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const form = await req.formData();
    const prompt = form.get("prompt");

    if (!prompt || typeof prompt !== "string") {
      return Response.json({ error: "Prompt required" }, { status: 400 });
    }

    // Opsiyonel reference images
    let refImages = form.getAll("image") as File[];

    const systemInstructionsWithRefs = `
You are a prompt compiler for a Roblox game thumbnail generator.
Your output will be sent directly to an image generation model.

  `;

    const systemInstructionsNoRefs = `
    You are a prompt compiler for a Roblox game thumbnail generator.
Your output will be sent directly to an image generation model.
The image was provided from our backend because user didn't upload any reference image.
The image is a default Roblox character(also known as "Bacon") in a neutral pose.
Your job is to compile user's prompt into a better prompt for image generation model.
Rules:
- Always include the character in the image in the prompt by default unless user says otherwise. The character is in a neutral pose, so you can describe it as "a Roblox character in a neutral pose".
- Never mention the game name in the thumbnail unless user says otherwise.
- Usually the main subjects are emphasized more in the thumbnail with brighter colors, contrast, white outlines and larger size.


`;

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

    if (refImages.length === 0) {
      const presetDir = path.join(
        process.cwd(),
        "assets",
        "refs",
        "characters",
      );
      const malePath = path.join(presetDir, "male.png");

      try {
        const maleBuffer = await readFile(malePath);

        const maleFile = new File([maleBuffer], "male.png", {
          type: "image/png",
        });

        refImages = [maleFile];
      } catch (error) {
        console.error("Preset refs missing:", error);
        return Response.json(
          { error: "Preset reference images not found" },
          { status: 500 },
        );
      }
    }

    const inputContent: InputContent[] = [
      {
        type: "input_text",
        text: prompt,
      },
    ];

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
        detail: "high",
      });
    });

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      instructions:
        form.getAll("image").length > 0
          ? systemInstructionsNoRefs
          : systemInstructionsNoRefs,
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

    // 💳 Consume credit
    const { data: creditOk } = await supabase.rpc("consume_credit", {
      uid: user.id,
    });

    if (!creditOk) {
      return Response.json({ error: "No credits" }, { status: 402 });
    }

    const primaryRef = refImages[0];

    const imageResponse = await client.images.edit({
      model: "gpt-image-1.5",
      image: primaryRef,
      prompt: spec,
      size: "1536x1024",
      quality: "medium",
    });

    const base64Image = imageResponse.data?.[0]?.b64_json;
    if (!base64Image) {
      return Response.json(
        { error: "Image generation failed" },
        { status: 500 },
      );
    }

    const buffer = Buffer.from(base64Image, "base64");
    const filename = `${user.id}/${Date.now()}.png`;

    await supabase.storage
      .from("thumbnails")
      .upload(filename, buffer, { contentType: "image/png" });

    const {
      data: { publicUrl },
    } = supabase.storage.from("thumbnails").getPublicUrl(filename);

    const { data: imageRecord, error: dbError } = await supabase
      .from("images")
      .insert({
        user_id: user.id,
        image_url: publicUrl,
        prompt: spec,
      })
      .select();

    if (dbError) {
      console.error("Database error:", dbError);
      return Response.json(
        { error: "Failed to save image record" },
        { status: 500 },
      );
    }

    return Response.json({
      spec,
      imageUrl: publicUrl,
      imageId: imageRecord?.[0]?.id,
    });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
