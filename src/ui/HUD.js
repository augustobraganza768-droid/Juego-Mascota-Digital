
import Phaser from "phaser";
import SaveSystem from "../systems/SaveSystem.js";

export default class HUD extends Phaser.Scene {
  constructor() {
    super("HUD");
  }

  init(data) {
    this.petStats = data.petStats;
    this.toby = data.toby;

    this.products = [
      { id: "food", name: "🍖 Comida premium", price: 15 },
      { id: "treats", name: "🍪 Galletitas", price: 20 },
      { id: "ball", name: "🎾 Pelota", price: 30 },
      { id: "bone", name: "🦴 Hueso de juguete", price: 35 },
      { id: "collar", name: "🎀 Collar", price: 60 },
      { id: "bandana", name: "🧣 Bandana", price: 75 },
    ];

    this.itemDescriptions = {
      food: "Recupera 35 puntos de hambre",
      treats: "Recupera hambre y felicidad",
      ball: "Aumenta 20 puntos de felicidad",
      bone: "Aumenta 15 puntos de felicidad",
      collar: "Accesorio para Toby",
      bandana: "Accesorio para Toby",
    };
  }

  roundedPanel(x, y, w, h, color, border, radius = 18) {
    const g = this.add.graphics();
    g.fillStyle(0x76575e, 0.12);
    g.fillRoundedRect(x-w/2, y-h/2+5, w, h, radius);
    g.fillStyle(color, 1);
    g.fillRoundedRect(x-w/2, y-h/2, w, h, radius);
    g.lineStyle(2, border, 1);
    g.strokeRoundedRect(x-w/2, y-h/2, w, h, radius);
    return g;
  }

  create() {
    // Panel superior
    this.roundedPanel(640, 65, 1220, 105, 0xfff8f1, 0xe8c7bd);

    this.add.text(70, 48, "TOBY", {
      fontFamily: "Nunito",
      fontSize: "22px",
      fontStyle: "bold",
      color: "#926d72",
    }).setOrigin(0.5);

    // Nivel y monedas
    this.levelText = this.add.text(
      1080, 35, "NIVEL 1", {
        fontFamily: "Nunito",
        fontSize: "17px",
        fontStyle: "bold",
        color: "#926d72",
      }
    ).setOrigin(0.5);

    this.coinsText = this.add.text(
      1080, 62, "🪙 50", {
        fontFamily: "Nunito",
        fontSize: "17px",
        fontStyle: "bold",
        color: "#b17b36",
      }
    ).setOrigin(0.5);

    this.xpGraphics = this.add.graphics();

    this.xpText = this.add.text(
      1080, 105, "XP: 0 / 100", {
        fontFamily: "Nunito",
        fontSize: "10px",
        color: "#76575e",
      }
    ).setOrigin(0.5);

    this.createSaveButton();
    this.lastActionAt = -Infinity;
    this.nextHudUpdate = 0;
    this.createResetButton();

    // Necesidades
    this.needs = [
      { name: "🍖 Saciedad", property: "hunger", color: 0xf2a65a },
      { name: "⚡ Energía", property: "energy", color: 0x8bc9a5 },
      { name: "♡ Felicidad", property: "happiness", color: 0xf18eae },
      { name: "🫧 Higiene", property: "hygiene", color: 0x82b9dc },
      { name: "✚ Salud", property: "health", color: 0xb99ad9 },
    ];

    this.barGraphics = this.add.graphics().setDepth(1);
    this.valueTexts = [];

    this.needs.forEach((need, index) => {
      const x = 180 + index * 180;

      this.add.text(x, 35, need.name, {
        fontFamily: "Nunito",
        fontSize: "16px",
        fontStyle: "bold",
        color: "#76575e",
      }).setOrigin(0.5);

      const track = this.add.graphics();
      track.fillStyle(0xeadbd5, 1).fillRoundedRect(x-67.5, 72, 135, 16, 8);

      const valueText = this.add.text(
        x, 99, "0%", {
          fontFamily: "Nunito",
          fontSize: "12px",
          color: "#76575e",
        }
      ).setOrigin(0.5);

      this.valueTexts.push(valueText);
    });

    // Panel inferior
    this.roundedPanel(640, 675, 1160, 75, 0xfff8f1, 0xe8c7bd);
    this.add.text(170, 675, "♡  Cuidá a Toby", {fontFamily: "Nunito", fontSize: "18px", color: "#926d72", fontStyle: "bold"}).setOrigin(0.5);

    // Acciones
    this.createActionButton(350, 675, "🍖 COMER", "feed");
    this.createActionButton(490, 675, "🎾 JUGAR", "play");
    this.createActionButton(630, 675, "💤 DORMIR", "sleep");
    this.createActionButton(770, 675, "🫧 BAÑAR", "bath");
    this.createActionButton(910, 675, "✚ CURAR", "heal");

    // Tienda y mochila
    this.createShopButton();
    this.createInventoryButton();

    // Mensajes
    this.message = this.add.text(640, 595, "", {
      fontFamily: "Nunito",
      fontSize: "19px",
      fontStyle: "bold",
      color: "#926d72",
      backgroundColor: "#fff8f1",
      padding: { x: 14, y: 8 },
    }).setOrigin(0.5).setDepth(300);

    this.message.setAlpha(0);

    // Ventanas
    this.createShopWindow();
    this.createInventoryWindow();
    this.input.keyboard?.on("keydown-ESC", () => {
      this.shopContainer.setVisible(false);
      this.inventoryContainer.setVisible(false);
    });

    this.updateProgress();
  }

