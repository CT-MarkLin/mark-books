// import { IsomorphicCommunicate } from "edge-tts-universal";
import { EdgeTTS } from "edge-tts-universal";

export const ttsApi = async (text: string) => {
  // Works in both Node.js and browsers (subject to CORS policy)
  const tts = new EdgeTTS(text, "zh-CN-XiaoxiaoNeural");

  const result = await tts.synthesize();

    // Save audio file
    const audioBuffer = await result.audio;
  return audioBuffer;
};
