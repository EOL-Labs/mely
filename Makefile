test:
	@node node_modules/lab/bin/lab -v -c -e test_travis
test-local:
	@node node_modules/lab/bin/lab -v -c

.PHONY: test