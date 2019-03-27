+++ 
draft = false
date = 2019-03-27T14:05:48+01:00
title = "Automating git-bisect"
description = "The post explains how to automate git-bisect so everything can be done with just two shell commands."
images = ["/images/automating-git-bisect/git-bisect-run.png"]
slug = "automating-git-bisect" 
tags = ["git", "bisect", "run"]
categories = ["tools"]
+++

It took me a while to find time for this post. I could tell you a touchy story on how busy I was being a parent and having a full-time job at the same time. However, so many people have all this and still manage to do much more than just writing a single-page blog post. So I better shut up and proceed with the topic.

In [the previous post](/posts/git-bisect-to-the-rescue/), we've discussed a way to find a commit which caused tests to fail. Though it was relatively easy and didn't involve many things to do, there still were actions we had to repeat again and again. Namely, we ran tests and invoked `git bisect` depending on their status: `bad` for red, `good` for green. It looks like we can simplify our flow if we figure out how to automatically pass test results to Git. Fortunately, as usual in Unix world, there's already a command to do exactly this.

Let me quote [the official documentation](https://git-scm.com/docs/git-bisect#_bisect_run).

>If you have a script that can tell if the current source code is good or bad, you can bisect by issuing the command:

>`$ git bisect run my_script arguments`

>Note that the script (`my_script` in the above example) should exit with code 0 if the current source code is good/old, and exit with a code between 1 and 127 (inclusive), except 125, if the current source code is bad/new.

As easy as pie. We only need to [run JUnit from the command line](https://stackoverflow.com/questions/2235276/how-to-run-junit-test-cases-from-the-command-line) instead of the IDE and voilà. Let's do this! (Here's [the project](https://github.com/artspb/git-bisect-example-project) just in case.)

```
> git bisect start master master~6
Bisecting: 2 revisions left to test after this (roughly 2 steps)
[1976adac20cfabfc3f96cd794e0976919b573d31] [good] refactoring
> git bisect run sh -c "java -cp out/test/git-bisect-example-project:out/production/git-bisect-example-project:/Users/artspb/.m2/repository/junit/junit/4.12/junit-4.12.jar:/Users/artspb/.m2/repository/org/hamcrest/hamcrest-core/1.3/hamcrest-core-1.3.jar org.junit.runner.JUnitCore me.artspb.example.project.MainTest"

...

57413362ff22f70ef81298ea3dc0603ee52d450e is the first bad commit
commit 57413362ff22f70ef81298ea3dc0603ee52d450e
Author: Artem Khvastunov <artem.khvastunov@jetbrains.com>
Date:   Wed Jun 27 22:59:04 2018 +0200

    [good] working on code
```

<details><summary>Complete output</summary>

```
artspb@artspbs-MBP ~/I/h/git-bisect-example-project> git bisect start master master~6
Bisecting: 2 revisions left to test after this (roughly 2 steps)
[1976adac20cfabfc3f96cd794e0976919b573d31] [good] refactoring
artspb@artspbs-MBP ~/I/h/git-bisect-example-project> git bisect run sh -c "java -cp out/test/git-bisect-example-project:out/production/git-bisect-example-project:/Users/artspb/.m2/repository/junit/junit/4.12/junit-4.12.jar:/Users/artspb/.m2/repository/org/hamcrest/hamcrest-core/1.3/hamcrest-core-1.3.jar org.junit.runner.JUnitCore me.artspb.example.project.MainTest"
running sh -c java -cp out/test/git-bisect-example-project:out/production/git-bisect-example-project:/Users/artspb/.m2/repository/junit/junit/4.12/junit-4.12.jar:/Users/artspb/.m2/repository/org/hamcrest/hamcrest-core/1.3/hamcrest-core-1.3.jar org.junit.runner.JUnitCore me.artspb.example.project.MainTest
JUnit version 4.12
.E
Time: 0,004
There was 1 failure:
1) main(me.artspb.example.project.MainTest)
java.lang.AssertionError
        at org.junit.Assert.fail(Assert.java:86)
        at org.junit.Assert.fail(Assert.java:95)
        at me.artspb.example.project.MainTest.main(MainTest.java:11)
        at java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
        at java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:62)
        at java.base/jdk.internal.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)
        at java.base/java.lang.reflect.Method.invoke(Method.java:564)
        at org.junit.runners.model.FrameworkMethod$1.runReflectiveCall(FrameworkMethod.java:50)
        at org.junit.internal.runners.model.ReflectiveCallable.run(ReflectiveCallable.java:12)
        at org.junit.runners.model.FrameworkMethod.invokeExplosively(FrameworkMethod.java:47)
        at org.junit.internal.runners.statements.InvokeMethod.evaluate(InvokeMethod.java:17)
        at org.junit.runners.ParentRunner.runLeaf(ParentRunner.java:325)
        at org.junit.runners.BlockJUnit4ClassRunner.runChild(BlockJUnit4ClassRunner.java:78)
        at org.junit.runners.BlockJUnit4ClassRunner.runChild(BlockJUnit4ClassRunner.java:57)
        at org.junit.runners.ParentRunner$3.run(ParentRunner.java:290)
        at org.junit.runners.ParentRunner$1.schedule(ParentRunner.java:71)
        at org.junit.runners.ParentRunner.runChildren(ParentRunner.java:288)
        at org.junit.runners.ParentRunner.access$000(ParentRunner.java:58)
        at org.junit.runners.ParentRunner$2.evaluate(ParentRunner.java:268)
        at org.junit.runners.ParentRunner.run(ParentRunner.java:363)
        at org.junit.runners.Suite.runChild(Suite.java:128)
        at org.junit.runners.Suite.runChild(Suite.java:27)
        at org.junit.runners.ParentRunner$3.run(ParentRunner.java:290)
        at org.junit.runners.ParentRunner$1.schedule(ParentRunner.java:71)
        at org.junit.runners.ParentRunner.runChildren(ParentRunner.java:288)
        at org.junit.runners.ParentRunner.access$000(ParentRunner.java:58)
        at org.junit.runners.ParentRunner$2.evaluate(ParentRunner.java:268)
        at org.junit.runners.ParentRunner.run(ParentRunner.java:363)
        at org.junit.runner.JUnitCore.run(JUnitCore.java:137)
        at org.junit.runner.JUnitCore.run(JUnitCore.java:115)
        at org.junit.runner.JUnitCore.runMain(JUnitCore.java:77)
        at org.junit.runner.JUnitCore.main(JUnitCore.java:36)

FAILURES!!!
Tests run: 1,  Failures: 1

Bisecting: 0 revisions left to test after this (roughly 1 step)
[e19de721b9b1fb0de33233b1c480d47d6f5d915f] [good] formatting
running sh -c java -cp out/test/git-bisect-example-project:out/production/git-bisect-example-project:/Users/artspb/.m2/repository/junit/junit/4.12/junit-4.12.jar:/Users/artspb/.m2/repository/org/hamcrest/hamcrest-core/1.3/hamcrest-core-1.3.jar org.junit.runner.JUnitCore me.artspb.example.project.MainTest
JUnit version 4.12
.E
Time: 0,005
There was 1 failure:
1) main(me.artspb.example.project.MainTest)
java.lang.AssertionError
        at org.junit.Assert.fail(Assert.java:86)
        at org.junit.Assert.fail(Assert.java:95)
        at me.artspb.example.project.MainTest.main(MainTest.java:11)
        at java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
        at java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:62)
        at java.base/jdk.internal.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)
        at java.base/java.lang.reflect.Method.invoke(Method.java:564)
        at org.junit.runners.model.FrameworkMethod$1.runReflectiveCall(FrameworkMethod.java:50)
        at org.junit.internal.runners.model.ReflectiveCallable.run(ReflectiveCallable.java:12)
        at org.junit.runners.model.FrameworkMethod.invokeExplosively(FrameworkMethod.java:47)
        at org.junit.internal.runners.statements.InvokeMethod.evaluate(InvokeMethod.java:17)
        at org.junit.runners.ParentRunner.runLeaf(ParentRunner.java:325)
        at org.junit.runners.BlockJUnit4ClassRunner.runChild(BlockJUnit4ClassRunner.java:78)
        at org.junit.runners.BlockJUnit4ClassRunner.runChild(BlockJUnit4ClassRunner.java:57)
        at org.junit.runners.ParentRunner$3.run(ParentRunner.java:290)
        at org.junit.runners.ParentRunner$1.schedule(ParentRunner.java:71)
        at org.junit.runners.ParentRunner.runChildren(ParentRunner.java:288)
        at org.junit.runners.ParentRunner.access$000(ParentRunner.java:58)
        at org.junit.runners.ParentRunner$2.evaluate(ParentRunner.java:268)
        at org.junit.runners.ParentRunner.run(ParentRunner.java:363)
        at org.junit.runners.Suite.runChild(Suite.java:128)
        at org.junit.runners.Suite.runChild(Suite.java:27)
        at org.junit.runners.ParentRunner$3.run(ParentRunner.java:290)
        at org.junit.runners.ParentRunner$1.schedule(ParentRunner.java:71)
        at org.junit.runners.ParentRunner.runChildren(ParentRunner.java:288)
        at org.junit.runners.ParentRunner.access$000(ParentRunner.java:58)
        at org.junit.runners.ParentRunner$2.evaluate(ParentRunner.java:268)
        at org.junit.runners.ParentRunner.run(ParentRunner.java:363)
        at org.junit.runner.JUnitCore.run(JUnitCore.java:137)
        at org.junit.runner.JUnitCore.run(JUnitCore.java:115)
        at org.junit.runner.JUnitCore.runMain(JUnitCore.java:77)
        at org.junit.runner.JUnitCore.main(JUnitCore.java:36)

FAILURES!!!
Tests run: 1,  Failures: 1

Bisecting: 0 revisions left to test after this (roughly 0 steps)
[57413362ff22f70ef81298ea3dc0603ee52d450e] [good] working on code
running sh -c java -cp out/test/git-bisect-example-project:out/production/git-bisect-example-project:/Users/artspb/.m2/repository/junit/junit/4.12/junit-4.12.jar:/Users/artspb/.m2/repository/org/hamcrest/hamcrest-core/1.3/hamcrest-core-1.3.jar org.junit.runner.JUnitCore me.artspb.example.project.MainTest
JUnit version 4.12
.E
Time: 0,004
There was 1 failure:
1) main(me.artspb.example.project.MainTest)
java.lang.AssertionError
        at org.junit.Assert.fail(Assert.java:86)
        at org.junit.Assert.fail(Assert.java:95)
        at me.artspb.example.project.MainTest.main(MainTest.java:11)
        at java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
        at java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:62)
        at java.base/jdk.internal.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)
        at java.base/java.lang.reflect.Method.invoke(Method.java:564)
        at org.junit.runners.model.FrameworkMethod$1.runReflectiveCall(FrameworkMethod.java:50)
        at org.junit.internal.runners.model.ReflectiveCallable.run(ReflectiveCallable.java:12)
        at org.junit.runners.model.FrameworkMethod.invokeExplosively(FrameworkMethod.java:47)
        at org.junit.internal.runners.statements.InvokeMethod.evaluate(InvokeMethod.java:17)
        at org.junit.runners.ParentRunner.runLeaf(ParentRunner.java:325)
        at org.junit.runners.BlockJUnit4ClassRunner.runChild(BlockJUnit4ClassRunner.java:78)
        at org.junit.runners.BlockJUnit4ClassRunner.runChild(BlockJUnit4ClassRunner.java:57)
        at org.junit.runners.ParentRunner$3.run(ParentRunner.java:290)
        at org.junit.runners.ParentRunner$1.schedule(ParentRunner.java:71)
        at org.junit.runners.ParentRunner.runChildren(ParentRunner.java:288)
        at org.junit.runners.ParentRunner.access$000(ParentRunner.java:58)
        at org.junit.runners.ParentRunner$2.evaluate(ParentRunner.java:268)
        at org.junit.runners.ParentRunner.run(ParentRunner.java:363)
        at org.junit.runners.Suite.runChild(Suite.java:128)
        at org.junit.runners.Suite.runChild(Suite.java:27)
        at org.junit.runners.ParentRunner$3.run(ParentRunner.java:290)
        at org.junit.runners.ParentRunner$1.schedule(ParentRunner.java:71)
        at org.junit.runners.ParentRunner.runChildren(ParentRunner.java:288)
        at org.junit.runners.ParentRunner.access$000(ParentRunner.java:58)
        at org.junit.runners.ParentRunner$2.evaluate(ParentRunner.java:268)
        at org.junit.runners.ParentRunner.run(ParentRunner.java:363)
        at org.junit.runner.JUnitCore.run(JUnitCore.java:137)
        at org.junit.runner.JUnitCore.run(JUnitCore.java:115)
        at org.junit.runner.JUnitCore.runMain(JUnitCore.java:77)
        at org.junit.runner.JUnitCore.main(JUnitCore.java:36)

FAILURES!!!
Tests run: 1,  Failures: 1

57413362ff22f70ef81298ea3dc0603ee52d450e is the first bad commit
commit 57413362ff22f70ef81298ea3dc0603ee52d450e
Author: Artem Khvastunov <artem.khvastunov@jetbrains.com>
Date:   Wed Jun 27 22:59:04 2018 +0200

    [good] working on code

:040000 040000 f391b6fb5636f010c84a4d37baa8e4986e3216bc 500a60aec97a57a2f8d4c81e7b1124721aa15bac M      src
bisect run success
```
</details>

There are two commands invoked. The first one is `git bisect start`. It's needed to initiate the process, we've covered it in [the previous post](/posts/git-bisect-to-the-rescue/). The second one is `git bisect run` with a long-long string as a shell script. Indeed, a combination of old Java 8 and JUnit 4 forces us to manually pass the whole classpath which consists of test and production folders as well as JUnit jars. Later we can hide these details in an `sh`-file, but now we should answer a question: why it didn't actually work?

Git claims `[good] working on code` to be guilty, but we already know that `[bad] broken test` is to blame. Additionally, we can see that tests had 3 failures and zero successful runs which differs from our previous experience. It's suspicious. 🤔 Frankly speaking, it took me some time to figure out what's wrong. It turned out that the reason is simple: we forgot to recompile the code after checkout. Previously, IDEA did it for us just before the test run. Now we have to take care of this ourselves. OK, fine, let's make the line even longer by including `javac`.

```
artspb@artspbs-MBP ~/I/h/git-bisect-example-project> git bisect reset
Previous HEAD position was 5741336 [good] working on code
Switched to branch 'master'
artspb@artspbs-MBP ~/I/h/git-bisect-example-project> git bisect start master master~6
Bisecting: 2 revisions left to test after this (roughly 2 steps)
[1976adac20cfabfc3f96cd794e0976919b573d31] [good] refactoring
artspb@artspbs-MBP ~/I/h/git-bisect-example-project> git bisect run sh -c "javac -d out/production/git-bisect-example-project/ src/me/artspb/example/project/Main.java && javac -d out/test/git-bisect-example-project/ -cp out/production/git-bisect-example-project:/Users/artspb/.m2/repository/junit/junit/4.12/junit-4.12.jar:/Users/artspb/.m2/repository/org/hamcrest/hamcrest-core/1.3/hamcrest-core-1.3.jar test/me/artspb/example/project/MainTest.java && java -cp out/test/git-bisect-example-project:out/production/git-bisect-example-project:/Users/artspb/.m2/repository/junit/junit/4.12/junit-4.12.jar:/Users/artspb/.m2/repository/org/hamcrest/hamcrest-core/1.3/hamcrest-core-1.3.jar org.junit.runner.JUnitCore me.artspb.example.project.MainTest"

...

6af2ed56512d793d3238370227637b2d202c2dd6 is the first bad commit
commit 6af2ed56512d793d3238370227637b2d202c2dd6
Author: Artem Khvastunov <artem.khvastunov@jetbrains.com>
Date:   Wed Jun 27 23:00:12 2018 +0200

    [bad] broken test
```

Finally, it works as expected.

![git bisect run](/images/automating-git-bisect/git-bisect-run.png)

<details><summary>Complete output</summary>

```
artspb@artspbs-MBP ~/I/h/git-bisect-example-project> git bisect reset
Previous HEAD position was 5741336 [good] working on code
Switched to branch 'master'
artspb@artspbs-MBP ~/I/h/git-bisect-example-project> git bisect start master master~6
Bisecting: 2 revisions left to test after this (roughly 2 steps)
[1976adac20cfabfc3f96cd794e0976919b573d31] [good] refactoring
artspb@artspbs-MBP ~/I/h/git-bisect-example-project> git bisect run sh -c "javac -d out/production/git-bisect-example-project/ src/me/artspb/example/project/Main.java && javac -d out/test/git-bisect-example-project/ -cp out/production/git-bisect-example-project:/Users/artspb/.m2/repository/junit/junit/4.12/junit-4.12.jar:/Users/artspb/.m2/repository/org/hamcrest/hamcrest-core/1.3/hamcrest-core-1.3.jar test/me/artspb/example/project/MainTest.java && java -cp out/test/git-bisect-example-project:out/production/git-bisect-example-project:/Users/artspb/.m2/repository/junit/junit/4.12/junit-4.12.jar:/Users/artspb/.m2/repository/org/hamcrest/hamcrest-core/1.3/hamcrest-core-1.3.jar org.junit.runner.JUnitCore me.artspb.example.project.MainTest"
running sh -c javac -d out/production/git-bisect-example-project/ src/me/artspb/example/project/Main.java && javac -d out/test/git-bisect-example-project/ -cp out/production/git-bisect-example-project:/Users/artspb/.m2/repository/junit/junit/4.12/junit-4.12.jar:/Users/artspb/.m2/repository/org/hamcrest/hamcrest-core/1.3/hamcrest-core-1.3.jar test/me/artspb/example/project/MainTest.java && java -cp out/test/git-bisect-example-project:out/production/git-bisect-example-project:/Users/artspb/.m2/repository/junit/junit/4.12/junit-4.12.jar:/Users/artspb/.m2/repository/org/hamcrest/hamcrest-core/1.3/hamcrest-core-1.3.jar org.junit.runner.JUnitCore me.artspb.example.project.MainTest
JUnit version 4.12
.
Time: 0,004

OK (1 test)

Bisecting: 0 revisions left to test after this (roughly 1 step)
[ddd097e9a2968c5704d90b802eabfda02706607d] [bad] format string
running sh -c javac -d out/production/git-bisect-example-project/ src/me/artspb/example/project/Main.java && javac -d out/test/git-bisect-example-project/ -cp out/production/git-bisect-example-project:/Users/artspb/.m2/repository/junit/junit/4.12/junit-4.12.jar:/Users/artspb/.m2/repository/org/hamcrest/hamcrest-core/1.3/hamcrest-core-1.3.jar test/me/artspb/example/project/MainTest.java && java -cp out/test/git-bisect-example-project:out/production/git-bisect-example-project:/Users/artspb/.m2/repository/junit/junit/4.12/junit-4.12.jar:/Users/artspb/.m2/repository/org/hamcrest/hamcrest-core/1.3/hamcrest-core-1.3.jar org.junit.runner.JUnitCore me.artspb.example.project.MainTest
JUnit version 4.12
.E
Time: 0,005
There was 1 failure:
1) main(me.artspb.example.project.MainTest)
java.lang.AssertionError
        at org.junit.Assert.fail(Assert.java:86)
        at org.junit.Assert.fail(Assert.java:95)
        at me.artspb.example.project.MainTest.main(MainTest.java:11)
        at java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
        at java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:62)
        at java.base/jdk.internal.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)
        at java.base/java.lang.reflect.Method.invoke(Method.java:564)
        at org.junit.runners.model.FrameworkMethod$1.runReflectiveCall(FrameworkMethod.java:50)
        at org.junit.internal.runners.model.ReflectiveCallable.run(ReflectiveCallable.java:12)
        at org.junit.runners.model.FrameworkMethod.invokeExplosively(FrameworkMethod.java:47)
        at org.junit.internal.runners.statements.InvokeMethod.evaluate(InvokeMethod.java:17)
        at org.junit.runners.ParentRunner.runLeaf(ParentRunner.java:325)
        at org.junit.runners.BlockJUnit4ClassRunner.runChild(BlockJUnit4ClassRunner.java:78)
        at org.junit.runners.BlockJUnit4ClassRunner.runChild(BlockJUnit4ClassRunner.java:57)
        at org.junit.runners.ParentRunner$3.run(ParentRunner.java:290)
        at org.junit.runners.ParentRunner$1.schedule(ParentRunner.java:71)
        at org.junit.runners.ParentRunner.runChildren(ParentRunner.java:288)
        at org.junit.runners.ParentRunner.access$000(ParentRunner.java:58)
        at org.junit.runners.ParentRunner$2.evaluate(ParentRunner.java:268)
        at org.junit.runners.ParentRunner.run(ParentRunner.java:363)
        at org.junit.runners.Suite.runChild(Suite.java:128)
        at org.junit.runners.Suite.runChild(Suite.java:27)
        at org.junit.runners.ParentRunner$3.run(ParentRunner.java:290)
        at org.junit.runners.ParentRunner$1.schedule(ParentRunner.java:71)
        at org.junit.runners.ParentRunner.runChildren(ParentRunner.java:288)
        at org.junit.runners.ParentRunner.access$000(ParentRunner.java:58)
        at org.junit.runners.ParentRunner$2.evaluate(ParentRunner.java:268)
        at org.junit.runners.ParentRunner.run(ParentRunner.java:363)
        at org.junit.runner.JUnitCore.run(JUnitCore.java:137)
        at org.junit.runner.JUnitCore.run(JUnitCore.java:115)
        at org.junit.runner.JUnitCore.runMain(JUnitCore.java:77)
        at org.junit.runner.JUnitCore.main(JUnitCore.java:36)

FAILURES!!!
Tests run: 1,  Failures: 1

Bisecting: 0 revisions left to test after this (roughly 0 steps)
[6af2ed56512d793d3238370227637b2d202c2dd6] [bad] broken test
running sh -c javac -d out/production/git-bisect-example-project/ src/me/artspb/example/project/Main.java && javac -d out/test/git-bisect-example-project/ -cp out/production/git-bisect-example-project:/Users/artspb/.m2/repository/junit/junit/4.12/junit-4.12.jar:/Users/artspb/.m2/repository/org/hamcrest/hamcrest-core/1.3/hamcrest-core-1.3.jar test/me/artspb/example/project/MainTest.java && java -cp out/test/git-bisect-example-project:out/production/git-bisect-example-project:/Users/artspb/.m2/repository/junit/junit/4.12/junit-4.12.jar:/Users/artspb/.m2/repository/org/hamcrest/hamcrest-core/1.3/hamcrest-core-1.3.jar org.junit.runner.JUnitCore me.artspb.example.project.MainTest
JUnit version 4.12
.E
Time: 0,004
There was 1 failure:
1) main(me.artspb.example.project.MainTest)
java.lang.AssertionError
        at org.junit.Assert.fail(Assert.java:86)
        at org.junit.Assert.fail(Assert.java:95)
        at me.artspb.example.project.MainTest.main(MainTest.java:11)
        at java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
        at java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:62)
        at java.base/jdk.internal.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)
        at java.base/java.lang.reflect.Method.invoke(Method.java:564)
        at org.junit.runners.model.FrameworkMethod$1.runReflectiveCall(FrameworkMethod.java:50)
        at org.junit.internal.runners.model.ReflectiveCallable.run(ReflectiveCallable.java:12)
        at org.junit.runners.model.FrameworkMethod.invokeExplosively(FrameworkMethod.java:47)
        at org.junit.internal.runners.statements.InvokeMethod.evaluate(InvokeMethod.java:17)
        at org.junit.runners.ParentRunner.runLeaf(ParentRunner.java:325)
        at org.junit.runners.BlockJUnit4ClassRunner.runChild(BlockJUnit4ClassRunner.java:78)
        at org.junit.runners.BlockJUnit4ClassRunner.runChild(BlockJUnit4ClassRunner.java:57)
        at org.junit.runners.ParentRunner$3.run(ParentRunner.java:290)
        at org.junit.runners.ParentRunner$1.schedule(ParentRunner.java:71)
        at org.junit.runners.ParentRunner.runChildren(ParentRunner.java:288)
        at org.junit.runners.ParentRunner.access$000(ParentRunner.java:58)
        at org.junit.runners.ParentRunner$2.evaluate(ParentRunner.java:268)
        at org.junit.runners.ParentRunner.run(ParentRunner.java:363)
        at org.junit.runners.Suite.runChild(Suite.java:128)
        at org.junit.runners.Suite.runChild(Suite.java:27)
        at org.junit.runners.ParentRunner$3.run(ParentRunner.java:290)
        at org.junit.runners.ParentRunner$1.schedule(ParentRunner.java:71)
        at org.junit.runners.ParentRunner.runChildren(ParentRunner.java:288)
        at org.junit.runners.ParentRunner.access$000(ParentRunner.java:58)
        at org.junit.runners.ParentRunner$2.evaluate(ParentRunner.java:268)
        at org.junit.runners.ParentRunner.run(ParentRunner.java:363)
        at org.junit.runner.JUnitCore.run(JUnitCore.java:137)
        at org.junit.runner.JUnitCore.run(JUnitCore.java:115)
        at org.junit.runner.JUnitCore.runMain(JUnitCore.java:77)
        at org.junit.runner.JUnitCore.main(JUnitCore.java:36)

FAILURES!!!
Tests run: 1,  Failures: 1

6af2ed56512d793d3238370227637b2d202c2dd6 is the first bad commit
commit 6af2ed56512d793d3238370227637b2d202c2dd6
Author: Artem Khvastunov <artem.khvastunov@jetbrains.com>
Date:   Wed Jun 27 23:00:12 2018 +0200

    [bad] broken test

:040000 040000 fcf4a50dd84202a904f222087e7b9094afe1990c e1e2242e1ea3d45979dabbfda309fc64db33aab6 M      test
bisect run success
```
</details>

Of course, the first thought that crossed my mind was who would ever do it this way? No one builds Java programs manually nowadays. So I decided to prepare another project with the same sequence of commits but this time using Gradle. You can find it [here](https://github.com/artspb/git-bisect-example-gradle-project).

```
artspb@artspbs-MBP ~/I/h/git-bisect-example-gradle-project> git bisect start master master~6
Bisecting: 2 revisions left to test after this (roughly 2 steps)
[51f6368dd609d9771361b5714138952aaed0bc74] [good] refactoring
artspb@artspbs-MBP ~/I/h/git-bisect-example-gradle-project> git bisect run ./gradlew test --tests me.artspb.example.gradle.project.MainTest

...

8e32242777b2ae2ed4fe30ee449093b076f8d11c is the first bad commit
commit 8e32242777b2ae2ed4fe30ee449093b076f8d11c
Author: Artem Khvastunov <artem.khvastunov@jetbrains.com>
Date:   Wed Jun 27 23:00:12 2018 +0200

    [bad] broken test
```

<details><summary>Complete output</summary>

```
artspb@artspbs-MBP ~/I/h/git-bisect-example-gradle-project> git bisect start master master~6
Bisecting: 2 revisions left to test after this (roughly 2 steps)
[51f6368dd609d9771361b5714138952aaed0bc74] [good] refactoring
artspb@artspbs-MBP ~/I/h/git-bisect-example-gradle-project> git bisect run ./gradlew test --tests me.artspb.example.gradle.project.MainTest
running ./gradlew test --tests me.artspb.example.gradle.project.MainTest

BUILD SUCCESSFUL in 1s
3 actionable tasks: 3 executed
Bisecting: 0 revisions left to test after this (roughly 1 step)
[4c02aabd8b8fae82eb51bdb171670e104017109b] [bad] format string
running ./gradlew test --tests me.artspb.example.gradle.project.MainTest

> Task :test FAILED

me.artspb.example.gradle.project.MainTest > main FAILED
    java.lang.AssertionError at MainTest.java:11

1 test completed, 1 failed

FAILURE: Build failed with an exception.

* What went wrong:
Execution failed for task ':test'.
> There were failing tests. See the report at: file:///Users/artspb/IdeaProjects/hackathon18/git-bisect-example-gradle-project/build/reports/tests/test/index.html

* Try:
Run with --stacktrace option to get the stack trace. Run with --info or --debug option to get more log output. Run with --scan to get full insights.

* Get more help at https://help.gradle.org

BUILD FAILED in 1s
3 actionable tasks: 3 executed
Bisecting: 0 revisions left to test after this (roughly 0 steps)
[8e32242777b2ae2ed4fe30ee449093b076f8d11c] [bad] broken test
running ./gradlew test --tests me.artspb.example.gradle.project.MainTest

> Task :test FAILED

me.artspb.example.gradle.project.MainTest > main FAILED
    java.lang.AssertionError at MainTest.java:11

1 test completed, 1 failed

FAILURE: Build failed with an exception.

* What went wrong:
Execution failed for task ':test'.
> There were failing tests. See the report at: file:///Users/artspb/IdeaProjects/hackathon18/git-bisect-example-gradle-project/build/reports/tests/test/index.html

* Try:
Run with --stacktrace option to get the stack trace. Run with --info or --debug option to get more log output. Run with --scan to get full insights.

* Get more help at https://help.gradle.org

BUILD FAILED in 1s
3 actionable tasks: 2 executed, 1 up-to-date
8e32242777b2ae2ed4fe30ee449093b076f8d11c is the first bad commit
commit 8e32242777b2ae2ed4fe30ee449093b076f8d11c
Author: Artem Khvastunov <artem.khvastunov@jetbrains.com>
Date:   Wed Jun 27 23:00:12 2018 +0200

    [bad] broken test

:040000 040000 6aca373af87a2ba6c681414c947e14cc69cbd00b 5c061137438887adbee74077ffab77477ce7d607 M      src
bisect run success
```
</details>

`git bisect run ./gradlew test` looks much nicer, and we don't need to worry about compilation any more thanks to Gradle. It's always great to have a tool which does all the routine for you.

So, what is the takeaway of this article? You can automate `git bisect` with a shell script which does commit verification. In the most common case, it runs unit tests. Depending on your build system, it can even be a simple command. The next obvious step would be IDE support, but this is the topic for the next post. Stay tuned and thank you for reading.
