def brand_prompt(data):

    return f"""
Generate branding assets.

Idea: {data['idea']}
Industry: {data['industry']}
Keywords: {data['keywords']}
Tone: {data['tone']}

Generate:

• 10 Brand Names (with meaning)
• 5 Taglines
• 5 Slogans
• 1 Brand Story

No restrictions on creativity.
Return JSON format.
"""
