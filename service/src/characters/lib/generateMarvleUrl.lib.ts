import { MarvelOptions } from 'interfaces/character.interface';
import * as crypto from 'crypto'

const generateMarvelURL = (options: MarvelOptions): string => {
  const publicKey = process.env.MARVEL_PUBLIC_KEY;
  const privateKey = process.env.MARVEL_PRIVATE_KEY;

  let timestamps = new Date().getTime();


  const hash = crypto.createHash('md5').update(timestamps + privateKey + publicKey).digest('hex');

  return `?ts=${timestamps}&apikey=${publicKey}&hash=${hash}&offset=${options.offset}&limit=${options.limit}`;
};

export default generateMarvelURL;
