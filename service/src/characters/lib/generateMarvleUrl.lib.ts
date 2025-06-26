import { MarvelOptions } from 'interfaces/character.interface';
import * as crypto from 'crypto';

const generateMarvelURL = (
  options?: MarvelOptions | undefined,
  useAmpersand: boolean = false,
): string => {
  const publicKey = process.env.MARVEL_PUBLIC_KEY;
  const privateKey = process.env.MARVEL_PRIVATE_KEY;

  let timestamps = new Date().getTime();

  console.log('options',options);

  const hash = crypto
    .createHash('md5')
    .update(timestamps + privateKey + publicKey)
    .digest('hex');

  const prefix = useAmpersand ? '&' : '?';

  return `${prefix}ts=${timestamps}&apikey=${publicKey}&hash=${hash}${
    options ? `&offset=${options.offset}&limit=${options.limit}` : ''
  }`;
};
export default generateMarvelURL;
