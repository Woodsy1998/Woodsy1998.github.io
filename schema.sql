-- --------------------------------------------
-- Optional: Create and select the database
-- --------------------------------------------
CREATE DATABASE IF NOT EXISTS carbonem_website;
USE carbonem_website;

-- --------------------------------------------
-- Create inquiries table
-- --------------------------------------------
CREATE TABLE IF NOT EXISTS inquiries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  message TEXT NOT NULL,
  submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
