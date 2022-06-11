+++ 
draft = false
date = 2020-04-14T10:02:50+02:00
title = "Using external SSD as macOS Fusion Drive"
description = "The post describes how to configure macOS Fusion Drive using an external SSD."
slug = "using-external-ssd-as-macos-fusion-drive" 
tags = ["macOS", "Fusion Drive", "APFS", "SSD"]
categories = ["macOS"]
+++

I have an iMac. It's a rather old model (late 2013) that I bought 5 years ago. I've started using it less when I got a work MacBook. Still, it served well for Internet surfing and movies. But over time, it was getting slower and slower. The only problem was the performance of its 1TB HDD. It was huge but terribly sluggish. To make things faster, I decided to go with an external SSD and use it as [Fusion Drive](https://support.apple.com/en-us/HT202574). It turned out I did it wrong 😃 So, this post is a reminder for me on how to do it right.

### Core Storage vs. APFS

There's a lot of information on how to work with Fusion Drive. The biggest part of it describes steps that include creating a [Core Storage](https://en.wikipedia.org/wiki/Core_Storage) volume, even macOS' [documentation](https://support.apple.com/en-us/HT207584). The problem is that it doesn't make any sense to use Core Storage with Mojave and later versions. [APFS](https://en.wikipedia.org/wiki/Apple_File_System) is a modern replacement. It has many advantages, but there's the killer feature: APFS is the only way to make it work with an external SSD. Thus, dear future me, remember: APFS FTW.

### Fusing drives

The thing that may sound obvious when you know it, but it's so easy to forget about is [EFI](https://en.wikipedia.org/wiki/EFI_system_partition). It's self-evident that one needs to have a partition to boot from. It's less evident that both disks that form Fusion should have it. In any case, before proceeding with APFS, one needs to ensure that EFI is there. Otherwise, be ready to get the following error during the installation process.

>Could not create a preboot volume for APFS install.

Now we can create a new container over two partitions. Using disks here (`disk1 disk0`) would erase EFI partitions, so let's avoid it.

```
diskutil apfs createContainer disk1s2 disk0s2
```

Note the following: the order is important. I repeat: **THE ORDER IS IMPORTANT**. The mistake I made making Fusion Drive for the first time is to put the HDD (`disk0s2`) first. APFS literally ignores the SSD in this case, which makes no sense if the goal is to speed things up. That's why I'm now writing this article while reinstalling macOS.


```
diskutil apfs addVolume disk2 apfs Machintosh\ HD
```

The above command creates a new volume using the whole available space. The result can be used to install an OS on it.

### Checking things

There's no direct way to check that everything works as expected. Instead, we can [observe](https://apple.stackexchange.com/questions/88735/how-to-determine-which-files-are-on-ssd-on-fusion-drive) what's going on with the system.

```
iostat -d disk1 disk0 1
```

This command prints a speed of disk access. Moving files around and looking at stats helps to understand which disk is currently in use.

### Useful commands

```
diskutil list
diskutil unmountDisk disk0
diskutil apfs list
diskutil apfs deleteContainer disk2
```

Additionally, one can use [Option-⌘-R](https://support.apple.com/en-us/HT204904) to upgrade to the latest OS version form recovery. Holding Option allows choosing a boot disk.

### Conclusion

I've spent a lovely weekend reinstalling macOS again and again in an attempt to understand what's going on. As usual, the answer is straight and simple. I hope writing it down will help future me (and, perhaps, you) from loosing too much time on this task.

{{< tweet user="art_spb" id="1249972041656291328" >}}