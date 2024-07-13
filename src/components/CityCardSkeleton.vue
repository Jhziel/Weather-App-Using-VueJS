<template>
    
  <div class="flex flex-wrap justify-center gap-4">
      <div
        class="flex  flex-col items-center md:flex-row py-6 px-3 bg-slate-950 rounded-md shadow-md cursor-pointer w-1/3 text-white"
      >
        <div class="flex flex-col flex-1 gap-2">
          <AnimatedPlaceholder class="max-w-[50%]"/>
          <AnimatedPlaceholder class="max-w-[40%]"/>
        </div>
        <div class="flex flex-col items-end flex-1 gap-2">
             <AnimatedPlaceholder class="max-w-[50px]"/>
          <AnimatedPlaceholder class="max-w-[75px] w-full"/>
        </div>
      </div>
  </div>
</template>

<script setup>
import AnimatedPlaceholder from "./AnimatedPlaceholder.vue";
</script>
