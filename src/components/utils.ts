function concatArray(array: Array<number>): string {
  return array.reduce((str: string, item: number) => {
    return `${str} ${item},`;
  }, '');
}

function avgArray(array: Array<number>): number {
  const sum = array.reduce((sum: number, item: number) => sum + item, 0);
  return sum / array.length;
}

function preciseRound(x: number, numDigits: number): number {
  return parseFloat(x.toFixed(numDigits));
}

export {
  avgArray,
  concatArray,
  preciseRound
}
