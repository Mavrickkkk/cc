.PHONY: all front back db

all:
	make db & make back & make front

db:
	surreal start --user root --pass root rocksdb:./data/surreal.db

back:
	cd back && cargo run

front:
	cd mavrickcc && npm run dev

stop:
	pkill -f "surreal start" || true
	pkill -f "cargo run" || true
	pkill -f "back" || true
	pkill -f "npm run dev" || true