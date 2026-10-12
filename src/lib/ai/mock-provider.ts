import { AIProvider, ChatMessage, ChatOptions, ChatCompletionResponse, DocumentGenerationOptions, DocumentGenerationResponse } from "@/types/ai";
import { countChatTokens } from "./token-counter";
import { estimateTokens } from "../utils";

export class MockAIProvider implements AIProvider {
  name = "mock" as const;

  async chat(messages: ChatMessage[], options?: ChatOptions): Promise<ChatCompletionResponse> {
    const lastUserMessage = [...messages].reverse().find((m) => m.role === "user")?.content || "";
    const inputTokens = countChatTokens(messages, options?.systemPrompt);

    // Minimal realistic delay (150ms) — fast enough to not feel laggy
    await new Promise((resolve) => setTimeout(resolve, 150));

    let responseContent = "";
    const lower = lastUserMessage.toLowerCase();

    if (lower.includes("pricing") || lower.includes("price") || lower.includes("cost")) {
      responseContent = `### Strategic Pricing Framework & Recommendations

Based on your inquiry, here is a structured evaluation of the monetization options:

1. **Value-Based Tiering**:
   - Align prices with customer ROI rather than simple feature counts.
   - Introduce usage hurdles (e.g., active team members, automated workflow credits).

2. **Benchmarking & Elasticity**:
   - **Starter**: Low barrier entry for individual professionals ($19 - $29/mo).
   - **Growth / Pro**: Core workspace features with generous compute thresholds ($49 - $99/mo).
   - **Enterprise**: Custom governance, dedicated SLAs, and private data retention.

3. **Key Next Steps**:
   - Run cohort sensitivity tests on churn rates before grandfathering existing users.
   - Monitor average revenue per user (ARPU) and customer acquisition cost (CAC) payback periods.`;
    } else if (lower.includes("code") || lower.includes("function") || lower.includes("api")) {
      responseContent = `### Implementation Strategy & Code Architecture

Here is the recommended production architecture for your requirement:

\`\`\`typescript
// Safe, strongly-typed handler with error boundaries
import { NextResponse } from 'next/server';
import { z } from 'zod';

const RequestSchema = z.object({
  payload: z.string().min(1),
  tenantId: z.string().uuid(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validated = RequestSchema.parse(body);
    
    // Process business logic deterministically
    return NextResponse.json({ success: true, data: validated });
  } catch (err) {
    return NextResponse.json({ error: 'Validation failed' }, { status: 400 });
  }
}
\`\`\`

#### Architectural Highlights:
- **Strict schema validation**: Mitigates malicious inputs before database writes.
- **Explicit error boundary**: Protects against stack trace leakage in production.`;
    } else {
      responseContent = `### Executive Summary & Analysis

Thank you for your inquiry: **"${lastUserMessage.slice(0, 80)}${lastUserMessage.length > 80 ? '...' : ''}"**.

#### Core Strategic Dimensions:
1. **Operational Efficiency**: Streamline redundant workflows and replace manual data preparation with automated verification pipelines.
2. **Quality & Consistency**: Standardize company templates and documentation to reduce communication friction across leadership.
3. **Execution Velocity**: Prioritize high-impact deliverables that directly reduce customer onboarding latency and accelerate time-to-value.

#### Recommended Action Plan:
- [ ] Define measurable success metrics (KPIs) for the current cycle.
- [ ] Align cross-functional stakeholder milestones and resource capacity.
- [ ] Schedule bi-weekly review intervals to inspect progress and adjust strategy.

*Would you like me to generate a tailored business proposal, executive report, or project breakdown based on this?*`;
    }

    const outputTokens = estimateTokens(responseContent);

    return {
      content: responseContent,
      model: options?.model || "kavro-core-simulated",
      provider: "mock",
      inputTokens,
      outputTokens,
      finishReason: "stop",
    };
  }

