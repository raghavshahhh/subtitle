-- Fix database schema for SubtitleAI
-- Run this to create missing tables

CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    title TEXT NOT NULL,
    video_url TEXT,
    thumbnail_url TEXT,
    status TEXT DEFAULT 'processing',
    language TEXT DEFAULT 'hi',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE IF NOT EXISTS subtitles (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL,
    start_time REAL NOT NULL,
    end_time REAL NOT NULL,
    text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects (id)
);

-- Insert demo data for testing
INSERT OR IGNORE INTO users (id, email, name) VALUES 
('demo-user-1', 'demo@subtitleai.com', 'Demo User');

INSERT OR IGNORE INTO projects (id, user_id, title, video_url, status) VALUES 
('demo-project-1', 'demo-user-1', 'Sample Video', '/demo/sample.mp4', 'completed');
