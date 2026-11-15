const muted = [
  "Closing open session in favor of incoming prekey bundle",
  "Closing session:",
];

function shouldMute(args: unknown[]) {
  const text = args.map(String).join(" ");
  return muted.some((msg) => text.includes(msg));
}

const originalWarn = console.warn.bind(console);
const originalInfo = console.info.bind(console);

console.warn = (...args: unknown[]) => {
  if (shouldMute(args)) return;
  originalWarn(...args);
};

console.info = (...args: unknown[]) => {
  if (shouldMute(args)) return;
  originalInfo(...args);
};
