export const startTimer = (duration, onTimesUp) => {
    let time = duration;
    const interval = setInterval(() => {
      time--;
      if (time <= 0) {
        clearInterval(interval);
        onTimesUp();
      }
    }, 1000);
  
    return interval;
  };