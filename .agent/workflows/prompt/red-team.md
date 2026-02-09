---
description: Red Team prompting technique challenges LLM responses to drive deeper, more accurate answers and to identify potential vulnerabilities or biases.
---

This workflow is a strategic approach to **critically challenge LLM responses to drive deeper and more accurate answers**. It checks for stability and reliability, identifying potential vulnerabilities or biases.

## 🎯 What is a Red Team?

A term used in the security industry, military, and intelligence agencies, referring to a **team that finds and tests security vulnerabilities from an attacker's perspective**. In the AI context, it's a methodology for critically reviewing and improving the model's responses.

## 🔄 Workflow Process

### Phase 1: Analysis of Initial Response

1. **Obtain Initial Response**
   ```
   First, receive an answer to the [Original Question/Request].
   ```

2. **Critical Review**
   | Review Item | Question |
   |-------------|----------|
   | Logical Leap | Are there missing steps in the process of reaching the conclusion? |
   | Insufficient Evidence | Is there enough evidence to support the claim? |
   | Potential Bias | Is it biased towards a specific viewpoint? |
   | Over-generalization | Has it made excessive conclusions based on limited information? |
   | Blind Spot | Are there important factors that were not considered? |

### Phase 2: Identify Core Assumptions

1. **Extract Assumptions**
   ```
   Core assumptions this answer is based on:
   
   1. [Assumption 1]: [Evidence level: Strong/Medium/Weak]
   2. [Assumption 2]: [Evidence level: Strong/Medium/Weak]
   3. [Assumption 3]: [Evidence level: Strong/Medium/Weak]
   ```

2. **Compose Challenge Questions**
   - Prepare "What if this assumption is wrong?" questions for each assumption.
   - Predict outcomes if assumptions are reversed.

### Phase 3: Design Strategic Questions

1. **Present Counter-arguments**
   ```
   Let's take a position opposing your answer:
   
   - Counter-argument 1: [Opposing claim]
   - Counter-argument 2: [Opposing claim]
   - Counter-argument 3: [Opposing claim]
   
   How would you respond to these counter-arguments?
   ```

2. **"Why-Why-Why" Questions (5 Whys)**
   ```
   [Claim/Conclusion]
   ↓ Why?
   [Reason 1]
   ↓ Why?
   [Reason 2]
   ↓ Why?
   [Reason 3]
   ↓ Why?
   [Reason 4]
   ↓ Why?
   [Root Cause/Core Assumption]
   ```

3. **Perspective Shift Questions**
   ```
   If we look at this answer from the perspective of [Opponent/Critic/Competitor]:
   - What problems would be visible?
   - What alternatives would be proposed?
   - What points would be emphasized?
   ```

### Phase 4: Gradual Deepening

1. **Surface → Root Movement**
   | Step | Focus | Example Question |
   |------|-------|------------------|
   | 1. Surface | Explicit claims | "Is this claim really correct?" |
   | 2. Intermediate | Logical structure | "Is the process for reaching this conclusion valid?" |
   | 3. Deep | Implicit assumptions | "Isn't this premise itself questionable?" |
   | 4. Fundamental | Worldview/Paradigm | "Isn't this perspective itself biased?" |

2. **Conversation Development**
   ```
   Round 1: Superficial refutation
   Round 2: Review of logical structure
   Round 3: Challenging assumptions
   Round 4: Presenting an alternative framework
   Round 5: Synthesis and improved conclusion
   ```

## 💡 Prompt Template

### Basic Red Team Template
```
Please perform a Red Team analysis on the answer you just provided:

1. Identify the top 3 major vulnerabilities of this answer.
2. Present the strongest counter-argument.
3. Is there any perspective or information you might have missed?
4. Please improve the answer based on this critique.
```

### Request for Opposing Opinion Template
```
Please play the role of a Devil's Advocate for the following claim/answer:

[Claim/Answer]

- What is the most vulnerable part of this claim?
- Please present a persuasive argument opposing this claim.
- Assuming this claim is completely wrong, what alternatives are there?
```

### 5 Whys Template
```
Please perform a "Five Whys" analysis on the following conclusion:

[Conclusion]

For each "Why":
1. Superficial reason
2. Deeper reason
3. Structural cause
4. Systemic factors
5. Root cause

Please dig deep into it.
```

### Comprehensive Red Team Template
```
Please perform a comprehensive Red Team analysis on the following answer:

[Original Answer]

## Analysis Request

### 1. Vulnerability Analysis
- Logical vulnerabilities
- Lack of information
- Potential bias

### 2. Opposing Perspectives
- Top 3 major counter-arguments
- Alternative interpretations

### 3. Challenging Assumptions
- List of implicit assumptions
- Rebuttal for each assumption

### 4. Improved Answer
- Revised conclusion accepting the criticism
- Specifying remaining uncertainties
```

## 📊 Output Format

```markdown
## 🔴 Red Team Analysis Results

### Summary of Original Answer
[Summary of the answer to be analyzed]

### Vulnerability Analysis
| Type | Problem | Severity | Direction for Improvement |
|------|---------|----------|---------------------------|
| Logical Leap | [Problem] | High/Medium/Low | [Direction] |
| Lack of Evidence | [Problem] | High/Medium/Low | [Direction] |
| Bias | [Problem] | High/Medium/Low | [Direction] |

### Core Assumptions & Challenges
1. **Assumption**: [Assumption content]
   - **Challenge**: [Rebuttal]
   - **Outcome**: [If the assumption is false]

2. **Assumption**: [Assumption content]
   - **Challenge**: [Rebuttal]
   - **Outcome**: [If the assumption is false]

### Major Counter-arguments
1. [Counter-argument 1]: [Explanation]
2. [Counter-argument 2]: [Explanation]
3. [Counter-argument 3]: [Explanation]

### Missed Perspectives
- [Perspective 1]
- [Perspective 2]

### Improved Answer
[Revised conclusion accepting critics]

### Remaining Uncertainties
- [Uncertain part 1]
- [Uncertain part 2]
```

## 🛡️ Red Team vs. Blue Team

| Role | Red Team | Blue Team |
|------|----------|-----------|
| Purpose | Discover vulnerabilities | Strengthen defense |
| Approach | Aggressive criticism | Defensive reinforcement |
| Output | List of vulnerabilities, counter-arguments | Improved answers, reinforced arguments |

```
Optimal Process:
1. Blue Team: Generate initial answer
2. Red Team: Analyze vulnerabilities and attack
3. Blue Team: Incorporate criticism and improve answer
4. Repeat...
```

## ⚠️ Notes

- The purpose of a Red Team is improvement, not destruction.
- Provide constructive criticism along with alternative suggestions.
- Not all criticism is valid, so balanced judgment is necessary.
- Be careful not to fall into infinite skepticism.
