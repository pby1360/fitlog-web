<template>
  <CommonLayout :title="title" :double="true">
    <template #box1>
      <div v-show="!isOrderMode" class="box-container">
        <div class="box-header">
          <p class="title">Sets</p>
          <div class="buttons">
            <v-btn @click="showProgramPartItemSetAdd = true">Add</v-btn>
            <v-btn :disabled="programPartItemSetList.length < 2" color="purple-lighten-4" @click="isOrderMode = true">Order</v-btn>
          </div>
        </div>
        <div class="box-content">
          <div v-if="programPartItemSetList.length > 0" class="item-wrapper">
            <div class="item" :class="selectedSet.id == set.id ? 'selected' : null" v-for="set in programPartItemSetList" :key="set.id" @click="selectSet(set)">
              <span class="number">{{ set.order }}</span>
              <span class="text">{{ set.description }}</span>
              <div class="buttons">
                <v-btn variant="outlined" @click="deleteSet(set.id)" color="red"><v-icon class="text" icon="mdi-delete-outline"></v-icon></v-btn>
              </div>
            </div>
          </div>
          <div v-else class="item-wrapper">
            No sets.
          </div>
        </div>
      </div>
      <div v-show="isOrderMode" class="box-container">
        <div class="box-header">
          <p class="title">Sets</p>
          <div class="buttons">
            <v-btn variant="outlined" color="success" @click="saveSetOrder">Save</v-btn>
            <v-btn variant="outlined" color="error" @click="isOrderMode=false">Cancel</v-btn>
          </div>
        </div>
        <div class="box-content">
          <div class="item-wrapper">
            <div class="item" v-for="set in programPartItemSetList" :key="set.id">
              <span class="number">{{ set.order }}</span>
              <span class="text">{{ set.description }}</span>
              <div class="buttons">
                <v-btn variant="outlined" @click="setOrderUp(set.id)"><v-icon class="text" size="x-large" icon="mdi-menu-up"></v-icon></v-btn>
                <v-btn variant="outlined" @click="setOrderDown(set.id)"><v-icon class="text" size="x-large" icon="mdi-menu-down"></v-icon></v-btn>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template #box2>
      <div class="box-container">
        <div class="box-header">
          <p class="title">Set Detail</p>
          <div class="buttons">
            <v-btn v-show="selectedSet.id" @click="saveSetDetail">Save</v-btn>
          </div>
        </div>
        <div class="box-content">
          <div v-if="!selectedSet.id" class="item-wrapper">
            Select Set.
          </div>
          <div v-else class="item-wrapper">
            <v-text-field v-model="selectedSet.description" label="description"></v-text-field>
            <v-text-field type="number" label="count" v-model="selectedSet.count"></v-text-field>
            <v-text-field type="number" label="rest time" v-model="selectedSet.restTime"></v-text-field>
            <v-text-field :readonly=true type="text" label="created date" v-model="selectedSet.createdDate"></v-text-field>
            <v-text-field :readonly=true type="text" label="modified date" v-model="selectedSet.modifiedDate"></v-text-field>
            <v-textarea label="memo" v-model="selectedSet.memo"></v-textarea>
          </div>
        </div>
      </div>
    </template>
  </CommonLayout>
  <v-dialog
    v-model="showProgramPartItemSetAdd"
    width="400"
  >
    <v-card>
      <v-card-title>Add Program Part Item Set</v-card-title>
      <v-card-text>
        <v-text-field v-model="nextNumber" label="no" :readonly=true></v-text-field>
        <v-text-field v-model="newProgramPartItemSet.description" label="description"></v-text-field>
        <v-text-field v-model="newProgramPartItemSet.count" type="number" label="count"></v-text-field>
        <v-text-field v-model="newProgramPartItemSet.restTime" type="number" label="rest time"></v-text-field>
      </v-card-text>
      <v-card-actions style="display: flex;">
        <v-btn style="flex:1;" variant="flat" color="#CCCCFF" @click="addProgramPartItemSet">save</v-btn>
        <v-btn @click="showProgramPartItemSetAdd = false" style="flex:1;" variant="flat" color="#e8e8e8">cancel</v-btn>
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
  programId: Number,
  partId: Number,
  itemId: Number,
});

const title = computed(() => programPartItem.value.name + ' > Item Sets');

const showProgramPartItemSetAdd = ref(false);

const nextNumber = computed(() => programPartItemSetList.value.length + 1);
const newProgramPartItemSet = ref({});

const programPartItem = ref({});
const programPartItemSetList = ref([]);

const selectedSet = ref ({});

const isOrderMode = ref(false);

