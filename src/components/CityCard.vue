<template>
  <div
    class="flex flex-col items-center  md:flex-row py-6 px-3 bg-slate-950 rounded-md shadow-md cursor-pointer w-3/4 md:w-1/3 text-white mb-1"
  >
    <div class="flex flex-col flex-1">
      <h2 class="text-3xl">{{ city.city }}</h2>
      <h3>{{ city.state }}</h3>
    </div>

    <div class="flex flex-col gap-2">
      <p class="text-3xl self-start md:self-end">
        {{ Math.round(city.weather.main.temp) }}&deg;
      </p>
      <div class="flex gap-2">
        <span class="text-xs">
          H: {{ Math.round(city.weather.main.temp_max) }}&deg;
          L: {{ Math.round(city.weather.main.temp_min) }}&deg;
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from "vue";

defineProps({
  city: {
    type: Object,
    default: () => {},
  },
});
</script>
