<template>
  <CommonLayout title="Select Program" :custom="true">
    <template #buttons>
      <v-btn variant="outlined" @click="showProgramSelection = true" class="title-button">Program</v-btn>
      <v-btn variant="outlined" color="error" @click="clearProgram" class="title-button">Clear</v-btn>
      <v-btn variant="outlined" color="success" @click="saveProgram" class="title-button">Complete</v-btn>
      <!-- <v-btn class="title-button">Expand</v-btn>
      <v-btn class="title-button">Collapse</v-btn> -->
    </template>
    <template #box>
      <div class="program" v-if="selectedProgram.id">
        <div class="part-wrapper" v-for="part in partList" :key="part.id">
          <div class="part"  @click="togglePart(part.id)">
            <span class="text">{{ part.workoutPartName }}</span>
            <div class="buttons">
              <v-btn @click.stop="upPartOrder(part.id)" variant="outlined" size="x-small" icon="mdi-menu-up"></v-btn>
              <v-btn @click.stop="downPartOrder(part.id)" variant="outlined" size="x-small" icon="mdi-menu-down"></v-btn>
              <v-btn @click.stop="getItemList(part.id, part.workoutPartId)" variant="outlined" color="green" size="x-small" icon="mdi-plus"></v-btn>
              <v-btn @click.stop="removePart(part.id)" variant="outlined" color="red" size="x-small" icon="mdi-delete-outline"></v-btn>
            </div>
          </div>
          <div class="item-list" v-show="part.items.length > 0 && part.isOpen">
            <div class="item" v-for="item in part.items" :key="item.id">
              <span class="text">{{ item.name }}</span>
              <div class="buttons">
                <v-btn @click.stop="upItemOrder(part.id, item.id)" variant="outlined" size="x-small" icon="mdi-menu-up"></v-btn>
                <v-btn @click.stop="downItemOrder(part.id, item.id)" variant="outlined" size="x-small" icon="mdi-menu-down"></v-btn>
                <v-btn @click.stop="removeItem(part.id, item.id)" variant="outlined" color="red" size="x-small" icon="mdi-delete-outline"></v-btn>
              </div>
            </div>
          </div>
          <div class="item-list" v-show="part.items.length == 0 &&  part.isOpen">
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
import router from '../../../router';

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
    let tempPartList = response.data.workoutProgramPartList;
    tempPartList.forEach((part, index) => {
      part.isOpen = false;
      part.order = index + 1;
    });
    partList.value = tempPartList;
  }).catch(error => {
    console.error(error)
    alert('load failed!');
  });
};

const togglePart = (partId) => {
  const index = partList.value.findIndex(part => part.id == partId);
  if (index < 0) {
    return;
  }
  partList.value[index].isOpen = !partList.value[index].isOpen;
};

const upPartOrder = (partId) => {
  const tempParts = JSON.parse(JSON.stringify(partList.value));
  const partIndex = tempParts.findIndex(part => part.id == partId);
  if (partIndex == 0) {
    return;
  }
  const prevOrder = tempParts[partIndex].order;
  tempParts[partIndex].order = tempParts[partIndex - 1].order;
  tempParts[partIndex - 1].order = prevOrder;

  tempParts.sort((item1, item2) => item1.order - item2.order);

  partList.value = tempParts;
}

const downPartOrder = (partId) => {
  const tempParts = JSON.parse(JSON.stringify(partList.value));
  const partIndex = tempParts.findIndex(part => part.id == partId);
  if (partIndex == (tempParts.length -1)) {
    return;
  }
  const prevOrder = tempParts[partIndex].order;
  tempParts[partIndex].order = tempParts[partIndex + 1].order;
  tempParts[partIndex + 1].order = prevOrder;

  tempParts.sort((item1, item2) => item1.order - item2.order);

  partList.value = tempParts;
}

const removePart = (partId) => {
  const tempParts = JSON.parse(JSON.stringify(partList.value));
  const partIndex = tempParts.findIndex(part => part.id == partId);
  
  if (partIndex < 0) {
    return;
  }

  tempParts.splice(partIndex, 1);
  tempParts.forEach((part, index) => part.order = index + 1);

  partList.value = tempParts;
}


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

