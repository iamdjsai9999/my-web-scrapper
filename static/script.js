// static/script.js

function scrape() {
    const url = document.getElementById('urlInput').value;

    // Show a loading message
    document.getElementById('result').innerHTML = '<p>Loading...</p>';

    // Perform the scrape
    fetch('/scrape', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ 'url': url }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            document.getElementById('result').innerHTML = `<p>Error: ${data.error}</p>`;
        } else {
            document.getElementById('result').innerHTML = `<p>${data.message}</p>`;
            if (data.links) {
                // Display the scraped links
                document.getElementById('result').innerHTML += '<p>Scraped Links:</p><ul>';
                data.links.forEach(link => {
                    document.getElementById('result').innerHTML += `<li>${link}</li>`;
                });
                document.getElementById('result').innerHTML += '</ul>';

                // Display the total links count
                document.getElementById('totalCount').innerText = data.links.length;
                document.getElementById('resultSection').style.display = 'block';
            } else {
                // Hide the total links count if no links are present
                document.getElementById('resultSection').style.display = 'none';
            }

            // Enable the copy and download buttons
            document.getElementById('copyButton').disabled = false;
            document.getElementById('downloadButton').disabled = false;
        }
    })
    .catch(error => console.error('Error:', error));
}

function copyToClipboard() {
    const resultText = document.getElementById('result').innerText;
    
    // Create a temporary textarea element
    const textarea = document.createElement('textarea');
    textarea.value = resultText;
    document.body.appendChild(textarea);

    // Select the text in the textarea
    textarea.select();
    document.execCommand('copy');

    // Remove the textarea element
    document.body.removeChild(textarea);

    // Inform the user
    alert('Content copied to clipboard!');
}

function downloadLinks() {
    const resultText = document.getElementById('result').innerText;
    const blob = new Blob([resultText], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);

    // Create a temporary link element
    const link = document.createElement('a');
    link.href = url;
    link.download = 'scraped_links.txt';

    // Trigger the download
    link.click();

    // Release the object URL
    window.URL.revokeObjectURL(url);
}
