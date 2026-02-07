import OpenAI from "openai";
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
    const spec = form.get("spec");

    if (!spec || typeof spec !== "string") {
      return Response.json(
        { error: "Compiled spec required" },
        { status: 400 },
      );
    }

    // 🔒 Ref ZORUNLU (şimdilik)
    const refs = form.getAll("images") as File[];

    if (!refs || refs.length === 0) {
      return Response.json(
        { error: "At least one reference image is required" },
        { status: 400 },
      );
    }

    // 💳 Credit burada tüketilir
    const { data: creditOk } = await supabase.rpc("consume_credit", {
      uid: user.id,
    });

    if (!creditOk) {
      return Response.json({ error: "No credits" }, { status: 402 });
    }

    const primaryRef = refs[0];

    const imageResponse = await client.images.edit({
      model: "gpt-image-1.5",
      image: primaryRef,
      prompt: spec,
      size: "1024x1024",
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
      imageUrl: publicUrl,
      imageId: imageRecord?.[0]?.id,
    });
  } catch (err) {
    console.error(err);
    return Response.json(
      { error: "Server error" },
      { status: 500 },
    );
  }
}
