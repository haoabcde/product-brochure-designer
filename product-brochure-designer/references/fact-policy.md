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

## Advertising compliance (宣传合规)

《广告法》对教育、培训、招商等场景的宣传用语有硬性限制。手册文案**禁止**出现：

- 保证性承诺：保过、包过、确保录取/升学/通过、承诺效果、100%、百分百
- 绝对化用语：最好、最优、顶级、第一品牌、国家级（无依据时）、权威认证（无依据时）
- 虚构背书：未经证实的"官方指定""独家合作""名校直通"

替代表达：用可验证的事实代替形容词（"累计服务 3000 名学生"优于"最受欢迎"），用"有助于/可作为参考"代替保证。`scripts/check.mjs` 会对最终 HTML 做敏感词扫描（WARNING 级），命中项需人工逐条确认。
