# 内容依据与待补信息

整理日期：2026-09-19。

## 来源

- 用户提供的 `CV-ZihanLi-20260915.docx`。主页介绍、教育、荣誉、学术服务、专利及全部论文初始列表以该简历为准。
- [Google Scholar](https://scholar.google.com/citations?user=HUPJftsAAAAJ)：已设置入口；本次无法直接读取 Scholar 页面，因此未声称论文列表已与 Scholar 完整同步，也未填入引用数、h-index 等指标。
- 英文主页中的研究介绍依据简历进行压缩和改写；没有添加未经提供的任职经历或研究成果。
- 公开版 `cv.html` 从上述资料整理，提供邮箱与单位，不包含原始 Word 文件、电话和街道地址。原 Word 文件没有被修改。

## 论文处理

已展示 7 篇期刊论文、4 篇会议／工作坊论文、16 条会议摘要及 7 项在审／投稿／大修稿件。论文、摘要与在审稿件分别分组。All 按钮显示的是全部展示条目数，不能解读为已发表论文数。首页以独立分类显示 7 篇期刊论文、4 篇会议／工作坊论文、16 条会议摘要和 12 项荣誉记录，均从页面内容计算，不合并成“已发表论文总数”。

News 使用已核对的线上发表或期刊卷期日期，不将它们写成录用日期。具体日期为 Self2Self-AM 2026-09-09、MicroKAN 卷期 2026-08-15、Noise2Average 2026-02-18、DIMOND 2024-04-18。未虚构用户的活动或获奖月份。布局参考 https://arktis2022.github.io/，未使用参考站作者的头像、履历或个人动态。

以下条目的论文入口已通过论文页面或官方索引核对：

| 论文 | 链接 |
| --- | --- |
| Improving the accessibility… | [NeuroImage, 2026](https://www.sciencedirect.com/science/article/pii/S1053811926005252) |
| MicroKAN | [NeuroImage, 2026](https://www.sciencedirect.com/science/article/pii/S1053811926003472) |
| Noise2Average | [正式论文的机构存档](https://ora.ox.ac.uk/objects/uuid%3A2035a9c7-5ede-4228-8007-c597b438d6a6) |
| DIMOND | [Advanced Science, 2024](https://doi.org/10.1002/advs.202307965) |
| Effects of diffusion MRI spatial resolution… | [PubMed](https://pubmed.ncbi.nlm.nih.gov/41585466/) |
| Toward Clinical Applications… | [PubMed](https://pubmed.ncbi.nlm.nih.gov/41037550/) |
| Validation of deep learning techniques… | [全文](https://pmc.ncbi.nlm.nih.gov/articles/PMC10440596/) |

MicroKAN 的代码入口来自论文页面。没有为无法确认的条目生成猜测的 DOI、PDF 或代码地址。

## 待补信息和格式说明

1. **Nature Communications 超声机器人论文**：简历未写年份、DOI 或发表状态。目前保留在 `contents/publications.md` 的 `MANUSCRIPTS — DETAILS TO CONFIRM` 分组中，标记为 `HIDDEN`，主页和公开 CV 不展示。明确状态后，可移入期刊论文或在审稿件分组，并填写年份／链接。`HIDDEN` 仅控制页面展示，源文件本身仍会随公开仓库上传。
2. **GCM-Net**：简历标注 MICCAI Poster，但未注明年份。保留原有归类和 Poster 标记，年份留空，未推定年份或添加正式出版信息。
3. **同名缩写**：已核对的主要期刊论文区分 Zihan Li 与 Ziyu Li。未能消歧的多处 `Li Z` 保留简历原缩写，不同时加粗。`name_aliases` 仅包含 `Zihan Li`，不要添加 `Li Z`，否则可能错误高亮合作者。
4. **共一／通讯标记**：保留简历提供的 `#`、`*` 标记。First / co-first author 筛选依据明确的 Zihan Li 姓名和共一标记生成。
5. **在审状态**：沿用 2026-09-15 简历中的 Under Review、Submitted、Major Revision；更新时请自行改为当前状态，不将投稿期刊名称视为录用证明。
6. **Toward Clinical Applications… 年份**：简历写 2025；官方索引已列出 2026 年第 19 卷。主页仍保留简历的 2025 年口径。正式引用时请以出版商导出的最终记录为准。
7. **作者列表及 BibTeX**：部分合作论文沿用简历的缩写或省略作者列表。不为省略了作者的条目提供 BibTeX。其余 BibTeX 提供基础字段，投稿时建议通过 DOI 从出版商导出完整引用记录。
8. **头像和中文姓名**：原简历未包含头像或中文姓名，页面未擅自生成或猜测。可以在 `contents/config.yml` 中补充 `photo`、`name_secondary`。
9. **公开 CV**：`cv.html` 是独立快照；后续修改 Markdown 时需同步更新该文件。
