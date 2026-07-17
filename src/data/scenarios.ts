import type { Scenario } from "../types/scenario";

export const scenarios: Scenario[] = [
  {
    id: "pickup-001",

    title: "お母さんが むかえにきた",

    description: "ほうかごデイが おわり、お母さんの かおが みえたとき",

    icon: "🚗",

    partnerName: "お母さん",

    situation: {
      stepLabel: "ばめん 1",
      heading: "お母さんが むかえに きました",
      line1: "ほうかごデイの じゅぎょうが おわりました。",
      line2: "お母さんの かおが みえました。",
      childCaption: "じゅぎょうが おわった",
      partnerCaption: "むかえに きた",
    },

    feelingIds: ["lonely", "relieved", "tired", "anxious", "happy", "unknown"],

    needIds: [
      "listen",
      "praise",
      "connect",
      "hug",
      "home",
      "quiet",
      "rest",
      "unknown",
    ],

    expressions: [
      {
        id: "pickup-hurtful",
        text: "おそいんだよ！ バカ！",
        evaluation: "hurtful",

        partnerEmotion: "sad",
        partnerEmotionLabel: "かなしい",
        partnerSymbol: "😢",
        partnerMessage:
          "つよい ことばを いわれて、かなしい きもちに なったよ。",

        guidance: "ほんとうの きもちが、つよい ことばに かくれてしまったね。",
      },
      {
        id: "pickup-almost",
        text: "なんで おそかったの？",
        evaluation: "almost",

        partnerEmotion: "worried",
        partnerEmotionLabel: "こまっている",
        partnerSymbol: "😟",
        partnerMessage:
          "どうしたのかな。おこっているように きこえて、こまったよ。",

        guidance:
          "ききたいことは つたわったよ。もうすこし きもちも いってみよう。",
      },
      {
        id: "pickup-helpful-lonely",
        text: "まっていて、さびしかった。",
        evaluation: "helpful",

        partnerEmotion: "happy",
        partnerEmotionLabel: "うれしい",
        partnerSymbol: "😊",
        partnerMessage: "さびしかったんだね。むかえに きたよ。",

        guidance: "ほんとうの きもちが、お母さんに つたわったね。",
      },
      {
        id: "pickup-helpful-tired",
        text: "きょうは つかれたから、しずかに かえりたい。",
        evaluation: "helpful",

        partnerEmotion: "happy",
        partnerEmotionLabel: "うれしい",
        partnerSymbol: "😊",
        partnerMessage: "わかったよ。きょうは しずかに かえろうね。",

        guidance: "どうしてほしいかを、ことばで つたえられたね。",
      },
    ],
  },

  {
    id: "phone-001",

    title: "お母さんが でんわをしている",

    description: "お母さんに はなしたいことが あるけれど、でんわ中だったとき",

    icon: "📱",

    partnerName: "お母さん",

    situation: {
      stepLabel: "ばめん 2",
      heading: "お母さんが でんわを しています",
      line1: "お母さんに はなしたいことが あります。",
      line2: "でも、お母さんは でんわで はなしています。",
      childCaption: "はなしを きいてほしい",
      partnerCaption: "でんわを している",
    },

    feelingIds: [
      "lonely",
      "impatient",
      "excited",
      "worried",
      "bored",
      "unknown",
    ],

    needIds: [
      "listen",
      "look",
      "finish",
      "waiting-time",
      "remember",
      "unknown",
    ],

    expressions: [
      {
        id: "phone-hurtful",
        text: "でんわ やめろ！ ぼくの はなしを きけ！",
        evaluation: "hurtful",

        partnerEmotion: "sad",
        partnerEmotionLabel: "かなしい",
        partnerSymbol: "😢",
        partnerMessage:
          "つよい ことばで いわれて、かなしい きもちに なったよ。",

        guidance: "はなしを きいてほしい きもちが、つよい ことばに なったね。",
      },
      {
        id: "phone-almost",
        text: "いつまで でんわしてるの？",
        evaluation: "almost",

        partnerEmotion: "worried",
        partnerEmotionLabel: "こまっている",
        partnerSymbol: "😟",
        partnerMessage:
          "いま でんわをしているから、どうしたらよいか こまったよ。",

        guidance:
          "まっている きもちを いっしょに つたえると、もっと わかりやすいよ。",
      },
      {
        id: "phone-helpful-listen",
        text: "でんわが おわったら、はなしを きいてください。",
        evaluation: "helpful",

        partnerEmotion: "happy",
        partnerEmotionLabel: "うれしい",
        partnerSymbol: "😊",
        partnerMessage: "わかったよ。でんわが おわったら、はなしを きくね。",

        guidance: "いつ はなしたいかを、わかりやすく つたえられたね。",
      },
      {
        id: "phone-helpful-wait",
        text: "あと なんぷん まてば いいですか？",
        evaluation: "helpful",

        partnerEmotion: "happy",
        partnerEmotionLabel: "うれしい",
        partnerSymbol: "😊",
        partnerMessage: "あと 5ふんくらいだよ。おわったら よぶね。",

        guidance: "まつ じかんを、ことばで きくことが できたね。",
      },
    ],
  },
];
