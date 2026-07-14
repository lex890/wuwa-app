import { supabase } from "@/api/supabase";

async function uploadImage(file, folder) {

  if (!(file instanceof File) || file.size === 0) {
    return null;
  }

  // generating UUID for same information data
  const fileName = `${crypto.randomUUID()}-${file.name}`;
  const path = `${folder}/${fileName}`;

  const { data, error } = await supabase.storage
    .from("character-images")
    .upload(path, file);

  if (error) throw error;

  // directly parsing supabase URL
  const url = supabaseURL({
    imagePath: data.path,
  });
  return url.data.publicUrl
  // this returns {publicUrl: ""}
}

function supabaseURL({ imagePath }) {
  return supabase.storage
    .from("character-images")
    .getPublicUrl(imagePath);
}

export default uploadImage