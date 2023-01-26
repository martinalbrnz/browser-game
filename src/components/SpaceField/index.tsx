import { interval } from "rxjs";
import { createSignal, onCleanup } from "solid-js";
import styles from "./space-field.module.scss";

const SpaceField = () => {
  const [ball, setBall] = createSignal({ x: 190, y: 191 });
  const [mov, setMov] = createSignal({ x: 1, y: 1 });

  const [playersA, setPlayersA] = createSignal([
    { id: 1, x: 120, y: 200 },
    { id: 2, x: 100, y: 160 },
    { id: 3, x: 140, y: 280 },
    { id: 4, x: 210, y: 211 },
    { id: 5, x: 210, y: 200 },
    { id: 6, x: 90, y: 235 },
    { id: 7, x: 90, y: 235 },
    { id: 8, x: 90, y: 235 },
    { id: 9, x: 90, y: 235 },
    { id: 10, x: 90, y: 235 },
    { id: 11, x: 90, y: 235 },
  ]);
  const [playersB, setPlayersB] = createSignal([
    { id: 1, x: 165, y: 160 },
    { id: 2, x: 165, y: 250 },
    { id: 3, x: 200, y: 280 },
    { id: 4, x: 200, y: 170 },
    { id: 5, x: 120, y: 255 },
    { id: 6, x: 180, y: 140 },
    { id: 7, x: 180, y: 140 },
    { id: 8, x: 180, y: 140 },
    { id: 9, x: 180, y: 140 },
    { id: 10, x: 180, y: 140 },
    { id: 11, x: 180, y: 140 },
  ]);

  const ballSize = 10;
  const playerSize = 20;
  const maxWidth = 480;
  const maxHeight = 360;
  const tickTime = 100;

  const tick$ = interval(tickTime).subscribe(() => {
    moveBall();
    checkWallCollision();
    checkPlayersCollision();
  });

  function checkWallCollision(): void {
    if (ball().x >= maxWidth - ballSize)
      setMov({ x: -Math.abs(mov().x), y: mov().y });
    if (ball().x <= 0) setMov({ x: Math.abs(mov().x), y: mov().y });
    if (ball().y >= maxHeight - ballSize)
      setMov({ y: -Math.abs(mov().y), x: mov().x });
    if (ball().y <= 0) setMov({ y: Math.abs(mov().y), x: mov().x });
  }

  function moveBall() {
    setBall({ x: ball().x + mov().x, y: ball().y + mov().y });
  }

  function bounce(dir: string) {
    switch (dir) {
      case "right":
        setMov({ x: 1, y: mov().y });
        break;
      case "left":
        setMov({ x: -1, y: mov().y });
        break;
      case "up":
        setMov({ x: mov().x, y: -1 });
        break;
      case "down":
        setMov({ x: mov().x, y: 1 });
        break;
    }
  }

  function checkItemCollision(posX: number, posY: number) {
    const diffX = posX - ball().x;
    const diffY = posY - ball().y;
    if (
      diffX > 0 &&
      diffX <= ballSize &&
      diffY < ballSize &&
      diffY > -playerSize
    ) {
      bounce("left");
    }
    if (
      diffX < 0 &&
      diffX >= -playerSize &&
      diffY < ballSize &&
      diffY > -playerSize
    ) {
      bounce("right");
    }
    if (
      diffY > 0 &&
      diffY <= ballSize &&
      diffX < ballSize &&
      diffX > -playerSize
    ) {
      bounce("up");
    }
    if (
      diffY < 0 &&
      diffY >= -playerSize &&
      diffX <= ballSize &&
      diffX > -playerSize
    ) {
      bounce("down");
    }
  }

  function checkPlayersCollision() {
    playersA().map((player) => {
      checkItemCollision(player.x, player.y);
    });
    playersB().map((player) => {
      checkItemCollision(player.x, player.y);
    });
  }

  onCleanup(() => {
    tick$.unsubscribe();
  });

  return (
    <div class={styles.fieldContainer}>
      <div class={styles.positionContainer}>
        <p>X: {ball().x.toFixed()}</p>
        <p>Y: {ball().y.toFixed()}</p>
        {/* <p>Mx: {mov().x.toFixed(2)}</p>
        <p>My: {mov().y.toFixed(2)}</p> */}
      </div>
      <div class={styles.field}>
        <div
          class={styles.ball}
          style={{ top: `${ball().y}px`, left: `${ball().x}px` }}
        ></div>
        {playersA().map((player) => {
          return (
            <div
              class={`${styles.player} ${styles.playerA}`}
              style={{ top: `${player.y}px`, left: `${player.x}px` }}
            ></div>
          );
        })}
        {playersB().map((player) => {
          return (
            <div
              class={`${styles.player} ${styles.playerB}`}
              style={{ top: `${player.y}px`, left: `${player.x}px` }}
            ></div>
          );
        })}
      </div>
    </div>
  );
};

export default SpaceField;
