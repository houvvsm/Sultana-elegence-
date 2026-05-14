-- ============================================================
-- SULTANA ÉLÉGANCE — Migration: Add payment_method column
-- Run this in phpMyAdmin before testing reservations
-- ============================================================

ALTER TABLE reservations
  ADD COLUMN payment_method ENUM('on_delivery','card','virement') DEFAULT 'on_delivery'
  AFTER notes;

-- Update existing rows
UPDATE reservations SET payment_method = 'on_delivery' WHERE payment_method IS NULL;

-- ============================================================