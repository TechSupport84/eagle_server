import { v4 as uuidv4 } from "uuid";
import { supabase } from "../config/supabaseClient.js";

async function uploadToSupabase(file) {
    try {
        const fileExt = file.originalname.split('.').pop(); // ← fix here
        const filename = `${uuidv4()}.${fileExt}`; // ← fix uuid4 to uuidv4

        // Upload image to Supabase
        const { data, error } = await supabase.storage
            .from(process.env.BUCKET_NAME)
            .upload(filename, file.buffer, {
                contentType: file.mimetype
            });

        if (error) {
            throw new Error(error.message);
        }

        // Get public URL
        const { data: publicData, error: urlError } = await supabase.storage
            .from(process.env.BUCKET_NAME)
            .getPublicUrl(filename);

        if (urlError) {
            throw new Error(urlError.message);
        }

        return publicData.publicUrl; // Correct

    } catch (error) {
        console.error("Error uploading to Supabase:", error.message);
        throw new Error("Error uploading image to Supabase");
    }
}

export { uploadToSupabase };