---
path: "/migrating-to-event-driven"
title: "Migrating to an Event-Driven System"
date: "2019-09-05"
href: "https://objectpartners.com/2019/09/05/migrating-to-an-event-driven-system/"
summary: "The purpose of this post is to walk through an approach to break apart and restructure existing systems to start reaping the benefits of thinking in events."
---
Unless you have been granted the golden ticket to greenfield development, there isn’t a hard and fast approach to migrating to an Event-Driven System. However, there are designs, technologies, best practices and approaches that will catalyze your efforts of modernizing an architecture. By moving to an event-driven system, you expose opportunities of real-time insights and analytics that were likely much more challenging to obtain previously.

The intent of this post is not to convince you of making this journey, as that is well detailed (ex. Why Event-First Thinking Changes Everything). The purpose of this post is to walk through an approach to break apart and restructure existing systems to start reaping the benefits of thinking in events.

If you’re interested in more background on the topic, I recommend reading the FREE O’Reilly Book: Designing Event Driven Systems. 

Original Architecture
The following diagram illustrates a simplified approach to gathering and accessing data.


An architecture to gather and analyze data.

Let’s look at the key components:

Data comes to the legacy application via user actions. This could be interactions with a mobile/web app, IoT device, you name it.
Downstream consumer(s) tap into the data through an API.
The legacy app either pushes data downstream or a Change Data Capture (CDC) tool is configured to poll for data. This data ends up in a larger “data lake” (e.g. S3, HDFS, Redshift).
There are likely many applications and data sources following this model that all end up in the lake.
Users tap into this for BI analytics and additional processing.
Machine Learning (ML) is done on this dataset to ensure access to the full picture.
Reality
The original architecture shown above seems like a reasonable approach, and it is. The problem is that usually there are 10x the lines and as data continues to drive business value, more teams want it. You can’t predict every statistical derivation of the data and eventually, boundaries start to dissolve. Enter scaling, consistency, access, and a plethora of other bottlenecks and pain points. The diagram below might feel a little more like what you’re working with.


A more realistic architecture.

Approach
The approach laid out in the remainder of this post is meant to get you thinking about an iterative strategy to accomplishing your goal of introducing an event-driven architecture.

Select the messaging technology
Build a common intake layer
Redirect incoming data to the intake layer
Keep the lights on
Redirect downstream applications to the messaging layer
Sunset unused components
Eventing Nervous System
The messaging layer becomes the central point of contact for the system. As you evaluate the options for creating the “nervous system” of your architecture, you will come across Apache Kafka. The remainder of this post shows Kafka as the messaging layer but other technologies could be used in its place. If this is your first exposure to Kafka, you may be wondering why everyone is talking about Kafka?

TL;DR –

Durability, Reliability, Scalability
Guaranteed Message Ordering
Stream Processing
Exactly Once Processing
Open Source
Multi-purpose (Messaging, Storage, Stream Processing)
Confluent has also published a great post covering the use of Apache Kafka for Service Architectures.

Event-Driven Architecture
Before going further into the approach, it may be helpful to have a better picture of where we’re headed. The below diagram illustrates a data platform that centralizes data intake and access while providing downstream systems near-real-time access. All data flows through the intake and messaging layers before any downstream system receives it. This leads to a consolidated data strategy and higher overall data quality. This will be covered more in the next section.


An event-driven architecture built around Kafka.

Intake Layer
The intake layer abstraction in the above diagram likely includes a combination of RESTful APIs and proxies. Being that Kafka is what we’re using in this example, Kafka Connect workers may also be utilized. As a whole, the intake layer receives data and ensures its placement on the appropriate topic. This layer can also inject common metadata such as an ingestion timestamp and trace ID to ensure better observability of data movement. Light cleansing might be done here but any heavier transformations and validations should be done once the data has already landed on a topic.

Creating this common intake layer requires additional work upfront but leads to higher data quality and governance. It will also ease the onboarding pains of each new data source and limit the fragmentation of your overall technology strategy.

Redirect Data
The intake layer is in place, now it’s time to use it! If you are completely redirecting data to Kafka you also need to make sure you’ve set up consumers or connectors to keep data parity in the legacy application (the next section covers this). If you keep data flowing to the legacy system as well as Kafka, you will have a harder time down the road cutting over and avoiding duplicate or missing data but it’s still doable. Kafka is very flexible in terms of starting at a specific point in time or replaying events if you make a mistake on the first attempt.

Because of the benefits mentioned in the previous section, an effort should be made to get all data flowing through the messaging layer. Notice in the diagram below that the apps that previously dumped directly to the data lake now go through the messaging system before making their way to the lake. The additional stop will likely only add milliseconds to the delivery time and open up a variety of opportunities now that the data is in flight.


Redirect data to the messaging layer.

Keep The Lights On
An easy way to continue moving data downstream to the legacy application, as well as the data lake, is Kafka Connect. This is an open-source component of the ecosystem that specializes in integrating Kafka with external systems both by pulling data from them as well as sinking data to them.

If the legacy application has an API exposed, you could explore the HTTP Connector which forwards data from a Kafka topic to a RESTful API. If there isn’t too much business logic baked into the application you could even send it directly to the database via something like the JDBC Connector. If another datastore is being used, there may be a connector to fit your needs.

To keep data flowing to the data lake, there are connectors for a variety of storage options (ex. HDFS, S3, GCS).

A full list of connectors can be found on Confluent’s Connector Hub.

Tap Into The Nervous System
There’s a chance that you skip the previous section and try to cutover data and applications all in one shot. This is an option, but like all big bang approaches it comes with the added risk of failures. Just like committing frequently on a codebase, taking smaller steps towards the end goal allows for easier rollbacks when things go awry.

Furthermore, you may actually be happy with the dual state that you’re in at this point. The application might have too much business logic to warrant a rewrite. You’re still in a better place than you were with consumers of the legacy app getting their data through Kafka. But if no one relies on the legacy app anymore, what’s the value? As you develop new applications against the messaging layer, you’ll get an itch to propel that legacy app into the future as well.

If you’re planning to roll your own Kafka consumers, comprehensive docs and examples are all over the place. The Kafka client API has been developed for many programming languages which enables you to pick the language that best suits your team. Frameworks like Spring Kafka and Micronaut Kafka have been developed to help developers move faster but like any abstraction layer, take time to understand what’s hiding under the covers. If you’re looking to level up your game and explore Kafka Streams, there are some things to know before diving in but once again there is strong support for the framework.

Sunset the Legacy Application
By this point,  the legacy application might be running on a slimmed-down instance because nobody relies on it. This is the moment we’ve been waiting for… lights off! We have arrived at an architecture a little closer to the one shown below. Once again note that the other applications and databases that were feeding into the data lake directly now start in Kafka before making their way to the lake. Having this data in flight as well as forwarded to the lake expands access to more teams which opens up opportunities across the board. The lake’s focus is analytics, business intelligence, and ML while the data in flight can now be used for real-time decisions (as well as analytics).


An event-driven architecture.

Conclusion
Data is the foundation of nearly every business and that will only become more pronounced as data collection continues to grow. In this post, we took a traditional architecture and walked through an approach to moving towards an event-driven architecture. Why? Easier, faster, and more reliable access to data while also gaining many of the other benefits messaging technologies can provide.

Feel free to reach out with your questions and comments. Object Partners has developed a talented team of engineers that can help you with your move to an event-driven architecture.