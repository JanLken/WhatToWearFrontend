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
            <th
              v-for="field in tableFields"
              :key="field.key"
              @click="sort(field.key)"
            >
              {{ field.label }}
              <span v-if="field.sortable && sortKey === field.key">{{
                sortOrder === 1 ? "↓" : "↑"
              }}</span>
              <span v-if="field.key === 'category'">
                <select v-model="categoryFilter">
                  <option value="">All Categories</option>
                  <option
                    v-for="category in categories"
                    :key="category"
                    :value="category"
                  >
                    {{ category }}
                  </option>
                </select>
              </span>
              <span v-if="field.key === 'description'">
                <input
                  v-model="descriptionFilter"
                  placeholder="Filter Description"
                />
              </span>
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="clothes in filteredClothes" :key="clothes.id">
            <td v-for="field in tableFields" :key="field.key">
              {{ clothes[field.key] }}
            </td>
            <td>
              <button @click="confirmRemoval(clothes.id)" class="small-button">
                Remove
              </button>
              <button @click="editClothes(clothes)" class="small-button">
                Edit
              </button>
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
      categories: [
        "Jacket",
        "T-Shirt",
        "Long sleeve shirt",
        "Pants",
        "Shorts",
        "Shoes",
      ],
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

      tableFields: [
        { key: "id", label: "Clothes ID", sortable: true },
        { key: "category", label: "Clothes Category", sortable: true },
        { key: "minTemp", label: "Min Temp", sortable: true },
        { key: "maxTemp", label: "Max Temp", sortable: true },
        { key: "description", label: "Description", sortable: false },
      ],
    };
  },
  methods: {
    sort(key) {
      const field = this.tableFields.find((f) => f.key === key);
      if (!field || !field.sortable) return;

      if (this.sortKey === key) {
        this.sortOrder *= -1;
      } else {
        this.sortKey = key;
        this.sortOrder = 1;
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

        if (typeof compareA === "number" && typeof compareB === "number") {
          return (compareA - compareB) * this.sortOrder;
        }
        if (compareA < compareB) return -1 * this.sortOrder;
        if (compareA > compareB) return 1 * this.sortOrder;
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
  /* Add more styles for popup */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}
.popup button {
  padding: 5px 8px; /* Smaller padding */
  font-size: 0.8em; /* Adjust font size if needed */
  border-radius: 15px; /* Increased border-radius for rounder appearance */
  border: none;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-right: 3px;
}

.popup button:hover {
  background-color: #0056b3;
}

table button {
  padding: 5px 10px; /* Smaller padding */
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}
/* Add styles for form and table */
form {
  margin: 20px auto;
  width: 60%;
}

form input,
form select,
form button {
  margin-top: 10px;
  padding: 10px;
  width: 20%;
  box-sizing: border-box;
  margin-right: 10px;
}
table .small-button {
  padding: 3px 6px; /* Reduced padding for smaller size */
  font-size: 0.8em; /* Smaller font size */
  width: 60px;
  margin-right: 10px;
}
table {
  table-layout: fixed;
  margin: 20px auto;
  width: 80%;
}

table,
th,
td {
  border-collapse: collapse;
  border: 1px solid #ddd;
  padding: 10px;
  text-align: left;
}
</style>
