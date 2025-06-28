const express = require('express');
const router = express.Router();
const Room = require('../models/Room');

// @route   GET /api/rooms
// @desc    Get all rooms
router.get('/', async (req, res) => {
  try {
    const rooms = await Room.find().sort({ roomNumber: 1 });
    res.json(rooms);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/rooms/:id
// @desc    Get a specific room by ID
router.get('/:id', async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ msg: 'Room not found' });
    }
    res.json(room);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PATCH /api/rooms/:id
// @desc    Update a room
router.patch('/:id', async (req, res) => {
    try {
        const room = await Room.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );

        if (!room) {
            return res.status(404).json({ msg: 'Room not found' });
        }
        
        console.log(`Room ${req.params.id} updated with:`, req.body);
        res.json(room);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/rooms
// @desc    Create a new room
router.post('/', async (req, res) => {
    const { roomNumber, building, floor, capacity, rent } = req.body;

    try {
        // Check if room already exists
        let room = await Room.findOne({ roomNumber });
        if (room) {
            return res.status(400).json({ msg: 'Room with this number already exists' });
        }

        room = new Room({
            roomNumber,
            building,
            floor,
            capacity,
            rent
        });

        await room.save();
        res.status(201).json(room);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router; 