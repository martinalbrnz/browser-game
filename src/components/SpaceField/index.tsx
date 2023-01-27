import { interval } from "rxjs";
import { createSignal, onCleanup } from "solid-js";
import setInitialPositions from "~/functions/initialPositions";
import styles from "./space-field.module.scss";

const SpaceField = () => {
  const ballSize = 10;
  const playerSize = 20;
  const maxWidth = 500;
  const maxHeight = 320;
  const goalHeight = 120;
  const goalWidth = 10;
  const tickTime = 10;
  const maxOffset1 = 100; // second and fourth
  const maxOffset2 = 60; // first and third
  const ballInitial = {
    x: (maxWidth - ballSize) / 2,
    y: (maxHeight - ballSize) / 2,
  };
  const { initA, initB } = setInitialPositions(
    maxWidth,
    maxHeight,
    playerSize,
    maxOffset1,
    maxOffset2
  );

  const [ball, setBall] = createSignal(ballInitial);
  const [mov, setMov] = createSignal({ x: 1, y: 1 });
  const [score, setScore] = createSignal({ a: 0, b: 0 });
  const [offsetA1Y, setOffsetA1Y] = createSignal(0);
  const [offsetA2Y, setOffsetA2Y] = createSignal(0);
  const [offsetB1Y, setOffsetB1Y] = createSignal(0);
  const [offsetB2Y, setOffsetB2Y] = createSignal(0);
  const [playersA, setPlayersA] = createSignal(initA);
  const [playersB, setPlayersB] = createSignal(initB);
  const [movA1Y, setMovA1Y] = createSignal(0);
  const [movA2Y, setMovA2Y] = createSignal(0);
  const [movB1Y, setMovB1Y] = createSignal(0);
  const [movB2Y, setMovB2Y] = createSignal(0);

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
        if ([1, 8, 5, 6, 7].includes(player.id)) {
          return { id: player.id, x: player.x, y: player.y + movA2Y() };
        } else {
          return { id: player.id, x: player.x, y: player.y + movA1Y() };
        }
      })
    );
    setPlayersB(
      playersB().map((player) => {
        if ([1, 8, 5, 6, 7].includes(player.id)) {
          return { id: player.id, x: player.x, y: player.y + movB2Y() };
        } else {
          return { id: player.id, x: player.x, y: player.y + movB1Y() };
        }
      })
    );
    setMovA1Y(0);
    setMovA2Y(0);
    setMovB1Y(0);
    setMovB2Y(0);
  }

  function getControls() {
    const gamepadA = navigator.getGamepads()[0];
    const gamepadB = navigator.getGamepads()[1];

    /* Button movements */
    /* Second and fourth columns A player */
    if (
      gamepadA?.buttons[0].pressed &&
      offsetA1Y() < maxOffset1 &&
      !gamepadA?.buttons[1].pressed
    ) {
      setMovA1Y(1);
      setOffsetA1Y(offsetA1Y() + 1);
    }
    if (
      gamepadA?.buttons[1].pressed &&
      offsetA1Y() > -maxOffset1 &&
      !gamepadA?.buttons[0].pressed
    ) {
      setMovA1Y(-1);
      setOffsetA1Y(offsetA1Y() - 1);
    }

    /* First and third columns */
    if (
      gamepadA?.buttons[2].pressed &&
      offsetA2Y() < maxOffset2 &&
      !gamepadA?.buttons[3].pressed
    ) {
      setMovA2Y(1);
      setOffsetA2Y(offsetA2Y() + 1);
    }
    if (
      gamepadA?.buttons[3].pressed &&
      offsetA2Y() > -maxOffset2 &&
      !gamepadA?.buttons[2].pressed
    ) {
      setMovA2Y(-1);
      setOffsetA2Y(offsetA2Y() - 1);
    }

    /* Second and fourth columns B player */
    if (
      gamepadB?.buttons[0].pressed &&
      offsetB2Y() < maxOffset2 &&
      !gamepadB?.buttons[1].pressed
    ) {
      setMovB2Y(1);
      setOffsetB2Y(offsetB2Y() + 1);
    }
    if (
      gamepadB?.buttons[1].pressed &&
      offsetB2Y() > -maxOffset2 &&
      !gamepadB?.buttons[0].pressed
    ) {
      setMovB2Y(-1);
      setOffsetB2Y(offsetB2Y() - 1);
    }

    /* First and third columns B player */
    if (
      gamepadB?.buttons[2].pressed &&
      offsetB1Y() < maxOffset1 &&
      !gamepadB?.buttons[3].pressed
    ) {
      setMovB1Y(1);
      setOffsetB1Y(offsetB1Y() + 1);
    }
    if (
      gamepadB?.buttons[3].pressed &&
      offsetB1Y() > -maxOffset1 &&
      !gamepadB?.buttons[2].pressed
    ) {
      setMovB1Y(-1);
      setOffsetB1Y(offsetB1Y() - 1);
    }
    /* Axis movements */
    /* Second and fourth columns A player */
    if (
      gamepadA?.axes &&
      ((gamepadA?.axes[3]! > 0.05 && offsetA1Y() < maxOffset1) ||
        (gamepadA?.axes[3]! < -0.05 && offsetA1Y() > -maxOffset1)) &&
      !gamepadA?.buttons[1].pressed &&
      !gamepadA?.buttons[0].pressed
    ) {
      setMovA1Y(gamepadA?.axes[3]);
      setOffsetA1Y(offsetA1Y() + gamepadA?.axes[3]);
    }

    /* First and third columns */
    if (
      gamepadA?.axes &&
      ((gamepadA?.axes[1]! > 0.05 && offsetA2Y() < maxOffset2) ||
        (gamepadA?.axes[1]! < -0.05 && offsetA2Y() > -maxOffset2)) &&
      !gamepadA?.buttons[2].pressed &&
      !gamepadA?.buttons[3].pressed
    ) {
      setMovA2Y(gamepadA?.axes[1]);
      setOffsetA2Y(offsetA2Y() + gamepadA?.axes[1]);
    }

    /* Second and fourth columns B player */
    if (
      gamepadB?.axes &&
      ((gamepadB?.axes[1]! > 0.05 && offsetB1Y() < maxOffset1) ||
        (gamepadB?.axes[1]! < -0.05 && offsetB1Y() > -maxOffset1)) &&
      !gamepadB?.buttons[1].pressed &&
      !gamepadB?.buttons[0].pressed
    ) {
      setMovB1Y(gamepadB?.axes[1]);
      setOffsetB1Y(offsetB1Y() + gamepadB?.axes[1]);
    }

    /* First and third columns B player */
    if (
      gamepadB?.axes &&
      ((gamepadB?.axes[3]! > 0.05 && offsetB2Y() < maxOffset2) ||
        (gamepadB?.axes[3]! < -0.05 && offsetB2Y() > -maxOffset2)) &&
      !gamepadB?.buttons[2].pressed &&
      !gamepadB?.buttons[3].pressed
    ) {
      setMovB2Y(gamepadB?.axes[3]);
      setOffsetB2Y(offsetB2Y() + gamepadB?.axes[3]);
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
      <div
        class={styles.field}
        style={{ width: `${maxWidth}px`, height: `${maxHeight}px` }}
      >
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
        <p>offA: {offsetA1Y().toFixed()}</p>
        <p>offB: {offsetB1Y().toFixed()}</p>
      </div>
    </div>
  );
};

export default SpaceField;
