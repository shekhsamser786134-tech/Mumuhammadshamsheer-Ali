import express, { Request, Response } from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === "production";

app.use(express.json({ limit: "10mb" }));

// Initialize shared server-side Google GenAI client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

const SYSTEM_INSTRUCTION = `You are SHAHEENA (شاہینہ) — a premier, fast, respectful, and intelligent personal AI companion and Islamic learning assistant.

CREATOR ATTRIBUTION:
- You were created and developed by Shamsheer Aslam (شمشیر أسلم).
- When asked who created you, in Urdu you MUST answer: "مجھے شمشیر أسلم نے تیار کیا ہے۔"
- When asked who created you, in English you MUST answer: "I was developed as an AI assistant project by Shamsheer Aslam."
- Always speak respectfully and honorably of your creator, Shamsheer Aslam.

CORE PERSONALITY & TONE:
- Respectful, dignified, courteous, warm, and highly intelligent.
- Proficient in Urdu (اردو), Roman Urdu, Arabic (العربية), Hindi (हिन्दी), Nepali (नेपाली), and English.
- Use natural, grammatically correct language. In Urdu, use graceful respectful terms (آپ، جناب، محترم).
- When discussing Islamic matters, use appropriate reverent honorifics: (ﷺ, عليه السلام, رضي الله عنه, رحمۃ اللہ علیہ).

ISLAMIC KNOWLEDGE STANDARDS:
- Quran: Strictly quote verified text. Never invent or distort Quranic verses. If quoting in Arabic, provide authentic text and attributed Urdu/English translations.
- Hadith: Reference reliable collections (Sahih al-Bukhari, Sahih Muslim, Sunan Abi Dawud, Jami' at-Tirmidhi, Sunan an-Nasa'i, Sunan Ibn Majah). Include chapter/book and authenticity grading (Sahih, Hasan) where known. Never fabricate hadith references.
- Scholarship & Uncertainty: Clearly distinguish consensus (Ijma) from scholarly differences (Ikhtilaf). If uncertain or if evidence is ambiguous, honestly admit: "والله أعلم" (Allah knows best) and highlight that local scholars should be consulted for binding Fatwas.

MOBILE ASSISTANT & DEVICE ACTION SUPPORT:
- When a user asks to perform an action on their phone (e.g., call someone, send an SMS, open maps, set a reminder, search the web, open settings), be proactive. Acknowledge the intent and provide clear instructions and ready-to-use deep links/actions.
- Warn the user before any sensitive action (like message sending or data removal).

ACCURACY & SPEED:
- Be fast, concise, and direct for simple questions, while providing thorough reasoning and clear structure for complex or research inquiries.`;

async function streamWithModelFallback(
  params: any,
  onChunk: (text: string) => void
): Promise<{ fullText: string; sources: { title: string; uri: string }[] }> {
  const models = ["gemini-3.1-flash-lite", "gemini-3.8-flash", "gemini-flash-latest"];
  let lastError: any;

  for (const model of models) {
    try {
      const streamPromise = ai.models.generateContentStream({
        ...params,
        model,
      });
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error(`Timeout starting stream on ${model}`)), 8000)
      );

      const stream = (await Promise.race([streamPromise, timeoutPromise])) as any;

      let fullText = "";
      const sources: { title: string; uri: string }[] = [];

      for await (const chunk of stream) {
        const text = chunk.text;
        if (text) {
          fullText += text;
          onChunk(text);
        }
        const groundingMetadata = chunk.candidates?.[0]?.groundingMetadata;
        if (groundingMetadata?.groundingChunks) {
          for (const gc of groundingMetadata.groundingChunks) {
            if (gc.web?.uri) {
              sources.push({
                title: gc.web.title || gc.web.uri,
                uri: gc.web.uri,
              });
            }
          }
        }
      }

      return { fullText, sources };
    } catch (err: any) {
      console.warn(`Model ${model} stream error:`, err?.message || err);
      lastError = err;
      await new Promise((r) => setTimeout(r, 400));
    }
  }

  throw lastError;
}

