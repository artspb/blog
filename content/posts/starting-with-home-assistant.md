+++
date = 2023-09-13T10:01:28+02:00
title = "Starting with Home Assistant"
description = "An introductory blog post about the beginning of my journey with Home Assistant."
images = ["/images/starting-with-home-assistant/home-assistant-climate.png"]
slug = "starting-with-home-assistant"
tags = ["Home Assistant", "Homematic IP", "Velux", "Somfy"]
categories = ["Home Assistant"]
series = ["Home Automation"]
+++

Last summer, we noticed that if we forget to close the blinders, our house gets hot pretty quickly. The temperature in the attic can easily reach 27 °C. The building is new and energy efficient. In winter, it means that it loses its temperature slowly, which is good. In summer, it does the same, which isn't that good as we don't have an active cooler, e.g., an AC. Fortunately, we have electrical blinds, so the obvious solution was to automate them.

As a New Year's present, I bought myself a set of [blind actuators by Homematic](https://homematic-ip.com/en/product/blind-actuator-flush-mount). They have a decent Android app, so I was expecting it to be the end of the home automation story. Unfortunately, even though they offer a wide range of products, they have nothing that'd automate our attic window blinds out of the box. So, soon enough, I ended up with a number of apps that did the same job in different places: Homematic, Velux, and Somfy. That's when I learned about Home Assistant.

![Homematic Blind Actuator](/images/starting-with-home-assistant/homematic-blind-actuator.png)

[Home Assistant](https://www.home-assistant.io) is an OSS home automation hub. Unlike other solutions, it's not bound to a specific protocol but rather provides several integrations. Finally, I was able to not only control the whole zoo of blinders from one place but also automate them all together: Close southern ones when it's sunny, bring light to the child's room at 6:45, seal the house on vacation, etc. This was super easy to do with Home Assistant. That was the moment when I realized that I had a few more things I could integrate and a couple more automation ideas I could implement.

![Home Assistant Climate](/images/starting-with-home-assistant/home-assistant-climate.png)

There's nothing fancy about moving blinders up and down with Home Assistant. I wouldn't bother writing a blog about it, as there's enough content on the matter. What I personally find fascinating and would like to share with you is how one can improve efficiency with just a few simple scripts. Charging a car when electricity is so cheap that a provider pays you back? Running ventilation only when CO2 is high? Heating water right before it's being used? It brings me a lot of joy to implement such ideas. That's why I'm eager to tell everyone about it. This is what blogs are for, right?

In the upcoming posts, I'll tell more about my setup, integrations, and automations I have, as well as the challenges I face along the way. I'll try keeping posts dedicated to a single topic and short. I might as well promise to publish once a week, but who keeps such promises anyway? Nevertheless, feel free to comment with your ideas for the next post. And I'd love to hear your stories, too!

{{< tweet user="art_spb" id="1701870015891316976" >}}
