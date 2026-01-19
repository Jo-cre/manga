export interface Group {
  id: string;
  type: string;
  attributes: {
    name: string;
    altNames: {
      [x: string]: { name: string };
    };
    locked: boolean;
    website: string;
    ircServer: string | null;
    ircChannel: string | null;
    discord: string;
    contactEmail: string | null;
    description: string;
    twitter: string;
    mangaUpdates: string | null;
    focusedLanguages: string[];
    official: boolean;
    verified: boolean;
    inactive: boolean;
    publishDelay: string | null;
    exLicensed: boolean;
    createdAt: string;
    updatedAt: string;
    version: number;
  };
  relationships: Relationship;
}

export interface Relationship {
  [x: string]: { id: string; type: "leader" | "member" };
}
