export const scrollToTop = (targetId: string) => {
  const containerElement = document.getElementById(targetId);
  if (containerElement) containerElement.scrollTop = 0;
  if (typeof window !== "undefined") window.scrollTo(0, 0);
};
