from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from huggingface_hub import InferenceClient

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Use your fine-grained token here
client = InferenceClient(api_key="hf_Tokken_Here")

@app.get("/")
def read_root():
    return {"status": "Chef is online!"}

@app.get("/recipe")
def get_recipe(ingredients: str):
    try:
        # Qwen 2.5 is currently very stable on the free serverless tier
        response = client.chat_completion(
            model="Qwen/Qwen2.5-7B-Instruct",
            messages=[{"role": "user", "content": f"Ingredients: {ingredients}. Give me 1 recipe name and 3 steps."}],
            max_tokens=200
        )
        return {"recipe": response.choices[0].message.content}
    except Exception as e:
        # If this still fails, we will try a different model name
        return {"recipe": f"Chef Error: {str(e)}"}