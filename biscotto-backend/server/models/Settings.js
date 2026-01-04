import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  settingsType: {
    type: String,
    enum: ['home', 'about'],
    required: true,
    unique: true
  },
  // Home Settings
  heroImage: String,
  heroTitle: String,
  heroSubtitle: String,
  featuredProductIds: [Number],
  collageImages: [String],
  
  // About Settings
  founderImage: String,
  founderQuote: String,
  flagshipImage: String,
  
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

settingsSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Settings = mongoose.model('Settings', settingsSchema);

export default Settings;
