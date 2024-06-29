<?php
session_start();
header('Content-Type: application/json');
error_reporting(E_ALL);
ini_set("display_errors", 1);

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['username']) || !isset($data['password'])) {
    echo json_encode(['success' => false, 'message' => 'Username and password are required.']);
    exit();
}

$username = $data['username'];
$password = $data['password'];

// Database connection details
$servername = "localhost";
$database = "c2315110_postcodeDB";
$db_username = "c2315110_nuhu";
$db_password = "nuhupassword";

$conn = new mysqli($servername, $db_username, $db_password, $database);

if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed: ' . $conn->connect_error]);
    exit();
}

$stmt = $conn->prepare("SELECT password FROM tbl_users WHERE Username = ?");
if (!$stmt) {
    echo json_encode(['success' => false, 'message' => 'Failed to prepare statement: ' . $conn->error]);
    exit();
}

$stmt->bind_param("s", $username);
$stmt->execute();
$stmt->bind_result($hashed_password);
$stmt->fetch();

if ($hashed_password === null) {
    echo json_encode(['success' => false, 'message' => 'Invalid username.']);
} elseif (password_verify($password, $hashed_password)) {
    $_SESSION['user_id'] = $username; 
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid password.']);
}

$stmt->close();
$conn->close();
?>
