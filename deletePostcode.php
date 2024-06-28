<?php
session_start();
header('Content-Type: application/json');
error_reporting(E_ALL);
ini_set("display_errors", 1);

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'User not authenticated.']);
    exit();
}

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['postcodeID'])) {
    echo json_encode(['success' => false, 'message' => 'Postcode ID is required.']);
    exit();
}

$postcodeID = $data['postcodeID'];

$servername = "localhost";
$database = "c2315110_postcodeDB";
$username = "c2315110_nuhu";
$password = "nuhupassword";

$conn = new mysqli($servername, $username, $password, $database);

if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed: ' . $conn->connect_error]);
    exit();
}

// Delete the postcode
$stmt = $conn->prepare("DELETE FROM tbl_postcodes WHERE postcodeID = ?");
$stmt->bind_param("i", $postcodeID);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Postcode deleted successfully.']);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to delete postcode.']);
}

$stmt->close();
$conn->close();
?>
