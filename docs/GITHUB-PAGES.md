# 上传并发布到 GitHub Pages

本网站是纯静态网站，上传即可使用。当前账号为 `Lthinker`，仓库为 `zihanli.github.io`，公开地址为 https://lthinker.github.io/zihanli.github.io/ 。本地目录已连接此仓库，日常更新使用 [Git 同步流程](LOCAL-SYNC.md)，无需重复网页上传。以下通用建站说明中的 `YOUR_USERNAME` 指 GitHub 用户名，不是昵称或邮箱。

## 方法一：网页上传，不用命令行

1. 登录 [GitHub](https://github.com)，点击右上角 **+ → New repository**。
2. Repository name 填写 `YOUR_USERNAME.github.io`。例如用户名是 `zihanli`，仓库就叫 `zihanli.github.io`。选择 **Public**，可勾选 Add a README file，点击 **Create repository**。如果同名仓库已经存在，应更新原仓库；不要覆盖其中仍需保留的文件。
3. 解压本次生成的 `homepage-upload.zip`。在仓库中点击 **Add file → Upload files**（空仓库也可点击 **uploading an existing file**）。
4. 将解压后最外层的文件和文件夹拖进去：`index.html`、`cv.html`、`contents`、`static`、`docs`、`LICENSE`、`README.md`、`preview.ps1` 等。**不要直接上传 ZIP，也不要把整个外层目录作为额外一层上传。** 上传后仓库首页必须能直接看到 `index.html`。
5. 在上传页面点击 **Commit changes**，提交到 `main` 分支。
6. 进入仓库 **Settings → Pages → Build and deployment**：Source 选择 **Deploy from a branch**，Branch 选择 **main**，Folder 选择 **/ (root)**，点击 **Save**。如果实际默认分支名不同，选择装有网页文件的那个分支。
7. 等待发布任务完成，通常几分钟，官方说明可能需要约 10 分钟。在 **Actions** 可查看构建结果，在 **Settings → Pages → Visit site** 打开网址。

最终网址是：`https://YOUR_USERNAME.github.io/`。

文件包包含 `.nojekyll`，用于直接发布静态文件。若浏览器上传时漏掉该隐藏文件，可在 GitHub 中 **Add file → Create new file**，文件名填 `.nojekyll`，内容填一行 `# Static site` 后提交。缺少它通常也能显示本网站，但建议保留。

如果仓库取名为 `academic-homepage`，网址则是 `https://YOUR_USERNAME.github.io/academic-homepage/`。本网站使用相对路径，两种仓库形式均已检查。

## 方法二：使用 Git 推送

适用于本地已安装 Git 的情况。先在 GitHub 创建一个公共空仓库 `YOUR_USERNAME.github.io`，**这一路径不要添加 README、License 或 .gitignore**，以免首次推送时出现历史冲突。

在项目目录打开 PowerShell，逐行执行以下命令。先将 `YOUR_USERNAME` 换成你的实际用户名：

```powershell
Set-Location -LiteralPath 'C:\Users\85388\Documents\ChatGPT\个人主页'
git status
git add .
git commit -m "Create Zihan Li academic homepage"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_USERNAME.github.io.git
git push -u origin main
```

这个目录已经初始化 Git，不需要重新 `git init`。`.gitignore` 已排除临时模板、测试输出和上传压缩包。

若 `git commit` 提示缺少身份信息，按 Git 的提示配置自己的用户名和提交邮箱后重试；邮箱可使用 GitHub Settings → Emails 中的 noreply 邮箱。如果 `origin` 已存在，先用 `git remote -v` 检查地址是否正确，不要直接覆盖未知远程仓库。登录时按照 Git 凭据管理器的浏览器提示操作；若提示令牌，应使用 GitHub personal access token，不能用账号密码替代。

推送后仍需按方法一的第 6 步开启 Pages。以后修改内容后执行：

```powershell
git add .
git commit -m "Update homepage"
git push
```

## 常见问题

- **404**：确认 Pages 已启用，分支／根目录选对，`index.html` 位于仓库根目录，Actions 中的部署任务成功。
- **有外框、没有文字**：确认 `contents` 文件夹也上传了，文件名大小写未改动。不能通过双击本地 HTML 文件来预览。
- **更新没有显示**：等待部署完成后按 `Ctrl+Shift+R` 强制刷新。
- **没有头像**：简历未包含照片，因此当前采用无头像版式。以后将照片放到 `static/assets/img/`，并在 `contents/config.yml` 的 `profile.photo` 填入相对路径，例如 `static/assets/img/zihan.jpg`。
- **想添加 GitHub 链接**：在 `contents/config.yml` 的 `links` 下加一项 `- { label: "GitHub", url: "https://github.com/YOUR_USERNAME", icon: github }`。
- **需要 PDF 简历**：点击主页的 Curriculum Vitae，再点击 Print / Save as PDF；在打印对话框中选择保存 PDF。

参考：[GitHub 官方建站说明](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)、[配置发布来源](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)。
