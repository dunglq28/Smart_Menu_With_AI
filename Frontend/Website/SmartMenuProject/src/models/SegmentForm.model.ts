export interface CustomerSegmentForm {
  segmentName: { value: string; errorMessage: string };
  gender: { value: string; errorMessage: string };
  sessions: { value: string[]; errorMessage: string };
  ageFrom: { value: string; errorMessage: string };
  ageTo: { value: string; errorMessage: string }
}
