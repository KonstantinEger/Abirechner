function avgArray(array: Array<number>): number {
  const sum = array.reduce((sum: number, item: number) => sum + item, 0);
  return sum / array.length;
}

function preciseRound(x: number, numDigits: number): number {
  return parseFloat(x.toFixed(numDigits));
}

function range(from: number, to: number): number[] {
  return [...Array(to - from).keys()].map(index => index + from);
}

export {
  avgArray,
  preciseRound,
  range
}
