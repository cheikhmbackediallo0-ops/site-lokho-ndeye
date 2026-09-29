import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { config, higgsfield } from "@higgsfield/client/v2";

async function main() {
  const rawCreds = process.env.HF_CREDENTIALS || process.env.HF_KEY;
  const credentials = rawCreds?.replace(/^["']|["']$/g, "").trim();

  if (!credentials || !credentials.includes(":") || credentials === "") {
    console.error(
      "Error: Missing or incomplete HF_CREDENTIALS in .env.local.\n" +
      "Please enter your Higgsfield API key in .env.local using the format: key-id:key-secret"
    );
    process.exit(1);
  }

  // Configure SDK credentials server-side without logging or exposing their values
  // Increase maxPollTime to 15 minutes (900000ms) for high-load video rendering queues
  config({
    credentials,
    maxPollTime: 900000,
    pollInterval: 5000,
  });

  console.log("Submitting video generation request to model: bytedance/seedance-2.5/text-to-video...");
  console.log('Parameters: prompt="A cinematic scene at sunset", duration=5, resolution=720p, aspect_ratio=16:9');

  const startTime = Date.now();
  const progressInterval = setInterval(() => {
    const elapsed = Math.round((Date.now() - startTime) / 1000);
    console.log(`Still processing Seedance 2.5 video generation (${elapsed}s elapsed)...`);
  }, 15000);

  try {
    const result = await higgsfield.subscribe(
      "bytedance/seedance-2.5/text-to-video",
      {
        input: {
          prompt: "A cinematic scene at sunset",
          duration: 5,
          resolution: "720p",
          aspect_ratio: "16:9",
        },
        withPolling: true,
      }
    );

    clearInterval(progressInterval);

    if (result.status === "completed") {
      const videoUrl = result.video?.url;
      if (videoUrl) {
        console.log("Video generation completed successfully!");
        console.log(`Video URL: ${videoUrl}`);
        return videoUrl;
      } else {
        console.error("Request marked as completed, but no video URL was returned in the response.");
        process.exit(1);
      }
    } else if (result.status === "failed") {
      const errorMessage = (result as any).error || "Unknown failure reason";
      console.error(`Video generation failed: ${errorMessage}`);
      process.exit(1);
    } else if (result.status === "canceled") {
      console.error("Video generation was canceled.");
      process.exit(1);
    } else if (result.status === "nsfw" || (result as any).status === "moderated") {
      console.error("Video generation request was moderated / flagged under safety guidelines.");
      process.exit(1);
    } else {
      console.error(`Unexpected terminal status received: ${result.status}`);
      process.exit(1);
    }
  } catch (error: any) {
    console.error(`API execution error: ${error.message || error}`);
    process.exit(1);
  } finally {
    clearInterval(progressInterval);
  }
}

main();
