import { NextResponse } from 'next/server';
import { ENV } from '@/lib/env';

export async function POST(request: Request) {
    try {
        const { message, history = [] } = await request.json();

        if (!message) {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 });
        }

        if (!ENV.OPENAI_API_KEY) {
            return NextResponse.json({
                response: "I'm sorry, I'm currently in technical mode. My neural bridge isn't connected to the global intelligence network yet. Please provide a valid API key.",
                suggestedQuestions: ["How do I add an API key?", "What models are supported?"]
            });
        }

        // We will try DeepSeek direct first as per the key format, then fallback to OpenRouter logic if preferred.
        // The user specifically asked for "DeepSeek API" and "freemodel".
        // DeepSeek official API (api.deepseek.com) is very standard.

        const isOpenRouter = ENV.OPENAI_API_KEY.startsWith('sk-or-v1-');
        const baseUrl = isOpenRouter ? 'https://openrouter.ai/api/v1' : 'https://api.deepseek.com';
        // Using openrouter/auto allows OpenRouter to pick the best available model
        const model = isOpenRouter ? 'openrouter/auto' : 'deepseek-chat';

        console.log(`[chat] Calling ${model} at ${baseUrl}`);

        const response = await fetch(`${baseUrl}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${ENV.OPENAI_API_KEY}`,
                'HTTP-Referer': 'https://safetrip360.com', // Required for some free models
                'X-Title': 'SafeTrip360 AI',
            },
            body: JSON.stringify({
                model: model,
                messages: [
                    ...history,
                    { role: 'user', content: message }
                ],
                temperature: 0.7,
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
            console.error(`[chat] Provider error — HTTP ${response.status} using model "${model}":`, errorMsg);
            return NextResponse.json({
                response: `⚠️ AI provider error (${response.status}): ${errorMsg}`
            });
        }

        const aiMessage = data.choices?.[0]?.message?.content;
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
