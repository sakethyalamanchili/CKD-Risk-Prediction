import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface FeatureImportanceChartProps {
  formData: Record<string, number>;
}

const FeatureImportanceChart: React.FC<FeatureImportanceChartProps> = ({ formData }) => {
  // Feature importance weights
  const featureWeights = [
    { name: 'Serum Creatinine', value: 0.287242, key: 'serumCreatinine' },
    { name: 'Estimated GFR', value: 0.172315, key: 'estimatedGFR' },
    { name: 'Albumin Level', value: 0.117859, key: 'albuminLevel' },
    { name: 'Hemoglobin Level', value: 0.117017, key: 'hemoglobinLevel' },
    { name: 'WBC Count', value: 0.114151, key: 'whiteBloodCellCount' },
    { name: 'Age', value: 0.052832, key: 'age' },
    { name: 'Blood Glucose', value: 0.049214, key: 'bloodGlucoseLevel' },
    { name: 'Urea Nitrogen', value: 0.039039, key: 'ureaNitrogenLevel' },
    { name: 'Sodium Level', value: 0.026435, key: 'sodiumLevel' },
    { name: 'Potassium Level', value: 0.023895, key: 'potassiumLevel' }
  ];

  // Normal ranges for each feature
  const normalRanges = {
    serumCreatinine: { min: 0.7, max: 1.3 }, // mg/dL
    estimatedGFR: { min: 90, max: 120 }, // mL/min/1.73m²
    hemoglobinLevel: { min: 13.5, max: 17.5 }, // g/dL
    ureaNitrogenLevel: { min: 7, max: 20 }, // mg/dL
    albuminLevel: { min: 3.5, max: 5.0 }, // g/dL
    whiteBloodCellCount: { min: 4.5, max: 11.0 }, // ×10³/µL
    bloodGlucoseLevel: { min: 70, max: 100 }, // mg/dL
    age: { min: 18, max: 65 }, // years
    potassiumLevel: { min: 3.5, max: 5.0 }, // mEq/L
    sodiumLevel: { min: 135, max: 145 }, // mEq/L
  };

  // Determine if a value is outside normal range
  const isOutsideNormalRange = (key: string, value: number) => {
    const range = normalRanges[key as keyof typeof normalRanges];
    if (!range) return false;
    return value < range.min || value > range.max;
  };

  // Add current value and highlight status to each feature
  const chartData = featureWeights.map(feature => {
    const currentValue = formData[feature.key];
    const isAbnormal = isOutsideNormalRange(feature.key, currentValue);

    return {
      ...feature,
      currentValue,
      isAbnormal
    };
  });

  // Sort by importance
  chartData.sort((a, b) => b.value - a.value);

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="custom-tooltip">
          <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>{data.name}</p>
          <p style={{ fontSize: '0.875rem' }}>Importance: {data.value.toFixed(3)}</p>
          <p style={{ fontSize: '0.875rem' }}>Value: {data.currentValue}</p>
          <p style={{
            fontSize: '0.875rem',
            fontWeight: 'bold',
            color: data.isAbnormal ? 'var(--danger-color)' : 'var(--info-color)'
          }}>
            {data.isAbnormal ? 'Outside normal range' : 'Within normal range'}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
          <XAxis
            type="number"
            domain={[0, 0.3]}
            tickFormatter={(value) => value.toFixed(2)}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={100}
            tick={{ fontSize: 12 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="value" name="Importance" animationDuration={1500}>
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.isAbnormal ? 'var(--danger-color)' : 'var(--info-color)'}
                opacity={0.8}
                stroke={entry.isAbnormal ? 'var(--danger-color)' : 'var(--info-color)'}
                strokeWidth={1}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="chart-legend">
        <div className="legend-item">
          <div className="legend-color legend-blue"></div>
          <span>Normal Range</span>
        </div>
        <div className="legend-item">
          <div className="legend-color legend-red"></div>
          <span>Outside Normal Range</span>
        </div>
      </div>
    </div>
  );
};

export default FeatureImportanceChart;