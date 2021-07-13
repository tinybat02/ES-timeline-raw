export const formatTime = (min: number) => {
  const hour = Math.floor(min / 60);
  const minute = min % 60;

  const minText = minute < 10 ? '0' + minute : minute;

  return hour + ':' + minText;
};

export const formatMinSec = (sec: number) => {
  if (sec < 60) return `${sec}s`;

  const minute = Math.floor(sec / 60);
  const second = sec % 60;

  const secText = second > 0 ? `${second}s` : '';
  const minText = `${minute}m`;
  return minText + secText;
};

export const formatHourMin = (min: number) => {
  if (min < 60) return `${min}m`;

  const hour = Math.floor(min / 60);
  const minute = min % 60;

  const minText = minute > 0 ? `${minute}m` : '';
  const hourText = `${hour}h`;
  return hourText + minText;
};
