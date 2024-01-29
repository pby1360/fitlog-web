<template>
  <CommonLayout title="Select Program" :custom="true">
    <template #buttons>
      <v-btn @click="showProgramSelection = true" class="title-button">Programs</v-btn>
      <v-btn class="title-button">Reset</v-btn>
      <v-btn class="title-button">Complete</v-btn>
    </template>
    <template #box>
      <div class="program" v-if="selectedProgram.id">
        <div class="part-list" v-for="part in partList" :key="part.id">
          <div class="part">
            <span class="text">{{ part.workoutPartName }}</span>
            <div class="buttons">
              <v-btn variant="outlined" size="x-small" icon="mdi-menu-up"></v-btn>
              <v-btn variant="outlined" size="x-small" icon="mdi-menu-down"></v-btn>
              <v-btn variant="outlined" color="green" size="x-small" icon="mdi-plus" @click="getItemList(part.id, part.workoutPartId)"></v-btn>
              <v-btn variant="outlined" color="red" size="x-small" icon="mdi-delete-outline"></v-btn>
            </div>
          </div>
          <div class="item-list" v-if="part.items.length > 0">
            <div class="item" v-for="item in part.items" :key="item.id">
              <span class="text">{{ item.name }}</span>
              <div class="buttons">
                <v-btn variant="outlined" size="x-small" icon="mdi-menu-up"></v-btn>
                <v-btn variant="outlined" size="x-small" icon="mdi-menu-down"></v-btn>
                <v-btn variant="outlined" color="red" size="x-small" icon="mdi-delete-outline"></v-btn>
              </div>
            </div>
          </div>
          <div class="item-list" v-else>
            No items.
          </div>
        </div>
      </div>
      <div v-else>
        <p>Program을 선택하세요.</p>
      </div>
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
  <v-dialog
    v-model="showItemSelection"
    width="400"
  >
    <v-card>
      <v-card-title>Select Item</v-card-title>
      <v-card-text>
        <v-select
          v-model="tempSeletedItem"
          clearable
          label="Item"
          :items="itemComboList"
        />
      </v-card-text>
      <v-card-actions style="display: flex;">
        <v-btn style="flex:1;" variant="flat" color="#CCCCFF" @click="selectItem">Ok</v-btn>
        <v-btn @click="showItemSelection = false" style="flex:1;" variant="flat" color="#e8e8e8">cancel</v-btn>
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
let selectedProgramPartId;

const getPartList = async (workoutProgramId) => {
  await axios.get(`/api/workout-programs/${workoutProgramId}/parts?include=item`)
  .then(response => {
    const program = response.data;
    selectedProgram.value = {
      id: program.id,
      name: program.name,
      description: program.description
    }
    partList.value = response.data.workoutProgramPartList;
  }).catch(error => {
    console.error(error)
    alert('load failed!');
  });
};


/* program */

const showProgramSelection = ref(false);
const tempSeletedProgram = ref();
const selectedProgram = ref({});
const programList = ref([]);

const selectProgram = () => {
  const workoutProgramId = tempSeletedProgram.value;
  tempSeletedProgram.value = null;
  showProgramSelection.value = false;
  getPartList(workoutProgramId);
}

/* item */

const getItemList = async (programPartId, workoutPartId) => {
  selectedProgramPartId = programPartId;
  await axios.get(`/api/workout-master/${user.id}/parts/${workoutPartId}/items`)
  .then(response => {
    itemList = response.data.items;
    itemComboList.value = response.data.items.map(item => {
      return {title: item.name, value: item.id};
    });
    showItemSelection.value = true;
  }).catch(error => {
    console.error(error)
    alert('load failed!');
  });
}

const showItemSelection = ref(false);
const tempSeletedItem = ref();
// let selectedItem;
const itemComboList = ref([]);
let itemList = [];

const selectItem = () => {
  const itemIndex = itemList.findIndex(item => item.id == tempSeletedItem.value);
  const selectedItem = {
    workoutPartItemId: itemList[itemIndex].id,
    name: itemList[itemIndex].name,
  }
  const partIndex = partList.value.findIndex(part => part.id == selectedProgramPartId);
  partList.value[partIndex].items.push(selectedItem);
  tempSeletedItem.value = null;
  showItemSelection.value = false;
  // getPartList(itemId);
}

</script>

<style lang="scss" scoped>
.title-button {
  margin-left: 0.2rem;
  width: 7.5rem;
}
.program {
  display: flex;
  flex-flow: column;
  gap: 0.25rem;
  width: 100%;
  .part-list {
    
    .part {
      position: relative;
      padding: 0 0.5rem;
      background-color: #f9f9f9;
      border: solid 1px #c8c8c8;
      border-radius: 5px;
      height: 3rem;
      display: flex;
      justify-content: space-between;

      .text {
        margin: auto 0;
        flex: 1;
        font-weight: bold;
      }

      .buttons {
        flex: 1;
        margin-left: 0.2rem;
        display: flex;
        justify-content: end;
          gap: 0.1rem;


        button {
          margin: auto 0;
      }

      }

      &:hover {
        border: solid 1px black;
      }
    }
    .item-list {
        margin-top: -0.25rem;
        padding: 0.75rem 0.5rem 0.5rem;
        background-color: #e8e8e8;
        border: solid 1px #c8c8c8;
        border-top-left-radius: 0px;
        border-top-right-radius: 0px;
        border-bottom-left-radius: 5px;
        border-bottom-right-radius: 5px;
      .item {

        padding: 0 0.5rem;
        background-color: #f9f9f9;
        border: solid 1px #c8c8c8;
        border-radius: 5px;
        height: 3rem;
        display: flex;
        justify-content: space-between;

        .text {
          margin: auto 0;
          flex: 1;
        }

        .buttons {
          flex: 1;
          margin-left: 0.2rem;
          display: flex;
          justify-content: end;
          gap: 0.1rem;

          button {
            margin: auto 0;
          }
        }

        &:hover {
          border: solid 1px black;
        }

      }
    }
  }

}


</style>