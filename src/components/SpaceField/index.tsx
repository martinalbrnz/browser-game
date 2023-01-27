import { interval } from "rxjs";
import { createSignal, onCleanup } from "solid-js";
import styles from "./space-field.module.scss";

const SpaceField = () => {
  const ballSize = 10;
  const playerSize = 20;
  const maxWidth = 480;
  const maxHeight = 360;
  const goalHeight = 120;
  const goalWidth = 10;
  const tickTime = 10;
  const ballInitial = {
    x: (maxWidth - ballSize) / 2,
    y: (maxHeight - ballSize) / 2,
  };

  const [ball, setBall] = createSignal(ballInitial);
  const [mov, setMov] = createSignal({ x: 1, y: 1 });
  const [score, setScore] = createSignal({ a: 0, b: 0 });
  const [offsetA, setOffsetA] = createSignal(0);
  const [offsetB, setOffsetB] = createSignal(0);
  const [playersA, setPlayersA] = createSignal([
    { id: 1, x: 10, y: 170 },
    { id: 2, x: 70, y: 70 },
    { id: 3, x: 70, y: 270 },
    { id: 4, x: 70, y: 170 },
    { id: 5, x: 198, y: 290 },
    { id: 6, x: 198, y: 200 },
    { id: 7, x: 198, y: 140 },
    { id: 8, x: 198, y: 50 },
    { id: 9, x: 326, y: 70 },
    { id: 10, x: 326, y: 170 },
    { id: 11, x: 326, y: 270 },
  ]);
  const [playersB, setPlayersB] = createSignal([
    { id: 1, x: 450, y: 170 },
    { id: 2, x: 390, y: 70 },
    { id: 3, x: 390, y: 270 },
    { id: 4, x: 390, y: 170 },
    { id: 5, x: 262, y: 290 },
    { id: 6, x: 262, y: 200 },
    { id: 7, x: 262, y: 140 },
    { id: 8, x: 262, y: 50 },
    { id: 9, x: 134, y: 70 },
    { id: 10, x: 134, y: 170 },
    { id: 11, x: 134, y: 270 },
  ]);
  const [movA, setMovA] = createSignal(0);
  const [movB, setMovB] = createSignal(0);

  const tick$ = interval(tickTime).subscribe(() => {
    getControls();
    movePlayers();
    moveBall();
    checkWallCollision();
    checkPlayersCollision();
    moveBall();
    checkWallCollision();
    checkPlayersCollision();
  });

  function checkWallCollision(): void {
    if (ball().x >= maxWidth - ballSize) {
      setMov({ x: -Math.abs(mov().x), y: mov().y });
      const insideGoal =
        ball().y + ballSize / 2 >= (maxHeight - goalHeight) / 2 &&
        ball().y + ballSize / 2 <= (maxHeight - goalHeight) / 2 + goalHeight;
      if (insideGoal) {
        setScore({ a: score().a + 1, b: score().b });
        setBall(ballInitial);
      }
    }
    if (ball().x <= 0) {
      setMov({ x: Math.abs(mov().x), y: mov().y });
      const insideGoal =
        ball().y + ballSize / 2 >= (maxHeight - goalHeight) / 2 &&
        ball().y + ballSize / 2 <= (maxHeight - goalHeight) / 2 + goalHeight;
      if (insideGoal) {
        setScore({ a: score().a, b: score().b + 1 });
        setBall(ballInitial);
      }
    }
    if (ball().y >= maxHeight - ballSize)
      setMov({ y: -Math.abs(mov().y), x: mov().x });
    if (ball().y <= 0) setMov({ y: Math.abs(mov().y), x: mov().x });
  }

  function moveBall() {
    setBall({ x: ball().x + mov().x, y: ball().y + mov().y });
  }

  function movePlayers() {
    setPlayersA(
      playersA().map((player) => {
        return { id: player.id, x: player.x, y: player.y + movA() };
      })
    );
    setPlayersB(
      playersB().map((player) => {
        return { id: player.id, x: player.x, y: player.y + movB() };
      })
    );
    setMovA(0);
    setMovB(0);
  }

  function getControls() {
    const gamepadA = navigator.getGamepads()[0];
    const gamepadB = navigator.getGamepads()[1];
    // console.log(gamepadA);

    /* Button movements */
    if (
      gamepadA?.buttons[0].pressed &&
      offsetA() < 50 &&
      !gamepadA?.buttons[1].pressed
    ) {
      setMovA(1);
      setOffsetA(offsetA() + 1);
    }
    if (
      gamepadA?.buttons[1].pressed &&
      offsetA() > -50 &&
      !gamepadA?.buttons[0].pressed
    ) {
      setMovA(-1);
      setOffsetA(offsetA() - 1);
    }
    if (
      gamepadB?.buttons[0].pressed &&
      offsetB() < 50 &&
      !gamepadB?.buttons[1].pressed
    ) {
      setMovB(1);
      setOffsetB(offsetB() + 1);
    }
    if (
      gamepadB?.buttons[1].pressed &&
      offsetB() > -50 &&
      !gamepadB?.buttons[0].pressed
    ) {
      setMovB(-1);
      setOffsetB(offsetB() - 1);
    }
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
      <h2>
        {score().a} : {score().b}
      </h2>
      <div class={styles.field}>
        <div
          class={styles.goal}
          style={{
            top: `${(maxHeight - goalHeight) / 2}px`,
            left: `${-goalWidth}px`,
            height: `${goalHeight}px`,
            width: `${goalWidth}px`,
          }}
        ></div>
        <div
          class={styles.goal}
          style={{
            top: `${(maxHeight - goalHeight) / 2}px`,
            left: `${maxWidth}px`,
            height: `${goalHeight}px`,
            width: `${goalWidth}px`,
          }}
        ></div>

        <div
          class={styles.ball}
          style={{ top: `${ball().y}px`, left: `${ball().x}px` }}
        ></div>
        {playersA().map((player) => {
          return (
            <div
              class={`${styles.player} ${styles.playerA}`}
              style={{ top: `${player.y}px`, left: `${player.x}px` }}
            >
              <span>{player.id}</span>
            </div>
          );
        })}
        {playersB().map((player) => {
          return (
            <div
              class={`${styles.player} ${styles.playerB}`}
              style={{ top: `${player.y}px`, left: `${player.x}px` }}
            >
              <span>{player.id}</span>
            </div>
          );
        })}
      </div>
      <div class={styles.positionContainer}>
        <p>X: {ball().x.toFixed()}</p>
        <p>Y: {ball().y.toFixed()}</p>
        <p>offA: {offsetA().toFixed()}</p>
        <p>offB: {offsetB().toFixed()}</p>
      </div>
    </div>
  );
};

export default SpaceField;
