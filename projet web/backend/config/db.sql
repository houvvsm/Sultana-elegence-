CREATE DATABASE IF NOT EXISTS sultana_elegance CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE sultana_elegance;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    phone VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('client','admin') DEFAULT 'client',
    city VARCHAR(50),
    size_profile VARCHAR(20),
    status ENUM('active','pending') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE caftans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(150) NOT NULL UNIQUE,
    description TEXT,
    price_per_day DECIMAL(10,2) NOT NULL,
    image_main VARCHAR(255),
    images_gallery JSON,
    sizes_available JSON,
    category ENUM('caftan','pack_mariee','accessoire') DEFAULT 'caftan',
    status ENUM('available','reserved','maintenance','hidden') DEFAULT 'available',
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reservations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    caftan_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    duration_days INT NOT NULL,
    delivery_address TEXT,
    city VARCHAR(50),
    service_type ENUM('none','hair','makeup','full') DEFAULT 'none',
    event_time TIME,
    notes TEXT,
    total_price DECIMAL(10,2) NOT NULL,
    status ENUM('pending','confirmed','delivered','returned','cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (caftan_id) REFERENCES caftans(id) ON DELETE CASCADE
);

CREATE TABLE favorites (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    caftan_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (caftan_id) REFERENCES caftans(id) ON DELETE CASCADE,
    UNIQUE KEY unique_favorite (user_id, caftan_id)
);

CREATE TABLE partners (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type ENUM('boutique','beauty') NOT NULL,
    name VARCHAR(150) NOT NULL,
    city VARCHAR(50) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(150),
    pieces_count INT,
    service_type ENUM('hair','makeup','both'),
    message TEXT,
    status ENUM('pending','approved','rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    caftan_id INT NOT NULL,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (caftan_id) REFERENCES caftans(id) ON DELETE CASCADE
);

-- ── DEFAULT ADMIN ACCOUNT ───────────────────────────────────────────────────
-- Password: admin123  (change immediately after first login)
-- Hash generated with: password_hash('admin123', PASSWORD_DEFAULT)
INSERT INTO users (name, email, phone, password_hash, role, city, status)
VALUES (
    'Administrateur',
    'admin@sultana.ma',
    '',
    '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- password: password
    'admin',
    'Casablanca',
    'active'  -- MUST be active so login.php doesn't block the admin
);
-- To generate your own hash in PHP: echo password_hash('yourpassword', PASSWORD_DEFAULT);