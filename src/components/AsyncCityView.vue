<template>
  <div class="flex flex-col flex-1 items-center">
    <div
      v-if="route.query.preview=='true'"
      class="text-white p-4 bg-slate-700 w-full text-center"
    >
      <p>
        You are currently previewing this city click "+" icon to start tracking
        this city
      </p>
    </div>

    <!-- Weather Overview -->
    <div
      class="flex flex-col items-center text-white my-5 py-10 w-3/4 lg:w-1/4 rounded-lg bg-slate-950"
    >
      <h1 class="text-4xl mb-2">
        {{ route.params.city }}
      </h1>
      <p class="text-sm mb-12">
        {{
          new Date(weatherData.currentTime).toLocaleDateString("en-us", {
            weekday: "long",
            day: "2-digit",
            month: "long",
          })
        }}
        {{
          new Date(weatherData.currentTime).toLocaleTimeString("en-us", {
            timeStyle: "short",
          })
        }}
      </p>
      <p class="text-8xl mb-8">{{ Math.round(weatherData.main.temp) }} &deg;</p>
      <div class="text-center">
        <p>
          Feels Like
          {{ Math.round(weatherData.main.feels_like) }}&deg;
        </p>
        <p class="capitalize">{{ weatherData.weather[0].description }};</p>
        <img
          class="w-[150px] h-auto"
          :src="`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`"
          alt="WeatherImg"
        />
      </div>
    </div>
    <hr class="w-full border-black border" />

    <div class="max-w-screen-lg w-full py-12">
      <div class="mx-8 text-black">
        <h2 class="mb-4 text-xl">5-day Forecast Every 3 Hour</h2>
        <div class="flex gap-10 overflow-x-scroll">
          <div
            class="flex flex-col items-center gap-2 px-2"
            v-for="hourData in weatherData2.list"
            :key="hourData.id"
          >
            <div class="mb-2 text-center flex flex-col">
              <p>
                {{ getDay(hourData.dt) }}
              </p>
              {{ hourData.time }}
            </div>
            <img
              class="w-[150px] h-[50px] mb-2"
              :src="`http://openweathermap.org/img/wn/${hourData.weather[0].icon}@2x.png`"
              alt="WeatherImg"
            />
            <div class="flex flex-col gap-2 text-center">
              <p class="h-[48px] flex items-center">
                {{
                  hourData.weather[0].description.charAt(0).toUpperCase() +
                  hourData.weather[0].description.slice(1)
                }}
              </p>

              {{ Math.round(hourData.main.temp) }} &deg;
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import axios from "axios";

const route = useRoute();

//Get today Date and retrun Today String
const getDay = (dates) => {
  const date = new Date(dates * 1000);
  const today = new Date();

  if (date.toDateString() === today.toDateString()) {
    return "Today";
  } else {
    return date.toLocaleDateString("en-us", { weekday: "long" });
  }
};

/* Convert Time in 12 Hours Format */
const convertTo12HourFormat = (time) => {
  // Split the input time string into components
  let [hour, minute, second] = time.split(":");

  // Convert hour from string to number
  hour = parseInt(hour);

  // Determine AM or PM suffix
  let period = hour >= 12 ? "PM" : "AM";

  // Convert hour to 12-hour format
  hour = hour % 12 || 12;

  // Return formatted time string
  return `${hour.toString().padStart(2)} ${period}`;
};

const getWeatherData = async () => {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${route.query.lat}&lon=${route.query.lng}&appid=49054400b50ead54dea0229783bb51a2&units=imperial`
    );
    const response2 = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${route.query.lat}&lon=${route.query.lng}&appid=49054400b50ead54dea0229783bb51a2&units=imperial`
    );

    if (!response.data) {
      throw new Error("No data returned from API");
    }

    const weatherData = response.data;
    const weatherData2 = response2.data;

    // Calculate current date & time
    const localOffset = new Date().getTimezoneOffset() * 60000;
    const utc = weatherData.dt * 1000 + localOffset;
    weatherData.currentTime = utc + 1000 * weatherData.timezone;

    weatherData2.list.forEach((hour) => {
      let time = hour.dt_txt.split(" ");
      hour.time = convertTo12HourFormat(time[1]);
    });
    await new Promise((res) => setTimeout(res, 700));

    return [weatherData, weatherData2];
  } catch (error) {
    console.error("Unable to fetch data", error);
    if (error.response) {
      console.error("Error Response:", error.response.data);
    }
  }
};
let weatherData;
let weatherData2;

try {
  [weatherData, weatherData2] = await getWeatherData();
} catch (error) {
  console.error("Error fetching weather data:", error);
}

/* console.log(weatherData); */
console.log(weatherData2);
</script>
