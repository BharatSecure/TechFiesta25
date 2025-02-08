import requests

def get_coordinates_geoapify(address):
    api_key = "YOUR_GEOAPIFY_API_KEY"  # Replace with your API key
    base_url = "https://api.geoapify.com/v1/geocode/search"
    
    params = {
        "text": address,
        "format": "json",
        "apiKey": api_key
    }

    response = requests.get(base_url, params=params)

    if response.status_code == 200:
        data = response.json()
        if data["features"]:
            location = data["features"][0]["geometry"]["coordinates"]
            return {"latitude": location[1], "longitude": location[0]}
    
    print(f"Error: {response.status_code}, {response.text}")
    return None

# Test the function
print(get_coordinates_geoapify("Ganesh Chowk, Kandivali West, Mumbai"))
