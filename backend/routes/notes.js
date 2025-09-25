const express = require('express');
const { body, validationResult } = require('express-validator');
const Note = require('../models/Note');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Create a note
router.post('/', authenticate, [
  body('title').trim().isLength({ min: 1 }).withMessage('Title is required'),
  body('content').trim().isLength({ min: 1 }).withMessage('Content is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, content } = req.body;
    const tenantId = req.user.tenantId._id;

    // Check subscription limits for free plan
    if (req.user.tenantId.plan === 'free') {
      const existingNotes = await Note.countDocuments({ tenantId });
      if (existingNotes >= 3) {
        return res.status(403).json({ 
          message: 'Free plan limit reached. Maximum 3 notes allowed. Upgrade to Pro for unlimited notes.',
          limitReached: true 
        });
      }
    }

    const note = new Note({
      title,
      content,
      tenantId,
      userId: req.user._id
    });

    await note.save();
    res.status(201).json(note);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all notes for current tenant
router.get('/', authenticate, async (req, res) => {
  try {
    const notes = await Note.find({ tenantId: req.user.tenantId._id })
      .populate('userId', 'email')
      .sort({ createdAt: -1 });

    res.json(notes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get specific note
router.get('/:id', authenticate, async (req, res) => {
  try {
    const note = await Note.findOne({ 
      _id: req.params.id, 
      tenantId: req.user.tenantId._id 
    }).populate('userId', 'email');

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.json(note);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update note
router.put('/:id', authenticate, [
  body('title').optional().trim().isLength({ min: 1 }),
  body('content').optional().trim().isLength({ min: 1 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const note = await Note.findOne({ 
      _id: req.params.id, 
      tenantId: req.user.tenantId._id 
    });

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // Update fields if provided
    if (req.body.title) note.title = req.body.title;
    if (req.body.content) note.content = req.body.content;

    await note.save();
    res.json(note);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete note
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({ 
      _id: req.params.id, 
      tenantId: req.user.tenantId._id 
    });

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;