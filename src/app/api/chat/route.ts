import { NextResponse } from 'next/server';

const GEMINI_API_KEY = 'AIzaSyAIkBefQDZirSgZ8-AMFRBtg9HzPgoPREE';

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
