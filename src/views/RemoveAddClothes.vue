<template>
  <div class="center-container">
    <form @submit.prevent="addClothes">
      <input v-model="newClothes.category" placeholder="Category" />
      <input
        v-model.number="newClothes.minTemp"
        placeholder="Min Temp"
        type="number"
      />
      <input
        v-model.number="newClothes.maxTemp"
        placeholder="Max Temp"
        type="number"
      />
      <input v-model="newClothes.pathPic" placeholder="Path Pic" />
      <button type="submit">Add Clothes</button>
    </form>

    <p v-if="feedback">{{ feedback }}</p>
    <!-- Additional UI elements for deleting clothes can be added here -->
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      newClothes: {
        category: "",
        minTemp: 0,
        maxTemp: 0,
        pathPic: "",
      },
      feedback: "", // Feedback message
    };
  },
  methods: {
    addClothes() {
      axios
        .post("http://localhost:8080/clothes", this.newClothes)
        .then((response) => {
          this.feedback = "Clothes added successfully!";
          this.resetForm(); // Reset the form after successful addition
        })
        .catch((error) => {
          console.error(error);
          this.feedback = "Failed to add Clothes.";
        });
    },
    resetForm() {
      this.newClothes = { category: "", minTemp: 0, maxTemp: 0, pathPic: "" };
    },
  },
};
</script>

<style>
.center-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 10vh; /* This makes sure it takes at least the full height of the viewport */
}
</style>
