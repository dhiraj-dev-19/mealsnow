<?php
header("Access-Control-Allow-Origin: http://127.0.0.1:5500");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

include 'db_connect.php';

// Fetch messes and their menus
$sql = "SELECT m.id, m.name, m.location, 
               mn.id AS menu_id, mn.day, mn.meal_type, mn.items 
        FROM messes m 
        LEFT JOIN menus mn ON m.id = mn.mess_id";
$result = $conn->query($sql);

$messes = array();
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $mess_id = $row['id'];
        if (!isset($messes[$mess_id])) {
            $messes[$mess_id] = array(
                'id' => $row['id'],
                'name' => $row['name'],
                'location' => $row['location'],
                'menus' => array()
            );
        }
        if ($row['menu_id']) {
            // Ensure items is treated as a string
            $items = $row['items'];
            if (is_array($items)) {
                $items = implode(", ", $items); // Convert array to string
            }

            $messes[$mess_id]['menus'][] = array(
                'day' => $row['day'],
                'meal_type' => $row['meal_type'],
                'items' => $items // Ensure items is a string
            );
        }
    }
}

echo json_encode(array_values($messes));
$conn->close();
?>