document.addEventListener("DOMContentLoaded", function() {
    const fetchUrl = "https://2315110.linux.studentwebserver.co.uk/getPostcodes.php";
    const addUrl = "https://2315110.linux.studentwebserver.co.uk/addPostcode.php";
    const loginUrl = "https://2315110.linux.studentwebserver.co.uk/login.php";
    const postcodeForm = document.getElementById('postcodeForm');
    const loginForm = document.getElementById('loginForm');
    const messageDiv = document.getElementById('message');
    const loginMessageDiv = document.getElementById('loginMessage');
    const loginSection = document.getElementById('loginSection');
    const postcodeSection = document.getElementById('postcodeSection');

    // Function to fetch postcode data
    async function fetchAllPostCodes() {
        try {
            const response = await fetch(fetchUrl);
            if (!response.ok) {
                throw new Error('Bad Network ' + response.statusText);
            }
            const data = await response.json();
            displayPostcodes(data);
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    }

    // Function to display postcode data
    function displayPostcodes(data) {
        const postcodeList = document.getElementById('postcodeList');
        postcodeList.innerHTML = ''; 

        data.forEach(item => {
            const listItem = document.createElement('li');
            listItem.textContent = `Postcode: ${item.postcode}, Postcode ID: ${item.postcodeID}`;
            postcodeList.appendChild(listItem);
        });
    }

    // Function to handle form submission
    postcodeForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const postcode = document.getElementById('postcode').value;

        if (!isValidPostcode(postcode)) {
            messageDiv.textContent = 'Invalid postcode format.';
            return;
        }

        try {
            const response = await fetch(addUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ postcode })
            });

            const result = await response.json();

            if (result.success) {
                messageDiv.textContent = 'Postcode added successfully!';
                fetchAllPostCodes(); // Refresh the list
            } else {
                messageDiv.textContent = `Error: ${result.message}`;
            }
        } catch (error) {
            messageDiv.textContent = 'An error occurred while adding the postcode.';
        }
    });

    // Function to handle login form submission
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
    
        try {
            const response = await fetch(loginUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });
    
            const result = await response.json();
    
            if (result.success) {
                loginMessageDiv.textContent = 'Login successful!';
                loginSection.style.display = 'none';
                postcodeSection.style.display = 'block';
            } else {
                loginMessageDiv.textContent = `Error: ${result.message}`;
            }
        } catch (error) {
            loginMessageDiv.textContent = 'An error occurred during login.';
        }
    });
    

    // Basic postcode validation (example pattern, adjust as needed)
    function isValidPostcode(postcode) {
        const postcodePattern = /^[A-Za-z0-9]{3,10}$/;
        return postcodePattern.test(postcode);
    }

    fetchAllPostCodes();
});
