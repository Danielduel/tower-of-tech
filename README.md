# Tower of Tech

This repository contains tech-related playlists and utilities used to manage them.

# Playlists

The final (planned, can be changed) state of playlist served by this repository should be like this:

A playlist name should contain prefix and "tech" suffix.
* Speed prefix could be "Adep", "Acc", "Mid", "Fast" and "Sonic".
* Tech suffix would be "Comfy", "Tech", "Hitech", "Anglehell" and "Tempo"

There are and will be "guest" playlists - f.e. Morgolf's.

// keep in mind that MidHitech and "harder" playlists will be hard to judge, but I will do my best categorizing them, could be better after next 2 years of Beat Saber

# Contributing

Do you have a great...
* ...tech playlist and you would love to share it?
* ...idea regarding this project?
* ...advice to move some map to other category?
* ...opinion on something is not actually a tech?

If first 3: DM me on discord or do an issue on this repository

# What I need now?

* More people recommending me maps to try out for categorization
* More people who will be doublechecking categorization

# Thanks!

## People who like to discuss tech
- Cush (https://www.twitch.tv/cush_is_me)
- Chrisvenator (https://www.twitch.tv/chrisvenator)
- winter (https://www.twitch.tv/winteredge)
- Goose (https://www.twitch.tv/goosychan)
- DarkyFox (https://www.twitch.tv/darkyfox__)
- i_time (https://www.twitch.tv/i_time)

## People who allowed me to add their playlists to the project
- Morgolf (https://www.twitch.tv/morgolf)
- Exa (https://www.twitch.tv/exa_cute)
- HitMeWMusic (https://www.twitch.tv/hitmewmusic)
- Mochichi (https://www.twitch.tv/mochichi72)
- Motzel
- NamakiMono (https://www.twitch.tv/namaki_mono)
- Pleo
- TheHarshJellyfish (https://www.twitch.tv/theharshjellyfish)

# ToT Bot invite link

https://discord.com/api/oauth2/authorize?client_id=1171582001900421192&permissions=17600776047616&scope=bot+applications.commands

# Development of the website

You need `Deno` and `s3s-fs`
* `s3s-fs`
  I suggest getting cargo
  `https://doc.rust-lang.org/cargo/getting-started/installation.html`
  and installing it by `cargo install s3s-fs --features binary`
* `Deno`
  `https://docs.deno.com/runtime/manual/getting_started/installation`
  As I am developing this, the current Deno version is 1.37.1
  (you can use cargo to install deno too, `cargo install deno --locked`)

To make it work you have to use 2 forks located in the parent folder of this project's root dir:

* develop branch of https://github.com/Danielduel/pentagon
* develop branch of https://github.com/Danielduel/ultra

(you don't have to build those forks or anything, they work by the touch of deno's magic)

To run dev app - you have to run `deno task dev` or if you want to split logs from
local s3 server and webapp - `deno task s3s-fs-local` and `deno task webapp:dev`

This app uses Deno KV, so you have to run it with `unstable` flag.

Good luck.