import requests

def get_coordinates_from_address(address):
    base_url = "https://nominatim.openstreetmap.org/search"
    params = {
        "q": address,
        "format": "json",
        "limit": 1  # Get only the first result
    }

    response = requests.get(base_url, params=params)
    if response.status_code == 200 and response.json():
        data = response.json()[0]  # Get the first matching result
        return {
            "latitude": data["lat"],
            "longitude": data["lon"]
        }
    return None  # Return None if no results are found