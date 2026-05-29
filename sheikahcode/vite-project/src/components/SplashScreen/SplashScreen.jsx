import { useEffect } from "react";

export default function SplashScreen({ onFinish }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // 3. o JSX fica aqui, fora do useEffect
  return (
    <div>
      <h1>Sheikah Slate</h1>
    </div>
  );
}