const clearProgram = () => {
  selectedProgram.value ={};
  partList.value = [];
}

const saveProgram = async () => {
  if (!selectedProgram.value.id) {
    alert('프로그램을 선택하세요.');
    return;
  }

  store.commit('setLoading', true);
  
  const workoutRoutinePartList = partList.value.map(part => {
    
    const workoutRoutineItemList = part.items.map(item => {
      const routineItem = {
        workoutProgramPartItemId: item.id,
        workoutPartItemId: item.workoutPartItemId,
        name: item.name,
        order: item.order,
        description: item.description
      }
      return routineItem;
    })

    const routinePart = {
        workoutPartId: part.workoutPartId,
        name: part.workoutPartName,
        order: part.order,
        description: part.description,
        workoutRoutineItemList: workoutRoutineItemList
      }
      return routinePart;
  });

  const workoutRoutine = {
    userId: user.id,
    workoutProgramId: selectedProgram.value.id,
    name: selectedProgram.value.name,
    description: selectedProgram.value.description,
    workoutRoutinePartList: workoutRoutinePartList
  };

  await axios.post(`/api/workout-routines`, workoutRoutine)
  .then(response => {
    const workout = {
      id: response.data.id,
      name: response.data.name,
    }
    localStorage.setItem('workout', JSON.stringify(workout));
    alert('저장 성공');
    router.replace('/workout-space');
  })
  .catch((error) => alert('저장 실패!'))
  .finally(() => store.commit('setLoading', false));
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
  const partIndex = partList.value.findIndex(part => part.id == selectedProgramPartId);

  const selectedItem = {
    workoutPartItemId: itemList[itemIndex].id,
    name: itemList[itemIndex].name,
    order: partList.value[partIndex].items.length + 1
  }

  partList.value[partIndex].items.push(selectedItem);
  tempSeletedItem.value = null;
  showItemSelection.value = false;
}

const upItemOrder = (partId, itemId) => {
  const partIndex = partList.value.findIndex(part => part.id == partId);
  if (partIndex < 0) {
    return;
  }
  const tempItems = JSON.parse(JSON.stringify(partList.value[partIndex].items));

  const itemIndex = tempItems.findIndex(item => item.id == itemId);
  if (itemIndex == 0) {
    return;
  }

  const prevOrder = tempItems[itemIndex].order;
  tempItems[itemIndex].order = tempItems[itemIndex - 1].order;
  tempItems[itemIndex - 1].order = prevOrder;

  tempItems.sort((item1, item2) => item1.order - item2.order);

  partList.value[partIndex].items = tempItems;
}

const downItemOrder = (partId, itemId) => {
  const partIndex = partList.value.findIndex(part => part.id == partId);
  if (partIndex < 0) {
    return;
  }
  const tempItems = JSON.parse(JSON.stringify(partList.value[partIndex].items));

  const itemIndex = tempItems.findIndex(item => item.id == itemId);
  if (itemIndex == (tempItems.length -1)) {
    return;
  }

  const prevOrder = tempItems[itemIndex].order;
  tempItems[itemIndex].order = tempItems[itemIndex + 1].order;
  tempItems[itemIndex + 1].order = prevOrder;

  tempItems.sort((item1, item2) => item1.order - item2.order);

  partList.value[partIndex].items = tempItems;
}

const removeItem = (partId, itemId) => {
  const partIndex = partList.value.findIndex(part => part.id == partId);
  if (partIndex < 0) {
    return;
  }

  const tempItems = JSON.parse(JSON.stringify(partList.value[partIndex].items));
  const itemIndex = tempItems.findIndex(item => item.id == itemId);
  if (itemIndex < 0) {
    return;
  }

  tempItems.splice(itemIndex, 1);
  tempItems.forEach((part, index) => part.order = index + 1);

  partList.value[partIndex].items = tempItems;
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
  .part-wrapper {
    
    .part {
      position: relative;
      padding: 0 0.5rem;
      background-color: #f9f9f9;
      border: solid 1px #c8c8c8;
      border-radius: 5px;
      height: 3rem;
      display: flex;
      justify-content: space-between;

      &:hover {
        cursor: pointer;
      }

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