async function generateContentWithFallback(params: any) {
  const models = ["gemini-3.1-flash-lite", "gemini-3.8-flash", "gemini-flash-latest"];
  let lastError: any;
  for (const model of models) {
    try {
      const callPromise = ai.models.generateContent({
        ...params,
        model,
      });
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error(`Timeout on model ${model}`)), 8000)
      );

      return (await Promise.race([callPromise, timeoutPromise])) as any;
    } catch (err: any) {
      console.warn(`Model ${model} generateContent error:`, err?.message || err);
      lastError = err;
      await new Promise((r) => setTimeout(r, 400));
    }
  }
  throw lastError;
}

// Health check endpoint
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    app: "SHAHEENA (شاہینہ)",
    version: "2.5.0",
    creator: "Shamsheer Aslam (شمشیر أسلم)",
    tagline: "Your Personal AI Companion | آپ کی ذاتی ذہین معاون",
  });
});

// Chat completion streaming endpoint (SSE)
app.post("/api/chat", async (req: Request, res: Response) => {
  const { messages, userProfile, webSearchEnabled = false } = req.body;

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "Messages array is required" });
  }

  // Set up SSE headers
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders?.();

  try {
    let customInstructions = SYSTEM_INSTRUCTION;
    if (req.body.voiceMode) {
      customInstructions += `\n\nVOICE ASSISTANT MODE (JARVIS FAST SPEECH):\n- Provide rapid, conversational, crisp, and direct spoken answers (under 3-4 sentences whenever possible).\n- Do NOT use markdown symbols, asterisks, bullet marks (*), or hashtags (#) as this will be read aloud by speech synthesis.\n- Speak with warmth, clarity, and precision in the user's spoken language (Urdu/Hindi/English/Arabic).`;
    }
    if (userProfile && typeof userProfile === "object") {
      const memoryFacts: string[] = [];
      if (userProfile.name) memoryFacts.push(`User's Name: ${userProfile.name}`);
      if (userProfile.preferredLanguage) memoryFacts.push(`Preferred Language: ${userProfile.preferredLanguage}`);
      if (userProfile.notes && Array.isArray(userProfile.notes)) {
        memoryFacts.push(`User Saved Memories/Preferences: ${userProfile.notes.join("; ")}`);
      }
      if (memoryFacts.length > 0) {
        customInstructions += `\n\nUSER PERSONAL CONTEXT & MEMORY:\n${memoryFacts.join("\n")}`;
      }
    }

    // Format conversation history for Gemini API
    const formattedContents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    // Configure model tools
    const toolsConfig: any[] = [];
    if (webSearchEnabled) {
      toolsConfig.push({ googleSearch: {} });
    }

    const { fullText, sources } = await streamWithModelFallback(
      {
        contents: formattedContents,
        config: {
          systemInstruction: customInstructions,
          temperature: 0.7,
          tools: toolsConfig.length > 0 ? toolsConfig : undefined,
        },
      },
      (chunkText: string) => {
        res.write(`data: ${JSON.stringify({ type: "chunk", text: chunkText })}\n\n`);
      }
    );

    // Deduplicate sources
    const uniqueSources = Array.from(
      new Map(sources.map((item) => [item.uri, item])).values()
    );

    res.write(
      `data: ${JSON.stringify({
        type: "done",
        fullText,
        sources: uniqueSources,
      })}\n\n`
    );
    res.end();
  } catch (error: any) {
    console.error("Gemini API stream error:", error);
    res.write(
      `data: ${JSON.stringify({
        type: "error",
        error: error?.message || "An unexpected error occurred while communicating with SHAHEENA.",
      })}\n\n`
    );
    res.end();
  }
});

