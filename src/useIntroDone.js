// src/useIntroDone.js
import { useEffect, useState } from 'react';

export function useIntroDone() {
  const [done, setDone] = useState(() => !document.getElementById('ascii-horizon'));

  useEffect(() => {
    if (done) return;
    if (!document.getElementById('ascii-horizon')) { setDone(true); return; }
    const onDone = () => setDone(true);
    window.addEventListener('ascii-horizon:done', onDone);
    return () => window.removeEventListener('ascii-horizon:done', onDone);
  }, [done]);

  return done;
}