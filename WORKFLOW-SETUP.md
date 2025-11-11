# GitHub Release 工作流设置指南

## 前置要求

为了使自动发布工作流正常工作,需要在主仓库中添加 `RELEASE_REPO_TOKEN` Secret。

## 步骤 1: 创建 Personal Access Token

1. 访问 GitHub Settings: https://github.com/settings/tokens
2. 点击 **"Generate new token"** → **"Generate new token (classic)"**
3. 填写信息:
   - **Token name**: `RELEASE_REPO_TOKEN`
   - **Expiration**: 选择合适的过期时间(如 90 days 或 No expiration)
   - **Select scopes**: 勾选 `repo` (这会自动勾选所有仓库相关权限)

4. 点击 **"Generate token"** 并**立即复制** token 值
   - ⚠️ 离开页面后无法再看到 token

## 步骤 2: 添加 Token 到主仓库 Secrets

1. 访问: https://github.com/ouraihub-hugo-themes/hugo-theme-paper/settings/secrets/actions

2. 点击 **"New repository secret"**

3. 填写:
   - **Name**: `RELEASE_REPO_TOKEN`
   - **Secret**: 粘贴上面复制的 token
   
4. 点击 **"Add secret"**

完成! ✅

## 步骤 3: 验证工作流

现在可以测试发布工作流:

```bash
# 创建版本标签
git tag v0.3.0
git push origin v0.3.0
```

然后访问 https://github.com/ouraihub-hugo-themes/hugo-theme-paper/actions 查看工作流运行情况。

工作流会:
1. 编译 CSS
2. 创建发布包
3. 在主仓库发布 Release
4. **自动同步到 `hugo-theme-paper-dist` 仓库**

## 常见问题

### Q: Token 过期了怎么办?
A: 重新生成一个新 token,按照上面步骤更新 Secret 即可。

### Q: 为什么需要单独的 token?
A: `GITHUB_TOKEN` (GitHub 自动提供) 权限有限,只能访问当前仓库。要访问另一个仓库(`hugo-theme-paper-dist`),需要 Personal Access Token。

### Q: Token 安全吗?
A: 
- 存储在 GitHub Secrets 中,不会在日志中显示
- 只在工作流中使用,不会泄露
- 可以随时删除或轮换

### Q: 如果工作流失败了?
A: 检查 GitHub Actions 日志:
1. 访问: https://github.com/ouraihub-hugo-themes/hugo-theme-paper/actions
2. 找到失败的工作流运行
3. 查看详细日志
4. 常见原因:
   - Token 过期
   - 权限不足
   - 网络问题

## 安全建议

1. **定期轮换 token**: 每 3-6 个月更新一次
2. **最小权限原则**: 只给予必需的权限 (`repo` scope)
3. **监控使用**: 定期检查 token 的使用情况
4. **删除旧 token**: 不再使用的 token 应该删除

## 相关链接

- [GitHub Personal Access Token 文档](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens)
- [GitHub Secrets 文档](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [GitHub Actions 文档](https://docs.github.com/en/actions)
