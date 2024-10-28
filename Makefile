HOOKS_DIR = .git/hooks
HOOKS_SOURCE = .githooks
NODE_MODULES = node_modules
LOCK_FILE = yarn.lock
REQUIRED_NODE_VERSION = 20.17.0

# Colors for output (using echo)
BLUE := $(shell echo "\033[34m")
GREEN := $(shell echo "\033[32m")
YELLOW := $(shell echo "\033[33m")
RESET := $(shell echo "\033[0m")

# Helper function to compare versions
define semver_check
$(shell printf '%s\n%s\n' "$(1)" "$(2)" | sort -V | head -n 1)
endef

.PHONY: all
all: setup

.PHONY: setup
setup: check-deps install-deps install-hooks
	@echo "$(GREEN)✓ Setup completed successfully!$(RESET)"
	@echo "$(BLUE)You can now use git commit normally - Commitizen will guide you through the commit message$(RESET)"

.PHONY: check-deps
check-deps:
	@echo "Checking system dependencies..."
	@which node > /dev/null || (echo "NodeJS is required but not installed. Please install NodeJS first." && exit 1)
	@which yarn > /dev/null || (echo "Yarn is required but not installed. Please install Yarn first: npm install -g yarn" && exit 1)
	@# Check Node.js version
	@CURRENT_NODE_VERSION=$$(node -v | cut -c2-); \
	if [ "$(call semver_check,$${CURRENT_NODE_VERSION},$(REQUIRED_NODE_VERSION))" = "$(REQUIRED_NODE_VERSION)" ]; then \
		echo "$(GREEN)✓ Your Node.js version $${CURRENT_NODE_VERSION} meets minimum requirement ($(REQUIRED_NODE_VERSION))$(RESET)"; \
	else \
		echo "$(YELLOW)⚠ Warning: Your Node.js version $${CURRENT_NODE_VERSION} is lower than required version $(REQUIRED_NODE_VERSION)$(RESET)"; \
		echo "$(YELLOW)  You might encounter issues. Consider upgrading Node.js.$(RESET)"; \
	fi

.PHONY: install-deps
install-deps:
	@echo "Installing yarn dependencies..."
	@if [ ! -d "$(NODE_MODULES)" ] || [ ! -f "$(LOCK_FILE)" ]; then \
		yarn install; \
	fi
	@echo "$(GREEN)✓ Dependencies installed successfully$(RESET)"

.PHONY: install-hooks
install-hooks:
	@echo "Installing git hooks..."
	@for hook in $(HOOKS_SOURCE)/*; do \
		if [ -f "$$hook" ]; then \
			chmod +x "$$hook"; \
			hook_name=$$(basename "$$hook"); \
			ln -sf "../../$$hook" "$(HOOK_DIR)/$$hook_name"; \
			echo "$(GREEN)✓ Installed hook: $$hook_name$(RESET)"; \
		fi \
	done

# Clean up everything
.PHONY: clean
clean: clean-hooks clean-deps
	@echo "$(GREEN)✓ Clean up completed$(RESET)"

# Clean up hooks
.PHONY: clean-hooks
clean-hooks:
	@echo "Cleaning up git hooks..."
	@rm -f $(HOOK_DIR)/prepare-commit-msg
	@echo "$(GREEN)✓ Hooks cleaned$(RESET)"

# Clean up dependencies
.PHONY: clean-deps
clean-deps:
	@echo "Cleaning up dependencies..."
	@rm -rf $(NODE_MODULES)
	@rm -f $(YARN_LOCK)
	@echo "$(GREEN)✓ Dependencies cleaned$(RESET)"

# Show help
.PHONY: help
help:
	@echo "Available targets:"
	@echo "  setup         - Complete setup (install dependencies and hooks)"
	@echo "  install-hooks - Install git hooks only"
	@echo "  install-deps  - Install node dependencies only"
	@echo "  update-deps   - Update all dependencies"
	@echo "  clean        - Remove all installed dependencies and hooks"
	@echo "  clean-hooks  - Remove installed git hooks"
	@echo "  clean-deps   - Remove installed dependencies"
	@echo "  help         - Show this help message"
