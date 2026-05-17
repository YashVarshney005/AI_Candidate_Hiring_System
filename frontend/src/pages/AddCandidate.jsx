import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Save, ArrowLeft, Plus, X } from 'lucide-react';
import api from '../api/axios';
import { toast } from 'react-hot-toast';

const AddCandidate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    experience: 0,
    skills: [],
    bio: '',
    linkedin: '',
    github: '',
    resumeLink: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, skillInput.trim()]
      });
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(s => s !== skillToRemove)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.skills.length === 0) {
      return toast.error('Please add at least one skill');
    }
    
    setLoading(true);
    try {
      await api.post('/candidates', formData);
      toast.success('Candidate added successfully!');
      navigate('/candidates');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add candidate');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/candidates')} className="p-2 hover:bg-secondary rounded-full transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add Candidate</h1>
          <p className="text-muted-foreground mt-1">Enter candidate details into your database.</p>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-xl border border-border bg-card p-6 md:p-8"
      >
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Basic Info */}
          <div>
            <h3 className="text-lg font-semibold border-b border-border pb-2 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Full Name <span className="text-destructive">*</span></label>
                <input required type="text" name="name" value={formData.name} onChange={handleChange} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" placeholder="John Doe" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email <span className="text-destructive">*</span></label>
                <input required type="email" name="email" value={formData.email} onChange={handleChange} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" placeholder="john@example.com" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Experience (Years) <span className="text-destructive">*</span></label>
                <input required type="number" min="0" step="0.5" name="experience" value={formData.experience} onChange={handleChange} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Bio</label>
                <input type="text" name="bio" value={formData.bio} onChange={handleChange} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" placeholder="Brief summary..." />
              </div>
            </div>
          </div>

          {/* Skills */}
          <div>
            <h3 className="text-lg font-semibold border-b border-border pb-2 mb-4">Skills</h3>
            <div className="space-y-4">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={skillInput} 
                  onChange={(e) => setSkillInput(e.target.value)} 
                  onKeyDown={(e) => e.key === 'Enter' && handleAddSkill(e)}
                  className="flex h-10 w-full max-w-sm rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" 
                  placeholder="e.g. React, Node.js" 
                />
                <button type="button" onClick={handleAddSkill} className="inline-flex items-center justify-center rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 px-4">
                  <Plus className="h-4 w-4 mr-2" /> Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2 min-h-[40px] p-3 rounded-md bg-secondary/20 border border-dashed border-border">
                {formData.skills.length === 0 && <span className="text-sm text-muted-foreground">No skills added yet.</span>}
                {formData.skills.map((skill) => (
                  <span key={skill} className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-primary/10 text-primary border border-primary/20 rounded-full">
                    {skill}
                    <button type="button" onClick={() => handleRemoveSkill(skill)} className="hover:text-destructive hover:bg-destructive/10 rounded-full p-0.5 transition-colors">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-lg font-semibold border-b border-border pb-2 mb-4">Social & Links</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">LinkedIn URL</label>
                <input type="url" name="linkedin" value={formData.linkedin} onChange={handleChange} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" placeholder="https://linkedin.com/in/..." />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">GitHub URL</label>
                <input type="url" name="github" value={formData.github} onChange={handleChange} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" placeholder="https://github.com/..." />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Resume Link</label>
                <input type="url" name="resumeLink" value={formData.resumeLink} onChange={handleChange} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" placeholder="https://drive.google.com/..." />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-border flex justify-end gap-4">
            <button type="button" onClick={() => navigate('/candidates')} className="h-10 px-4 py-2 rounded-md border border-input bg-transparent hover:bg-secondary transition-colors text-sm font-medium">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="h-10 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow rounded-md flex items-center gap-2 text-sm font-medium transition-colors disabled:opacity-50">
              <Save className="h-4 w-4" />
              {loading ? 'Saving...' : 'Save Candidate'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AddCandidate;
