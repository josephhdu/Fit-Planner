document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded and parsed');

    window.addEventListener('popstate', function(event) {
        history.pushState(null, null, location.href);
    });

    window.history.pushState(null, null, location.href);

    const splash = document.querySelector('.splash');
    const mainContent = document.getElementById('main-content');
    const getStartedBtn = document.querySelector('.get-started-btn');
    const loadingScreen = document.getElementById('loader3');

    if (splash) {
        console.log('Splash screen found');
        setTimeout(() => {
            if (splash) {
                splash.style.opacity = '0';
                console.log('Splash screen opacity set to 0');
            }
        }, 3000); // Display splash screen for 3 seconds

        splash.addEventListener('transitionend', () => {
            if (splash) {
                splash.classList.add('display-none');
                console.log('Splash screen hidden');
            }
            if (mainContent) {
                mainContent.classList.remove('hidden');
                mainContent.style.display = 'block'; // Ensure main content is displayed
                console.log('Main content displayed');
            }
        });
    } else {
        console.error('Splash element not found');
    }

    if (getStartedBtn) {
        getStartedBtn.addEventListener('click', showPreferencesForm);
        console.log('Get Started button event listener added');
    } else {
        console.error('Get Started button not found');
    }

    const steps = Array.from(document.querySelectorAll('.form-step'));
    const nextButtons = document.querySelectorAll('.btn-next');
    const prevButtons = document.querySelectorAll('.btn-prev');
    const progress = document.getElementById('progress');
    const progressSteps = document.querySelectorAll('.progress-step');
    const toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    document.body.appendChild(toastContainer);

    let currentStep = 0;

    nextButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (!validateStep(currentStep)) {
                showToast('Please fill out all necessary fields before proceeding.');
                return;
            }
            steps[currentStep].classList.remove('form-step-active');
            currentStep++;
            steps[currentStep].classList.add('form-step-active');
            updateProgress();
        });
    });

    prevButtons.forEach(button => {
        button.addEventListener('click', () => {
            steps[currentStep].classList.remove('form-step-active');
            currentStep--;
            steps[currentStep].classList.add('form-step-active');
            updateProgress();
        });
    });

    function validateStep(step) {
        const currentFormStep = steps[step];
        const checkboxes = currentFormStep.querySelectorAll('input[type="checkbox"]');
        const numberInputs = currentFormStep.querySelectorAll('input[type="number"]');
        const textInputs = currentFormStep.querySelectorAll('textarea, input[type="text"]');
        const selectInputs = currentFormStep.querySelectorAll('select');

        let checkboxChecked = false;
        let numberInputFilled = false;
        let allTextInputsFilled = true; // Change to check if all text inputs are filled
        let selectInputFilled = false;

        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                checkboxChecked = true;
            }
        });

        numberInputs.forEach(input => {
            if (input.value && !isNaN(input.value) && input.value > 0) {
                numberInputFilled = true;
            }
        });

        textInputs.forEach(input => {
            if (input.value.trim() === '') {
                allTextInputsFilled = false;
            }
        });

        selectInputs.forEach(select => {
            if (select.value) {
                selectInputFilled = true;
            }
        });

        console.log(`Step ${step} validation:`);
        console.log(`checkboxChecked: ${checkboxChecked}`);
        console.log(`numberInputFilled: ${numberInputFilled}`);
        console.log(`allTextInputsFilled: ${allTextInputsFilled}`);
        console.log(`selectInputFilled: ${selectInputFilled}`);

        if (step === 0) {
            return checkboxChecked;
        } else if (step === 1) {
            return numberInputFilled && checkboxChecked;
        } else if (step === 2) {
            return selectInputFilled && checkboxChecked;
        } else if (step === 3) {
            return checkboxChecked && allTextInputsFilled; // All text inputs must be filled
        } else {
            return checkboxChecked || allTextInputsFilled || selectInputFilled;
        }
    }

    function showToast(message, duration = 5000) {
        let box = document.createElement('div');
        box.classList.add('toast', 'toast-warning');
        box.innerHTML = `
            <div class="toast-content-wrapper">
                <div class="toast-message">${message}</div>
                <div class="toast-progress"></div>
            </div>
        `;
        duration = duration || 5000;
        box.querySelector('.toast-progress').style.animationDuration = `${duration / 1000}s`;

        let toastAlready = document.body.querySelector('.toast');
        if (toastAlready) {
            toastAlready.remove();
        }

        document.body.appendChild(box);
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
        progress.style.width = ((activeSteps.length - 1) / (progressSteps.length - 1)) * 100 + '%';
    }

    // Add event listener for form submission
    const preferencesForm = document.getElementById('preferences-form');
    if (preferencesForm) {
        preferencesForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            console.log('Preferences form submitted');

            if (!validateStep(currentStep)) {
                showToast('Please fill out all necessary fields before proceeding.');
                return;
            }

            // Show loading screen and disable scrolling
            if (loadingScreen) {
                loadingScreen.style.visibility = 'visible'; // Updated this line
                document.body.classList.add('no-scroll');
            }

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

            console.log('Form data:', formObj);

            try {
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

                // Store the generated workout in localStorage
                localStorage.setItem('generatedWorkout', data.generated_text);

                // Hide loading screen, enable scrolling, and redirect to new page
                loadingScreen.style.visibility = 'hidden'; // Updated this line
                document.body.classList.remove('no-scroll');
                window.location.href = '/workout-plan/';
            } catch (error) {
                console.error('Error:', error);
                showToast('An error occurred. Please try again.');

                // Hide loading screen and enable scrolling
                if (loadingScreen) {
                    loadingScreen.style.visibility = 'hidden'; // Updated this line
                    document.body.classList.remove('no-scroll');
                }
            }
        });
    } else {
        console.error('Preferences form not found');
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

function showPreferencesForm() {
    window.location.href = '/preferences/';
    console.log('Redirecting to preferences form');
}
