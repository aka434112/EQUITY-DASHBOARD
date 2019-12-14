<template>
  <div><div class="circle">{{value}}</div> &nbsp;<div class="circleText">{{title}}</div></div>
</template>

<script>
export default {
  name: 'infoInCircle',
  props: {
    value: {
      type: String
    },
    title: {
      type: String
    }
  }
}
</script>

<style scoped>
.circle {
  border-radius: 49%;
  border: 5px solid orange;
  display: inline-block;
  font-size: 25px;
  text-align: center;
  vertical-align: middle;
  line-height: 88px;
  font-weight: 800;
  width: 100px !important;
  height: 100px;
}
.circleContainer {
  text-align: center !important;
}
.circleText {
  display: inline-block;
}
</style>
