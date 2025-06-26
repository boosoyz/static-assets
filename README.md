# 本仓库用于存放网站或项目所需的静态资源文件（如 JavaScript 脚本、CSS 样式、图片等），方便通过 CDN 方式进行访问和调用。

## 资源类型

- **JavaScript 脚本**：例如播放器、交互效果脚本等。
- **CSS 样式**：通用样式文件，方便快速引入。
- **图片资源**：Logo、背景、图标等静态图片。

## CDN 使用示例

你可以直接通过 jsDelivr CDN 引用本仓库资源，示例：

```html
<script src="https://cdn.jsdelivr.net/gh/boosoyz/static-assets/js/music.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/boosoyz/static-assets/css/style.css" />
<img src="https://cdn.jsdelivr.net/gh/boosoyz/static-assets/images/logo.webp" alt="Logo" />
```

请根据实际路径替换 `js/music.js`、`css/style.css`、`images/logo.webp` 等文件名。

## 版本缓存更新

如果修改了资源文件，CDN 可能会缓存旧版本。你可以：

- 通过修改文件名来避免缓存。
- 或者在 URL 后添加版本查询参数：

```html
<script src="https://cdn.jsdelivr.net/gh/boosoyz/static-assets/js/music.js?v=1.0.2"></script>
```

## 注意事项

- 请勿上传敏感或大容量文件，保持仓库整洁。
- 资源文件命名请使用英文和数字，避免特殊字符。
- 资源更新建议通过 Pull Request 进行管理和审查。

感谢使用，如有疑问欢迎提 Issue。
