######################################################################################################################################################

# @project        Visual Studio Code Toolbox
# @file           Makefile
# @author         Lucas Brémond <lucas.bremond@gmail.com>
# @license        MIT

######################################################################################################################################################

export project_name := visual-studio-code-toolbox
export project_version := $(shell git describe --tags --always)
export project_directory := $(shell git rev-parse --show-toplevel)

######################################################################################################################################################

package: ## Build extension package

	docker run \
		--volume="${project_directory}:/extension" \
		--workdir=/extension \
		node:14 \
		/bin/bash -c "npm install -g vsce && npm install && vsce package"

deploy: build ## Deploy extension package

	@ echo "TBI"

clean: ## Clean repository

	$(MAKE) clean

reset: ## Reset repository

	git clean -xdf

######################################################################################################################################################

help:

	@grep -E '^[0-9a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

.DEFAULT_GOAL := help

.PHONY: help \
		package deploy \
		clean reset

######################################################################################################################################################
