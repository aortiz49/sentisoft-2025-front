export const screenWidth = () => {
  if (typeof window === "undefined" || typeof document === "undefined") return undefined;

  return (
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth ||
    window.screen.width
  );
};
