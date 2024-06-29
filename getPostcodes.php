<?php
error_reporting(E_ALL);
ini_set("display_errors", 1);
$servername = "localhost";
$database = "c2315110_postcodeDB";
// $username = "c2315110_admin";
// $password = "SW3294QB=,+";
$username = "c2315110_nuhu";
$password = "nuhupassword";

$conn = new mysqli($servername, $username, $password, $database);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = "SELECT * FROM tbl_postcodes";
$result = $conn->query($sql);
$postcodes = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $postcodes[] = $row;
    }
} else {
    $postcodes["Error"] = "No Results";
}

$json_data = json_encode($postcodes);
header('Content-Type: application/json');
echo $json_data;

$conn->close();
?>
