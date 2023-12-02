default: download

setup:
	@ln -sT ../aoc-input/input/2023 input

download:
	@../aoc-input/download.sh

all:
	@ts-node src/*.ts
