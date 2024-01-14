<template>
  <div>
    <button @click="goToMenu" class="back-button">Back to Menu</button>
  </div>
  <div class="container">
    <h1>What Can I Wear?</h1>
    <input
      type="text"
      v-model="cityName"
      placeholder="Enter a City Name"
      style="margin-right: 10px"
    />
    <button @click="fetchTemperature">Get the temperature</button>
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
      const url = `https://api.weatherapi.com/v1/current.json?key=${this.apiKey}&q=${this.cityName}`;
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
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px; /* Add a gap between flex items */
}

.outfit-table {
  margin: 0 auto;
  width: 60%; /* Set the width of the container */
}

.outfit-table table {
  width: 100%; /* Table width is 100% of its container */
  table-layout: fixed; /* This ensures a fixed layout */
  border-collapse: collapse;
}

.outfit-table th,
.outfit-table td {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: left;
  word-wrap: break-word;
}
/* Specify widths for each column if needed */
.outfit-table th:nth-child(1),
.outfit-table td:nth-child(1) {
  width: 20%;
}

.outfit-table th:nth-child(2),
.outfit-table td:nth-child(2) {
  width: 10%;
}

.outfit-table th:nth-child(3),
.outfit-table td:nth-child(3) {
  width: 50%;
}

input,
button {
  padding: 10px; /* Uniform padding */
  width: 200px; /* Set a fixed width */
  box-sizing: border-box; /* Include padding and border in the element's total width and height */
  display: inline-block;
  vertical-align: top;
}

button {
  margin-left: 10px; /* Gap between input and button */
  background-color: #007bff;
  color: white;
  border: 2px solid transparent; /* Add a transparent border to match the input's default border */
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #0056b3;
}
</style>
