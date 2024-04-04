<template>
  <div class="space-wrapper">
    <div class="space-container">
      <div class="space-header">
        <div class="time">
          <div class="time-wrapper">
            <p class="text">Status</p>
            <p class="text">{{ routineInfo.statusName }}</p>
          </div>
          <div class="time-wrapper">
            <p class="text">isTotalTimeStarted at</p>
            <p class="text">{{ routineInfo.programStartedAt}}</p>
          </div>
          <div class="time-wrapper">
            <p class="text">{{ routineInfo.programDescription }}</p>
          </div>
        </div>
        <div class="description">
          <p class="text">Program</p>
          <p class="program-name">{{ routineInfo.programName }}</p>
        </div>
        <div class="buttons">
          <v-btn color="#8995FF" :disabled="routineInfo.status != '10' && routineInfo.status != '40'" @click="startRoutine(routineInfo.routineId)">start</v-btn>
          <v-btn :disabled="routineInfo.status != '20'" @click="finishRoutine(routineInfo.routineId)">finish</v-btn>
        </div>
      </div>
      <div class="space-body first">
        <div class="space-body-box">
          <div class="space-body-box-content">
            <div class="part">
              <p class="text large">Part / Item</p>
              <div class="content">
                <p class="part-name">{{ routineInfo.partName }}</p>
                <v-divider></v-divider>
                <p class="item-name">{{ routineInfo.itemName }}</p>
              </div>
              <div class="buttons">
                <v-btn variant="text" color="green">next</v-btn>
              </div>
            </div>
          </div>
        </div>
        <div class="space-body-box">
          <div class="space-body-box-content">
            <div class="set">
              <p class="text large">Count</p>
              <div class="content">
                <div class="row">
                  <div class="name"><p>Current</p></div>
                  <div class="counts">
                    <div class="count">{{ counterInfo.currentCount }}</div>
                    <v-divider vertical></v-divider>
                    <div class="count">{{ counterInfo.targetCount }}</div>
                  </div>
                </div>
                <div class="row">
                  <div class="name"><p>Total</p></div>
                  <div class="counts">
                    <div class="count">{{ counterInfo.currentTotalCount }}</div>
                    <v-divider vertical></v-divider>
                    <div class="count">{{ counterInfo.targetTotalCount }}</div>
                  </div>
                </div>
                <div class="row">
                  <div class="name"><p>Set</p></div>
                  <div class="counts">
                    <div class="count">{{ counterInfo.currentSet }}</div>
                    <v-divider vertical></v-divider>
                    <div class="count">{{ counterInfo.targetSet }}</div>
                  </div>
                </div>
              </div>
              <span></span>
            </div>
          </div>
          <div class="space-body-box-buttons">
            <div><v-btn @click="increaseCount" class="side-button" icon="mdi-plus"></v-btn></div>
            <div><v-btn @click="decreaseCount" class="side-button" icon="mdi-minus"></v-btn></div>
            <div><v-btn @click="setComplete" class="side-button" text="Set" icon></v-btn></div>
            <div><v-btn @click="clearSet" class="side-button" text="Clear" icon></v-btn></div>
          </div>
        </div>
      </div>
      <div class="space-body">
        <div class="space-body-box">
          <div class="space-body-box-content">
            <div class="progress">
              <p class="text large">Progress</p>
              <div class="bar-container">
                <div class="bar">
                  <div class="description">
                    <span>Part</span>
                    <span>{{ `${chartInfo.partCount} / ${chartInfo.totalPartCount}` }}</span>
                  </div>
                  <v-progress-linear
                    height="25"
                    v-model="partPercentage"
                    color="info"
                  >
                  <strong>{{ Math.ceil(chartInfo.partCount/chartInfo.totalPartCount) }}%</strong>
                  </v-progress-linear>
                </div>
                <div class="bar">
                  <div class="description">
                    <span>Item</span>
                    <span>{{ `${chartInfo.itemCount} / ${chartInfo.totalItemCount}` }}</span>
                  </div>
                  <v-progress-linear
                    height="25"
                    v-model="itemPercentage"
                    color="info"
                  >
                    <strong>{{ Math.ceil(chartInfo.itemCount/chartInfo.totalItemCount) }}%</strong>
                  </v-progress-linear>
                </div>
                <div class="bar">
                  <div class="description">
                    <span>Set</span>
                    <span>{{ `${chartInfo.setCount} / ${chartInfo.totalSetCount}` }}</span>
                  </div>
                  <v-progress-linear
                    height="25"
                    v-model="setPercentage"
                    color="info"
                  >
                    <strong>{{ Math.ceil(chartInfo.setCount/chartInfo.totalSetCount) }}%</strong>
                  </v-progress-linear>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="space-body-box">
          <div class="space-body-box-content">
            <div class="time">
              <p class="text large">Time</p>
              <div class="content">
                <div class="row">
                  <div class="name"><p>This Item</p></div>
                  <div class="time-item">
                    <p>{{ itemTime }}</p>
                  </div>                  
                </div>
                <div class="row">
                  <div class="name"><p>Rest</p></div>
                  <div class="time-item">
                    <p>{{ restTime }}</p>
                  </div>
                </div>
                <div class="row">
                  <div class="name"><p>Total</p></div>
                  <div class="time-item">
                    <p>{{ totalTime }}</p>
                  </div>
                </div>
              </div>
              <span></span>
            </div>
          </div>
          <div class="space-body-box-buttons">
            <div><v-btn @click="startItem" class="side-button" icon text="start"></v-btn></div>
            <div><v-btn class="side-button" icon text="stop"></v-btn></div>
            <div><v-btn @click="startRestTime" class="side-button" icon text="Rest"></v-btn></div>
            <div><v-btn class="side-button" icon text="Clear"></v-btn></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>

