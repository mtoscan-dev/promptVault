---
description: Multi-Perspective technique analyzes complex problems from various stakeholder viewpoints to provide a balanced perspective.
---

This workflow analyzes complex issues from **multiple stakeholder perspectives** rather than a single viewpoint to derive comprehensive solutions.

## 🎯 Application Areas

- Business strategy development
- Policy decision making
- Social problem solving
- Product/Service design
- Conflict resolution within organizations

## 🔄 Workflow Process

### Phase 1: Problem Definition & Stakeholder Identification

1. **Clarify the Problem**
   - Clearly define the problem or topic to be analyzed
   - Understand the scope and context of the issue

2. **Stakeholder Mapping**
   - List all stakeholders related to the issue
   - Identify each stakeholder's role and influence

   | Stakeholder | Role | Interests |
   |-------------|------|-----------|
   | e.g., Customer | End user | Price, Quality |
   | e.g., Employee | Service provider | Work environment, Salary |
   | ... | ... | ... |

### Phase 2: Perspective Analysis (Few-shot Prompting)

1. **Provide Perspective Examples** (2-5 recommended)
   ```
   You are in the position of [Stakeholder 1]. Regarding [Problem]:
   - How does this problem affect you?
   - What direction of resolution do you desire?
   - What are the values you consider most important?
   
   Example 1) Customer Perspective: "I want high-quality products at a reasonable price..."
   Example 2) Employee Perspective: "I want to work in a stable environment..."
   ```

2. **Collect Feedback by Perspective**
   - Analyze the problem from each stakeholder's perspective
   - Organize concerns, expectations, and constraints

### Phase 3: Perspective Comparison & Conflict Analysis

1. **Find Common Ground**
   - Identify points of agreement across all perspectives
   - Extract high-priority common values

2. **Identify Conflict Points**
   | Stakeholder A | Stakeholder B | Conflict Content | Severity |
   |---------------|---------------|------------------|----------|
   | ... | ... | ... | High/Medium/Low |

### Phase 4: Derive Integrated Solutions

1. **Seek Compromise**
   - Explore ways to accommodate conflicting interests as much as possible
   - Discover Win-Win scenarios

2. **Evaluate Solutions**
   - Review the feasibility of the solution from each perspective
   - Analyze side effects and risks

### Phase 5: Synthesis of Results

1. **Write Final Recommendations**
   ```markdown
   ## 🎯 Analysis Results Summary
   
   ### Subject of Analysis
   [Problem/Topic description]
   
   ### Participating Perspectives
   - [x] Perspective 1: [Stakeholder Role]
   - [x] Perspective 2: [Stakeholder Role]
   - [x] Perspective 3: [Stakeholder Role]
   
   ### Key Findings
   - Common Values: ...
   - Major Conflicts: ...
   
   ### Recommendations
   1. ...
   2. ...
   
   ### Remaining Tasks
   - ...
   ```

## 💡 Prompt Template

```
Please perform a multi-perspective analysis on the following problem:

[Problem Description]

Please analyze from the perspectives of the following stakeholders:
1. [Stakeholder 1]: [Brief description]
2. [Stakeholder 2]: [Brief description]
3. [Stakeholder 3]: [Brief description]

From each perspective:
- Key concerns
- Desired outcomes
- Unacceptable conditions

Analyze these and present a balanced solution that considers all perspectives.
```

## ⚠️ Notes

- Do not ignore or disparage any perspective
- Avoid advocating only for a specific stakeholder's position with a biased view
- Derive actionable solutions considering realistic constraints
