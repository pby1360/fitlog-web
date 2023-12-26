<template>
  <CommonLayout :title="title" :double="true">
    <template #buttons>
      <v-btn>Order</v-btn>
    </template>
    <template #box1>
      <div class="box-container">
        <div class="box-header">
          <p class="title">Parts</p>
          <div class="buttons">
            <v-btn @click="showAddProgramPart = true">Add</v-btn>
          </div>
        </div>
        <div class="box-content">
          <div v-if="partList.length > 0" class="item-wrapper">
            <div class="item" :class="selectedPart.id == part.id ? 'selected' : null" v-for="part in partList" :key="part.id" @click="selectPart(part)">
              <span class="text">{{ part.workoutPartName }}</span>
              <div class="buttons">
              <v-btn variant="outlined" @click="getProgramPartDetail(part.id)"><v-icon class="text" icon="mdi-magnify"></v-icon></v-btn>
              <v-btn variant="outlined" @click="deleteProgramPart(part.id)" color="red"><v-icon class="text" icon="mdi-delete-outline"></v-icon></v-btn>
            </div>
            </div>
          </div>
          <div v-else class="item-wrapper">
            No parts.
          </div>
        </div>
      </div>
    </template>
    <template #box2>
      <div class="box-container">
        <div class="box-header">
          <p class="title">Items</p>
          <div class="buttons">
            <v-btn @click="showAddProgramPartItem = true">Add</v-btn>
          </div>
        </div>
        <div class="box-content">
          <div v-if="itemList.length > 0" class="item-wrapper">
            <div class="item" v-for="item in itemList" :key="item.id">
              <span class="text">{{ item.name }}</span>
            </div>
          </div>
          <div v-else class="item-wrapper">
            No items.
          </div>
        </div>
      </div>
    </template>
  </CommonLayout>
  <v-dialog
    v-model="showAddProgramPart"
    width="400"
  >
    <v-card>
      <v-card-title>Add Program Part</v-card-title>
      <v-card-text>
        <v-combobox
          v-model="newProgramPart.workoutPartId"
          clearable
          label="Part"
          :items="comboPartList"
          :return-object="false"
        />
        <v-text-field v-model="newProgramPart.description" label="description"></v-text-field>
      </v-card-text>
      <v-card-actions style="display: flex;">
        <v-btn style="flex:1;" variant="flat" color="#CCCCFF" @click="addProgramPart">save</v-btn>
        <v-btn @click="showAddProgramPart = false" style="flex:1;" variant="flat" color="#e8e8e8">cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog
    v-model="showDetailProgramPart"
    width="400"
  >
    <v-card>
      <v-card-title>Program Part Detail</v-card-title>
      <v-card-text>
        <v-combobox
          v-model="programPartDetail.workoutPartId"
          clearable
          label="Part"
          :items="comboPartList"
          :return-object="false"
          :readonly="true"
        />
        <v-text-field v-model="programPartDetail.description" label="description"></v-text-field>
      </v-card-text>
      <v-card-actions style="display: flex;">
        <v-btn style="flex:1;" variant="flat" color="#CCCCFF" @click="modifyProgramPart">save</v-btn>
        <v-btn @click="showDetailProgramPart = false" style="flex:1;" variant="flat" color="#e8e8e8">cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog
    v-model="showAddProgramPartItem"
    width="400"
  >
    <v-card>
      <v-card-title>Add Program Part Item</v-card-title>
      <v-card-text>
        <v-combobox
          v-model="newProgramPartItem.workoutPartItemId"
          clearable
          label="Item"
          :items="comboItemList"
          :return-object="false"
        />
        <v-text-field v-model="newProgramPartItem.description" label="description"></v-text-field>
      </v-card-text>
      <v-card-actions style="display: flex;">
        <v-btn style="flex:1;" variant="flat" color="#CCCCFF" @click="addProgramPartItem">save</v-btn>
        <v-btn @click="showAddProgramPartItem = false" style="flex:1;" variant="flat" color="#e8e8e8">cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { onMounted, getCurrentInstance, ref, computed, watch } from 'vue';
import { useStore } from "vuex";

import CommonLayout from '@/components/CommonLayout.vue';

const axios = getCurrentInstance().proxy.axios;
const store = useStore();

const props = defineProps ({
  programId: Number
});

const title = computed(() => 'Program Parts > ' + program.value.name);

let comboPartList = [];
let comboItemList = ref([]);

let selectedPart = ref({});

const program = ref({});
const partList = ref([]);
const itemList = ref([]);

const showAddProgramPart = ref(false);
const showDetailProgramPart = ref(false);
const showAddProgramPartItem = ref(false);
const showDetailProgramPartItem = ref(false);

