---
path: "/spotless-code-resolution"
title: "New Year’s Resolution: Spotless Code"
date: "2020-01-01"
href: "https://objectpartners.com/2020/01/01/new-years-resolution-spotless-code/"
summary: "Set engineering resolutions for your team and stick to them. Here are a few to get you started."
---
As your team enters the new year fresh off of a “holiday reboot”, broaden your next retrospective to look at the previous year as a whole.

What went well? Where did things fall short? What will you change in the upcoming year?

Now is the time to set a New Year’s resolution and stick to it.


Happy New Year!

New Year’s Resolutions
Here are 10 resolutions to get the ball rolling for your team’s discussion.

Stop sweeping tech debt under the rug.
If you’re using Sonar or another static analysis tool, pick a few areas of debt and start chipping away. Set rules on introducing tech debt. Anything helps, but you have to start working towards reducing the overall debt eventually.
Improve and expand documentation.
Find a medium that works and start creating content. Repos should have a readme and contrib file to get developers running and contributing. Blogs are a nice accompaniment to big tech decisions. Recorded demos are an easy way to explain complex features. Diagrams are much more reusable than a whiteboard drawing.
Increase community engagement.
Start with giving scheduled tech talks to your internal team(s). Branch out into the meetup and conference space when you are ready.
Pick a new technology and take a Udemy course on it. Management, support your team in this goal.
Find a mentor and meet regularly.
Break down silos and work on a project that you haven’t touched before. Most of the other resolutions will help meet this one!
Contribute to open source.
Meet monthly for a team lunch.
Increase existing unit test coverage by 30% (keep the goal achievable) and enforce coverage on all new code.
Keep your code spotless. Introduce code linting to all areas of the stack.
 

Not sure where to start? Standardizing and cleaning up your codebases can be a good launching point for many of the other goals. With a few configurations, this is a low risk, low effort task that any team member can pick up.

Spotless Code
If you’ve worked in the Javascript world, you’ve probably already used code linters. ESLint and Prettier are two great options. If you’ve been focused on the backend, there is a chance your project hasn’t introduced a linter yet.

A linter parses a codebase and looks for mistakes and stylistic inconsistencies based on a configurable set of rules. It then either alerts you of the mistakes or fixes them automatically. Rules include things like trailing whitespace, required file headers, unused imports, tab/space consistency, if/else structure, max line length, and many more. Outside of simplifying code reviews by removing all nit comments, the linter becomes an important part of the onboarding process. Rather than you giving an overview of the style guide, you can now allow the linter to do its job and teach newcomers the ropes.

This sounds great, right? Let’s look quickly at applying this to a backend service.

Spotless Microservices
With microservices on the rise (or have they fully risen?), it is becoming much more important to apply coding standards to backend services. There are a variety of linters available, but I have found Spotless to be a good choice for JVM applications. To make things simpler, you can point it to the Google Java Style Guide as a starting point rather than creating your own style guide from scratch. With a style guide in place, you can then collectively customize any rules that your team disagrees with.

Here is an example of plugging Spotless into your Gradle build (full documentation).

plugins {
    id 'java'
    id 'com.diffplug.gradle.spotless' version '3.26.1'
    
    // other plugins
}

repositories { .. }
dependencies { .. }

spotless {
    java {
        // Enforce Google's Java Style Guide
        googleJavaFormat()
    }
}

// automatically format code to comply with spotlessJava
build.dependsOn 'spotlessApply'
view rawbuild.gradle hosted with ❤ by GitHub
The great thing about this New Years Resolution over others is that configuring the linter is a one time thing. You will instantly see the benefits and continue to see them for years to come.

Cheers to the New Year!
It doesn’t matter if you pick any of the above resolutions, each team has its priorities and goals. What does matter is that you start to think about how your team can go beyond the regular expectations and perform at an even higher level than the previous year.

Our goal as engineers should be to lower the barrier of entry to our primary codebases so that new and existing team members can onboard quicker and produce high-quality features efficiently. This also improves the chances of working on new things since you won’t be the only engineer capable of tackling the tough problems in a single repository.

Cheers, and good luck!

