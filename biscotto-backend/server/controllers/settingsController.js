import Settings from '../models/Settings.js';

// @desc    Get home settings
// @route   GET /api/settings/home
// @access  Public
export const getHomeSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne({ settingsType: 'home' });
    
    // Create default if doesn't exist
    if (!settings) {
      settings = new Settings({
        settingsType: 'home',
        heroImage: "https://picsum.photos/id/326/800/600",
        heroTitle: "Simple, Yet Delectable",
        heroSubtitle: "Discover and indulge in our irresistible aroma of freshly baked croissants. Golden, flaky, and crafted to perfection every morning.",
        featuredProductIds: [],
        collageImages: [
          "https://picsum.photos/id/431/600/800",
          "https://picsum.photos/id/488/400/400",
          "https://picsum.photos/id/292/600/800",
          "https://picsum.photos/id/312/400/400",
          "https://picsum.photos/id/225/600/1200",
          "https://picsum.photos/id/1062/400/400",
          "https://picsum.photos/id/835/600/800",
          "https://picsum.photos/id/493/400/400",
          "https://picsum.photos/id/766/600/800"
        ]
      });
      await settings.save();
    }

    res.json({ settings });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update home settings
// @route   PUT /api/settings/home
// @access  Private/Admin
export const updateHomeSettings = async (req, res) => {
  try {
    const { heroImage, heroTitle, heroSubtitle, featuredProductIds, collageImages } = req.body;
    
    let settings = await Settings.findOne({ settingsType: 'home' });
    
    if (!settings) {
      settings = new Settings({ settingsType: 'home' });
    }

    if (heroImage !== undefined) settings.heroImage = heroImage;
    if (heroTitle !== undefined) settings.heroTitle = heroTitle;
    if (heroSubtitle !== undefined) settings.heroSubtitle = heroSubtitle;
    if (featuredProductIds !== undefined) settings.featuredProductIds = featuredProductIds;
    if (collageImages !== undefined) settings.collageImages = collageImages;

    await settings.save();

    res.json({
      message: 'Home settings updated successfully',
      settings
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get about settings
// @route   GET /api/settings/about
// @access  Public
export const getAboutSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne({ settingsType: 'about' });
    
    // Create default if doesn't exist
    if (!settings) {
      settings = new Settings({
        settingsType: 'about',
        founderImage: "https://picsum.photos/id/338/800/1000",
        founderQuote: "Baking is about patience. In a world that moves so fast, bread forces you to slow down. You can't rush the rise.",
        collageImages: [
          "https://picsum.photos/id/425/800/800",
          "https://picsum.photos/id/292/400/400",
          "https://picsum.photos/id/306/400/800",
          "https://picsum.photos/id/225/400/400"
        ],
        flagshipImage: "https://picsum.photos/id/122/800/600"
      });
      await settings.save();
    }

    res.json({ settings });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update about settings
// @route   PUT /api/settings/about
// @access  Private/Admin
export const updateAboutSettings = async (req, res) => {
  try {
    const { founderImage, founderQuote, collageImages, flagshipImage } = req.body;
    
    let settings = await Settings.findOne({ settingsType: 'about' });
    
    if (!settings) {
      settings = new Settings({ settingsType: 'about' });
    }

    if (founderImage !== undefined) settings.founderImage = founderImage;
    if (founderQuote !== undefined) settings.founderQuote = founderQuote;
    if (collageImages !== undefined) settings.collageImages = collageImages;
    if (flagshipImage !== undefined) settings.flagshipImage = flagshipImage;

    await settings.save();

    res.json({
      message: 'About settings updated successfully',
      settings
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
