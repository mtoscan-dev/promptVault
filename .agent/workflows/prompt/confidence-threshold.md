---
description: Confidence Threshold technique prevents LLM hallucinations and explicitly evaluates the reliability of responses.
---

This workflow is a metacognitive approach that allows for the LLM to **recognize and evaluate its own knowledge boundaries**, asking it to respond only when it has a certain level of confidence or to specify its confidence level.

## 🎯 Application Situations

- Questions where fact-checking is important
- Situations requiring professional advice
- Domains with a high risk of hallucinations
- Requesting information to be used in decision-making

## 🔄 Workflow Process

### Phase 1: Set Clear Thresholds

1. **Define Confidence Criteria**
   ```
   Please answer the following question. However, follow these conditions:
   
   - Answer definitively only if you are over 90% certain.
   - If 70-90% certain, use the expression "High probability that...".
   - If 50-70% certain, use the expression "Maybe" or "Presumably...".
   - If less than 50% certain, preface with "It's not certain, but...".
   - If you don't know, honestly answer "I don't know".
   ```

2. **Utilize Basic Phrases**
   | Phrase | Purpose |
   |--------|---------|
   | "If you know for sure" | Requesting only high-confidence answers |
   | "If you can answer with confidence" | Requesting only confident answers |
   | "If it's a guess, please state it's a guess" | Inducing expressions of uncertainty |

### Phase 2: Request Expressions of Uncertainty

1. **Allow Explicit Uncertainty**
   ```
   Regarding this question:
   - If there are parts you are unsure of, you may say "I don't know".
   - If you only know partially, please distinguish between what you know and what you don't.
   - If the source is uncertain, please specify that.
   ```

2. **Recognizing Knowledge Limits**
   - Information uncertainty after the training data cutoff date
   - Limits of specialized knowledge in specific domains
   - Regional/language-based information differences

### Phase 3: Request Confidence Evaluation

1. **Display Confidence Level**
   ```
   Please display the confidence level along with your answer in the following format:
   
   [Answer Content]
   
   ---
   📊 Confidence Evaluation:
   - Overall Confidence: [1-10 Score] / 10
   - Information Source Certainty: [High/Medium/Low]
   - Recency: [Confirmed/Unverified/Possible outdated information]
   - Further Verification Recommended: [Yes/No]
   ```

2. **Categorize Confidence by Area**
   | Area | Confidence | Reason |
   |------|------------|--------|
   | Basic Concepts | High | Generally known information |
   | Recent Trends | Low | Possible changes after training data cutoff |
   | Specific Cases | Medium | May vary depending on individual situations |

### Phase 4: Multi-Profile Cross-Verification

1. **Compare Responses by Role**
   ```
   Please answer the following question from three different perspectives:
   
   1. As an expert in the field
   2. As a critical reviewer
   3. From a beginner's perspective
   
   Summarize the consistent and differing parts of each perspective's answer, and evaluate the final confidence through cross-verification.
   ```

2. **Discrepancy Analysis**
   - Commonalities in answers across perspectives = High confidence
   - Differences in answers across perspectives = Additional verification needed

## 💡 Prompt Template

### Basic Template
```
Please answer the following question:

[Question]

Please include the following in your answer:
1. Clearly distinguish between certain information and uncertain estimations.
2. Confidence level for each claim (High/Medium/Low).
3. Specify any matters that require verification.
```

### When Requesting Professional Advice
```
This is a question regarding [Professional Field]:

[Question]

- Please answer only what you know for certain.
- Clearly distinguish parts that require guessing or generalization.
- For matters requiring expert confirmation, please mark them as "Expert confirmation recommended".
- If latest information verification is needed, please mention that.
```

### Cross-Verification Template
```
Please verify the accuracy of the following information:

[Information to verify]

1. Evaluate whether this information is factually true.
2. Distinguish between certain and uncertain parts.
3. Present any counter-evidence or differing perspectives.
4. Rate the final confidence score from 1-10.
```

## 📊 Output Format

```markdown
## 📋 Answer

[Answer content]

---

## 📊 Confidence Evaluation

| Item | Evaluation | Description |
|------|------------|-------------|
| Overall Confidence | ⭐⭐⭐⭐☆ (8/10) | [Reason] |
| Information Source | High | [Source type] |
| Recency | Medium | [Reference date information] |
| Expertise Required | Low | [General common sense level] |

### ⚠️ Cautions
- [Uncertain part 1]
- [Uncertain part 2]

### ✅ Confirmed Information
- [Certain information 1]
- [Certain information 2]

### 🔍 Recommended for Further Verification
- [Items requiring expert confirmation]
- [Items requiring latest information verification]
```

## ⚠️ Notes

- Confidence levels are self-evaluations by the model and are not absolute.
- Always perform external verification for important decision-making.
- Since hallucinations cannot be completely prevented, critical information must be double-checked.
