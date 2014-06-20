test:
	@if [ "$(NODE_ENV)" = "" ]; then NODE_ENV=test ./node_modules/.bin/mocha --reporter nyan; else ./node_modules/.bin/mocha --reporter nyan; fi
install:
	npm install .
.PHONY: test