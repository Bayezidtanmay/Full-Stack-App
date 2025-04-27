<?php
include 'DBConnect.php';
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');

$objectDB = new DbConnect;
$conn = $objectDB->connect();
$user = file_get_contents('php://input');
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case "POST":
        $user = json_decode(file_get_contents('php://input'));
        $sql = "INSERT INTO users(id, name, email, mobile, created_at, updated_at)
                VALUES(null, :name, :email, :mobile, :created_at, :updated_at)";
        $stmt = $conn->prepare($sql);
        $created_at = date('Y-m-d');
        $updated_at = date('Y-m-d');
        $stmt->bindParam(':name', $user->name);
        $stmt->bindParam(':email', $user->email);
        $stmt->bindParam(':mobile', $user->mobile);
        $stmt->bindParam(':created_at', $created_at);
        $stmt->bindParam(':updated_at', $updated_at);

        if ($stmt->execute()) {
            $response = ['status' => 1, 'message' => 'User created successfully'];
        } else {
            $response = ['status' => 0, 'message' => 'Failed to create user'];
        }
        echo json_encode($response);
        break;

    case "GET":
        $sql = "SELECT * FROM users";
        $stmt = $conn->prepare($sql);
        $stmt->execute();
        $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($users);
        break;

    // Delete case

    case "DELETE":
        $data = json_decode(file_get_contents("php://input"));
        $id = $data->id ?? null;

        if ($id) {
            $sql = "DELETE FROM users WHERE id = :id";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);

            if ($stmt->execute()) {
                $response = ['status' => 1, 'message' => 'User deleted successfully'];
            } else {
                $response = ['status' => 0, 'message' => 'Failed to delete user'];
            }
        } else {
            $response = ['status' => 0, 'message' => 'Invalid or missing ID'];
        }

        echo json_encode($response);
        break;

    // Edit case

    case "PUT":
        $editData = json_decode(file_get_contents("php://input"));

        $sql = "UPDATE users SET name = :name, email = :email, mobile = :mobile, updated_at = :updated_at WHERE id = :id";
        $stmt = $conn->prepare($sql);
        $updated_at = date('Y-m-d');

        $stmt->bindParam(':id', $editData->id, PDO::PARAM_INT);
        $stmt->bindParam(':name', $editData->name);
        $stmt->bindParam(':email', $editData->email);
        $stmt->bindParam(':mobile', $editData->mobile);
        $stmt->bindParam(':updated_at', $updated_at);

        if ($stmt->execute()) {
            $response = ['status' => 1, 'message' => 'User updated successfully'];
        } else {
            $response = ['status' => 0, 'message' => 'Failed to update user'];
        }

        echo json_encode($response);
        break;

    default:
        echo json_encode(['status' => 0, 'message' => 'Unsupported request']);
        break;
}
