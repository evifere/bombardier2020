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
    let _self = this;

    this.$canvas = new fabric.StaticCanvas("screen", {
      width: 1100,
      height: 700,
      backgroundColor: "blue"
    });

    fabric.Image.fromURL(this.getBaseUrl() + "plane-96.png", function(oImg) {
      oImg.set("left", 10).set("top", 10);
      _self.$canvas.add(oImg);
      _self.$plane = oImg;
    });
  },

  methods: {
    getBaseUrl() {
      let baseUrl =
        process.env.NODE_ENV === "production"
          ? "http://evifere.lescigales.org/bombardier2020/img/"
          : "./img/";

      if (window.location.hostname === "evifere.github.io") {
        baseUrl = "https://evifere.github.io/bombardier2020/img/";
      }

      return baseUrl;
    }
  }
};
</script>

<style scoped>
.el-main {
  margin-left: 20%;
}
</style>