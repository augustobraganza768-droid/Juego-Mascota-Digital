import Phaser from "phaser";
import Toby from "../entities/Toby.js";
import PetStats from "../systems/PetStats.js";
import SaveSystem from "../systems/SaveSystem.js";

export default class RoomScene extends Phaser.Scene {
  constructor() {
    super("RoomScene");
  }

  create() {
    const { width, height } = this.scale;

    this.createRoom(width, height);

    // Cargar partida guardada
    const savedData = SaveSystem.load();
    this.petStats = new PetStats(savedData);

    // Toby conserva su posición y zona de movimiento originales.
    this.toby = new Toby(this, 640, 520, this.petStats);

    this.scene.launch("HUD", {
      petStats: this.petStats,
      toby: this.toby,
    });

    this.autoSaveTimer = 0;

    this.pageHideHandler = () => SaveSystem.save(this.petStats);
    window.addEventListener("pagehide", this.pageHideHandler);
    this.visibilityHandler = () => { if (document.hidden) this.pageHideHandler(); };
    document.addEventListener("visibilitychange", this.visibilityHandler);

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      SaveSystem.save(this.petStats);
      window.removeEventListener("pagehide", this.pageHideHandler);
      document.removeEventListener("visibilitychange", this.visibilityHandler);
    });
  }

  createRoom(width, height) {
    // Base de la habitación.
    this.add.rectangle(width / 2, height / 2, width, height, 0xffe9e2);
    this.add.rectangle(width / 2, 230, width, 460, 0xffe2df);

    // Papel tapiz con pequeñas motas decorativas.
    const wallpaper = this.add.graphics();
    wallpaper.fillStyle(0xf4c9cb, 0.48);
    for (let x = 28; x < width; x += 64) {
      for (let y = 205; y < 435; y += 58) {
        wallpaper.fillCircle(x, y, 2);
        wallpaper.fillCircle(x + 17, y + 14, 1.3);
      }
    }

    // Molduras y zócalo.
    this.add.rectangle(width / 2, 452, width, 12, 0xf9c7c3);
    this.add.rectangle(width / 2, 462, width, 5, 0xc98f8b);

    // Piso de madera cálida.
    this.add.rectangle(width / 2, 591, width, 258, 0xd8b79e);
    this.add.rectangle(width / 2, 472, width, 10, 0xc99d91);
    const floor = this.add.graphics();
    floor.lineStyle(2, 0xc59f87, 0.48);
    for (let y = 505; y < 720; y += 42) {
      floor.lineBetween(0, y, width, y);
    }
    for (let x = 90; x < width; x += 190) {
      floor.lineBetween(x, 476, x, 720);
    }
    floor.lineStyle(1, 0xf0d5bd, 0.55);
    for (let y = 510; y < 720; y += 42) {
      floor.lineBetween(0, y + 3, width, y + 3);
    }

    this.createWindow();
    this.createWallArt();
    this.createShelf();
    this.createPlant();
    this.createPetBed();
    this.createRugAndToys();
    this.createInteractiveObjects();

    // Identidad visual del rincón.
    this.add.text(42, 145, "MI HOGAR", {
      fontFamily: "Nunito",
      fontSize: "22px",
      fontStyle: "bold",
      color: "#926d72",
    });
    this.add.text(44, 174, "un lugar lleno de amor", {
      fontFamily: "Nunito",
      fontSize: "13px",
      color: "#b17f83",
    });

    // Pequeños destellos decorativos en la pared.
    this.add.text(475, 220, "✦", {
      fontFamily: "Nunito", fontSize: "19px", color: "#e6a6ad",
    });
    this.add.text(845, 330, "✧", {
      fontFamily: "Nunito", fontSize: "22px", color: "#e6a6ad",
    });
    this.add.text(720, 170, "♡", {
      fontFamily: "Nunito", fontSize: "18px", color: "#e6a6ad",
    });
  }

  createWindow() {
    // Ventana con marco grueso y alféizar.
    this.add.rectangle(1010, 230, 218, 190, 0xc88f8b);
    this.add.rectangle(1010, 226, 202, 174, 0xfff8e8);
    this.add.rectangle(1010, 226, 184, 156, 0xb9dce8);

    // Cielo y nubes.
    this.add.circle(1060, 184, 19, 0xffe7a8);
    this.add.ellipse(970, 225, 54, 19, 0xf7fbf5);
    this.add.circle(952, 220, 12, 0xf7fbf5);
    this.add.circle(973, 214, 15, 0xf7fbf5);
    this.add.ellipse(1060, 270, 58, 18, 0xf7fbf5, 0.85);

    // Divisiones de la ventana.
    this.add.rectangle(1010, 226, 8, 156, 0xfff8e8);
    this.add.rectangle(1010, 226, 184, 8, 0xfff8e8);

    // Cortinas.
    this.add.rectangle(910, 230, 24, 194, 0xe9aebc);
    this.add.rectangle(1110, 230, 24, 194, 0xe9aebc);
    this.add.triangle(910, 326, -12, -2, 12, -2, 0, 24, 0xd98fa4);
    this.add.triangle(1110, 326, -12, -2, 12, -2, 0, 24, 0xd98fa4);
    this.add.rectangle(1010, 326, 226, 12, 0xf6d3d1);
    this.add.rectangle(1010, 338, 244, 8, 0xc88f8b);

    // Maceta pequeña en el alféizar.
    this.add.rectangle(1010, 312, 28, 20, 0xd99b83);
    this.add.ellipse(1010, 302, 35, 12, 0x78a985);
  }

  createWallArt() {
    // Cuadro con una huellita.
    this.add.rectangle(260, 275, 116, 104, 0xc88f8b);
    this.add.rectangle(260, 275, 106, 94, 0xfff8ef);
    this.add.rectangle(260, 275, 88, 76, 0xf8e5df);
    this.add.text(260, 238, "♥", {
      fontFamily: "Nunito", fontSize: "20px", color: "#df8da0",
    }).setOrigin(0.5);
    this.add.ellipse(260, 286, 28, 23, 0xc58b83);
    this.add.circle(242, 265, 8, 0xc58b83);
    this.add.circle(254, 258, 8, 0xc58b83);
    this.add.circle(267, 258, 8, 0xc58b83);
    this.add.circle(279, 265, 8, 0xc58b83);
    this.add.text(260, 327, "Toby's home", {
      fontFamily: "Nunito", fontSize: "10px", fontStyle: "bold", color: "#926d72",
    }).setOrigin(0.5);

    // Reloj redondo.
    this.add.circle(640, 275, 37, 0xc88f8b);
    this.add.circle(640, 275, 31, 0xfff8ef);
    this.add.circle(640, 275, 3, 0xc88f8b);
    this.add.rectangle(640, 263, 3, 17, 0x926d72);
    this.add.rectangle(649, 275, 17, 3, 0x926d72);
    this.add.text(640, 321, "DULCES MOMENTOS", {
      fontFamily: "Nunito", fontSize: "9px", fontStyle: "bold", color: "#ad7b80",
    }).setOrigin(0.5);
  }

  createShelf() {
    // Estante flotante y sus pequeños objetos.
    this.add.rectangle(790, 355, 190, 13, 0xb98270);
    this.add.rectangle(790, 348, 190, 5, 0xe7b99f);

    // Libros.
    this.add.rectangle(728, 327, 17, 42, 0xe8a2b2);
    this.add.rectangle(748, 331, 17, 34, 0x9d83d5);
    this.add.rectangle(768, 324, 17, 48, 0x8bc9a5);
    this.add.line(0, 0, 722, 314, 734, 314, 0xfff4e9, 2);

    // Peluche decorativo.
    this.add.circle(827, 329, 15, 0xf2c27f);
    this.add.circle(816, 318, 7, 0xf2c27f);
    this.add.circle(838, 318, 7, 0xf2c27f);
    this.add.circle(822, 328, 2, 0x654f55);
    this.add.circle(832, 328, 2, 0x654f55);
    this.add.ellipse(827, 335, 9, 6, 0xffe5bd);

    // Frasquito.
    this.add.rectangle(875, 334, 24, 29, 0xf3d5a5);
    this.add.rectangle(875, 316, 12, 7, 0xc88f8b);
    this.add.text(875, 337, "♡", {
      fontFamily: "Nunito", fontSize: "13px", color: "#bd8292",
    }).setOrigin(0.5);
  }

  createPlant() {
    // Planta de interior a la derecha, junto a la pared.
    this.add.ellipse(1165, 455, 72, 18, 0x9d786e, 0.2);
    this.add.rectangle(1165, 420, 54, 58, 0xd99b83);
    this.add.ellipse(1165, 393, 58, 15, 0xe6b49e);
    this.add.line(0, 0, 1165, 393, 1165, 335, 0x668d6b, 5);
    this.add.line(0, 0, 1165, 378, 1138, 350, 0x668d6b, 5);
    this.add.line(0, 0, 1165, 374, 1191, 344, 0x668d6b, 5);
    this.add.ellipse(1145, 350, 31, 15, 0x8fba91).setRotation(-0.65);
    this.add.ellipse(1185, 344, 31, 15, 0x8fba91).setRotation(0.65);
    this.add.ellipse(1152, 369, 28, 14, 0x78a985).setRotation(-0.35);
    this.add.ellipse(1178, 367, 28, 14, 0x78a985).setRotation(0.35);
  }

  createPetBed() {
    // Camita acolchada en el lateral izquierdo.
    this.add.ellipse(285, 570, 190, 76, 0xb98783, 0.22);
    this.add.ellipse(285, 555, 184, 76, 0xd98fa4);
    this.add.ellipse(285, 550, 158, 57, 0xf6cbd2);
    this.add.ellipse(285, 548, 118, 39, 0xffe7e6);
    this.add.text(285, 550, "♡", {
      fontFamily: "Nunito", fontSize: "25px", color: "#df9aaa",
    }).setOrigin(0.5);
    this.add.text(285, 610, "CAMITA", {
      fontFamily: "Nunito", fontSize: "10px", fontStyle: "bold", color: "#986f72",
    }).setOrigin(0.5);
  }

  createRugAndToys() {
    // Alfombra principal, conservando el centro libre para Toby.
    this.add.ellipse(660, 620, 500, 112, 0xc98f9d, 0.22);
    this.add.ellipse(660, 610, 470, 105, 0xf4b7c5);
    this.add.ellipse(660, 610, 420, 83, 0xf8cbd2);
    this.add.ellipse(660, 610, 370, 63, 0xf4b7c5, 0.42);
    this.add.text(660, 610, "✿", {
      fontFamily: "Nunito", fontSize: "30px", color: "#df91a5",
    }).setOrigin(0.5).setAlpha(0.65);

    // Pelota y huesito decorativos en el suelo.
    this.add.circle(930, 565, 19, 0x8bc9a5);
    this.add.circle(930, 565, 11, 0xc8e6d5);
    this.add.line(0, 0, 915, 555, 945, 575, 0x5f9e7b, 3);
    this.add.ellipse(1060, 590, 32, 15, 0xffe5bd);
    this.add.circle(1040, 582, 10, 0xffe5bd);
    this.add.circle(1040, 598, 10, 0xffe5bd);
    this.add.circle(1080, 582, 10, 0xffe5bd);
    this.add.circle(1080, 598, 10, 0xffe5bd);
  }


  createInteractiveObjects() {
    // Comedero: permite alimentar a Toby desde la propia habitación.
    this.add.ellipse(475, 586, 82, 22, 0x98766c, 0.18).setDepth(3);
    this.add.ellipse(475, 578, 76, 24, 0xc98f83).setDepth(3);
    this.add.ellipse(475, 574, 66, 17, 0xf4d5b7).setDepth(3);
    this.add.ellipse(475, 572, 52, 10, 0x9c6c4f).setDepth(3);
    this.add.circle(458, 570, 4, 0xc78c55).setDepth(3);
    this.add.circle(475, 568, 4, 0xc78c55).setDepth(3);
    this.add.circle(492, 570, 4, 0xc78c55).setDepth(3);
    this.add.text(475, 603, "COMEDERO", {
      fontFamily: "Nunito", fontSize: "10px", fontStyle: "bold", color: "#986f72",
    }).setOrigin(0.5).setDepth(3);

    // Indicaciones discretas: los objetos también funcionan como botones.
    this.createObjectHint(285, 495, "DESCANSAR");
    this.createObjectHint(475, 535, "COMER");
    this.createObjectHint(930, 520, "JUGAR");

    this.makeRoomObjectInteractive(285, 555, 190, 105, "sleep", 285, 555);
    this.makeRoomObjectInteractive(475, 575, 100, 65, "feed", 475, 555);
    this.makeRoomObjectInteractive(930, 565, 72, 72, "play", 930, 555);
  }

  createObjectHint(x, y, label) {
    const hint = this.add.text(x, y, `Tocar para ${label.toLowerCase()}`, {
      fontFamily: "Nunito",
      fontSize: "11px",
      fontStyle: "bold",
      color: "#805f62",
      backgroundColor: "#fff8ef",
      padding: { x: 8, y: 5 },
    }).setOrigin(0.5).setDepth(25).setAlpha(0.82);

    this.tweens.add({
      targets: hint,
      alpha: 1,
      duration: 1000,
      yoyo: true,
      repeat: -1,
    });
  }

  makeRoomObjectInteractive(x, y, width, height, action, targetX, targetY) {
    const hitArea = this.add.zone(x, y, width, height)
      .setOrigin(0.5)
      .setDepth(30)
      .setInteractive({ useHandCursor: true });

    hitArea.on("pointerover", () => {
      this.input.setDefaultCursor("pointer");
    });

    hitArea.on("pointerout", () => {
      this.input.setDefaultCursor("default");
    });

    hitArea.on("pointerdown", () => {
      if (!this.toby || this.objectActionInProgress) return;

      const hud = this.scene.get("HUD");
      if (!hud || !hud.scene.isActive()) return;

      this.objectActionInProgress = true;
      this.tweens.killTweensOf(this.toby);
      this.tweens.add({
        targets: this.toby,
        x: targetX,
        y: targetY,
        duration: 420,
        ease: "Sine.easeOut",
        onComplete: () => {
          hud.performAction(action);
          this.time.delayedCall(650, () => {
            this.objectActionInProgress = false;
          });
        },
      });
    });
  }

  update(time, delta) {
    if (document.hidden) return;
    if (this.toby) this.toby.update(Math.min(delta, 100));
    if (this.petStats) this.petStats.decreaseNeeds(delta);

    this.autoSaveTimer += delta;
    if (this.autoSaveTimer >= 5000) {
      SaveSystem.save(this.petStats);
      this.autoSaveTimer = 0;
    }
  }
}
