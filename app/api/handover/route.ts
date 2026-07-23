import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_PROMPT = `
You are ShiftBridge AI, an expert clinical documentation assistant.
Your task is to convert raw, unstructured nursing/clinical shift notes into a structured ISBAR handover format.

Format your response STRICTLY as valid JSON with the following structure:
{
  "identify": "Patient name/age/unit/bed if mentioned or 'Unspecified'",
  "situation": "Concise summary of current clinical status and reason for concern/update",
  "background": "Relevant medical history, ongoing interventions, and key diagnoses",
  "assessment": "Current vital trends, lab findings, clinical observations",
  "recommendations": "Actionable items for the incoming shift (e.g., meds, monitoring)",
  "criticalAlerts": ["Array of urgent clinical flags or high-risk items requiring immediate attention"],
  "patientSummary": "A warm, simplified 2-3 sentence update suitable for non-clinical team members or family"
}
`;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const notes = body.notes || body.text || '';

    if (!notes) {
      return NextResponse.json(
        { error: 'No clinical notes provided.' },
        { status: 400 }
      );
    }

    // Generate handover using Gemini 3.6 Flash
    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: `${SYSTEM_PROMPT}\n\nRAW SHIFT NOTES:\n${notes}`,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const responseText = response.text || '{}';
    const parsedData = JSON.parse(responseText);

    return NextResponse.json(parsedData);
  } catch (error: any) {
    console.error('API Error Details:', error);

    return NextResponse.json(
      { 
        error: error?.message || 'Failed to process clinical notes.' 
      },
      { status: 500 }
    );
  }
}