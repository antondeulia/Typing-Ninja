export type LessonUnit = {
  id: number;
  title: string;
  focus: string;
  symbols: string;
  drills: string;
  lessonText: string;
};

export const LESSON_UNITS: LessonUnit[] = [
  {
    id: 1,
    title: "Unit 1",
    focus: "Home row start",
    symbols: "ff jj",
    drills: "f j fj jf ff jj",
    lessonText: "f j fj jf ff jj f j fj jf ff jj f j fj jf ff jj",
  },
  {
    id: 2,
    title: "Unit 2",
    focus: "Home row pairs",
    symbols: "dd kk",
    drills: "d k dk kd dd kk",
    lessonText: "d k dk kd dd kk d k dk kd dd kk d k dk kd dd kk",
  },
  {
    id: 3,
    title: "Unit 3",
    focus: "Center control",
    symbols: "ss ll aa ;;",
    drills: "as sl al ;a ls sa",
    lessonText: "as sl al ;a ls sa as sl al ;a ls sa as sl al ;a ls sa",
  },
  {
    id: 4,
    title: "Unit 4",
    focus: "Top row intro",
    symbols: "rr uu ee ii",
    drills: "re ui er iu ru ie",
    lessonText: "re ui er iu ru ie re ui er iu ru ie re ui er iu ru ie",
  },
  {
    id: 5,
    title: "Unit 5",
    focus: "Bottom row intro",
    symbols: "vv mm cc ,,",
    drills: "cv vm cm ,m vc m,",
    lessonText: "cv vm cm ,m vc m, cv vm cm ,m vc m, cv vm cm ,m vc m,",
  },
  {
    id: 6,
    title: "Unit 6",
    focus: "Numbers",
    symbols: "11 00 22 99",
    drills: "10 01 12 21 90 09",
    lessonText: "10 01 12 21 90 09 10 01 12 21 90 09 10 01 12 21 90 09",
  },
  {
    id: 7,
    title: "Unit 7",
    focus: "Punctuation",
    symbols: ". , ? ! : ;",
    drills: "., !? ;: ,.",
    lessonText: "., !? ;: ,. ., !? ;: ,. ., !? ;: ,.",
  },
  {
    id: 8,
    title: "Unit 8",
    focus: "Mixed flow",
    symbols: "letters + numbers + signs",
    drills: "fj dk 10 ;. ru vm",
    lessonText: "fj dk 10 ;. ru vm fj dk 10 ;. ru vm fj dk 10 ;. ru vm",
  },
];
