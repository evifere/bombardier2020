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
      version,
      count: 0,
      countBomb: 0,
      bombLaunched: false
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
      _self.animatePlane();
    });

    window.addEventListener("mouseup", this.onLaunchBomb);
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
    },

    animatePlane() {
      let canvas = this.$canvas;

      this.$data.count++;
      if (this.$plane.get("left") > 1000) {
        if (this.$plane.get("top") > 500) {
          console.log("*******return*******");
          return false;
        }

        this.$data.count = 10;
        this.$plane.set("top", this.$plane.get("top") + 50);
      }

      this.$plane.set("left", 10 + this.$data.count * 10);
      canvas.renderAll();
      setTimeout(this.animatePlane, 100);
    },

    createBomb(left, top) {
      let _self = this;

    fabric.Image.fromURL(this.getBaseUrl() + "bomb-40.png", function(oImg) {
        oImg.set("left", left).set("top", top);
        _self.$canvas.add(oImg);
        _self.$bomb = oImg;
        _self.animateBomb(0);
      });
    },

    animateBomb() {
      let canvas = this.$canvas;

      this.$data.countBomb++;
      if (this.$bomb.get("top") > 500) {
        this.$data.bombLaunched = false;
        this.$data.countBomb = 0;
        return false;
      }

      this.$bomb.set("top", this.$bomb.get("top") + this.$data.countBomb * 10);
      canvas.renderAll();
      setTimeout(this.animateBomb, 250);
    },
    onLaunchBomb() {
      if (this.$data.bombLaunched === true) {
        return false;
      }
      this.$data.bombLaunched = true;
      this.createBomb(this.$plane.get("left"), this.$plane.get("top") + 10);
    }
  }
};
</script>

<style scoped>
.el-main {
  margin-left: 20%;
}
</style>