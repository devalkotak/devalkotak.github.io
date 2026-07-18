export const easing = [0.22, 1, 0.36, 1] as const;

export const pageContainer = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: easing, staggerChildren: 0.08 },
  },
};

export const pageItem = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easing } },
};
