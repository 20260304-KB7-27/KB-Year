export const isSameDate = (d1, d2) => {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

export const formatTime = (dateString) => {
  const date = new Date(dateString);

  return date.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};
export const formatDate = (dateString) => {
  const date = new Date(dateString);

  return date.toLocaleDateString('ko-KR', {
    month: 'long',
    day: 'numeric',
  });
};
