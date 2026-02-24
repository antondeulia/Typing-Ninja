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
    focus: "Home row: index fingers",
    symbols: "f j",
    drills: "f j fj jf ff jj",
    lessonText:
      "f j fj jf ff jj f j fj jf ff jj f j fj jf ff jj f j fj jf ff jj f j fj jf ff jj",
  },
  {
    id: 2,
    title: "Unit 2",
    focus: "Home row: middle fingers",
    symbols: "d k",
    drills: "d k dk kd dd kk",
    lessonText:
      "d k dk kd dd kk d k dk kd dd kk d k dk kd dd kk d k dk kd dd kk d k dk kd dd kk",
  },
  {
    id: 3,
    title: "Unit 3",
    focus: "Home row: ring fingers",
    symbols: "s l",
    drills: "s l sl ls ss ll",
    lessonText:
      "s l sl ls ss ll s l sl ls ss ll s l sl ls ss ll s l sl ls ss ll s l sl ls ss ll",
  },
  {
    id: 4,
    title: "Unit 4",
    focus: "Home row: pinkies",
    symbols: "a ;",
    drills: "a ; a; ;a aa ;;",
    lessonText:
      "a ; a; ;a aa ;; a ; a; ;a aa ;; a ; a; ;a aa ;; a ; a; ;a aa ;; a ; a; ;a aa ;;",
  },
  {
    id: 5,
    title: "Unit 5",
    focus: "Home row: center stretch",
    symbols: "g h",
    drills: "g h gh hg gg hh",
    lessonText:
      "g h gh hg gg hh g h gh hg gg hh g h gh hg gg hh g h gh hg gg hh g h gh hg gg hh",
  },
  {
    id: 6,
    title: "Unit 6",
    focus: "Home row practice A",
    symbols: "a s d f g h j k l ;",
    drills: "asdf ghjk l; ;lkj hgfd",
    lessonText:
      "asdf ghjk l; ;lkj hgfd asdf ghjk l; ;lkj hgfd asdf ghjk l; ;lkj hgfd asdf ghjk l;",
  },
  {
    id: 7,
    title: "Unit 7",
    focus: "Home row practice B",
    symbols: "all home row letters",
    drills: "sadf jkl; ghad f;lk",
    lessonText:
      "sadf jkl; ghad f;lk asdf ;lkj ghfd sall dakf j;la hgfd asdf ;lkj ghad f;lk sadf jkl;",
  },
  {
    id: 8,
    title: "Unit 8",
    focus: "Top row: index reach",
    symbols: "r u",
    drills: "r u ru ur rr uu",
    lessonText:
      "r u ru ur rr uu r u ru ur rr uu r u ru ur rr uu r u ru ur rr uu r u ru ur rr uu",
  },
  {
    id: 9,
    title: "Unit 9",
    focus: "Top row: middle reach",
    symbols: "e i",
    drills: "e i ei ie ee ii",
    lessonText:
      "e i ei ie ee ii e i ei ie ee ii e i ei ie ee ii e i ei ie ee ii e i ei ie ee ii",
  },
  {
    id: 10,
    title: "Unit 10",
    focus: "Top row: ring reach",
    symbols: "w o",
    drills: "w o wo ow ww oo",
    lessonText:
      "w o wo ow ww oo w o wo ow ww oo w o wo ow ww oo w o wo ow ww oo w o wo ow ww oo",
  },
  {
    id: 11,
    title: "Unit 11",
    focus: "Top row: pinky reach",
    symbols: "q p",
    drills: "q p qp pq qq pp",
    lessonText:
      "q p qp pq qq pp q p qp pq qq pp q p qp pq qq pp q p qp pq qq pp q p qp pq qq pp",
  },
  {
    id: 12,
    title: "Unit 12",
    focus: "Top row: side stretch",
    symbols: "t y",
    drills: "t y ty yt tt yy",
    lessonText:
      "t y ty yt tt yy t y ty yt tt yy t y ty yt tt yy t y ty yt tt yy t y ty yt tt yy",
  },
  {
    id: 13,
    title: "Unit 13",
    focus: "Top row practice",
    symbols: "q w e r t y u i o p",
    drills: "qwer tyui opoi uyt",
    lessonText:
      "qwer tyui opoi uyt qwer tyui opoi uyt qwer tyui opoi uyt qwer tyui opoi uyt qwer tyui",
  },
  {
    id: 14,
    title: "Unit 14",
    focus: "Home + top integration",
    symbols: "home row + top row",
    drills: "safe true role play",
    lessonText:
      "safe true role play your quiet power with steady pace and clear flow keep your hands calm and your strokes even",
  },
  {
    id: 15,
    title: "Unit 15",
    focus: "Bottom row: index reach",
    symbols: "v m",
    drills: "v m vm mv vv mm",
    lessonText:
      "v m vm mv vv mm v m vm mv vv mm v m vm mv vv mm v m vm mv vv mm v m vm mv vv mm",
  },
  {
    id: 16,
    title: "Unit 16",
    focus: "Bottom row: middle reach",
    symbols: "c ,",
    drills: "c , c, ,c cc ,,",
    lessonText:
      "c , c, ,c cc ,, c , c, ,c cc ,, c , c, ,c cc ,, c , c, ,c cc ,, c , c, ,c cc ,,",
  },
  {
    id: 17,
    title: "Unit 17",
    focus: "Bottom row: ring reach",
    symbols: "x .",
    drills: "x . x. .x xx ..",
    lessonText:
      "x . x. .x xx .. x . x. .x xx .. x . x. .x xx .. x . x. .x xx .. x . x. .x xx ..",
  },
  {
    id: 18,
    title: "Unit 18",
    focus: "Bottom row: pinky reach",
    symbols: "z /",
    drills: "z / z/ /z zz //",
    lessonText:
      "z / z/ /z zz // z / z/ /z zz // z / z/ /z zz // z / z/ /z zz // z / z/ /z zz //",
  },
  {
    id: 19,
    title: "Unit 19",
    focus: "Bottom row: center stretch",
    symbols: "b n",
    drills: "b n bn nb bb nn",
    lessonText:
      "b n bn nb bb nn b n bn nb bb nn b n bn nb bb nn b n bn nb bb nn b n bn nb bb nn",
  },
  {
    id: 20,
    title: "Unit 20",
    focus: "Bottom row practice",
    symbols: "z x c v b n m , . /",
    drills: "zxcv bnm, .,/ mnbv",
    lessonText:
      "zxcv bnm, .,/ mnbv zxcv bnm, .,/ mnbv zxcv bnm, .,/ mnbv zxcv bnm, .,/ mnbv zxcv bnm,",
  },
  {
    id: 21,
    title: "Unit 21",
    focus: "All letters practice A",
    symbols: "all lowercase letters",
    drills: "rows and reaches together",
    lessonText:
      "we type with calm rhythm and keep our hands relaxed while every finger returns to home row after each press",
  },
  {
    id: 22,
    title: "Unit 22",
    focus: "All letters practice B",
    symbols: "all lowercase letters",
    drills: "short words and spacing",
    lessonText:
      "quick brown waves move over tiny dunes while sharp minds build smooth habits and steady timing for clean typing",
  },
  {
    id: 23,
    title: "Unit 23",
    focus: "Lowercase words practice C",
    symbols: "all lowercase letters",
    drills: "longer phrases",
    lessonText:
      "focus on each next letter and do not rush because stable motion makes fewer errors and stronger speed over time",
  },
  {
    id: 24,
    title: "Unit 24",
    focus: "Lowercase endurance practice",
    symbols: "all lowercase letters",
    drills: "continuous text",
    lessonText:
      "daily practice with patient breathing keeps shoulders loose wrists light and attention sharp so progress stays reliable",
  },
  {
    id: 25,
    title: "Unit 25",
    focus: "Uppercase intro: left hand letters",
    symbols: "A S D F G",
    drills: "Aa Ss Dd Ff Gg",
    lessonText:
      "A S D F G AS DF AG SA DF GF A S D F G AS DF AG SA DF GF A S D F G AS DF AG SA DF GF",
  },
  {
    id: 26,
    title: "Unit 26",
    focus: "Uppercase intro: right hand letters",
    symbols: "H J K L",
    drills: "Hh Jj Kk Ll",
    lessonText:
      "H J K L HJ KL HL JK H J K L HJ KL HL JK H J K L HJ KL HL JK H J K L HJ KL HL JK",
  },
  {
    id: 27,
    title: "Unit 27",
    focus: "Uppercase words",
    symbols: "A-Z uppercase and lowercase letters",
    drills: "Shift timing in words",
    lessonText:
      "Keep Focus And Stay Relaxed while You Type Every Line with Clear Rhythm and Strong Accuracy across long practice",
  },
  {
    id: 28,
    title: "Unit 28",
    focus: "Uppercase sentence practice",
    symbols: "letters + period",
    drills: "Sentence starts",
    lessonText:
      "Start each sentence with control. Keep your wrists soft. Hold Shift briefly and return to smooth lowercase flow.",
  },
  {
    id: 29,
    title: "Unit 29",
    focus: "Numbers intro A",
    symbols: "1 2 3 4 5",
    drills: "12 23 34 45 54",
    lessonText:
      "1 2 3 4 5 12 23 34 45 54 123 234 345 454 543 1 2 3 4 5 12 23 34 45 54 123 234 345 454 543",
  },
  {
    id: 30,
    title: "Unit 30",
    focus: "Numbers intro B",
    symbols: "6 7 8 9 0",
    drills: "67 78 89 90 09",
    lessonText:
      "6 7 8 9 0 67 78 89 90 09 678 789 890 909 098 6 7 8 9 0 67 78 89 90 09 678 789 890 909 098",
  },
  {
    id: 31,
    title: "Unit 31",
    focus: "Numbers full row practice",
    symbols: "0-9",
    drills: "10 21 32 43 54 65 76 87 98",
    lessonText:
      "10 21 32 43 54 65 76 87 98 09 12345 67890 11223 44556 77889 90012 34567 89012 34567 890",
  },
  {
    id: 32,
    title: "Unit 32",
    focus: "Numbers in context",
    symbols: "letters + numbers",
    drills: "time and score phrases",
    lessonText:
      "day 1 we typed 15 minutes day 2 we typed 20 minutes day 3 we hit 78 wpm with 96 accuracy and 0 rush",
  },
  {
    id: 33,
    title: "Unit 33",
    focus: "Punctuation practice A",
    symbols: ", .",
    drills: "pauses and endings",
    lessonText:
      "type, pause, type, pause, keep rhythm, keep flow. finish each line, reset your hands, and begin again.",
  },
  {
    id: 34,
    title: "Unit 34",
    focus: "Punctuation practice B",
    symbols: "? !",
    drills: "question and emphasis",
    lessonText:
      "are you ready? keep going! can you stay calm? yes you can! do you watch the next key? keep that habit!",
  },
  {
    id: 35,
    title: "Unit 35",
    focus: "Punctuation practice C",
    symbols: "; :",
    drills: "clauses and labels",
    lessonText:
      "speed matters; accuracy matters more; timing stays steady. session one: warm up. session two: long lines.",
  },
  {
    id: 36,
    title: "Unit 36",
    focus: "Punctuation practice D",
    symbols: "' \"",
    drills: "quotes and apostrophes",
    lessonText:
      "coach said \"stay smooth\" and we agreed. it is easy to rush, but it is better to type with control and trust.",
  },
  {
    id: 37,
    title: "Unit 37",
    focus: "Symbols practice E",
    symbols: "- _",
    drills: "dash and underscore",
    lessonText:
      "high-speed typing needs slow starts - then stable rhythm. use snake_case names and keep_line_length under control.",
  },
  {
    id: 38,
    title: "Unit 38",
    focus: "Symbols practice F",
    symbols: "( ) [ ] { }",
    drills: "bracket families",
    lessonText:
      "(alpha) [beta] {gamma} (delta) [epsilon] {zeta} keep pairs matched and balanced across every training line",
  },
  {
    id: 39,
    title: "Unit 39",
    focus: "Symbols practice G",
    symbols: "/ \\",
    drills: "slash and backslash",
    lessonText:
      "path/to/file and C:\\tools\\bin are common forms. keep / and \\ precise while your fingers return home quickly.",
  },
  {
    id: 40,
    title: "Unit 40",
    focus: "Symbols consolidation",
    symbols: "all learned symbols",
    drills: "mixed punctuation blocks",
    lessonText:
      "test (now), review [again], and confirm {ready}; ask \"ok?\" then reply \"yes!\" keep pace - never panic.",
  },
  {
    id: 41,
    title: "Unit 41",
    focus: "Practice block 1",
    symbols: "letters only",
    drills: "long lowercase text",
    lessonText:
      "steady typing builds strong memory because each correct repeat teaches your fingers where to move without extra tension",
  },
  {
    id: 42,
    title: "Unit 42",
    focus: "Practice block 2",
    symbols: "letters + uppercase",
    drills: "case switching in long lines",
    lessonText:
      "Build Control First then Add Speed while Keeping Every Finger Active and Returning Home after each exact press.",
  },
  {
    id: 43,
    title: "Unit 43",
    focus: "Practice block 3",
    symbols: "letters + numbers",
    drills: "mixed alpha numeric",
    lessonText:
      "in week 4 we trained 30 minutes for 5 days and moved from 62 wpm to 81 wpm with accuracy near 97 percent",
  },
  {
    id: 44,
    title: "Unit 44",
    focus: "Practice block 4",
    symbols: "letters + numbers + punctuation",
    drills: "full mixed lines",
    lessonText:
      "session 1: warm up for 10 minutes; session 2: type 3 long texts. goal: 85 wpm, 97% accuracy, calm breathing.",
  },
  {
    id: 45,
    title: "Unit 45",
    focus: "Practice block 5",
    symbols: "all learned groups",
    drills: "paragraph rhythm",
    lessonText:
      "Practice with intent, not haste. Keep shoulders low, check spacing, and recover quickly after errors to protect flow.",
  },
  {
    id: 46,
    title: "Unit 46",
    focus: "Practice block 6",
    symbols: "all learned groups",
    drills: "consistency under length",
    lessonText:
      "Long sessions reveal habits: if your wrists get tense, pause, reset posture, and continue with lighter keystrokes.",
  },
  {
    id: 47,
    title: "Unit 47",
    focus: "Practice block 7",
    symbols: "all learned groups",
    drills: "accuracy first routine",
    lessonText:
      "Type this line with patience, then repeat it with the same control; speed grows naturally when errors stay low.",
  },
  {
    id: 48,
    title: "Unit 48",
    focus: "Final exam",
    symbols: "full keyboard course review",
    drills: "final mixed test",
    lessonText:
      "Final test: maintain rhythm, hold accuracy above 95%, use Shift and symbols cleanly, and finish every row in control.",
  },
];
