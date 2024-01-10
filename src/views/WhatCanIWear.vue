<template>
  <div class="container">
    <h1>What Can I Wear?</h1>
    <input
      type="number"
      v-model.number="degreesOutside"
      placeholder="Degrees Outside"
    />
    <button @click="generateRandomOutfit" :disabled="!degreesOutside">
      Generate Outfit
    </button>
    <p v-if="showError" class="error">
      Please enter the Degrees before generating an Outfit
    </p>

    <div v-if="randomOutfit.length" class="outfit-table">
      <h2>Your Random Outfit:</h2>
      <table>
        <thead>
          <tr>
            <th>Category</th>
            <th>ID</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in randomOutfit" :key="item.id">
            <td>{{ item.category }}</td>
            <td>{{ item.id }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "WhatCanIWear",
  data() {
    return {
      clothes: [],
      randomOutfit: [],
      degreesOutside: null,
      showError: false,
    };
  },
  methods: {
    fetchClothes() {
      axios
        .get("http://localhost:8080/clothes")
        .then((response) => {
          this.clothes = response.data;
        })
        .catch((error) => {
          console.error("Error fetching clothes:", error);
        });
    },
    generateRandomOutfit() {
      if (this.degreesOutside === null) {
        this.showError = true;
        return;
      }
      this.showError = false;
      const categories = [
        ...new Set(this.clothes.map((item) => item.category)),
      ];
      this.randomOutfit = categories
        .map((category) => {
          const items = this.clothes.filter(
            (item) =>
              item.category === category &&
              item.minTemp <= this.degreesOutside &&
              item.maxTemp >= this.degreesOutside
          );
          return items.length
            ? items[Math.floor(Math.random() * items.length)]
            : null;
        })
        .filter((item) => item !== null);
    },
  },
  mounted() {
    this.fetchClothes();
  },
};
</script>

<style>
.container {
  text-align: center;
}
.outfit-table {
  margin: 0 auto;
  width: 50%;
  height: 50%;
}
.error {
  color: red;
}
</style>
