test:
	@if [ "$(NODE_ENV)" = "" ]; then NODE_ENV=test ./node_modules/.bin/mocha --reporter spec; else ./node_modules/.bin/mocha --reporter spec; fi
install:
	npm install .
.PHONY: test