+++ 
draft = false
date = 2020-12-05T16:56:01+01:00
title = "git bisect run 0.7"
description = "What's new in the latest update 0.7 of the git bisect run plugin for the IntelliJ IDEA-based IDEs."
images = ["/images/git-bisect-run-0.7/test-results.png"]
slug = "git-bisect-run-0.7"
tags = ["Git", "bisect", "run", "IntelliJ IDEA", "Plugin"]
categories = ["Tools", "Plugins"]
series = ["git-bisect", "git bisect run plugin"]
+++

I wanted to find some time to work on the [git bisect run plugin](https://plugins.jetbrains.com/plugin/10874-git-bisect-run) for quite a while already. Finally, I was able to dedicate a few days to it. As a result, today, I've released the biggest update since the plugin's inception. In this post, I want to tell you about the most noticeable changes.

### Test results prevail over exit code

This is probably the most requested feature. Previously, the plugin always relied on the process' exit code. While, in general, this approach works, sometimes it's more convenient to look at tests instead. For instance, one may configure Gradle to ignore failures, so it runs all tests. In this case, its exit code is always zero. At the same time, IntelliJ IDEA knows very well when tests are not so green. Now it's possible to take this information into account.

![Test results prevail over exit code](/images/git-bisect-run-0.7/test-results.png)

The new _Test results prevail over exit code_ setting is enabled by default. With this option on, the plugin considers passed and ignored tests as zero and failed tests as non-zero exit codes. If there are no tests, or they can't start, the plugin behaves as before. The checkbox state persists between IDE restarts. And while we're here, values of _Bad_ and _Good revision_ are now stored, too.

### Bisect from Git log

The second feature that I find pretty useful is the ability to invoke bisect right from the Git log. You can select one or two commits that appear in the _Bad_ and _Good revision_ fields.

![Bisect from Git log](/images/git-bisect-run-0.7/bisect-from-git-log.png)

No special magic is involved, so it's on you to ensure that the commits belong to the same branch. The plugin provides detailed information in case of error. There's also an action that helps to quickly repeat the last bisect command.

![Retry the last command](/images/git-bisect-run-0.7/retry-last-command.png)

### Bisect from context

There's also no need anymore to create a configuration in advance. You can start bisecting right from the editor or any other context where run configurations are available. The new one is created in the same way as it's done for the regular run.

![Bisect from context](/images/git-bisect-run-0.7/bisect-from-context.png)

Additionally, I've improved handling of the so-called dumb mode. If a run configuration can't work while the IDE performs indexing, it won't start until indices are built.

The last little thing is that all bisect commands are now available as actions under _Git | Bisect_. It allows you to invoke them from the _Actions_ popup and even assign shortcuts to them.

![Good action](/images/git-bisect-run-0.7/good-action.png)

### Conclusion

I'm very much satisfied with what I've done in 0.7. Most of these ideas were suggested by colleagues and users. It's a great relief that I've finally implemented them. Still, I'm looking forward to your feedback and reports. It's very inspiring to learn how people [use](https://twitter.com/patrickclery/status/1324813074130522113) the plugin. The next big thing I'm already thinking of is synchronizing multiple repositories using heuristics based on tags, submodules, and timestamps. But who knows when I find time again? 😃

{{< tweet 1335253164266835969 >}}
