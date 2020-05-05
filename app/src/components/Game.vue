<template>
  <el-container>
    <el-header>game score :&nbsp;{{score}}</el-header>
    <el-main>
      <canvas id="screen" tabindex="0"></canvas>
    </el-main>
    <el-footer align="right">copyright 2020 bombardier2020 v{{version}}</el-footer>
  </el-container>
</template>

<script>
import { fabric } from "fabric";
import { version } from "../../package.json";

const FLOOR_TOP = 550;

export default {
  name: "Game",

  data() {
    return {
      version,
      score: 0,
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

    this.makeCloudsAndCars();
    //draw plane and start animate
    fabric.Image.fromURL(this.getBaseUrl() + "plane-96.png", function(oImg) {
      oImg.set("left", 10).set("top", 10);
      _self.$canvas.add(oImg);
      _self.$plane = oImg;
      _self.animatePlane();
    });

    this.drawBuildings();

    this.$canvas.add(this.makeLine([0, FLOOR_TOP, 1000, FLOOR_TOP]));
    //draw ground
    this.$canvas.add(
      new fabric.Rect({
        left: 0,
        top: 550,
        fill: "#615f5b",
        width: 1100,
        height: 200
      })
    );

    window.addEventListener("mouseup", this.onLaunchBomb);
  },

  methods: {
    makeLine(coords) {
      return new fabric.Line(coords, {
        fill: "red",
        stroke: "red",
        strokeWidth: 1,
        selectable: false,
        evented: false
      });
    },
    makeImage(left, top, image) {
      let _self = this;
      fabric.Image.fromURL(this.getBaseUrl() + image, function(oImg) {
        oImg.set("left", left).set("top", top);
        _self.$canvas.add(oImg);
      });
    },
    makeCloud(left, top) {
      this.makeImage(left, top, "nuages-30.png");
    },
    makeCar(left, top) {
      this.makeImage(left, top, "suv-40.png");
    },

    makeCloudsAndCars() {
      for (let i = 0; i < 11; i++) {
        this.makeCloud(10 + i * 100, 50);
        this.makeCloud(50 + i * 100, 100);
        this.makeCloud(10 + i * 100, 150);
        this.makeCar(10 + i * 100, 550);
      }
    },
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

    drawBuildings() {
      for (let i = 0; i < 11; i++) {
        let color = i % 2 === 0 ? "#005b5b" : "#005b00";
        this["building_" + i] = new fabric.Rect({
          left: 0 + i * 100,
          top: 200,
          fill: color,
          width: 100,
          height: 350
        });
        this["building_" + i].isDestroyed = false;
        this.$canvas.add(this["building_" + i]);
      }
    },

    hasPlaneImpactWithBuilding() {
      let currentBuilding = this[
        "building_" + Math.floor(this.$data.count / 10)
      ];

      return this.$plane.get("top") + 50 > currentBuilding.get("top");
    },
    animatePlane() {
      let canvas = this.$canvas;

      if (
        Math.floor(this.$data.count / 10) < 11 &&
        this.hasPlaneImpactWithBuilding()
      ) {
        console.log("*******impact*******", this.$data.count);
        localStorage.setItem("score", this.$data.score);
        this.$router.push("gameover");
        return false;
      }

      this.$data.count++;

      if (this.$plane.get("left") > 1000) {
        if (this.$plane.get("top") > FLOOR_TOP) {
          console.log("*******return*******");
          return false;
        }

        this.$data.count = 0;
        this.$plane.set("top", this.$plane.get("top") + 50);
      }

      this.$plane.set("left", 10 + this.$data.count * 10);
      canvas.renderAll();
      setTimeout(this.animatePlane, 100);
    },

    createBomb(left, top, buildingIndex) {
      let _self = this;
      fabric.Image.fromURL(this.getBaseUrl() + "bomb-40.png", function(oImg) {
        oImg.set("left", left).set("top", top);
        _self.$canvas.add(oImg);
        _self.$bomb = oImg;
        _self.$bomb.buildingIndex = Math.floor(buildingIndex / 10);
        _self.animateBomb(0);
      });
    },

    hasBombImpactWithBuilding() {
      let currentBuilding = this["building_" + this.$data.countBomb];

      return this.$bomb.get("top") + 50 > currentBuilding.get("top");
    },

    endAnimateBomb() {
      this.$data.bombLaunched = false;
      this.$data.countBomb = 0;
      this.createExplosion(this.$bomb.get("left"), this.$bomb.get("top"));
      this.$canvas.remove(this.$bomb);
    },
    breakBuilding() {
      let currentBuilding = this["building_" + this.$bomb.buildingIndex];
      let currentTop = currentBuilding.get("top");

      if (currentBuilding.isDestroyed === true) {
        return true;
      }

      if (currentTop + 100 > FLOOR_TOP) {
        currentTop = FLOOR_TOP;
        currentBuilding.isDestroyed = true;
      } else {
        currentTop += 100;
      }

      this.$data.score += 50;
      currentBuilding.set("top", currentTop);
    },
    animateBomb() {
      let canvas = this.$canvas;

      this.$data.countBomb++;
      if (this.hasBombImpactWithBuilding()) {
        this.breakBuilding();
        this.endAnimateBomb();
        return false;
      }

      if (this.$bomb.get("top") > FLOOR_TOP) {
        this.endAnimateBomb();
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
      this.createBomb(
        this.$plane.get("left") /*+ 25*/,
        this.$plane.get("top") + 10,
        this.$data.count
      );
    },

    createExplosion(left, top) {
      let _self = this;

      fabric.Image.fromURL(this.getBaseUrl() + "explosion-64.png", function(
        oImg
      ) {
        oImg.set("left", left).set("top", top);
        _self.$canvas.add(oImg);
        _self.$explosion = oImg;
        _self.animateExplosion();
      });
    },

    animateExplosion() {
      setTimeout(this.removeExplosion, 500);
    },

    removeExplosion() {
      this.$canvas.remove(this.$explosion);
    }
  }
};
</script>

<style scoped>
/*.el-main {
  margin-left: 20%;
}*/
</style>