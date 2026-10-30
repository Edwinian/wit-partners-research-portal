type RangeSliderProps = {
  min?: number;
  max?: number;
  value: number;
  onChange: (value: number) => void;
};

export function RangeSlider({ min = 1, max = 10, value, onChange }: RangeSliderProps) {
  const fill = ((value - min) / (max - min)) * 100;
  return (
    <div className="range-row">
      <span>{min}</span>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        style={{ ["--fill" as string]: `${fill}%` }}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      <span>{max}</span>
    </div>
  );
}