import { computed, getCurrentInstance, onMounted, ref } from "vue";
import { useStore } from "vuex";
import router from '../../../router';

const axios = getCurrentInstance().proxy.axios;
const store = useStore();

const routineInfo = ref({}); 
const counterInfo = ref({}); 
const timerInfo = ref({}); 
const chartInfo = ref({});

let isTotalTimeRunning = false;
let isTotalTimeStarted = null;

let isItemTimeRunning = false;
let isItemTimeStarted = null;

let isRestTimeRunning = false;
let isRestTimeStarted = null;
let currentRestTime = 0;

const partPercentage = computed(() => (chartInfo.value.partCount/chartInfo.value.totalPartCount));
const itemPercentage = computed(() => (chartInfo.value.itemCount/chartInfo.value.totalItemCount));
const setPercentage = computed(() => (chartInfo.value.setCount/chartInfo.value.totalSetCount));

const totalTime = ref('00:00:00');
const itemTime = ref('00:00:00');
const restTime = ref('00:00:00');
// const totalTime = computed(() => {
//   if (!timerInfo.value.programStartedAt) {
//     return "00:00";
//   }
//   let seconds = ((new Date().getTime() - new Date(timerInfo.value.programStartedAt).getTime()) / 1000).toFixed(0);
//   const minute = (seconds / 60).toFixed(0);
//   seconds = seconds % 60;
//   if (seconds < 10) {
//     seconds = '0' + seconds;
//   }
//   return `${minute}:${seconds}`;
// });

onMounted(() => {
  const workoutStr = localStorage.getItem('workout');
  if (workoutStr) {
    const workout = JSON.parse(localStorage.getItem('workout'));
    if (workout.id) {
      getWorkoutRoutine(workout.id);
    } else {
      alert('진행중인 프로그램이 없습니다.\n프로그램 선택 후 다시 시도하세요.');
      router.replace('/program-selection');
    }
  } else {
    alert('진행중인 프로그램이 없습니다.\n프로그램 선택 후 다시 시도하세요.');
    router.replace('/program-selection');
  }
})

const getWorkoutRoutine = async (id) => {
  store.commit('setLoading', true);
  await axios.get(`/api/workout-routines/${id}`)
  .then(response => {
    routineInfo.value = response.data.routineInfo;
    counterInfo.value = response.data.counter;
    timerInfo.value = response.data.timer;
    chartInfo.value = response.data.chart;

    if (routineInfo.value.status == '20') {
      startTotalTime();
    }
    if (routineInfo.value.itemStatus == '20') {
      startItemTime();
    }
    if (timerInfo.value.restTime) {
      currentRestTime = timerInfo.value.restTime + 1;
      setRestTime();
    }

  }).catch((error) => {
    console.error(error);
    alert('조회 실패!');
  })
  .finally(() => store.commit('setLoading', false));
}

const startRoutine = async (id) => {
  await axios.post(`/api/workout-routines/${id}/start`)
  .then(response => {
    getWorkoutRoutine(id);
    startTotalTime();
  }).catch((error) => {
    console.error(error);
    alert('요청 실패!');
  });
}

const finishRoutine = async (id) => {
  await axios.post(`/api/workout-routines/${id}/finish`)
  .then(response => {
    getWorkoutRoutine(id);
    stopTotalTime();
  }).catch((error) => {
    console.error(error);
    alert('요청 실패!');
  });
}

