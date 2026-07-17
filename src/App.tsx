import { useEffect, useState } from "react";
import { scenarios as defaultScenarios } from "./data/scenarios";
import { feelingMaster, needMaster } from "./data/masters";
import {
  clearStoredScenarios,
  loadStoredScenarios,
  saveStoredScenarios,
} from "./data/storage";
import {
  loadScenariosFromFirestore,
  saveScenariosToFirestore,
} from "./data/firestoreScenarios";
import { AdminArea } from "./components/AdminArea";
import type { Scenario, SelectOption } from "./types/scenario";
import "./App.css";

type Screen =
  | "start"
  | "scenarioSelect"
  | "situation"
  | "feelings"
  | "needs"
  | "expressions"
  | "reaction"
  | "success"
  | "admin";

function App() {
  const [scenarioList, setScenarioList] = useState<Scenario[]>(() =>
    loadStoredScenarios(defaultScenarios)
  );

  const [screen, setScreen] = useState<Screen>("start");

  const [activeScenarioId, setActiveScenarioId] = useState<string | null>(null);

  const [selectedFeelings, setSelectedFeelings] = useState<string[]>([]);

  const [selectedNeeds, setSelectedNeeds] = useState<string[]>([]);

  const [selectedExpressionId, setSelectedExpressionId] = useState<
    string | null
  >(null);

  const [recoveryExpressionId, setRecoveryExpressionId] = useState<
    string | null
  >(null);

  const [syncMessage, setSyncMessage] = useState("");

  useEffect(() => {
    let isActive = true;

    const loadCloudScenarios = async () => {
      try {
        const cloudScenarios = await loadScenariosFromFirestore();

        if (!isActive || !cloudScenarios || cloudScenarios.length === 0) {
          return;
        }

        setScenarioList(cloudScenarios);
        saveStoredScenarios(cloudScenarios);
      } catch (error) {
        console.error("Firestoreから教材を読み込めませんでした。", error);

        if (isActive) {
          setSyncMessage(
            "クラウドから読み込めなかったため、この端末の教材を表示しています。"
          );
        }
      }
    };

    void loadCloudScenarios();

    return () => {
      isActive = false;
    };
  }, []);

  const activeScenario =
    scenarioList.find((scenario) => scenario.id === activeScenarioId) ?? null;

  const activeFeelings: SelectOption[] = activeScenario
    ? activeScenario.feelingIds
        .map((id) => feelingMaster.find((item) => item.id === id))
        .filter((item): item is SelectOption => item !== undefined)
    : [];

  const activeNeeds: SelectOption[] = activeScenario
    ? activeScenario.needIds
        .map((id) => needMaster.find((item) => item.id === id))
        .filter((item): item is SelectOption => item !== undefined)
    : [];

  const selectedExpression =
    activeScenario?.expressions.find(
      (expression) => expression.id === selectedExpressionId
    ) ?? null;

  const recoveryExpression =
    activeScenario?.expressions.find(
      (expression) => expression.id === recoveryExpressionId
    ) ?? null;

  const toggleOption = (
    currentIds: string[],
    optionId: string,
    options: SelectOption[]
  ): string[] => {
    const selectedOption = options.find((option) => option.id === optionId);

    if (!selectedOption) {
      return currentIds;
    }

    if (selectedOption.exclusive) {
      return currentIds.includes(optionId) ? [] : [optionId];
    }

    const exclusiveIds = options
      .filter((option) => option.exclusive)
      .map((option) => option.id);

    const withoutExclusive = currentIds.filter(
      (currentId) => !exclusiveIds.includes(currentId)
    );

    if (withoutExclusive.includes(optionId)) {
      return withoutExclusive.filter((currentId) => currentId !== optionId);
    }

    return [...withoutExclusive, optionId];
  };

  const clearAnswers = () => {
    setSelectedFeelings([]);
    setSelectedNeeds([]);
    setSelectedExpressionId(null);
    setRecoveryExpressionId(null);
  };

  const beginScenario = (scenarioId: string) => {
    clearAnswers();
    setActiveScenarioId(scenarioId);
    setScreen("situation");
  };

  const openScenarioSelect = () => {
    clearAnswers();
    setActiveScenarioId(null);
    setScreen("scenarioSelect");
  };

  const resetApplication = () => {
    clearAnswers();
    setActiveScenarioId(null);
    setScreen("start");
  };

  const retryExpression = () => {
    if (selectedExpression && selectedExpression.evaluation !== "helpful") {
      setRecoveryExpressionId(selectedExpression.id);
    }

    setSelectedExpressionId(null);
    setScreen("expressions");
  };

  const saveScenarioListToCloud = (nextScenarios: Scenario[]) => {
    setSyncMessage("クラウドに保存しています…");

    void saveScenariosToFirestore(nextScenarios)
      .then(() => {
        setSyncMessage("クラウドに保存しました。");
      })
      .catch((error) => {
        console.error("Firestoreへ教材を保存できませんでした。", error);
        setSyncMessage(
          "クラウド保存に失敗しました。この端末内には保存されています。"
        );
      });
  };

  const updateScenarioList = (nextScenarios: Scenario[]) => {
    setScenarioList(nextScenarios);
    saveStoredScenarios(nextScenarios);
    saveScenarioListToCloud(nextScenarios);
  };

  const resetScenarioList = () => {
    clearStoredScenarios();

    const restoredScenarios: Scenario[] = defaultScenarios.map((scenario) => ({
      ...scenario,
      situation: {
        ...scenario.situation,
      },
      feelingIds: [...scenario.feelingIds],
      needIds: [...scenario.needIds],
      expressions: scenario.expressions.map((expression) => ({
        ...expression,
      })),
    }));

    setScenarioList(restoredScenarios);
    saveStoredScenarios(restoredScenarios);
    saveScenarioListToCloud(restoredScenarios);
  };

  return (
    <main className="app">
      <section className="app-card" aria-live="polite">
        <header className="app-header">
          <p className="app-category">きもちと ことばの れんしゅう</p>

          <h1>どうやって つたえる？</h1>
        </header>

        {screen === "admin" && (
          <>
            {syncMessage && (
              <div className="admin-sync-message" role="status">
                {syncMessage}
              </div>
            )}

            <AdminArea
              scenarios={scenarioList}
              onScenariosChange={updateScenarioList}
              onClose={resetApplication}
              onResetToDefaults={resetScenarioList}
            />
          </>
        )}

        {screen === "start" && (
          <div className="screen">
            <div className="illustration-area">
              <div className="person-card child-card">
                <div className="face-placeholder">ぼく</div>
              </div>

              <div className="connection-line" aria-hidden="true">
                …
              </div>

              <div className="person-card mother-card">
                <div className="face-placeholder">お母さん</div>
              </div>
            </div>

            <p className="main-message">
              じぶんの きもちを、
              <br />
              あいてに つたえる れんしゅうを します。
            </p>

            <div className="start-button-area">
              <button
                className="primary-button"
                type="button"
                onClick={() => setScreen("scenarioSelect")}
              >
                はじめる
              </button>

              <button
                className="adult-mode-button"
                type="button"
                onClick={() => setScreen("admin")}
              >
                ⚙ おとな画面
              </button>
            </div>
          </div>
        )}

        {screen === "scenarioSelect" && (
          <div className="screen">
            <div className="step-label">ばめんを えらぶ</div>

            <div className="scenario-intro">
              <h2>どの ばめんを れんしゅうする？</h2>

              <p>
                れんしゅうしたい ばめんを
                <br />
                ひとつ えらんでね。
              </p>
            </div>

            <div className="scenario-list">
              {scenarioList.map((scenario) => (
                <button
                  className="scenario-card"
                  type="button"
                  key={scenario.id}
                  onClick={() => beginScenario(scenario.id)}
                >
                  <span className="scenario-icon" aria-hidden="true">
                    {scenario.icon}
                  </span>

                  <span className="scenario-card-content">
                    <strong>{scenario.title}</strong>
                    <span>{scenario.description}</span>
                  </span>

                  <span className="scenario-arrow" aria-hidden="true">
                    →
                  </span>
                </button>
              ))}
            </div>

            <button
              className="secondary-button"
              type="button"
              onClick={resetApplication}
            >
              さいしょに もどる
            </button>
          </div>
        )}

        {screen === "situation" && activeScenario && (
          <div className="screen">
            <div className="step-label">
              {activeScenario.situation.stepLabel}
            </div>

            <div className="scene-box">
              <div className="scene-characters">
                <div className="scene-person">
                  <div className="small-face child-face">ぼく</div>

                  <span>{activeScenario.situation.childCaption}</span>
                </div>

                <div className="arrival-arrow" aria-hidden="true">
                  ←
                </div>

                <div className="scene-person">
                  <div className="small-face mother-face">
                    {activeScenario.partnerName}
                  </div>

                  <span>{activeScenario.situation.partnerCaption}</span>
                </div>
              </div>
            </div>

            <h2>{activeScenario.situation.heading}</h2>

            <p className="situation-text">
              {activeScenario.situation.line1}

              <br />

              {activeScenario.situation.line2}
            </p>

            <div className="button-row">
              <button
                className="secondary-button"
                type="button"
                onClick={openScenarioSelect}
              >
                もどる
              </button>

              <button
                className="primary-button"
                type="button"
                onClick={() => setScreen("feelings")}
              >
                つぎへ
              </button>
            </div>
          </div>
        )}

        {screen === "feelings" && activeScenario && (
          <div className="screen">
            <div className="step-label">じぶんの きもち</div>

            <div className="question-box">
              <div className="question-child" aria-hidden="true">
                ぼく
              </div>

              <div>
                <h2>どんな きもちだった？</h2>

                <p>
                  {activeScenario.partnerName}
                  の かおを みたときの
                  <br />
                  きもちを えらんでね。
                </p>
              </div>
            </div>

            <p className="multiple-choice-note">
              いくつ えらんでも だいじょうぶ
            </p>

            <div className="feeling-grid">
              {activeFeelings.map((feeling) => {
                const isSelected = selectedFeelings.includes(feeling.id);

                const labelLines = feeling.label.split("\n");

                return (
                  <button
                    key={feeling.id}
                    type="button"
                    className={`feeling-card ${
                      isSelected ? "feeling-card-selected" : ""
                    }`}
                    aria-pressed={isSelected}
                    onClick={() =>
                      setSelectedFeelings((current) =>
                        toggleOption(current, feeling.id, activeFeelings)
                      )
                    }
                  >
                    <span className="feeling-symbol" aria-hidden="true">
                      {feeling.symbol}
                    </span>

                    <span className="feeling-label">
                      {labelLines.map((line, index) => (
                        <span key={`${feeling.id}-${index}`}>
                          {line}

                          {index < labelLines.length - 1 && <br />}
                        </span>
                      ))}
                    </span>

                    <span
                      className={`selection-mark ${
                        isSelected ? "selection-mark-visible" : ""
                      }`}
                      aria-hidden="true"
                    >
                      ✓
                    </span>
                  </button>
                );
              })}
            </div>

            {selectedFeelings.length > 0 && (
              <div className="selection-summary">
                <p>えらんだ きもち</p>

                <div className="selected-tags">
                  {selectedFeelings.map((selectedId) => {
                    const feeling = activeFeelings.find(
                      (item) => item.id === selectedId
                    );

                    if (!feeling) {
                      return null;
                    }

                    return (
                      <span className="selected-tag" key={selectedId}>
                        {feeling.symbol} {feeling.label.split("\n").join(" ")}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="button-row">
              <button
                className="secondary-button"
                type="button"
                onClick={() => setScreen("situation")}
              >
                もどる
              </button>

              <button
                className="primary-button"
                type="button"
                disabled={selectedFeelings.length === 0}
                onClick={() => setScreen("needs")}
              >
                これで つぎへ
              </button>
            </div>
          </div>
        )}

        {screen === "needs" && activeScenario && (
          <div className="screen">
            <div className="step-label">ほんとうの おねがい</div>

            <div className="previous-answer-box">
              <p className="previous-answer-title">さっき えらんだ きもち</p>

              <div className="selected-tags">
                {selectedFeelings.map((selectedId) => {
                  const feeling = activeFeelings.find(
                    (item) => item.id === selectedId
                  );

                  if (!feeling) {
                    return null;
                  }

                  return (
                    <span className="selected-tag" key={selectedId}>
                      {feeling.symbol} {feeling.label.split("\n").join(" ")}
                    </span>
                  );
                })}
              </div>
            </div>

            <div className="question-box need-question-box">
              <div className="question-child" aria-hidden="true">
                ぼく
              </div>

              <div>
                <h2>ほんとうは どうしてほしかった？</h2>

                <p>
                  {activeScenario.partnerName}
                  に してほしかったことを
                  <br />
                  えらんでね。
                </p>
              </div>
            </div>

            <p className="multiple-choice-note">
              いくつ えらんでも だいじょうぶ
            </p>

            <div className="need-grid">
              {activeNeeds.map((need) => {
                const isSelected = selectedNeeds.includes(need.id);

                const labelLines = need.label.split("\n");

                return (
                  <button
                    key={need.id}
                    type="button"
                    className={`need-card ${
                      isSelected ? "need-card-selected" : ""
                    }`}
                    aria-pressed={isSelected}
                    onClick={() =>
                      setSelectedNeeds((current) =>
                        toggleOption(current, need.id, activeNeeds)
                      )
                    }
                  >
                    <span className="need-symbol" aria-hidden="true">
                      {need.symbol}
                    </span>

                    <span className="need-label">
                      {labelLines.map((line, index) => (
                        <span key={`${need.id}-${index}`}>
                          {line}

                          {index < labelLines.length - 1 && <br />}
                        </span>
                      ))}
                    </span>

                    <span
                      className={`selection-mark ${
                        isSelected ? "selection-mark-visible" : ""
                      }`}
                      aria-hidden="true"
                    >
                      ✓
                    </span>
                  </button>
                );
              })}
            </div>

            {selectedNeeds.length > 0 && (
              <div className="selection-summary need-summary">
                <p>えらんだ おねがい</p>

                <div className="selected-tags">
                  {selectedNeeds.map((selectedId) => {
                    const need = activeNeeds.find(
                      (item) => item.id === selectedId
                    );

                    if (!need) {
                      return null;
                    }

                    return (
                      <span className="selected-tag" key={selectedId}>
                        {need.symbol} {need.label.split("\n").join(" ")}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="button-row">
              <button
                className="secondary-button"
                type="button"
                onClick={() => setScreen("feelings")}
              >
                もどる
              </button>

              <button
                className="primary-button"
                type="button"
                disabled={selectedNeeds.length === 0}
                onClick={() => setScreen("expressions")}
              >
                これで つぎへ
              </button>
            </div>
          </div>
        )}

        {screen === "expressions" && activeScenario && (
          <div className="screen">
            <div className="step-label">つたえかた</div>

            <div className="answer-history">
              <div className="answer-history-section">
                <p>ぼくの きもち</p>

                <div className="selected-tags">
                  {selectedFeelings.map((selectedId) => {
                    const feeling = activeFeelings.find(
                      (item) => item.id === selectedId
                    );

                    if (!feeling) {
                      return null;
                    }

                    return (
                      <span className="selected-tag" key={selectedId}>
                        {feeling.symbol} {feeling.label.split("\n").join(" ")}
                      </span>
                    );
                  })}
                </div>
              </div>

              <div className="answer-history-section">
                <p>してほしかったこと</p>

                <div className="selected-tags">
                  {selectedNeeds.map((selectedId) => {
                    const need = activeNeeds.find(
                      (item) => item.id === selectedId
                    );

                    if (!need) {
                      return null;
                    }

                    return (
                      <span className="selected-tag" key={selectedId}>
                        {need.symbol} {need.label.split("\n").join(" ")}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="question-box expression-question-box">
              <div className="question-child" aria-hidden="true">
                ぼく
              </div>

              <div>
                <h2>{activeScenario.partnerName}に なんて つたえる？</h2>

                <p>いちばん よいと おもう ことばを えらんでね。</p>
              </div>
            </div>

            <div className="expression-list">
              {activeScenario.expressions.map((expression, index) => {
                const isSelected = selectedExpressionId === expression.id;

                return (
                  <button
                    key={expression.id}
                    type="button"
                    className={`expression-card ${
                      isSelected ? "expression-card-selected" : ""
                    }`}
                    aria-pressed={isSelected}
                    onClick={() => setSelectedExpressionId(expression.id)}
                  >
                    <span className="expression-number" aria-hidden="true">
                      {index + 1}
                    </span>

                    <span className="expression-text">
                      「{expression.text}」
                    </span>

                    <span
                      className={`radio-mark ${
                        isSelected ? "radio-mark-selected" : ""
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                );
              })}
            </div>

            <div className="button-row">
              <button
                className="secondary-button"
                type="button"
                onClick={() => setScreen("needs")}
              >
                もどる
              </button>

              <button
                className="primary-button"
                type="button"
                disabled={!selectedExpressionId}
                onClick={() => setScreen("reaction")}
              >
                この ことばで つたえる
              </button>
            </div>
          </div>
        )}

        {screen === "reaction" && activeScenario && selectedExpression && (
          <div
            className={`screen reaction-screen reaction-${selectedExpression.partnerEmotion}`}
          >
            <div className="step-label">
              {activeScenario.partnerName}の きもち
            </div>

            <div className="spoken-expression-box">
              <p>ぼくが いった ことば</p>

              <strong>「{selectedExpression.text}」</strong>
            </div>

            <div className="mother-reaction-area">
              {selectedExpression.evaluation === "helpful" &&
              recoveryExpression ? (
                <>
                  <p className="recovery-title">ことばを いいなおすと……</p>

                  <div
                    className="emotion-morph"
                    aria-label={`${activeScenario.partnerName}の気持ちが、${recoveryExpression.partnerEmotionLabel}から、うれしい気持ちに変わりました`}
                  >
                    <div
                      className={`mother-emotion-face emotion-layer emotion-before mother-emotion-${recoveryExpression.partnerEmotion}`}
                    >
                      <span aria-hidden="true">
                        {recoveryExpression.partnerSymbol}
                      </span>
                    </div>

                    <div className="mother-emotion-face emotion-layer emotion-after mother-emotion-happy">
                      <span aria-hidden="true">😊</span>
                    </div>
                  </div>

                  <p className="recovery-caption">
                    「{recoveryExpression.partnerEmotionLabel}
                    」から「うれしい」へ
                  </p>
                </>
              ) : (
                <div
                  className={`mother-emotion-face mother-emotion-${selectedExpression.partnerEmotion}`}
                  aria-label={`${activeScenario.partnerName}は${selectedExpression.partnerEmotionLabel}気持ち`}
                >
                  <span aria-hidden="true">
                    {selectedExpression.partnerSymbol}
                  </span>
                </div>
              )}

              <div className="mother-emotion-name">
                {activeScenario.partnerName}は
                <strong>
                  「{selectedExpression.partnerEmotionLabel} きもち」
                </strong>
              </div>

              <div className="speech-bubble">
                「{selectedExpression.partnerMessage}」
              </div>
            </div>

            <div
              className={`guidance-box guidance-${selectedExpression.evaluation}`}
            >
              <p>{selectedExpression.guidance}</p>
            </div>

            {selectedExpression.evaluation === "helpful" ? (
              <div className="button-row">
                <button
                  className="secondary-button"
                  type="button"
                  onClick={() => {
                    setSelectedExpressionId(null);
                    setScreen("expressions");
                  }}
                >
                  べつの ことばも みる
                </button>

                <button
                  className="primary-button"
                  type="button"
                  onClick={() => setScreen("success")}
                >
                  できた！
                </button>
              </div>
            ) : (
              <div className="retry-area">
                <p>
                  ほんとうの きもちが つたわるように、
                  <br />
                  もういちど えらんでみよう。
                </p>

                <button
                  className="primary-button"
                  type="button"
                  onClick={retryExpression}
                >
                  ことばを いいなおす
                </button>
              </div>
            )}
          </div>
        )}

        {screen === "success" && activeScenario && selectedExpression && (
          <div className="screen success-screen">
            <div className="success-mark" aria-hidden="true">
              ✓
            </div>

            <div className="success-heading">
              <h2>きもちが つたわったね！</h2>

              <p>
                ほんとうの きもちと、
                <br />
                してほしいことを ことばで つたえられました。
              </p>
            </div>

            <div className="success-scene">
              <div className="success-character success-child">
                <div className="success-face">ぼく</div>
              </div>

              <div className="success-speech">
                「{selectedExpression.text}」
              </div>

              <div className="success-character success-mother">
                <div className="success-face success-mother-face">
                  <span aria-hidden="true">😊</span>

                  <small>{activeScenario.partnerName}</small>
                </div>
              </div>
            </div>

            <div className="learning-summary">
              <h3>きょう できたこと</h3>

              <div className="learning-summary-section">
                <p className="learning-summary-label">① じぶんの きもち</p>

                <div className="selected-tags">
                  {selectedFeelings.map((selectedId) => {
                    const feeling = activeFeelings.find(
                      (item) => item.id === selectedId
                    );

                    if (!feeling) {
                      return null;
                    }

                    return (
                      <span className="selected-tag" key={selectedId}>
                        {feeling.symbol} {feeling.label.split("\n").join(" ")}
                      </span>
                    );
                  })}
                </div>
              </div>

              <div className="learning-summary-section">
                <p className="learning-summary-label">② してほしかったこと</p>

                <div className="selected-tags">
                  {selectedNeeds.map((selectedId) => {
                    const need = activeNeeds.find(
                      (item) => item.id === selectedId
                    );

                    if (!need) {
                      return null;
                    }

                    return (
                      <span className="selected-tag" key={selectedId}>
                        {need.symbol} {need.label.split("\n").join(" ")}
                      </span>
                    );
                  })}
                </div>
              </div>

              <div className="learning-summary-section">
                <p className="learning-summary-label">③ つたわる ことば</p>

                <div className="final-expression">
                  「{selectedExpression.text}」
                </div>
              </div>
            </div>

            <div className="success-message-box">
              <strong>まちがえても だいじょうぶ。</strong>

              <p>
                いいなおすと、ほんとうの きもちを
                <br />
                つたえることが できるよ。
              </p>
            </div>

            <div className="button-row">
              <button
                className="secondary-button"
                type="button"
                onClick={openScenarioSelect}
              >
                ほかの ばめんを えらぶ
              </button>

              <button
                className="primary-button"
                type="button"
                onClick={() => beginScenario(activeScenario.id)}
              >
                おなじ ばめんを もういちど
              </button>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

export default App;
