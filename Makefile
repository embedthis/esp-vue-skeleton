#
#   Makefile - Top level Makefile
#
#	make configure		# First time configuration
# 	make [run]			# Run Appweb serving the client application and the backend API (combined)
#
#

PATH 	:= $(PWD)/ui/node_modules/.bin:$(PATH)
export  PATH

.PHONY: prereq configure build clean run

all: run

prereq:
	@[ "`type esp 2>/dev/null`" = "" ] && echo "Cannot find ESP. Please install esp from embedthis.com first" ; true
	@[ "`type npm 2>/dev/null`" = "" ] && echo "Cannot find npm. Please install npm from npm.org first" ; true

#
#   First time only build configuration
#
configure: prereq
	[ "$(which vue)" = "" ] && npm install vue -g ; true
	[ "$(which npm)" = "" ] && npm install @vue/cli -g ; true
	cd ui ; npm install
	@[ "`type vue-cli-service 2>/dev/null`" = "" ] && \
		echo "Cannot find vue-cli-service. PATH not setup correctly. See .cdrc" ; true

build:
	cd ui ; vue-cli-service --mode development build

run: run-server
	cd ui ; vue-cli-service serve

run-server:
	@(killall esp ; sleep 1) >/dev/null 2>&1 || true
	esp &

clean:
	rm -fr ui/dist
	esp clean
