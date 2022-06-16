+++ 
draft = false
date = 2022-06-16T14:50:31+02:00
title = "How to expire public key with GPG"
description = "A short guide with the list of commands one should execute to expire a public OpenPGP key."
images = []
slug = "how-to-expire-public-key-with-gpg"
tags = ["OpenPGP", "GPG", "macOS", "Keybase"]
categories = ["Cryptography", "Tools"]
+++

I have a public OpenPGP key hosted on [keybase.io](https://keybase.io/artspb), which is valid for one year. Every year I have the same situation: Gosh, how do I expire a key? Even though the procedure is fairly simple, it takes some time to google all the right pages. This year, I've decided to document the process. Now, I can also update the page when I find better ways to achieve the result.

The primary source of information is [this answer](https://unix.stackexchange.com/a/177310/47504) on StackExchange. The sequence of commands is following.

```shell
gpg --list-keys
gpg --edit-key 57B06019
gpg> expire
...
gpg> save
gpg> key 1
gpg> expire
...
gpg> save
gpg> quit
```

Now, I need to publish an update to Keybase. On macOS, I should first launch _Keybase.app_ and then invoke the following command.

```shell
keybase pgp update
```

That's it. As I said, the procedure is simple. And I already feel how future Artem thanks me as he doesn't need to look up all this information again 🙂
