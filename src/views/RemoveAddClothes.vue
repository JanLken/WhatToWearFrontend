<template>
  <div>
    <button @click="goToMenu" class="back-button">Back to Menu</button>
  </div>
  <div class="center-container">
    <form @submit.prevent="addClothes">
      <select v-model="newClothes.category">
        <option disabled value="">Select Category</option>
        <option>Jacket</option>
        <option>T-Shirt</option>
        <option>Long sleeve shirt</option>
        <option>Pants</option>
        <option>Shorts</option>
        <option>Shoes</option>
      </select>
      <input
        v-model="newClothes.description"
        placeholder="Description"
        type="text"
      />
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
      <button type="submit">Add Clothes</button>
    </form>

    <p v-if="feedback" :class="{ error: isError }">{{ feedback }}</p>

    <!-- Table of Saved Clothes -->
    <div class="container">
      <table class="table table-striped">
        <thead>
          <tr>
            <th>Clothes ID</th>
            <th>Clothes Category</th>
            <th>Min Temp</th>
            <th>Max Temp</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="clothes in savedClothes" :key="clothes.id">
            <td>{{ clothes.id }}</td>
            <td>{{ clothes.category }}</td>
            <td>{{ clothes.minTemp }}</td>
            <td>{{ clothes.maxTemp }}</td>
            <td>{{ clothes.description }}</td>
            <td>
              <button @click="confirmRemoval(clothes.id)">Remove</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Confirmation Popup -->
    <div v-if="showConfirmPopup" class="popup">
      <p>Are you sure you want to delete this clothing item?</p>
      <button @click="deleteClothes">Delete</button>
      <button @click="cancelDeletion">Cancel</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      newClothes: {
        category: "",
        minTemp: null,
        maxTemp: null,
        description: "",
      },
      savedClothes: [], // Array to store the list of saved Clothes
      selectedClothesId: null, // ID of the Clothes selected for removal
      showConfirmPopup: false, // Controls the display of the confirmation popup
      feedback: "",
      isError: false,
    };
  },
  methods: {
    goToMenu() {
      this.$router.push("/");
    },
    addClothes() {
      if (this.validateInput()) {
        axios
          .post("http://localhost:8080/clothes", this.newClothes)
          .then((response) => {
            this.feedback = "Clothes added successfully!";
            this.isError = false;
            this.savedClothes.push(response.data);
            this.resetForm();
          })
          .catch((error) => {
            console.error(error);
            this.feedback = "Failed to add Clothes.";
            this.isError = true;
          });
      }
    },
    validateInput() {
      if (
        !this.newClothes.category ||
        this.newClothes.minTemp === null ||
        this.newClothes.maxTemp === null
      ) {
        this.feedback = "Please fill in all fields.";
        this.isError = true;
        return false;
      }

      // Check if maxTemp is smaller than minTemp
      if (this.newClothes.maxTemp < this.newClothes.minTemp) {
        this.feedback =
          "Maximum temperature for the added clothing is smaller than the minimum temperature.";
        this.isError = true;
        return false;
      }

      // If all validations pass
      return true;
    },
    resetForm() {
      this.newClothes = {
        category: "",
        minTemp: null,
        maxTemp: null,
        description: "",
      };
      // Check if maxTemp is smaller than minTemp
      if (this.newClothes.maxTemp < this.newClothes.minTemp) {
        this.feedback =
          "Max temperature should be greater than Min temperature.";
        this.isError = true;
        return false;
      }
      return true;
    },
    fetchSavedClothes() {
      axios
        .get("http://localhost:8080/clothes")
        .then((response) => {
          this.savedClothes = response.data;
        })
        .catch((error) => {
          console.error(error);
          // Handle error
        });
    },
    confirmRemoval(id) {
      this.selectedClothesId = id;
      this.showConfirmPopup = true;
    },
    deleteClothes() {
      axios
        .delete(`http://localhost:8080/clothes/${this.selectedClothesId}`)
        .then(() => {
          this.fetchSavedClothes(); // Refresh the list
          this.showConfirmPopup = false;
        })
        .catch((error) => {
          console.error(error);
          // Handle error
        });
    },
    cancelDeletion() {
      this.selectedClothesId = null;
      this.showConfirmPopup = false;
    },
  },
  mounted() {
    this.fetchSavedClothes(); // Fetch saved Clothes on component mount
  },
};
</script>

<style>
.center-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.popup {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border: 1px solid #ccc;
  z-index: 1000;
}
.error {
  color: red;
}
</style>
