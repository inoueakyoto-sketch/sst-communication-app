import { useState } from "react";
import { feelingMaster, needMaster } from "../data/masters";
import type {
  Evaluation,
  ExpressionOption,
  PartnerEmotion,
  Scenario,
} from "../types/scenario";

type AdminScenarioManagerProps = {
  scenarios: Scenario[];
  onScenariosChange: (scenarios: Scenario[]) => void;
  onClose: () => void;
  onResetToDefaults: () => void;
};

const emotionMeta: Record<
  PartnerEmotion,
  {
    label: string;
    symbol: string;
  }
> = {
  happy: {
    label: "うれしい",
    symbol: "😊",
  },
  worried: {
    label: "こまっている",
    symbol: "😟",
  },
  sad: {
    label: "かなしい",
    symbol: "😢",
  },
};

function makeId(prefix: string): string {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function createExpression(evaluation: Evaluation): ExpressionOption {
  const emotion: PartnerEmotion =
    evaluation === "helpful"
      ? "happy"
      : evaluation === "almost"
      ? "worried"
      : "sad";

  return {
    id: makeId("expression"),
    text:
      evaluation === "helpful"
        ? "ここに、つたわりやすい ことばを かきます。"
        : evaluation === "almost"
        ? "ここに、もうすこし なおせる ことばを かきます。"
        : "ここに、つよい ことばを かきます。",
    evaluation,
    partnerEmotion: emotion,
    partnerEmotionLabel: emotionMeta[emotion].label,
    partnerSymbol: emotionMeta[emotion].symbol,
    partnerMessage:
      evaluation === "helpful"
        ? "きもちが よく わかったよ。"
        : evaluation === "almost"
        ? "どうしたらよいか、すこし こまったよ。"
        : "つよい ことばを いわれて、かなしいよ。",
    guidance:
      evaluation === "helpful"
        ? "ほんとうの きもちを ことばで つたえられたね。"
        : "ほんとうに つたえたかったことを、もういちど かんがえてみよう。",
  };
}

function createEmptyScenario(): Scenario {
  return {
    id: makeId("scenario"),
    title: "あたらしい ばめん",
    description: "この場面の説明を入力します。",
    icon: "💬",
    partnerName: "お母さん",

    situation: {
      stepLabel: "ばめん",
      heading: "ここに場面の見出しを入力します",
      line1: "最初の状況説明を入力します。",
      line2: "続きの状況説明を入力します。",
      childCaption: "ぼくの ようす",
      partnerCaption: "あいての ようす",
    },

    feelingIds: ["lonely", "tired", "happy", "unknown"],

    needIds: ["listen", "quiet", "rest", "unknown"],

    expressions: [
      createExpression("hurtful"),
      createExpression("almost"),
      createExpression("helpful"),
    ],
  };
}

export function AdminScenarioManager({
  scenarios,
  onScenariosChange,
  onClose,
  onResetToDefaults,
}: AdminScenarioManagerProps) {
  const [draft, setDraft] = useState<Scenario | null>(null);

  const [errorMessage, setErrorMessage] = useState<string>("");

  const startNewScenario = () => {
    setErrorMessage("");
    setDraft(createEmptyScenario());
  };

  const startEditing = (scenario: Scenario) => {
    setErrorMessage("");

    setDraft({
      ...scenario,
      situation: {
        ...scenario.situation,
      },
      feelingIds: [...scenario.feelingIds],
      needIds: [...scenario.needIds],
      expressions: scenario.expressions.map((expression) => ({
        ...expression,
      })),
    });
  };

  const duplicateScenario = (scenario: Scenario) => {
    const duplicatedScenario: Scenario = {
      ...scenario,
      id: makeId("scenario"),
      title: `${scenario.title}（コピー）`,
      situation: {
        ...scenario.situation,
      },
      feelingIds: [...scenario.feelingIds],
      needIds: [...scenario.needIds],
      expressions: scenario.expressions.map((expression) => ({
        ...expression,
        id: makeId("expression"),
      })),
    };

    onScenariosChange([...scenarios, duplicatedScenario]);
  };

  const deleteScenario = (scenario: Scenario) => {
    const shouldDelete = window.confirm(
      `「${scenario.title}」を削除しますか？`
    );

    if (!shouldDelete) {
      return;
    }

    onScenariosChange(scenarios.filter((item) => item.id !== scenario.id));
  };

  const updateDraftField = <Key extends keyof Scenario>(
    key: Key,
    value: Scenario[Key]
  ) => {
    setDraft((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        [key]: value,
      };
    });
  };

  const updateSituationField = (
    key: keyof Scenario["situation"],
    value: string
  ) => {
    setDraft((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        situation: {
          ...current.situation,
          [key]: value,
        },
      };
    });
  };

  const toggleMasterItem = (type: "feeling" | "need", id: string) => {
    setDraft((current) => {
      if (!current) {
        return current;
      }

      const key = type === "feeling" ? "feelingIds" : "needIds";

      const currentIds = current[key];

      const nextIds = currentIds.includes(id)
        ? currentIds.filter((currentId) => currentId !== id)
        : [...currentIds, id];

      return {
        ...current,
        [key]: nextIds,
      };
    });
  };

  const updateExpression = (
    index: number,
    changes: Partial<ExpressionOption>
  ) => {
    setDraft((current) => {
      if (!current) {
        return current;
      }

      const nextExpressions = current.expressions.map(
        (expression, expressionIndex) => {
          if (expressionIndex !== index) {
            return expression;
          }

          const nextExpression = {
            ...expression,
            ...changes,
          };

          if (changes.partnerEmotion) {
            const meta = emotionMeta[changes.partnerEmotion];

            nextExpression.partnerEmotionLabel = meta.label;

            nextExpression.partnerSymbol = meta.symbol;
          }

          return nextExpression;
        }
      );

      return {
        ...current,
        expressions: nextExpressions,
      };
    });
  };

  const addExpression = () => {
    setDraft((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        expressions: [...current.expressions, createExpression("helpful")],
      };
    });
  };

  const removeExpression = (index: number) => {
    setDraft((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        expressions: current.expressions.filter(
          (_, expressionIndex) => expressionIndex !== index
        ),
      };
    });
  };

  const saveDraft = () => {
    if (!draft) {
      return;
    }

    if (!draft.title.trim()) {
      setErrorMessage("場面の名前を入力してください。");
      return;
    }

    if (!draft.situation.heading.trim()) {
      setErrorMessage("場面の見出しを入力してください。");
      return;
    }

    if (draft.feelingIds.length === 0) {
      setErrorMessage("使用する気持ちを1つ以上選んでください。");
      return;
    }

    if (draft.needIds.length === 0) {
      setErrorMessage("使用するお願いを1つ以上選んでください。");
      return;
    }

    if (draft.expressions.length < 2) {
      setErrorMessage("伝え方を2つ以上設定してください。");
      return;
    }

    const hasHelpfulExpression = draft.expressions.some(
      (expression) => expression.evaluation === "helpful"
    );

    if (!hasHelpfulExpression) {
      setErrorMessage(
        "「つたわりやすい」に設定された伝え方を1つ以上作ってください。"
      );
      return;
    }

    const normalizedDraft: Scenario = {
      ...draft,
      title: draft.title.trim(),
      description: draft.description.trim(),
      partnerName: draft.partnerName.trim(),
      expressions: draft.expressions.map((expression) => {
        const meta = emotionMeta[expression.partnerEmotion];

        return {
          ...expression,
          text: expression.text.trim(),
          partnerEmotionLabel: meta.label,
          partnerSymbol: meta.symbol,
          partnerMessage: expression.partnerMessage.trim(),
          guidance: expression.guidance.trim(),
        };
      }),
    };

    const alreadyExists = scenarios.some(
      (scenario) => scenario.id === normalizedDraft.id
    );

    const nextScenarios = alreadyExists
      ? scenarios.map((scenario) =>
          scenario.id === normalizedDraft.id ? normalizedDraft : scenario
        )
      : [...scenarios, normalizedDraft];

    onScenariosChange(nextScenarios);
    setErrorMessage("");
    setDraft(null);
  };

  if (!draft) {
    return (
      <div className="screen admin-screen">
        <div className="admin-heading">
          <div>
            <p className="admin-label">おとな画面</p>

            <h2>ばめんの かんり</h2>

            <p>子どもが練習する場面を 追加・編集できます。</p>
          </div>

          <button
            className="secondary-button admin-close-button"
            type="button"
            onClick={onClose}
          >
            子ども画面へ
          </button>
        </div>

        <button
          className="primary-button admin-new-button"
          type="button"
          onClick={startNewScenario}
        >
          ＋ あたらしい ばめんを つくる
        </button>

        <div className="admin-scenario-list">
          {scenarios.map((scenario) => (
            <article className="admin-scenario-card" key={scenario.id}>
              <div className="admin-scenario-icon">{scenario.icon}</div>

              <div className="admin-scenario-information">
                <h3>{scenario.title}</h3>

                <p>{scenario.description}</p>

                <small>
                  気持ち：
                  {scenario.feelingIds.length}個　 お願い：
                  {scenario.needIds.length}個　 伝え方：
                  {scenario.expressions.length}個
                </small>
              </div>

              <div className="admin-scenario-actions">
                <button
                  type="button"
                  className="admin-action-button"
                  onClick={() => startEditing(scenario)}
                >
                  編集
                </button>

                <button
                  type="button"
                  className="admin-action-button"
                  onClick={() => duplicateScenario(scenario)}
                >
                  複製
                </button>

                <button
                  type="button"
                  className="admin-action-button admin-delete-button"
                  onClick={() => deleteScenario(scenario)}
                >
                  削除
                </button>
              </div>
            </article>
          ))}
        </div>

        <button
          className="admin-reset-button"
          type="button"
          onClick={() => {
            const shouldReset = window.confirm(
              "作成・編集した内容を削除し、最初の場面データへ戻しますか？"
            );

            if (shouldReset) {
              onResetToDefaults();
            }
          }}
        >
          最初のデータに戻す
        </button>
      </div>
    );
  }

  return (
    <div className="screen admin-screen">
      <div className="admin-editor-heading">
        <div>
          <p className="admin-label">おとな画面</p>

          <h2>ばめんを へんしゅう</h2>
        </div>

        <button
          className="secondary-button"
          type="button"
          onClick={() => {
            setErrorMessage("");
            setDraft(null);
          }}
        >
          一覧へ戻る
        </button>
      </div>

      {errorMessage && (
        <div className="admin-error-message" role="alert">
          {errorMessage}
        </div>
      )}

      <section className="admin-form-section">
        <h3>基本情報</h3>

        <label className="admin-field">
          <span>場面の名前</span>

          <input
            type="text"
            value={draft.title}
            onChange={(event) => updateDraftField("title", event.target.value)}
          />
        </label>

        <label className="admin-field">
          <span>一覧画面の説明</span>

          <textarea
            rows={3}
            value={draft.description}
            onChange={(event) =>
              updateDraftField("description", event.target.value)
            }
          />
        </label>

        <div className="admin-two-columns">
          <label className="admin-field">
            <span>アイコン</span>

            <input
              type="text"
              value={draft.icon}
              onChange={(event) => updateDraftField("icon", event.target.value)}
            />
          </label>

          <label className="admin-field">
            <span>相手の呼び方</span>

            <input
              type="text"
              value={draft.partnerName}
              onChange={(event) =>
                updateDraftField("partnerName", event.target.value)
              }
            />
          </label>
        </div>
      </section>

      <section className="admin-form-section">
        <h3>場面の文章</h3>

        <label className="admin-field">
          <span>見出し</span>

          <input
            type="text"
            value={draft.situation.heading}
            onChange={(event) =>
              updateSituationField("heading", event.target.value)
            }
          />
        </label>

        <label className="admin-field">
          <span>説明文1</span>

          <textarea
            rows={2}
            value={draft.situation.line1}
            onChange={(event) =>
              updateSituationField("line1", event.target.value)
            }
          />
        </label>

        <label className="admin-field">
          <span>説明文2</span>

          <textarea
            rows={2}
            value={draft.situation.line2}
            onChange={(event) =>
              updateSituationField("line2", event.target.value)
            }
          />
        </label>

        <div className="admin-two-columns">
          <label className="admin-field">
            <span>子どもの説明</span>

            <input
              type="text"
              value={draft.situation.childCaption}
              onChange={(event) =>
                updateSituationField("childCaption", event.target.value)
              }
            />
          </label>

          <label className="admin-field">
            <span>相手の説明</span>

            <input
              type="text"
              value={draft.situation.partnerCaption}
              onChange={(event) =>
                updateSituationField("partnerCaption", event.target.value)
              }
            />
          </label>
        </div>
      </section>

      <section className="admin-form-section">
        <h3>この場面で使う気持ち</h3>

        <div className="admin-option-grid">
          {feelingMaster.map((feeling) => {
            const isSelected = draft.feelingIds.includes(feeling.id);

            return (
              <label
                className={`admin-option-card ${
                  isSelected ? "admin-option-card-selected" : ""
                }`}
                key={feeling.id}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleMasterItem("feeling", feeling.id)}
                />

                <span className="admin-option-symbol">{feeling.symbol}</span>

                <span>{feeling.label.split("\n").join(" ")}</span>
              </label>
            );
          })}
        </div>
      </section>

      <section className="admin-form-section">
        <h3>この場面で使うお願い</h3>

        <div className="admin-option-grid">
          {needMaster.map((need) => {
            const isSelected = draft.needIds.includes(need.id);

            return (
              <label
                className={`admin-option-card ${
                  isSelected ? "admin-option-card-selected" : ""
                }`}
                key={need.id}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleMasterItem("need", need.id)}
                />

                <span className="admin-option-symbol">{need.symbol}</span>

                <span>{need.label.split("\n").join(" ")}</span>
              </label>
            );
          })}
        </div>
      </section>

      <section className="admin-form-section">
        <div className="admin-section-heading-row">
          <h3>伝え方と相手の反応</h3>

          <button
            className="admin-small-add-button"
            type="button"
            onClick={addExpression}
          >
            ＋ 伝え方を追加
          </button>
        </div>

        <div className="admin-expression-list">
          {draft.expressions.map((expression, index) => (
            <article className="admin-expression-card" key={expression.id}>
              <div className="admin-expression-heading">
                <strong>伝え方 {index + 1}</strong>

                {draft.expressions.length > 2 && (
                  <button
                    type="button"
                    className="admin-remove-expression"
                    onClick={() => removeExpression(index)}
                  >
                    この伝え方を削除
                  </button>
                )}
              </div>

              <label className="admin-field">
                <span>子どもの言葉</span>

                <textarea
                  rows={2}
                  value={expression.text}
                  onChange={(event) =>
                    updateExpression(index, {
                      text: event.target.value,
                    })
                  }
                />
              </label>

              <div className="admin-two-columns">
                <label className="admin-field">
                  <span>評価</span>

                  <select
                    value={expression.evaluation}
                    onChange={(event) =>
                      updateExpression(index, {
                        evaluation: event.target.value as Evaluation,
                      })
                    }
                  >
                    <option value="hurtful">相手を傷つける</option>

                    <option value="almost">少し言い直す</option>

                    <option value="helpful">伝わりやすい</option>
                  </select>
                </label>

                <label className="admin-field">
                  <span>相手の気持ち</span>

                  <select
                    value={expression.partnerEmotion}
                    onChange={(event) =>
                      updateExpression(index, {
                        partnerEmotion: event.target.value as PartnerEmotion,
                      })
                    }
                  >
                    <option value="happy">😊 うれしい</option>

                    <option value="worried">😟 困っている</option>

                    <option value="sad">😢 悲しい</option>
                  </select>
                </label>
              </div>

              <label className="admin-field">
                <span>相手の返事</span>

                <textarea
                  rows={2}
                  value={expression.partnerMessage}
                  onChange={(event) =>
                    updateExpression(index, {
                      partnerMessage: event.target.value,
                    })
                  }
                />
              </label>

              <label className="admin-field">
                <span>子どもへの説明</span>

                <textarea
                  rows={2}
                  value={expression.guidance}
                  onChange={(event) =>
                    updateExpression(index, {
                      guidance: event.target.value,
                    })
                  }
                />
              </label>
            </article>
          ))}
        </div>
      </section>

      <div className="admin-editor-actions">
        <button
          className="secondary-button"
          type="button"
          onClick={() => {
            setErrorMessage("");
            setDraft(null);
          }}
        >
          キャンセル
        </button>

        <button className="primary-button" type="button" onClick={saveDraft}>
          この場面を保存する
        </button>
      </div>
    </div>
  );
}
