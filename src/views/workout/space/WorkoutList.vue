<template>
  <CommonLayout title="Workout List" :custom="true">
    <template #buttons>
      <v-btn variant="outlined" @click="router.replace('/program-selection');" class="title-button">Program</v-btn>
    </template>
    <template #box>
      <div v-if="routineList.length > 0" class="item-wrapper">
        <div class="item columns">
          <span class="text">No</span>
          <span class="text">Name</span>
          <span class="text">Description</span>
          <span class="text">Status</span>
          <span class="text">started at</span>
          <span class="text">finished at</span>
          <span class="text"></span>
        </div>
        <div class="item" v-for="routine in routineList" :key="routine.id">
          <span class="text">{{ routine.id }}</span>
          <span class="text">{{ routine.name }}</span>
          <span class="text">{{ routine.description }}</span>
          <span class="text">{{ routine.statusName }}</span>
          <span class="text">{{ routine.startedAt }}</span>
          <span class="text">{{ routine.finishedAt }}</span>
          <span class="text"><v-btn>이동</v-btn></span>
        </div>
      </div>
      <div v-else class="item-wrapper">
        No Workout.
      </div>
    </template>
  </CommonLayout>
</template>

<script setup>
import CommonLayout from '@/components/CommonLayout.vue';
import { getCurrentInstance, onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import router from '../../../router';

const axios = getCurrentInstance().proxy.axios;
const store = useStore();

const user = store.getters.getUser;

const routineList = ref([]);

onMounted(() =>   init());

const init = () => {
  getProgramList();
};

const getProgramList = async () => {  
  await axios.get(`/api/workout-routines/users/${user.id}`)
  .then(response => {
    routineList.value = response.data;
  });
}

</script>

<style lang="scss" scoped>
.item-wrapper {
  width: 100%;
  display: flex;
  flex-flow: column;
  padding: 1rem 0;
  gap: 0.25rem;
  .item {
    &.columns {
      background-color: #f0f0f0;
      font-weight: bold;
    }
    padding: 0 0.5rem;
    background-color: #f9f9f9;
    border: solid 1px #c8c8c8;
    border-radius: 5px;
    height: 3rem;
    display: flex;
    justify-content: space-between;
    &:hover {
      border: solid 1px black;
    }
    .text {
      margin: auto 0;
    }
    .buttons {
      margin: auto 0;
      button {
        padding: 0;
        min-width: 2.5rem;
        margin-left: 0.25rem;
        background-color: #fff;
      }
    }
    &.selected {
      border: solid 2px #c8c8c8;
      background-color: #CCCCFF;
    }
  }
}
</style>