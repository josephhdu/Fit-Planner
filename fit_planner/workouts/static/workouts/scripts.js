document.addEventListener('DOMContentLoaded', function() {
    const splash = document.querySelector('.splash');
    const mainContent = document.getElementById('main-content');

    if (splash) {
        setTimeout(() => {
            if (splash) {
                splash.style.opacity = '0';
            }
        }, 3000); // Display splash screen for 3 seconds

        splash.addEventListener('transitionend', () => {
            if (splash) {
                splash.classList.add('display-none');
            }
            if (mainContent) {
                mainContent.classList.remove('hidden');
            }
        });
    }

    const steps = Array.from(document.querySelectorAll('.form-step'));
    const nextButtons = document.querySelectorAll('.btn-next');
    const prevButtons = document.querySelectorAll('.btn-prev');
    const progress = document.getElementById('progress');
    const progressSteps = document.querySelectorAll('.progress-step');

    let currentStep = 0;

    if (nextButtons) {
        nextButtons.forEach(button => {
            button.addEventListener('click', () => {
                if (steps[currentStep]) {
                    steps[currentStep].classList.remove('form-step-active');
                }
                currentStep++;
                if (steps[currentStep]) {
                    steps[currentStep].classList.add('form-step-active');
                }
                updateProgress();
            });
        });
    }

    if (prevButtons) {
        prevButtons.forEach(button => {
            button.addEventListener('click', () => {
                if (steps[currentStep]) {
                    steps[currentStep].classList.remove('form-step-active');
                }
                currentStep--;
                if (steps[currentStep]) {
                    steps[currentStep].classList.add('form-step-active');
                }
                updateProgress();
            });
        });
    }

    function updateProgress() {
        progressSteps.forEach((step, index) => {
            if (index < currentStep + 1) {
                step.classList.add('progress-step-active');
            } else {
                step.classList.remove('progress-step-active');
            }
        });

        const activeSteps = document.querySelectorAll('.progress-step-active');
        if (progress) {
            progress.style.width = ((activeSteps.length - 1) / (progressSteps.length - 1)) * 100 + '%';
        }
    }

    // Add event listener for form submission
    const preferencesForm = document.getElementById('preferences-form');
    if (preferencesForm) {
        preferencesForm.addEventListener('submit', async function(e) {
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
            const responseElement = document.getElementById('response');
            if (responseElement) {
                responseElement.innerText = data.generated_text;
            }
        });
    }
});

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

// Define the showPreferencesForm function if needed
function showPreferencesForm() {
    window.location.href = '/preferences/';
}
