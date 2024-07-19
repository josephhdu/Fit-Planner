from django.shortcuts import render
import requests
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from huggingface_hub import InferenceClient
import json
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# View to render the index page
def index(request):
    return render(request, 'workouts/index.html')

# View to render the preferences page
def preferences(request):
    return render(request, 'workouts/preferences.html')

def workout_plan(request):
    return render(request, 'workouts/workout_plan.html')

# Initialize InferenceClient
repo_id = "microsoft/Phi-3-mini-4k-instruct"
hf_token = settings.HUGGING_FACE_API_KEY
llm_client = InferenceClient(model=repo_id, token=hf_token, timeout=300)

# Function to call the language model
def call_llm(inference_client: InferenceClient, prompt: str, max_length=200):
    response = inference_client.post(
        json={
            "inputs": prompt,
            "parameters": {"max_new_tokens": max_length},
            "task": "text-generation",
        },
    )
    return json.loads(response.decode())[0]["generated_text"]

# Django view to handle the API call
@csrf_exempt
def generate_workout(request):
    if request.method == 'POST':
        input_data = json.loads(request.body)
        user_schedule = input_data.get("schedule", ["Monday", "Wednesday", "Friday"])
        workout_duration = input_data.get("workout_duration", "45 minutes")
        workout_areas = input_data.get("workout_areas", ["chest", "triceps", "legs"])
        fitness_level = input_data.get("fitness_level", "intermediate")
        fitness_goals = input_data.get("fitness_goals", ["muscle gain", "fat loss"])
        equipment = input_data.get("equipment", ["dumbbells", "resistance bands", "pull-up bar"])
        injuries = input_data.get("injuries", "none")
        exercise_preferences = input_data.get("exercise_preferences", "none")
        
        logger.info(f"User Schedule: {user_schedule}")
        logger.info(f"workout_duration: {workout_duration}")
        logger.info(f"Workout Areas: {workout_areas}")
        logger.info(f"Fitness level: {fitness_level}")
        logger.info(f"Fitness Goals: {fitness_goals}")
        logger.info(f"Equipment: {equipment}")
        logger.info(f"ingjuries: {injuries}")
        logger.info(f"exercise_preferences: {exercise_preferences}")

        prompt = (
            f"Generate a personalized workout routine based on the following preferences:\n"
            f"1. Schedule: {', '.join(user_schedule)}\n"
            f"2. Workout Duration: {workout_duration}\n"
            f"3. Preferred Workout Areas: {', '.join(workout_areas)}\n"
            f"4. Fitness Level: {fitness_level}\n"
            f"5. Fitness Goals: {', '.join(fitness_goals)}\n"
            f"6. Available Equipment: {', '.join(equipment)}\n"
            f"7. Injuries or Limitations: {injuries}\n"
            f"8. Exercise Preferences: {exercise_preferences}\n\n"
            f"Please structure the response as follows:\n"
            f"1. Weekly Schedule: List the days and corresponding workouts.\n"
            f"2. Detailed Workouts: For each workout, include:\n"
            f"    a. Warm-up exercises\n"
            f"    b. Main exercises (with sets and reps)\n"
            f"    c. Cool-down exercises\n"
            f"3. Equipment Usage: Specify how the available equipment will be used.\n"
            f"4. Additional Tips: Provide tips based on fitness level and goals.\n\n"
            f"Limit the response to 150 words."
        )

        # First API call
        generated_text = call_llm(llm_client, prompt)

        # Prepare second prompt using the last part of the first response
        continuation_prompt = "Keep going from here:\n" + generated_text[-100:]

        # Second API call
        generated_text_continued = call_llm(llm_client, continuation_prompt)

        # Combine both parts
        full_generated_text = generated_text + generated_text_continued
        
        # Log the generated text
        logger.info(f"Generated workout: {full_generated_text}")

        return JsonResponse({'generated_text': full_generated_text})
    return JsonResponse({"error": "Invalid request"}, status=400)
