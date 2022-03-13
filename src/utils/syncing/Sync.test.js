import _ from "underscore";
import { mergeFirebaseAndLocalData } from "./SyncUtils";
import {
  similarData,
  updatedData,
  outdatedData,
  firebaseData,
  localData,
} from "./testCases";

jest.mock("../../init", () => () => false);
jest.mock("components/features/rules/ImportRulesModal/actions", () => () =>
  false
);

describe("firebase and local rule gets merged on the basis of lastModified key", () => {
  test("data in firebase and local are same", () => {
    const finalOutput = mergeFirebaseAndLocalData(similarData, similarData);
    expect(_.isEqual(similarData, finalOutput)).toBeTruthy();
  });
  test("data is same but updated in firebase is not", () => {
    const finalOutput = mergeFirebaseAndLocalData(outdatedData, updatedData);
    expect(_.isEqual(updatedData, finalOutput)).toBeTruthy();
  });
  test("data in firebase and local are different", () => {
    const finalOutput = [...mergeFirebaseAndLocalData(firebaseData, localData)];
    expect(finalOutput).toHaveLength(7);
  });
});
