<?php
require_once '../api/functions.php';
require_once '../api/auth.php';

requireAdmin();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(["error" => "Méthode non autorisée"], 405);
}

$id = $_POST['id'] ?? null;
if (!$id) {
    jsonResponse(["error" => "ID requis"], 400);
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

// Get current image
$stmt = $pdo->prepare("SELECT image_main FROM caftans WHERE id = ?");
$stmt->execute([$id]);
$current = $stmt->fetch();
if (!$current) {
    jsonResponse(["error" => "Caftan non trouvé"], 404);
}

$image_main = $current['image_main'];

// Upload new image if provided
if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
    $newImage = uploadImage($_FILES['image'], '../../uploads/caftans/');
    if ($newImage) {
        // Delete old image
        if ($image_main && file_exists('../../' . $image_main)) {
            unlink('../../' . $image_main);
        }
        $image_main = $newImage;
    }
}

$slug = slugify($name);

$stmt = $pdo->prepare("
    UPDATE caftans 
    SET name = ?, slug = ?, description = ?, price_per_day = ?, 
        image_main = ?, sizes_available = ?, category = ?, status = ?, featured = ?
    WHERE id = ?
");
$stmt->execute([
    $name, $slug, $description, $price, $image_main,
    $sizes, $category, $status, $featured, $id
]);

jsonResponse([
    "success" => true,
    "message" => "Caftan modifié"
]);