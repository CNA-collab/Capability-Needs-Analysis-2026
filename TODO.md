# Capability Gap Analysis Report - SPA Rating Implementation

## Task

Activate the Capability Gap Analysis Report to compare 'Most attained SPA Ratings' against the department's required baseline with a bar chart showing the delta and training recommendations.

## Implementation Steps

- [x] 1. Add imports for ChartComponent and useRef to CapabilityGapAnalysisReport.tsx
- [x] 2. Add spaChartRef and computed data for SPA rating distribution
- [x] 3. Add new section for SPA Rating Gap Analysis with bar chart
- [x] 4. Calculate delta between current ratings and required baseline
- [x] 5. Add training recommendations for permanent staff below baseline
- [x] 6. Test the implementation

## Technical Details

- SPA Rating Scale: 1-5
- Required Baseline: Rating 3 ("At Required Level") or higher
- Chart Type: Bar chart showing distribution vs baseline
- Filter: Permanent staff only for training recommendations

## Implementation Summary

### Features Added:

1. **SPA Rating Data Processing**
   - Filters data for permanent/confirmed staff
   - Parses SPA ratings from officer records (1-5 scale)
   - Calculates percentage distribution of ratings

2. **Delta Calculation**
   - Compares current distribution against baseline targets:
     - Rating 1: 10% target
     - Rating 2: 20% target
     - Rating 3: 30% target
     - Rating 4: 25% target
     - Rating 5: 15% target
   - Shows positive (above target) and negative (below target) deltas

3. **Bar Chart Visualization**
   - Horizontal bar chart showing rating distribution vs baseline
   - Green bars for above target, red bars for below target

4. **Training Recommendations Section**
   - Lists permanent staff with ratings below baseline (1-2)
   - Provides targeted training interventions:
     - Rating 1: Formal Training - Overseas
     - Rating 2: In-House Coaching / On-the-Job
   - Summary statistics showing total staff, staff with ratings, and compliance rate
