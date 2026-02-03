# CNA System Workbench Upgrade TODO

## Phase 1: Setup and Dependencies
- [ ] Install react-resizable-panels for pane management
- [ ] Install react-dnd for drag-and-drop functionality
- [ ] Update package.json with new dependencies

## Phase 2: Core Workbench Architecture
- [ ] Create components/Workbench.tsx as main workbench component
- [ ] Implement tiled layout structure:
  - Draggable Sidebar (organizational hierarchy)
  - Tabbed Main Center (Survey Insights)
  - Bottom Terminal (10% Formal Training logs)
  - Minimized Right Panel (20% Coaching/Mentoring matches)
- [ ] Add pane resizing and collapsing functionality

## Phase 3: Global State Enhancement
- [ ] Enhance components/AppContext.tsx for real-time updates
- [ ] Implement data import triggers for automatic content generation
- [ ] Add state management for pane visibility and sizes

## Phase 4: UI Components and Features
- [ ] Implement drag-and-drop zones with smart empty states
- [ ] Add color-coded visual cues for 10:20:70 Learning Model
- [ ] Create responsive charts that auto-scale on pane resize
- [ ] Add collapsible panels with one-click toggles

## Phase 5: Integration and Testing
- [ ] Update App.tsx to use Workbench instead of MainDashboard
- [ ] Update utils/import.ts for real-time content generation
- [ ] Test responsive behavior and drag-and-drop functionality
- [ ] Verify real-time updates on data import (Establishment Register, Corporate Plan, CNA Survey)

## Phase 6: Polish and Optimization
- [ ] Ensure VS Code-like IDE experience
- [ ] Optimize performance for large datasets
- [ ] Add keyboard shortcuts and accessibility features
- [ ] Final testing and bug fixes
