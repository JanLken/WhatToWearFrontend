<template>
  <h1 class="center-container">~What To Wear~</h1>
  <div class="menu-container">
    <button @click="navigateTo('/what-can-i-wear')">What can I wear?</button>
    <button @click="navigateTo('/RemoveAddClothes')">Change closet</button>
    <button @click="navigateTo('/settings')">Settings</button>
    <button @click="logout">Logout</button>
  </div>
</template>

<script>
import { useRouter } from "vue-router";

export default {
  methods: {
    goToMenu() {
      this.$router.push("/");
    },
    Logout() {
      this.$auth.signOut().then(() => {
        this.$router.replace("/login");
      });
    },
  },
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Menu",
  setup() {
    const router = useRouter();

    const navigateTo = (path) => {
      router.push(path);
    };

    return { navigateTo };
  },
};
</script>

<style>
.menu-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.menu-container button {
  margin-top: 10px;
  padding: 10px 20px;
  background-color: #007bff;
  color: whitesmoke;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 1s;
}

.menu-container button:hover {
  background-color: #0056b3;
}
</style>
