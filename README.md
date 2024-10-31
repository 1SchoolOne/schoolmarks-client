# SchoolMarks

A React application built with Vite for managing school marks and academic performance.

## Prerequisites

### System Requirements

- Node.js (v20.17.0 or higher)
- Yarn package manager

### IDE Recommendations

> [!NOTE]
> For the best development experience:
>
> - Install ESLint and Prettier extensions for your IDE
> - Using VS Code? Highly recommended to use the dev container for a pre-configured environment

## Getting Started

### 1. Clone the Repository

```bash
git clone git@github.com:1SchoolOne/schoolmarks-client.git
cd schoolmakrs-client
```

### 2. Setup Project

The project includes a Makefile to help you set up the development environment quickly:

```bash
make setup
```

This command will:

- Check system dependencies
- Install project dependencies
- Set up git hooks

### Available Make Commands

| Command              | Description                                             |
| -------------------- | ------------------------------------------------------- |
| `make setup`         | Complete project setup (install dependencies and hooks) |
| `make install-hooks` | Install git hooks only                                  |
| `make install-deps`  | Install node dependencies only                          |
| `make clean`         | Remove all installed dependencies and hooks             |
| `make help`          | Show available make commands                            |

### Development

#### Running the Application

```bash
yarn dev
```

#### Building for Production

```bash
yarn build
```

#### Linting

```bash
yarn lint:check # Check for linting errors
```

```bash
yarn lint:fix # Check for linting errors and fix them when possible
```

#### Formatting

```bash
yarn format:check # Check for formatting errors
```

```bash
yarn format:fix # Check for formatting errors and fix them when possible
```

### Commit Guidelines

This project uses Commitizen for standardized commit messages. After setup, simply use `git commit` and follow the prompts.

## Project Structure

- `src/`: Main source code
- `public/`: Static assets
- `.githooks/`: Custom git hooks
- `node_modules/`: Dependency directory (git-ignored)

## Troubleshooting

### Node.js Version

Ensure you're using Node.js v20.17.0 or higher. If you encounter version-related issues:

- Use a version manager like `nvm`
- Update Node.js to the recommended version

### Dependency Issues

If you face problems with dependencies:

```bash
make clean-deps
make install-deps
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feat/AmazingFeature`)
3. Commit your changes (`git commit`)
4. Push to the branch (`git push origin feat/AmazingFeature`)
5. Open a Pull Request
