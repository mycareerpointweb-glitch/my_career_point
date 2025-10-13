const express = require('express');
const jwt = require('jsonwebtoken');
const supabase = require('../supabaseClient');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// @route   POST /api/auth/login
// @desc    Login user (no bcrypt, returns full details)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    // Find user by email
    const { data: user, error } = await supabase
      .from('Users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Compare plain text passwords (for testing)
    if (user.password !== password) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Create JWT token with key details
    const token = jwt.sign(
      {
        user_id: user.user_id,
        email: user.email,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: '2h' }
    );

    // Return all user details
    res.json({
      message: 'Login successful',
      token,
      user: {
        user_id: user.user_id,
        full_name: user.full_name,
        username: user.username,
        email: user.email,
        role: user.role,
        status: user.status,
        notes: user.notes,
        created_by: user.created_by,
        modified_by: user.modified_by,
        created_at: user.created_at
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
