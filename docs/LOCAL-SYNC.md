# 本地编辑与 GitHub 同步

固定工作目录：`C:\Users\85388\Documents\ChatGPT\个人主页`

- GitHub 仓库：https://github.com/Lthinker/zihanli.github.io
- 默认分支：`main`，跟踪 `origin/main`
- 网站地址：https://lthinker.github.io/zihanli.github.io/
- Pages 设置：Deploy from a branch → main → / (root)

以后继续在这个 Codex 项目里提出修改即可，例如：

> 把这篇论文加入主页并同步公开简历，检查之后推送到 GitHub。

> 把简介的研究重点改成……，直接发布。

默认流程为：检查本地状态 → 拉取远程更新 → 修改 → 验证 → 提交 → 推送 → 检查部署。这个约定已写入项目根目录的 `AGENTS.md`，后续处理本项目时可读取。

如需只预览不发布，请明确说“先在本地修改，不要 push”。本地目录不会在后台自动同步；每次编辑任务执行上述流程时才同步。

## 手动操作

```powershell
Set-Location -LiteralPath 'C:\Users\85388\Documents\ChatGPT\个人主页'
git status
git pull --ff-only
# 修改需要调整的文件，然后检查改动
git diff
git add contents/config.yml contents/home.md
git commit -m "Update profile"
git push origin main
```

`git add` 后的路径按本次修改替换。如果有尚未提交的改动，先保留并处理，不要用强制重置覆盖。如果远程和本地各有新提交，需要先合并或变基，再推送。

## 登录

Git 使用 Windows Git Credential Manager 保存的 GitHub 登录。如果推送提示登录，按浏览器登录 GitHub 并授权即可；不要把密码或访问令牌贴进对话。认证成功后，同一电脑一般可继续直接推送。

## 目录结构

```text
个人主页/
  .git/           Git 版本历史及同步配置
  .nojekyll       静态网站标记
  index.html     网站入口
  contents/      个人资料、论文和新闻
  static/        样式、脚本和图片
  cv.html        公开版简历
  .local/        本地备份和检查结果，不上传
```

GitHub 上传网页不再作为日常维护方式，也不需要再解压文件包后重复上传整个文件夹。
