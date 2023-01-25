import { createEffect, createSignal, onCleanup } from "solid-js";
import styles from "./space-field.module.scss";

const SpaceField = () => {
  const [ball, setBall] = createSignal({ x: 200, y: 80 });
  const [mov, setMov] = createSignal({ x: 1, y: 1 });

  const [player, setPlayer] = createSignal({ x: 400, y: 280 });

  const ballSize = 10;
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

  const tick = setInterval(() => {
    checkCollision();
    setBall({ x: ball().x + mov().x, y: ball().y + mov().y });
  }, 8);

  onCleanup(() => clearInterval(tick));

  return (
    <div class={styles.fieldContainer}>
      <div class={styles.positionContainer}>
        <p>X: {ball().x}</p>
        <p>Y: {ball().y}</p>
      </div>
      <div class={styles.field}>
        <div
          class={styles.ball}
          style={{ top: `${ball().y}px`, left: `${ball().x}px` }}
        ></div>
				<div class={styles.player}
					style={{top: `${player().y}px`, left: `${player().x}px`}}
				></div>
      </div>
    </div>
  );
};

export default SpaceField;