const startTotalTime = () => {
  if (isTotalTimeRunning) {
    return;
  }
  isTotalTimeRunning = true;
  isTotalTimeStarted = setInterval(() => {
    setTotalTime();
  }, 1000);
}

const stopTotalTime = () => {
  isTotalTimeRunning = false;
  clearInterval(isTotalTimeStarted);
}

const setTotalTime = () => {
  if (!timerInfo.value.programStartedAt) {
    totalTime.value = "00:00:00";
    return;
  }
  const currentSeconds = ((new Date().getTime() - new Date(timerInfo.value.programStartedAt).getTime()) / 1000).toFixed(0);

  let hour = Math.floor((currentSeconds / (60 * 60)));
  let min = Math.floor((currentSeconds % (60 * 60) / 60));
  let seconds = currentSeconds % 60;

  if (seconds < 10) {
    seconds = '0' + seconds;
  }
  if (min < 10) {
    min = '0' + min;
  }
  if (hour < 10) {
    hour = '0' + hour;
  }
  totalTime.value =`${hour}:${min}:${seconds}`;
}

const startItemTime = () => {
  if (isItemTimeRunning) {
    return;
  }
  isItemTimeRunning = true;
  isItemTimeStarted = setInterval(() => {
    setItemTime();
  }, 1000);
}

const stopItemTime = () => {
  isItemTimeRunning = false;
  clearInterval(isItemTimeStarted);
}

const setItemTime = () => {
  if (!timerInfo.value.itemStartedAt) {
    itemTime.value = "00:00:00";
    return;
  }
  const currentSeconds = ((new Date().getTime() - new Date(timerInfo.value.itemStartedAt).getTime()) / 1000).toFixed(0);

  let hour = Math.floor((currentSeconds / (60 * 60)));
  let min = Math.floor((currentSeconds % (60 * 60) / 60));
  let seconds = currentSeconds % 60;

  if (seconds < 10) {
    seconds = '0' + seconds;
  }
  if (min < 10) {
    min = '0' + min;
  }
  if (hour < 10) {
    hour = '0' + hour;
  }
  itemTime.value =`${hour}:${min}:${seconds}`;
}

const startRestTime = () => {
  if (isRestTimeRunning) {
    return;
  }
  isRestTimeRunning = true;
  isRestTimeStarted = setInterval(() => {
    setRestTime();
  }, 1000);
}

const stopRestTime = () => {
  isRestTimeRunning = false;
  clearInterval(isRestTimeStarted);
}

const setRestTime = () => {
  if (currentRestTime <= 0) {
    stopRestTime();
    currentRestTime = 0;
    restTime.value = "00:00:00";
    return;
  }
  const currentSeconds = --currentRestTime;

  let hour = Math.floor((currentSeconds / (60 * 60)));
  let min = Math.floor((currentSeconds % (60 * 60) / 60));
  let seconds = currentSeconds % 60;

  if (seconds < 10) {
    seconds = '0' + seconds;
  }
  if (min < 10) {
    min = '0' + min;
  }
  if (hour < 10) {
    hour = '0' + hour;
  }
  restTime.value =`${hour}:${min}:${seconds}`;
}

const increaseCount = () => {
  counterInfo.value.currentCount += 1;
}

const decreaseCount = () => {
  if (counterInfo.value.currentCount <= 0) {
    return;
  }
  counterInfo.value.currentCount -= 1;
}

const setComplete = async () => {
  if (counterInfo.value.currentCount == 0) return;
  await axios.post(`/api/workout-routines/${routineInfo.value.routineId}/parts/${routineInfo.value.routinePartId}/items/${routineInfo.value.routineItemId}/set`, counterInfo.value.currentCount)
  .then(response => {
    getWorkoutRoutine(routineInfo.value.routineId);
    // startTotalTime();
  }).catch((error) => {
    console.error(error);
    alert('요청 실패!');
  });
}

const clearSet = async () => {
  if (counterInfo.value.currentTotalCount == 0) return;
  await axios.post(`/api/workout-routines/${routineInfo.value.routineId}/parts/${routineInfo.value.routinePartId}/items/${routineInfo.value.routineItemId}/clear`)
  .then(response => {
    getWorkoutRoutine(routineInfo.value.routineId);
    // startTotalTime();
  }).catch((error) => {
    console.error(error);
    alert('요청 실패!');
  });
}