watch(
  isOrderMode, (value) => {
    if (programPartItem.value.id && !value) {
      getProgramPartItemSetList()
    }
  },
  { immediate: true }
);

const saveSetOrder = async () => {
  store.commit('setLoading', true);
  await axios.put(`/api/workout-programs/${props.programId}/parts/${props.partId}/items/${props.itemId}/sets`, programPartItemSetList.value)
  .then(response => {
    isOrderMode.value = false;
  })
  .catch((error) => alert('수정 실패!'))
  .finally(() => store.commit('setLoading', false));
}

const setOrderUp = (setId) => {
  const tempSets = JSON.parse(JSON.stringify(programPartItemSetList.value));
  const setIndex = tempSets.findIndex(set => set.id == setId);
  if (setIndex == 0) {
    return;
  }
  const prevOrder = tempSets[setIndex].order;
  tempSets[setIndex].order = tempSets[setIndex - 1].order;
  tempSets[setIndex - 1].order = prevOrder;

  tempSets.sort((item1, item2) => item1.order - item2.order);

  programPartItemSetList.value = tempSets;
}

const setOrderDown = (setId) => {

  const tempSets = JSON.parse(JSON.stringify(programPartItemSetList.value));
  const setIndex = tempSets.findIndex(set => set.id == setId);
  if (setIndex == (tempSets.length - 1)) {
    return;
  }
  const prevOrder = tempSets[setIndex].order;
  tempSets[setIndex].order = tempSets[setIndex + 1].order;
  tempSets[setIndex + 1].order = prevOrder;

  tempSets.sort((item1, item2) => item1.order - item2.order);

  programPartItemSetList.value = tempSets;
  
}

const deleteSet = async (setId) => {
  if (!confirm('Delete it?')) {
    return;
  }
  store.commit('setLoading', true);
  await axios.delete(`/api/workout-programs/${props.programId}/parts/${props.partId}/items/${props.itemId}/sets/${setId}`)
  .then(response => {
    selectedSet.value = {};
    getProgramPartItemSetList();
  })
  .catch((error) => alert('수정 실패!'))
  .finally(() => store.commit('setLoading', false));
}

const saveSetDetail = async () => {
  if (!confirm('Save it?')) {
    return;
  }
  store.commit('setLoading', true);
  await axios.put(`/api/workout-programs/${props.programId}/parts/${props.partId}/items/${props.itemId}/sets/${selectedSet.value.id}`, selectedSet.value)
  .then(response => {
    getProgramPartItemSetList();
  })
  .catch((error) => alert('수정 실패!'))
  .finally(() => store.commit('setLoading', false));
}

const selectSet = (set) => {
  if (selectedSet.value.id == set.id) {
    return;
  }
  const copy = { ...set };
  selectedSet.value = copy;
  isOrderMode.value = false;
};

const addProgramPartItemSet = async () => {
  if (!newProgramPartItemSet.value.count) {
    return alert('Count를 선택하세요.');
  }
  if (!newProgramPartItemSet.value.restTime) {
    return alert('Rest time을 선택하세요.');
  }
  store.commit('setLoading', true);
  newProgramPartItemSet.value.workoutProgramPartItemId = props.itemId;
  await axios.post(`/api/workout-programs/${props.programId}/parts/${props.partId}/items/${props.itemId}/sets`, newProgramPartItemSet.value)
  .then(response => {
    newProgramPartItemSet.value = {};
    showProgramPartItemSetAdd.value = false;
    getProgramPartItemSetList();
  })
  .catch((error) => alert('저장 실패!'))
  .finally(() => store.commit('setLoading', false));
};

const getProgramPartItemSetList = async () => {
  store.commit('setLoading', true);
  await axios.get(`/api/workout-programs/${props.programId}/parts/${props.partId}/items/${props.itemId}/sets`)
  .then(response => {
    programPartItem.value = {
      id: response.data.id,
      name: response.data.name,
    };
    programPartItemSetList.value = response.data.WorkoutProgramPartItemSets;
    if (selectedSet.value.id) {
      const index = programPartItemSetList.value.findIndex(item => item.id == selectedSet.value.id);
      const set = programPartItemSetList.value[index];
      const copy = { ...set };
      selectedSet.value = copy;
    }
  })
  .catch((error) => {
    console.error(error)
    alert('조회 실패');
  })
  .finally(() => store.commit('setLoading', false));
}

const init = () => {
  getProgramPartItemSetList();
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
          text-align: left;
        }
        .text {
          flex: 2;
          margin: auto 0;
          text-align: center;
        }

        .buttons {
          flex: 1;
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
