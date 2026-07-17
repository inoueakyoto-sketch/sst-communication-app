export const sampleScenario = {
  id: "pickup-001",

  title: "お母さんが むかえにきた",

  situation: {
    stepLabel: "ばめん 1",
    heading: "お母さんが むかえに きました",
    line1: "ほうかごデイの じゅぎょうが おわりました。",
    line2: "お母さんの かおが みえました。",
    childCaption: "じゅぎょうが おわった",
    partnerCaption: "むかえに きた",
  },

  feelings: [
    {
      id: "lonely",
      label: "さびしかった",
      symbol: "😢",
    },
    {
      id: "relieved",
      label: "ほっとした",
      symbol: "😌",
    },
    {
      id: "tired",
      label: "つかれた",
      symbol: "😮‍💨",
    },
    {
      id: "anxious",
      label: "こなかったら\nどうしようと おもった",
      symbol: "😟",
    },
    {
      id: "happy",
      label: "あえて うれしかった",
      symbol: "😊",
    },
    {
      id: "unknown",
      label: "よく わからない",
      symbol: "❓",
    },
  ],

  needs: [
    {
      id: "listen",
      label: "きょうの はなしを\nきいてほしかった",
      symbol: "👂",
    },
    {
      id: "praise",
      label: "がんばったねと\nいってほしかった",
      symbol: "⭐",
    },
    {
      id: "connect",
      label: "あいたかった",
      symbol: "🤝",
    },
    {
      id: "hug",
      label: "だきしめて\nほしかった",
      symbol: "🫂",
    },
    {
      id: "home",
      label: "はやく いえに\nかえりたかった",
      symbol: "🏠",
    },
    {
      id: "quiet",
      label: "しずかに\nしてほしかった",
      symbol: "🤫",
    },
    {
      id: "rest",
      label: "すこし\nやすみたかった",
      symbol: "🪑",
    },
    {
      id: "unknown",
      label: "よく わからない",
      symbol: "❓",
    },
  ],

  expressions: [
    {
      id: "hurtful",
      text: "おそいんだよ！ バカ！",
      evaluation: "hurtful",
      motherEmotion: "sad",
      motherEmotionLabel: "かなしい",
      motherSymbol: "😢",
      motherMessage: "つよい ことばを いわれて、かなしい きもちに なったよ。",
      guidance: "ほんとうの きもちが、つよい ことばに かくれてしまったね。",
    },
    {
      id: "almost",
      text: "なんで おそかったの？",
      evaluation: "almost",
      motherEmotion: "worried",
      motherEmotionLabel: "こまっている",
      motherSymbol: "😟",
      motherMessage:
        "どうしたのかな。おこっているように きこえて、こまったよ。",
      guidance:
        "ききたいことは つたわったよ。もうすこし きもちも いってみよう。",
    },
    {
      id: "helpful-lonely",
      text: "まっていて、さびしかった。",
      evaluation: "helpful",
      motherEmotion: "happy",
      motherEmotionLabel: "うれしい",
      motherSymbol: "😊",
      motherMessage: "さびしかったんだね。むかえに きたよ。",
      guidance: "ほんとうの きもちが、お母さんに つたわったね。",
    },
    {
      id: "helpful-tired",
      text: "きょうは つかれたから、しずかに かえりたい。",
      evaluation: "helpful",
      motherEmotion: "happy",
      motherEmotionLabel: "うれしい",
      motherSymbol: "😊",
      motherMessage: "わかったよ。きょうは しずかに かえろうね。",
      guidance: "どうしてほしいかを、ことばで つたえられたね。",
    },
  ],
} as const;
