import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(utc);
dayjs.extend(timezone);

export const processDataES = (
  data: Array<{ hash_id: string; vendor: string; timestamp: number }>,
  min_duration: number
) => {
  // const timeSeries: { [key: string]: string[] } = {};
  const timeSeries: { [key: string]: number[] } = {};

  // data.map(item => {
  //   if (!timeSeries[item.hash_id]) {
  //     timeSeries[item.hash_id] = [
  //       dayjs
  //         .unix(item.timestamp)
  //         .tz('Europe/Berlin')
  //         .format('YYYY-MM-DDTHH:mm:s'),
  //     ];
  //   } else {
  //     timeSeries[item.hash_id].push(
  //       dayjs
  //         .unix(item.timestamp)
  //         .tz('Europe/Berlin')
  //         .format('YYYY-MM-DDTHH:mm:s')
  //     );
  //   }
  // });

  data.map(item => {
    if (!timeSeries[item.hash_id]) {
      timeSeries[item.hash_id] = [item.timestamp];
    } else {
      timeSeries[item.hash_id].push(item.timestamp);
    }
  });

  const returnData: { id: string; data: { x: string; y: number }[] }[] = [];
  Object.keys(timeSeries).map((hash, index) => {
    if (min_duration == 0) {
      returnData.push({
        id: hash,
        data: timeSeries[hash]
          .slice()
          .reverse()
          .map(timestamp => ({
            x: dayjs
              .unix(timestamp)
              .tz('Europe/Berlin')
              .format('YYYY-MM-DDTHH:mm:s'),
            y: index + 1,
          })),
      });
    } else {
      const duration = timeSeries[hash][0] - timeSeries[hash].slice(-1)[0];
      if (duration >= min_duration)
        returnData.push({
          id: hash,
          data: timeSeries[hash]
            .slice()
            .reverse()
            .map(timestamp => ({
              x: dayjs
                .unix(timestamp)
                .tz('Europe/Berlin')
                .format('YYYY-MM-DDTHH:mm:s'),
              y: index + 1,
            })),
        });
    }
  });

  // const returnData = Object.keys(timeSeries).map((hash, index) => ({
  //   id: hash,
  //   data: timeSeries[hash]
  //     .slice()
  //     .reverse()
  //     .map(timePoint => ({ x: timePoint, y: index + 1 })),
  // }));
  return { data: returnData };
};
