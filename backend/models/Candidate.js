import mongoose from 'mongoose';

const CandidateSchema = new mongoose.Schema({
  candidateId: {
    type: String,
    unique: true
  },
  name: {
    type: String,
    required: [true, 'Please add a name']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  skills: {
    type: [String],
    default: []
  },
  experience: {
    type: Number,
    required: [true, 'Please add years of experience'],
    default: 0
  },
  bio: {
    type: String,
    default: ''
  },
  projects: {
    type: [String],
    default: []
  },
  resumeLink: {
    type: String,
    default: ''
  },
  linkedin: {
    type: String,
    default: ''
  },
  github: {
    type: String,
    default: ''
  },
  addedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'Recruiter',
    required: true
  }
}, { timestamps: true });

// Auto-generate candidateId before save if not present
CandidateSchema.pre('save', async function(next) {
  if (!this.candidateId) {
    // Basic ID generation: CAND-XXXX
    // In a real production app, we'd use a better sequence generator or UUID
    const count = await mongoose.model('Candidate').countDocuments();
    const sequence = (count + 1).toString().padStart(4, '0');
    this.candidateId = `CAND-${sequence}`;
  }
  next();
});

// Create text indexes for search
CandidateSchema.index({ name: 'text', skills: 'text', email: 'text', candidateId: 'text' });

export default mongoose.model('Candidate', CandidateSchema);
