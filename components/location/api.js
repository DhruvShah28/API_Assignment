const apiKey = process.env.PLACESKEY;

const getPlaces = async (query) => {
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();
    const limitedData = data.results.slice(0, 10);

    return limitedData;
};

const getAttractions = async (query) => {
    const places = await getPlaces(query);

    return places.map(place => ({
        id:place.place_id,
        name: place.name,
        address: place.formatted_address,
        lat: place.geometry.location.lat,
        lng: place.geometry.location.lng,
        photo: place.photos ? 
            `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${apiKey}` 
            : null
    }));
};

module.exports = { getPlaces, getAttractions };
