# Visual Studio Code Toolbox

Toolbox for Visual Studio Code.

## Install

```bash
code --install-extension visual-studio-code-toolbox-{x.y.z}.vsix
```

## Configuration

In your **User Settings**:

```json
{
    "visualStudioCodeToolbox.authorFirstName": "Bob",
    "visualStudioCodeToolbox.authorLastName": "Sponge",
    "visualStudioCodeToolbox.authorEmail": "sponge.bob@google.com"
}
```

*Note: the GUI is available too!*

In your **Project Settings** (`.vscode/settings.json`):

```json
{
    "visualStudioCodeToolbox.projectName": "My Project"
}
```

## Usage

### Insert / Update Header and Footer

Using the **Command Palette**: `Insert Header and Footer`.

Default keyboard shortcuts:

- **macOS** : <kbd>⌘</kbd> + <kbd>⌥</kbd> + <kbd>H</kbd>
- **Linux** / **Windows** : <kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>H</kbd>

*Note: the header is automatically updated on save.*

## File Formatting

## Hash Style

- Shell
- Python

```python
######################################################################################################################################################

# @project        My Group ▸ My Project
# @file           path/to/file.py
# @author         Sponge Bob <sponge.bob@gmail.com>
# @license        MIT

######################################################################################################################################################

...

######################################################################################################################################################
```

## Slash Style

- C
- C++
- JavaScript
- TypeScript

```js
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/// @project        My Group ▸ My Project
/// @file           path/to/file.cpp
/// @author         Sponge Bob <sponge.bob@gmail.com>
/// @license        MIT

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

...

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
```

## Build

To build the extension package:

```bash
make package
```

## References

- [vscode-42header](https://github.com/kube/vscode-42header)
