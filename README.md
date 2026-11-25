# PuppiLOVE 4.0 — The Magical Archipelago
Prototipo jugable incremental basado en PuppiLOVE 3.0. JavaScript ES modules, Canvas 2D y Vite.

## Instalación
Abrir esta carpeta en VS Code, ejecutar `npm install` y `npm run dev`. Abrir la URL que indica Vite. Para producción: `npm run build` y `npm run preview`. Vercel: importar repositorio, preset Vite, salida dist.

## Controles
WASD/flechas, clic en escenario, E para interacción, botones táctiles, +/− para zoom. Menús de mapa, mochila, tienda, diario, juegos y ajustes. Guardado local por origen del navegador; exportar antes de cambiar de dominio.

## Alcance y limitaciones
8 regiones con paletas distintas y geometría compartida; 8 mascotas (cinco reutilizan el sprite de Toby); 75 productos; accesorios por ranura con iconos superpuestos; 50 niveles; tres partidas, cinco copias rotativas e importación básica. Los 12 juegos son variantes de selección, no mecánicas únicas; etapas y récords básicos. No están implementados todos los interiores, NPC dinámicos, transporte aéreo, árbol de habilidades, editor integral, compañeros simultáneos, audio espacial ni recursos artísticos premium. No se considera versión definitiva. Migración local parcial desde v3, sin garantía entre dominios. No hay backend.

## Verificación
Sintaxis Node y recuento de catálogo comprobados. Instalación, build y pruebas de navegador pendientes si no se dispone de dependencias. No se certifican 60 FPS.

## Actualización 4.1
Vestidor con vista previa, cinco conjuntos por mascota, favoritos y nueve habilidades. Conserva las claves de guardado 4.0. Pruebas de lógica y sintaxis realizadas con Node; compilación Vite y pruebas visuales pendientes. Los accesorios son dibujos vectoriales, no sprites individuales.

## 4.3
Nuevo módulo de aventuras: cinco etapas, historial reciente, récords y medallas. Mecánicas simplificadas; algunas comparten controles. Pruebas de navegador pendientes.

## 4.3
Cada isla tiene refugio, habitante, misión, recurso renovable y secreto. El camino celestial desbloquea la siguiente isla al completar la misión y alcanzar su nivel. El atlas permite volver a islas visitadas. Los interiores y personajes son representaciones vectoriales simplificadas.

## 4.4 — Hogar
Menú Hogar: muebles funcionales, cuadrícula opcional, reflejo de muebles, tres suelos, cinco diseños, cofre y huerto de cuatro cultivos. Compra muebles en Tienda y colócalos desde Mochila. La ampliación del huerto requiere nivel 3 y 120 monedas. Los cultivos crecen por tiempo real y admiten tres riegos. Los diseños reutilizan muebles comprados, sin duplicarlos. Pendientes: arquitectura completa, rotación geométrica, deshacer/rehacer y jardines estacionales.

## 4.5 — Pulido audiovisual
Paletas por isla, partículas, respiración de mascotas, siluetas SVG diferenciadas, música sintetizada por región, ambiente climático y cuatro niveles gráficos manuales. Ajustes persistentes. No incluye grabaciones orquestales ni garantía de FPS.

## Versión 4.6 — candidata a publicación

Requisitos: Node.js 22 recomendado, npm. Ejecutar `npm install`, `npm test`, `npm run dev`. Para producción: `npm run build` y `npm run preview`.

Antes de actualizar, exportar cada partida desde Ajustes. El almacenamiento local depende del origen (protocolo, dominio y puerto); al publicar en Vercel hay que importar la partida si se desea conservarla. Se mantienen las claves 4.x y hasta cinco copias por ranura. La validación es estructural, no exhaustiva. No hay sincronización en la nube.

### Publicación

Conservar una copia del repositorio existente y su historial. Copiar los archivos del proyecto a la raíz del repositorio, sin borrar `.git`, y excluir `node_modules` y `dist`. Revisar `git status`, ejecutar las pruebas y compilación antes de confirmar los cambios. Vercel: framework Vite, build `npm run build`, salida `dist`. No requiere variables de entorno.

### Verificación

Seis pruebas unitarias superadas en Node 22. Sintaxis JS verificada. Build y pruebas reales de navegador pendientes (Vite no disponible en el entorno de preparación). La opción 30 FPS es un límite aproximado, no una garantía. La reducción de efectos no elimina todas las animaciones.

### Alcance pendiente

No equivale a la implementación íntegra de la entrevista: interiores y NPC simplificados, vuelo manual y ecosistemas avanzados pendientes; minijuegos con mecánicas parcialmente compartidas; ilustraciones vectoriales derivadas, audio sintetizado, construcción avanzada y undo/redo pendientes. También faltan pruebas de interfaz, rendimiento medido, accesibilidad integral y migración exhaustiva de partidas antiguas.
