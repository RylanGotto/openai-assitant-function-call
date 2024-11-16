import requests

# Define API endpoints and headers
ZEN_QUOTES_API_URL = "https://zenquotes.io/api/quotes"
OPENAI_API_URL = "https://api.openai.com/v1/images/generations"
OPENAI_API_KEY = ""


# Fetch quotes from ZenQuotes
zen_quotes_response = requests.get(ZEN_QUOTES_API_URL)
quotes_data = zen_quotes_response.json()

# Select a quote (choosing the first one for simplicity)
quote = quotes_data[0]["q"]
author = quotes_data[0]["a"]
print(f'Selected Quote: "{quote}" — {author}')

# Create a prompt for ChatGPT to overlay the quote onto the image
prompt = (
    f"Overlay the following quote in a beautiful font that contrasts nicely with the image. "
    f"The quote must be centered on the image. "
    f"MUST BE ABLE TO HAVE WHITE TEXT OVER LAYNE ON THE LEFT SIDE OF THE IMAGE"
    f'Quote: "{quote}" — {author}'
)

# Prepare the payload for OpenAI API
payload = {"model": "dall-e-3", "prompt": prompt, "n": 1, "size": "1792x1024"}

# Send the request to OpenAI API
headers = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {OPENAI_API_KEY}",
}
openai_response = requests.post(OPENAI_API_URL, json=payload, headers=headers)

# Print the response from OpenAI API
if openai_response.status_code == 200:
    openai_data = openai_response.json()
    image_url = openai_data["data"][0]["url"]
    print("Generated Image URL:", openai_data["data"][0]["url"])
else:
    print("Error:", openai_response.status_code, openai_response.text)

# Download the image and save it as 'background.jpeg'
image_response = requests.get(image_url)
if image_response.status_code == 200:
    with open("background.jpeg", "wb") as file:
        file.write(image_response.content)
    print("Image downloaded as 'background.jpeg'")
else:
    print("Failed to download image.")
