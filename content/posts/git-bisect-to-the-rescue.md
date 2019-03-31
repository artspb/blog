+++ 
draft = false
date = 2019-01-20T11:09:11+01:00
title = "git-bisect to the rescue"
description = "The post explains when git-bisect can be useful and shows a simple usage scenario."
images = ["/images/git-bisect-to-the-rescue/git-bisect-bad.png"]
slug = "git-bisect-to-the-rescue" 
tags = ["Git", "bisect"]
categories = ["Tools"]
series = ["git-bisect"]
+++

Today I want to tell you about a tool I use occasionally but find extremely useful. I'm sure many of you fetch, pull, checkout, commit, and perhaps push using Git on a daily basis. In the same time, I doubt you bisect more or less often. There's even a high chance that you have never heard about this command before. If you're now curious what it is, then you have the right page open. Let's get started with the explanation.

[The official documentation](https://git-scm.com/docs/git-bisect) tells us that *"git-bisect uses binary search to find the commit that introduced a bug."* It sounds fascinating, isn't it? Just imagine that you type a command, pass proper arguments, and after some time get a list of commits which introduce bugs in your project. But wait, we already have `git log` for this. It works pretty accurate and rarely gives you something else. However, it doesn't use binary search, so `git bisect` is probably intended for something else. To figure out what exactly it's for let's use an example.

Imagine yourself being a programmer. You start your day with a cup of coffee or tea ~~or smoothie~~. Then you pull fresh updates from a server and run tests to be sure that everything's green so you can start with a new feature. But all your plans are ruined when you see "Tests failed: 1". For those of you who have never been in such a situation because you have a zero-tolerance policy for red tests or simply don't have tests at all, I've prepared [an example project](https://github.com/artspb/git-bisect-example-project). If you clone it and do the steps described above (don't forget a drink!), you'll see something like on the following picture.

![Tests failed: 1](/images/git-bisect-to-the-rescue/tests-failed-1.png)

You feel lost. To proceed with the feature you first need to make tests green again. But at which point they become broken? Do you **really** need to check all the commits between `master` and the previous stable state where you're 100% sure the tests were fine? But hey, this's exactly the situation for binary search which we discussed in [the previous post](/posts/binary-search-explained/). It gives us logarithmic time thus instead of, say, eight commits we should only check three an so on. Here's its definition if you don't remember.

>[Binary search](https://en.wikipedia.org/wiki/Binary_search_algorithm) is a search algorithm that finds the position of a target value within a sorted array.

The target value in our case is the first commit that makes tests fail. The sequence of commits represents the array. It's naturally sorted according to the rule that all bad commits appear to the left and all good commits appear to the right from the target commit. Thus if we check a random commit and

* it's good then all commits to the right are good;
* it's bad then all commits to the left are bad.

This is all we need to use binary search. And *git-bisect*, its implementation for Git, comes to the rescue.

You know for sure that six commits ago all the tests were green. To prove it, you invoke `git checkout master~6` and rerun the suite.

![git checkout master~6](/images/git-bisect-to-the-rescue/git-checkout-master-6.png)

Perfect. The commit we're looking for is somewhere in between `master` and `master~6`. You can check all five revisions manually or use the tool to reduce the number to three in the worst case. Of course, you open a terminal, and type `git bisect start master master~6`. You get the following output.

```
Bisecting: 2 revisions left to test after this (roughly 2 steps)
[1976adac20cfabfc3f96cd794e0976919b573d31] [good] refactoring
```

These lines mean that Git checked out the middlemost revision. It now wants to know whether the current commit is good or bad. The tests pass, so you enter `git bisect good`.

```
Bisecting: 0 revisions left to test after this (roughly 1 step)
[ddd097e9a2968c5704d90b802eabfda02706607d] [bad] format string
```

This time tests fail so you're giving a different input which is `git bisect bad`.

```
Bisecting: 0 revisions left to test after this (roughly 0 steps)
[6af2ed56512d793d3238370227637b2d202c2dd6] [bad] broken test
```

The last step, the moment of truth. You mark the current revision as bad due to the failing suite. And... that's it. You immediately get the result.

![git bisect bad](/images/git-bisect-to-the-rescue/git-bisect-bad.png)

<details><summary>Complete output</summary>

```
artspb@artspbs-MBP ~/I/h/git-bisect-example-project> git checkout master~6
Note: checking out 'master~6'.

You are in 'detached HEAD' state. You can look around, make experimental
changes and commit them, and you can discard any commits you make in this
state without impacting any branches by performing another checkout.

If you want to create a new branch to retain commits you create, you may
do so (now or later) by using -b with the checkout command again. Example:

  git checkout -b <new-branch-name>

HEAD is now at ccaa064 Initial commit
artspb@artspbs-MBP ~/I/h/git-bisect-example-project> git bisect start master master~6
Bisecting: 2 revisions left to test after this (roughly 2 steps)
[1976adac20cfabfc3f96cd794e0976919b573d31] [good] refactoring
artspb@artspbs-MBP ~/I/h/git-bisect-example-project> git bisect good
Bisecting: 0 revisions left to test after this (roughly 1 step)
[ddd097e9a2968c5704d90b802eabfda02706607d] [bad] format string
artspb@artspbs-MBP ~/I/h/git-bisect-example-project> git bisect bad
Bisecting: 0 revisions left to test after this (roughly 0 steps)
[6af2ed56512d793d3238370227637b2d202c2dd6] [bad] broken test
artspb@artspbs-MBP ~/I/h/git-bisect-example-project> git bisect bad
6af2ed56512d793d3238370227637b2d202c2dd6 is the first bad commit
commit 6af2ed56512d793d3238370227637b2d202c2dd6
Author: Artem Khvastunov <artem.khvastunov@jetbrains.com>
Date:   Wed Jun 27 23:00:12 2018 +0200

    [bad] broken test

:040000 040000 fcf4a50dd84202a904f222087e7b9094afe1990c e1e2242e1ea3d45979dabbfda309fc64db33aab6 M      test
```
</details>

As simple as that, you've just found the commit that breaks the tests. You see the changes so you can find the cause. It's now up to you to decide whether to fix or to revert. In any case, the day is saved, and you can proceed with your feature. Or, considering you had to check two commits less thus saving some time, you can justify one more drink, a well-deserved drink.

{{< tweet 981446572465586176 >}}

I hope you enjoyed the reading. Do you have any questions left? Is there something I should cover in more details? I'm open for suggestions. Also, I'd really love to know your experience with *git-bisect*. Did you have a chance to try? Was it a success? Please comment below or on Twitter.

{{< tweet 1086929906649452544 >}}