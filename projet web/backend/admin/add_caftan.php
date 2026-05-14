<?php
require_once '../api/functions.php';
require_once '../api/auth.php';

requireAdmin();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(["error" => "Méthode non autorisée"], 405);
}

$name = trim($_POST['name'] ?? '');
$description = trim($_POST['description'] ?? '');
$price = floatval($_POST['price_per_day'] ?? 0);
$category = $_POST['category'] ?? 'caftan';
$sizes = $_POST['sizes'] ?? '[]';
$status = $_POST['status'] ?? 'available';
$featured = isset($_POST['featured']) ? 1 : 0;

if (empty($name) || $price <= 0) {
    jsonResponse(["error" => "Nom et prix obligatoires"], 400);
}

$slug = slugify($name);

// Check slug unique
$check = $pdo->prepare("SELECT id FROM caftans WHERE slug = ?");
$check->execute([$slug]);
if ($check->fetch()) {
    $slug .= '-' . uniqid();
}

// Upload main image
$image_main = null;
if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
    $image_main = uploadImage($_FILES['image'], '../../uploads/caftans/');
}

$stmt = $pdo->prepare("
    INSERT INTO caftans 
    (name, slug, description, price_per_day, image_main, sizes_available, category, status, featured)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
");
$stmt->execute([
    $name, $slug, $description, $price, $image_main,
    $sizes, $category, $status, $featured
]);

jsonResponse([
    "success" => true,
    "message" => "Caftan ajouté",
    "caftan_id" => $pdo->lastInsertId()
]);