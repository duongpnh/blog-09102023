export const getGreetingMessage = (): string => {
  const current = new Date();
  const hour = current.getHours();

  if (hour >= 0 && hour < 12) {
    return "Good Morning";
  }

  if (hour >= 12 && hour < 16) {
    return "Good Afternoon";
  }

  if (hour >= 16 && hour < 21) {
    return "Good Evening";
  }

  return "Good Night";
};
