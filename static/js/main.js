let apiKey = localStorage.getItem('apiKey');

// Modal işlemleri
const loginModal = document.getElementById('login-modal');
const registerModal = document.getElementById('register-modal');

document.getElementById('login-btn').addEventListener('click', () => {
    loginModal.style.display = 'block';
});

document.getElementById('register-btn').addEventListener('click', () => {
    registerModal.style.display = 'block';
});

// Modal dışına tıklandığında kapat
window.onclick = (event) => {
    if (event.target === loginModal) loginModal.style.display = 'none';
    if (event.target === registerModal) registerModal.style.display = 'none';
};

// Register form submit
document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    try {
        const response = await fetch('/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: formData.get('email'),
                username: formData.get('username'),
                password: formData.get('password')
            })
        });
        
        if (response.ok) {
            alert('Registration successful! Please login.');
            registerModal.style.display = 'none';
            loginModal.style.display = 'block';
        } else {
            const error = await response.json();
            alert(error.detail || 'Registration failed');
        }
    } catch (error) {
        console.error('Register error:', error);
        alert('Registration failed');
    }
});

// Login form submit
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    try {
        const response = await fetch('/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                'username': formData.get('username'),
                'password': formData.get('password')
            })
        });
        
        if (response.ok) {
            const data = await response.json();
            // Get API key using the token
            const apiKeyResponse = await fetch('/api-keys', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${data.access_token}`
                }
            });
            
            if (apiKeyResponse.ok) {
                const apiKeyData = await apiKeyResponse.json();
                apiKey = apiKeyData.api_key;
                localStorage.setItem('apiKey', apiKey);
                loginModal.style.display = 'none';
                loadJobs();
            }
        } else {
            alert('Login failed');
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('Login failed');
    }
});

async function loadJobs() {
    try {
        const response = await fetch('/jobs', {
            headers: {
                'X-API-Key': apiKey
            }
        });
        
        if (response.status === 401 || response.status === 403) {
            document.getElementById('auth-section').style.display = 'block';
            return;
        }

        const jobs = await response.json();
        const jobsList = document.getElementById('jobs-list');
        
        jobsList.innerHTML = jobs.map(job => `
            <div class="job-card">
                <h3>${job.job_title}</h3>
                <p>Company: ${job.company}</p>
                <a href="${job.link}" target="_blank">Apply Now</a>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading jobs:', error);
    }
}

// Load jobs when page loads
loadJobs(); 