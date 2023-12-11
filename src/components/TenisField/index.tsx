import { interval } from "rxjs";
import styles from "./tenis-field.module.scss";

import { createSignal, onCleanup } from "solid-js";

const TenisField = () => {
  const ballSize = 10;
  const playerSize = 20;
  const clickTime = 10;
  const maxHeight = 400;
  const maxWidth = 600;
  const gravity = 0.98;
  const bounceLoss = 0.8;
  const maxSpeed = 6;
  const playerSpeed = 2;

  const [ball, setBall] = createSignal({
    x: 20,
    y: 380,
  });
  const [ballMov, setBallMov] = createSignal({ x: 3, y: -3 });
  const [playerA, setPlayerA] = createSignal(maxWidth / 4);
  const [movA, setMovA] = createSignal(0);
  const [playerB, setPlayerB] = createSignal((maxWidth / 4) * 3);
  const [movB, setMovB] = createSignal(0);

  const tick$ = interval(clickTime).subscribe(() => {
    getControls();
    moveBall();
    floorBounce();
    wallBounce();
    if (checkPlayerCollision(playerA())) playerBounce(playerA());
    if (checkPlayerCollision(playerB())) playerBounce(playerB());
    movePlayers();
  });

  function moveBall() {
    setBall({ x: ball().x + ballMov().x, y: ball().y + ballMov().y });
    setBallMov({ x: ballMov().x, y: ballMov().y + gravity / 20 });
  }

  function floorBounce() {
    if (ball().y >= maxHeight - ballSize) {
      setBallMov({
        x: ballMov().x * bounceLoss,
        y: -Math.abs(ballMov().y * bounceLoss),
      });
    }
  }

  function wallBounce() {
    if (ball().x >= maxWidth - ballSize) {
      setBallMov({
        x: -Math.abs(ballMov().x * bounceLoss),
        y: ballMov().y,
      });
    }
    if (ball().x <= ballSize) {
      setBallMov({
        x: Math.abs(ballMov().x * bounceLoss),
        y: ballMov().y,
      });
    }
  }

  function checkPlayerCollision(playerPos: number) {
    const dx = playerPos + playerSize / 2 - (ball().x + ballSize / 2);
    const dy = maxHeight - playerSize / 2 - (ball().y + ballSize / 2);
    const distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
    return distance <= (playerSize + ballSize) / 2;
  }

  function playerBounce(playerPos: number) {
    /* Here i should get the angle */
    const dx = playerPos + playerSize / 2 - (ball().x + ballSize / 2);
    const dy = maxHeight - playerSize / 2 - (ball().y + ballSize / 2);
    const angle = Math.atan2(dy, dx);
    const forceX = Math.cos(angle) * maxSpeed;
    const forceY = Math.sin(angle) * maxSpeed;
    setBallMov({ x: -forceX, y: -forceY });
  }

  function movePlayers() {
    if (
      (movA() > 0 && playerA() < maxWidth / 2 - playerSize - 2) ||
      (movA() < 0 && playerA() > 0)
    ) {
      setPlayerA(playerA() + movA());
    }
    if (
      (movB() > 0 && playerB() < maxWidth - playerSize) ||
      (movB() < 0 && playerB() > maxWidth / 2 + 2)
    ) {
      setPlayerB(playerB() + movB());
    }

    setMovA(0);
    setMovB(0);
  }

  function getControls() {
    const gamepadA = navigator.getGamepads()[0];
    const gamepadB = navigator.getGamepads()[1];

    if (gamepadA?.axes[2]! > 0.1 || gamepadA?.axes[2]!) {
      setMovA(gamepadA?.axes[2]! * playerSpeed);
    }

    if (gamepadB?.axes[2]! > 0.1 || gamepadB?.axes[2]!) {
      setMovB(gamepadB?.axes[2]! * playerSpeed);
    }
  }

  function netBounce() {}

  onCleanup(() => {
    tick$.unsubscribe();
  });
  return (
    <div class={styles.fieldContainer}>
      <h2>Score</h2>
      <div
        class={styles.field}
        style={{ width: `${maxWidth}px`, height: `${maxHeight}px` }}
      >
        <div
          class={styles.ball}
          style={{
            width: `${ballSize}px`,
            height: `${ballSize}px`,
            top: `${ball().y}px`,
            left: `${ball().x}px`,
          }}
        ></div>
        <div
          class={styles.playerA}
          style={{
            width: `${playerSize}px`,
            height: `${playerSize}px`,
            top: `${maxHeight - playerSize}px`,
            left: `${playerA()}px`,
          }}
        ></div>
        <div
          class={styles.playerB}
          style={{
            width: `${playerSize}px`,
            height: `${playerSize}px`,
            top: `${maxHeight - playerSize}px`,
            left: `${playerB()}px`,
          }}
        ></div>
        <div
          class={styles.net}
          style={{
            top: `${maxHeight - 30}px`,
            left: `${(maxWidth - 4) / 2}px`,
          }}
        ></div>
        <div
          class={styles.floor}
          style={{
            top: `${maxHeight}px`,
            width: `${maxWidth + 80}px`,
            left: "-40px",
          }}
        ></div>
        <div
          class={styles.wall}
          style={{
            top: `${maxHeight / 2}px`,
            left: `${maxWidth}px`,
            height: `${maxHeight / 2}px`,
          }}
        ></div>
        <div
          class={styles.wall}
          style={{
            top: `${maxHeight / 2}px`,
            left: `${-40}px`,
            height: `${maxHeight / 2}px`,
          }}
        ></div>
      </div>
    </div>
  );
};

export default TenisField;
