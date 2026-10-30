import { RangeSlider } from "./RangeSlider";
import { CREDIBILITY_MAX, CREDIBILITY_THRESHOLD_MIN } from "../types";
import { useStore } from "../store";

export function CredibilityThresholdField({ className }: { className?: string }) {
  const { currentUser, setCredibilityThreshold } = useStore();
  const value = currentUser?.credibility_threshold ?? CREDIBILITY_THRESHOLD_MIN;

  return (
    <label className={`field${className ? ` ${className}` : ""}`}>
      <span>Credibility Threshold ({value})</span>
      <RangeSlider
        min={CREDIBILITY_THRESHOLD_MIN}
        max={CREDIBILITY_MAX}
        value={value}
        onChange={setCredibilityThreshold}
      />
    </label>
  );
}
