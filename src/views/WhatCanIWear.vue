<template>
  <div>
    <button @click="goToMenu" class="back-button">Back to Menu</button>
  </div>
  <div class="container">
    <h1>What Can I Wear?</h1>
    <input type="text" v-model="cityName" placeholder="Enter City Name" />
    <button @click="fetchTemperature">Get Temperature</button>
    <h4 v-if="currentTemperature !== null">
      Current Temperature: {{ currentTemperature }} °C
    </h4>
    <div v-if="randomOutfit.length" class="outfit-table">
      <h2>Your Random Outfit:</h2>
      <table class="table table-striped">
        <thead>
          <tr>
            <th>Category</th>
            <th>ID</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in randomOutfit" :key="item.id">
            <td>{{ item.category }}</td>
            <td>{{ item.id }}</td>
            <td>{{ item.description }}</td>
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
      currentTemperature: null,
      cityName: "", // For user input of the city name
      apiKey: process.env.VUE_APP_API_KEY,
      randomOutfit: [],
      degreesOutside: 0,
      showError: false,
    };
  },
  methods: {
    goToMenu() {
      this.$router.push("/");
    },
    fetchTemperature() {
      if (!this.cityName) {
        this.showError = true;
        this.feedback = "Please enter a city name.";
        return;
      }
      const url = `http://api.weatherapi.com/v1/current.json?key=${this.apiKey}&q=${this.cityName}`;
      axios
        .get(url)
        .then((response) => {
          this.currentTemperature = response.data.current.temp_c; // Set the temperature
          this.showError = false;
          this.generateRandomOutfit();
        })
        .catch((error) => {
          console.error("Error fetching temperature:", error);
          this.feedback = "Failed to fetch temperature for the specified city.";
          this.showError = true;
        });
    },

    fetchClothes() {
      axios
        .get(process.env.VUE_APP_BACKEND_BASE_URL)
        .then((response) => {
          this.clothes = response.data;
        })
        .catch((error) => {
          console.error("Error fetching clothes:", error);
        });
    },
    generateRandomOutfit() {
      this.showError = false;

      const categoryGroups = [
        ["Pants", "Shorts"], // Either pants or shorts
        ["T-Shirt", "Long sleeve shirt"], // Either T-shirt or long sleeve shirt
        ["Shoes"],
        ["Jacket"],
      ];

      let filteredClothes = categoryGroups
        .map((group) => {
          let items = group
            .map((category) =>
              this.clothes.filter(
                (item) =>
                  item.category === category &&
                  item.minTemp <= this.degreesOutside &&
                  item.maxTemp >= this.degreesOutside
              )
            )
            .flat();

          if (items.length === 0) return null;
          return items[Math.floor(Math.random() * items.length)];
        })
        .filter((item) => item !== null);

      if (filteredClothes.length !== categoryGroups.length) {
        this.feedback = "Not enough clothing items available for this weather";
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
