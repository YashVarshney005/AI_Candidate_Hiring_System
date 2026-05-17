import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, Loader2, Target, CheckCircle2, MessageSquare, Sparkles } from 'lucide-react';
import api from '../api/axios';
import { toast } from 'react-hot-toast';

const MatchCandidate = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [basicResults, setBasicResults] = useState([]);
  
  const [formData, setFormData] = useState({
    roleName: '',
    jobDescription: '',
    requiredSkills: '',
    preferredSkills: '',
    minExperience: 0
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const splitSkills = (value) => value.split(',').map(s => s.trim()).filter(Boolean);

  const buildPayload = () => ({
    roleName: formData.roleName,
    jobDescription: formData.jobDescription,
    requiredSkills: splitSkills(formData.requiredSkills),
    preferredSkills: splitSkills(formData.preferredSkills),
    minExperience: Number(formData.minExperience)
  });

  const handleBasicMatch = async () => {
    if (!formData.requiredSkills) {
      return toast.error('Required skills are mandatory');
    }

    setLoading(true);
    setResults(null);
    setBasicResults([]);
    try {
      const { data } = await api.post('/match', buildPayload());
      setBasicResults(data.data);
      toast.success('Basic matching complete');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Basic matching failed');
    } finally {
      setLoading(false);
    }
  };

  const handleMatch = async (e) => {
    e.preventDefault();
    if (!formData.roleName || !formData.requiredSkills) {
      return toast.error('Role name and required skills are mandatory');
    }

    setLoading(true);
    setResults(null);
    setBasicResults([]);
    try {
      const { data } = await api.post('/ai/shortlist', buildPayload());
      setResults(data.data);
      toast.success('AI Analysis Complete');
    } catch (error) {
      toast.error('The AI service has a little delay please try a little later');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-primary/10 text-primary rounded-lg">
          <BrainCircuit className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Shortlisting</h1>
          <p className="text-muted-foreground mt-1">Use OpenRouter AI to find the best candidate for your role.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Form */}
        <div className="lg:col-span-1">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card rounded-xl border border-border bg-card p-6 sticky top-24"
          >
            <h3 className="text-lg font-semibold mb-4">Job Requirements</h3>
            <form onSubmit={handleMatch} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Job Role <span className="text-destructive">*</span></label>
                <input required type="text" name="roleName" value={formData.roleName} onChange={handleChange} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" placeholder="e.g. Senior Frontend Developer" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Required Skills (comma separated) <span className="text-destructive">*</span></label>
                <input required type="text" name="requiredSkills" value={formData.requiredSkills} onChange={handleChange} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" placeholder="React, TypeScript, Node.js" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Preferred Skills (comma separated)</label>
                <input type="text" name="preferredSkills" value={formData.preferredSkills} onChange={handleChange} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" placeholder="MongoDB, AWS, Docker" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Min Experience (Years)</label>
                <input type="number" min="0" step="0.5" name="minExperience" value={formData.minExperience} onChange={handleChange} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Job Description (Optional)</label>
                <textarea name="jobDescription" value={formData.jobDescription} onChange={handleChange} className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none" placeholder="Paste JD here for better AI analysis..."></textarea>
              </div>

              <div className="grid grid-cols-1 gap-3 pt-2">
                <button 
                  type="button" 
                  disabled={loading}
                  onClick={handleBasicMatch}
                  className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border border-input bg-background hover:bg-secondary h-11 px-4"
                >
                  <Target className="mr-2 h-4 w-4" /> Run Basic Match
                </button>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-4 shadow"
                >
                  {loading ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing Candidates...</>
                  ) : (
                    <><Sparkles className="mr-2 h-4 w-4" /> Run AI Match</>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>

        {/* Results View */}
        <div className="lg:col-span-2 space-y-6">
          {!results && basicResults.length === 0 && !loading && (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center p-12 text-center border border-dashed border-border rounded-xl bg-secondary/20">
              <div className="p-4 bg-background rounded-full shadow-sm mb-4">
                <BrainCircuit className="h-10 w-10 text-muted-foreground opacity-50" />
              </div>
              <h3 className="text-lg font-medium text-foreground">Awaiting Instructions</h3>
              <p className="text-muted-foreground mt-2 max-w-sm">Fill out the job requirements on the left and run the AI match to see personalized recommendations and rankings.</p>
            </div>
          )}

          {basicResults.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-bold">Basic Shortlist</h3>
              {basicResults.map((candidate, idx) => (
                <div key={candidate._id} className="glass-card rounded-xl border border-border bg-card p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="text-lg font-bold">#{idx + 1} {candidate.name}</h4>
                      <p className="text-sm text-muted-foreground">{candidate.email} | {candidate.experience} years</p>
                    </div>
                    <div className={`text-2xl font-bold ${
                      candidate.matchLevel === 'High' ? 'text-emerald-500' : 
                      candidate.matchLevel === 'Medium' ? 'text-amber-500' : 'text-destructive'
                    }`}>
                      {candidate.matchScore}%
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {candidate.matchedSkills?.length > 0 ? candidate.matchedSkills.map(skill => (
                      <span key={skill} className="px-2 py-1 text-xs bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 rounded">
                        {skill}
                      </span>
                    )) : (
                      <span className="text-sm text-muted-foreground">No required skills matched</span>
                    )}
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {loading && (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center p-12 text-center rounded-xl glass-card">
              <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
              <h3 className="text-lg font-medium text-foreground">AI is evaluating candidates</h3>
              <p className="text-muted-foreground mt-2">This might take a few seconds...</p>
            </div>
          )}

          {results && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Summary Card */}
              <div className="glass-card rounded-xl border border-border bg-card p-6 border-l-4 border-l-primary">
                <h3 className="text-lg font-bold mb-2 flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary"/> AI Analysis Summary</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {results.aiExplanation}
                </p>
              </div>

              {/* Ranked Candidates */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold">Top Candidates</h3>
                {results.rankedCandidates?.map((candidate, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    key={candidate.candidateId} 
                    className="glass-card rounded-xl border border-border bg-card p-5 relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-4">
                      <div className={`text-2xl font-bold ${
                        candidate.matchLevel === 'High' ? 'text-emerald-500' : 
                        candidate.matchLevel === 'Medium' ? 'text-amber-500' : 'text-destructive'
                      }`}>
                        {candidate.score}%
                      </div>
                    </div>

                    <div className="flex items-start gap-4 mb-4">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg border border-primary/20">
                        #{idx + 1}
                      </div>
                      <div>
                        <h4 className="text-lg font-bold">{candidate.name}</h4>
                        <div className="text-sm text-muted-foreground flex gap-2">
                          <span>{candidate.candidateId}</span>
                          <span>|</span>
                          <span className={`font-medium ${
                            candidate.matchLevel === 'High' ? 'text-emerald-500' : 
                            candidate.matchLevel === 'Medium' ? 'text-amber-500' : 'text-destructive'
                          }`}>{candidate.matchLevel} Match</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 mt-4 pt-4 border-t border-border">
                      <div>
                        <span className="text-xs font-semibold uppercase text-muted-foreground tracking-wider mb-1 block">AI Reasoning</span>
                        <p className="text-sm text-foreground/90 leading-relaxed"><CheckCircle2 className="inline h-4 w-4 text-emerald-500 mr-1"/> {candidate.reasoning}</p>
                      </div>

                      {candidate.missingSkills && candidate.missingSkills.length > 0 && (
                        <div>
                          <span className="text-xs font-semibold uppercase text-muted-foreground tracking-wider mb-1 block">Missing Skills</span>
                          <div className="flex flex-wrap gap-1">
                            {candidate.missingSkills.map(skill => (
                              <span key={skill} className="px-2 py-0.5 text-xs bg-destructive/10 text-destructive border border-destructive/20 rounded">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {candidate.matchedSkills && candidate.matchedSkills.length > 0 && (
                        <div>
                          <span className="text-xs font-semibold uppercase text-muted-foreground tracking-wider mb-1 block">Skills Matched</span>
                          <div className="flex flex-wrap gap-1">
                            {candidate.matchedSkills.map(skill => (
                              <span key={skill} className="px-2 py-0.5 text-xs bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 rounded">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Interview Questions */}
              {results.interviewQuestions && results.interviewQuestions.length > 0 && (
                <div className="glass-card rounded-xl border border-border bg-card p-6">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-primary" /> Suggested Interview Questions
                  </h3>
                  <ul className="space-y-3">
                    {results.interviewQuestions.map((q, idx) => (
                      <li key={idx} className="flex gap-3 text-sm">
                        <span className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-secondary text-xs font-medium">{idx + 1}</span>
                        <span className="pt-0.5">{q}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MatchCandidate;
