<template>
  <div class="common-layout-container">
    <div class="title-bar">
      <p>{{ props.title }}</p>
      <div class="buttons">
        <slot name="buttons"></slot>
      </div>
    </div>
    <div v-if="double" class="box-wrapper">
      <div class="box">
        <slot name="box1"></slot>
      </div>
      <div class="box">
        <slot name="box2"></slot>
      </div>
    </div>
    <div v-else-if="custom" class="box-wrapper">
      <slot name="box"></slot>
    </div>
    <div v-else class="box">
      <slot name="box"></slot>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';

const props = defineProps ({
  title: String,
  double: Boolean,
  custom: Boolean
})

onMounted(() => {})
</script>

<style lang="scss" scoped>
.common-layout-container {
  padding: 2rem;

  .title-bar {
    font-size: x-large;
    font-weight: bold;
    padding: 0.5rem;
    background-color: #fff;
    border: solid 1px black;
    border-radius: 5px;
    margin-bottom: 0.5rem;

    display: flex;
    justify-content: space-between;

    .buttons {

    }
  }
  .box {
    padding: 1rem;
    background-color: #fff;
    border: solid 1px black;
    border-radius: 5px;
  }

  .box-wrapper {
    display: flex;
    gap: 0.5rem;
    .box {
      flex: 1;
      
      padding: 1rem;
      background-color: #fff;
      border: solid 1px black;
      border-radius: 5px;
    }

  }
}
</style>