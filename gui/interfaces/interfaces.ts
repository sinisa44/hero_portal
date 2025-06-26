export interface Character {
  id: number;
  name: string;
  description: string;
  modified: string;
  thumbnail: {
    path: string;
    extension: string;
  };
  resourceURI: string;
  comics: {
    available: number;
    collectionURI: string;
    items: Array<{
      resourceURI: string;
      name: string;
    }>;
    returned: number;
  };
  series: {
    available: number;
    collectionURI: string;
    items: Array<{
      resourceURI: string;
      name: string;
    }>;
    returned: number;
  };
  stories: {
    available: number;
    collectionURI: string;
    items: Array<{
      resourceURI: string;
      name: string;
      type: string;
    }>;
    returned: number;
  };
  events: {
    available: number;
    collectionURI: string;
    items: Array<any>;
    returned: number;
  };
  urls: Array<{
    type: string;
    url: string;
  }>;
}

export interface MarvelOptions {
  offset?: number | string;
  limit?: number | string;
}

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

export interface Creator {
  id: number;
  firstName: string;
  middleName: string;
  lastName: string;
  suffix: string;
  fullName: string;
  modified: string;
  thumbnail: {
    path: string;
    extension: string;
  };
  resourceURI: string;
  comics: {
    available: number;
    collectionURI: string;
    items: any[]; // You can define a more specific type if needed
    returned: number;
  };
  series: {
    available: number;
    collectionURI: string;
    items: any[]; // You can define a more specific type if needed
    returned: number;
  };
  stories: {
    available: number;
    collectionURI: string;
    items: any[]; // You can define a more specific type if needed
    returned: number;
  };
  events: {
    available: number;
    collectionURI: string;
    items: any[]; // You can define a more specific type if needed
    returned: number;
  };
  urls: {
    type: string;
    url: string;
  }[];
}

export interface RandomItems {
  character: Character;
  creator: Creator;
  comic: Comic;
}
