<template>
  <CommonLayout title="Workout List" :custom="true">
    <template #buttons>
      <v-btn variant="outlined" @click="router.replace('/program-selection');" class="title-button">Program</v-btn>
    </template>
    <template #box>
      <div>
        <div v-for="routine in routineList" :key="routine.id">
          <p>{{ routine.id }} {{ routine.name }}</p>
        </div>
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
</style>