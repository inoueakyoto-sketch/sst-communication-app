import type { Scenario } from "../types/scenario";

const STORAGE_KEY = "sst-communication-scenarios-v1";

export function loadStoredScenarios(defaultScenarios: Scenario[]): Scenario[] {
  if (typeof window === "undefined") {
    return defaultScenarios;
  }

  try {
    const savedData = window.localStorage.getItem(STORAGE_KEY);

    if (!savedData) {
      return defaultScenarios;
    }

    const parsedData: unknown = JSON.parse(savedData);

    if (!Array.isArray(parsedData)) {
      return defaultScenarios;
    }

    return parsedData as Scenario[];
  } catch (error) {
    console.error("場面データの読み込みに失敗しました。", error);
    return defaultScenarios;
  }
}

export function saveStoredScenarios(scenarios: Scenario[]): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(scenarios));
  } catch (error) {
    console.error("場面データの保存に失敗しました。", error);
  }
}

export function clearStoredScenarios(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("保存データの削除に失敗しました。", error);
  }
}
