import Phaser from "phaser";

function createTobyTexture(scene, key, pose, mood) {
  const graphics = scene.make.graphics({ x: 0, y: 0, add: false });

  const colors = {
    outline: 0x75472f,
    fur: 0xe9ae62,
    furLight: 0xf7cc86,
    furDark: 0xc98543,
    cream: 0xffe5bd,
    pink: 0xe8799c,
    pinkDark: 0xb94f77,
    eyes: 0x382820,
    white: 0xffffff,
  };

  function rect(x, y, width, height, color) {
    graphics.fillStyle(color, 1);
    graphics.fillRect(x, y, width, height);
  }

  // Cola
  if (pose === "wag") {
    rect(4, 39, 9, 8, colors.outline);
    rect(5, 40, 8, 6, colors.fur);
    rect(4, 38, 5, 4, colors.furLight);
  } else {
    rect(4, 45, 10, 7, colors.outline);
    rect(5, 46, 8, 5, colors.fur);
  }

  // Cuerpo
  rect(20, 45, 43, 27, colors.outline);
  rect(22, 47, 39, 23, colors.fur);
  rect(26, 49, 29, 7, colors.furLight);
  rect(28, 61, 25, 7, colors.cream);

  // Patas traseras
  if (pose === "walkA") {
    rect(27, 66, 11, 17, colors.outline);
    rect(29, 68, 7, 13, colors.furDark);
    rect(48, 67, 11, 17, colors.outline);
    rect(50, 69, 7, 13, colors.fur);
  } else if (pose === "walkB") {
    rect(27, 67, 11, 17, colors.outline);
    rect(29, 69, 7, 13, colors.fur);
    rect(48, 66, 11, 17, colors.outline);
    rect(50, 68, 7, 13, colors.furDark);
  } else {
    rect(27, 66, 11, 18, colors.outline);
    rect(29, 68, 7, 14, colors.fur);
    rect(48, 66, 11, 18, colors.outline);
    rect(50, 68, 7, 14, colors.furDark);
  }

  // Patas delanteras
  rect(54, 62, 11, 22, colors.outline);
  rect(56, 64, 7, 18, colors.furLight);
  rect(65, 61, 11, 23, colors.outline);
  rect(67, 63, 7, 19, colors.fur);

  // Cabeza
  rect(56, 16, 32, 34, colors.outline);
  rect(58, 18, 28, 30, colors.fur);
  rect(62, 20, 20, 8, colors.furLight);

  // Orejas
  rect(53, 22, 10, 25, colors.outline);
  rect(55, 24, 6, 21, colors.furDark);
  rect(82, 22, 10, 25, colors.outline);
  rect(84, 24, 6, 21, colors.furDark);

  // Hocico
  rect(72, 34, 17, 12, colors.outline);
  rect(74, 36, 13, 8, colors.cream);

  // Ojos según el estado emocional
  if (pose === "blink" || pose === "rest" || mood === "tired") {
    rect(65, 31, 7, 2, colors.eyes);
    rect(77, 31, 7, 2, colors.eyes);
  } else if (mood === "sick") {
    rect(65, 29, 6, 3, colors.eyes);
    rect(78, 29, 6, 3, colors.eyes);
    rect(66, 28, 5, 2, colors.furDark);
    rect(78, 28, 5, 2, colors.furDark);
  } else if (mood === "hungry") {
    rect(65, 28, 5, 6, colors.eyes);
    rect(78, 28, 5, 6, colors.eyes);
    rect(66, 29, 2, 2, colors.white);
    rect(79, 29, 2, 2, colors.white);
  } else {
    rect(66, 28, 5, 6, colors.eyes);
    rect(78, 28, 5, 6, colors.eyes);
    rect(67, 29, 2, 2, colors.white);
    rect(79, 29, 2, 2, colors.white);
  }

  // Nariz
  rect(80, 35, 6, 4, colors.eyes);

  // Boca según el estado
  if (mood === "happy") {
    rect(78, 42, 7, 5, colors.eyes);
    rect(80, 45, 4, 3, colors.pink);
  } else if (mood === "hungry") {
    rect(78, 42, 6, 5, colors.eyes);
    rect(80, 45, 3, 2, colors.pink);
  } else if (mood === "sick") {
    rect(79, 43, 6, 2, colors.eyes);
  } else if (mood === "tired") {
    rect(79, 43, 5, 2, colors.eyes);
  } else {
    rect(78, 42, 5, 2, colors.eyes);
  }

  // Las prendas se dibujan por separado para poder cambiarlas en el juego.

  // Marcas de suciedad
  if (mood === "dirty") {
    rect(30, 54, 5, 4, 0x8d6948);
    rect(43, 63, 4, 4, 0x8d6948);
    rect(85, 37, 3, 3, 0x8d6948);
  }

  // Detalles de cansancio
  if (mood === "tired") {
    rect(91, 15, 4, 4, colors.pink);
    rect(95, 10, 4, 4, colors.pink);
  }

  graphics.generateTexture(key, 128, 128);
  graphics.destroy();
}

