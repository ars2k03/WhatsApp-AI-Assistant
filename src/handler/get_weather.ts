import dotenv from 'dotenv';
dotenv.config();

export async function handleGetWeather(location: string) :  Promise<string> {
  try {
    const res = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=${encodeURIComponent(location)}&aqi=no`
    );

    const data = await res.json();

    if (data.error) {
      return `❌ "${location}" খুঁজে পাওয়া যায়নি।`;
    }

    return `
📍 ${data.location.name}, ${data.location.country}
🌦️ ${data.current.condition.text}
🌡️ তাপমাত্রা: ${data.current.temp_c}°C
🥵 অনুভূত তাপমাত্রা: ${data.current.feelslike_c}°C
💧 আর্দ্রতা: ${data.current.humidity}%
💨 বাতাস: ${data.current.wind_kph} km/h
🌧️ বৃষ্টির সম্ভাবনা: ${data.current.chance_of_rain}%
🕒 আপডেট: ${data.current.last_updated}
`
  } catch (e) {

    console.error("Weather error:", e);
    return 'আবহাওয়ার তথ্য আনতে সমস্যা হয়েছে।';

  }
}