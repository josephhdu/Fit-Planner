document.addEventListener('DOMContentLoaded', function() {
    console.log('workout-plan page loaded');

    const responseDiv = document.getElementById('output');
    const overviewDiv = document.getElementById('workout-overview');
    const popupOverlay = document.getElementById('popup-overlay');
    const popupContent = document.getElementById('popup-content');
    const popupClose = document.getElementById('popup-close');

    // Hide the popup initially
    popupOverlay.style.display = 'none';

    const generatedWorkout = JSON.parse(localStorage.getItem('generatedWorkout'));

    if (generatedWorkout) {
        console.log('Retrieved generated workout:', generatedWorkout);

        // Display the workout overview
        displayWorkoutOverview(generatedWorkout.preferences);

        // Display the generated workout plan
        displayWorkoutPlan(generatedWorkout.workout_schedule);
    } else {
        responseDiv.innerHTML = '<p>No workout plan generated. Please go back and fill out the preferences form.</p>';
    }

    // Close popup when the close button is clicked
    popupClose.addEventListener('click', () => {
        popupOverlay.style.display = 'none';
    });

    // Close popup when clicking outside of the popup content
    popupOverlay.addEventListener('click', (event) => {
        if (event.target === popupOverlay) {
            popupOverlay.style.display = 'none';
        }
    });
});

function displayWorkoutOverview(preferences) {
    const overviewDiv = document.getElementById('workout-overview');
    overviewDiv.innerHTML = ''; // Clear any existing content

    // Workout Title
    const title = document.createElement('h1');
    title.textContent = 'Workout Schedule';
    overviewDiv.appendChild(title);

    // Workout Details
    const details = document.createElement('p');
    const scheduleLength = Array.isArray(preferences.schedule) ? preferences.schedule.length : 1;
    details.textContent = `${scheduleLength} days per week - ${preferences.workout_duration} minutes per session`;
    overviewDiv.appendChild(details);

    // Tags for Workout Areas
    const tagsDiv = document.createElement('div');
    tagsDiv.classList.add('tags');
    const workoutAreas = Array.isArray(preferences.workout_areas) ? preferences.workout_areas : [preferences.workout_areas];
    workoutAreas.forEach(area => {
        const tag = document.createElement('span');
        tag.textContent = area;
        tagsDiv.appendChild(tag);
    });
    overviewDiv.appendChild(tagsDiv);

    // Preferences
    const preferencesDiv = document.createElement('div');
    preferencesDiv.classList.add('preferences');

    const experienceButton = document.createElement('button');
    experienceButton.textContent = `Experience: ${preferences.fitness_level}`;
    preferencesDiv.appendChild(experienceButton);

    const equipment = Array.isArray(preferences.equipment) ? preferences.equipment : [preferences.equipment];
    const equipmentButton = document.createElement('button');
    equipmentButton.textContent = `Equipment: ${equipment.join(', ')}`;
    preferencesDiv.appendChild(equipmentButton);

    const goal = Array.isArray(preferences.fitness_goals) ? preferences.fitness_goals : [preferences.fitness_goals];
    const goalButton = document.createElement('button');
    goalButton.textContent = `Goal: ${goal.join(', ')}`;
    preferencesDiv.appendChild(goalButton);

    const genderButton = document.createElement('button');
    genderButton.textContent = `Target Gender: ${preferences.gender}`;
    preferencesDiv.appendChild(genderButton);

    overviewDiv.appendChild(preferencesDiv);
}

function displayWorkoutPlan(workoutPlan) {
    const responseDiv = document.getElementById('output');
    responseDiv.innerHTML = ''; // Clear any existing content

    workoutPlan.forEach(day => {
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('day');

        const dayTitle = document.createElement('h2');
        dayTitle.textContent = `${day.day}`;
        dayDiv.appendChild(dayTitle);

        day.exercises.forEach(exercise => {
            const exerciseDiv = document.createElement('div');
            exerciseDiv.classList.add('exercise');
            exerciseDiv.tabIndex = 0; // Make it focusable
            exerciseDiv.addEventListener('click', () => {
                openPopup(exercise);
            });

            // const exerciseImg = document.createElement('img');
            // exerciseImg.src = exercise.image; // Assuming your JSON includes image URLs
            // exerciseImg.alt = exercise.exercise;
            // exerciseDiv.appendChild(exerciseImg);

            // Image placeholder, you can add the logic to get the actual image
            const exerciseImg = document.createElement('img');
            exerciseImg.src = 'https://via.placeholder.com/150'; // Placeholder image URL
            exerciseImg.alt = exercise.exercise;
            exerciseDiv.appendChild(exerciseImg);

            const exerciseDetails = document.createElement('div');
            exerciseDetails.classList.add('details');

            const exerciseName = document.createElement('p');
            exerciseName.innerHTML = `<strong>${exercise.exercise}</strong>`;
            exerciseDetails.appendChild(exerciseName);

            if (exercise.sets !== 'N/A' && exercise.reps !== 'N/A') {
                const exerciseSetsReps = document.createElement('p');
                exerciseSetsReps.textContent = `Sets: ${exercise.sets}, Reps: ${exercise.reps}`;
                exerciseDetails.appendChild(exerciseSetsReps);
            } else if (exercise.duration !== 'N/A') {
                const exerciseDuration = document.createElement('p');
                exerciseDuration.textContent = `Duration: ${exercise.duration}`;
                exerciseDetails.appendChild(exerciseDuration);
            } else {
                const exerciseSetsReps = document.createElement('p');
                exerciseSetsReps.textContent = `Sets: ${exercise.sets}, Reps: ${exercise.reps}, Duration: ${exercise.duration}`;
                exerciseDetails.appendChild(exerciseSetsReps);
            }

            exerciseDiv.appendChild(exerciseDetails);
            dayDiv.appendChild(exerciseDiv);
        });

        responseDiv.appendChild(dayDiv);
    });
}

function openPopup(exercise) {
    const popupOverlay = document.getElementById('popup-overlay');
    const popupContent = document.getElementById('popup-content');

    popupContent.innerHTML = ''; // Clear existing content

    // Image
    const exerciseImg = document.createElement('img');
    exerciseImg.src = exercise.image;
    exerciseImg.alt = exercise.exercise;
    popupContent.appendChild(exerciseImg);

    // Name
    const exerciseName = document.createElement('h3');
    exerciseName.textContent = exercise.exercise;
    popupContent.appendChild(exerciseName);

    // Details
    if (exercise.sets !== 'N/A' && exercise.reps !== 'N/A') {
        const exerciseSetsReps = document.createElement('p');
        exerciseSetsReps.textContent = `Sets: ${exercise.sets}, Reps: ${exercise.reps}`;
        popupContent.appendChild(exerciseSetsReps);
    } else if (exercise.duration !== 'N/A') {
        const exerciseDuration = document.createElement('p');
        exerciseDuration.textContent = `Duration: ${exercise.duration}`;
        popupContent.appendChild(exerciseDuration);
    }

    // popupOverlay.style.display = 'block'; // Show the popup
    popupOverlay.style.display = 'flex';
}