const startItem = async () => {
  // if (counterInfo.value.currentTotalCount == 0) return;
  await axios.post(`/api/workout-routines/${routineInfo.value.routineId}/parts/${routineInfo.value.routinePartId}/items/${routineInfo.value.routineItemId}/start`)
  .then(response => {
    getWorkoutRoutine(routineInfo.value.routineId);
  }).catch((error) => {
    console.error(error);
    alert('요청 실패!');
  });
}

</script>

<style lang="scss" scoped>
  .text {
    font-size: 0.8rem;
    color: #888888;

    &.large {
      font-size: 1.25rem;
      text-align: center;
    }
  }
  .space-wrapper {

    .space-container {
      margin: 5% auto;
      position: relative;
      width: 50rem;
      height: 40rem;

      display: flex;
      flex-flow: column;

      .space-header {
        background-color: #EFF0F1;
        border-radius: 10px;
        width: 100%;
        padding: 0.5rem;
        flex: 1;
        margin-bottom: 0.5rem;

        display: flex;

        .time {
          flex: 1;
          margin: auto;

          .time-wrapper {
            display: flex;
            padding: 0 1rem;

            p:nth-child(1) {
              flex:1;
            }
            p:nth-child(2) {
              flex:2;
            }
          }
        }
        .description {
          text-align: center;
          flex: 1;
          .program-name {
            font-size: 1.25rem;
            font-weight: bold;
          }
        }
        .buttons {
          flex: 1;
          display: flex;
          gap: 0.25rem;
          justify-content: end;
          button {
            margin: auto 0;
            height: 3.75rem;
            width: 3.75rem;
            border-radius: 50%;
            font-size: 0.8rem;
          }
        }
      }
      .space-body {
        flex: 4;
        display: flex;      
        margin-bottom: 0.5rem;
        gap: 0.5rem;

        .space-body-box {
          flex: 1;
          display: flex;
          gap: 0.5rem;

          .space-body-box-content {
            flex: 4;
            border-radius: 10px;
            background-color: #EFF0F1;

            .part {
              height: 100%;
              text-align: center;
              padding: 1rem 2rem;

              display: flex;
              flex-flow: column;

              p {
                flex:1;
              }
              span {
                flex:1;
              }
              .content {
                flex:4;
                height: 100%;

                display: flex;
                flex-flow: column;
                justify-content: center;

                .part-name, .item-name {
                  flex: 1;
                  font-weight: 500;
                  font-size: 1.75rem;
                  // margin: 0.5rem;
                  line-height: 5rem;
                }

              }

              .buttons {
                
                button {
                  float: right;                                    
                }
              }
            }

            .set, .time{
              height: 100%;
              text-align: center;
              padding: 1rem 2rem;

              display: flex;
              flex-flow: column;

              .content {
                height: 100%;
                display: flex;
                flex-flow: column;

                .row {
                  flex: 1;
                  display: flex;

                  .name {
                    flex: 1;                    
                    font-weight: 500;
                    font-size: 1.25rem;
                    margin: auto;

                    p {
                      text-align: left;                      
                    }
                  }

                  .counts {
                    flex:1;
                    display: flex;
                    margin: auto;

                    .count {
                      flex: 1;
                      font-weight: 500;
                      font-size: 1.5rem;
                      text-align: center;
                    }
                  }

                  .time-item {
                    flex:1;
                    display: flex;
                    margin: auto;
                    width: 100%;

                    p {
                      flex:1;
                      font-weight: 500;
                      font-size: 1.5rem;
                    }
                  }
                }
              }
            }
            .progress {
                padding: 1rem 2rem;
                display: flex;
                flex-flow: column;

                .bar-container {
                  padding: 1rem 0;
                  display: flex;
                  flex-flow: column;
                  gap: 0.5rem;

                  .bar {
                    // flex: 2;         
                  }

                .description {
                  flex: 1;

                  display: flex;
                  flex-flow: row;
                  justify-content: space-between;

                  > span {
                    // flex: 1;
                  }

                }

                }                
              }

          }
          
          .space-body-box-buttons {
            padding: 0.5rem;
            flex: 1;
            border-radius: 10px;
            background-color: #D9D9D9;

            display: flex;
            flex-flow: column;
            > div {
              flex: 1;
              margin: auto;

              display: flex;
            }

            .side-button {
              flex:1;
              margin: auto;
              width: 3.25rem;
              height: 3.25rem;
              border-radius: 50%;
              font-size: 0.8rem;
            }

            .disabled {
              cursor: not-allowed;
            }
          }
        }
      }
    }
  }
</style>