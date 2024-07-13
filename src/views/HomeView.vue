<template>
  <main class="text-black">
    <div class="py-3 flex justify-center flex-col items-center">
      <input
        @input="getSuggestions"
        v-model="searchQuery"
        type="text"
        placeholder="Enter a city or state"
        class="border-b py-2 px-1 w-1/3 text-center border-black focus:outline-none focus:placeholder-transparent relative"
      />
      <p v-if="noResult" class="w-1/3 mt-2">
        Sorry cant find any City or State
      </p>
      <ul v-if="searchResult.length" class="w-1/3 mt-2 absolute top-28 bg-slate-700 text-white">
        <li
          v-for="(result, index) in searchResult"
          :key="index"
          class="border border-black cursor-pointer  "
          @click="selectSuggestion(result)"
        >
          {{ result.formatted }}
        </li>
      </ul>
    </div>
    <div class="flex flex-col gap-4">
      <Suspense>
        <CityList />
        <template #fallback>
          <CityCardSkeleton v-for="city in saveCities" :key="city.id" />
        </template>
      </Suspense>
    </div>
  </main>
</template>

<script setup>
import { useRouter } from "vue-router";
import axios from "axios";
import { ref } from "vue";
import CityList from "@/components/CityList.vue";
import CityCardSkeleton from "@/components/CityCardSkeleton.vue";

const apiKey = "06e4ec34405c4841b2f376ec6b4d636a";
const searchQuery = ref("");
const queryTimeout = ref(null);
const searchResult = ref([]);
const noResult = ref(null);
const router = useRouter();
const saveCities = ref([]);

saveCities.value = JSON.parse(localStorage.getItem("saveCities"));

const getSuggestions = () => {
  clearTimeout(searchQuery.value);
  queryTimeout.value = setTimeout(async () => {
    if (searchQuery.value.length > 1) {
      let apiUrl = "https://api.opencagedata.com/geocode/v1/json";
      let requestUrl = `${apiUrl}?key=${apiKey}&q=${encodeURIComponent(
        searchQuery.value
      )}&pretty=1&no_annotations=1`;

      try {
        const response = await axios.get(requestUrl);
        searchResult.value = response.data.results.map((result) => {
          return {
            formatted: result.formatted,
            geometry: result.geometry,
          };
        });
        if (searchResult.value.length === 0) {
          noResult.value = true;
        } else {
          noResult.value = false;
        }
        console.log(searchResult.value);
      } catch (error) {
        console.log("Error to fetch data", error);
      }
      return;
    }
    searchResult.value = [];
  }, 300);
};

const selectSuggestion = (suggestion) => {
  console.log(suggestion);
  const [city, state] = suggestion.formatted.split(",");
  console.log(city, state);
  router.push({
    name: "cityView",
    params: {
      state: state.replaceAll(" ", ""),
      city: city.trim(),
    },
    query: {
      lat: suggestion.geometry.lat,
      lng: suggestion.geometry.lng,
      preview: true,
    },
  });
};
</script>
