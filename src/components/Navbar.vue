<script setup>
import { RouterLink, useRoute, useRouter } from "vue-router";
import { uid } from "uid";
import BaseModal from "@/components/BaseModal.vue";
import { ref } from "vue";
import Swal from "sweetalert2";
import { useToast } from "vue-toastification";

const saveCities = ref([]);
const route = useRoute();
const router = useRouter();
const toast = useToast();
const addCity = () => {
  if (localStorage.getItem("saveCities")) {
    saveCities.value = JSON.parse(localStorage.getItem("saveCities"));
  }

  const locationObj = {
    id: uid(),
    state: route.params.state,
    city: route.params.city,
    coords: {
      lat: route.query.lat,
      lng: route.query.lng,
      preview: false,
    },
  };
  saveCities.value.push(locationObj);
  localStorage.setItem("saveCities", JSON.stringify(saveCities.value));

  toast.success("Successfully Added the City");

  let query = Object.assign({}, route.query);
  query.preview = false;
  query.id = locationObj.id;
  router.replace({ query });
};
const removeCity = () => {
  if (localStorage.getItem("saveCities")) {
    saveCities.value = JSON.parse(localStorage.getItem("saveCities"));
  }
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      let targetId = route.query.id;

      let id = saveCities.value.findIndex((element) => element.id === targetId);
      saveCities.value.splice(id, 1);
      localStorage.setItem("saveCities", JSON.stringify(saveCities.value));
      toast.success("Successfully Delete the City");
      router.push("/");
    }
  });
};

const showModal = ref(null);

const toggleModal = () => {
  showModal.value = !showModal.value;
};
</script>

<template>
  <nav
    class="bg-slate-800 py-5 flex flex-col md:flex-row justify-center items-center px-6 text-white"
  >
    <RouterLink to="/" class="text-lg font-medium">
      <div>
        <font-awesome-icon :icon="['fas', 'sun']" class="mr-1" /> The Local
        Weather
      </div>
    </RouterLink>
    <div class="flex gap-5 flex-1 justify-end">
      <font-awesome-icon
        @click="toggleModal"
        :icon="['fas', 'circle-info']"
        class="font-medium text-lg hover:text-green-400"
      />
      <font-awesome-icon
        :icon="['fas', 'plus']"
        class="cursor-pointer hover:text-green-400"
        @click="addCity"
        v-if="route.query.preview == 'true'"
      />
      <font-awesome-icon
        :icon="['fas', 'trash-can']"
        class="cursor-pointer hover:text-green-400"
        v-if="route.query.preview == 'false'"
        @click="removeCity"
      />
    </div>

    <BaseModal :showModal="showModal" @close-modal="toggleModal">
      <div class="text-black">
        <h1 class="text-2xl mb-1">About:</h1>
        <p class="mb-4">
          The Local Weather allows you to track the current and future weather
          of cities of your choosing.
        </p>
        <h2 class="text-2xl">How it works:</h2>
        <ol class="list-decimal list-inside mb-4">
          <li>
            Search for your city by entering the name into the search bar.
          </li>
          <li>
            Select a city within the results, this will take you to the current
            weather for your selection.
          </li>
          <li>
            Track the city by clicking on the "+" icon in the top right. This
            will save the city to view at a later time on the home page.
          </li>
        </ol>

        <h2 class="text-2xl">Removing a city</h2>
        <p>
          If you no longer wish to track a city, simply select the trash icon in
          the navbar
        </p>
      </div>
    </BaseModal>
  </nav>
</template>
