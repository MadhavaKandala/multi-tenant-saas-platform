require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Database connection
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'saas_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres'
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT 1');
    res.json({
      status: 'ok',
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({
      status: 'error',
      database: 'disconnected',
      timestamp: new Date().toISOString()
    });
  }
});

// Authentication middleware
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, message: 'No token' });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret-key-min-32-characters-required');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

// Register tenant
app.post('/api/auth/register-tenant', async (req, res) => {
  const { tenantName, subdomain, adminEmail, adminPassword, adminFullName } = req.body;
  
  try {
    const hashedPassword = await bcryptjs.hash(adminPassword, 10);
    const tenantId = uuidv4();
    const userId = uuidv4();
    
    await pool.query('BEGIN');
    
    await pool.query(
      'INSERT INTO tenants (id, name, subdomain, subscription_plan, max_users, max_projects) VALUES ($1, $2, $3, $4, $5, $6)',
      [tenantId, tenantName, subdomain, 'free', 5, 3]
    );
    
    await pool.query(
      'INSERT INTO users (id, tenant_id, email, password_hash, full_name, role) VALUES ($1, $2, $3, $4, $5, $6)',
      [userId, tenantId, adminEmail, hashedPassword, adminFullName, 'tenant_admin']
    );
    
    await pool.query('COMMIT');
    
    res.status(201).json({
      success: true,
      data: { tenantId, subdomain, adminUser: { id: userId, email: adminEmail, fullName: adminFullName, role: 'tenant_admin' } }
    });
  } catch (error) {
    await pool.query('ROLLBACK');
    res.status(400).json({ success: false, message: error.message });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  const { email, password, tenantSubdomain } = req.body;
  
  try {
    const tenantResult = await pool.query('SELECT id FROM tenants WHERE subdomain = $1', [tenantSubdomain]);
    if (tenantResult.rows.length === 0) return res.status(404).json({ success: false, message: 'Tenant not found' });
    
    const tenantId = tenantResult.rows[0].id;
    const userResult = await pool.query('SELECT * FROM users WHERE email = $1 AND tenant_id = $2', [email, tenantId]);
    if (userResult.rows.length === 0) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    
    const user = userResult.rows[0];
    const passwordMatch = await bcryptjs.compare(password, user.password_hash);
    if (!passwordMatch) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    
    const token = jwt.sign(
      { userId: user.id, tenantId: user.tenant_id, role: user.role },
      process.env.JWT_SECRET || 'secret-key-min-32-characters-required',
      { expiresIn: '24h' }
    );
    
    res.json({
      success: true,
      data: {
        user: { id: user.id, email: user.email, fullName: user.full_name, role: user.role, tenantId: user.tenant_id },
        token,
        expiresIn: 86400
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get current user
app.get('/api/auth/me', authMiddleware, async (req, res) => {
  try {
    const user = await pool.query('SELECT * FROM users WHERE id = $1', [req.user.userId]);
    if (user.rows.length === 0) return res.status(404).json({ success: false, message: 'User not found' });
    
    const tenant = await pool.query('SELECT * FROM tenants WHERE id = $1', [req.user.tenantId]);
    
    res.json({
      success: true,
      data: {
        id: user.rows[0].id,
        email: user.rows[0].email,
        fullName: user.rows[0].full_name,
        role: user.rows[0].role,
        isActive: user.rows[0].is_active,
        tenant: tenant.rows.length > 0 ? {
          id: tenant.rows[0].id,
          name: tenant.rows[0].name,
          subdomain: tenant.rows[0].subdomain,
          subscriptionPlan: tenant.rows[0].subscription_plan,
          maxUsers: tenant.rows[0].max_users,
          maxProjects: tenant.rows[0].max_projects
        } : null
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
