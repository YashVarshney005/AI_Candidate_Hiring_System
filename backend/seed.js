import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Candidate from './models/Candidate.js';
import Recruiter from './models/Recruiter.js';
import connectDB from './config/db.js';
import bcrypt from 'bcryptjs';

dotenv.config();

connectDB();

const importData = async () => {
  try {
    await Candidate.deleteMany();
    await Recruiter.deleteMany();

    // Create a dummy recruiter
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);
    
    const createdRecruiter = await Recruiter.create({
      name: 'Admin User',
      email: 'admin@ai-ats.com',
      password: hashedPassword
    });

    const recruiterId = createdRecruiter._id;

    // Dummy candidates
    const candidates = [
      {
        candidateId: 'CAND-0001',
        name: 'Rahul Sharma',
        email: 'rahul@example.com',
        experience: 4,
        skills: ['React', 'Node.js', 'MongoDB', 'Express'],
        bio: 'Full stack developer with a passion for MERN stack.',
        addedBy: recruiterId
      },
      {
        candidateId: 'CAND-0002',
        name: 'Priya Patel',
        email: 'priya@example.com',
        experience: 2,
        skills: ['React', 'AWS', 'JavaScript', 'TypeScript'],
        bio: 'Frontend focused developer looking for React roles.',
        addedBy: recruiterId
      },
      {
        candidateId: 'CAND-0003',
        name: 'Ankit Gupta',
        email: 'ankit@example.com',
        experience: 6,
        skills: ['Python', 'Django', 'PostgreSQL', 'Docker'],
        bio: 'Backend engineer specializing in Python ecosystems.',
        addedBy: recruiterId
      },
      {
        candidateId: 'CAND-0004',
        name: 'Neha Verma',
        email: 'neha@example.com',
        experience: 1,
        skills: ['HTML', 'CSS', 'JavaScript'],
        bio: 'Junior developer eager to learn and grow.',
        addedBy: recruiterId
      },
      {
        candidateId: 'CAND-0005',
        name: 'Vikram Singh',
        email: 'vikram@example.com',
        experience: 5,
        skills: ['React', 'Next.js', 'Tailwind CSS', 'Framer Motion'],
        bio: 'Creative UI developer with strong animation skills.',
        addedBy: recruiterId
      }
    ];

    await Candidate.insertMany(candidates);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

importData();
