import { fromEvent, throttleTime } from "rxjs";
import { createSignal, onCleanup } from "solid-js";
import styles from "./space-field.module.scss";

const SpaceField = () => {
  const [ball, setBall] = createSignal({ x: 10, y: 136 });
  const [mov, setMov] = createSignal({ x: 1, y: 0 });

  const [player, setPlayer] = createSignal({ x: 265, y: 145 });

  const ballSize = 10;
  const playerSize = 20;
  const maxWidth = 480;
  const maxHeight = 360;
  const moves$ = fromEvent(document, "keydown")
    .pipe(throttleTime(100))
    .subscribe((val: any) => {
      if (val.key === "a") setPlayer({ x: player().x - 10, y: player().y });
      if (val.key === "w") setPlayer({ x: player().x, y: player().y - 10 });
      if (val.key === "d") setPlayer({ x: player().x + 10, y: player().y });
      if (val.key === "s") setPlayer({ x: player().x, y: player().y + 10 });
    });

  function checkCollision(): void {
    if (ball().x >= maxWidth - ballSize)
      setMov({ x: -Math.abs(mov().x), y: mov().y });
    if (ball().x <= 0) setMov({ x: Math.abs(mov().x), y: mov().y });
    if (ball().y >= maxHeight - ballSize)
      setMov({ y: -Math.abs(mov().y), x: mov().x });
    if (ball().y <= 0) setMov({ y: Math.abs(mov().y), x: mov().x });
  }

  function normalize(angle: number, magnitude: number = 1): void {
    const i = Math.cos(angle) * magnitude;
    const j = Math.sin(angle) * magnitude;
    setMov({ x: i, y: j });
  }

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
    const ballAngle = Math.atan2(
      ball().y + ballSize / 2 - (player().y + playerSize / 2),
      ball().x + ballSize / 2 - (player().x + playerSize / 2)
    );
    const movAngle = Math.atan2(mov().y, mov().x);
    const newAngle = ballAngle - movAngle;
    normalize(-newAngle);
  }

  const tick = setInterval(() => {
    checkCollision();
    if (checkPlayerCollision()) bounce();
    setBall({ x: ball().x + mov().x, y: ball().y + mov().y });
  }, 5);

  const stop = () => clearInterval(tick);
  onCleanup(() => {
    clearInterval(tick);
    moves$.unsubscribe();
  });

  return (
    <div class={styles.fieldContainer}>
      <div class={styles.positionContainer}>
        <p>X: {ball().x.toFixed()}</p>
        <p>Y: {ball().y.toFixed()}</p>
        <p>Mx: {mov().x.toFixed(2)}</p>
        <p>My: {mov().y.toFixed(2)}</p>
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
