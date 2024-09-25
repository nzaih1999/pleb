import { SocialCard, User } from "@prisma/client";

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

export const getSpeaker = async (id: string): Promise<Speaker> => {
  const response = await fetch(
    `https://sessionize.com/api/v2/d899srzm/view/Speakers/${id}`
  );
  const speaker = await response.json();
  return speaker;
};

type UserWithSocialCard = {
  user: User & {
    socialCard: SocialCard;
  };
};

interface Directions {
  step: string;
  duration: string;
  distance: string;
}

export const directions: Directions[] = [
  {
    step: "Follow Haile Selassie Ave to Uhuru Hwy/A104",
    duration: "4 min",
    distance: "1.7 km",
  },
  {
    step: "Take Langata Rd to Magadi Rd/C58",
    duration: "14 min",
    distance: "9.7 km",
  },
  {
    step: "Continue on Magadi Rd/C58. Drive to Bogani E Rd",
    duration: "3 min",
    distance: "1.8 km",
  },
  {
    step: "Catholic University of Eastern Africa",
    duration: "",
    distance: "Bogani E Rd, Nairobi",
  },
];

export default directions;
