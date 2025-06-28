const express = require('express');
const router = express.Router();
const Tenant = require('../models/Tenant');

// @route   GET /tenants
// @desc    Get tenants by query
router.get('/', async (req, res) => {
    try {
        const tenants = await Tenant.find(req.query);
        res.json(tenants);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /tenants
// @desc    Create a new tenant
router.post('/', async (req, res) => {
    try {
        const newTenant = new Tenant(req.body);
        await newTenant.save();
        res.status(201).json(newTenant);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router; 