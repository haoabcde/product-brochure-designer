# Fact policy

Use provided product files as the source of project commitments. Official public background may describe an institution or brand, but never proves that a visitor can enter a space, receive a course, use a facility, meet a person, or obtain a certificate.

When a public fact is missing, write `【待确认】` in the output copy. Do not place costs, margins, channel prices, supplier contacts, internal notes, or private arrangements in client-facing output.

## Fields treated as internal

Keys or values matching the pattern `(成本|分销|渠道|结算|利润|内部|底价|supplier|margin|cost|wholesale|internal)` are stripped during normalization. Examples that must stay out of the deck:

- cost, margin, wholesale price, supplier contact
- 成本、底价、内部结算、渠道返点
- unverified partnership, guaranteed outcome, official endorsement without evidence

## Using derived value

Derived education or product value may be used only as a non-guaranteed benefit, and should be phrased cautiously (e.g., “有助于…”“可作为…参考”).

## Marking gaps

Required facts `name` and `description` are automatically replaced with `【待确认】` when empty. Any other field the team cannot confirm should also be marked `【待确认】` in the product file rather than invented.
