export const getOrderTitle = (
  city: string,
  startDate: Date,
  endDate: Date,
): string => {
  const formatDate = (date: Date) =>
    date.toLocaleDateString("ru-RU", {
      month: "long",
      day: "numeric",
    });

  const isSameMonth =
    startDate.getMonth() === endDate.getMonth() &&
    startDate.getFullYear() === endDate.getFullYear();

  const title = isSameMonth
    ? `${startDate.getDate()} - ${formatDate(startDate)}`
    : `${formatDate(startDate)} - ${formatDate(startDate)}`;

  return `${city}, ${title}`;
};
