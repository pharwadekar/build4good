export async function detectObjects(imageBase64: string) {
  const response = await fetch(
    "https://detect.roboflow.com/pantry-object-detection/1",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Bearer ${process.env.EXPO_PUBLIC_ROBOFLOW_API_KEY}`
      },
      body: imageBase64
    }
  );

  return await response.json();
}