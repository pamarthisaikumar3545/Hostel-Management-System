const express = require('express');
const router = express.Router();
const MaintenanceRequest = require('../models/Maintenance');

// @route   GET /maintenanceRequests
// @desc    Get all maintenance requests
router.get('/', async (req, res) => {
    try {
        const requests = await MaintenanceRequest.find(req.query).sort({ reportedDate: -1 });
        res.json(requests);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /maintenanceRequests
// @desc    Create a new maintenance request
router.post('/', async (req, res) => {
    try {
        const newRequest = new MaintenanceRequest(req.body);
        await newRequest.save();
        res.status(201).json(newRequest);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PATCH /maintenanceRequests/:id
// @desc    Update a maintenance request
router.patch('/:id', async (req, res) => {
    try {
        const request = await MaintenanceRequest.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        if (!request) {
            return res.status(404).json({ msg: 'Request not found' });
        }
        res.json(request);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router; 