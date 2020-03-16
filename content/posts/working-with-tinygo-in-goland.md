+++ 
draft = false
date = 2020-03-12T20:36:00+01:00
title = "Working with TinyGo in GoLand"
description = "The post shows how to work with TinyGo in GoLand. It suits everyone who loves microcontrollers, or IDEs, or both."
images = ["/images/working-with-tinygo-in-goland/blinky.png"]
slug = "working-with-tinygo-in-goland" 
tags = ["GoLand", "Go", "TinyGo"]
categories = ["Go", "TinyGo", "Tools", "Tutorials"]
series = ["GoLand", "TinyGo"]
+++

I believe that you're here because you already know what [GoLand](https://www.jetbrains.com/go/) and [TinyGo](https://tinygo.org/) are. In this blog post, I'll show how to work with the latter in the former. Ready? Let's (Tiny)Go!

1. Install TinyGo with the help of its [Getting Started](https://tinygo.org/getting-started/) page. On macOS, it's as easy as two terminal commands.

```
brew tap tinygo-org/tools
brew install tinygo
```

That's it if you're working with an ARM-based microcontroller. For AVR one like Arduino Uno, three more commands are needed.

```
brew tap osx-cross/avr
brew install avr-gcc
brew install avrdude
```

2. Open GoLand and start creating a new project. It's better to locate it outside of your regular `GOPATH` to avoid unnecessary dependencies.

![New Project](/images/working-with-tinygo-in-goland/new-project.png)

Please note that _Index entire GOPATH_ from the previous picture should be unchecked for now; otherwise, GoLand might perform some unnecessary indexing. We'll get back to this setting later.

At the moment of writing, the latest version of TinyGo (0.12.0) doesn't support the latest version of Go (1.14). Thus let's use Go 1.13.8. Click on the plus button and choose _Download..._ if you don't yet have it installed.

![Download Go SDK](/images/working-with-tinygo-in-goland/download-go-sdk.png)

3. Now open _Preferences | Go | GOPATH_ and point _Project GOPATH_ to the TinyGo installation. On macOS, it's located under `/usr/local/Cellar/tinygo/0.12.0`. You might need the help of [Command+Shift+Period](https://osxdaily.com/2011/03/01/show-hidden-files-in-mac-os-x-dialog-boxes-with-commandshiftperiod/) to find this path using the native file chooser. Additionally, add the project directory to the list. It allows using packages in your project.

![GOPATH](/images/working-with-tinygo-in-goland/gopath.png)

Also, this is a good time to check _Index entire GOPATH_ back; otherwise, GoLand won't find TinyGo SDK files. 

4. Let's get back to the IDE for a second by pressing _OK_. GoLand starts building indices. While it shouldn't take long as now `GOPATH` consists only of a few files, there's no need to wait for it to finish. Open _View | Tool Windows | Terminal_. Run `tinygo info -target arduino` there. Don't forget to replace `arduino` with a target that's suitable for you.

![Terminal](/images/working-with-tinygo-in-goland/terminal.png)

Remember `GOOS` and `GOARCH`, and copy `build tags` to a clipboard. We'll use these parameters in the next step.

5. Open _Preferences | Go | Build Tags & Vendoring_. I think it should be easy to figure out how to use parameters from the previous step.

![Build Tags](/images/working-with-tinygo-in-goland/build-tags.png)

Don't forget to close the dialog with the _OK_ button to save the settings.

6. That's it for the configuration. Let's now check how GoLand works. Copy `/src/examples/blinky1/blinky1.go` to the `src` directory of the newly created project. The trick with `src` makes the project looks like `GOPATH` so you can use packages inside.

![Blinky](/images/working-with-tinygo-in-goland/blinky.png)

The code should be green; you should be able to navigate from any reference to its proper declaration. For instance, by Command+Clicking `LED`, you should get to `board_arduino.go` where it's declared. Well, at least if you're using Arduino 🙂

![board_arduino.go](/images/working-with-tinygo-in-goland/board-arduino.png)

7. While we could finish here, I'd still like to show you one more thing that I find useful. Proceed to _Preferences | Plugins | Marketplace_ and install the _Makefile support_ plugin. If you're on GoLand 2020.1, you don't even need to restart the IDE.

![Makefile support](/images/working-with-tinygo-in-goland/makefile-support.png)

8. Create `Makefile` with the following content. Don't forget to specify the right target and port.

```
flash:
	tinygo flash -target=arduino blinky1.go
```

![Makefile](/images/working-with-tinygo-in-goland/makefile.png)

You can now run this command right from the IDE using the little green triangle in the gutter. If your system's `GOROOT` points to the correct version, it should just work. Otherwise, a bit of a configuration is necessary. 

9. Open _Run | Edit Configurations..._ Select _flash_ and add `GOROOT=/Users/artspb/go/go1.13.8;GOPATH=/Users/artspb/GolandProjects/working-with-tinygo` to _Environment variables_.

![Run Configurations](/images/working-with-tinygo-in-goland/run-configurations.png)

10. When you rerun _flash_, TinyGo should build a program and upload it to the board. As a result, its LED should start blinking. Of course, if it has one 🙂 I'm too lazy to record a video, but I hope you believe that my Arduino Uno copes well with this task.

![flash](/images/working-with-tinygo-in-goland/flash.png) 

### Troubleshooting

* If something doesn't work, check that the integration is disabled under _Preferences | Go | Go Modules_. As for now, TinyGo doesn't work well with `go list`. 

I hope this tutorial was useful for you. As always, I appreciate any feedback. Please share it here or anywhere where you can find me.

**Update.** You can find [the example project](https://github.com/artspb/working-with-tinygo) that we've created on GitHub.

{{< tweet 1238190068101263362 >}}
