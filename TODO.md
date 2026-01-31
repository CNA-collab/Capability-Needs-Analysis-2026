# Task: Configure Analytical Engine for Import Module

## Objective

Configure the system's backend to serve as a comprehensive analytical engine driven by the 'Import' module in the sidebar. Build three distinct upload gateways for MS Excel datasets: CNA Survey Data, Organizational Establishment Register, and Organizational Corporate Plan. Enable automatic cross-referencing to generate multi-dimensional reports in SurveyInsights.tsx, identifying misalignments between staffing, objectives, and training needs. Provide clear status feedback for each file.

## Plan

### 1. Modify ImportModal for Excel Corporate Plan Upload

- Change Corporate Plan from PDF to Excel upload
- Update file input to accept .xlsx/.csv
- Remove PDF processing logic
- Add Excel parsing for Corporate Plan data

### 2. Enhance Data Processing and Cross-Referencing

- Update import utilities to handle Corporate Plan Excel data
- Implement automatic cross-referencing logic between the three datasets
- Add validation and error handling for data consistency

### 3. Update SurveyInsights for Multi-Dimensional Reports

- Enhance reconciliation logic to identify misalignments
- Add new KPIs and charts for cross-referenced insights
- Generate reports on staffing vs objectives vs training needs

### 4. Implement Status Feedback

- Add upload status indicators for each of the three files
- Show processing states, success/failure, and validation messages
- Provide user guidance through the ingestion process

### 5. Testing and Validation

- Test end-to-end import and analysis workflow
- Validate cross-referencing accuracy
- Ensure reports display correctly in SurveyInsights

## Files to Edit

- components/ImportModal.tsx
- utils/import.ts
- components/SurveyInsights.tsx
- types.ts (if needed for new data structures)

## Dependent Files

- services/GoogleSheetsService.ts (for any additional data fetching)
- utils/chartUtils.ts (for new chart data processing)

## Summary

The analytical engine has been successfully configured with three distinct upload gateways for MS Excel datasets. The system now automatically cross-references CNA Survey Data, Organizational Establishment Register, and Organizational Corporate Plan data to generate multi-dimensional reports in SurveyInsights.tsx, identifying misalignments between current staffing, strategic objectives, and training needs. Clear status feedback is provided for each file during the import process.
