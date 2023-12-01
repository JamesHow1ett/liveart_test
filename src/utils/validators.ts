import { ONE_MB_BYTES, allowedFileTypes } from './constants';

export type ValidatorFn = (value: any) => true | string;

export function supportedMedias(formats: string[] = allowedFileTypes): ValidatorFn {
  return (file: File[] | null) => {
    const isValidMediaFormat = Array.isArray(file) && formats.includes(file[0].type);
    return isValidMediaFormat || `Supported ${allowedFileTypes.join(', ')} files only`;
  };
}

export function supportedFileSize(bytes: number = ONE_MB_BYTES): ValidatorFn {
  return (file: File[] | null) => {
    const isValidSize = Array.isArray(file) && file[0].size <= bytes;
    return isValidSize || 'Maximum allowed file size is: 1Mb';
  };
}
