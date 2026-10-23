const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'rockcity_kurunegala_secure_secret_key_2026_jwt_token_auth',
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    }
  );
};

/**
 * @desc   Authenticate administrator & get token
 * @route  POST /api/auth/login
 * @access Public
 */
const loginAdmin = async (req, res, next) => {
  try {
    const { username, email, password } = req.body || {};
    const rawIdentifier = typeof username === 'string' ? username : (typeof email === 'string' ? email : '');
    const rawPassword = typeof password === 'string' ? password : '';
    const loginIdentifier = rawIdentifier.trim().toLowerCase();

    // Validate required fields (SRS Section 26: Generic auth error messages & input validation)
    if (!loginIdentifier || !rawPassword) {
      return res.status(400).json({
        success: false,
        message: 'Invalid username or password.'
      });
    }

    // Explicitly search by username OR email
    const admin = await Admin.findOne({
      $or: [
        { username: loginIdentifier },
        { email: loginIdentifier }
      ]
    }).select('+password');

    if (!admin) {
      // Generic invalid-login error - do not reveal whether username or password was incorrect
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password.'
      });
    }

    const isMatch = await admin.matchPassword(password);
    if (!isMatch) {
      // Generic invalid-login error
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password.'
      });
    }

    // Update lastLogin
    admin.lastLogin = new Date();
    await admin.save({ validateBeforeSave: false });

    const token = generateToken(admin._id);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        username: admin.username || admin.email.split('@')[0],
        email: admin.email,
        role: admin.role,
        lastLogin: admin.lastLogin
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Logout administrator
 * @route  POST /api/auth/logout
 * @access Public / Authenticated
 */
const logoutAdmin = async (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
};

/**
 * @desc   Get current logged-in admin profile
 * @route  GET /api/auth/profile
 * @access Private (Admin only)
 */
const getAdminProfile = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.admin._id).select('-password');
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Administrator account not found'
      });
    }

    res.json({
      success: true,
      data: admin
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  loginAdmin,
  logoutAdmin,
  getAdminProfile
};
