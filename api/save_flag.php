<?php
/**
 * Flag API - Save Flag
 * Version 2.0
 * 
 * Enregistre un nouveau flag dans le fichier JSON
 */

// Configuration
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Gestion des requêtes OPTIONS (CORS preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Vérifier que c'est une requête POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method Not Allowed', 'message' => 'Only POST requests are allowed']);
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

// Récupérer les données POST
$input = file_get_contents('php://input');
$data = json_decode($input, true);

// Validation des données requises
$requiredFields = ['computer_name', 'flagger_name', 'target_name'];
foreach ($requiredFields as $field) {
    if (!isset($data[$field]) || empty($data[$field])) {
        http_response_code(400);
        echo json_encode(['error' => 'Validation Error', 'message' => "Field '$field' is required"]);
        exit();
    }
}

// Verrouillage du fichier pour éviter les écritures concurrentes
$fp = fopen($jsonFile, 'c+');
if (!$fp) {
    http_response_code(500);
    echo json_encode(['error' => 'Storage Error', 'message' => 'Cannot open storage file']);
    exit();
}

// Verrouillage exclusif
if (!flock($fp, LOCK_EX)) {
    fclose($fp);
    http_response_code(500);
    echo json_encode(['error' => 'Storage Error', 'message' => 'Cannot lock storage file']);
    exit();
}

// Lire le contenu actuel
$fileContent = stream_get_contents($fp);
$jsonData = json_decode($fileContent, true);

if ($jsonData === null) {
    // Si le fichier est vide ou corrompu, initialiser
    $jsonData = [
        'version' => '2.0',
        'last_updated' => null,
        'flags' => [],
        'statistics' => [
            'total_flags' => 0,
            'unique_computers' => 0,
            'unique_flaggers' => 0,
            'unique_targets' => 0,
            'average_unlock_time' => 0,
            'top_flaggers' => [],
            'top_targets' => [],
            'top_computers' => []
        ]
    ];
}

// Créer le nouvel enregistrement de flag
$newFlag = [
    'id' => count($jsonData['flags']) + 1,
    'timestamp' => date('c'), // Format ISO 8601
    'computer_name' => sanitize($data['computer_name']),
    'flagger_name' => sanitize($data['flagger_name']),
    'target_name' => sanitize($data['target_name']),
    'message' => isset($data['message']) ? sanitize($data['message']) : '',
    'color' => isset($data['color']) ? sanitize($data['color']) : '007BD7',
    'has_code' => isset($data['has_code']) ? (bool)$data['has_code'] : false,
    'unlock_time_seconds' => isset($data['unlock_time_seconds']) ? (int)$data['unlock_time_seconds'] : null,
    'ip_address' => $_SERVER['REMOTE_ADDR'] ?? 'unknown'
];

// Ajouter le flag
$jsonData['flags'][] = $newFlag;
$jsonData['last_updated'] = date('c');

// Recalculer les statistiques
$jsonData['statistics'] = calculateStatistics($jsonData['flags']);

// Écrire dans le fichier
rewind($fp);
ftruncate($fp, 0);
fwrite($fp, json_encode($jsonData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

// Libérer le verrou et fermer
flock($fp, LOCK_UN);
fclose($fp);

// Réponse de succès
http_response_code(201);
echo json_encode([
    'success' => true,
    'message' => 'Flag saved successfully',
    'flag_id' => $newFlag['id'],
    'timestamp' => $newFlag['timestamp']
]);

/**
 * Fonction de nettoyage des données
 */
function sanitize($value) {
    return htmlspecialchars(trim($value), ENT_QUOTES, 'UTF-8');
}

/**
 * Calcul des statistiques
 */
function calculateStatistics($flags) {
    if (empty($flags)) {
        return [
            'total_flags' => 0,
            'unique_computers' => 0,
            'unique_flaggers' => 0,
            'unique_targets' => 0,
            'average_unlock_time' => 0,
            'top_flaggers' => [],
            'top_targets' => [],
            'top_computers' => []
        ];
    }

    // Compteurs
    $computers = [];
    $flaggers = [];
    $targets = [];
    $unlockTimes = [];

    foreach ($flags as $flag) {
        // Compter les ordinateurs
        if (!isset($computers[$flag['computer_name']])) {
            $computers[$flag['computer_name']] = ['count' => 0, 'last_flag' => null];
        }
        $computers[$flag['computer_name']]['count']++;
        $computers[$flag['computer_name']]['last_flag'] = $flag['timestamp'];

        // Compter les flaggers
        if (!isset($flaggers[$flag['flagger_name']])) {
            $flaggers[$flag['flagger_name']] = ['count' => 0, 'last_flag' => null];
        }
        $flaggers[$flag['flagger_name']]['count']++;
        $flaggers[$flag['flagger_name']]['last_flag'] = $flag['timestamp'];

        // Compter les cibles
        if (!isset($targets[$flag['target_name']])) {
            $targets[$flag['target_name']] = ['count' => 0, 'last_flag' => null];
        }
        $targets[$flag['target_name']]['count']++;
        $targets[$flag['target_name']]['last_flag'] = $flag['timestamp'];

        // Temps de déblocage
        if ($flag['unlock_time_seconds'] !== null) {
            $unlockTimes[] = $flag['unlock_time_seconds'];
        }
    }

    // Trier et formater les tops
    $topFlaggers = formatTop($flaggers);
    $topTargets = formatTop($targets);
    $topComputers = formatTop($computers);

    // Moyenne du temps de déblocage
    $avgUnlockTime = !empty($unlockTimes) ? round(array_sum($unlockTimes) / count($unlockTimes), 2) : 0;

    return [
        'total_flags' => count($flags),
        'unique_computers' => count($computers),
        'unique_flaggers' => count($flaggers),
        'unique_targets' => count($targets),
        'average_unlock_time' => $avgUnlockTime,
        'top_flaggers' => $topFlaggers,
        'top_targets' => $topTargets,
        'top_computers' => $topComputers
    ];
}

/**
 * Formater et trier le classement
 */
function formatTop($data) {
    $result = [];
    foreach ($data as $name => $info) {
        $result[] = [
            'name' => $name,
            'count' => $info['count'],
            'last_flag' => $info['last_flag']
        ];
    }
    
    // Trier par nombre décroissant
    usort($result, function($a, $b) {
        return $b['count'] - $a['count'];
    });

    // Limiter aux 10 premiers
    return array_slice($result, 0, 10);
}
