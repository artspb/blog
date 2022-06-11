+++ 
draft = false
date = 2019-03-31T10:11:43+02:00
title = "How smart is SmartList? Prelude"
description = "This is a prelude to the series of posts about SmartList which is our in-house replacement for ArrayList."
images = []
slug = "how-smart-is-smartlist-prelude" 
tags = ["IntelliJ IDEA", "SmartList", "Java", "Escape Analysis"]
categories = ["Java"]
series = ["SmartList"]
+++

I actually wanted to dig into the topic for quite a while already. So I'm extremely excited that I finally found time for this. 

{{< tweet user="art_spb" id="926546747933020160" >}}

Let me start with a story. But first comes obligatory [all persons fictitious disclaimer](https://en.wikipedia.org/wiki/All_persons_fictitious_disclaimer).

>The story, all names, characters, and incidents portrayed in this production are fictitious. No identification with actual persons (living or deceased), places, buildings, and products is intended or should be inferred.

So, the story begins about a year ago when one of my colleagues made a controversial commit. Before they changed the code, it looked something like this.

```java
public class Thing {}

public interface Provider {
    Collection<Thing> getThings();
}

public class Collector {
    public void collect(Collection<Thing> collection, Provider provider) {
        collection.addAll(provider.getThings());
    }
}
```

The change was rather simple. They just replaced `#addAll()` with a `for`-loop over a list.

```java
public class Thing {}

public interface Provider {
    List<Thing> getThings();
}

public class Collector {
    public void collect(List<Thing> collection, Provider provider) {
        List<Thing> things = provider.getThings();
        for (int i = 0; i < things.size(); i++) {
            Thing thing = things.get(i);
            collection.add(thing);
        }
    }
}
```

We wouldn't have noticed if a special build on TeamCity (our build server) didn't alert us. The build is intended to check a new IDE version against existing plugins. It performs static analysis to find possible source- and binary-code incompatibilities. In this particular case, the build complained about `Provider#getThings()` as there was a plugin which used the interface. Indeed, the built plugin should have this kind of line somewhere inside its class files. 

```
INVOKEINTERFACE Provider.getThings ()Ljava/util/Collection;
```

Even though Java doesn't allow to overload methods by a return type, on the JVM level such methods are still different. Thus the plugin becomes broken and throws `NoSuchMethodException` on an attempt to open it in the IDE with the updated code. The worst part is that we can't do this to migrate an API gradually.

```java
public interface Provider {
    @Deprecated
    Collection<Thing> getThings();
    default List<Thing> getThings() {
        return new ArrayList<>(getThings());
    }
}
```

Thus such kind of changes forces authors to recompile and rerelease their plugins promptly. They'll also need to have several branches if they want to support different IDE versions. All of this is an unnecessary complication that's why we try to avoid creating incompatibilities at any cost.

Anyway, let's get back to the story. The commit message contained the following explanation.

>reduce GC - iterate short lists w/o gazillions of temp iterators

The colleague explained that they used YourKit to profile memory. It showed many iterator objects created in `Collector#collect()`. Even though those objects never left eden, the colleague still decided to perform optimization. I thought it was suspicious because no long before that I read two posts by Nitsan Wakart.

* [The Escape of ArrayList.iterator()](http://psy-lob-saw.blogspot.com/2014/12/the-escape-of-arraylistiterator.html)
* [Why (Most) Sampling Java Profilers Are Fucking Terrible](http://psy-lob-saw.blogspot.com/2016/02/why-most-sampling-java-profilers-are.html)

The former article shows that the creation of the iterator objects can be eliminated on a hot path by escape analysis. The later tells that you'll never see it in YourKit. So at that point, it looked like the commit was not only breaking the API but with a certain degree of probability also pointless. We agreed to revert it, and I promised to investigate the problem further.

Our awesome colleagues from the JetBrains Runtime team built a debug version of JDK for me. I ran the IDE using it with a set of necessary flags. By the way, if you think that our tools are slow then you never tried them under JDK with debug symbols 😉 Anyway, I somehow managed to emulate a proper load. Then I opened a log but didn't find there anything related to the eliminated iterators. What I found is that our case differs a little bit from one described in the article. Instead of default `java.util.ArrayList`, we used [`com.intellij.util.SmartList`](https://github.com/JetBrains/intellij-community/blob/master/platform/util/src/com/intellij/util/SmartList.java). The JavaDoc of this class is pretty concise.

>A List which is optimised for the sizes of 0 and 1, in which cases it would not allocate array at all.

Frankly, we use the class a lot. It turns out there are plenty of lists which consist only of a single element. If they manage to make into a cache, then they'll hold 9 empty array cells for nothing if `ArrayList` is used. `SmartList` elegantly solves this problem. So, its first intention is to save on memory. But what about performance?

I reran the IDE but this time asking to [print compilation](https://blog.joda.org/2011/08/printcompilation-jvm-flag.html). The log contained a bunch of messages about `SmartList#iterator` which was first compiled but then `made non entrant`/`made zombie`. Due to this fact, escape analysis didn't even bother to start as it operates on compiled code.

Further investigation was definitely needed. However, my colleague decided not to wait and fixed the code in a way which didn't break the API.

```java
class Thing {}

interface Provider {
    Collection<Thing> getThings();
}

class Collector {
    void collect(Collection<Thing> collection, Provider provider) {
        List<Thing> things = (List<Thing>) provider.getThings();
        for (int i = 0; i < things.size(); i++) {
            Thing thing = things.get(i);
            //noinspection UseBulkOperation manually avoid allocations - SmartList breaks escape analysis
            collection.add(thing);
        }
    }
}
```

OK, fair enough. Nevertheless, I proceeded with the research until an unforeseen sequence of events distracted me for a year. But here I am again with a couple of JMH benchmarks and a set of plots. In the next post, I'll show you what I already managed to find. Stay tuned!

{{< tweet user="art_spb" id="1112269662946029570" >}}
