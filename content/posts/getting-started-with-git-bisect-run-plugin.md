+++ 
draft = false
date = 2019-03-28T12:04:27+01:00
title = "Getting started with git bisect run plugin"
description = "The post explains how to use git bisect run plugin for IntelliJ-based IDEs from JetBrains. It's a step-by-step tutorial which covers the most common case."
images = ["/images/getting-started-with-git-bisect-run-plugin/git-bisect-run-ui.png"]
slug = "getting-started-with-git-bisect-run-plugin" 
tags = ["git", "bisect", "run", "intellij", "idea", "plugin"]
categories = ["tools", "tutorials", "plugins"]
series = ["git-bisect", "git bisect run"]
+++

This post continues [series](/series/git-bisect/) on `git bisect` command. Previously, we've learned how Git helps to find a commit which introduced failing tests. Now, I'd like to show how an IDE can simplify a process by hiding complexity behind literally one button. We'll need the same example projects ([one](https://github.com/artspb/git-bisect-example-project), [two](https://github.com/artspb/git-bisect-example-gradle-project)) we've used before. [A plugin](https://plugins.jetbrains.com/plugin/10874-git-bisect-run) we're going to examine in this post works with any JetBrains' IDE (Git plugin has to be enabled, though). I'll continue using IntelliJ IDEA as the demo projects are written in Java.

The primary goal of this post is to serve as a documentation for [git bisect run plugin](https://plugins.jetbrains.com/plugin/10874-git-bisect-run). I believe that one of the best documentation forms is a tutorial. That's why we'll go step by step through the whole process. Let's begin with preparations.

### Prerequisites

1. [Download](http://www.jetbrains.com/idea/download) and install IntelliJ IDEA; Community edition would be enough.
2. Go to _Preferences | Plugins | Marketplace_, search for _git bisect run_, and install the plugin. Keep in mind that it requires Git Integration to be enabled.

    ![Marketplace](/images/getting-started-with-git-bisect-run-plugin/git-bisect-run-marketplace.png)

3. Invoke _Check out from Version Control | Git_ and use the following URL `https://github.com/artspb/git-bisect-example-project` to download and open an example project.

We're now ready to start using the plugin.

### Preparation

As the plugin uses `git bisect` command under the hood, it requires the same input namely initial revisions and a run configuration.

We've briefly touched a topic of finding bad/good revisions in [one of the previous posts](/posts/git-bisect-to-the-rescue/). Generally, the topic is rather simple but has some pitfalls thus requires a separate blog post. Let's consider for now that the sought commit is somewhere in between `master` and `master~6`.

The easiest way of creating a run configuration is simply running a test which is `MainTest` in our case. When you've done it, your IDE should look like this which means that we're ready to start bisecting.

![MainTest](/images/getting-started-with-git-bisect-run-plugin/MainTest.png)

### Bisecting

1. Find a toolbar and click on a Git icon with the run symbol. Note that the proper run configuration should be selected (`MainTest` in our case).

    ![git-bisect-run-toolbar](/images/getting-started-with-git-bisect-run-plugin/git-bisect-run-toolbar.png)

2. Enter bad (`master`) and good (`master~6`) revisions, ignore the rest for now.

    ![git-bisect-run-ui](/images/getting-started-with-git-bisect-run-plugin/git-bisect-run-ui.png)

3. Click _Bisect Run_.

This is when the magic starts to happen. The plugin emulates `git bisect run` behavior by running appropriate Git commands depending on test invocation results. It basically performs the same actions we had to perform manually [before](/posts/git-bisect-to-the-rescue/). When the plugin finishes its work, we see familiar text in a pop-up.

![git-bisect-run-finished](/images/getting-started-with-git-bisect-run-plugin/git-bisect-run-finished.png)

That was it. We now know the cause of the failing test and can either check out a corresponding revision or reset the IDE to its initial state. Also, keep in mind that _git bisect reset_ action is always available via _Find Action_ (_⌘+Shift+A_) so you can use it whenever something goes wrong. 

![git-bisect-reset](/images/getting-started-with-git-bisect-run-plugin/git-bisect-reset.png)

Moreover, there's one more thing. You probably remember from [the previous post](http://localhost:1313/posts/automating-git-bisect/) that we have [a similar example project](https://github.com/artspb/git-bisect-example-gradle-project) which uses Gradle to run tests. No surprise, git bisect run plugin works with Gradle tasks as well (`test` in this case).

![git-bisect-run-gradle-finished](/images/getting-started-with-git-bisect-run-plugin/git-bisect-run-gradle-finished.png)

### Conclusion

In this post, we've learned how to use git bisect run plugin in a basic case. However, there are more sophisticated scenarios like manual testing and multi-repo projects. They are to be covered in future posts.

As usual, feel free to comment here or on Twitter with your questions and suggestions. I'm also curious how does the plugin work for you with other languages, e.g., Python or Go? Share your experience.
