-- Multi-Tenant SaaS Platform Database Schema
-- Complete database initialization with all tables and seed data

-- Create tenants table
CREATE TABLE IF NOT EXISTS tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    subdomain VARCHAR(63) UNIQUE NOT NULL,
    status VARCHAR(50) DEFAULT 'active' CHECK(status IN ('active', 'suspended', 'trial')),
    subscription_plan VARCHAR(50) DEFAULT 'free' CHECK(subscription_plan IN ('free', 'pro', 'enterprise')),
    max_users INTEGER,
    max_projects INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK(role IN ('super_admin', 'tenant_admin', 'user')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_tenant_email UNIQUE (tenant_id, email)
);

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'active' CHECK(status IN ('active', 'archived', 'completed')),
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'todo' CHECK(status IN ('todo', 'in_progress', 'completed')),
    priority VARCHAR(50) DEFAULT 'medium' CHECK(priority IN ('low', 'medium', 'high')),
    assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
    due_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create audit_logs table
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id VARCHAR(255),
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_tenant_id ON users(tenant_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_projects_tenant_id ON projects(tenant_id);
CREATE INDEX IF NOT EXISTS idx_projects_created_by ON projects(created_by);
CREATE INDEX IF NOT EXISTS idx_tasks_tenant_id ON tasks(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_audit_logs_tenant_id ON audit_logs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);

-- Seed data: Create super admin
INSERT INTO users (tenant_id, email, password_hash, full_name, role, is_active)
VALUES (NULL, 'superadmin@system.com', '$2b$10$N9qo8uLOickgx2ZMRZoMye2bCPz3XwbLfqBWGr6rUf8j5RH0l0nqy', 'Super Admin', 'super_admin', true)
ON CONFLICT DO NOTHING;

-- Seed data: Create demo tenant
INSERT INTO tenants (name, subdomain, status, subscription_plan, max_users, max_projects)
VALUES ('Demo Company', 'demo', 'active', 'pro', 25, 15)
ON CONFLICT (subdomain) DO NOTHING;

-- Seed data: Get demo tenant ID and create admin
DO $$
DECLARE
    demo_tenant_id UUID;
BEGIN
    SELECT id INTO demo_tenant_id FROM tenants WHERE subdomain = 'demo';
    
    IF demo_tenant_id IS NOT NULL THEN
        INSERT INTO users (tenant_id, email, password_hash, full_name, role, is_active)
        VALUES (demo_tenant_id, 'admin@demo.com', '$2b$10$J6xvxmN3JtD0Kp8L2nC4D.YnY1c5x0vWpJKq3mZ8r5G1h0P2m.Xhm', 'Demo Admin', 'tenant_admin', true)
        ON CONFLICT DO NOTHING;
        
        INSERT INTO users (tenant_id, email, password_hash, full_name, role, is_active)
        VALUES (demo_tenant_id, 'user1@demo.com', '$2b$10$K7yxvxmN3JtD0Kp8L2nC4D.YnY1c5x0vWpJKq3mZ8r5G1h0P2m.Xhm', 'Demo User 1', 'user', true),
               (demo_tenant_id, 'user2@demo.com', '$2b$10$L8yxvxmN3JtD0Kp8L2nC4D.YnY1c5x0vWpJKq3mZ8r5G1h0P2m.Xhm', 'Demo User 2', 'user', true)
        ON CONFLICT DO NOTHING;
    END IF;
END $$;
