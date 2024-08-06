import { UpdateUserFormData } from 'interfaces/index';

export const createFormData = (
  name: string | undefined,
  prefecture: number | undefined,
  profile: string | undefined,
  image: string
): UpdateUserFormData => {
  const formData = new FormData();

  formData.append('name', name || '');
  formData.append('prefecture', String(prefecture));
  formData.append('profile', profile || '');
  formData.append('image', image);

  return formData;
};
