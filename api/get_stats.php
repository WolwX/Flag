<?php
/**
 * Flag API - Get Statistics
 * Version 2.0
 * 
 * Récupère les statistiques et le classement depuis le fichier JSON
 */

// Configuration
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Gestion des requêtes OPTIONS (CORS preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Vérifier que c'est une requête GET
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Method Not Allowed', 'message' => 'Only GET requests are allowed']);
    exit();
}

// Chemin du fichier de stockage
$jsonFile = __DIR__ . '/../stats/flags.json';

// Vérifier que le fichier existe
if (!file_exists($jsonFile)) {
    http_response_code(500);
    echo json_encode(['error' => 'Storage Error', 'message' => 'Storage file not found']);
    exit();
}

// Lire le fichier avec verrouillage partagé
$fp = fopen($jsonFile, 'r');
if (!$fp) {
    http_response_code(500);
    echo json_encode(['error' => 'Storage Error', 'message' => 'Cannot open storage file']);
    exit();
}

// Verrouillage partagé (lecture)
if (!flock($fp, LOCK_SH)) {
    fclose($fp);
    http_response_code(500);
    echo json_encode(['error' => 'Storage Error', 'message' => 'Cannot lock storage file']);
    exit();
}

// Lire le contenu
$fileContent = stream_get_contents($fp);
flock($fp, LOCK_UN);
fclose($fp);

// Décoder le JSON
$jsonData = json_decode($fileContent, true);

if ($jsonData === null) {
    http_response_code(500);
    echo json_encode(['error' => 'Parse Error', 'message' => 'Cannot parse storage file']);
    exit();
}

// Paramètres de requête optionnels
$includeFlags = isset($_GET['include_flags']) && $_GET['include_flags'] === 'true';
$limit = isset($_GET['limit']) ? (int)$_GET['limit'] : null;

// Préparer la réponse
$response = [
    'version' => $jsonData['version'],
    'last_updated' => $jsonData['last_updated'],
    'statistics' => $jsonData['statistics']
];

// Inclure les flags si demandé
if ($includeFlags) {
    $flags = $jsonData['flags'];
    
    // Limiter le nombre si spécifié
    if ($limit !== null && $limit > 0) {
        $flags = array_slice($flags, -$limit); // Les X derniers
    }
    
    $response['flags'] = $flags;
    $response['flags_count'] = count($flags);
}

// Réponse de succès
http_response_code(200);
echo json_encode($response, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
