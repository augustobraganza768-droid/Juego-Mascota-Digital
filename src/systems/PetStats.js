export default class PetStats {
  constructor(savedData = null) {
    this.hunger = 80;
    this.energy = 90;
    this.happiness = 100;
    this.hygiene = 85;
    this.health = 100;

    this.coins = 50;
    this.xp = 0;
    this.level = 1;

    this.totalActions = 0;
    this.totalLevels = 0;

    this.inventory = {
      food: 0,
      treats: 0,
      ball: 0,
      bone: 0,
      collar: 0,
      bandana: 0,
    };

    // Solo se puede guardar uno de estos accesorios a la vez.
    this.equippedAccessory = null;

    if (savedData) {
      const needs = ["hunger", "energy", "happiness", "hygiene", "health"];
      needs.forEach((property) => {
        const value = savedData[property];
        if (Number.isFinite(value)) {
          this[property] = Math.min(100, Math.max(0, value));
        }
      });

      const progress = ["coins", "xp", "level", "totalActions", "totalLevels"];
      progress.forEach((property) => {
        const value = savedData[property];
        if (Number.isFinite(value) && value >= 0) {
          this[property] = Math.min(1000000000, Math.floor(value));
        }
      });

      this.level = Math.max(1, this.level);

      if (savedData.inventory && typeof savedData.inventory === "object") {
        Object.keys(this.inventory).forEach((item) => {
          const quantity = savedData.inventory[item];
          if (Number.isFinite(quantity) && quantity >= 0) {
            this.inventory[item] = Math.min(1000000000, Math.floor(quantity));
          }
        });
      }

      this.xp = Math.min(this.xp, this.getXpForNextLevel() - 1);
      if (["collar", "bandana"].includes(savedData.equippedAccessory) && this.inventory[savedData.equippedAccessory] > 0) {
        this.equippedAccessory = savedData.equippedAccessory;
      }
    }
  }

  equipAccessory(item) {
    if (!["collar", "bandana"].includes(item)) {
      return { success: false, message: "Ese accesorio no es válido." };
    }
    if (this.inventory[item] <= 0) {
      return { success: false, message: "No tenés ese accesorio en la mochila." };
    }
    this.equippedAccessory = item;
    return {
      success: true,
      message: item === "collar"
        ? "¡Toby luce su nuevo collar! 🎀"
        : "¡Toby luce su nueva bandana! 🧣",
    };
  }

  removeAccessory() {
    if (!this.equippedAccessory) {
      return { success: false, message: "Toby no tiene ningún accesorio puesto." };
    }
    this.equippedAccessory = null;
    return { success: true, message: "¡Le quitaste el accesorio a Toby! 💗" };
  }

  getXpForNextLevel() {
    return 100 + (this.level - 1) * 50;
  }

  gainXP(amount) {
    if (!Number.isSafeInteger(amount) || amount < 0 || amount > 1000000) return { leveledUp: false, levelsGained: 0, level: this.level, coins: this.coins };
    this.xp += amount;
    let leveledUp = false;
    let levelsGained = 0;

    while (this.xp >= this.getXpForNextLevel()) {
      this.xp -= this.getXpForNextLevel();
      this.level++;
      this.coins += 25;
      this.totalLevels++;
      levelsGained++;
      leveledUp = true;
    }

    return {
      leveledUp,
      levelsGained,
      level: this.level,
      coins: this.coins,
    };
  }

  rewardAction(action) {
    const rewards = {
      feed: { coins: 3, xp: 10 },
      play: { coins: 5, xp: 15 },
      sleep: { coins: 3, xp: 10 },
      bath: { coins: 4, xp: 12 },
      heal: { coins: 2, xp: 10 },
    };

    const reward = rewards[action];
    if (!reward) return null;

    this.coins += reward.coins;
    this.totalActions++;
    const result = this.gainXP(reward.xp);

    return {
      coinsEarned: reward.coins,
      xpEarned: reward.xp,
      ...result,
    };
  }

  buyItem(item, price) {
    if (!Object.prototype.hasOwnProperty.call(this.inventory, item)) return false;
    if (!Number.isFinite(price) || price < 0 || this.coins < price) return false;
    this.coins -= price;
    this.inventory[item]++;
    return true;
  }

  useItem(item) {
    if (!["food", "treats", "ball", "bone"].includes(item)) {
      return { success: false, message: "Los accesorios se equipan desde la mochila." };
    }
    if (this.inventory[item] <= 0) {
      return { success: false, message: "No tenés unidades de este producto." };
    }

    let message = "";
    switch (item) {
      case "food":
        if (this.hunger >= 100) return { success: false, message: "¡Toby ya está satisfecho!" };
        this.hunger = Math.min(100, this.hunger + 35);
        this.hygiene = Math.max(0, this.hygiene - 2);
        message = "¡Toby disfrutó su comida! 🍖";
        break;
      case "treats":
        if (this.hunger >= 100 && this.happiness >= 100) {
          return { success: false, message: "¡Toby ya está satisfecho y feliz!" };
        }
        this.hunger = Math.min(100, this.hunger + 15);
        this.happiness = Math.min(100, this.happiness + 8);
        message = "¡Toby recibió una galletita! 🍪";
        break;
      case "ball":
        if (this.happiness >= 100) return { success: false, message: "¡Toby ya está muy feliz!" };
        this.happiness = Math.min(100, this.happiness + 20);
        this.energy = Math.max(0, this.energy - 5);
        message = "¡Toby se divirtió con la pelota! 🎾";
        break;
      case "bone":
        if (this.happiness >= 100) return { success: false, message: "¡Toby ya está muy feliz!" };
        this.happiness = Math.min(100, this.happiness + 15);
        message = "¡Toby está feliz con su hueso! 🦴";
        break;
    }

    this.inventory[item]--;
    return { success: true, message };
  }

  decreaseNeeds(delta) {
    if (!Number.isFinite(delta) || delta <= 0) return;
    const seconds = Math.min(delta, 1000) / 1000;
    this.hunger = Math.max(0, this.hunger - seconds * 0.15);
    this.energy = Math.max(0, this.energy - seconds * 0.08);
    this.happiness = Math.max(0, this.happiness - seconds * 0.05);
    this.hygiene = Math.max(0, this.hygiene - seconds * 0.04);
  }

  feed() {
    if (this.hunger >= 100) return false;
    this.hunger = Math.min(100, this.hunger + 25);
    this.hygiene = Math.max(0, this.hygiene - 2);
    return true;
  }

  play() {
    if (this.energy < 15 || this.happiness >= 100) return false;
    this.energy = Math.max(0, this.energy - 15);
    this.happiness = Math.min(100, this.happiness + 20);
    return true;
  }

  sleep() {
    if (this.energy >= 100) return false;
    this.energy = Math.min(100, this.energy + 30);
    return true;
  }

  bath() {
    if (this.hygiene >= 100) return false;
    this.hygiene = Math.min(100, this.hygiene + 35);
    this.happiness = Math.max(0, this.happiness - 5);
    return true;
  }

  heal() {
    if (this.health >= 100) return false;
    this.health = Math.min(100, this.health + 30);
    return true;
  }
}
