import mongoose from 'mongoose';

const animalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  scientificName: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Mammal', 'Bird', 'Reptile', 'Amphibian', 'Fish', 'Invertebrate']
  },
  habitat: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  conservationStatus: {
    type: String,
    enum: ['Extinct', 'Endangered', 'Vulnerable', 'Near Threatened', 'Least Concern']
  }
});

export const Animal = mongoose.model('Animal', animalSchema);