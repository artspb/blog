+++ 
date = 2023-09-18T09:13:05+02:00
title = "Home Assistant setup"
description = "The post describes my Home Assistant setup, and a journey to it."
images = []
slug = "home-assistant-setup"
tags = ["Home Assistant", "Homematic IP", "DigitalOcean", "Ubiquiti UDM-Pro"]
categories = ["Home Assistant"]
series = ["Home Automation"]
+++

In [the previous post](/posts/starting-with-home-assistant), I scratched the surface of how my smart home looks. Now, I'd like to go deeper into details. In this post, I'll tell about my Home Assistant setup and the journey to it. It shouldn't be long, but you can always jump right to the [conclusion](#conclusion).

### Home Assistant

Let's start with a definition I took from [the official website](https://www.home-assistant.io):

> Open source home automation that puts local control and privacy first. Powered by a worldwide community of tinkerers and DIY enthusiasts. Perfect to run on a Raspberry Pi or a local server.

Basically, Home Assistant (HASS for short) is an application written in Python and a community around it that builds awesome integrations. I'm, of course, oversimplifying, but these are probably the most important parts for me. As with any application, it has to be run somewhere. Surprisingly, there are [quite a few ways](https://www.home-assistant.io/installation/#compare-installation-methods) to do it:

1. Core
2. Container
3. Supervised
4. OS

#1 is basically a pure Python app. Even though one can use `virtualenv`, I decided that a container provides better isolation. As I didn't have a spare machine to wipe and dedicate to HASS, #3 and #4 were ruled out. So, I proceeded with a container.

I have a fanless mini PC for ad-hoc tasks with Intel Celeron N4020, 4G of RAM, and Ubuntu. Back then, it used to run a print server and [integrate scales with Google Fit](https://github.com/artspb/weight-interceptor/tree/master/http). The latter deserves its own blog post on how I tried to intercept a 433 MHz signal with Arduino and TinyGo but failed. Anyway, the machine was a perfect fit for the task.

### Docker

It was trivial to download and launch a Docker container. Kudos to everyone who works on making this process so simple! Most of my devices were supported out of the box with default integrations such as [HommematicIP Cloud](https://www.home-assistant.io/integrations/homematicip_cloud) and [Home Connect](https://www.home-assistant.io/integrations/home_connect). The rest was covered by [HACS](https://hacs.xyz), e.g., [Volkswagen We Connect](https://github.com/robinostlund/homeassistant-volkswagencarnet).

It made me happy for a while until I realized that my water softener by Grünbeck is not that easy to use with HASS. There's neither a default integration nor one for HACS. The best one can do is to [bridge an ioBroker adapter via MQTT](https://community.home-assistant.io/t/new-integration-grunbeck-softliq/157478/39). While the procedure isn't that hard, there was a deal-breaker: it required HASS add-ons that, in turn, require a supervisor (aforementioned options #3 and #4). It was time to upgrade my installation.

### Supervisor

Initially, I attempted to install a supervisor on my host system. Even though there is a deb package, it turned out that only Debian is supported. I didn't really want to switch from Ubuntu. For the same reason, I was not ready to install Home Assistant OS on the host machine directly. It left me with two options: buy a new device, e.g., Raspberry Pi, or use virtualization. Fortunately, there are ready-to-use OS images, so the only thing that was missing for the latter option to work was a hypervisor.

Remember I mentioned that the PC used to run a print server? As my printer is located far away from the nearest LAN port, it was convenient to connect it to the server's USB and run CUPS there. The server was obviously using Wi-Fi. So far, so good. The problem arose when I tried to create a network bridge for a hypervisor. Apparently, it's not that trivial to do with a wireless network. After several attempts, I gave up and bought a hardware print server with Wi-Fi support. On the bright side, it's much more stable than HPLIP, which I learned to hate.

The print server allowed me to move the machine elsewhere, namely, next to a LAN port. With the server connected to the wired network, configuring a bridge and making KVM use it wasn't hard. Deploying an image with HASS OS and restoring Home Assistant from a backup proved to be as easy as apple pie. Finally, I was able to install add-ons! As a bonus, HASS got its own local domain name: [homeassistant.local](http://homeassistant.local:8123).[^1]

[^1]: The URL shouldn't work on your machine unless you run your own instance of Home Assistant.

### Remote access

The last thing that probably relates to the setup is remote access. I used [Home Assistant Cloud](https://www.home-assistant.io/cloud/) for a while. What bothered me, though, is that there was no way to get a nicely looking URL that could accompany an Android app.[^2] Also, as I have my own domain name, it felt natural to reuse it. As I didn't want to deal with dynamic DNS, I went with a VPN tunnel from my local network to the Digital Ocean VM that runs this blog. Ubiquiti UDM-Pro made VPN configuration a smooth experience.

[^2]: Funnily enough, while I was writing this post, Nabu Casa (the company behind Home Assistant) announced [support for custom domains](https://www.nabucasa.com/config/remote/#using-a-custom-domain).

### Conclusion

Currently, I run Home Assistant OS in KVM on a dedicated hardware server that's located in my basement. It allows me to utilize all the HASS functionality, such as add-ons. The instance is looking into the Internet via the same server that runs this blog, thanks to the VPN tunnel from my place. This setup fully satisfies my needs, so I don't plan to modify it any time soon. What might make me change my mind, though, is the necessity to connect radio receivers to HASS, e.g., to establish a Zigbee network. The server's location might be problematic for such a scenario. But this is yet to learn for me, so stay tuned for a blog on the topic.

That's it for today. I hope the post was short enough for you to read it to the end. Feel free to share your setup and opinion on mine in the comments. I feel that if someone with experience looks at what I have, they'll find a couple of places that could be done better.

P.S. I'm deciding between blinds and ventilation automation for the next post. Eventually, I plan to write about both, but which topic would you like to discover next? Please share with me!
