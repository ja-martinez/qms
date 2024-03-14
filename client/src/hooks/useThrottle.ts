import { useMemo } from "react";

function throttle<Args extends unknown[]>(
  fn: (..._args: Args) => void,
  cooldown: number,
) {
  let isOnCooldown: boolean;

  const throttled = (...args: Args) => {
    if (isOnCooldown) {
      return;
    }

    isOnCooldown = true;

    fn(...args);

    window.setTimeout(() => (isOnCooldown = false), cooldown);
  };

  return throttled;
}

export default function useThrottle<Args extends unknown[]>(
  cb: (..._args: Args) => void,
  cooldown: number,
  deps: React.DependencyList,
) {
  return useMemo(() => throttle(cb, cooldown), [...deps, cb, cooldown]);
}
