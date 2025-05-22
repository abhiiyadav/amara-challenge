'use server';

import { OpenAI } from 'openai';
import { loadCandidatesFromCSV, filterCandidates, rankCandidates } from '@/utils/utils';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function think(userMessage: string, csvHeader: string) {
    const prompt = `
        You are an ATS assistant. Given the CSV header below and the user's message,
        return only valid JSON with a filter and rank plan:

        CSV header:
        ${csvHeader}

        User message:
        ${userMessage}

        Respond ONLY in JSON and make sure it is VALID:
        {
        "filter": { ... },
        "rank": { ... }
        }
    `;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.2,
    });

    const jsonText = completion.choices[0].message.content || '{}';
    const parsed = JSON.parse(jsonText);

    const candidates = loadCandidatesFromCSV();
    const filtered = filterCandidates(candidates, parsed.filter);
    const ranked = rankCandidates(filtered, parsed.rank);

    const speakPrompt = `
        You are an ATS assistant. You received the following filter and rank instructions:

        Filter:
        ${JSON.stringify(parsed.filter, null, 2)}

        Rank:
        ${JSON.stringify(parsed.rank, null, 2)}

        You applied these instructions to the candidate dataset and found the top candidates (up to 3):

        ${JSON.stringify(ranked.slice(0, 3), null, 2)}

        Now explain in plain English what you did and why these candidates are the top results. Mention key fields used for filtering and ranking. Keep it brief but clear.
    `;

    const explanation = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: speakPrompt }],
      temperature: 0.4,
    });

    return {
      explanation: explanation.choices[0].message.content,
      candidates: ranked.slice(0, 3),
    };
  } catch (e: any) {
    console.error('Error in think():', e);
    return { error: 'Something went wrong. Possibly invalid JSON from LLM.', details: e.message };
  }
}
