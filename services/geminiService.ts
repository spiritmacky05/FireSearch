import { GoogleGenAI, Chat } from "@google/genai";
import { SearchParams, AiResponse } from '../types';
import { FIRE_CODE_CONTEXT } from '../constants';

const API_KEY = process.env.API_KEY || ''; // Injected by environment

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const generateFireSafetyReport = async (params: SearchParams): Promise<AiResponse> => {
  if (!API_KEY) {
    throw new Error("API Key is missing. Please check your environment configuration.");
  }

  const systemInstruction = `
Role:
You are FIRE SEARCH, an intelligent Fire Code reference and inspection assistant for the Bureau of Fire Protection (BFP).

Primary Function:
Analyze the provided Fire Code context (based on RA 9514 and its RIRR) and return accurate, structured, and inspection-ready information based on the user's establishment details.

Context (Your Memory Base):
${FIRE_CODE_CONTEXT}

Response Behavior:
1.  **Establishment Overview**: Classify the occupancy based on the input.
2.  **Fire Safety Requirements**: List specific requirements (Egress, Alarms, Sprinklers) based on the size and type provided. Cite specific sections from the Context if available.
3.  **Inspection Checklist**: Provide a bulleted list of items an inspector should check physically.
4.  **Legal Basis**: Cite the specific Section/Rule numbers found in the context.
5.  **Notes for Inspector**: Practical reminders or common deficiencies for this specific type.

Constraint:
- Use ONLY the provided context as the source of truth.
- If information is not found in the context for a specific query, state "No direct reference found in the uploaded files."
- Use Markdown for formatting.
- Be professional and direct.
`;

  const userPrompt = `
Generate a Fire Safety Inspection Report for:
- Type of Establishment: ${params.establishmentType}
- Measurement: ${params.area} SQM
- Type of Occupancy: ${params.occupancyType}
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userPrompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.2, // Low temperature for factual accuracy based on context
      },
    });

    return {
      markdown: response.text || "No response generated.",
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export const createChatSession = (reportContext: string) => {
  if (!API_KEY) {
    throw new Error("API Key is missing.");
  }

  const systemInstruction = `
You are a helpful Fire Safety assistant. 
The user is viewing a generated inspection report based on RA 9514. 
Answer their follow-up questions specifically about the report or general fire safety rules.
Always refer to the provided context if possible.

CONTEXT REPORT:
${reportContext}

ORIGINAL REFERENCE MATERIAL:
${FIRE_CODE_CONTEXT}
`;

  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: systemInstruction,
    },
  });
};

export const generateNTC = async (params: SearchParams, violations: string): Promise<string> => {
  if (!API_KEY) {
    throw new Error("API Key is missing.");
  }

  const systemInstruction = `
Role:
You are an intelligent Fire Code reference assistant.

Task:
Convert the list of observed violations into a structured Notice to Comply (NTC) detail list.

Context:
${FIRE_CODE_CONTEXT}

Instructions:
1. Output ONLY the list of defects.
2. Follow this strict format for every item:

   ### [Defect Description]
   #### Legal Basis: [Section X.X.X.X (Topic Name)]
   **Explanation:** [Detailed explanation of the requirement and the violation]

   <br>
   <hr>
   <br>

3. EXAMPLE:
   ### Alarm Bell/Horn Not Audible
   #### Legal Basis: Section 10.2.17.3 (Protection - Alarm) and General Inspection Notes (Regular testing of fire alarms)
   **Explanation:** The fire alarm system must be capable of providing an audible signal that is clearly heard throughout the occupied areas to effectively alert occupants in case of a fire emergency. An inaudible alarm bell/horn indicates a failure in the system's functionality.

   <br>
   <hr>
   <br>

4. Use strictly RA 9514 (RIRR 2019) references.
5. IMPORTANT: The "Legal Basis" line must start with "####" so it renders as a header.
`;

  const userPrompt = `
Establishment Details:
- Type: ${params.establishmentType}
- Area: ${params.area} SQM
- Occupancy: ${params.occupancyType}

Observed Violations/Defects:
${violations}

Generate the detailed NTC list.
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userPrompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.2,
      },
    });

    return response.text || "Unable to generate defect list.";
  } catch (error) {
    console.error("Gemini API Error (NTC):", error);
    throw error;
  }
};