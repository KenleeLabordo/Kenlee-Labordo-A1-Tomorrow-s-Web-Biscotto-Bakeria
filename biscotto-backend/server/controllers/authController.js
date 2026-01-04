import User from '../models/User.js';
import { generateToken } from '../middleware/auth.js';

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
export const signup = async (req, res) => {
  try {
    console.log('📝 Signup request received');
    console.log('Request body:', req.body);

    const { email, name, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('❌ User already exists:', email);
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Create new user
    const user = new User({
      email,
      name,
      password,
      role: 'customer'
    });

    // Generate verification code
    const verificationCode = user.generateVerificationCode();
    await user.save();
    console.log('✅ User created successfully:', email);

    // In production, send this code via email
    console.log(`Verification code for ${email}: ${verificationCode}`);

    res.status(201).json({
      message: 'User created successfully. Please verify your email.',
      verificationCode, // Remove this in production
      userId: user._id
    });
  } catch (error) {
    console.error('❌ Error in signup:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Verify email with code
// @route   POST /api/auth/verify-email
// @access  Public
export const verifyEmail = async (req, res) => {
  try {
    console.log('✉️ Email verification request received');
    console.log('Request body:', req.body);

    const { userId, code } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      console.log('❌ User not found:', userId);
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.verificationCode !== code) {
      console.log('❌ Invalid verification code for:', user.email);
      return res.status(400).json({ message: 'Invalid verification code' });
    }

    user.isVerified = true;
    user.verificationCode = null;
    await user.save();
    console.log('✅ Email verified successfully:', user.email);

    const token = generateToken(user._id);

    res.json({
      message: 'Email verified successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    console.error('❌ Error in email verification:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    console.log('🔐 Login request received');
    console.log('Request body:', { email: req.body.email, password: '***' });

    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      console.log('❌ User not found:', email);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    console.log('👤 User found:', { email: user.email, role: user.role, isVerified: user.isVerified });

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      console.log('❌ Invalid password for:', email);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    console.log('✅ Password valid for:', email);

    // Generate token
    const token = generateToken(user._id);
    console.log('✅ Login successful for:', email);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    console.error('❌ Error in login:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Request password reset
// @route   POST /api/auth/forgot-password
// @access  Public
export const requestPasswordReset = async (req, res) => {
  try {
    console.log('🔑 Password reset request received');
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      console.log('❌ User not found for password reset:', email);
      // For security, don't reveal if email exists
      return res.json({ message: 'If the email exists, a reset code has been sent.' });
    }

    const resetCode = user.generateResetCode();
    await user.save();
    console.log('✅ Reset code generated for:', email);

    // In production, send this code via email
    console.log(`Reset code for ${email}: ${resetCode}`);

    res.json({
      message: 'Password reset code sent',
      resetCode, // Remove this in production
      userId: user._id
    });
  } catch (error) {
    console.error('❌ Error in password reset request:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Reset password with code
// @route   POST /api/auth/reset-password
// @access  Public
export const resetPassword = async (req, res) => {
  try {
    console.log('🔒 Reset password request received');
    const { userId, code, newPassword } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      console.log('❌ User not found:', userId);
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.resetCode !== code) {
      console.log('❌ Invalid reset code for:', user.email);
      return res.status(400).json({ message: 'Invalid reset code' });
    }

    if (user.resetCodeExpiry < Date.now()) {
      console.log('❌ Reset code expired for:', user.email);
      return res.status(400).json({ message: 'Reset code has expired' });
    }

    user.password = newPassword;
    user.resetCode = null;
    user.resetCodeExpiry = null;
    await user.save();
    console.log('✅ Password reset successfully for:', user.email);

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('❌ Error in password reset:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    console.log('👤 Get profile request for user:', req.user.id);
    const user = await User.findById(req.user.id).select('-password');
    res.json({ user });
  } catch (error) {
    console.error('❌ Error getting profile:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    console.log('📝 Update profile request for user:', req.user.id);
    console.log('Request body:', req.body);

    const { name, email } = req.body;
    
    const user = await User.findById(req.user.id);
    if (!user) {
      console.log('❌ User not found:', req.user.id);
      return res.status(404).json({ message: 'User not found' });
    }

    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        console.log('❌ Email already in use:', email);
        return res.status(400).json({ message: 'Email already in use' });
      }
      user.email = email;
    }

    if (name) user.name = name;

    await user.save();
    console.log('✅ Profile updated successfully for:', user.email);

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('❌ Error updating profile:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};