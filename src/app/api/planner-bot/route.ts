import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { message } = await req.json();
  if (!message) return NextResponse.json({ error: "Message required" }, { status: 400 });

  // Restrict chatbot to planner-only
  const systemPrompt = `
You are SafeTrip 360° Travel Planner Assistant. 

Rules:
1. ONLY provide travel planning, trip, itinerary, and related responses. Do NOT answer anything else (coding, general knowledge, or unrelated queries).
2. Format your reply as a **single block of text** with **spaces or separators** (like " - ", " | ", or double spaces) between headings, subheadings, and bullet points. Do NOT use real line breaks. Make it readable.
3. Include all relevant details: travel plan, mode (car/train/flight), time, distance, cost, weather, and atmosphere. 
4. Headings and subheadings should use proper capitalization.
5. If asked anything outside travel planning, respond only: "Sorry, I only provide travel planner information."
6. Example of reply format:
TRAVEL PLAN FOR CHANDIGARH TO CHENNAI - Mode: Flight - Time: 3 hours - Cost: ₹5000 | WEATHER INFO - Temperature: 32°C - Condition: Clear | ATMOSPHERE - Humidity: 60% - Wind: 5 km/h.
`;

  const res = await fetch("https://api.gemini.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GEMINI_API_KEY}`
    },
    body: JSON.stringify({
      model: "gemini-1.5",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ]
    })
  });

  const data = await res.json();
  const reply = data.choices?.[0]?.message?.content || "Planner data unavailable.";

  return NextResponse.json({ reply });
}
