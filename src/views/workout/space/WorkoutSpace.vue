<template>
  <div>
    workout space
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import router from '../../../router';


onMounted(() => {
  const workoutStr = localStorage.getItem('workout');
  if (workoutStr) {
    const workout = JSON.parse(localStorage.getItem('workout'));
    if (workout.id) {
    //todo
    // get workout routine
    } else {
      alert('진행중인 프로그램이 없습니다.\n프로그램 선택 후 다시 시도하세요.');
      router.replace('/program-selection');
    }
  } else {
    alert('진행중인 프로그램이 없습니다.\n프로그램 선택 후 다시 시도하세요.');
    router.replace('/program-selection');
  }
})

</script>

<style lang="scss" scoped>

</style>