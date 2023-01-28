import styles from "./tenis-field.module.scss";

import { createSignal } from "solid-js";

const TenisField = () => {
  const ballSize = 10
  const playerSize = 20

  const [ball, setBall] = createSignal({ x: 200, y: 400 });
  const [ballMov, setBallMov] = createSignal({ x: 0, y: 0 });
  const [playerA, setPlayerA] = createSignal(100);
  const [playerB, setPlayerB] = createSignal(400);
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
        top: `400px`,
        left: `${playerA()}px`
      }}
    ></div>
    <div
      class={styles.playerB}
      style={{
        width: `${playerSize}px`,
        height: `${playerSize}px`,
        top: `400px`,
        left: `${playerB()}px`
      }}
    ></div>
  </div>;
};

export default TenisField
