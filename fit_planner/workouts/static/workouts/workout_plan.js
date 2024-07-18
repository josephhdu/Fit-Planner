document.addEventListener('DOMContentLoaded', function() {
    console.log('workout-plan page loaded');

    // Retrieve the generated workout from localStorage
    const generatedWorkout = localStorage.getItem('generatedWorkout');
    if (generatedWorkout) {
        console.log('Retrieved generated workout:', generatedWorkout);

        // Display the generated workout on the page
        const responseElement = document.getElementById('response');
        if (responseElement) {
            responseElement.innerText = generatedWorkout;
            console.log('Response displayed');
        }
    } else {
        console.error('No generated workout found in localStorage');
        const responseElement = document.getElementById('response');
        if (responseElement) {
            responseElement.innerText = 'No workout plan available. Please go back and submit your preferences.';
        }
    }
});
