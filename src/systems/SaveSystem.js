const SAVE_KEY = "puppilove-save-v1";

export default class SaveSystem {
  static save(petStats) {
    try {
      const data = {
        version: 1,
        savedAt: new Date().toISOString(),
        hunger: petStats.hunger,
        energy: petStats.energy,
        happiness: petStats.happiness,
        hygiene: petStats.hygiene,
        health: petStats.health,
        coins: petStats.coins,
        xp: petStats.xp,
        level: petStats.level,
        totalActions: petStats.totalActions,
        totalLevels: petStats.totalLevels,
        inventory: { ...petStats.inventory },
        equippedAccessory: petStats.equippedAccessory || null,
      };

      localStorage.setItem(SAVE_KEY, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error("No se pudo guardar la partida:", error);
      return false;
    }
  }

  static load() {
    try {
      const savedData = localStorage.getItem(SAVE_KEY);
      if (!savedData) return null;
      const data = JSON.parse(savedData);
      if (!data || typeof data !== "object" || Array.isArray(data) || data.version !== 1) return null;
      return data;
    } catch (error) {
      console.error("No se pudo cargar la partida:", error);
      return null;
    }
  }

  static hasSave() {
    try {
      return localStorage.getItem(SAVE_KEY) !== null;
    } catch {
      return false;
    }
  }

  static deleteSave() {
    try {
      localStorage.removeItem(SAVE_KEY);
      return true;
    } catch {
      return false;
    }
  }
}
