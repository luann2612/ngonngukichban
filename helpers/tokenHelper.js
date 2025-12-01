const jwt = require('jsonwebtoken');
const db =require('../models');
const JWT_SECRET = process.env.JWT_SECRET;

async function getUserFromToken(req, res) {
        
    }