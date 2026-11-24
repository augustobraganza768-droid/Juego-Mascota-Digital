
import Phaser from "phaser";
import "./style.css";

import RoomScene from "./scenes/RoomScene.js";
import HUD from "./ui/HUD.js";

class BootScene extends Phaser.Scene {
  constructor() {
    super("BootScene");
  }

  create() {
    this.add.rectangle(640, 360, 1280, 720, 0xfff0e8);

    this.add.text(640, 280, "PuppiLOVE", {
      fontFamily: "Nunito",
      fontSize: "76px",
      fontStyle: "bold",
      color: "#e58b9a",
    }).setOrigin(0.5);

    this.add.text(640, 370, "Un pequeño mundo lleno de amor", {
      fontFamily: "Nunito",
      fontSize: "25px",
      color: "#92747b",
    }).setOrigin(0.5);

    this.add.text(640, 490, "MUY PRONTO...", {
      fontFamily: "Nunito",
      fontSize: "18px",
      fontStyle: "bold",
      color: "#bd8995",
    }).setOrigin(0.5);

    this.scene.start("RoomScene");
  }
}

const config = {
  type: Phaser.AUTO,
  width: 1280,
  height: 720,
  parent: "game-container",
  backgroundColor: "#fff0e8",
  pixelArt: true,

  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },

  scene: [BootScene, RoomScene, HUD],
};

document.querySelector("#start-game").addEventListener("click", () => {
  document.querySelector("#welcome").hidden = true;
  document.querySelector("#play-view").hidden = false;
  document.body.classList.add("playing");
  new Phaser.Game(config);
}, { once: true });
