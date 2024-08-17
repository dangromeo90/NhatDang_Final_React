import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';

const UPLOAD_IMAGE = gql`
  mutation UploadImage($file: Upload!) {
    uploadImage(file: $file) {
      url
    }
  }
`;

export const useUploadImage = () => {
  const [uploadImage] = useMutation(UPLOAD_IMAGE);

  const upload = async (file) => {
    const { data } = await uploadImage({ variables: { file } });
    return data.uploadImage.url;
  };

  return { uploadImage: upload };
};
