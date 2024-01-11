<template>
  <div>
    <button @click="goToMenu" class="back-button">Back to Menu</button>
  </div>
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
    <p>{{ feedback }}</p>
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
    goToMenu() {
      this.$router.push("/");
    },
    fetchClothes() {
      axios
        .get("https://whattowear-backend.onrender.com/clothes")
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
      const filteredClothes = categories
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

      if (filteredClothes.length === 0) {
        this.feedback =
          "You don't have any clothing that supports this kind of weather";
        this.randomOutfit = [];
      } else {
        this.feedback = "";
        this.randomOutfit = filteredClothes;
      }
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
