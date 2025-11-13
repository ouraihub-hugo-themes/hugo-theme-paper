# Hugo Paper Theme - Configuration Directory

This directory contains the default configuration for the Hugo Paper theme development environment.

## Configuration Structure

Hugo supports splitting configuration into multiple files for better organization. This is the recommended approach for complex themes.

### Configuration Files

- **hugo.toml** - Core Hugo settings (baseURL, content settings, outputs, taxonomies)
- **params.toml** - Theme-specific parameters (description, social links, theme settings)
- **languages.toml** - Multilingual configuration (language definitions)
- **menus.en.toml** - English navigation menu
- **menus.zh.toml** - Chinese navigation menu
- **markup.toml** - Markdown rendering configuration (Goldmark, syntax highlighting)

## File Organization Benefits

1. **Clarity**: Each file has a specific purpose
2. **Maintainability**: Easier to find and update specific settings
3. **Modularity**: Can override specific files in different environments
4. **Version Control**: Smaller, focused commits

## Configuration Priority

Hugo loads configuration in this order (later overrides earlier):

1. `config/_default/` - Default configuration (this directory)
2. `config/production/` - Production-specific overrides
3. `config/development/` - Development-specific overrides
4. `hugo.toml` in project root - Legacy single-file config (deprecated for this theme)

## Usage

### Theme Development

The configuration in this directory is used when developing the theme:

```bash
cd hugo-theme-paper
hugo server
```

### User Sites

Users should NOT modify these files directly. Instead, they should:

1. Use the `exampleSite/` as a starting point
2. Create their own `config/_default/` directory
3. Override only the settings they need to change

## Migration from Root hugo.toml

The root `hugo.toml` file is kept for backward compatibility but should be considered deprecated. All new configuration should be added to the appropriate file in this directory.

### What to Put Where

**hugo.toml**:
- baseURL
- title
- languageCode
- Content directories
- Pagination settings
- Taxonomies
- Output formats

**params.toml**:
- Theme-specific settings
- Social links
- Feature toggles
- Custom parameters

**languages.toml**:
- Language definitions
- Language-specific titles
- Content directories per language

**menus.{lang}.toml**:
- Navigation menu items
- Menu weights and URLs

**markup.toml**:
- Markdown rendering options
- Syntax highlighting settings
- Goldmark configuration

## Best Practices

1. **Keep it DRY**: Don't repeat configuration across files
2. **Use Comments**: Document non-obvious settings
3. **Group Related Settings**: Keep related configuration together
4. **Use Defaults**: Only override what you need to change
5. **Test Changes**: Always test configuration changes locally

## References

- [Hugo Configuration Documentation](https://gohugo.io/getting-started/configuration/)
- [Hugo Configuration Directory](https://gohugo.io/getting-started/configuration/#configuration-directory)
- [Hugo Multilingual Mode](https://gohugo.io/content-management/multilingual/)
