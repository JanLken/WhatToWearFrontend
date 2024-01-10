<template>
  <div class="container">
    <h1 class="text-center">Clothes List</h1>
    <table class="table table-striped">
      <thead>
        <th>Clothes ID</th>
        <th>Clothes Category</th>
        <th>Clothes minTemp</th>
        <th>Clothes maxTemp</th>
      </thead>
      <tbody>
        <tr v-for="clothes in clothes" :key="clothes.id">
          <td>{{ clothes.id }}</td>
          <td>{{ clothes.category }}</td>
          <td>{{ clothes.minTemp }}</td>
          <td>{{ clothes.maxTemp }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
// Clothes.vue

import ClothesService from "../services/ClothesService";

export default {
  name: "ClothesShow",
  data: function () {
    return {
      clothes: [],
    };
  },
  methods: {
    getClothes() {
      ClothesService.getClothes()
        .then((response) => {
          console.log(response.data);
          this.clothes = response.data;
        })
        .catch((error) => {
          console.error("Error fetching clothes:", error);
        });
    },
  },
  created() {
    this.getClothes();
  },
};
</script>
