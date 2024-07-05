from django.shortcuts import render
import requests
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from huggingface_hub import InferenceClient
import json

from django.shortcuts import render
import requests
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from huggingface_hub import InferenceClient
import json

# Initialize InferenceClient once at the module level
repo_id = "microsoft/Phi-3-mini-4k-instruct"
llm_client = InferenceClient(model=repo_id, timeout=120)

# Function to call the language model
def call_llm(inference_client: InferenceClient, prompt: str):
    response = inference_client.post(
        json={
            "inputs": prompt,
            "parameters": {"max_new_tokens": 200},
            "task": "text-generation",
        },
    )
    return json.loads(response.decode())[0]["generated_text"]

# View to render the index page
def index(request):
    return render(request, 'workouts/index.html')

# View to handle the LLM API call
@csrf_exempt
def generate_text(request):
    if request.method == 'POST':
        input_text = request.POST.get('input_text', '')
        generated_text = call_llm(llm_client, input_text)
        return JsonResponse({'generated_text': generated_text})
    return JsonResponse({"error": "Invalid request"}, status=400)