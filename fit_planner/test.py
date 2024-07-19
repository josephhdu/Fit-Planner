import google.generativeai as genai


# Configure the API key
api_key = "AIzaSyD4tm7M06QqxMfGdXBXd92YN0ey2aQ_B78"
genai.configure(api_key=api_key)

# Initialize the model
model = genai.GenerativeModel(model_name="gemini-1.5-flash")



# Test the function with hard-coded continuation
if __name__ == "__main__":
    test_prompt = (
        "Generate a personalized workout routine based on the following preferences:\n"
        "1. Schedule: Monday, Wednesday, Friday\n"
        "2. Workout Duration: 45 minutes\n"
        "3. Preferred Workout Areas: chest, triceps, legs\n"
        "4. Fitness Level: intermediate\n"
        "5. Fitness Goals: muscle gain, fat loss\n"
        "6. Available Equipment: dumbbells, resistance bands, pull-up bar\n\n"
        "Please structure the response as follows:\n"
        "1. Weekly Schedule: List the days and corresponding workouts.\n"
        "2. Detailed Workouts: For each workout, include:\n"
        "    a. Warm-up exercises\n"
        "    b. Main exercises (with sets and reps)\n"
        "    c. Cool-down exercises\n"
        "3. Equipment Usage: Specify how the available equipment will be used.\n"
        "4. Additional Tips: Provide tips based on fitness level and goals.\n\n"
    )
    
    test_prompt2 = (
        "Generate a list of exercises specifically targeting the chest muscle group. Consider the following preferences:\n"
        "1. Workout Duration: 45 minutes\n"
        "2. Fitness Level: Intermediate\n"
        "3. Fitness Goals: Muscle gain\n"
        "4. Available Equipment: Dumbbells, resistance bands, bench\n\n"
        "Please provide the exercises in a structured format, including the name of each exercise, and the number of sets\n"
        "End the list with the word 'END'."
    )
    

    response = model.generate_content(test_prompt)
    print("Generated Text:", response.text)
