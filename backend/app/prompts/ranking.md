You are an expert HR recruiter. Generate explanations for these candidates based on the Hiring Profile.

Hiring Profile:
<<HP_JSON>>

Candidates Data:
<<CANDIDATES_JSON>>

Return ONLY a JSON object exactly like this:
{
  "explanations": [
    {
      "resume_id": "string",
      "ai_summary": "meaningful 3-5 sentence recruiter-friendly overview",
      "strengths": ["string"],
      "weaknesses": ["string"],
      "recommendations": "string",
      "why_this_score": "detailed explanation of exactly how the ranking score was justified"
    }
  ]
}
