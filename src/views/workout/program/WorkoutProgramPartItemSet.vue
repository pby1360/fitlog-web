<template>
  <CommonLayout :title="title" :double="true">
    <template #box1>
      <div class="box-container">
        <div class="box-header">
          <p class="title">Sets</p>
          <div class="buttons">
            <v-btn @click="showProgramPartItemSetAdd = true">Add</v-btn>
          </div>
        </div>
        <div class="box-content">
          <div v-if="programPartItemSetList.length > 0" class="item-wrapper">
            <div class="item" :class="selectedSet.id == set.id ? 'selected' : null" v-for="set in programPartItemSetList" :key="set.id" @click="selectSet(set)">
              <span class="text">{{ set.order }}</span>
              <span class="text">{{ set.description }}</span>
              <div class="buttons">
                <!-- <v-btn variant="outlined" @click="deleteProgramPart(part.id)" color="red"><v-icon class="text" icon="mdi-delete-outline"></v-icon></v-btn> -->
              </div>
            </div>
          </div>
          <div v-else class="item-wrapper">
            No sets.
          </div>
        </div>
      </div>
    </template>
    <template #box2>
      <div class="box-container">
        <div class="box-header">
          <p class="title">Set Detail</p>
          <div class="buttons">
            <!-- <v-btn v-show="selectedPart.id" @click="showAddProgramPartItem = true">Add</v-btn> -->
          </div>
        </div>
        <div class="box-content">
          <!-- <div v-if="!selectedPart.id" class="item-wrapper">
            Select Set.
          </div>
          <div v-else class="item-wrapper">
            Set information
          </div> -->
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

const title = computed(() => 'Item Sets > ' + programPartItem.value.name);

const showProgramPartItemSetAdd = ref(false);

const nextNumber = computed(() => programPartItemSetList.value.length + 1);
const newProgramPartItemSet = ref({});

const programPartItem = ref({});
const programPartItemSetList = ref([]);

const selectedSet = ref ({});

const isOrderMode = ref(false);

const selectSet = (set) => {
  if (selectedSet.value.id == set.id) {
    return;
  }
  // getProgramPartItemList(part.id);
  selectedSet.value = set;
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
