<template>
  <div>
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
    };
  },
  methods: {
    addClothes() {
      axios
        .post("http://localhost:8080/clothes", this.newClothes)
        .then((response) => {
          console.log(response);
          // Handle success (e.g., clear form, show message)
        })
        .catch((error) => {
          console.error(error);
          // Handle error
        });
    },
    deleteClothes(id) {
      axios
        .delete(`http://localhost:8080/clothes/${id}`)
        .then((response) => {
          console.log(response);
          // Handle success (e.g., update UI)
        })
        .catch((error) => {
          console.error(error);
          // Handle error
        });
    },
  },
};
</script>

export default { // eslint-disable-next-line vue/multi-word-component-names
name: "Remove or Add Clothes", };
