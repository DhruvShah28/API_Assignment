const getWeather = async (lat, lon) => {
    const apiKey = process.env.WEATHERKEY;
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    const response = await fetch(url);
    const data = await response.json();

    // Check if the data has the expected structure
    if (!data.list || data.list.length === 0) {
        return { error: "No weather data found for the given location." };
    }

    const limitedData = [];
    for (let i = 0; i < 5; i++) {
        const index = i * 8; 
        if (data.list[index]) {
            let date = data.list[index].dt_txt.split(" ")[0]; 
            limitedData.push({ ...data.list[index], dateOnly: date }); 
        }
    }

    return limitedData;
};

module.exports = { getWeather };
