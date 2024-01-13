<template>
  <div>
    <button @click="goToMenu" class="back-button">Back to Menu</button>
  </div>
  <h1 class="center-container">Here you can change your Closet</h1>
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
            <th>Clothes ID<button @click="sort('id')">Sort by ID</button></th>
            <th>
              Clothes Category
              <select
                v-model="categoryFilter"
                @change="resetFilters('category')"
              >
                <option value="">All Categories</option>
                <option value="Jacket">Jacket</option>
                <option value="T-Shirt">T-Shirt</option>
                <option value="Long sleeve shirt">Long sleeve shirt</option>
                <option value="Pants">Pants</option>
                <option value="Shorts">Shorts</option>
                <option value="Shoes">Shoes</option>
              </select>
            </th>
            <th>
              Min Temp<button @click="sort('minTemp')">Sort by Min Temp</button>
            </th>
            <th>
              Max Temp<button @click="sort('maxTemp')">Sort by Max Temp</button>
            </th>
            <th>
              Description
              <input
                v-model="descriptionFilter"
                placeholder="Filter by Description"
              />
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="clothes in filteredClothes" :key="clothes.id">
            <td>{{ clothes.id }}</td>
            <td>{{ clothes.category }}</td>
            <td>{{ clothes.minTemp }}</td>
            <td>{{ clothes.maxTemp }}</td>
            <td>{{ clothes.description }}</td>
            <td>
              <button @click="confirmRemoval(clothes.id)">Remove</button>
            </td>
            <td>
              <button @click="editClothes(clothes)">Edit</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- Confirmation Popup -->
    <div v-if="showDeletePopup" class="popup">
      <p>Are you sure you want to delete this clothing item?</p>
      <button @click="deleteClothes">Delete</button>
      <button @click="cancelDeletion">Cancel</button>
    </div>
    <div v-if="showEditPopup" class="popup">
      <input type="text" v-model="editableClothes.description" />
      <button @click="saveDescription">Save</button>
      <button @click="cancelEdit">Cancel</button>
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
      sortKey: "id",
      sortOrder: 1, // 1 for ascending, -1 for descending
      categoryFilter: "",
      descriptionFilter: "",
      editableClothes: null,
      savedClothes: [], // Array to store the list of saved Clothes
      selectedClothesId: null, // ID of the Clothes selected for removal
      showDeletePopup: false, // Controls the display of the confirmation popup
      showEditPopup: false,
      feedback: "",
      isError: false,
    };
  },
  methods: {
    sort(key) {
      if (this.sortKey === key) {
        // Toggle sort order
        this.sortOrder *= -1;
      } else {
        this.sortKey = key;
        this.sortOrder = 1; // Default to ascending
      }
    },
    goToMenu() {
      this.$router.push("/");
    },
    addClothes() {
      if (this.validateInput()) {
        axios
          .post(`${process.env.VUE_APP_BACKEND_BASE_URL}`, this.newClothes)
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
        .get(process.env.VUE_APP_BACKEND_BASE_URL)
        .then((response) => {
          this.savedClothes = response.data;
        })
        .catch((error) => {
          console.error("Error fetching clothes:", error);
          // Handle error
        });
    },

    confirmRemoval(id) {
      this.selectedClothesId = id;
      this.showDeletePopup = true;
      this.showEditPopup = false;
    },
    deleteClothes() {
      axios
        .delete(
          `${process.env.VUE_APP_BACKEND_BASE_URL}/${this.selectedClothesId}`
        )
        .then(() => {
          this.fetchSavedClothes(); // Refresh the list
          this.showDeletePopup = false;
        })
        .catch((error) => {
          console.error(error);
          // Handle error
        });
    },

    editClothes(clothes) {
      this.editableClothes = JSON.parse(JSON.stringify(clothes));
      this.selectedClothesId = clothes.id;
      this.showEditPopup = true;
      this.showDeletePopup = false;
    },
    saveDescription() {
      axios
        .put(
          `${process.env.VUE_APP_BACKEND_BASE_URL}/${this.selectedClothesId}`,
          this.editableClothes
        )
        .then((response) => {
          // Find the index of the updated item in the savedClothes array
          const index = this.savedClothes.findIndex(
            (c) => c.id === this.editableClothes.id
          );
          if (index !== -1) {
            // Replace the old item data with the new data
            this.savedClothes.splice(index, 1, response.data);
          }
          this.showEditPopup = false;
        })
        .catch((error) => {
          console.error("Error updating clothes:", error);
          // Handle error (possibly update feedback to show to the user)
        });
    },
    cancelEdit() {
      this.showEditPopup = false;
      this.editableClothes = null;
    },
    cancelDeletion() {
      this.selectedClothesId = null;
      this.showDeletePopup = false;
    },
    resetFilters(changedFilter) {
      if (changedFilter !== "category") {
        this.categoryFilter = "";
      }
      if (changedFilter !== "description") {
        this.descriptionFilter = "";
      }
      if (changedFilter !== "minTemp") {
        this.descriptionFilter = "";
      }
      if (changedFilter !== "maxTemp") {
        this.descriptionFilter = "";
      }
      if (changedFilter !== "id") {
        this.descriptionFilter = "";
      }
    },
  },
  mounted() {
    this.fetchSavedClothes(); // Fetch saved Clothes on component mount
    console.log("Mounted!");
  },
  computed: {
    filteredClothes() {
      let result = this.savedClothes;

      if (this.categoryFilter) {
        result = result.filter((item) => item.category === this.categoryFilter);
      }

      if (this.descriptionFilter) {
        result = result.filter((item) =>
          item.description
            .toLowerCase()
            .includes(this.descriptionFilter.toLowerCase())
        );
      }

      // Sort the result
      result.sort((a, b) => {
        let compareA = a[this.sortKey];
        let compareB = b[this.sortKey];

        if (compareA < compareB) return -1 * this.sortOrder;
        if (compareA > compareB) return this.sortOrder;
        return 0;
      });

      return result;
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
