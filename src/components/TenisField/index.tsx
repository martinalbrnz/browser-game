import { createSignal } from "solid-js";

const TenisField = () => {
  const [ball, setBall] = createSignal({ x: 0, y: 0 });
  const [ballMov, setBallMov] = createSignal({ x: 0, y: 0 });
  return <div>Tenis field</div>;
};

export default TenisField;
