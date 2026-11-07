/**
 * main.js - Application bootstrap, scene orchestrator & browser history manager
 * 
 * Provides:
 * 1. Multi-scene lifecycle (Scenes 1 through 9)
 * 2. Full browser history / window back-button support via pushState & popstate
 * 3. Universal floating navigation header (Back, Chapter Progress, Next)
 * 4. In-page highlighted Next & Back controls
 * 5. Clean replay handling
 */

import { AmbientAtmosphere } from './ambient.js';
import { Scene1 } from './scene1.js';
import { Scene2 } from './scene2.js';
import { Scene3 } from './scene3.js';
import { Scene4 } from './scene4.js';
import { Scene5 } from './scene5.js';
import { Scene6 } from './scene6.js';
import { Scene7 } from './scene7.js';
import { Scene8 } from './scene8.js';
import { Scene9 } from './scene9.js';

const CHAPTERS = [
  { index: 1, title: 'The Entrance', shortTitle: 'Entrance' },
  { index: 2, title: 'Birthday Surprise & Candle', shortTitle: 'The Candle' },
  { index: 3, title: 'Our Story Begins (6th Class)', shortTitle: '6th Class' },
  { index: 4, title: 'World of Conversations & Trust', shortTitle: 'Conversations' },
  { index: 5, title: 'Memory Gallery', shortTitle: 'Memories' },
  { index: 6, title: 'Things I Never Say Enough', shortTitle: 'Things Never Said' },
  { index: 7, title: 'A Personal Letter', shortTitle: 'Personal Letter' },
  { index: 8, title: 'The Promise of More Memories', shortTitle: 'Night Sky' },
  { index: 9, title: 'Until Our Next Memory', shortTitle: 'Finale' }
];

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize ambient atmosphere
  const canvas = document.getElementById('ambient-canvas');
  if (canvas) {
    new AmbientAtmosphere(canvas);
  }

  // 2. Initialize Scene instances
  const scene1Container = document.querySelector('.scene1-container');
  const scene2Container = document.querySelector('.scene2-container');
  const scene3Container = document.querySelector('.scene3-container');
  const scene4Container = document.querySelector('.scene4-container');
  const scene5Container = document.querySelector('.scene5-container');
  const scene6Container = document.querySelector('.scene6-container');
  const scene7Container = document.querySelector('.scene7-container');
  const scene8Container = document.querySelector('.scene8-container');
  const scene9Container = document.querySelector('.scene9-container');

  const scene1 = new Scene1();
  const scene2 = new Scene2();
  const scene3 = new Scene3();
  const scene4 = new Scene4();
  const scene5 = new Scene5();
  const scene6 = new Scene6();
  const scene7 = new Scene7();
  const scene8 = new Scene8();
  const scene9 = new Scene9();

  const containers = [
    null,
    scene1Container,
    scene2Container,
    scene3Container,
    scene4Container,
    scene5Container,
    scene6Container,
    scene7Container,
    scene8Container,
    scene9Container
  ];

  const sceneInstances = [
    null,
    scene1,
    scene2,
    scene3,
    scene4,
    scene5,
    scene6,
    scene7,
    scene8,
    scene9
  ];

  // 3. Floating Navigation Elements
  const globalNavBar = document.getElementById('global-nav-bar');
  const globalNavBack = document.getElementById('global-nav-back');
  const globalNavNext = document.getElementById('global-nav-next');
  const globalNavBadge = document.getElementById('global-nav-badge');
  const globalNavTitle = document.getElementById('global-nav-title');

  let currentScene = 1;
  let isTransitioning = false;

  function updateGlobalNav(sceneIndex) {
    if (!globalNavBar) return;

    if (sceneIndex <= 1) {
      globalNavBar.classList.remove('visible');
    } else {
      globalNavBar.classList.add('visible');
      if (globalNavBadge) {
        globalNavBadge.textContent = `Chapter ${sceneIndex} of 9`;
      }
      if (globalNavTitle) {
        globalNavTitle.textContent = CHAPTERS[sceneIndex - 1]?.title || '';
      }
      if (globalNavNext) {
        if (sceneIndex >= 9) {
          globalNavNext.disabled = true;
          globalNavNext.style.display = 'none';
        } else {
          globalNavNext.disabled = false;
          globalNavNext.style.display = 'inline-flex';
        }
      }
    }
  }

  function goToScene(targetIndex, updateHistory = true, direction = null) {
    if (targetIndex < 1 || targetIndex > 9 || targetIndex === currentScene) return;
    if (isTransitioning) return;
    isTransitioning = true;

    const oldIndex = currentScene;
    const isMovingForward = direction ? direction === 'forward' : targetIndex > oldIndex;
    currentScene = targetIndex;

    if (updateHistory) {
      history.pushState({ scene: targetIndex }, '', `#scene${targetIndex}`);
    }

    const oldContainer = containers[oldIndex];
    const newContainer = containers[targetIndex];

    // 1. Fade out old container
    if (oldContainer) {
      oldContainer.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), filter 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
      oldContainer.style.opacity = '0';
      oldContainer.style.filter = 'blur(4px)';
      oldContainer.style.pointerEvents = 'none';
    }

    setTimeout(() => {
      if (oldContainer) {
        oldContainer.style.display = 'none';
        oldContainer.classList.remove('active');
      }

      // 2. Prepare and reveal new container
      if (newContainer) {
        newContainer.style.display = (targetIndex === 1 || targetIndex === 2 ? 'flex' : 'block');
        newContainer.style.pointerEvents = 'auto';
        newContainer.scrollTop = 0;
        void newContainer.offsetWidth; // Force reflow

        newContainer.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), filter 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
        newContainer.style.opacity = '1';
        newContainer.style.filter = 'none';
        newContainer.classList.add('active');

        // Execute scene start or resume
        const instance = sceneInstances[targetIndex];
        if (instance) {
          if (isMovingForward && typeof instance.startScene === 'function') {
            instance.startScene();
          } else {
            // When navigating backward, reveal elements immediately so she can read without delays
            newContainer.querySelectorAll(
              '.scene-card, .scene3-card, .scene4-card, .scene5-card, .scene6-card, .scene8-card, .scene9-card, ' +
              '.scene3-milestone-item, .scene6-note-card, .scene7-letter-sheet, .scene7-envelope-section, ' +
              '.scene8-star-reveal-card, .scene9-final-screen, .scene9-candle-memorial'
            ).forEach(el => el.classList.add('in-view', 'revealed'));

            if (targetIndex === 2 && instance.igniteFirstFlame) {
              instance.igniteFirstFlame();
            }
            if (targetIndex === 8 && instance.startStarAnimation) {
              instance.startStarAnimation();
            }
          }
        }
      }

      updateGlobalNav(targetIndex);
      isTransitioning = false;
    }, 600);
  }

  // 4. History API: Browser / Window Back Button Support (`popstate`)
  window.addEventListener('popstate', (event) => {
    let targetScene = 1;
    if (event.state && typeof event.state.scene === 'number') {
      targetScene = event.state.scene;
    } else if (window.location.hash) {
      const match = window.location.hash.match(/#scene(\d+)/);
      if (match) targetScene = parseInt(match[1], 10);
    }

    if (targetScene !== currentScene) {
      const isMovingForward = targetScene > currentScene;
      goToScene(targetScene, false, isMovingForward ? 'forward' : 'backward');
    }
  });

  // 5. Navigation Bar Clicks
  if (globalNavBack) {
    globalNavBack.addEventListener('click', () => {
      if (currentScene > 1) {
        history.back();
      }
    });
  }

  if (globalNavNext) {
    globalNavNext.addEventListener('click', () => {
      if (currentScene < 9) {
        goToScene(currentScene + 1, true, 'forward');
      }
    });
  }

  // 6. In-page Back Buttons (`.scene-btn-back`)
  document.querySelectorAll('.scene-btn-back').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetAttr = btn.getAttribute('data-target-scene');
      if (targetAttr) {
        const target = parseInt(targetAttr, 10);
        goToScene(target, true, 'backward');
      } else if (currentScene > 1) {
        history.back();
      }
    });
  });

  // 7. Event listeners from Scene completions
  window.addEventListener('scene:complete', () => {
    setTimeout(() => goToScene(2, true, 'forward'), 1200);
  });
  window.addEventListener('scene2:complete', () => goToScene(3, true, 'forward'));
  window.addEventListener('scene3:complete', () => goToScene(4, true, 'forward'));
  window.addEventListener('scene4:complete', () => goToScene(5, true, 'forward'));
  window.addEventListener('scene5:complete', () => goToScene(6, true, 'forward'));
  window.addEventListener('scene6:complete', () => goToScene(7, true, 'forward'));
  window.addEventListener('scene7:complete', () => goToScene(8, true, 'forward'));
  window.addEventListener('scene8:complete', () => goToScene(9, true, 'forward'));

  // 8. Replay Listener
  window.addEventListener('experience:replay', () => {
    console.info('[Experience] Resetting journey to Scene 1...');
    containers.forEach(c => {
      if (c) {
        c.classList.remove('active');
        c.scrollTop = 0;
      }
    });
    scene1.reset();
    scene2.reset();
    scene9.reset();
    goToScene(1, true, 'backward');
  });

  // 9. Initial State Setup
  if (!window.location.hash || window.location.hash === '#scene1') {
    history.replaceState({ scene: 1 }, '', '#scene1');
    updateGlobalNav(1);
  } else {
    const match = window.location.hash.match(/#scene(\d+)/);
    if (match) {
      const initialScene = parseInt(match[1], 10);
      if (initialScene >= 1 && initialScene <= 9) {
        currentScene = initialScene;
        history.replaceState({ scene: initialScene }, '', `#scene${initialScene}`);
        containers.forEach((c, idx) => {
          if (!c) return;
          if (idx === initialScene) {
            c.style.display = (initialScene === 1 || initialScene === 2 ? 'flex' : 'block');
            c.style.opacity = '1';
            c.classList.add('active');
            if (sceneInstances[initialScene]?.startScene) {
              sceneInstances[initialScene].startScene();
            }
          } else {
            c.style.display = 'none';
            c.style.opacity = '0';
            c.classList.remove('active');
          }
        });
        updateGlobalNav(initialScene);
      }
    }
  }
});
