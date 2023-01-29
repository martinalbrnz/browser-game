
import { interval } from "rxjs";
import styles from "./tenis-field.module.scss";

import { createSignal, onCleanup } from "solid-js";

const TenisField = () => {
  const ballSize = 10;
  const playerSize = 20;
  const clickTime = 25;
  const maxHeight = 400;
  const maxWidth = 600;
  const gravity = .98;
  const bounceLoss = .99
  const maxSpeed = 2

  const [ball, setBall] = createSignal({ x: (maxWidth - ballSize) / 2, y: 300 });
  const [ballMov, setBallMov] = createSignal({ x: 2, y: 1 });
  const [playerA, setPlayerA] = createSignal(100);
  const [playerB, setPlayerB] = createSignal(400);

  const tick$ = interval(clickTime).subscribe(() => {
    moveBall();
    floorBounce();
    wallBounce();
  })

  function moveBall() {
    setBall({ x: ball().x + ballMov().x, y: ball().y + ballMov().y })
    setBallMov({ x: ballMov().x, y: ballMov().y + (gravity / 20) })
  }

  function floorBounce() {
    if (ball().y > maxHeight - ballSize) {
      setBallMov({
        x: ballMov().x,
        y: -Math.abs(ballMov().y * bounceLoss)
      })
    }
  }

  function wallBounce() {
    if (ball().x >= maxWidth - ballSize) {
      setBallMov({
        x: -(ballMov().x * bounceLoss),
        y: ballMov().y
      })
    }
    if (ball().x <= ballSize) {
      setBallMov({
        x: Math.abs(ballMov().x * bounceLoss),
        y: ballMov().y
      })
    }
  }

  function checkPlayerCollision() {

  }

  onCleanup(() => {
    tick$.unsubscribe();
  });
  return <div class={styles.field}>
    <div
      class={styles.ball}
      style={{
        width: `${ballSize}px`,
        height: `${ballSize}px`,
        top: `${ball().y}px`,
        left: `${ball().x}px`
      }}
    ></div>
    <div
      class={styles.playerA}
      style={{
        width: `${playerSize}px`,
        height: `${playerSize}px`,
        top: `${maxHeight - playerSize}px`,
        left: `${playerA()}px`
      }}
    ></div>
    <div
      class={styles.playerB}
      style={{
        width: `${playerSize}px`,
        height: `${playerSize}px`,
        top: `${maxHeight - playerSize}px`,
        left: `${playerB()}px`
      }}
    ></div>
    <div class={styles.net} style={{ top: `${maxHeight - 30}px`, left: `${(maxWidth - 4) / 2}px` }}></div>
    <div class={styles.floor} style={{ top: `${maxHeight}px` }}></div>
    <div class={styles.wall} style={{ top: `${maxHeight / 2}px`, left: `${maxWidth}px`, height: `${maxHeight / 2}px` }}></div>
    <div class={styles.wall} style={{ top: `${maxHeight / 2}px`, left: `${-40}px`, height: `${maxHeight / 2}px` }}></div>
  </div>;
};

export default TenisField
