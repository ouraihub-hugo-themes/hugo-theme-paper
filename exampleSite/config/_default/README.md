# Hugo Paper Example Site - Configuration

This directory contains the configuration for the Hugo Paper example site.

## Configuration Structure

The configuration is split into multiple files for better organization:

- **hugo.toml** - Core Hugo settings
- **params.toml** - Theme parameters
- **languages.toml** - Multilingual configuration
- **menus.en.toml** - English navigation menu
- **menus.zh.toml** - Chinese navigation menu
- **markup.toml** - Markdown rendering configuration

## Usage

### For Theme Development

This example site is used to test and demonstrate the theme features during development.

### For Users

If you want to use this theme for your own site:

1. Copy this `exampleSite` directory as a starting point
2. Modify the configuration files to match your needs
3. Replace the content in `content/` with your own
4. Update `theme` in `hugo.toml` to point to your theme installation

## Configuration Files

### hugo.toml

Core Hugo settings including:
- Site URL and title
- Content settings
- Pagination
- Taxonomies
- Output formats
- Module mounts

### params.toml

Theme-specific parameters including:
- Site description
- Theme settings (light/dark mode)
- Social links
- Edit post links
- Comments configuration (Giscus)
- SEO settings

### languages.toml

Multilingual configuration:
- English (en)
- Chinese (zh)

### menus.{lang}.toml

Navigation menu items for each language.

### markup.toml

Markdown rendering settings:
- Goldmark configuration
- Syntax highlighting

## Customization

### Changing the Theme

Edit `hugo.toml`:

```toml
theme = "your-theme-name"
```

### Adding Social Links

Edit `params.toml`:

```toml
[[social]]
name = "Platform Name"
href = "https://your-url.com"
linkTitle = "Follow us on Platform"
```

### Enabling Comments

Edit `params.toml`:

```toml
[comments]
enable = true
provider = "giscus"
repo = "username/repo"
repoId = "your-repo-id"
# ... other Giscus settings
```

### Adding Menu Items

Edit `menus.en.toml` or `menus.zh.toml`:

```toml
[[main]]
name = "New Page"
url = "/new-page/"
weight = 4
```

## Best Practices

1. **Keep configuration DRY** - Don't repeat settings
2. **Use comments** - Document non-obvious settings
3. **Test changes** - Always test locally before deploying
4. **Version control** - Commit configuration changes

## References

- [Hugo Configuration](https://gohugo.io/getting-started/configuration/)
- [Hugo Multilingual](https://gohugo.io/content-management/multilingual/)
- [Hugo Menus](https://gohugo.io/content-management/menus/)
