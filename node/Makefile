build: components index.js
	@component build -s odata -n odata

components: component.json
	@component install

clean:
	rm -fr build components

.PHONY: clean
