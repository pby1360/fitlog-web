<template>
  <CommonLayout :title="title" :double="true">
    <template #box1>
      <div class="box-container">
        <div class="box-header">
          <p class="title">Sets</p>
          <div class="buttons">
            <v-btn @click="">Add</v-btn>
          </div>
        </div>
        <div class="box-content">
          <!-- <div v-if="partList.length > 0" class="item-wrapper">
            <div class="item" :class="selectedPart.id == part.id ? 'selected' : null" v-for="part in partList" :key="part.id" @click="selectPart(part)">
              <span class="text">{{ part.workoutPartName }}</span>
              <div class="buttons">
                <v-btn variant="outlined" @click="getProgramPartDetail(part.id)"><v-icon class="text" icon="mdi-magnify"></v-icon></v-btn>
                <v-btn variant="outlined" @click="deleteProgramPart(part.id)" color="red"><v-icon class="text" icon="mdi-delete-outline"></v-icon></v-btn>
              </div>
            </div>
          </div>
          <div v-else class="item-wrapper">
            No sets.
          </div> -->
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

// const title = computed(() => 'Program Parts > ' + program.value.name);
const title = 'Item Sets';

const init = () => {
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
