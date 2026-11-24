# PuppiLOVE 🐾

Un pequeño mundo lleno de amor. Videojuego 2D de mascota virtual con estética cozy, desarrollado con JavaScript, Phaser y Vite.

## Funcionalidades

- Habitación interactiva con cama, comedero y juguetes.
- Movimiento autónomo y manual de Toby; animaciones de actividades.
- Cinco necesidades, monedas, experiencia y niveles.
- Tienda, inventario y accesorios equipables.
- Guardado local, validación de datos y reinicio con confirmación.
- Página de presentación adaptable a distintos tamaños de pantalla.

## Ejecutar localmente

Instalar Node.js compatible con Vite (22.12+ dentro de la rama 22, o una versión compatible posterior) y ejecutar:

```bash
npm ci
npm run dev
```

Para generar la versión de producción: `npm run build`. Para revisarla: `npm run preview`.

## Arquitectura

| Archivo | Responsabilidad |
| --- | --- |
| `src/main.js` | Inicialización de Phaser y entrada al juego |
| `src/scenes/RoomScene.js` | Escenario e interacciones |
| `src/entities/Toby.js` | Personaje, movimiento y animaciones |
| `src/systems/PetStats.js` | Estado, economía y progresión |
| `src/systems/SaveSystem.js` | Persistencia con LocalStorage |
| `src/ui/HUD.js` | Interfaz, tienda y mochila |

El guardado se mantiene por navegador y origen; no se sincroniza entre dispositivos. El juego conserva un lienzo 16:9; se recomienda orientación horizontal en móviles.

## Demo y capturas

Pendientes de publicación. Añadir el enlace real y capturas propias del juego una vez verificadas.

## Publicación

Subir el código a GitHub sin `node_modules` ni `dist`. Importar el repositorio en un alojamiento compatible con Vite, por ejemplo Vercel: comando `npm run build`, carpeta de salida `dist`. Comprobar la URL publicada antes de incorporarla al portfolio.
