<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Retrieve form data
    $name = $_POST["name"];
    $email = $_POST["email"];
    $subject = $_POST["subject"];
    $message = $_POST["message"];

    // Format the data as a string
    $data = "Name: $name\nEmail: $email\nSubject: $subject\nMessage: $message\n\n";

    // Specify the file path to save the data
    $filePath = "form-data.txt";

    // Write the data to the file
    file_put_contents($filePath, $data, FILE_APPEND | LOCK_EX);

    // Redirect to a thank you page or display a success message
    header("Location: thank-you.html");
    exit;
}
?>