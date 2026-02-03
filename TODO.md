# CNA Workbench Development Plan

## Overview

Develop the "CNA Workbench," a single-page, VS Code-inspired IDE for Organizational Development with core logic for data triangulation, 10:20:70 implementation, and specific UI layout.

## Core Requirements

- **Data Triangulation**: Ingest and cross-reference CNA Survey Data, Establishment Register, and Corporate Plan
- **10:20:70 Framework**: Categorize interventions as Formal (10%), Coaching (20%), OJT (70%)
- **VS Code Layout**: Sidebar (hierarchy + staff ceiling), Main Tab (Survey Insights), Bottom Panel (Terminal), Right Inspector (Corporate Objectives alignment)

## Implementation Steps

### Phase 1: Layout Structure

- [ ] Restructure MainDashboard.tsx to VS Code-inspired layout
- [ ] Create BottomPanel component (Terminal view for training logs/ROI)
- [ ] Create RightInspector component (officer data vs Corporate Objectives)
- [ ] Update Sidebar for organizational hierarchy and staff ceiling status

### Phase 2: Data Integration

- [ ] Implement global state updates on file import
- [ ] Cross-reference data sources for workforce planning interventions
- [ ] Calculate Total Staff Ceiling and Missing Gap projections

### Phase 3: 10:20:70 Logic

- [ ] Implement Formal training (10%) with Corporate Plan alignment
- [ ] Implement Coaching (20%) based on skill gaps vs experience
- [ ] Implement OJT (70%) linked to Job Descriptions

### Phase 4: UI Components

- [ ] Update SurveyInsights.tsx as main tab dashboard
- [ ] Add heatmaps for individual and organizational skill gaps
- [ ] Implement draggable organizational hierarchy in sidebar

### Phase 5: Testing & Validation

- [ ] Test global state updates on import
- [ ] Validate data triangulation logic
- [ ] Ensure responsive VS Code-style layout

## Current Status

- [x] Plan approved by user
- [ ] Starting implementation
