import { createSignal, onCleanup } from "solid-js";
import styles from "./space-field.module.scss";

const SpaceField = () => {
  const [ball, setBall] = createSignal({ x: 245, y: 125 });
  const [mov, setMov] = createSignal({ x: 1, y: 1 });

  const [player, setPlayer] = createSignal({ x: 265, y: 145 });

  const ballSize = 10;
  const playerSize = 20;
  const maxWidth = 480;
  const maxHeight = 360;

  function checkCollision(): void {
    if (ball().x >= maxWidth - ballSize)
      setMov({ x: -Math.abs(mov().x), y: mov().y });
    if (ball().x <= 0) setMov({ x: Math.abs(mov().x), y: mov().y });
    if (ball().y >= maxHeight - ballSize)
      setMov({ y: -Math.abs(mov().y), x: mov().x });
    if (ball().y <= 0) setMov({ y: Math.abs(mov().y), x: mov().x });
  }

  function normalize(angle: number, magnitude: number = 1): void {}

  function checkPlayerCollision(): boolean {
    return (
      Math.abs(
        Math.sqrt(
          Math.pow(ball().x + ballSize / 2 - (player().x + playerSize / 2), 2) +
            Math.pow(ball().y + ballSize / 2 - (player().y + playerSize / 2), 2)
        )
      ) <=
      (ballSize + playerSize) / 2
    );
  }

  function bounce() {
    const ballAngle =
      (Math.atan2(
        ball().y + ballSize / 2 - (player().y + playerSize / 2),
        ball().x + ballSize / 2 - (player().x + playerSize / 2)
      ) /
        Math.PI) *
      180;
    const movAngle = (Math.atan2(mov().y, mov().x) / Math.PI) * 180;
    const newAngle = ballAngle - movAngle;
  }

  const tick = setInterval(() => {
    checkCollision();
    if (checkPlayerCollision()) bounce();
    setBall({ x: ball().x + mov().x, y: ball().y + mov().y });
  }, 16);

  const stop = () => clearInterval(tick);

  onCleanup(() => clearInterval(tick));

  return (
    <div class={styles.fieldContainer}>
      <div class={styles.positionContainer}>
        <p>X: {ball().x}</p>
        <p>Y: {ball().y}</p>
        <button onclick={stop}>Stop</button>
      </div>
      <div class={styles.field}>
        <div
          class={styles.ball}
          style={{ top: `${ball().y}px`, left: `${ball().x}px` }}
        ></div>
        <div
          class={styles.player}
          style={{ top: `${player().y}px`, left: `${player().x}px` }}
        ></div>
      </div>
    </div>
  );
};

export default SpaceField;
