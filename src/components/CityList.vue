<template>
  <div
    class="flex flex-wrap justify-center gap-4"
    v-for="city in saveCities"
    :key="city.id"
  >
    <CityCard :city="city" @click="goToCityView(city)" />

    <p v-if="saveCities.length < 0">
      No location Added. To start tracking a Location, search in the field above
    </p>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { ref } from "vue";
import axios from "axios";
import CityCard from "./CityCard.vue";

const saveCities = ref([]);
const router = useRouter();

const getCities = async () => {
  if (localStorage.getItem("saveCities")) {
    saveCities.value = JSON.parse(localStorage.getItem("saveCities"));

    const request = [];
    saveCities.value.forEach((city) => {
      request.push(
        axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${city.coords.lat}&lon=${city.coords.lng}&appid=49054400b50ead54dea0229783bb51a2&units=imperial`
        )
      );
    });

    const weatherData = await Promise.all(request);

    await new Promise((res) => setTimeout(res, 700));
    weatherData.forEach((value, index) => {
      saveCities.value[index].weather = value.data;
    });
  }
};
await getCities();

const goToCityView = (city) => {
  router.push({
    name: "cityView",
    params: {
      state: city.state,
      city: city.city,
    },
    query: {
      lat: city.coords.lat,
      lng: city.coords.lng,
      preview: city.coords.preview,
      id: city.id,
    },
  });
};
</script>
