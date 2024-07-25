import google.generativeai as genai
import re
import json
import requests


# Configure the API key
api_key = "AIzaSyD4tm7M06QqxMfGdXBXd92YN0ey2aQ_B78"
genai.configure(api_key=api_key)

#search API keys stuff
search_api_key = "AIzaSyDGhroIdnOwgZs3whnjetveoiKpWhr7IAA"
search_engine_ID = "a15a80858d20849b1"

# Initialize the model
model = genai.GenerativeModel(model_name="gemini-1.5-flash")

def get_exercise_image(exercise_name):
    url = f"https://www.googleapis.com/customsearch/v1?q={exercise_name}&searchType=image&key={search_api_key}&cx={search_engine_ID}"
    response = requests.get(url)
    data = response.json()
    if 'items' in data:
        return data['items'][0]['link']
    else:
        return None

def parse_workout_schedule(text):
    workout_schedule = []
    day_pattern = re.compile(r"- Day: (\w+)")
    exercise_start_pattern = re.compile(r"Main exercises:")
    exercise_pattern = re.compile(r"- (.*?), Sets: (.*?), Reps: (.*?), Duration: (.*)")

    days = text.split("- Day: ")[1:]
    for day in days:
        day_lines = day.strip().split("\n")
        day_name = day_lines[0].strip()
        exercises = []
        
        # Find the line with "Main exercises:"
        start_index = None
        for i, line in enumerate(day_lines):
            if exercise_start_pattern.search(line):
                start_index = i + 1
                break
        
        if start_index is not None:
            for line in day_lines[start_index:]:
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

    return json.dumps(workout_schedule, indent=2)

def generate_prompt(gender, age, schedule, target_areas, duration, fitness_level, goals, equipment):
    prompt = (
        "Generate a personalized workout routine based on the following preferences:\n\n"
        f"1. Gender: {gender}\n"
        f"2. Age: {age}\n"
        f"3. Preferred Schedule: {schedule}\n"
        f"4. Target Areas: {target_areas}\n"
        f"5. Preferred Duration: {duration}\n"
        f"6. Fitness Level: {fitness_level}\n"
        f"7. Fitness Goals: {goals}\n"
        f"8. Available Equipment: {equipment}\n\n"
        "Please structure the workout routine as follows, specifying the exercises for each day. "
        "For each exercise, specify the name, sets, reps, and duration. "
        "If the exercise is based on duration, specify 'N/A' for sets and reps."
        "If the exercise is based on sets and reps, specify 'N/A' for duration."
        "Please avoid adding any extra details and only add things that are asked. "
        "Do not use any markdown formatting in your response. Only use plain text.\n\n"
        "Example:\n"
        "- Day: Monday\n"
        "  - Main exercises:\n"
        "    - Bench Press, Sets: 4, Reps: 8-12, Duration: N/A\n"
        "    - Dumbbell Incline Press, Sets: 3, Reps: 10-15, Duration: N/A\n"
        "    - Dumbbell Flyes, Sets: 3, Reps: 12-15, Duration: N/A\n"
        "    - Triceps Pushdowns (resistance band), Sets: 3, Reps: 15-20, Duration: N/A\n"
        "    - Overhead Triceps Extension, Sets: 3, Reps: 12-15, Duration: N/A\n"
        "    - Treadmill, Sets: N/A, Reps: N/A, Duration: 20 minutes\n"
    )
    return prompt

if __name__ == "__main__":
    
    # # Example user input
    # user_input = {
    #     "gender": "Female",
    #     "age": 35,
    #     "schedule": "Monday, Tuesday, Thursday, Saturday",
    #     "target_areas": "Triceps, Biceps, Legs, Cardio, Back",
    #     "duration": "30 minutes",
    #     "fitness_level": "Intermediate",
    #     "goals": "Muscle gain",
    #     "equipment": "Dumbbells, resistance bands, bench, Treadmill"
    # }
    
    # prompt = generate_prompt(
    #     gender=user_input["gender"],
    #     age=user_input["age"],
    #     schedule=user_input["schedule"],
    #     target_areas=user_input["target_areas"],
    #     duration=user_input["duration"],
    #     fitness_level=user_input["fitness_level"],
    #     goals=user_input["goals"],
    #     equipment=user_input["equipment"]
    # )
    
    # response = model.generate_content(prompt)
    
    # # Extract the text content from the response
    # generated_text = response.text  
    # print("Generated Text:", generated_text)
    
    # parsed_response = parse_workout_schedule(generated_text)
    # print(parsed_response)
    
    exercises = ["Dumbbell Chest Press (on floor)", "Dumbbell Pullovers", "Triceps Extensions (Kettlebell)"]
    exercise_images = {}

    for exercise in exercises:
        image_url = get_exercise_image(exercise)
        exercise_images[exercise] = image_url
        print(f"{exercise}: {image_url}")

