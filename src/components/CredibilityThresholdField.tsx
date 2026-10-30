import { RangeSlider } from "./RangeSlider";
import { useStore } from "../store";

export function CredibilityThresholdField({ className }: { className?: string }) {
  const { currentUser, setCredibilityThreshold } = useStore();
  const value = currentUser?.credibility_threshold ?? 1;

  return (
    <label className={`field${className ? ` ${className}` : ""}`}>
      <span>Credibility Threshold</span>
      <RangeSlider value={value} onChange={setCredibilityThreshold} />
    </label>
  );
}
