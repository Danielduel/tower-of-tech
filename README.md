# ToT Bot invite link

https://discord.com/api/oauth2/authorize?client_id=1171582001900421192&scope=applications.commands

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

# Tower of Tech

This repository contains tech-related playlists and utilities used to manage them.

# Playlists

The final (planned, can be changed) state of playlist served by this repository should be like this:

A playlist name should contain prefix and "tech" suffix.
Prefix can be a style or speed category.
* Speed prefix could be "Acc", "Mid" and "Fast".
* Style prefix could be "Fit" (fitbeat), "S" (stamina), "D" (dense) 
* Tech suffix would be "Notech", "Lowtech", "Tech", "Hightech", "Anglehell".

Since I didn't want to use SuperSlowNotech, AccNotech and MidNotech - they are renamed to AccChill and AccComfy, currently MidNotech doesn't exist
but keep in mind that I will use other name for it.

There are and will be "guest" playlists - f.e. Morgolf's.

Current state:

* AccChill - reviewed
* AccComfy - reviewed
* AccTech - in review, maps could mismatch the description, currently breaking it out to other categories

* MidLowtech - currently growing
* Midtech - currently growing, but it will be split to other categories

* FitTech - currently growing

* Morgolf - guest playlist from https://www.twitch.tv/morgolf

* STech - currently growing

* 3rd eye tech - in removal
* actually hard tek - in removal
* angle hell - in removal
* for techwannabees - in removal
* interesting tek - in removal
* omnitech - in removal
* T3ch - in removal

// "in removal" means I am moving content to new playlist system and after doing this - those playlists will be removed, I am open for ideas like 
to call MidAnglehell an Omnitech in future

Planned playlists:

* AccHightech
* AccAnglehell
* A better name for "MidNotech"
* MidHightech
* MidAnglehell
* FastNotech
* FastLowtech
* FastTech
* FastHightech
* FastAnglehell

// keep in mind that MidHightech and "harder" playlists will be hard to judge, but I will do my best categorizing them, could be better after
next 2 years of Beat Saber

# Contributing

Do you have a great...
* ...tech playlist and you would love to share it?
* ...idea regarding this project?
* ...advice to move some map to other category?
* ...opinion on something is not actually a tech?

If first 3: DM me on discord or do an issue on this repository, if the last one - :)

# What I need now?

* More people recommending me maps to try out for categorization
* A good design for playlist's covers

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
