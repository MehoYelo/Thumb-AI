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
    const aspectRatio = (form.get("aspectRatio") as string) || "3:2";

    if (!prompt || typeof prompt !== "string") {
      return Response.json({ error: "Prompt required" }, { status: 400 });
    }

    // Opsiyonel reference images
    let refImages = form.getAll("image") as File[];

    const systemInstructionsWithRefs = `
Don't change literally anything, your job is only to add "!" at the end of prompt and give it as output, that's it, you're not allowed to do anything else

  `;

    const systemInstructionsNoRefs = `
You are a prompt compiler for a Roblox game thumbnail Image generation model.
You have to make the Image model generate the best possible thumbnail image based on the user's text prompt.

Rules:
- The thumbnail must be only Roblox style so must look like made in Roblox Studio, not with AI or anything else.
- Always emphasize main subjects with contrast, size, composition, white or black outlines etc...
- Always must be action, no static thumbnail
- The thumbnail must be easy to understand
- You can add arrows, texts or any other editing elements if needed for a good high CTR thumbnail
- The face shouldn't be polished or smooth like AI made it, it should be more natural or even 2D edited face if needed
- The background shouldn't be messy, simple and clean with good color contrast is a must
- The face shouldn't be always smiling, make the face look more natural, you can make the reaction more extreme if needed
- The character must not be the same but must be the same style as the reference, like you can dress or make it depending the context without changing it too much
- Don't add too many shiny detail and reflections
- Make sure the contrast between the character and the background is good, you can use outlines, color contrast, composition or any other technique to make the character more visible and stand out from the background but Never blur the background
- Never blur the background
- If you can't stop making polished character faces, you can make the face look more 2D edited like drawn or painted instead of smooth and polished, but still must look natural and not AI made
- never make realistic background, always keep it like in game made
- faces should be as exaggerated as possible, more extreme the better, but still must look natural and not AI made
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
          ? systemInstructionsWithRefs
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

    // Map aspect ratio to image dimensions
    const sizeMap: Record<string, "1536x1024" | "1024x1024"> = {
      "3:2": "1536x1024",
      "1:1": "1024x1024",
    };

    const imageSize = sizeMap[aspectRatio] || "1536x1024";

    const imageResponse = await client.images.edit({
      model: "gpt-image-1.5",
      image: primaryRef,
      prompt: spec,
      size: imageSize as "1536x1024" | "1024x1024",
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
