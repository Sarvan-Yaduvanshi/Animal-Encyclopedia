import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import multer from 'multer';

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = process.env.PORT || 3000;

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'src/public/uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + '-' + file.originalname)
  }
});

const upload = multer({ storage: storage });

// Static data
const animals = [
  {
    id: '1',
    name: 'African Elephant',
    scientificName: 'Loxodonta africana',
    category: 'Mammal',
    habitat: 'Savannas and forests of Africa',
    description: 'The African elephant is the largest living terrestrial animal. Known for their intelligence and complex social structures, these magnificent creatures play a crucial role in maintaining the biodiversity of their ecosystems.',
    imageUrl: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&q=80',
    conservationStatus: 'Vulnerable'
  },
  {
    id: '2',
    name: 'Blue Whale',
    scientificName: 'Balaenoptera musculus',
    category: 'Mammal',
    habitat: 'Oceans worldwide',
    description: 'The blue whale is the largest animal known to have ever existed. These gentle giants can grow up to 100 feet long and weigh up to 200 tons, feeding primarily on tiny crustaceans called krill.',
    imageUrl: 'https://images.unsplash.com/photo-1568430328012-21ed450453ea?auto=format&fit=crop&q=80',
    conservationStatus: 'Endangered'
  },
  {
    id: '3',
    name: 'Red Panda',
    scientificName: 'Ailurus fulgens',
    category: 'Mammal',
    habitat: 'Eastern Himalayas and southwestern China',
    description: 'The red panda is a small, arboreal mammal known for its distinctive reddish-brown fur and adorable appearance. Despite its name and location, it is not closely related to the giant panda.',
    imageUrl: 'https://images.unsplash.com/photo-1584771145729-0bd9fda6529b?auto=format&fit=crop&q=80',
    conservationStatus: 'Endangered'
  },
  {
    id: '4',
    name: 'Emperor Penguin',
    scientificName: 'Aptenodytes forsteri',
    category: 'Bird',
    habitat: 'Antarctic coast',
    description: 'The Emperor Penguin is the tallest and heaviest of all living penguin species. They are adapted to live in the extreme cold of Antarctica and can dive up to 500 meters deep in search of food.',
    imageUrl: 'https://images.unsplash.com/photo-1551986782-d0169b3f8fa7?auto=format&fit=crop&q=80',
    conservationStatus: 'Near Threatened'
  },
  {
    id: '5',
    name: 'Komodo Dragon',
    scientificName: 'Varanus komodoensis',
    category: 'Reptile',
    habitat: 'Indonesian islands',
    description: 'The Komodo dragon is the largest living species of lizard. These powerful predators can grow up to 3 meters in length and are known for their strong bite and venomous saliva.',
    imageUrl: 'https://images.unsplash.com/photo-1585246112499-640a2cbfd1bb?auto=format&fit=crop&q=80',
    conservationStatus: 'Vulnerable'
  }
];

// Middleware
app.use(express.static(join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', join(__dirname, 'views'));

// Routes
app.get('/', (req, res) => {
  const searchQuery = req.query.search?.toLowerCase() || '';
  const filteredAnimals = animals.filter(animal => 
    animal.name.toLowerCase().includes(searchQuery) ||
    animal.scientificName.toLowerCase().includes(searchQuery) ||
    animal.category.toLowerCase().includes(searchQuery) ||
    animal.habitat.toLowerCase().includes(searchQuery)
  );
  res.render('index', { animals: filteredAnimals, searchQuery: req.query.search || '' });
});

app.get('/animal/:id', (req, res) => {
  const animal = animals.find(a => a.id === req.params.id);
  if (!animal) {
    return res.status(404).render('error', { error: 'Animal not found' });
  }
  res.render('animal', { animal });
});

app.get('/categories', (req, res) => {
  const categories = [...new Set(animals.map(animal => animal.category))];
  const animalsByCategory = {};
  
  categories.forEach(category => {
    animalsByCategory[category] = animals.filter(animal => animal.category === category);
  });
  
  res.render('categories', { categories, animalsByCategory });
});

app.get('/upload', (req, res) => {
  res.render('upload');
});

app.post('/upload', upload.single('image'), (req, res) => {
  const newAnimal = {
    id: String(animals.length + 1),
    name: req.body.name,
    scientificName: req.body.scientificName,
    category: req.body.category,
    habitat: req.body.habitat,
    description: req.body.description,
    imageUrl: req.file ? `/uploads/${req.file.filename}` : '',
    conservationStatus: req.body.conservationStatus
  };
  
  animals.push(newAnimal);
  res.redirect('/');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});