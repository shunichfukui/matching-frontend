import { prefectures } from 'data/prefectures';

export const calculateUserAge = (birthday: string | undefined): number => {
  if (!birthday) return 0;
  const formattedBirthday = birthday.replace(/-/g, '');
  if (formattedBirthday.length !== 8) return 0;

  const date = new Date();
  const today =
    date.getFullYear() + ('0' + (date.getMonth() + 1)).slice(-2) + ('0' + date.getDate()).slice(-2);

  return Math.floor((parseInt(today) - parseInt(formattedBirthday)) / 10000);
};

export const getUserPrefecture = (userPrefecture: number | undefined): string => {
  return prefectures[(userPrefecture || 0) - 1];
};
