import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, User, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const CommandPalette = ({ open, setOpen }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) {
      setQuery('');
      setResults([]);
    }
  }, [open]);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }
      setLoading(true);
      try {
        const { data } = await api.get(`/candidates/search/${encodeURIComponent(query)}`);
        setResults(data.data);
      } catch (error) {
        console.error('Search failed', error);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchResults, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-background/80 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        transition={{ duration: 0.15 }}
        className="relative w-full max-w-2xl bg-card border border-border rounded-xl shadow-2xl overflow-hidden"
      >
        <div className="flex items-center px-4 py-3 border-b border-border gap-3">
          <Search className="h-5 w-5 text-muted-foreground" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search candidates by name, skills, or ID..."
            className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground"
          />
          {loading && <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />}
          <kbd className="hidden sm:inline-flex items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            ESC
          </kbd>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          {results.length > 0 ? (
            <div className="space-y-1">
              <div className="px-3 py-2 text-xs font-semibold text-muted-foreground">Candidates</div>
              {results.map((candidate) => (
                <button
                  key={candidate._id}
                  onClick={() => {
                    setOpen(false);
                    // For now, redirect to list. If we had a detail page, we could redirect there.
                    navigate('/candidates');
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-secondary transition-colors text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">{candidate.name}</h4>
                      <p className="text-xs text-muted-foreground flex gap-2">
                        <span>{candidate.candidateId}</span>
                        <span>•</span>
                        <span className="truncate max-w-[200px]">{candidate.skills.join(', ')}</span>
                      </p>
                    </div>
                  </div>
                  <div className="text-xs font-medium bg-secondary text-secondary-foreground px-2 py-1 rounded">
                    {candidate.experience}y exp
                  </div>
                </button>
              ))}
            </div>
          ) : query.trim() && !loading ? (
            <div className="p-8 text-center text-muted-foreground">
              No results found for "{query}"
            </div>
          ) : (
            <div className="p-6">
              <div className="flex flex-col items-center justify-center text-center space-y-3 opacity-50">
                <Sparkles className="h-8 w-8" />
                <p className="text-sm">Search across all your candidates instantly.</p>
                <div className="flex gap-2">
                  <span className="text-xs bg-secondary px-2 py-1 rounded">Try "React"</span>
                  <span className="text-xs bg-secondary px-2 py-1 rounded">Try "CAND-1001"</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default CommandPalette;
