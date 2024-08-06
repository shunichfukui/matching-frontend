export const iso8601ToDateTime = (iso8601: string) => {
  const date = new Date(Date.parse(iso8601));
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();

  return `${year}年${month}月${day}日${hour}時${minute}分`;
};
