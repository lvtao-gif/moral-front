<template>
  <v-md-preview :text="markdownContent"></v-md-preview>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
<script setup lang="ts">
import { ref } from "vue";

const markdownContent = ref("")
import markdownFile from "../assets/static/dataset.md";
fetch(markdownFile)
    .then((res) => res.text())
    .then((data) => {
      markdownContent.value = data;
    });
</script>