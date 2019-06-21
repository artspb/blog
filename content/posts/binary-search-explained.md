+++ 
draft = false
date = 2019-01-05T21:37:54+01:00
title = "Binary search explained"
description = "The post gives a short explanation of what binary search is."
images = ["/images/binary-search-explained/500px-Binary_Search_Depiction.svg.png"]
slug = "binary-search-explained" 
tags = ["Algorithms"]
categories = ["Computer science"]
series = ["git-bisect"]
+++

As I mentioned in my [welcome](/posts/welcome/) post, I'm going to write a couple of blogs related to `git bisect`. The crucial part of this command (which is even hidden in its name) is **binary search**. I believe that the majority of those who read this text are pretty well aware of what it is and how it works. If you're among them or prefer to read [Wiki](https://en.wikipedia.org/wiki/Binary_search_algorithm) instead feel free to close this page and return to my blog when I have something more interesting to tell. The rest of you I kindly invite to continue reading.

The primary motivation behind this post is to make sure that I have the same understanding of basic concepts as a reader. The secondary goal is to practice a bit. I have never blogged in English before, and I was a bit worried about it. But then I decided that if I can manage to explain such a simple thing as binary search, then it shouldn't be hard to do the rest. So targets are set, and I can finally start.

### Definition

According to Wikipedia, *[binary search](https://en.wikipedia.org/wiki/Binary_search_algorithm) is a search algorithm that finds the position of a target value within a sorted array*. Simply speaking, if you *a)* have a list of something *b)* sorted according to some rules and *c)* want to find something else in this list, you most probably want to use binary search. What are alternatives you might ask? The naïve approach would be to examine elements of the list one by one until the target element is found or the end of the list is reached. The fancy name of this algorithm is [linear search](https://en.wikipedia.org/wiki/Linear_search).

### Linear search

Imagine we have the following sequence of integers.

`1 3 4 6 7 8 10 13 14 18 19 21 24 37 40 45 71`

What is the index of `7`? I don't know what you're doing now, but I just clicked on each number in the list until reached the sought-for. I did five clicks what gives us `4` as the desired index. We're lucky, and our number is located somewhere close to the beginning. But what if it's the last or even not present at all?

Let `n` be the number of elements in the list.

n|clicks
---|---
8|8
128|128
1024|1024

Doing <abbr title="1000">1k</abbr> clicks may take a while. That's where binary search comes to the rescue.

### Binary search

The binary search algorithm exploits the property *b)* from the above namely the fact that the list is sorted. If we compare the target element to an arbitrary element from the list, we'll be able to make the following conclusions.

- the target element is to the left if it's lesser
- the target element is to the right if it's greater
- the target element is found if it's equal

This is all thanks to the ordered nature of the list. Now we only need.

1. Take the middle element.
2. Compare it to the target one.
3. Take the appropriate half.
4. Repeat until found or nothing left.

This is it. Let's apply it to our sequence.

`1 3 4 6 7 8 10 13 14 18 19 21 24 37 40 45 71`

range|middle|value|comparison|action
---|---|---|---|---
[0,16] | 17 / 2 ~ 9 | 9<sup>th</sup> element is 14 | 7 is lesser | go left
[0,7] | 8 / 2 = 4 | 4<sup>th</sup> element is 6 | 7 is greater | go right
[4,7] | 4 / 2 = 2 | (4+2)<sup>th</sup> element is 8 | 7 is lesser | go left
[4,4] | 1 / 2 ~ 1 | (4+1)<sup>th</sup> element is 7 | 7 is equal | found

It's important to remember that the index of the 9<sup>th</sup> element is `8`. The rest should be trivial. Below the same actions are present in a picture.

{{< figure src="/images/binary-search-explained/Binary_Search_Depiction.svg" alt="Binary Search Depiction" caption="AlwaysAngry [[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0)], [from Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Binary_Search_Depiction.svg)" >}}

We "clicked" four times, it's a bit better than five. But how binary search performs on a different number of elements?

n|clicks
---|---
8|[3](https://www.google.com/search?q=log2+8)
128|[7](https://www.google.com/search?q=log2+128)
1024|[10](https://www.google.com/search?q=log2+1024)

We've got ten comparisons instead of a thousand. Sold! Or? Though the algorithm is straightforward and efficient, there are still some pitfalls, so even [Java didn't make it](https://ai.googleblog.com/2006/06/extra-extra-read-all-about-it-nearly.html) at the first attempt. Fortunately, we don't have to write yet another implementation and can use an existing one from git. But this is the topic of the next post, stay tuned.

{{< tweet 1081657403077283841 >}}

**Update.** Roman Elizarov recently wrote an article on how to properly implement binary search. Check it out, it has a couple of interesting plot twists.

{{< tweet 1140398641430982656 >}}
