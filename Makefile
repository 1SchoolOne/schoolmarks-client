HOOKS_DIR = .git/hooks
HOOKS_SOURCE = .githooks
NODE_MODULES = node_modules
LOCK_FILE = yarn.lock
REQUIRED_NODE_VERSION = 20.17.0

# Colors for output (using echo)
BLUE := $(shell echo "\033[34m")
GREEN := $(shell echo "\033[32m")
YELLOW := $(shell echo "\033[33m")
RED := $(shell echo "\033[31m")
RESET := $(shell echo "\033[0m")

# Helper function to compare versions
# Returns: -1 if v1 < v2, 0 if v1 == v2, 1 if v1 > v2
define version_compare
$(shell printf '%s\n%s\n' "$(1)" "$(2)" | sort -V | head -n 1 | grep -q "^$(1)$$" && echo "0" || (printf '%s\n%s\n' "$(1)" "$(2)" | sort -V | head -n 1 | grep -q "^$(2)$$" && echo "-1" || echo "1"))
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
	@CURRENT_NODE_VERSION=$$(node -v | sed 's/^v//'); \
	SORTED_VERSIONS=$$(printf '%s\n%s\n' "$$CURRENT_NODE_VERSION" "$(REQUIRED_NODE_VERSION)" | sort -V); \
	if [ "$$CURRENT_NODE_VERSION" = "$(REQUIRED_NODE_VERSION)" ]; then \
		echo "$(GREEN)✓ Using Node.js version $$CURRENT_NODE_VERSION$(RESET)"; \
	elif echo "$$SORTED_VERSIONS" | head -n1 | grep -q "^$(REQUIRED_NODE_VERSION)$$"; then \
		echo "$(YELLOW)⚠ Warning: Your Node.js version $$CURRENT_NODE_VERSION is higher than required version $(REQUIRED_NODE_VERSION)$(RESET)"; \
		echo "$(YELLOW)  This might work but is not the tested version.$(RESET)"; \
	else \
		echo "$(RED)✗ Error: Your Node.js version $$CURRENT_NODE_VERSION is lower than required version $(REQUIRED_NODE_VERSION)$(RESET)"; \
		echo "$(RED)  Please upgrade Node.js to continue.$(RESET)"; \
		exit 1; \
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
			ln -sf "../../$$hook" "$(HOOKS_DIR)/$$hook_name"; \
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

.PHONY: lint
lint:
	@echo "$(BLUE)Checking code lint...$(RESET)"
	@yarn lint && echo "$(GREEN)Done!$(RESET)"

.PHONY: fix-lint
fix-lint:
	@echo "$(BLUE)Fixing code lint errors...$(RESET)"
	@yarn lint:fix

.PHONY: format
format:
	@yarn format && echo "$(GREEN)Done!$(RESET)"

.PHONY: fix-format
fix-format:
	@echo "$(BLUE)Fixing code formatting errors...$(RESET)"
	@yarn format:fix

.PHONY: test
test:
	@echo "$(BLUE)Running unit tests...$(RESET)"
	@yarn test

.PHONY: build-image
build-image:
	@docker buildx build --platform linux/amd64,linux/arm64 -t schoolmarks-client .

.PHONY: tag-image
tag-image:
	@docker tag schoolmarks-client registry.ilhanyapici.com/schoolmarks/client:$(tag)

.PHONY: push-image
push-image:
	@docker push registry.ilhanyapici.com/schoolmarks/client:$(tag)

# Show help
.PHONY: help
help:
	@echo "Available commands:"
	@echo "  $(BLUE)setup$(RESET)         - Complete setup (install dependencies and hooks)"
	@echo "  $(BLUE)install-hooks$(RESET) - Install git hooks only"
	@echo "  $(BLUE)install-deps$(RESET)  - Install node dependencies only"
	@echo "  $(BLUE)update-deps$(RESET)   - Update all dependencies"
	@echo "  $(BLUE)clean$(RESET)         - Remove all installed dependencies and hooks"
	@echo "  $(BLUE)clean-hooks$(RESET)   - Remove installed git hooks"
	@echo "  $(BLUE)clean-deps$(RESET)    - Remove installed dependencies"
	@echo "  $(BLUE)lint$(RESET)          - Check code linting"
	@echo "  $(BLUE)fix-lint$(RESET)      - Fix code linting errors"
	@echo "  $(BLUE)format$(RESET)        - Check code formatting"
	@echo "  $(BLUE)fix-format$(RESET)    - Fix code formatting errors"
	@echo "  $(BLUE)test$(RESET)          - Run unit tests"
	@echo "  $(BLUE)build-image$(RESET)   - Build Docker image"
	@echo "  $(BLUE)tag-image$(RESET)     - Tag the local image with the right labels"
	@echo "  $(BLUE)push-image$(RESET)    - Push the image to the private registry"
	@echo "  $(BLUE)help$(RESET)          - Show this help message"
