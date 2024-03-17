function convertToJSON() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    if (file) {
        const reader = new FileReader();
        
        reader.onload = function(event) {
            const data = new Uint8Array(event.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            
            const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

            // Extract headers
            const headers = jsonData[0];
            // Remove the header row
            jsonData.shift();

            // Convert "Retail Price" and "Sale Price" to strings
            jsonData.forEach(item => {
                const retailPrice = item[3]; // Assuming "Retail Price" is the 4th column
                const salePrice = item[5]; // Assuming "Sale Price" is the 6th column
                if (typeof retailPrice === 'number') {
                    item[3] = retailPrice.toFixed(2); // Convert to string with 2 decimal places
                }
                if (typeof salePrice === 'number') {
                    item[5] = salePrice.toFixed(2); // Convert to string with 2 decimal places
                }
            });

            // Convert "Sale End" date to string
            jsonData.forEach(item => {
                const saleEnd = item[6]; // Assuming "Sale End" is the 7th column
                if (typeof saleEnd === 'number' && saleEnd >= 25569 && saleEnd < 2958466) {
                    // Convert Excel date to JavaScript Date object
                    const date = new Date((saleEnd - 25569) * 86400 * 1000);
                    // Format date as YYYY-MM-DD
                    const dateString = date.toISOString().split('T')[0];
                    // Replace the numeric value with the formatted date string
                    item[6] = dateString;
                }
            });

            // Convert array of arrays to array of objects with labeled properties
            const jsonDataWithLabels = jsonData.map(item => {
                const obj = {};
                headers.forEach((header, index) => {
                    obj[header] = item[index];
                });
                return obj;
            });

            // Convert JSON to string
            const jsonString = JSON.stringify(jsonDataWithLabels, null, 4);
            
            // Create a blob with the JSON data
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            // Create a link element to download the JSON file
            const link = document.createElement('a');
            link.href = url;
            link.download = 'converted_data.json';
            
            // Append the link to the body
            document.body.appendChild(link);
            
            // Programmatically click the link to trigger the download
            link.click();
            
            // Remove the link from the body
            document.body.removeChild(link);
        };

        reader.readAsArrayBuffer(file);
    } else {
        alert('Please select a file.');
    }
}