  createResetButton() {
    const reset = this.add.text(1180, 99, "Nueva partida", {
      fontFamily: "Nunito", fontSize: "12px", color: "#76575e"
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    reset.on("pointerdown", () => {
      if (!window.confirm("¿Empezar de cero? Se perderá tu progreso actual.")) return;
      const fresh = new this.petStats.constructor();
      if (!SaveSystem.save(fresh)) {
        this.showMessage("No se pudo reiniciar la partida.");
        return;
      }
      Object.assign(this.petStats, fresh);
      window.location.reload();
    });
  }

  createSaveButton() {
    const button = this.add.rectangle(
      1180, 65, 105, 40, 0xe8c7bd
    );

    button.setStrokeStyle(2, 0xd9a5a9);
    button.setInteractive({ useHandCursor: true });

    this.add.text(1180, 65, "GUARDAR", {
      fontFamily: "Nunito",
      fontSize: "13px",
      fontStyle: "bold",
      color: "#76575e",
    }).setOrigin(0.5);

    button.on("pointerover", () => {
      button.setFillStyle(0xf0c1ca);
    });

    button.on("pointerout", () => {
      button.setFillStyle(0xe8c7bd);
    });

    button.on("pointerdown", () => {
      const saved = SaveSystem.save(this.petStats);

      this.showMessage(
        saved
          ? "¡Partida guardada correctamente! 💗"
          : "No se pudo guardar la partida."
      );
    });
  }

  createActionButton(x, y, label, action) {
    const button = this.add.rectangle(
      x, y, 125, 45, 0xf4d6d9
    );

    button.setStrokeStyle(2, 0xe8aab6);
    button.setInteractive({ useHandCursor: true });

    this.add.text(x, y, label, {
      fontFamily: "Nunito",
      fontSize: "14px",
      fontStyle: "bold",
      color: "#76575e",
    }).setOrigin(0.5);

    button.on("pointerover", () => {
      button.setFillStyle(0xf0c1ca);
    });

    button.on("pointerout", () => {
      button.setFillStyle(0xf4d6d9);
    });

    button.on("pointerdown", () => {
      this.performAction(action);
    });
  }

  createShopButton() {
    this.createMenuButton(
      1030,
      "TIENDA 🛍️",
      0xd9c7ed,
      0xb99ad9,
      () => {
        this.inventoryContainer.setVisible(false);
        this.shopContainer.setVisible(true);
        this.refreshShop();
      }
    );
  }

  createInventoryButton() {
    this.createMenuButton(
      1160,
      "MOCHILA 🎒",
      0xc8e6d5,
      0x8bc9a5,
      () => {
        this.shopContainer.setVisible(false);
        this.inventoryContainer.setVisible(true);
        this.refreshInventory();
      }
    );
  }

  createMenuButton(x, label, color, borderColor, callback) {
    const button = this.add.rectangle(
      x, 675, 120, 45, color
    );

    button.setStrokeStyle(2, borderColor);
    button.setInteractive({ useHandCursor: true });

    this.add.text(x, 675, label, {
      fontFamily: "Nunito",
      fontSize: "13px",
      fontStyle: "bold",
      color: "#674f83",
    }).setOrigin(0.5);

    button.on("pointerover", () => {
      button.setAlpha(0.8);
    });

    button.on("pointerout", () => {
      button.setAlpha(1);
    });

    button.on("pointerdown", callback);
  }

  createShopWindow() {
    this.shopContainer = this.add.container(640, 360);
    this.shopContainer.setDepth(200);
    this.shopContainer.setVisible(false);

    const overlay = this.add.rectangle(
      0, 0, 1280, 720, 0x493b46, 0.65
    );

    overlay.setInteractive();
    this.shopContainer.add(overlay);

    const panel = this.roundedPanel(0, 0, 760, 540, 0xfff8f1, 0xe8c7bd, 24);
    this.shopContainer.add(panel);

    const title = this.add.text(
      0, -225, "TIENDA DE PUPPILOVE 🛍️", {
        fontFamily: "Nunito",
        fontSize: "27px",
        fontStyle: "bold",
        color: "#926d72",
      }
    ).setOrigin(0.5);

    this.shopContainer.add(title);

    this.shopCoinsText = this.add.text(
      0, -185, "", {
        fontFamily: "Nunito",
        fontSize: "16px",
        fontStyle: "bold",
        color: "#b17b36",
      }
    ).setOrigin(0.5);

    this.shopContainer.add(this.shopCoinsText);

    this.addCloseButton(
      this.shopContainer,
      340,
      -225,
      () => this.shopContainer.setVisible(false)
    );

    this.shopRows = [];

    this.products.forEach((product, index) => {
      const y = -115 + index * 60;

      const rowBackground = this.roundedPanel(0, y, 690, 54, 0xffeee8, 0xf0d4ce, 12);

      const name = this.add.text(
        -320, y - 10, product.name, {
          fontFamily: "Nunito",
          fontSize: "16px",
          fontStyle: "bold",
          color: "#76575e",
        }
      ).setOrigin(0, 0.5);

      const description = this.add.text(-320, y + 12, this.itemDescriptions[product.id], {fontFamily: "Nunito", fontSize: "11px", color: "#926d72"}).setOrigin(0, 0.5);
      const quantity = this.add.text(
        65, y, "Tenés: 0", {
          fontFamily: "Nunito",
          fontSize: "13px",
          color: "#926d72",
        }
      ).setOrigin(0.5);

      const buyButton = this.add.rectangle(
        270, y, 105, 38, 0xe8c7bd
      );

      buyButton.setStrokeStyle(2, 0xd9a5a9);
      buyButton.setInteractive({ useHandCursor: true });

      const buyText = this.add.text(
        270, y, `🪙 ${product.price}`, {
          fontFamily: "Nunito",
          fontSize: "14px",
          fontStyle: "bold",
          color: "#76575e",
        }
      ).setOrigin(0.5);

      buyButton.on("pointerover", () => {
        buyButton.setFillStyle(0xf0c1ca);
      });

      buyButton.on("pointerout", () => {
        buyButton.setFillStyle(0xe8c7bd);
      });

      buyButton.on("pointerdown", () => {
        this.buyProduct(product);
      });

      this.shopContainer.add([
        rowBackground,
        name,
        description,
        quantity,
        buyButton,
        buyText,
      ]);

      this.shopRows.push({ product, quantity, buyButton, buyText });
    });

    this.shopContainer.add(
      this.add.text(
        0, 238, "¡Elegí algo lindo para Toby!", {
          fontFamily: "Nunito",
          fontSize: "15px",
          fontStyle: "bold",
          color: "#bd8995",
        }
      ).setOrigin(0.5)
    );
  }

  createInventoryWindow() {
    this.inventoryContainer = this.add.container(640, 360);
    this.inventoryContainer.setDepth(200);
    this.inventoryContainer.setVisible(false);

    const overlay = this.add.rectangle(
      0, 0, 1280, 720, 0x493b46, 0.65
    );

    overlay.setInteractive();
    this.inventoryContainer.add(overlay);

    const panel = this.roundedPanel(0, 0, 760, 540, 0xfff8f1, 0xc8e6d5, 24);
    this.inventoryContainer.add(panel);

    const title = this.add.text(
      0, -225, "MOCHILA DE TOBY 🎒", {
        fontFamily: "Nunito",
        fontSize: "27px",
        fontStyle: "bold",
        color: "#739b83",
      }
    ).setOrigin(0.5);

    this.inventoryContainer.add(title);

    this.inventoryCoinsText = this.add.text(
      0, -185, "", {
        fontFamily: "Nunito",
        fontSize: "16px",
        fontStyle: "bold",
        color: "#b17b36",
      }
    ).setOrigin(0.5);

    this.inventoryContainer.add(this.inventoryCoinsText);

    this.addCloseButton(
      this.inventoryContainer,
      340,
      -225,
      () => this.inventoryContainer.setVisible(false)
    );

    this.inventoryRows = [];

    this.products.forEach((product, index) => {
      const y = -115 + index * 60;

      const rowBackground = this.roundedPanel(0, y, 690, 54, 0xedf7ef, 0xc8e6d5, 12);

      const name = this.add.text(
        -320, y - 9, product.name, {
          fontFamily: "Nunito",
          fontSize: "15px",
          fontStyle: "bold",
          color: "#587b65",
        }
      ).setOrigin(0, 0.5);

      const description = this.add.text(
        -320, y + 12, this.itemDescriptions[product.id], {
          fontFamily: "Nunito",
          fontSize: "10px",
          color: "#78917e",
        }
      ).setOrigin(0, 0.5);

      const quantity = this.add.text(
        100, y, "Cantidad: 0", {
          fontFamily: "Nunito",
          fontSize: "12px",
          color: "#587b65",
        }
      ).setOrigin(0.5);

      const useButton = this.add.rectangle(
        270, y, 105, 38, 0xc8e6d5
      );

      useButton.setStrokeStyle(2, 0x8bc9a5);
      useButton.setInteractive({ useHandCursor: true });

      const useText = this.add.text(
        270, y, "USAR", {
          fontFamily: "Nunito",
          fontSize: "13px",
          fontStyle: "bold",
          color: "#587b65",
        }
      ).setOrigin(0.5);

      useButton.on("pointerover", () => {
        useButton.setFillStyle(0xb3dcc4);
      });

      useButton.on("pointerout", () => {
        useButton.setFillStyle(0xc8e6d5);
      });

      useButton.on("pointerdown", () => {
        this.handleInventoryProduct(product);
      });

      this.inventoryContainer.add([
        rowBackground,
        name,
        description,
        quantity,
        useButton,
        useText,
      ]);

      this.inventoryRows.push({
        product,
        quantity,
        useButton,
        useText,
      });
    });

    this.inventoryContainer.add(
      this.add.text(
        0, 238, "¡Cuidá a Toby con lo que tenés en tu mochila!", {
          fontFamily: "Nunito",
          fontSize: "14px",
          fontStyle: "bold",
          color: "#739b83",
        }
      ).setOrigin(0.5)
    );
  }

  addCloseButton(container, x, y, callback) {
    const button = this.add.rectangle(
      x, y, 45, 40, 0xf4d6d9
    );

    button.setStrokeStyle(2, 0xe8aab6);
    button.setInteractive({ useHandCursor: true });

    const label = this.add.text(
      x, y, "X", {
        fontFamily: "Nunito",
        fontSize: "20px",
        fontStyle: "bold",
        color: "#76575e",
      }
    ).setOrigin(0.5);

    button.on("pointerdown", callback);

    container.add([button, label]);
  }

  refreshShop() {
    this.shopCoinsText.setText(
      `Tus monedas: 🪙 ${this.petStats.coins}`
    );

    this.shopRows.forEach(({ product, quantity, buyButton, buyText }) => {
      const affordable = this.petStats.coins >= product.price;
      buyButton.setAlpha(affordable ? 1 : 0.55);
      buyText.setText(affordable ? `🪙 ${product.price}` : `${product.price} · Falta`);
      quantity.setText(
        `Tenés: ${this.petStats.inventory[product.id]}`
      );
    });
  }

  refreshInventory() {
    this.inventoryCoinsText.setText(
      `Tus monedas: 🪙 ${this.petStats.coins}`
    );

    this.inventoryRows.forEach((row) => {
      const { product, quantity, useButton, useText } = row;
      const amount = this.petStats.inventory[product.id];
      quantity.setText(`Cantidad: ${amount}`);

      const accessory = ["collar", "bandana"].includes(product.id);
      if (accessory) {
        const equipped = this.petStats.equippedAccessory === product.id;
        if (equipped) quantity.setText("✓ Equipado");
        useText.setText(equipped ? "QUITAR" : "EQUIPAR");
        useButton.setAlpha(equipped || amount > 0 ? 1 : 0.55);
      } else {
        useText.setText("USAR");
        useButton.setAlpha(amount > 0 ? 1 : 0.55);
      }
    });
  }

  handleInventoryProduct(product) {
    const accessory = ["collar", "bandana"].includes(product.id);

    if (!accessory) {
      this.useInventoryProduct(product);
      return;
    }

    let result;
    if (this.petStats.equippedAccessory === product.id) {
      result = this.petStats.removeAccessory();
    } else {
      result = this.petStats.equipAccessory(product.id);
    }

    if (!result.success) {
      this.showMessage(result.message);
      return;
    }

    if (this.toby) this.toby.refreshAccessory();
    SaveSystem.save(this.petStats);
    this.refreshInventory();
    this.showMessage(result.message);
  }

  buyProduct(product) {
    const successful = this.petStats.buyItem(
      product.id,
      product.price
    );

    if (!successful) {
      this.showMessage("¡No tenés suficientes monedas! 🪙");
      return;
    }

    SaveSystem.save(this.petStats);

    this.updateProgress();
    this.refreshShop();

    if (this.inventoryContainer.visible) {
      this.refreshInventory();
    }

    this.showMessage(`¡Compraste ${product.name}! 💗`);
  }

  useInventoryProduct(product) {
    if (this.toby?.reactionRemaining > 0) { this.showMessage("Esperá a que Toby termine su actividad."); return; }
    const result = this.petStats.useItem(product.id);

    if (!result.success) {
      this.showMessage(result.message);
      return;
    }

    SaveSystem.save(this.petStats);

    this.updateProgress();
    this.refreshInventory();

    if (this.toby) {
      this.toby.react(
        product.id === "food" || product.id === "treats"
          ? "feed"
          : "play"
      );
    }

    this.showMessage(result.message);
  }

  showMessage(text) {
    this.message.setText(text);
    this.message.setAlpha(1);

    if (this.messageTween) {
      this.messageTween.stop();
    }

    this.messageTween = this.tweens.add({
      targets: this.message,
      alpha: 0,
      delay: 1900,
      duration: 500,
    });
  }

  performAction(action) {
    if (!this.petStats || !["feed", "play", "sleep", "bath", "heal"].includes(action)) return;
    if (this.time.now - this.lastActionAt < 2200 || this.toby?.reactionRemaining > 0) {
      this.showMessage("Esperá a que Toby termine su actividad.");
      return;
    }
    const successful = this.petStats[action]();

    const messages = {
      feed: "¡Toby ha comido! 🍖",
      play: "¡Toby se divirtió! 🎾",
      sleep: "¡Toby descansó! 💤",
      bath: "¡Toby está limpio! 🛁",
      heal: "¡Toby está mejor! 💊",
    };

    const failures = {
      feed: "¡Toby no necesita más comida!",
      play: "¡Toby necesita descansar o ya está feliz!",
      sleep: "¡Toby ya tiene energía!",
      bath: "¡Toby ya está limpio!",
      heal: "¡Toby está saludable!",
    };

    if (!successful) {
      this.showMessage(
        failures[action] || "No se pudo realizar la acción."
      );
      return;
    }

    this.lastActionAt = this.time.now;
    const reward = this.petStats.rewardAction(action);

    if (this.toby) {
      this.toby.react(action, reward);
    }

    let message =
      `${messages[action]} +${reward.xpEarned} XP +${reward.coinsEarned} monedas`;

    if (reward.leveledUp) {
      message =
        `🎉 ¡SUBISTE AL NIVEL ${reward.level}! +25 monedas`;
    }

    this.showMessage(message);

    this.updateProgress();
    SaveSystem.save(this.petStats);
  }

  updateProgress() {
    if (!this.petStats || !this.levelText) return;

    this.levelText.setText(
      `NIVEL ${this.petStats.level}`
    );

    this.coinsText.setText(
      `🪙 ${this.petStats.coins}`
    );

    const requiredXP = this.petStats.getXpForNextLevel();
    const currentXP = this.petStats.xp;

    this.xpGraphics.clear();

    this.xpGraphics.fillStyle(0xeadbd5, 1);
    this.xpGraphics.fillRect(1007, 86, 145, 10);

    this.xpGraphics.fillStyle(0xd98ba4, 1);
    this.xpGraphics.fillRect(
      1007,
      86,
      145 * (currentXP / requiredXP),
      10
    );

    this.xpText.setText(
      `XP: ${currentXP} / ${requiredXP}`
    );
  }

  update(time) {
    if (!this.petStats || time < this.nextHudUpdate) return;
    this.nextHudUpdate = time + 150;

    this.barGraphics.clear();

    this.needs.forEach((need, index) => {
      const x = 180 + index * 180;

      const value = Phaser.Math.Clamp(
        this.petStats[need.property],
        0,
        100
      );

      const barWidth = 135 * (value / 100);

      this.barGraphics.fillStyle(need.color, 1);

      if (barWidth > 0) this.barGraphics.fillRoundedRect(x - 67.5, 72, barWidth, 16, Math.min(8, barWidth / 2));

      this.valueTexts[index].setText(
        `${Math.round(value)}%`
      );
    });

    this.updateProgress();
  }
}
