#
#   Makefile - Top level Makefile
#
#	make configure		# First time configuration
# 	make [run]			# Run Appweb serving the client application and the backend API (combined)
#
#

PATH 	 := $(PWD)/ui/node_modules/.bin:$(PATH)

export   PATH
unexport CDPATH

.PHONY: prereq configure build clean run

ifndef SHOW
.SILENT:
endif

all: run

prereq:
	@echo "      [Info] Use "make SHOW=1" to trace executed commands."
	@[ "`type esp 2>/dev/null`" = "" ] && echo "Cannot find ESP. Please install esp from embedthis.com first" ; true
	@[ "`type npm 2>/dev/null`" = "" ] && echo "Cannot find npm. Please install npm from npm.org first" ; true

#
#   First time only build configuration
#
configure: prereq
	@if [ "$(which vue)" = "" ] ; then echo "   [Install] vue" ; npm install vue -g ; fi
	@if [ "$(which npm)" = "" ] ; then echo "   [Install] vue/cli" ; npm install @vue/cli -g ; fi
	@cd ui ; npm install
	@if [ "`type vue-cli-service 2>/dev/null`" = "" ] ; then \
		echo "Cannot find vue-cli-service. PATH not setup correctly. See .cdrc" ; fi

build:
	@echo "   [Compile] esp compile"
	esp compile
	@echo "     [Build] vue-cli-service --mode development build"
	cd ui ; vue-cli-service --mode development build

run: run-server
	@echo "       [Run] vue-cli-service serve" ;
	cd ui ; vue-cli-service serve

run-server:
	@(killall esp ; sleep 1) >/dev/null 2>&1 || true
	@echo "       [Run] esp &"
	esp &

clean:
	rm -fr ui/dist
	esp clean
