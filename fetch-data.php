<?php
if($_SERVER['REQUEST_METHOD'] == "POST" and isset($_POST['someAction']))
{
    func();
}
function func()
{
    $websiteUrl = 'https://bensinverd.is/gsmbensin_web.php'; // Replace with the URL of the website

    // Fetch the data from the website
    $arrContextOptions=array(
        "ssl"=>array(
            "verify_peer"=>false,
            "verify_peer_name"=>false,
        ),
    );  
    $data = file_get_contents($websiteUrl, false, stream_context_create($arrContextOptions));

    // Create a DOM document and load the HTML content
    $dom = new DOMDocument();
    libxml_use_internal_errors(true);
    $dom->loadHTML($data);

    // Create an XPath instance to query the DOM document
    $xpath = new DOMXPath($dom);

    // Define the XPath query to select the desired data
    $query = "//td"; // Replace with your specific pattern or tag

    // Execute the XPath query
    $result = $xpath->query($query);

    if ($result->length > 0) {
        // Extract the data from the matched elements
        $extractedData = '';
        foreach ($result as $node) {
            $extractedData .= $node->textContent . "\n";
        }

        // Save the data to a text file
        $filename = 'data.txt';
        file_put_contents($filename, $extractedData);

        echo "Data successfully extracted and saved to <a href='$filename' download>data.txt</a>.";
    } else {
        echo "No data found based on the specified pattern or tag.";
    } 
}
?>



