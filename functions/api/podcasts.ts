// These minimal type definitions are included to ensure the function can be
// compiled and understood by TypeScript without requiring the full
// @cloudflare/workers-types package. This is useful for development
// environments or tools that don't have direct access to Cloudflare's ecosystem.
// The function will still run correctly when deployed to Cloudflare Pages.
interface KVNamespace {
  get(key: string, type: 'json'): Promise<any | null>;
  put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>;
}

interface EventContext<Env = any, P extends string = any, D = any> {
  request: Request;
  env: Env;
  params: Record<P, string | string[]>;
  waitUntil: (promise: Promise<any>) => void;
  next: (input?: Request | string, init?: RequestInit) => Promise<Response>;
  data: D;
}

type PagesFunction<Env = any, P extends string = any, D = any> = (
  context: EventContext<Env, P, D>
) => Response | Promise<Response>;


import { GoogleGenAI, Type } from "@google/genai";

// Define the expected JSON structure for a single podcast
const podcastSchema = {
  type: Type.OBJECT,
  properties: {
    rank: { type: Type.INTEGER, description: "The ranking of the podcast." },
    title: { type: Type.STRING, description: "The title of the podcast." },
    author: { type: Type.STRING, description: "The author or publisher of the podcast." },
    embedCode: { type: Type.STRING, description: "The HTML iframe embed code for the Apple Podcasts player." },
  },
};

// Define the overall schema for the API response
const responseSchema = {
  type: Type.OBJECT,
  properties: {
    podcasts: {
      type: Type.ARRAY,
      description: "An array of the top 100 podcasts.",
      items: podcastSchema,
    },
  },
};

// This defines the contract for our Pages Function
// It includes environment variables that are bound via wrangler.toml
interface Env {
  PODCAST_CACHE: KVNamespace;
  API_KEY: string;
}

// onRequest is the entry point for all requests to this Pages Function.
export const onRequest: PagesFunction<Env> = async (context) => {
  try {
    const { env, waitUntil } = context;
    const cacheKey = "podcasts-top-100";

    // 1. Check KV cache first
    const cachedData = await env.PODCAST_CACHE.get(cacheKey, "json");
    if (cachedData) {
      return new Response(JSON.stringify(cachedData), {
        headers: { 
          'Content-Type': 'application/json',
          'X-Cache-Status': 'HIT'
        },
      });
    }

    // 2. If not in cache, fetch from Gemini API
    const ai = new GoogleGenAI({ apiKey: env.API_KEY });

    // The prompt is now more flexible, letting the frontend control the final player dimensions.
    const prompt = "Generate a list of the current top 100 most popular podcasts in the USA. For each podcast, provide its rank, title, author, and the complete HTML iframe embed code specifically for the Apple Podcasts player.";

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });
    
    const podcastData = JSON.parse(response.text);

    // 3. Store the new data in KV cache without blocking the response
    waitUntil(
      env.PODCAST_CACHE.put(cacheKey, JSON.stringify(podcastData), {
        expirationTtl: 3600, // 1 hour
      })
    );

    // 4. Return the response to the client
    return new Response(JSON.stringify(podcastData), {
      headers: { 
        'Content-Type': 'application/json',
        'X-Cache-Status': 'MISS'
      },
    });

  } catch (error) {
    console.error("Error fetching podcast data:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return new Response(JSON.stringify({ error: "Failed to fetch podcast data.", details: errorMessage }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
