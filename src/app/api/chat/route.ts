import { NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export async function POST(request: Request) {
    try {
        const { message, history = [] } = await request.json();

        if (!message) {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 });
        }

        const contents = history.map((msg: any) => ({
            role: msg.role === 'assistant' ? 'model' : msg.role === 'model' ? 'model' : 'user',
            parts: [{ text: msg.content }]
        }));

        contents.push({
            role: 'user',
            parts: [{ text: message }]
        });

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

        console.log(`[chat] Calling Gemini API`);

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                system_instruction: {
                    parts: [{
                        text: `You are SafeTrip360 AI, a specialized travel safety and trip planning assistant. Your mission is to provide users with comprehensive travel safety analysis, risk assessments, real-time alerts, and tailored trip planning advice.

Key Responsibilities:
1. Provide safety ratings and risk factors for countries and cities.
2. Offer advice on local laws, customs, and health precautions.
3. Suggest the safest travel routes and transportation methods.
4. Assist with trip planning, including destination comparisons and weather-related safety tips.
5. Provide emergency contact protocols for various regions.

Constraints:
- ONLY respond to queries related to travel, safety, geography, and trip planning.
- If a user asks about unrelated topics (e.g., coding, general lifestyle, etc.), politely inform them that you are specialized in travel safety and steer them back to travel-related inquiries.
- Maintain a professional, helpful, and safety-conscious tone.`
                    }]
                },
                contents: contents,
                generationConfig: {
                    temperature: 0.7,
                }
            })
        });

        const rawText = await response.text();
        let data: any = {};
        try {
            data = JSON.parse(rawText);
        } catch (e) {
            // Not JSON
        }

        if (!response.ok) {
            const errorMsg = data.error?.message || rawText || "Internal Server Error";
            console.error(`[chat] Provider error — HTTP ${response.status}:`, errorMsg);
            return NextResponse.json({
                response: `⚠️ AI provider error (${response.status}): ${errorMsg}`
            });
        }

        const aiMessage = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!aiMessage) {
            console.error("[chat] Invalid response structure:", data);
            return NextResponse.json({
                response: "⚠️ Unexpected response format from AI provider."
            });
        }

        return NextResponse.json({
            response: aiMessage,
            suggestedQuestions: ["Safest countries in Asia?", "Latest travel alerts?", "Weather safety tips"]
        });

    } catch (error: any) {
        console.error("Chat API Global Error:", error);
        return NextResponse.json({
            error: 'Failed to process chat message',
            response: `Expert analysis interrupted: ${error.message || 'Unknown error'}`
        }, { status: 500 });
    }
}
