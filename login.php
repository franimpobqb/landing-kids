<?php
// Always start the session at the top
session_start();

// Hashed password from Step 1 (in a real app, you'd fetch this from a DB)
$correct_username = 'admin';
$hashed_password_from_db = '$2y$10$ASZGfzk1H4sHxVcB1TMoq.FOzhkJyR8Y8gl87UocAmnvcTvPtD4lO';

$error_message = '';

// Check if the form has been submitted
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    
    $username = $_POST['username'];
    $password = $_POST['password'];

    // Check if username matches and password is correct
    if ($username === $correct_username && password_verify($password, $hashed_password_from_db)) {
        
        // Password is correct!
        // Store user information in session
        $_SESSION['loggedin'] = true;
        $_SESSION['username'] = $username;

        // Regenerate session ID for security
        session_regenerate_id(true);

        // Redirect to the protected page
        header('Location: index.php');
        exit;

    } else {
        // Invalid credentials
        $error_message = 'Invalid username or password.';
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Login</title>
</head>
<body>
    <h2>Login</h2>
    
    <?php if (!empty($error_message)): ?>
        <p style="color: red;"><?php echo $error_message; ?></p>
    <?php endif; ?>

    <form action="login.php" method="post">
        <div>
            <label for="username">Username:</label>
            <input type="text" id="username" name="username" required>
        </div>
        <div>
            <label for="password">Password:</label>
            <input type="password" id="password" name="password" required>
        </div>
        <div>
            <button type="submit">Log In</button>
        </div>
    </form>
</body>
</html>