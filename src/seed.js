const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Branch = require('./models/Branch');
const Subject = require('./models/Subject');
const Resource = require('./models/Resource');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/campusnotes';

const branchesData = [
  { _id: 'br_it', name: 'Information Technology', code: 'IT' },
  { _id: 'br_cs', name: 'Computer Science', code: 'CS' },
  { _id: 'br_extc', name: 'Electronics & Telecommunication', code: 'EXTC' },
  { _id: 'br_mech', name: 'Mechanical Engineering', code: 'MECH' },
  { _id: 'br_civil', name: 'Civil Engineering', code: 'CIVIL' },
];

const subjectsData = [
  {
    name: 'Data Structures',
    code: 'IT301',
    branchId: 'br_it',
    semesterId: 'sem_3',
    description: 'Linear & non-linear data structures, algorithms and graphs.',
    units: [
      { number: 1, title: 'Linear Structures' },
      { number: 2, title: 'Trees and BST' },
      { number: 3, title: 'Sorting & Hashing' },
    ],
  },
  {
    name: 'Database Management Systems',
    code: 'IT401',
    branchId: 'br_it',
    semesterId: 'sem_4',
    description: 'Relational databases, SQL, normalization, and ACID properties.',
    units: [
      { number: 1, title: 'ER Modeling' },
      { number: 2, title: 'SQL & Normalization' },
      { number: 3, title: 'Transactions' },
    ],
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('🌱 Connected to MongoDB. Seeding TCET academic data...');

    await Branch.deleteMany({});
    await Subject.deleteMany({});
    await User.deleteMany({});
    await Resource.deleteMany({});

    await Branch.insertMany(branchesData);
    console.log('✅ Branches inserted');

    await Subject.insertMany(subjectsData);
    console.log('✅ Subjects inserted');

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('tcet1234', salt);

    const adminUser = await User.create({
      name: 'Dr. TCET Admin',
      email: 'admin@tcet.ac.in',
      passwordHash,
      role: 'admin',
      points: 5000,
      level: 'Campus Mentor',
      avatarUrl: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Admin',
    });

    const studentUser = await User.create({
      name: 'Siddharth Kumar',
      email: 'siddharth@tcet.ac.in',
      passwordHash,
      branchId: 'br_it',
      year: 3,
      semester: 5,
      role: 'student',
      points: 1240,
      level: 'Scholar',
      avatarUrl: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Siddharth',
    });

    await Resource.create({
      title: 'Data Structures — Complete Unit 2 Notes',
      slug: 'data-structures-complete-unit-2-notes',
      description: 'Comprehensive notes covering trees, BST, and AVL rotations.',
      category: 'NOTES',
      file: {
        url: 'https://example.com/ds_unit2.pdf',
        originalName: 'DS_Unit2_Notes.pdf',
        mimeType: 'application/pdf',
        extension: 'pdf',
        size: 2048000,
      },
      branchId: 'br_it',
      semesterId: 'sem_3',
      subjectId: 'sub_ds',
      unitNumber: 2,
      tags: ['trees', 'BST', 'AVL'],
      uploadedBy: studentUser._id,
      status: 'PUBLISHED',
      stats: { views: 1243, downloads: 328, averageRating: 4.8, ratingCount: 47 },
    });

    console.log('🎉 Seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding error:', err);
    process.exit(1);
  }
}

seed();
