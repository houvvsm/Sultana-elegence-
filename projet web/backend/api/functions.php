<?php
require_once '../config/connection.php';

function jsonResponse($data, $status = 200) {
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

function slugify($text) {
    $text = preg_replace('~[^\pL\d]+~u', '-', $text);
    $text = iconv('utf-8', 'us-ascii//TRANSLIT', $text);
    $text = preg_replace('~[^-\w]+~', '', $text);
    $text = trim($text, '-');
    $text = preg_replace('~-+~', '-', $text);
    $text = strtolower($text);
    return $text ?: 'n-a';
}

function uploadImage($file, $folder = '../uploads/caftans/') {
    if (!isset($file['tmp_name']) || empty($file['tmp_name'])) {
        return null;
    }
    
    $allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!in_array($file['type'], $allowed)) {
        return null;
    }
    
    if ($file['size'] > 5 * 1024 * 1024) {
        return null;
    }
    
    if (!is_dir($folder)) {
        mkdir($folder, 0755, true);
    }
    
    $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
    $filename = uniqid('caftan_', true) . '.' . $ext;
    $path = $folder . $filename;
    
    if (move_uploaded_file($file['tmp_name'], $path)) {
        return 'uploads/caftans/' . $filename;
    }
    
    return null;
}

function formatPrice($price) {
    return number_format($price, 0, ',', ' ') . ' MAD';
}