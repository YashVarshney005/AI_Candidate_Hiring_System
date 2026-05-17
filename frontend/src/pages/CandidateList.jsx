import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Search, Trash2, ExternalLink, Mail, FileText } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../components/Icons';
import api from '../api/axios';
import { toast } from 'react-hot-toast';

const CandidateList = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchCandidates = async () => {
    try {
      const { data } = await api.get('/candidates');
      setCandidates(data.data);
    } catch (error) {
      toast.error('Failed to fetch candidates');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this candidate?')) {
      try {
        await api.delete(`/candidates/${id}`);
        setCandidates(candidates.filter(c => c._id !== id));
        toast.success('Candidate deleted');
      } catch (error) {
        toast.error('Failed to delete candidate');
      }
    }
  };

  const filteredCandidates = candidates.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.skills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase())) ||
    c.candidateId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Candidates</h1>
          <p className="text-muted-foreground mt-1">Manage your talent pool.</p>
        </div>
        <Link 
          to="/candidates/add" 
          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 shadow-sm"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Candidate
        </Link>
      </div>

      <div className="glass-card rounded-xl border border-border bg-card overflow-hidden">
        <div className="p-4 border-b border-border bg-secondary/30">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Filter by name, ID, or skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-background px-9 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
        </div>
        
        {loading ? (
          <div className="p-8 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : filteredCandidates.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground flex flex-col items-center">
            <div className="h-16 w-16 bg-secondary rounded-full flex items-center justify-center mb-4">
              <Search className="h-8 w-8 opacity-50" />
            </div>
            <p>No candidates found matching your criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-secondary/50">
                <tr>
                  <th className="px-6 py-4 font-medium">Candidate</th>
                  <th className="px-6 py-4 font-medium">Experience</th>
                  <th className="px-6 py-4 font-medium max-w-[300px]">Skills</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredCandidates.map((candidate, i) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    key={candidate._id} 
                    className="hover:bg-secondary/30 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                          {candidate.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium text-foreground">{candidate.name}</div>
                          <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-2">
                            <span>{candidate.candidateId}</span>
                            <span className="flex items-center gap-1"><Mail className="h-3 w-3"/>{candidate.email}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                        {candidate.experience} Years
                      </span>
                    </td>
                    <td className="px-6 py-4 max-w-[300px]">
                      <div className="flex flex-wrap gap-1">
                        {candidate.skills.slice(0, 4).map(skill => (
                          <span key={skill} className="px-2 py-1 text-[10px] uppercase tracking-wider font-medium bg-primary/10 text-primary border border-primary/20 rounded-md">
                            {skill}
                          </span>
                        ))}
                        {candidate.skills.length > 4 && (
                          <span className="px-2 py-1 text-[10px] font-medium bg-secondary text-muted-foreground rounded-md">
                            +{candidate.skills.length - 4}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {candidate.resumeLink && (
                          <a href={candidate.resumeLink} target="_blank" rel="noreferrer" title="View Resume" className="p-1.5 text-muted-foreground hover:text-primary hover:bg-secondary rounded">
                            <FileText className="h-4 w-4" />
                          </a>
                        )}
                        {candidate.linkedin && (
                          <a href={candidate.linkedin} target="_blank" rel="noreferrer" title="LinkedIn" className="p-1.5 text-muted-foreground hover:text-blue-500 hover:bg-secondary rounded">
                            <LinkedinIcon className="h-4 w-4" />
                          </a>
                        )}
                        {candidate.github && (
                          <a href={candidate.github} target="_blank" rel="noreferrer" title="GitHub" className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary rounded">
                            <GithubIcon className="h-4 w-4" />
                          </a>
                        )}
                        <button onClick={() => handleDelete(candidate._id)} className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateList;
