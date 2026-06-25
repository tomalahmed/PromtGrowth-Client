const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

export async function uploadImageToImgBB(file) {
  if (!IMGBB_API_KEY) {
    throw new Error("ImgBB API key is not configured");
  }

  if (!file) {
    throw new Error("No image file selected");
  }

  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(
    `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
    {
      method: "POST",
      body: formData,
    }
  );

  const result = await response.json();

  if (!response.ok || !result?.data?.url) {
    throw new Error(result?.error?.message || "Failed to upload image");
  }

  return result.data.url;
}
