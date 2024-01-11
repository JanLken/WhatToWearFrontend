<template>
  <h1 class="center-container">~What To Wear~</h1>
  <div class="menu-container">
    <button @click="navigateTo('/what-can-i-wear')">What can I wear?</button>
    <button @click="navigateTo('/RemoveAddClothes')">
      Remove or add new Clothes
    </button>
    <button @click="navigateTo('/settings')">Settings</button>
    <button @click="navigateTo('/logout')">Logout</button>
  </div>
</template>

<script>
import { useRouter } from "vue-router";

export default {
  methods: {
    goToMenu() {
      this.$router.push("/");
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
}

.menu-container button {
  margin-top: 10px;
}
</style>
