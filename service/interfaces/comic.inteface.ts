export interface Comic {
  id: number;
  digitalId: number;
  title: string;
  issueNumber: number;
  variantDescription: string;
  description: string;
  modified: string;
  isbn: string;
  upc: string;
  diamondCode: string;
  ean: string;
  issn: string;
  format: string;
  pageCount: number;
  resourceURI: string;
  urls: { type: string; url: string }[];
  series: { resourceURI: string; name: string };
  variants: { resourceURI: string; name: string }[];
  collections: any[];
  collectedIssues: any[];
  dates: { type: string; date: string }[];
  prices: { type: string; price: number }[];
  thumbnail: { path: string; extension: string };
  images: any[];
  creators: {
    available: number;
    collectionURI: string;
    items: any[];
    returned: number;
  };
  characters: {
    available: number;
    collectionURI: string;
    items: any[];
    returned: number;
  };
  stories: {
    available: number;
    collectionURI: string;
    items: any[];
    returned: number;
  };
  events: {
    available: number;
    collectionURI: string;
    items: any[];
    returned: number;
  };
}