// Dedicated Web Search Grounding endpoint
app.post("/api/search", async (req: Request, res: Response) => {
  const { query, language = "ur" } = req.body;
  if (!query || typeof query !== "string") {
    return res.status(400).json({ error: "Query string is required" });
  }

  try {
    const prompt = `Search and summarize clear, authentic, accurate findings for the following query:
"${query}".
Output Language: Provide response primarily in ${language === "ur" ? "Urdu with key English terms" : language}.
Ensure factual correctness and provide structured bullet points.`;

    let response;
    let sources: { title: string; uri: string }[] = [];

    try {
      response = await generateContentWithFallback({
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
          temperature: 0.3,
        },
      });

      const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
      if (groundingMetadata?.groundingChunks) {
        for (const gc of groundingMetadata.groundingChunks) {
          if (gc.web?.uri) {
            sources.push({
              title: gc.web.title || gc.web.uri,
              uri: gc.web.uri,
            });
          }
        }
      }
    } catch (groundingErr: any) {
      console.warn("Google Search grounding tool quota limit or error, falling back to direct search synthesis:", groundingErr?.message || groundingErr);
      response = await generateContentWithFallback({
        contents: prompt,
        config: {
          temperature: 0.3,
        },
      });
    }

    const text = response.text || "No results found.";

    const uniqueSources = Array.from(
      new Map(sources.map((item) => [item.uri, item])).values()
    );

    res.json({
      query,
      answer: text,
      sources: uniqueSources,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Search endpoint error:", error);
    res.status(500).json({
      error: error?.message || "Search failed. Please check network connectivity.",
    });
  }
});

// Arabic Grammar Analysis endpoint
app.post("/api/arabic-grammar/analyze", async (req: Request, res: Response) => {
  const { sentence } = req.body;
  if (!sentence) {
    return res.status(400).json({ error: "Arabic sentence is required" });
  }

  try {
    const prompt = `Perform an accurate, scholarly Arabic Grammar (قواعد النحو والصرف والإعراب) analysis of the following sentence or word:
"${sentence}"

Please provide a detailed response with:
1. Sentence Type (جملة اسمية یا جملة فعلية)
2. Detailed Word-by-Word I'rab (اعراب مفصل) with grammatical roles (مبتدأ، خبر، فاعل، مفعول، حرف جر، مجرور، مضاف ومضاف إليه)
3. Sarf analysis (صرفی تجزیہ: صیغہ، باب، مادہ / حروف اصلیہ، وزن، اسم فاعل/مفعول وغیرہ)
4. Comprehensive explanation in Urdu (اردو میں آسان اور جامع وضاحت)
5. Practical takeaway or grammatical rule (قاعدہ)

Format clearly with clear headings and vocalized (مُشَکَّل) Arabic text.`;

    const response = await generateContentWithFallback({
      contents: prompt,
      config: {
        temperature: 0.3,
      },
    });

    res.json({
      sentence,
      analysis: response.text,
    });
  } catch (error: any) {
    console.error("Grammar analysis error:", error);
    res.status(500).json({
      error: error?.message || "Failed to analyze Arabic grammar.",
    });
  }
});

// Urdu Writing Assistant & Polishing endpoint
app.post("/api/urdu-writer/polish", async (req: Request, res: Response) => {
  const { text, mode = "improve" } = req.body;
  if (!text) {
    return res.status(400).json({ error: "Text is required" });
  }

  try {
    let instruction = "";
    if (mode === "improve") {
      instruction = "Improve the vocabulary, fluency, and stylistic eloquence of this Urdu text while keeping its core message intact. Provide the polished version followed by brief bullet points explaining changes.";
    } else if (mode === "grammar") {
      instruction = "Check this Urdu text for grammatical errors (املا، تذکیر و تانیث، جملوں کی ساخت) and correct them. Provide the corrected text and notes on mistakes found.";
    } else if (mode === "essay_outline") {
      instruction = "Create a comprehensive, high-standard Urdu essay outline (مضمون کا خاکہ) on this topic with introduction (تمہید), key arguments (نکات/دلائل), Quranic/poetic references where relevant, and conclusion (اختتامیہ).";
    } else if (mode === "formal_letter") {
      instruction = "Convert or compose this into a formal, highly courteous Urdu letter or official application (درخواست یا رسمی خط) with traditional polite salutations.";
    }

    const prompt = `${instruction}\n\nUser Input Text/Topic:\n"${text}"`;

    const response = await generateContentWithFallback({
      contents: prompt,
      config: {
        temperature: 0.5,
      },
    });

    res.json({
      original: text,
      result: response.text,
      mode,
    });
  } catch (error: any) {
    console.error("Urdu writer error:", error);
    res.status(500).json({
      error: error?.message || "Failed to process Urdu text.",
    });
  }
});

// Vite server in dev, static server in prod
async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, "dist")));
    app.get("*", (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, () => {
    console.log(`SHAHEENA Assistant Server running on http://localhost:${PORT}`);
  });
}

startServer();
