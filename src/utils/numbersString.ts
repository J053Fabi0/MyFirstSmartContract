/**
 * Given an integer in string format, fix its decimals.
 * It removes useless 0s.
 */
export function toFixedS(string: string | number | bigint, decimals: number): string {
  string = string.toString();
  const indexOfDot = string.indexOf(".");
  if (indexOfDot === -1) return string;
  const intPart = string.substring(0, indexOfDot);
  if (decimals === 0) return intPart;
  const decimalPart = string.substring(indexOfDot + 1, indexOfDot + 1 + decimals);
  return leading0s(`${intPart}.${decimalPart}`);
}

/**
 * Move the "." decimal point of a number in string format. The position could be negative or positive.
 * It removes useless 0s.
 */
export function moveDecimalDot(string: string | number | bigint, positions: number): string {
  string = string.toString();
  if (positions === 0) return string;
  const indexOfDot = string.indexOf(".");
  const intPart = indexOfDot === -1 ? string : string.substring(0, indexOfDot);
  const decimalPart = indexOfDot === -1 ? "" : string.substring(indexOfDot + 1, string.length);

  if (positions > 0) {
    return leading0s(
      intPart +
        decimalPart.substring(0, positions) +
        (positions >= decimalPart.length ? "" : ".") +
        decimalPart.substring(positions, decimalPart.length) +
        (positions >= decimalPart.length ? "0".repeat(positions - decimalPart.length) : "")
    );
  } else {
    return leading0s(
      intPart.substring(0, intPart.length + positions) +
        (intPart.length <= Math.abs(positions) ? `0.${"0".repeat(Math.abs(positions) - intPart.length)}` : ".") +
        intPart.substring(intPart.length + positions, intPart.length) +
        decimalPart
    );
  }
}

/**
 * Given a string with usless 0 after the decimal point, it removes them.
 * It doesn't remove the decimal point if it's the last character.
 */
export function leading0s(n: string) {
  n = n.toString();
  if (/\./.test(n)) {
    n = n.replace(/(0+)$/g, "");
    if (n.charAt(n.length - 1) === ".") n = n.substring(0, n.length - 1);
  }
  return n;
}

/**
 * It adds commas to any number. 1000 -> 1,000.
 *
 * @return: String
 */
export function numberWithCommas(x: number | string | bigint) {
  return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}
