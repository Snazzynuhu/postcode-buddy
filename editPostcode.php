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

if (!isset($data['postcodeID']) || !isset($data['newPostcode'])) {
    echo json_encode(['success' => false, 'message' => 'Postcode ID and new postcode are required.']);
    exit();
}

$postcodeID = $data['postcodeID'];
$newPostcode = $data['newPostcode'];

// Validate postcode format on the server side
if (!preg_match('/^[A-Za-z0-9]{3,10}$/', $newPostcode)) {
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

// Check if the new postcode already exists
$checkStmt = $conn->prepare("SELECT COUNT(*) FROM tbl_postcodes WHERE postcode = ?");
$checkStmt->bind_param("s", $newPostcode);
$checkStmt->execute();
$checkStmt->bind_result($count);
$checkStmt->fetch();
$checkStmt->close();

if ($count > 0) {
    echo json_encode(['success' => false, 'message' => 'Postcode already exists.']);
    exit();
}

// Update the postcode
$stmt = $conn->prepare("UPDATE tbl_postcodes SET postcode = ? WHERE postcodeID = ?");
$stmt->bind_param("si", $newPostcode, $postcodeID);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Postcode updated successfully.']);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to update postcode.']);
}

$stmt->close();
$conn->close();
?>
