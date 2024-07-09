# test_llm.py
from huggingface_hub import InferenceClient
import json

# Initialize InferenceClient
repo_id = "microsoft/Phi-3-mini-4k-instruct"
hf_token = "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"
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

    # First API call
    generated_text = call_llm(llm_client, test_prompt)
    print("Generated Text Part 1:", generated_text)

    # Prepare second prompt including the initial instructions
    continuation_prompt = (
        "\nKeep going from here:\n"
    )

    # Second API call
    generated_text_continued = call_llm(llm_client, continuation_prompt)
    print("Generated Text Part 2:", generated_text_continued)

    # Combine both parts
    #full_generated_text = generated_text + generated_