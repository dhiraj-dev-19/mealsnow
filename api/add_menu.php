<?php
header("Access-Control-Allow-Origin: http://127.0.0.1:5500");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Disable HTML errors
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', 'php_errors.log');

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

include 'db_connect.php';

try {
    $data = json_decode(file_get_contents('php://input'), true);
    
    // Validate input
    if (empty($data['messId']) || empty($data['day']) || empty($data['mealType']) || empty($data['items'])) {
        throw new Exception("All fields are required");
    }

    $mess_id = $data['messId'];
    $day = $data['day'];
    $meal_type = $data['mealType'];
    
    // Ensure items is a string (comma-separated)
    $items = is_array($data['items']) ? implode(", ", $data['items']) : $data['items'];

    // Use prepared statement
    $stmt = $conn->prepare("INSERT INTO menus (mess_id, day, meal_type, items) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("isss", $mess_id, $day, $meal_type, $items);
    
    if ($stmt->execute()) {
        echo json_encode(["status" => "success"]);
    } else {
        throw new Exception("Database error: " . $stmt->error);
    }

    $stmt->close();
} catch(Exception $e) {
    http_response_code(400);
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
} finally {
    $conn->close();
}
?>