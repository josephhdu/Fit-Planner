from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
import google.generativeai as genai
import json
import logging
import re
import requests

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configure the Gemini API key
api_key = "AIzaSyD4tm7M06QqxMfGdXBXd92YN0ey2aQ_B78"
genai.configure(api_key=api_key)

# Initialize the model
model = genai.GenerativeModel(model_name="gemini-1.5-flash")

#search API keys stuff
search_api_key = "AIzaSyDGhroIdnOwgZs3whnjetveoiKpWhr7IAA"
search_engine_ID = "a15a80858d20849b1"

# View to render the index page
def index(request):
    return render(request, 'workouts/index.html')

# View to render the preferences page
def preferences(request):
    return render(request, 'workouts/preferences.html')

def workout_plan(request):
    return render(request, 'workouts/workout_plan.html')

# Function to call the language model
def call_llm(prompt: str):
    response = model.generate_content(prompt)
    generated_text = response.text
    return generated_text

def get_exercise_image(exercise_name):
    url = f"https://www.googleapis.com/customsearch/v1?q={exercise_name}&searchType=image&key={search_api_key}&cx={search_engine_ID}"
    response = requests.get(url)
    data = response.json()
    if 'items' in data:
        return data['items'][0]['link']
    else:
        return None

# Function to parse the workout schedule
def parse_workout_schedule(text):
    workout_schedule = []
    day_pattern = re.compile(r"- Day: (\w+)")
    exercise_pattern = re.compile(r"- (.*?), Sets: (.*?), Reps: (.*?), Duration: (.*)")

    days = text.split("- Day: ")[1:]
    for day in days:
        day_lines = day.strip().split("\n")
        day_name = day_lines[0].strip()
        exercises = []
        
        for line in day_lines[1:]:
            match = exercise_pattern.match(line.strip())
            if match:
                exercise_name = match.group(1).strip()
                sets = match.group(2).strip()
                reps = match.group(3).strip()
                duration = match.group(4).strip()
                exercises.append({
                    "exercise": exercise_name,
                    "sets": sets,
                    "reps": reps,
                    "duration": duration
                })

        workout_schedule.append({
            "day": day_name,
            "exercises": exercises
        })

    return workout_schedule

def parse_workout_schedule_images(text):
    workout_schedule = []
    day_pattern = re.compile(r"- Day: (\w+)")
    exercise_pattern = re.compile(r"- (.*?), Sets: (.*?), Reps: (.*?), Duration: (.*)")

    days = text.split("- Day: ")[1:]
    for day in days:
        day_lines = day.strip().split("\n")
        day_name = day_lines[0].strip()
        exercises = []
        
        for line in day_lines[1:]:
            match = exercise_pattern.match(line.strip())
            if match:
                exercise_name = match.group(1).strip()
                sets = match.group(2).strip()
                reps = match.group(3).strip()
                duration = match.group(4).strip()
                image_url = get_exercise_image(exercise_name)
                exercises.append({
                    "exercise": exercise_name,
                    "sets": sets,
                    "reps": reps,
                    "duration": duration,
                    "image": image_url
                })

        workout_schedule.append({
            "day": day_name,
            "exercises": exercises
        })

    return workout_schedule

@csrf_exempt
def generate_workout(request):
   if request.method == 'POST':
       input_data = json.loads(request.body)
       gender = input_data.get("gender", "Male")
       age = input_data.get("age", "25")
       schedule = input_data.get("schedule", ["Monday", "Wednesday", "Friday"])
       workout_areas = input_data.get("workout_areas", ["chest", "triceps", "legs"])
       workout_duration = input_data.get("workout_duration", "45 minutes")
       fitness_level = input_data.get("fitness_level", "intermediate")
       fitness_goals = input_data.get("fitness_goals", ["muscle gain", "fat loss"])
       equipment = input_data.get("equipment", ["dumbbells", "resistance bands", "pull-up bar"])
       
       #for some reason gender and fitness level aren't capital
       gender = gender.capitalize()
       fitness_level = fitness_level.capitalize()


       logger.info(f"User Schedule: {schedule}")
       logger.info(f"workout_duration: {workout_duration}")
       logger.info(f"Workout Areas: {workout_areas}")
       logger.info(f"Fitness level: {fitness_level}")
       logger.info(f"Fitness Goals: {fitness_goals}")
       logger.info(f"Equipment: {equipment}")


       prompt = (
           f"Generate a personalized workout routine based on the following preferences:\n"
           f"1. Gender: {gender}\n"
           f"2. Age: {age}\n"
           f"3. Preferred Schedule: {', '.join(schedule)}\n"
           f"4. Target Areas: {', '.join(workout_areas)}\n"
           f"5. Preferred Duration: {workout_duration}\n"
           f"6. Fitness Level: {fitness_level}\n"
           f"7. Fitness Goals: {', '.join(fitness_goals)}\n"
           f"8. Available Equipment: {', '.join(equipment)}\n\n"
           f"Please structure the workout routine as follows, specifying the exercises for each day. "
           f"For each exercise, specify the name, sets, reps, and duration. "
           f"If the exercise is based on duration, specify 'N/A' for sets and reps."
           f"If the exercise is based on sets and reps, specify 'N/A' for duration."
           f"Please avoid adding any extra details and only add things that are asked. "
           f"Do not use any markdown formatting in your response. Only use plain text.\n\n"
           f"Example:\n"
           f"- Day: Monday\n"
           f"  - Main exercises:\n"
           f"    - Bench Press, Sets: 4, Reps: 8-12, Duration: N/A\n"
           f"    - Dumbbell Incline Press, Sets: 3, Reps: 10-15, Duration: N/A\n"
           f"    - Dumbbell Flyes, Sets: 3, Reps: 12-15, Duration: N/A\n"
           f"    - Triceps Pushdowns (resistance band), Sets: 3, Reps: 15-20, Duration: N/A\n"
           f"    - Overhead Triceps Extension, Sets: 3, Reps: 12-15, Duration: N/A\n"
           f"    - Treadmill, Sets: N/A, Reps: N/A, Duration: 20 minutes\n"
       )


       generated_text = call_llm(prompt)
       #parsed_response = parse_workout_schedule(generated_text)
       parsed_response = parse_workout_schedule_images(generated_text)


       response_data = {
           "preferences": {
               "gender": gender,
               "age": age,
               "schedule": schedule,
               "workout_areas": workout_areas,
               "workout_duration": workout_duration,
               "fitness_level": fitness_level,
               "fitness_goals": fitness_goals,
               "equipment": equipment
           },
           "workout_schedule": parsed_response
       }


       logger.info(f"Generated workout: {json.dumps(response_data, indent=2)}")
       return JsonResponse(response_data)


   return JsonResponse({"error": "Invalid request"}, status=400)