const newProgramPart = ref({});
const programPartDetail = ref({});
const newProgramPartItem = ref({});
const programPartItemDetail = ref({});

const deleteProgramPartItem = async () => {}
const modifyProgramPartItem = async () => {}
const getProgramPartItemDetail = async () => {}
const addProgramPartItem = async () => {}

watch(
  showAddProgramPartItem, (value) => {
    if (value) {
      getItemComboData(selectedPart.value.workoutPartId);
    }
  },
  { immediate: true }
);

const getItemComboData = async (partId) => {
  const user = store.getters.getUser;
  await axios.get(`/api/workout-master/${user.id}/parts/${partId}/items`)
  .then(response => {
    comboItemList.value = response.data.items.map(item => {
      return {title: item.name, value: item.id};
    });
  })
  .catch((error) => {
    console.error(error)
    alert('load combo data failed!');
  });
}

const getProgramPartItemList = async (partId) => {
  store.commit('setLoading', true);
  await axios.get(`/api/workout-programs/${props.programId}/parts/${partId}/items`)
  .then(response => {
    itemList.value = response.data;
  })
  .catch((error) => {
    console.error(error)
    alert('조회 실패');
  })
  .finally(() => store.commit('setLoading', false));
}

const selectPart = (part) => {
  if (selectedPart.value.id !== part.id) {
    getProgramPartItemList(part.workoutPartId);
  }
  selectedPart.value = part;
}
const deleteProgramPart = async (partId) => {
  if (!confirm("Delete it?")) {
    return;
  }
  store.commit('setLoading', true);
  await axios.delete(`/api/workout-programs/${props.programId}/parts/${partId}`)
  .then(() => {
    alert('삭제 성공!');
    getProgramWithParts();
  })
  .catch((error) => alert('삭제 실패!'))
  .finally(() => store.commit('setLoading', false));
}

const modifyProgramPart = async () => {
  store.commit('setLoading', true);
  await axios.put(`/api/workout-programs/${props.programId}/parts/${programPartDetail.value.id}`, programPartDetail.value)
  .then(response => {
    showDetailProgramPart.value = false;
    programPartDetail.value = {};
    getProgramWithParts();
  })
  .catch((error) => alert('수정 실패!'))
  .finally(() => store.commit('setLoading', false));
}

const getProgramPartDetail = async (workoutPartId) => {
  store.commit('setLoading', true);
  await axios.get(`/api/workout-programs/${props.programId}/parts/${workoutPartId}`)
  .then(response => {
    programPartDetail.value = response.data;
    showDetailProgramPart.value = true;
  })
  .catch((error) => {
    console.error(error);
    alert('조회 실패!');    
  })
  .finally(() => store.commit('setLoading', false));
}

const addProgramPart = async () => {
  if (!newProgramPart.value.workoutPartId) {
    return alert('Part를 선택하세요.');
  }
  store.commit('setLoading', true);
  newProgramPart.value.workoutProgramId = props.programId;
  await axios.post(`/api/workout-programs/${props.programId}/parts`, newProgramPart.value)
  .then(response => {
    newProgramPart.value = {};
    showAddProgramPart.value = false;
    getProgramWithParts();
  })
  .catch((error) => alert('저장 실패!'))
  .finally(() => store.commit('setLoading', false));
}

const getPartComboData = async () => {
  const user = store.getters.getUser;
  await axios.get(`/api/workout-master/${user.id}/parts`)
  .then(response => {
    comboPartList = response.data.map(part => {
      return {title: part.name, value: part.id};
    });
  })
  .catch((error) => {
    console.error(error)
    alert('load combo data failed!');
  });
}

const getProgramWithParts = async () => {
  store.commit('setLoading', true);
  await axios.get(`/api/workout-programs/${props.programId}/parts`)
  .then(response => {
    program.value = {
      id: response.data.id,
      name: response.data.name,
    };
    partList.value = response.data.workoutProgramPartList;
  })
  .catch((error) => {
    console.error(error)
    alert('조회 실패');
  })
  .finally(() => store.commit('setLoading', false));
}

const init = () => {
  getProgramWithParts();
  getPartComboData();
};

onMounted(() =>   init());

</script>

<style lang="scss" scoped>
.box-container {
  .box-header {
    display: flex;
    justify-content: space-between;
    .title {
      font-weight: bold;
      font-size: 1.1rem;
    }
    .buttons {
      button {
        margin-left: 0.2rem;
      }
    }
  }
  .box-content {
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
          cursor: pointer;
          background-color: #e2ecfc;
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
