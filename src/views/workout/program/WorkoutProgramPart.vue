<template>
  <CommonLayout :title="title" :double="true">
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
      <div v-show="!isOrderMode" class="box-container">
        <div class="box-header">
          <p class="title">Items</p>
          <div v-show="selectedPart.id" class="buttons">
            <v-btn @click="showAddProgramPartItem = true">Add</v-btn>
            <v-btn :disabled="itemList.length < 2" color="purple-lighten-4" @click="isOrderMode = true">Order</v-btn>
          </div>
        </div>
        <div class="box-content">
          <div v-if="!selectedPart.id" class="item-wrapper">
            Select Part.
          </div>
          <div v-else-if="itemList.length > 0" class="item-wrapper">
            <div class="item" v-for="item in itemList" :key="item.id">
                <span class="text">{{ item.name }}</span>
              <div class="buttons">
                <v-btn variant="outlined" @click="getProgramPartItemDetail(item.id)"><v-icon class="text" icon="mdi-magnify"></v-icon></v-btn>
                <v-btn variant="outlined" @click="router.push(`/workout-program/${program.id}/parts/${selectedPart.id}/items/${item.id}/sets`)"><v-icon class="text" icon="mdi-format-list-bulleted"></v-icon></v-btn>
                <v-btn variant="outlined" @click="deleteProgramPartItem(item.id)" color="red"><v-icon class="text" icon="mdi-delete-outline"></v-icon></v-btn>
              </div>
            </div>
          </div>
          <div v-else class="item-wrapper">
            No items.
          </div>
        </div>
      </div>
      <div v-show="isOrderMode" class="box-container">
        <div class="box-header">
          <p class="title">Items</p>
          <div v-show="selectedPart.id" class="buttons">
            <v-btn variant="outlined" color="success" @click="saveItemOrder">Save</v-btn>
            <v-btn variant="outlined" color="error" @click="isOrderMode=false">Cancel</v-btn>
          </div>
        </div>
        <div class="box-content">
          <div class="item-wrapper">
            <div class="item" v-for="item in itemList" :key="item.id">
              <span class="number">{{ item.order }}</span>
              <span class="text">{{ item.name }}</span>
              <div class="buttons">
                <v-btn variant="outlined" @click="itemOrderUp(item.id)"><v-icon class="text" size="x-large" icon="mdi-menu-up"></v-icon></v-btn>
                <v-btn variant="outlined" @click="itemOrderDown(item.id)"><v-icon class="text" size="x-large" icon="mdi-menu-down"></v-icon></v-btn>
              </div>
            </div>
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
        <v-select
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
        <v-select
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
  <v-dialog
    v-model="showDetailProgramPartItem"
    width="400"
  >
    <v-card>
      <v-card-title>Program Part Item Detail</v-card-title>
      <v-card-text>
        <v-text-field
          v-model="programPartItemDetail.name"
          clearable
          label="Item"
          :readonly="true"
        />
        <v-text-field v-model="programPartItemDetail.description" label="description"></v-text-field>
      </v-card-text>
      <v-card-actions style="display: flex;">
        <v-btn style="flex:1;" variant="flat" color="#CCCCFF" @click="modifyProgramPartItem(programPartItemDetail.id)">save</v-btn>
        <v-btn @click="showDetailProgramPartItem = false" style="flex:1;" variant="flat" color="#e8e8e8">cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { onMounted, getCurrentInstance, ref, computed, watch } from 'vue';
import { useStore } from "vuex";
import router from '@/router';

import CommonLayout from '@/components/CommonLayout.vue';

const axios = getCurrentInstance().proxy.axios;
const store = useStore();

const props = defineProps ({
  programId: Number
});

const title = computed(() => program.value.name + ' > Program Parts');

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

const isOrderMode = ref(false);

watch(
  isOrderMode, (value) => {
    if (selectedPart.value.id && !value) {
      getProgramPartItemList(selectedPart.value.id)
    }
  },
  { immediate: true }
);

