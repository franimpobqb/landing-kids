<?php
// Use a strong password
$passwordToHash = 'MySecurePassword123';

// Hash the password
$hashedPassword = password_hash($passwordToHash, PASSWORD_DEFAULT);

// This is what you would store in your database
echo $hashedPassword;
// Example output: $2y$10$T8.BFNl8.D0..pL/xS/Fk.TjF.Qp3ZgO/gE/sK.yC.zB/qE.sK
?>