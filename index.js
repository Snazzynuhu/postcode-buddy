document.addEventListener("DOMContentLoaded", function() {
    const fetchUrl = "https://2315110.linux.studentwebserver.co.uk/getPostcodes.php";
    const addUrl = "https://2315110.linux.studentwebserver.co.uk/addPostcode.php";
    const loginUrl = "https://2315110.linux.studentwebserver.co.uk/login.php";
    const editUrl = "https://2315110.linux.studentwebserver.co.uk/editPostcode.php";
    const deleteUrl = "https://2315110.linux.studentwebserver.co.uk/deletePostcode.php";
    const postcodeForm = document.getElementById('postcodeForm');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const messageDiv = document.getElementById('message');
    const loginMessageDiv = document.getElementById('loginMessage');
    const loginSection = document.getElementById('loginSection');
    const postcodeSection = document.getElementById('postcodeSection');
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const registerSection = document.getElementById('registerSection');
    const loginOverlay = document.getElementById('loginOverlay');
    const registerOverlay = document.getElementById('registerOverlay');
    const closeLoginOverlay = document.getElementById('closeLoginOverlay');
    const closeRegisterOverlay = document.getElementById('closeRegisterOverlay');
  
    loginBtn.addEventListener('click', () => {
        loginOverlay.style.display = 'flex';
      });
    
      registerBtn.addEventListener('click', () => {
        registerOverlay.style.display = 'flex';
      });
    
      loginOverlay.addEventListener('click', (e) => {
        if (e.target === loginOverlay) {
          loginOverlay.style.display = 'none';
        }
      });
    
      registerOverlay.addEventListener('click', (e) => {
        if (e.target === registerOverlay) {
          registerOverlay.style.display = 'none';
        }
      });

    let isLoggedIn = false;

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
            listItem.textContent = item.postcode;
            listItem.classList.add("postCodeItem");
            listItem.addEventListener("click", () => {
                window.location.href = `/postcodes.html?postcode=${item.postcode}`;
              });


            const editButton = document.createElement('button');
            editButton.classList.add('editBtn');
            editButton.textContent = 'Edit';
            editButton.onclick = () => editPostcode(item.postcodeID, item.postcode);

            const deleteButton = document.createElement('button');
            deleteButton.classList.add('deleteBtn');
            deleteButton.textContent = 'Delete';
            deleteButton.onclick = () => deletePostcode(item.postcodeID, item.postcode);

            if(isLoggedIn) {
                listItem.appendChild(editButton);
                listItem.appendChild(deleteButton);
            }

            postcodeList.appendChild(listItem);
        });
    }

    // Function to handle form submission
    postcodeForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const postcode = document.getElementById('postcode').value;

        if (!isValidPostcode(postcode)) {
            messageDiv.textContent = 'Invalid postcode.';
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
                fetchAllPostCodes(); 
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
                loginOverlay.style.display = 'none';
                isLoggedIn = true;
                fetchAllPostCodes();
            } else {
                loginMessageDiv.textContent = `Error: ${result.message}`;
            }
        } catch (error) {
            loginMessageDiv.textContent = 'An error occurred during login.';
        }
    });

    // Handles User registration

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('registerUsername').value;
        const password = document.getElementById('registerPassword').value;
    
        const response = await fetch('register.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
        });
    
        const result = await response.json();
        const registerMessage = document.getElementById('registerMessage');
        if (result.success) {
          registerMessage.textContent = 'Registration successful!';
          registerMessage.style.color = 'green';
          const registerButton = document.getElementById("registerButton");
          registerButton.style.display = 'none';
          const newLoginBtn = document.createElement('button');
          newLoginBtn.textContent = 'Click To Login';
          newLoginBtn.addEventListener('click', () => {
            loginSection.style.display = 'block';
            loginSection.classList.add('loginCentre');
            registerSection.style.display = 'none';
            // loginOverlay.style.display = 'block';
            // registerBtn.style.display = 'none';
            });
            registerForm.appendChild(newLoginBtn);

        } else {
          registerMessage.textContent = result.message;
          registerMessage.style.color = 'red';
        }
      });
    
     // Function to edit a postcode
     async function editPostcode(postcodeID, oldPostcode) {
        const newPostcode = prompt("Enter the new postcode:", oldPostcode);

        if (!newPostcode || !isValidPostcode(newPostcode)) {
            alert("Invalid postcode.");
            return;
        }

        try {
            const response = await fetch(editUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ postcodeID, newPostcode })
            });

            const result = await response.json();

            if (result.success) {
                alert('Postcode edited successfully!');
                fetchAllPostCodes(); 
            } else {
                alert(`Error: ${result.message}`);
            }
        } catch (error) {
            alert('An error occurred while editing the postcode.');
        }
    }

    // Function to delete a postcode
    async function deletePostcode(postcodeID, postcode) {
        if (!confirm(`Are you sure you want to delete this postcode (${postcode})?`)) {
            return;
        }

        try {
            const response = await fetch(deleteUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ postcodeID })
            });

            const result = await response.json();

            if (result.success) {
                alert('Postcode deleted successfully!');
                fetchAllPostCodes(); 
            } else {
                alert(`Error: ${result.message}`);
            }
        } catch (error) {
            alert('An error occurred while deleting the postcode.');
        }
    }

    // Validates Postcode:- Sourced from https://postcodes.io/
    async function isValidPostcode(postcode) {
        try {
            const response = await fetch(`https://api.postcodes.io/postcodes/${postcode}/validate`);
            const data = await response.json();
            return data.result;
        } catch (error) {
            console.error('Error validating postcode:', error);
            return false;
        }
    }
    

    fetchAllPostCodes();
});
