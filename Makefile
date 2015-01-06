test:
	@node node_modules/lab/bin/lab -v -c -t 98 -e test_travis
test-local:
	@node node_modules/lab/bin/lab -v -c -t 98

.PHONY: test