export default class Toby extends Phaser.GameObjects.Container {
  constructor(scene, x, y, petStats) {
    super(scene, x, y);

    this.scene = scene;
    this.petStats = petStats;
    this.moods = ["happy", "hungry", "tired", "dirty", "sick"];
    this.poses = ["idle", "wag", "walkA", "walkB", "blink", "rest"];

    this.moods.forEach((mood) => {
      this.poses.forEach((pose) => {
        const key = `toby-${mood}-${pose}`;
        createTobyTexture(scene, key, pose, mood);
      });
    });

    this.shadow = scene.add.ellipse(0, 52, 105, 22, 0x986d69, 0.25);
    this.sprite = scene.add.image(0, 0, "toby-happy-idle");
    this.sprite.setScale(1.2);
    this.sprite.setOrigin(0.5);

    // Capa independiente para los accesorios.
    this.accessoryGraphics = scene.add.graphics();

    this.reactionText = scene.add.text(0, -105, "", {
      fontFamily: "Nunito",
      fontSize: "19px",
      fontStyle: "bold",
      color: "#926d72",
      backgroundColor: "#fff8f1",
      padding: { x: 12, y: 8 },
    }).setOrigin(0.5).setVisible(false);

    this.add([
      this.shadow,
      this.sprite,
      this.accessoryGraphics,
      this.reactionText,
    ]);

    scene.add.existing(this);
    this.setDepth(10);

    this.speed = 220;
    this.animationTime = 0;
    this.walking = false;
    this.currentAnimation = "";
    this.currentMood = "happy";
    this.reactionRemaining = 0;
    this.reactionMood = null;

    this.keys = scene.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      upArrow: Phaser.Input.Keyboard.KeyCodes.UP,
      downArrow: Phaser.Input.Keyboard.KeyCodes.DOWN,
      leftArrow: Phaser.Input.Keyboard.KeyCodes.LEFT,
      rightArrow: Phaser.Input.Keyboard.KeyCodes.RIGHT,
    });

    this.autoWait = 3000;
    this.autoTarget = null;
    this.resting = false;
    this.refreshAccessory();
  }

  refreshAccessory() {
    if (!this.accessoryGraphics) return;

    const accessory = this.petStats?.equippedAccessory || null;
    const graphics = this.accessoryGraphics;
    graphics.clear();
    graphics.setPosition(0, this.sprite?.y || 0);
    graphics.setScale(this.sprite?.flipX ? -1.2 : 1.2, 1.2);

    if (accessory === "collar") {
      // Collar rosa con hebilla dorada.
      graphics.fillStyle(0x75472f, 1);
      graphics.fillRect(-4, -19, 23, 8);
      graphics.fillStyle(0xe8799c, 1);
      graphics.fillRect(-3, -18, 21, 6);
      graphics.fillStyle(0xf4c76b, 1);
      graphics.fillRect(7, -17, 5, 4);
      graphics.fillStyle(0xffffff, 1);
      graphics.fillRect(8, -16, 2, 2);
    } else if (accessory === "bandana") {
      // Bandana violeta con punta triangular.
      graphics.fillStyle(0x75472f, 1);
      graphics.fillRect(-4, -20, 24, 9);
      graphics.fillStyle(0x9d83d5, 1);
      graphics.fillRect(-3, -19, 22, 7);
      graphics.fillStyle(0x75472f, 1);
      graphics.fillTriangle(3, -12, 15, -12, 9, -2);
      graphics.fillStyle(0xb99ad9, 1);
      graphics.fillTriangle(4, -12, 14, -12, 9, -4);
      graphics.fillStyle(0xffffff, 1);
      graphics.fillRect(7, -17, 3, 3);
    }
  }

  getMood() {
    if (!this.petStats) return "happy";
    if (this.petStats.health < 25) return "sick";
    if (this.petStats.hunger < 25) return "hungry";
    if (this.petStats.energy < 25) return "tired";
    if (this.petStats.hygiene < 25) return "dirty";
    if (this.petStats.happiness < 30) return "tired";
    return "happy";
  }

  react(action, reward) {
    const reactions = {
      feed: { message: "¡Qué rico! ¡Gracias! 🍖", mood: "happy" },
      play: { message: "¡Me encanta jugar! 🎾", mood: "happy" },
      sleep: { message: "Zzz... ¡A descansar! 💤", mood: "tired" },
      bath: { message: "¡Qué limpito estoy! 🛁", mood: "happy" },
      heal: { message: "¡Gracias por cuidarme! ❤️", mood: "happy" },
    };

    const reaction = reactions[action];
    if (!reaction) return;

    this.reactionText.setText(reaction.message).setVisible(true);
    this.reactionRemaining = 2200;
    this.reactionMood = reaction.mood;
    this.activeAction = action;
    this.actionElapsed = 0;
    this.showActivityEffects(action, reward);
  }

  showActivityEffects(action, reward) {
    const symbols = { feed: "♥", play: "✦", sleep: "z", bath: "○", heal: "+" };
    const colors = { feed: "#b96b85", play: "#b58a42", sleep: "#8171b1", bath: "#579eaf", heal: "#679a70" };
    for (let i = 0; i < 4; i++) {
      const particle = this.scene.add.text(this.x - 30 + i * 20, this.y - 35, symbols[action], {
        fontFamily: "Nunito", fontSize: "22px", color: colors[action], fontStyle: "bold",
      }).setOrigin(0.5).setDepth(24);
      this.scene.tweens.add({ targets: particle, y: particle.y - 65, alpha: 0,
        delay: i * 180, duration: 850, onComplete: () => particle.destroy() });
    }
    if (reward) {
      const label = this.scene.add.text(this.x, this.y - 65,
        `+${reward.xpEarned} XP · +${reward.coinsEarned} monedas`, {
          fontFamily: "Nunito", fontSize: "15px", fontStyle: "bold", color: "#527d58",
          backgroundColor: "#fff8ef", padding: { x: 7, y: 4 },
        }).setOrigin(0.5).setDepth(26);
      this.scene.tweens.add({ targets: label, y: label.y - 42, alpha: 0,
        delay: 750, duration: 950, onComplete: () => label.destroy() });
    }
  }

  update(delta) {
    const keys = this.keys;
    let velocityX = 0;
    let velocityY = 0;

    if (keys.left.isDown || keys.leftArrow.isDown) velocityX = -1;
    if (keys.right.isDown || keys.rightArrow.isDown) velocityX = 1;
    if (keys.up.isDown || keys.upArrow.isDown) velocityY = -1;
    if (keys.down.isDown || keys.downArrow.isDown) velocityY = 1;

    const manual = velocityX !== 0 || velocityY !== 0;
    const busy = this.scene.objectActionInProgress || this.reactionRemaining > 0;
    let speed = this.speed;
    if (busy || manual) {
      this.autoTarget = null;
      this.autoWait = 3000;
      this.resting = false;
      if (busy) velocityX = velocityY = 0;
    } else {
      speed = 85;
      if (!this.autoTarget) {
        this.autoWait -= delta;
        if (this.autoWait <= 0) {
          if (this.petStats.energy < 30 || Math.random() < 0.3) {
            this.resting = true;
            this.autoWait = 3500 + Math.random() * 3000;
          } else {
            this.resting = false;
            this.autoTarget = { x: 380 + Math.random() * 470, y: 520 + Math.random() * 115 };
          }
        }
      }
      if (this.autoTarget) {
        const dx = this.autoTarget.x - this.x;
        const dy = this.autoTarget.y - this.y;
        const distance = Math.hypot(dx, dy);
        if (distance <= Math.max(4, speed * delta / 1000)) {
          this.autoTarget = null;
          this.autoWait = 2200 + Math.random() * 3000;
        } else {
          velocityX = dx / distance;
          velocityY = dy / distance;
        }
      }
    }
    const length = Math.hypot(velocityX, velocityY);
    if (length > 0) {
      velocityX /= length;
      velocityY /= length;
    }

    const movement = speed * (delta / 1000);
    this.x += velocityX * movement;
    this.y += velocityY * movement;
    this.x = Phaser.Math.Clamp(this.x, 90, 1190);
    this.y = Phaser.Math.Clamp(this.y, 515, 650);

    if (velocityX !== 0) this.sprite.setFlipX(velocityX < 0);

    this.walking = length > 0;
    this.animationTime += delta;

    if (this.reactionRemaining > 0) {
      this.reactionRemaining -= delta;
      this.actionElapsed += delta;
      if (this.reactionRemaining <= 0) {
        this.reactionText.setVisible(false);
        this.reactionMood = null;
        this.activeAction = null;
      }
    }

    const mood = this.reactionMood || this.getMood();
    let pose = "idle";

    if (this.walking) {
      const frame = Math.floor(this.animationTime / 140) % 2;
      pose = frame === 0 ? "walkA" : "walkB";
      this.sprite.y = -Math.abs(Math.sin(this.animationTime * 0.018)) * 4;
      this.shadow.setScale(1 - Math.abs(Math.sin(this.animationTime * 0.018)) * 0.08);
    } else {
      const frame = Math.floor(this.animationTime / 550) % 2;
      pose = this.resting || this.reactionMood === "tired" ? "rest" :
        this.animationTime % 4100 < 150 ? "blink" :
        mood === "happy" && frame === 1 ? "wag" : "idle";
      this.sprite.y = (pose === "rest" ? 5 : 0) + Math.sin(this.animationTime * 0.003) * 1.5;
      this.shadow.setScale(1);
    }

    if (this.activeAction && !this.walking) {
      const t = this.actionElapsed;
      if (this.activeAction === "feed") {
        pose = Math.floor(t / 180) % 2 ? "blink" : "idle";
        this.sprite.y = 5 + Math.sin(t * 0.025) * 4;
      } else if (this.activeAction === "play") {
        pose = "wag";
        this.sprite.y = -Math.abs(Math.sin(t * 0.009)) * 16;
        this.shadow.setScale(0.85);
      } else if (this.activeAction === "sleep") {
        pose = "rest";
        this.sprite.y = 5 + Math.sin(t * 0.004) * 2;
      } else if (this.activeAction === "bath") {
        pose = Math.floor(t / 160) % 2 ? "wag" : "blink";
        this.sprite.y = Math.sin(t * 0.04) * 3;
      } else if (this.activeAction === "heal") {
        pose = "wag";
      }
    }
    this.setAnimation(mood, pose);
    this.accessoryGraphics.setPosition(0, this.sprite.y);
    this.accessoryGraphics.setScale(this.sprite.flipX ? -1.2 : 1.2, 1.2);
  }

  setAnimation(mood, pose) {
    const animation = `toby-${mood}-${pose}`;
    if (this.currentAnimation === animation) return;

    this.currentAnimation = animation;
    this.currentMood = mood;
    this.sprite.setTexture(animation);
  }
}
