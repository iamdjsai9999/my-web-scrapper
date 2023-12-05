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
            // Display the scraped links
            document.getElementById('result').innerHTML = `<p>${data.message}</p>`;
            if (data.links) {
                // Display the scraped links
                document.getElementById('result').innerHTML += '<p>Scraped Links:</p><ul>';
                data.links.forEach(link => {
                    document.getElementById('result').innerHTML += `<li>${link}</li>`;
                });
                document.getElementById('result').innerHTML += '</ul>';

                // Remove duplicate lines from the result
                removeDuplicates();
                
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

function removeDuplicates() {
    const resultContainer = document.getElementById('result');
    const resultText = resultContainer.innerText;

    // Split the text into lines
    const lines = resultText.split('\n');

    // Remove duplicate lines
    const uniqueLines = Array.from(new Set(lines));

    // Join the unique lines back into a single string
    const uniqueText = uniqueLines.join('\n');

    // Update the result container with the unique text
    resultContainer.innerText = uniqueText;

    // Inform the user
    alert('Duplicate lines removed!');
}

// The rest of your existing code (copyToClipboard, downloadLinks) remains unchanged.
