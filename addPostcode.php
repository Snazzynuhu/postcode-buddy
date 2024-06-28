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

if (!isset($data['postcode'])) {
    echo json_encode(['success' => false, 'message' => 'Postcode is required.']);
    exit();
}

$postcode = $data['postcode'];

// Validate postcode format on the server side
if (!preg_match('/^[A-Za-z0-9]{3,10}$/', $postcode)) {
    echo json_encode(['success' => false, 'message' => 'Invalid postcode format.']);
    exit();
}

$servername = "localhost";
$database = "c2315110_postcodeDB";
$username = "c2315110_nuhu";
$password = "nuhupassword";

$conn = new mysqli($servername, $username, $password, $database);

if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed: ' . $conn->connect_error]);
    exit();
}

// Check if the postcode already exists
$checkStmt = $conn->prepare("SELECT COUNT(*) FROM tbl_postcodes WHERE postcode = ?");
$checkStmt->bind_param("s", $postcode);
$checkStmt->execute();
$checkStmt->bind_result($count);
$checkStmt->fetch();
$checkStmt->close();

if ($count > 0) {
    echo json_encode(['success' => false, 'message' => 'Postcode already exists.']);
    exit();
}

// Insert the new postcode
$stmt = $conn->prepare("INSERT INTO tbl_postcodes (postcode) VALUES (?)");
$stmt->bind_param("s", $postcode);

if ($stmt->execute())