const saveItemOrder = async () => {
  store.commit('setLoading', true);
  await axios.put(`/api/workout-programs/${props.programId}/parts/${selectedPart.value.id}/items`, itemList.value)
  .then(response => {
    isOrderMode.value = false;
  })
  .catch((error) => alert('수정 실패!'))
  .finally(() => store.commit('setLoading', false));
}

const itemOrderUp = (itemId) => {
  const tempItems = JSON.parse(JSON.stringify(itemList.value));
  const itemIndex = tempItems.findIndex(item => item.id == itemId);
  if (itemIndex == 0) {
    return;
  }
  const prevOrder = tempItems[itemIndex].order;
  tempItems[itemIndex].order = tempItems[itemIndex - 1].order;
  tempItems[itemIndex - 1].order = prevOrder;

  tempItems.sort((item1, item2) => item1.order - item2.order);

  itemList.value = tempItems;
}

const itemOrderDown = (itemId) => {

  const tempItems = JSON.parse(JSON.stringify(itemList.value));
  const itemIndex = tempItems.findIndex(item => item.id == itemId);
  if (itemIndex == (tempItems.length - 1)) {
    return;
  }
  const prevOrder = tempItems[itemIndex].order;
  tempItems[itemIndex].order = tempItems[itemIndex + 1].order;
  tempItems[itemIndex + 1].order = prevOrder;

  tempItems.sort((item1, item2) => item1.order - item2.order);

  itemList.value = tempItems;
  
}

const deleteProgramPartItem = async (itemId) => {
  if (!confirm("Delete it?")) {
    return;
  }
  store.commit('setLoading', true);
  await axios.delete(`/api/workout-programs/${props.programId}/parts/${selectedPart.value.id}/items/${itemId}`)
  .then(() => {
    alert('삭제 성공!');
    getProgramPartItemList(selectedPart.value.id);
  })
  .catch((error) => alert('삭제 실패!'))
  .finally(() => store.commit('setLoading', false));
}

const modifyProgramPartItem = async (itemId) => {
  store.commit('setLoading', true);
  await axios.put(`/api/workout-programs/${props.programId}/parts/${selectedPart.value.id}/items/${itemId}`, programPartItemDetail.value)
  .then(response => {
    showDetailProgramPartItem.value = false;
    programPartItemDetail.value = {};
    getProgramPartItemList(selectedPart.value.id);
  })
  .catch((error) => alert('수정 실패!'))
  .finally(() => store.commit('setLoading', false));
}

const getProgramPartItemDetail = async (itemId) => {
  store.commit('setLoading', true);
  await axios.get(`/api/workout-programs/${props.programId}/parts/${selectedPart.value.id}/items/${itemId}`)
  .then(response => {
    programPartItemDetail.value = response.data;
    showDetailProgramPartItem.value = true;
  })
  .catch((error) => {
    console.error(error);
    alert('조회 실패!');    
  })
  .finally(() => store.commit('setLoading', false));
}
const addProgramPartItem = async () => {
  if (!newProgramPartItem.value.workoutPartItemId) {
    return alert('Item을 선택하세요.');
  }
  store.commit('setLoading', true);
  newProgramPartItem.value.workoutProgramPartId = selectedPart.value.id;
  await axios.post(`/api/workout-programs/${props.programId}/parts/${selectedPart.value.id}/items`, newProgramPartItem.value)
  .then(response => {
    newProgramPartItem.value = {};
    showAddProgramPartItem.value = false;
    getProgramPartItemList(selectedPart.value.id);
  })
  .catch((error) => alert('저장 실패!'))
  .finally(() => store.commit('setLoading', false));
}

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
  if (selectedPart.value.id == part.id) {
    return;
  }
  getProgramPartItemList(part.id);
  selectedPart.value = part;
  isOrderMode.value = false;
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

        .number {
          flex: 1;
          margin: auto 0;
          width: 2rem;
          text-align: center;
        }
        .text {
          flex: 5;
          margin: auto 0;
        }

        .buttons {
          flex: 5;
          margin: auto 0;
          text-align: right;

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
