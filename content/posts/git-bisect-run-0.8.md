+++ 
draft = false
date = 2023-03-13T08:32:21+01:00
title = "git bisect run 0.8"
description = "Short update on the release 0.8 of the git bisect run plugin."
images = ["/images/git-bisect-run-0.8/git-bisect-dialog.png"]
slug = "git-bisect-run-0.8"
tags = ["Git", "bisect", "run", "IntelliJ IDEA", "Plugin"]
categories = ["Tools", "Plugins"]
series = ["git-bisect", "git bisect run plugin"]
+++

Yesterday I released the new version 0.8 of the git bisect run plugin. It contains a few minor bug fixes and a major rework of the Bisect dialog.

![Updated dialog](/images/git-bisect-run-0.8/git-bisect-dialog.png)

Initially, the dialog was heavily inspired by a similar one for Rebase (read: copy-pasted during a hackathon). I don't want to post its picture here, but if you're curious, you can find it in [the previous post](http://localhost:1313/posts/git-bisect-run-0.7/). Even though the Bisect dialog evolved over time, it still had its old-stylish look. As the Rebase one got updated some time ago, it was a long due to make them in sync. Now it's done.

The dialog is more concise but bears the same functionality. It's designed to look like a terminal command preview. If you open it from a toolbar, you need to specify revisions manually. The list of branches and tags could help with this task. I personally prefer to start bisecting from the Git log by selecting corresponding revisions and right-clicking them. In this case, the fields get populated automatically.

Please give it a try and share your opinion with me. I'm interested in how the new Bisect dialog works for you, as I like the Rebase one very much. Kudos to the JetBrains' designers and developers who implemented it!

{{< tweet user="art_spb" id="1635182885090263042" >}}
