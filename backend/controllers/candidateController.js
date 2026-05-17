import Candidate from '../models/Candidate.js';

// @desc    Get all candidates
// @route   GET /api/candidates
// @access  Private
export const getCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find({ addedBy: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, count: candidates.length, data: candidates });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single candidate
// @route   GET /api/candidates/:id
// @access  Private
export const getCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    
    if (!candidate) {
      return res.status(404).json({ success: false, message: 'Candidate not found' });
    }

    if (candidate.addedBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized to view this candidate' });
    }

    res.json({ success: true, data: candidate });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new candidate
// @route   POST /api/candidates
// @access  Private
export const createCandidate = async (req, res) => {
  try {
    req.body.addedBy = req.user._id;
    const candidate = await Candidate.create(req.body);
    res.status(201).json({ success: true, data: candidate });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update candidate
// @route   PUT /api/candidates/:id
// @access  Private
export const updateCandidate = async (req, res) => {
  try {
    let candidate = await Candidate.findById(req.params.id);

    if (!candidate) {
      return res.status(404).json({ success: false, message: 'Candidate not found' });
    }

    if (candidate.addedBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized to update this candidate' });
    }

    candidate = await Candidate.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({ success: true, data: candidate });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete candidate
// @route   DELETE /api/candidates/:id
// @access  Private
export const deleteCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);

    if (!candidate) {
      return res.status(404).json({ success: false, message: 'Candidate not found' });
    }

    if (candidate.addedBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized to delete this candidate' });
    }

    await candidate.deleteOne();

    res.json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Search candidates (by ID, Name, Skills, Email)
// @route   GET /api/candidates/search/:query
// @access  Private
export const searchCandidates = async (req, res) => {
  try {
    const { query } = req.params;
    
    // First try exact match for Candidate ID
    let candidates = await Candidate.find({ 
      addedBy: req.user._id,
      candidateId: new RegExp(`^${query}$`, 'i')
    });

    // If no exact match, try text search or regex on other fields
    if (candidates.length === 0) {
      candidates = await Candidate.find({
        addedBy: req.user._id,
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { email: { $regex: query, $options: 'i' } },
          { skills: { $regex: query, $options: 'i' } },
          { candidateId: { $regex: query, $options: 'i' } }
        ]
      }).limit(10);
    }

    res.json({ success: true, count: candidates.length, data: candidates });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
