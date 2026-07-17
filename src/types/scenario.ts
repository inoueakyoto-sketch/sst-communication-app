export type Evaluation = "hurtful" | "almost" | "helpful";

export type PartnerEmotion = "happy" | "worried" | "sad";

export type SelectOption = {
  id: string;
  label: string;
  symbol: string;
  exclusive?: boolean;
};

export type ExpressionOption = {
  id: string;
  text: string;
  evaluation: Evaluation;

  partnerEmotion: PartnerEmotion;
  partnerEmotionLabel: string;
  partnerSymbol: string;
  partnerMessage: string;

  guidance: string;
};

export type Scenario = {
  id: string;
  title: string;
  description: string;
  icon: string;

  partnerName: string;

  situation: {
    stepLabel: string;
    heading: string;
    line1: string;
    line2: string;
    childCaption: string;
    partnerCaption: string;
  };

  /*
   * 共通マスタに登録された項目のIDだけを保存します。
   */
  feelingIds: string[];
  needIds: string[];

  expressions: ExpressionOption[];
};
