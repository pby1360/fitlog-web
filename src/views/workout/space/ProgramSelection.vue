<template>
  <CommonLayout title="Select Program" :custom="true">
    <template #buttons>
      <v-btn @click="showProgramSelection = true" class="title-button">Programs</v-btn>
      <v-btn class="title-button">Reset</v-btn>
      <v-btn class="title-button">Complete</v-btn>
    </template>
    <template #box>
      test
    </template>
  </CommonLayout>
  <v-dialog
    v-model="showProgramSelection"
    width="400"
  >
    <v-card>
      <v-card-title>Select Program</v-card-title>
      <v-card-text>
        <v-select
          v-model="tempSeletedProgram"
          clearable
          label="Program"
          :items="programList"
        />
      </v-card-text>
      <v-card-actions style="display: flex;">
        <v-btn style="flex:1;" variant="flat" color="#CCCCFF" @click="selectProgram">Ok</v-btn>
        <v-btn @click="showProgramSelection = false" style="flex:1;" variant="flat" color="#e8e8e8">cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import CommonLayout from '@/components/CommonLayout.vue';
import { getCurrentInstance, onMounted, ref } from 'vue';
import { useStore } from 'vuex';

const axios = getCurrentInstance().proxy.axios;
const store = useStore();

const user = store.getters.getUser;

onMounted(() =>   init());

const init = () => {
  getProgramList();
};

const getProgramList = async () => {  
  await axios.get(`/api/workout-programs?userId=${user.id}`)
  .then(response => {
    programList.value = response.data.map(program => {
      return {title: program.name, value: program.id};
    });
  });
}

/* part */

const partList = ref([]);
const getPartList = () => {};


/* program */

const showProgramSelection = ref(false);
const tempSeletedProgram = ref();
const seletedProgram = ref();
const programList = ref([]);

const selectProgram = () => {
  seletedProgram.value = { ... tempSeletedProgram.value};
  tempSeletedProgram.value = null;
  showProgramSelection.value = false;
}




</script>

<style lang="scss" scoped>
.title-button {
  margin-left: 0.2rem;
  width: 7.5rem;
}
</style>