# Zihan Li — Academic Homepage

基于 [academic-homepage-openreview](https://github.com/Arktis2022/academic-homepage-openreview) 定制的学术个人主页。保留原模板的 OpenReview 风格，无需 npm、构建工具或服务器后端，可直接部署到 GitHub Pages。

## 预览

在本目录打开 PowerShell，运行：

```powershell
powershell -ExecutionPolicy Bypass -File .\preview.ps1
```

随后打开 <http://localhost:8000>。保持终端开启，结束时按 `Ctrl+C`。不要直接双击 `index.html`，浏览器会阻止读取 Markdown 内容。

## 上传 GitHub

完整中文说明见 [GITHUB-PAGES.md](docs/GITHUB-PAGES.md)。最简单的方法：创建 `你的用户名.github.io` 公共仓库，把文件包**解压后的内容**上传至仓库根目录，然后在 Settings → Pages 中选择 Deploy from a branch、`main`、`/ (root)`。

## 日常更新

| 文件 | 内容 |
| --- | --- |
| `contents/config.yml` | 姓名、机构、联系方式、导航、Scholar 链接 |
| `contents/home.md` | 简介 |
| `contents/news.md` | 最新动态，按日期倒序排列 |
| `contents/publications.md` | 论文、摘要、投稿状态、论文链接、BibTeX |
| `contents/education.md` | 教育经历 |
| `contents/awards.md` | 荣誉奖励 |
| `contents/service.md` | 学术服务 |
| `contents/patents.md` | 专利 |
| `cv.html` | 独立公开版简历，支持打印／保存 PDF |
| `static/css/personal.css` | 在原模板基础上的布局及手机端补充样式 |

主页内容更新后，如需同步公开版简历，请同时编辑 `cv.html`；该文件是独立静态快照，不会自动同步。

当前布局进一步参考 [Arktis2022 的实际主页](https://arktis2022.github.io/)：紧凑个人简介、研究方向文字、红色分类统计、News 时间线及滚动论文列表。研究方向已并入 `contents/home.md`；`contents/research.md` 留作早期文字备份，不参与页面渲染。

本地资料填写页位于 `.local/profile-form.html`。启动预览后可打开 `http://localhost:8000/.local/profile-form.html`，填写后复制回对话；该页不随上传文件包发布，也不会直接修改网站。

资料依据为 2026-09-15 简历和能够访问的论文页面。数据处理说明及待补信息见 [CONTENT-NOTES.md](docs/CONTENT-NOTES.md)。

## 模板与许可

上游模板：[Arktis2022/academic-homepage-openreview](https://github.com/Arktis2022/academic-homepage-openreview)，采用版本 `6ff8f25e6bfce91b488ac3988df7f2128f303b44`。保留原 MIT [LICENSE](LICENSE) 和代码中的版权说明。本网站不隶属于 OpenReview。
