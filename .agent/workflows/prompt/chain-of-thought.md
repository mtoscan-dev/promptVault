---
description: Chain of Thought (CoT) technique improves complex problem-solving abilities by structuring thought processes similarly to human logical reasoning.
---

This workflow enhances complex problem-solving abilities by **structuring thought processes similarly to human logical reasoning**, solving problems step-by-step.

## 🎯 Application Situations

- Solving mathematical/logical problems
- Complex business analysis
- Technical decision making
- Tasks requiring multi-step reasoning

> 💡 **Note**: Reasoning-specialized models like OpenAI o1/o3 and DeepSeek R1 have built-in CoT capabilities, so a separate prompt may not be necessary.

## 🔄 Workflow Process

### Phase 1: Set Steps

1. **Decompose the Problem**
   - Logically break down the overall problem into sub-steps
   - Assign clear numbers or bullet points to each step

2. **Step Design Principles**
   | Principle | Description |
   |-----------|-------------|
   | Logical Connectivity | Each step must be logically connected to ensure overall consistency. |
   | Sequential Difficulty | Move incrementally from easy steps to more difficult ones. |
   | Independent yet Connected | Each step should have its own meaning while functioning as part of the whole. |
   | Clear Distinction | Use numbers or bullet points to clearly separate steps. |

   ```
   Example Structure:
   Step 1: [Most basic analysis/information gathering]
   Step 2: [Analysis based on results from Step 1]
   Step 3: [In-depth analysis based on results from Step 2]
   Step 4: [Derivation of final conclusion]
   ```

### Phase 2: Guide the Reasoning Process

1. **Use Thought-Promoting Expressions**
   ```
   - "First, let's think about..."
   - "Analyzing this..."
   - "Considering..."
   - "Let's look at this step-by-step..."
   ```

2. **Specify Intermediate Results**
   - Clearly describe the conclusion of each step
   - Perform an intermediate check before moving to the next step

### Phase 3: Utilize a Metacognitive Approach

1. **Recognize and Explain Thought Processes**
   ```
   Explaining my reasoning process:
   
   1. First, I considered [X].
   2. Then, I analyzed how this connects with [Y].
   3. The reason for reaching conclusion [Z] is...
   ```

2. **Express Uncertainty**
   - Distinguish between certain and uncertain parts
   - Specify areas where additional information is needed

### Phase 4: Iterative Improvement

1. **Review the Answer**
   - Check if there are any logical leaps
   - Verify if each step correctly builds upon the previous one

2. **Reorganize if Necessary**
   - Add missing steps
   - Combine redundant steps
   - Correct logical errors

## 💡 Prompt Template

### Basic Template
```
Please solve the following problem by thinking step-by-step:

[Problem Description]

In each step:
1. Specify what you are analyzing.
2. Explain the conclusion reached in that step.
3. Show the logical link to move to the next step.
```

### Magic Command
```
"Think step by step."
"Let's think step by step."
```

### Detailed Template
```
Please solve the following problem:

[Problem Description]

Step 1: Understand the problem and identify key elements.
Step 2: Organize necessary information and assumptions.
Step 3: Analyze each element and identify relationships.
Step 4: Synthesize analysis results to derive a conclusion.
Step 5: Verify the conclusion and present the final answer.

Please explain your thought process in detail for each step.
```

## 📊 Output Format

```markdown
## 🧠 Chain of Thought Analysis

### Problem
[Problem Description]

### Reasoning Process

#### Step 1: [Step Title]
[Description of thought process]
→ Intermediate Conclusion: [Conclusion]

#### Step 2: [Step Title]
[Description of thought process]
→ Intermediate Conclusion: [Conclusion]

#### Step 3: [Step Title]
[Description of thought process]
→ Intermediate Conclusion: [Conclusion]

### Final Conclusion
[Final Answer]

### Logical Verification
- Logical connectivity of each step: ✅
- Validity of assumptions: ✅
- Consistency of conclusions: ✅
```

## ⚠️ Notes

- Dividing into too many steps can actually cause confusion.
- Each step should include meaningful progress.
- CoT may be inefficient for simple problems.
- Do not expect a perfect answer on the first try; improve iteratively.
