import { GoogleGenAI } from "@google/genai";

export const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateContent(prompt: string, context?: string) {
  const model = "gemini-3-flash-preview";
  const systemInstruction = `You are WriterMind AI, a helpful writing assistant for OpenOffice Writer users. 
  Your goal is to help users write, edit, and proofread their documents.
  Provide concise, actionable advice. When asked to write content, provide it in high-quality text format.
  If the user provides context from their document, use it to make your response more relevant.`;

  const fullPrompt = context 
    ? `Document Context:\n"""\n${context}\n"""\n\nUser Request: ${prompt}`
    : prompt;

  const response = await ai.models.generateContent({
    model,
    contents: fullPrompt,
    config: {
      systemInstruction,
      temperature: 0.7,
    },
  });

  return response.text;
}
