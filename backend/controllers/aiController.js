import Candidate from '../models/Candidate.js';
import axios from 'axios';

// @desc    Run basic matching
// @route   POST /api/match
// @access  Private
export const basicMatch = async (req, res) => {
  try {
    const { requiredSkills = [], preferredSkills = [], minExperience = 0 } = req.body;
    
    // Get all candidates for this recruiter
    const candidates = await Candidate.find({ addedBy: req.user._id });
    
    // Simple matching algorithm
    const matched = candidates.map(c => {
      let score = 0;
      
      const cSkillsLow = c.skills.map(s => s.toLowerCase());
      const matchedSkills = requiredSkills.filter(skill => 
        cSkillsLow.includes(skill.toLowerCase())
      );
      const preferredMatchedSkills = preferredSkills.filter(skill => 
        cSkillsLow.includes(skill.toLowerCase())
      );
      
      // Calculate required skill match
      if (requiredSkills.length > 0) {
        score += (matchedSkills.length / requiredSkills.length) * 60; // 60% weight
      }
      
      // Calculate preferred skill match
      if (preferredSkills.length > 0) {
        score += (preferredMatchedSkills.length / preferredSkills.length) * 20; // 20% weight
      }
      
      // Calculate experience match
      if (minExperience) {
        if (c.experience >= minExperience) {
          score += 20; // 20% weight for meeting/exceeding experience
        } else {
          score += (c.experience / minExperience) * 20;
        }
      }
      
      const matchScore = Math.min(Math.round(score), 100);

      return {
        ...c.toObject(),
        matchScore,
        matchLevel: matchScore >= 75 ? 'High' : matchScore >= 40 ? 'Medium' : 'Low',
        matchedSkills,
        preferredMatchedSkills,
        skillsMatchedCount: matchedSkills.length,
        requiredSkillsCount: requiredSkills.length
      };
    }).sort((a, b) => b.matchScore - a.matchScore);

    res.json({ success: true, data: matched });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    AI Candidate Ranking
// @route   POST /api/ai/shortlist
// @access  Private
export const aiShortlist = async (req, res) => {
  try {
    const { roleName, jobDescription, requiredSkills, preferredSkills, minExperience, candidateIds } = req.body;
    
    if (!process.env.OPENROUTER_API_KEY) {
      return res.status(500).json({ success: false, message: 'OpenRouter API Key is missing' });
    }

    // Fetch candidates
    let query = { addedBy: req.user._id };
    if (candidateIds && candidateIds.length > 0) {
      query._id = { $in: candidateIds };
    }
    
    const candidates = await Candidate.find(query);
    
    if (candidates.length === 0) {
      return res.status(400).json({ success: false, message: 'No candidates found to evaluate' });
    }

    // Prepare candidate string for AI
    const candidatesString = candidates.map((c, index) => 
      `${index + 1}. ID: ${c.candidateId}, Name: ${c.name}, Skills: ${c.skills.join(', ')}, Experience: ${c.experience} years, Bio: ${c.bio || 'Not provided'}, Projects: ${c.projects?.join(', ') || 'Not provided'}`
    ).join('\n');

    const prompt = `
You are an AI recruitment assistant.

Job Role:
${roleName || 'Not specified'}

Job Description:
${jobDescription || 'Not specified'}

Required Skills:
${requiredSkills ? requiredSkills.join(', ') : 'Not specified'}

Preferred Skills:
${preferredSkills && preferredSkills.length > 0 ? preferredSkills.join(', ') : 'Not specified'}

Minimum Experience:
${minExperience || 'Not specified'} years

Candidates:
${candidatesString}

Task:
Rank these candidates from best to worst based on their fit for the role.
Respond STRICTLY in JSON format with the following structure, do not include markdown blocks or any other text outside the JSON:
{
  "rankedCandidates": [
    {
      "candidateId": "CAND-XXXX",
      "name": "Candidate Name",
      "score": 95,
      "matchLevel": "High",
      "matchedSkills": ["Skill1", "Skill2"],
      "reasoning": "Brief explanation of why they fit",
      "missingSkills": ["Skill1", "Skill2"]
    }
  ],
  "aiExplanation": "Overall summary of the candidate pool and recommendations.",
  "interviewQuestions": [
    "Question 1 tailored to the top candidate's profile...",
    "Question 2..."
  ]
}
`;

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: process.env.OPENROUTER_MODEL || 'openai/gpt-5.2',
        messages: [{ role: 'user', content: prompt }]
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const aiContent = response.data.choices[0].message.content;
    
    // Parse JSON string safely (stripping markdown if AI included it)
    const jsonStr = aiContent.replace(/```json/g, '').replace(/```/g, '').trim();
    const result = JSON.parse(jsonStr);

    res.json({ success: true, data: result });
  } catch (error) {
    console.error('AI Error:', error.response?.data || error.message);
    res.status(500).json({ success: false, message: 'Failed to process AI shortlisting', error: error.message });
  }
};
