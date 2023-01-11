<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <a-button @click="onClick">点击</a-button>
    <!-- <HelloWorld msg="Welcome to Your Vue.js + TypeScript App" /> -->
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
// import HelloWorld from "@/components/HelloWorld.vue"; // @ is an alias to /src
import { search } from "@/apis/";

export default defineComponent({
  setup() {
    const onClick = async () => {
      const { success, error } = await search();
      console.log(7777, success, error);
    };
    return {
      onClick,
    };
  },
});
</script>
