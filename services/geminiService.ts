
import { GoogleGenAI, Type } from "@google/genai";
import { TextVariations, ImageAnalysis, AudioAnalysis, ChatMessage } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const textModel = 'gemini-2.5-flash';
const visionModel = 'gemini-2.5-flash'; 
const audioModel = 'gemini-2.5-flash';
const chatModel = 'gemini-2.5-pro';

const textVariationsSchema = {
    type: Type.OBJECT,
    properties: {
        twitter: { type: Type.STRING, description: "Tweet de máximo 280 caracteres, tono casual y enganchante" },
        linkedin: { type: Type.STRING, description: "Post profesional de 800-1000 caracteres con estructura clara" },
        instagram: { type: Type.STRING, description: "Caption con emojis relevantes y 5 hashtags populares" },
        tiktok: { type: Type.STRING, description: "Script para video de 60 segundos, conversacional y directo" },
        facebook: { type: Type.STRING, description: "Post enganchante de 300-400 caracteres que genere engagement" },
        email_subject: { type: Type.STRING, description: "Subject line llamativo y corto" },
        email_body: { type: Type.STRING, description: "Cuerpo de email persuasivo de 200 palabras" },
        blog_intro: { type: Type.STRING, description: "Introducción de blog de 150 palabras que enganche al lector" },
        youtube: { type: Type.STRING, description: "Descripción de YouTube optimizada con keywords y timestamps sugeridos" },
    },
    required: ["twitter", "linkedin", "instagram", "tiktok", "facebook", "email_subject", "email_body", "blog_intro", "youtube"]
};


export const generateTextVariations = async (inputText: string): Promise<TextVariations> => {
    const prompt = `Eres un experto en marketing de contenidos. Transforma este texto en 8 formatos optimizados. TEXTO ORIGINAL: "${inputText}"`;
    
    const response = await ai.models.generateContent({
        model: textModel,
        contents: [{ parts: [{ text: prompt }] }],
        config: {
            responseMimeType: "application/json",
            responseSchema: textVariationsSchema,
            temperature: 0.8,
        },
    });
    
    const jsonStr = response.text.trim();
    return JSON.parse(jsonStr) as TextVariations;
};

const imageAnalysisSchema = {
    type: Type.OBJECT,
    properties: {
        description: { type: Type.STRING, description: "Descripción detallada de la imagen en 100 palabras" },
        instagram_caption: { type: Type.STRING, description: "Caption atractivo con emojis y storytelling" },
        hashtags: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Array of 10 relevant hashtags" },
        alt_text: { type: Type.STRING, description: "Alt text descriptivo para accesibilidad" },
        suggestions: { type: Type.STRING, description: "3 sugerencias para mejorar o aprovechar mejor esta imagen" },
        emotion: { type: Type.STRING, description: "Emoción principal que transmite la imagen" },
        colors: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Array of 3 main colors from the image" },
    },
    required: ["description", "instagram_caption", "hashtags", "alt_text", "suggestions", "emotion", "colors"]
};

export const analyzeImage = async (imageBase64: string, mimeType: string): Promise<ImageAnalysis> => {
    const prompt = `Analiza esta imagen en detalle y genera contenido optimizado.`;
    const imagePart = {
        inlineData: {
            data: imageBase64,
            mimeType,
        },
    };
    const response = await ai.models.generateContent({
        model: visionModel,
        contents: [{ parts: [{ text: prompt }, imagePart] }],
        config: {
            responseMimeType: "application/json",
            responseSchema: imageAnalysisSchema,
        },
    });

    const jsonStr = response.text.trim();
    return JSON.parse(jsonStr) as ImageAnalysis;
};

const audioAnalysisSchema = {
    type: Type.OBJECT,
    properties: {
        transcription: { type: Type.STRING, description: "Transcripción completa y precisa del audio en español." },
        summary: { type: Type.STRING, description: "Un resumen conciso del contenido del audio en 2-3 frases." },
        key_points: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Una lista con los 3-5 puntos clave más importantes mencionados." },
        title_suggestion: { type: Type.STRING, description: "Una sugerencia de título atractivo basado en el contenido." },
    },
    required: ["transcription", "summary", "key_points", "title_suggestion"]
}

export const processAudio = async (audioBase64: string, mimeType: string): Promise<AudioAnalysis> => {
    const prompt = `Transcribe este audio en español y luego genera contenido optimizado basado en la transcripción.`;
    const audioPart = {
        inlineData: {
            data: audioBase64,
            mimeType,
        },
    };

    const response = await ai.models.generateContent({
        model: audioModel,
        contents: [{ parts: [{ text: prompt }, audioPart] }],
        config: {
            responseMimeType: "application/json",
            responseSchema: audioAnalysisSchema,
        },
    });

    const jsonStr = response.text.trim();
    return JSON.parse(jsonStr) as AudioAnalysis;
};


export const chatWithAI = async (message: string, history: ChatMessage[]): Promise<string> => {
    const chat = ai.chats.create({
        model: chatModel,
        config: {
            systemInstruction: `Eres un asistente experto en marketing de contenidos y redes sociales. Ayudas a usuarios a crear, mejorar y optimizar contenido. Eres amigable, conciso y práctico. Respondes en español.`,
        },
        history: history.map(msg => ({
            role: msg.role,
            parts: [{ text: msg.text }]
        }))
    });

    const response = await chat.sendMessage({ message });
    return response.text;
};
