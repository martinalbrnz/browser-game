import { createSignal, onCleanup } from "solid-js";
import styles from "./space-field.module.scss";

const SpaceField = () => {
  const [ball, setBall] = createSignal({ x: 200, y: 80 });
  const [mov, setMov] = createSignal({ x: 1, y: 1 });

  const [player, setPlayer] = createSignal({ x: 240, y: 120 });

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

  function normalize(): void {}

  function checkPlayerCollision(): boolean {
    const collX = Math.abs(ball().x - player().x) < (ballSize + playerSize) / 2;
    const collY = Math.abs(ball().y - player().y) < (ballSize + playerSize) / 2;
    return collX && collY;
  }

  const tick = setInterval(() => {
    checkCollision();
    // checkPlayerCollision();
    setBall({ x: ball().x + mov().x, y: ball().y + mov().y });
  }, 100);

  onCleanup(() => clearInterval(tick));

  return (
    <div class={styles.fieldContainer}>
      <div class={styles.positionContainer}>
        <p>X: {ball().x}</p>
        <p>Y: {ball().y}</p>
        <p>Collision?: {() => (checkPlayerCollision() ? "true" : "false")}</p>
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
