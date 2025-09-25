const express = require('express');
const Tenant = require('../models/Tenant');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const { authenticate, requireAdmin, requireTenant } = require('../middleware/auth');

const router = express.Router();

// Upgrade tenant subscription
router.post('/:slug/upgrade', authenticate, requireTenant, requireAdmin, async (req, res) => {
  try {
    const tenantSlug = req.params.slug;
    
    const tenant = await Tenant.findOne({ slug: tenantSlug });
    if (!tenant) {
      return res.status(404).json({ message: 'Tenant not found' });
    }

    if (tenant.plan === 'pro') {
      return res.status(400).json({ message: 'Tenant is already on Pro plan' });
    }

    tenant.plan = 'pro';
    await tenant.save();

    res.json({ 
      message: 'Tenant upgraded to Pro plan successfully',
      tenant: {
        slug: tenant.slug,
        name: tenant.name,
        plan: tenant.plan
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin invite user to tenant
router.post(
  '/:slug/invite',
  authenticate,
  requireTenant,
  requireAdmin,
  [
    body('email').isEmail().normalizeEmail(),
    body('role').optional().isIn(['admin', 'member'])
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { email, role = 'member' } = req.body;
      const tenant = await Tenant.findOne({ slug: req.params.slug });
      if (!tenant) {
        return res.status(404).json({ message: 'Tenant not found' });
      }

      const existing = await User.findOne({ email });
      if (existing) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Create user with temporary password 'password'
      const user = new User({ email, password: 'password', role, tenantId: tenant._id });
      await user.save();

      return res.status(201).json({
        message: 'User invited successfully',
        user: { id: user._id, email: user.email, role: user.role }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Get tenant info
router.get('/:slug', authenticate, requireTenant, async (req, res) => {
  try {
    const tenantSlug = req.params.slug;
    
    const tenant = await Tenant.findOne({ slug: tenantSlug });
    if (!tenant) {
      return res.status(404).json({ message: 'Tenant not found' });
    }

    res.json({
      slug: tenant.slug,
      name: tenant.name,
      plan: tenant.plan
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;