<template>
  <div class="container">
    <!-- <p class="title">Master</p> -->
    <div class="title-bar">
      <p>Master</p>
    </div>
    <div class="box-wrapper">
      <div class="box">
        <div class="box-title">
          <p class="title">Part</p>
          <v-btn class="button-add" variant="tonal" color="info" @click="showAddPart = true">Add</v-btn>
        </div>
        <div class="item-wrapper">
          <div class="item" v-for="part in partList" :key="part.id" @click="selectPart(part.id)" :class="selectedPart == part.id ? 'selected' : ''">
            <span class="text">{{ part.name }}</span>
            <div class="buttons">
              <v-btn variant="outlined" @click="getPartDetail(part.id)"><v-icon class="text" icon="mdi-magnify"></v-icon></v-btn>
              <v-btn variant="outlined" color="red"><v-icon class="text" icon="mdi-delete-outline" @click="deletePart(part.id)"></v-icon></v-btn>
            </div>
          </div>
        </div>
      </div>
      <div class="box">
        <div class="box-title">
          <p class="title">Item</p>
          <v-btn v-if="selectedPart" class="button-add" variant="tonal" color="info" @click="showAddItem = true">Add</v-btn>
        </div>
        <div v-if="selectedPart && itemList.length > 0" class="item-wrapper">
          <div class="item" v-for="item in itemList" :key="item.id">
            <span class="text">{{ item.name }}</span>
            <div class="buttons">
              <v-btn variant="outlined" @click="getItemDetail(item.id)"><v-icon class="text" icon="mdi-magnify"></v-icon></v-btn>
              <v-btn variant="outlined" color="red"><v-icon class="text" icon="mdi-delete-outline" @click="deleteItem(item.id)"></v-icon></v-btn>
            </div>
          </div>
        </div>
        <div v-if="selectedPart && itemList.length == 0" class="item-wrapper">
          No item
        </div>
        <div v-else-if="!selectedPart && itemList.length == 0" class="item-wrapper">
          Please select a Part
        </div>
      </div>
    </div>
    <v-dialog
      v-model="showAddPart"
      width="400"
    >
      <v-card>
        <v-card-title>Add Part</v-card-title>
        <v-card-subtitle>Please enter the workout part</v-card-subtitle>
        <v-card-text>
          <v-text-field v-model="newPart.name" label="Name"></v-text-field>
          <v-text-field v-model="newPart.description" label="Description"></v-text-field>
        </v-card-text>
        <v-card-actions style="display: flex;">
          <v-btn style="flex:1;" variant="flat" color="#CCCCFF" @click="addPart">save</v-btn>
          <v-btn @click="showAddPart = false" style="flex:1;" variant="flat" color="#e8e8e8">cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="showPartDetail"
      width="400"
    >
      <v-card>
        <v-card-title>Part detail</v-card-title>
        <!-- <v-card-subtitle>Please enter the workout part</v-card-subtitle> -->
        <v-card-text>
          <v-text-field v-model="partDetail.name" label="Name"></v-text-field>
          <v-text-field v-model="partDetail.description" label="Description"></v-text-field>
          <v-text-field readonly v-model="partDetail.createdDate" label="Created date"></v-text-field>
          <v-text-field readonly v-model="partDetail.modifiedDate" label="Modified date"></v-text-field>
          <v-textarea v-model="partDetail.memo" label="Memo"></v-textarea>
        </v-card-text>
        <v-card-actions style="display: flex;">
          <v-btn style="flex:1;" variant="flat" color="#CCCCFF" @click="modifyPart">save</v-btn>
          <v-btn @click="showPartDetail = false" style="flex:1;" variant="flat" color="#e8e8e8">cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="showAddItem"
      width="400"
    >
      <v-card>
        <v-card-title>Add Item</v-card-title>
        <v-card-subtitle>Please enter the workout item</v-card-subtitle>
        <v-card-text>
          <v-text-field readonly label="Part"></v-text-field>
          <v-text-field v-model="newItem.name" label="Name"></v-text-field>
          <v-text-field v-model="newItem.description" label="Description"></v-text-field>
        </v-card-text>
        <v-card-actions style="display: flex;">
          <v-btn @click="addItem" style="flex:1;" variant="flat" color="#CCCCFF">save</v-btn>
          <v-btn @click="showAddItem = false" style="flex:1;" variant="flat" color="#e8e8e8">cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { onMounted, ref, getCurrentInstance } from "vue";
import { useStore } from "vuex";

const axios = getCurrentInstance().proxy.axios;
const store = useStore();

const showAddPart = ref(false);
const showAddItem = ref(false);
const showPartDetail = ref(false);

const partList = ref([]);
const newPart = ref({});
const partDetail = ref({});

