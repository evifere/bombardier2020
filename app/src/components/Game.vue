<template>
  <el-container>
    <el-header>game score</el-header>
    <el-main>
      <canvas id="screen" tabindex="0"></canvas>
    </el-main>
    <el-footer align="right">copyright 2020 bombardier2020 v{{version}}</el-footer>
  </el-container>
</template>

<script>
import { fabric } from "fabric";
import { version } from "../../package.json";

export default {
  name: "Game",

  data() {
    return {
      version
    };
  },
  mounted() {
    this.$canvas = new fabric.Canvas("screen", {
      width: 1100,
      height: 700,
      backgroundColor: "blue"
    });
  }
};
</script>

<style scoped>
.el-main {
  margin-left: 20%;
}
</style>