build:
	rm -rf ./apps/cli/bin
	deno compile \
		--target x86_64-unknown-linux-gnu \
		-o ./apps/cli/bin/x86_64-unknown-linux-gnu/tot \
			--allow-env \
			--allow-read \
			--allow-write \
			./apps/cli/main.ts
	deno compile \
		--target aarch64-unknown-linux-gnu \
		-o ./apps/cli/bin/aarch64-unknown-linux-gnu/tot \
			--allow-env \
			--allow-read \
			--allow-write \
			./apps/cli/main.ts
	deno compile \
		--target x86_64-pc-windows-msvc \
		--no-terminal \
		-o ./apps/cli/bin/x86_64-pc-windows-msvc/tot \
			--allow-env \
			--allow-read \
			--allow-write \
			./apps/cli/main.ts
	deno compile \
		--target x86_64-apple-darwin \
		-o ./apps/cli/bin/x86_64-apple-darwin/tot \
			--allow-env \
			--allow-read \
			--allow-write \
			./apps/cli/main.ts
	deno compile \
		--target aarch64-apple-darwin \
		-o ./apps/cli/bin/aarch64-apple-darwin/tot \
			--allow-env \
			--allow-read \
			--allow-write \
			./apps/cli/main.ts