  async generateDocument(options: DocumentGenerationOptions): Promise<DocumentGenerationResponse> {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const { templateType, topic, keyPoints, audience, tone } = options;
    let title = "";
    let content = "";

    const pointsList = keyPoints.map((p) => `- ${p}`).join("\n");

    switch (templateType) {
      case "email":
        title = `Email: ${topic}`;
        content = `Subject: Strategic Update: ${topic}

Dear ${audience || "Colleague / Partner"},

I hope this message finds you well.

I am writing regarding **${topic}**. To ensure complete transparency and timely alignment, I wanted to outline our key points and next steps:

${pointsList}

Please let me know if you have any questions or require additional details. I welcome your thoughts and suggest we confirm our path forward before the end of the week.

Best regards,

**KAVRO Executive Team**  
*Operations & Strategy*`;
        break;

      case "proposal":
        title = `Business Proposal: ${topic}`;
        content = `# Commercial Proposal: ${topic}

**Prepared for**: ${audience || "Valued Client / Enterprise Partner"}  
**Prepared by**: KAVRO Solutions  
**Tone & Mandate**: ${tone || "Professional"} execution

---

## 1. Executive Summary
This proposal outlines our strategic engagement for **${topic}**. Our objective is to deliver measurable performance improvements, streamline processes, and unlock scalable enterprise value.

## 2. Problem Statement & Opportunity
In today's fast-moving operating environment, organizations face compounding operational complexity. The current challenge requires a structured intervention to mitigate risk and capture untapped efficiency.

## 3. Scope of Work & Deliverables
The project will focus on the following key core initiatives:
${pointsList}

## 4. Implementation Timeline & Milestones
- **Phase 1 (Discovery & Architecture)**: Weeks 1–2
- **Phase 2 (Implementation & Integration)**: Weeks 3–6
- **Phase 3 (Validation & User Onboarding)**: Weeks 7–8

## 5. Commercial Terms & Investment
Investment terms are scoped to ensure high ROI with milestone-based delivery guarantees.

## 6. Next Steps
Upon review, we will finalize governance terms and initiate kick-off meetings.`;
        break;

      case "report":
        title = `Executive Report: ${topic}`;
        content = `# Executive Strategic Report: ${topic}

**Audience**: ${audience || "Senior Leadership & Board"}  
**Status**: Comprehensive Review  
**Date**: ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}

---

## Executive Summary
This report analyzes **${topic}** with an emphasis on data-driven conclusions, operational performance, and strategic foresight.

## Strategic Findings & Insights
${pointsList}

## Risk Assessment Matrix
- **Operational Risk**: Low to moderate; mitigated through phased deployment.
- **Market Dynamics**: Requires ongoing vigilance regarding industry pricing shifts.
- **Resource Allocation**: High-priority allocation recommended for critical milestones.

## Recommended Strategic Initiatives
1. Implement real-time monitoring and reporting dashboards.
2. Establish formal stakeholder check-ins on a bi-weekly cadence.
3. Reallocate budget reserves toward primary growth drivers.`;
        break;

      case "meeting":
        title = `Meeting Summary: ${topic}`;
        content = `# Executive Meeting Summary: ${topic}

**Topic**: ${topic}  
**Stakeholders**: ${audience || "Core Strategy & Operations Team"}  
**Session Type**: Strategic Review  

---

## 1. Meeting Objectives
Review key updates, establish alignment, and identify immediate blockers regarding **${topic}**.

## 2. Key Discussions & Decisions
${pointsList}

## 3. Action Items & Accountability Matrix
| Task | Owner | Due Date | Status |
| :--- | :--- | :--- | :--- |
| Finalize implementation specifications | Engineering Lead | Friday | Pending |
| Review budget variance and allocation | Finance / Ops | Monday | In Progress |
| Distribute summary to executive team | Project Manager | Immediate | Completed |

## 4. Open Questions & Follow-Up
- Confirm vendor SLA thresholds by next sync.
- Next recurring meeting scheduled for next Tuesday at 10:00 AM.`;
        break;

      case "plan":
        title = `Project Plan: ${topic}`;
        content = `# Enterprise Project Plan: ${topic}

**Project Director**: Executive Management  
**Target Delivery Window**: 8–12 Weeks  
**Primary Beneficiaries**: ${audience || "Enterprise Stakeholders"}  

---

## 1. Project Objectives
Deliver end-to-end execution of **${topic}** with zero operational downtime and high stakeholder satisfaction.

## 2. Core Pillars & Work Breakdown
${pointsList}

## 3. Work Phases
### Phase I — Initiation & Alignment (Sprint 1-2)
- Requirements freeze and security validation
- Environment provisioning and architectural sign-off

### Phase II — Core Build & Execution (Sprint 3-5)
- Feature implementation and iterative sprint reviews
- Automated testing and documentation coverage

### Phase III — Rollout & Change Management (Sprint 6)
- User training, staged release, and telemetry monitoring

## 4. Governance & Success Criteria
Success will be measured against sprint velocity, test coverage (>90%), and stakeholder adoption rates within 30 days of launch.`;
        break;
    }

    const inputTokens = estimateTokens(`${topic} ${keyPoints.join(" ")} ${options.customInstructions || ""}`);
    const outputTokens = estimateTokens(content);

    return {
      title,
      content,
      templateType,
      provider: "mock",
      model: "kavro-core-doc-gen",
      inputTokens,
      outputTokens,
    };
  }
}
