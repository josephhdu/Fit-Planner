document.addEventListener('DOMContentLoaded', function() {
    const splash = document.querySelector('.splash');

    setTimeout(() => {
        splash.style.opacity = '0';
    }, 3000); // Display splash screen for 3 seconds

    splash.addEventListener('transitionend', () => {
        splash.classList.add('display-none');
        document.getElementById("main-content").classList.remove("hidden");
    });
});

function showPreferencesForm() {
    window.location.href = '/preferences/'; // Navigate to the new page
}

// Function to get the CSRF token from cookies
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// Add event listener for form submission
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('preferences-form').addEventListener('submit', async function(e) {
        e.preventDefault();

        const formData = new FormData(this);
        const formObj = {};

        formData.forEach((value, key) => {
            if (!formObj[key]) {
                formObj[key] = value;
            } else if (Array.isArray(formObj[key])) {
                formObj[key].push(value);
            } else {
                formObj[key] = [formObj[key], value];
            }
        });

        const response = await fetch('/generate-workout/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')  // Ensure CSRF token is sent with the request
            },
            body: JSON.stringify(formObj)
        });

        const data = await response.json();
        console.log('Generated Workout Routine:', data.generated_text);
        document.getElementById('response').innerText = data.generated_text;
    });
});
