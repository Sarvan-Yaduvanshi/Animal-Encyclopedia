import express from 'express';
import multer from 'multer';
import { Animal } from '../models/animal.js';
const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'src/public/uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Routes
router.get('/', async (req, res) => {
  const searchQuery = req.query.search?.toLowerCase() || '';
  const searchRegex = new RegExp(searchQuery, 'i');

  const animals = await Animal.find({
    $or: [
      { name: searchRegex },
      { scientificName: searchRegex },
      { category: searchRegex },
      { habitat: searchRegex }
    ]
  });

  res.render('index', { animals, searchQuery: req.query.search || '' });
});

router.get('/animal/:id', async (req, res) => {
  const animal = await Animal.findById(req.params.id);
  if (!animal) {
    return res.status(404).render('error', { error: 'Animal not found' });
  }
  res.render('animal', { animal });
});

router.get('/categories', async (req, res) => {
  const allAnimals = await Animal.find({});
  const categories = [...new Set(allAnimals.map(animal => animal.category))];

  const animalsByCategory = {};
  categories.forEach(category => {
    animalsByCategory[category] = allAnimals.filter(a => a.category === category);
  });

  res.render('categories', { categories, animalsByCategory });
});

router.get('/upload', (req, res) => {
  res.render('upload');
});

router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const newAnimal = new Animal({
      name: req.body.name,
      scientificName: req.body.scientificName,
      category: req.body.category,
      habitat: req.body.habitat,
      description: req.body.description,
      imageUrl: req.file ? `/uploads/${req.file.filename}` : '',
      conservationStatus: req.body.conservationStatus
    });

    await newAnimal.save();
    res.redirect('/');
  } catch (err) {
    console.error('Error uploading animal:', err);
    res.status(500).render('error', { error: 'Failed to upload animal' });
  }
});

export default router;
