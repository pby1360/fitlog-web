<template>
  <div class="container">
    <div class="title-bar">
      <p>Programs</p>
      <div class="buttons">
        <v-btn variant="tonal" color="info" @click="showAddProgram = true">Add</v-btn>
      </div>
    </div>
      <div class="box">
        <div v-if="programList.length > 0" class="item-wrapper">
          <div class="item" v-for="program in programList" :key="program.id">
            <span class="text">{{ program.name }}</span>
            <div class="buttons">
              <v-btn variant="outlined" @click="getProgramDetail(program.id)"><v-icon class="text" icon="mdi-magnify"></v-icon></v-btn>
              <v-btn variant="outlined" @click="router.push(`/workout-program/${program.id}/parts`)"><v-icon class="text" icon="mdi-format-list-bulleted"></v-icon></v-btn>
              <v-btn variant="outlined" @click="deleteProgram(program.id)" color="red"><v-icon class="text" icon="mdi-delete-outline"></v-icon></v-btn>
            </div>
          </div>
        </div>
        <div v-else class="item-wrapper">
          No programs.
        </div>
      </div>
    <v-dialog
      v-model="showAddProgram"
      width="400"
    >
      <v-card>
        <v-card-title>Add Program</v-card-title>
        <v-card-subtitle>Please enter the workout program</v-card-subtitle>
        <v-card-text>
          <v-text-field v-model="newProgram.name" label="Name"></v-text-field>
          <v-text-field v-model="newProgram.description" label="Description"></v-text-field>
        </v-card-text>
        <v-card-actions style="display: flex;">
          <v-btn style="flex:1;" variant="flat" color="#CCCCFF" @click="addProgram">save</v-btn>
          <v-btn @click="showAddProgram = false" style="flex:1;" variant="flat" color="#e8e8e8">cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="showProgramDetail"
      width="400"
    >
      <v-card>
        <v-card-title>Program detail</v-card-title>
        <v-card-text>
          <v-text-field v-model="programDetail.name" label="Name"></v-text-field>
          <v-text-field v-model="programDetail.description" label="Description"></v-text-field>
          <v-text-field readonly v-model="programDetail.createdDate" label="Created date"></v-text-field>
          <v-text-field readonly v-model="programDetail.modifiedDate" label="Modified date"></v-text-field>
          <v-textarea v-model="programDetail.memo" label="Memo"></v-textarea>
        </v-card-text>
        <v-card-actions style="display: flex;">
          <v-btn style="flex:1;" variant="flat" color="#CCCCFF" @click="modifyProgram">save</v-btn>
          <v-btn @click="showProgramDetail = false" style="flex:1;" variant="flat" color="#e8e8e8">cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { onMounted, ref, getCurrentInstance } from "vue";
import { useStore } from "vuex";
import router from "../../../router";

const axios = getCurrentInstance().proxy.axios;
const store = useStore();

const showAddProgram = ref(false);
const showProgramDetail = ref(false);

const programList = ref([]);
const newProgram = ref({});
const programDetail = ref({});

const user = store.getters.getUser;

onMounted(() => {
  store.commit('setLoading', true);
  Promise.all([getProgramList]).finally(() => store.commit('setLoading', false));
  getProgramList();
});

const getProgramList = async () => {  
  await axios.get(`/api/workout-programs?userId=${user.id}`)
  .then(response => {
    programList.value = response.data;
  });
}

const addProgram = async () => {
  if (!newProgram.value.name) {
    alert('please enter name');
    return;
  }
  store.commit('setLoading', true);
  newProgram.value.userId = user.id;
  await axios.post('/api/workout-programs', newProgram.value)
  .then(response => {
    newProgram.value = {};
    showAddProgram.value = false;
    getProgramList();
  })
  .catch((error) => alert('저장 실패!'))
  .finally(() => store.commit('setLoading', false));
}

const getProgramDetail = async (programId) => {
  store.commit('setLoading', true);
  await axios.get(`/api/workout-programs/${programId}`)
  .then(response => {
    programDetail.value = response.data;
    showProgramDetail.value = true;
  })
  .catch((error) => {
    console.error(error);
    alert('조회 실패!');    
  })
  .finally(() => store.commit('setLoading', false));
}

const modifyProgram = async () => {
  if (!programDetail.value.name) {
    alert('please enter name');
    return;
  }
  store.commit('setLoading', true);
  await axios.put(`/api/workout-programs/${programDetail.value.id}`, programDetail.value)
  .then(response => {
    showProgramDetail.value = false;
    programDetail.value = {};
    getProgramList();
  })
  .catch((error) => alert('수정 실패!'))
  .finally(() => store.commit('setLoading', false));
}

const deleteProgram = async (programId) => {  
  if (!confirm("Delete it?")) {
    return;
  }
  store.commit('setLoading', true);
  await axios.delete(`/api/workout-programs/${programId}`)
  .then(() => {
    alert('삭제 성공!');
    getProgramList();
  })
  .catch((error) => alert('삭제 실패!'))
  .finally(() => store.commit('setLoading', false));
}

</script>

<style lang="scss" scoped>
.container {
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
      // min-width: 15rem;
      // width: 25rem;
      border-radius: 5px;
      // box-shadow: 2px 2px 3px #ccccff;

      .item-wrapper {
        display: flex;
        flex-flow: column;
        padding: 1rem 0;
        gap: 0.25rem;
        
        .item {
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
    }
}
</style>