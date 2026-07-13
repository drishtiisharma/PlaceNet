import logging
logging.basicConfig(level=logging.INFO)

from app.ai.client import GroqProvider

def main():
    print("Initializing GroqProvider...")
    provider = GroqProvider(model_name="llama-3.3-70b-versatile")
    
    print("\nExecuting test chat completion...")
    try:
        response = provider.execute(
            messages=[{"role": "user", "content": "Say hello!"}]
        )
        print("Response:", response.choices[0].message.content)
    except Exception as e:
        print(f"Failed with exception: {e}")

if __name__ == "__main__":
    main()
