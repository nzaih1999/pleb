export interface Speaker {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  bio: string;
  tagLine: string;
  profilePicture: string;
  sessions: Session[];
  isTopSpeaker: boolean;
  links: any[];
  questionAnswers: any[];
  categories: any[];
}

interface Session {
  id: number;
  name: string;
}

export const getSpeakers = async (): Promise<Speaker[]> => {
  const response = await fetch(
    "https://sessionize.com/api/v2/d899srzm/view/Speakers"
  );
  const speakers = await response.json();
  return speakers;
};
