<template>
  <div class="container">
    <!-- <p class="title">Master</p> -->
    <div class="box-wrapper">
      <div class="box">
        <p class="box-title">Part</p>
        <div class="item-wrapper">
          <div class="item"><span class="text">광배근</span></div>
          <div class="item"><span class="text">대흉근</span></div>
          <div class="item add"><v-icon class="text" icon="mdi-plus"></v-icon></div>
        </div>
      </div>
      <div class="box">
        <p class="box-title">Item</p>
        <div class="item-wrapper">
          <div class="item"><span class="text">벤치프레스</span></div>
          <div class="item"><span class="text">딥스</span></div>
          <div class="item"><span class="text">밀리터리프레스</span></div>
          <div class="item add"><v-icon class="text" icon="mdi-plus"></v-icon></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.container {
  padding: 2rem;

  .title {
    font-size: large;
    font-weight: bold;
  }
  .box-wrapper {
    display: flex;
    gap: 20px;

    .box {
      padding: 1rem;
      background-color: #fff;
      border: solid 1px black;
      min-width: 15rem;
      width: 25rem;
      border-radius: 5px;

      .box-title {
        font-weight: bold;
      }

      .item-wrapper {
        display: flex;
        flex-flow: column;
        padding: 1rem 0;
        gap: 0.25rem;
        
        .item {
          background-color: #e8e8e8;
          border: solid 1px #c8c8c8;
          border-radius: 5px;
          height: 3rem;
          display: flex;

          &.add {
            background-color: skyblue;
            border: none;
          }

          &:hover {
            border: solid 1px black;
          }

          .text {
            margin: auto;
          }
        }
      }
    }
  }
}
</style>