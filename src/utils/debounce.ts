/* eslint-disable @typescript-eslint/no-explicit-any */

export const debounce = (
  func: (value: string) => void,
  delay: number = 2000
) => {
  let timer: NodeJS.Timeout;

  return function (args: any) {
    clearTimeout(timer);
    console.log("debounce", args, delay);

    timer = setTimeout(() => {
      func(args);
    }, delay);
  };
};
