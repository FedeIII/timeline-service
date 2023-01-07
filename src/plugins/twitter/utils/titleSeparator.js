export function titleSeparator(title) {
  if (!title)
    return "";

  if (title.charAt(title.length - 1) === ".") {
    return " ";
  }

  if (title.charAt(title.length - 1) === "!") {
    return " ";
  }

  return ". ";
}
