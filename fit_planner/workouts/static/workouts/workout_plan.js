document.addEventListener('DOMContentLoaded', function() {
    console.log('workout-plan page loaded');
 
 
    const responseDiv = document.getElementById('output');
    const overviewDiv = document.getElementById('workout-overview');
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
    details.textContent = `${preferences.schedule.length} days per week - ${preferences.workout_duration} minutes per session`;
    overviewDiv.appendChild(details);
 
 
    // Tags for Workout Areas
    const tagsDiv = document.createElement('div');
    tagsDiv.classList.add('tags');
    preferences.workout_areas.forEach(area => {
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
 
 
    const goalButton = document.createElement('button');
    goalButton.textContent = `Goal: ${preferences.fitness_goals}`;
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
 
 
            // Image placeholder, you can add the logic to get the actual image
            const exerciseImg = document.createElement('img');
            exerciseImg.src = 'https://via.placeholder.com/150'; // Placeholder image URL
            exerciseImg.alt = exercise.exercise;
            exerciseDiv.appendChild(exerciseImg);
 
 
            // const exerciseImg = document.createElement('img');
            // exerciseImg.src = exercise.image; // Assuming your JSON includes image URLs
            // exerciseImg.alt = exercise.exercise;
            // exerciseDiv.appendChild(exerciseImg);
 
 
            const exerciseDetails = document.createElement('div');
            exerciseDetails.classList.add('details');
 
 
            const exerciseName = document.createElement('p');
            exerciseName.innerHTML = `<strong>${exercise.exercise}</strong>`;
            exerciseDetails.appendChild(exerciseName);
 
 
            const exerciseSetsReps = document.createElement('p');
            exerciseSetsReps.textContent = `Sets: ${exercise.sets}, Reps: ${exercise.reps}, Duration: ${exercise.duration}`;
            exerciseDetails.appendChild(exerciseSetsReps);
 
 
            exerciseDiv.appendChild(exerciseDetails);
            dayDiv.appendChild(exerciseDiv);
        });
 
 
        responseDiv.appendChild(dayDiv);
    });
 }
 