const selectedPart = ref();
const itemList = ref([]);
const newItem = ref({});

const user = store.getters.getUser;

onMounted(() => {
  store.commit('setLoading', true);
  Promise.all([getPartList]).finally(() => store.commit('setLoading', false));
  getPartList();
});

const getPartList = async () => {  
  await axios.get(`/api/workout-master/${user.id}/parts`)
  .then(response => {
    partList.value = response.data;
  });
}

const addPart = async () => {
  if (!newPart.value.name) {
    alert('please enter name');
    return;
  }
  store.commit('setLoading', true);
  newPart.value.userId = user.id;
  await axios.post(`/api/workout-master/${user.id}/parts`, newPart.value)
  .then(response => {
    newPart.value = {};
    showAddPart.value = false;
    getPartList();
  })
  .catch((error) => alert('저장 실패!'))
  .finally(() => store.commit('setLoading', false));
}

const getPartDetail = async (partId) => {
  store.commit('setLoading', true);
  await axios.get(`/api/workout-master/${user.id}/parts/${partId}`)
  .then(response => {
    partDetail.value = response.data;
    showPartDetail.value = true;
  })
  .catch((error) => alert('조회 실패!'))
  .finally(() => store.commit('setLoading', false));
}

const modifyPart = async () => {
  if (!partDetail.value.name) {
    alert('please enter name');
    return;
  }
  store.commit('setLoading', true);
  partDetail.value.userId = user.id;
  await axios.put(`/api/workout-master/${user.id}/parts`, partDetail.value)
  .then(response => {
    showPartDetail.value = false;
    partDetail.value = {};
    getPartList();
  })
  .catch((error) => alert('수정 실패!'))
  .finally(() => store.commit('setLoading', false));
}

const deletePart = async (partId) => {  
  if (!confirm("Delete it?")) {
    return;
  }
  store.commit('setLoading', true);
  await axios.delete(`/api/workout-master/${user.id}/parts/${partId}`)
  .then(() => {
    alert('삭제 성공!');
    getPartList();
  })
  .catch((error) => alert('삭제 실패!'))
  .finally(() => store.commit('setLoading', false));
}

const selectPart = async (partId) => {
  selectedPart.value = partId;
  store.commit('setLoading', true);
  await axios.get(`/api/workout-master/${user.id}/parts/${partId}/items`)
  .then(response => {
    itemList.value = response.data.items;
  })
  .catch((error) => alert('조회 실패!'))
  .finally(() => store.commit('setLoading', false));
}

const addItem = async () => {
  if (!newItem.value.name) {
    alert('please enter name');
    return;
  }
  store.commit('setLoading', true);
  newItem.value.workoutPartId = selectedPart.value;
  await axios.post(`/api/workout-master/${user.id}/parts/${selectedPart.value}/items`, newItem.value)
  .then(response => {
    newItem.value = {};
    showAddItem.value = false;
    selectPart(selectedPart.value);
  })
  .catch((error) => alert('저장 실패!'))
  .finally(() => store.commit('setLoading', false));
}

const getItemDetail = async (itemId) => {
  store.commit('setLoading', true);
  await axios.get(`/api/workout-master/${user.id}/parts/${selectedPart.value}/items/${itemId}`)
  .then(response => {
    partDetail.value = response.data;
    showPartDetail.value = true;
  })
  .catch((error) => alert('조회 실패!'))
  .finally(() => store.commit('setLoading', false));
}

const modifyItem = async () => {
  if (!partDetail.value.name) {
    alert('please enter name');
    return;
  }
  store.commit('setLoading', true);
  partDetail.value.userId = user.id;
  await axios.put(`/api/workout-master/${user.id}/parts`, partDetail.value)
  .then(response => {
    showPartDetail.value = false;
    partDetail.value = {};
    getPartList();
  })
  .catch((error) => alert('수정 실패!'))
  .finally(() => store.commit('setLoading', false));
}

const deleteItem = async (itemId) => {  
  if (!confirm("Delete it?")) {
    return;
  }
  store.commit('setLoading', true);
  await axios.delete(`/api/workout-master/${user.id}/parts/${selectedPart.value}/items/${itemId}`)
  .then(() => {
    alert('삭제 성공!');
    getPartList();
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
  }
  .box-wrapper {
    display: flex;
    gap: 0.5rem;

    .box {
      padding: 1rem;
      background-color: #fff;
      border: solid 1px black;
      min-width: 15rem;
      width: 25rem;
      border-radius: 5px;
      // box-shadow: 2px 2px 3px #ccccff;

      .box-title {
        display: flex;
        justify-content: space-between;
        .title {
          font-weight: bold;
          margin: auto 0;
        }
      }

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
}
</style>